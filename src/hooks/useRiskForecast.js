import { useMemo } from "react";

import { useMineContext } from "../context/MineDataContext";

import {
  DEFAULT_THRESHOLDS,
  SAFETY_BANDS,
  getBandFromScore,
} from "../utils/riskEngine";

import {
  FORECAST_HORIZONS_MIN,
  linearRegression,
  projectSeries,
  estimateMinutesToThreshold,
  computeThresholdBand,
} from "../utils/riskForecast";

import { TICK_INTERVAL_MS } from "../utils/simulationScenario";

const BAND_RANK = {
  [SAFETY_BANDS.SAFE]: 0,
  [SAFETY_BANDS.MODERATE]: 1,
  [SAFETY_BANDS.HIGH]: 2,
  [SAFETY_BANDS.CRITICAL]: 3,
};

function bandAtEta(predicted, etaMinutes) {
  const covering = predicted.find(
    (point) => point.minutesAhead >= etaMinutes
  );

  return covering ? covering.band : predicted[predicted.length - 1].band;
}

function clamp0to10(value) {
  return Math.min(10, Math.max(0, value));
}

export default function useRiskForecast() {
  const { workers, zones, history, riskHistory } = useMineContext();

  return useMemo(() => {
    /*
    |------------------------------------------------------------------
    | WORKER FORECASTS
    |------------------------------------------------------------------
    */

    const workerForecasts = workers.map((worker) => {
      const workerHistory = history[worker.id] || [];

      const gasProjection = projectSeries(workerHistory, { key: "gas" });

      const temperatureProjection = projectSeries(workerHistory, {
        key: "temperature",
      });

      const predicted = FORECAST_HORIZONS_MIN.map((minutesAhead, index) => {
        const predictedGas = gasProjection.projections[index]?.value;

        const predictedTemperature =
          temperatureProjection.projections[index]?.value;

        const { safetyScore, band } = computeThresholdBand(
          predictedGas,
          predictedTemperature,
          DEFAULT_THRESHOLDS
        );

        return { minutesAhead, score: safetyScore, band };
      });

      const timestamped = workerHistory.filter(
        (entry) => typeof entry?.timestamp === "number"
      );

      const fromTimestamp =
        timestamped.length > 0
          ? timestamped[timestamped.length - 1].timestamp
          : Date.now();

      const gasEta = estimateMinutesToThreshold(
        { slope: gasProjection.slope, intercept: gasProjection.intercept ?? 0 },
        DEFAULT_THRESHOLDS.sensors.gas,
        fromTimestamp
      );

      const temperatureEta = estimateMinutesToThreshold(
        {
          slope: temperatureProjection.slope,
          intercept: temperatureProjection.intercept ?? 0,
        },
        DEFAULT_THRESHOLDS.sensors.temperature,
        fromTimestamp
      );

      const candidates = [
        { value: gasEta, factor: "gas" },
        { value: temperatureEta, factor: "temperature" },
      ].filter((candidate) => candidate.value !== null);

      let etaMinutes = null;
      let drivingFactor = null;

      if (candidates.length > 0) {
        const soonest = candidates.reduce((min, candidate) =>
          candidate.value < min.value ? candidate : min
        );

        etaMinutes = soonest.value;
        drivingFactor = soonest.factor;
      }

      let reason = "No concerning trend detected";

      if (drivingFactor === "gas") {
        reason = `${worker.name}'s gas is trending toward ${DEFAULT_THRESHOLDS.sensors.gas} ppm`;
      } else if (drivingFactor === "temperature") {
        reason = `${worker.name}'s temperature is trending toward ${DEFAULT_THRESHOLDS.sensors.temperature}°C`;
      }

      return {
        workerId: worker.id,
        name: worker.name,
        zone: worker.zone,
        currentBand: worker.band,
        currentScore: worker.safetyScore,
        predicted,
        etaMinutes,
        drivingFactor,
        reason,
      };
    });

    const sortedWorkerForecasts = [...workerForecasts].sort((a, b) => {
      if (a.etaMinutes !== null && b.etaMinutes !== null) {
        return a.etaMinutes - b.etaMinutes;
      }

      if (a.etaMinutes !== null) return -1;
      if (b.etaMinutes !== null) return 1;

      return b.currentScore - a.currentScore;
    });

    /*
    |------------------------------------------------------------------
    | ZONE FORECASTS
    |------------------------------------------------------------------
    */

    const zoneForecasts = zones.map((zone) => {
      const memberForecasts = sortedWorkerForecasts.filter(
        (workerForecast) => workerForecast.zone === zone.id
      );

      const predicted = FORECAST_HORIZONS_MIN.map((minutesAhead, index) => {
        if (memberForecasts.length === 0) {
          return {
            minutesAhead,
            score: zone.safetyScore,
            band: zone.band,
          };
        }

        const score =
          memberForecasts.reduce(
            (total, workerForecast) =>
              total + workerForecast.predicted[index].score,
            0
          ) / memberForecasts.length;

        return { minutesAhead, score, band: getBandFromScore(score) };
      });

      const farthest = predicted[predicted.length - 1];

      let trendDirection = "stable";

      if (farthest.score - zone.safetyScore > 2) {
        trendDirection = "rising";
      } else if (zone.safetyScore - farthest.score > 2) {
        trendDirection = "falling";
      }

      let earliestBreach = null;

      for (const point of predicted) {
        if (BAND_RANK[point.band] > BAND_RANK[zone.band]) {
          earliestBreach = { band: point.band, etaMinutes: point.minutesAhead };
          break;
        }
      }

      return {
        zoneId: zone.id,
        name: zone.name,
        currentScore: zone.safetyScore,
        currentBand: zone.band,
        predicted,
        trendDirection,
        earliestBreach,
      };
    });

    /*
    |------------------------------------------------------------------
    | MINE-WIDE FORECAST
    |------------------------------------------------------------------
    */

    const scores = riskHistory.map((point) => point.score);
    const indexes = scores.map((_, index) => index);

    const { slope: mineSlope, intercept: mineIntercept } = linearRegression(
      indexes,
      scores
    );

    const lastIndex = indexes.length - 1;

    const residualStdDev = Math.sqrt(
      scores.reduce((sum, score, index) => {
        const predicted = mineSlope * index + mineIntercept;

        return sum + (score - predicted) * (score - predicted);
      }, 0) / (scores.length || 1)
    );

    const forecast = FORECAST_HORIZONS_MIN.map((minutesAhead, position) => {
      const stepsAhead = Math.max(
        1,
        Math.round((minutesAhead * 60000) / TICK_INTERVAL_MS)
      );

      const futureIndex = lastIndex + stepsAhead;

      const value = clamp0to10(mineSlope * futureIndex + mineIntercept);

      const spread = residualStdDev * (position + 1);

      return {
        time: `+${minutesAhead}m`,
        value,
        upper: clamp0to10(value + spread),
        lower: clamp0to10(value - spread),
      };
    });

    const lastActualScore = scores.length > 0 ? scores[scores.length - 1] : 0;

    const farthestForecastValue =
      forecast.length > 0
        ? forecast[forecast.length - 1].value
        : lastActualScore;

    let mineTrendDirection = "stable";

    if (farthestForecastValue - lastActualScore > 0.3) {
      mineTrendDirection = "rising";
    } else if (lastActualScore - farthestForecastValue > 0.3) {
      mineTrendDirection = "falling";
    }

    const predictedBandIn30 = getBandFromScore(farthestForecastValue * 10);

    const mineForecast = {
      history: riskHistory,
      forecast,
      trendDirection: mineTrendDirection,
      predictedBandIn30,
    };

    /*
    |------------------------------------------------------------------
    | EARLY WARNINGS
    |------------------------------------------------------------------
    */

    const workerWarnings = sortedWorkerForecasts
      .filter(
        (workerForecast) =>
          workerForecast.etaMinutes !== null &&
          workerForecast.etaMinutes <= 30
      )
      .map((workerForecast) => ({
        workerForecast,
        predictedBand: bandAtEta(
          workerForecast.predicted,
          workerForecast.etaMinutes
        ),
      }))
      .filter(
        ({ workerForecast, predictedBand }) =>
          (predictedBand === SAFETY_BANDS.HIGH ||
            predictedBand === SAFETY_BANDS.CRITICAL) &&
          BAND_RANK[predictedBand] > BAND_RANK[workerForecast.currentBand]
      )
      .map(({ workerForecast, predictedBand }) => ({
        level: "worker",
        id: workerForecast.workerId,
        name: workerForecast.name,
        zone: workerForecast.zone,
        etaMinutes: workerForecast.etaMinutes,
        predictedBand,
        reason: workerForecast.reason,
      }));

    const zoneWarnings = zoneForecasts
      .filter(
        (zoneForecast) =>
          zoneForecast.earliestBreach !== null &&
          zoneForecast.earliestBreach.etaMinutes <= 30
      )
      .map((zoneForecast) => ({
        level: "zone",
        id: zoneForecast.zoneId,
        name: zoneForecast.name,
        zone: zoneForecast.name,
        etaMinutes: zoneForecast.earliestBreach.etaMinutes,
        predictedBand: zoneForecast.earliestBreach.band,
        reason: `Zone ${zoneForecast.name} trending toward ${zoneForecast.earliestBreach.band}`,
      }));

    const earlyWarnings = [...workerWarnings, ...zoneWarnings].sort(
      (a, b) => a.etaMinutes - b.etaMinutes
    );

    /*
    |------------------------------------------------------------------
    | INSIGHT
    |------------------------------------------------------------------
    */

    let insight;

    if (earlyWarnings.length > 0) {
      const mostUrgent = earlyWarnings[0];

      insight = `${mostUrgent.name} is projected to reach ${mostUrgent.predictedBand} risk in about ${Math.round(mostUrgent.etaMinutes)} minutes.`;
    } else {
      insight = `No early warnings are active — the mine-wide trend is ${mineForecast.trendDirection}.`;
    }

    return {
      horizons: FORECAST_HORIZONS_MIN,
      mineForecast,
      zoneForecasts,
      workerForecasts: sortedWorkerForecasts,
      earlyWarnings,
      insight,
    };
  }, [workers, zones, history, riskHistory]);
}
