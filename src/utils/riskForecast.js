// SafeMine AI risk-forecasting engine.
//
// Pure, framework-free helpers that project recent sensor history forward
// in time using ordinary least squares regression, then translate the
// projected sensor values into the same safety-band vocabulary used by
// riskEngine.js.

import { DEFAULT_THRESHOLDS, getBandFromScore } from "./riskEngine";

export const FORECAST_HORIZONS_MIN = [10, 20, 30];

export function linearRegression(xs, ys) {
  const n = xs.length;

  if (n < 2) {
    return { slope: 0, intercept: ys[0] ?? 0 };
  }

  const meanX = xs.reduce((sum, x) => sum + x, 0) / n;
  const meanY = ys.reduce((sum, y) => sum + y, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (xs[i] - meanX) * (ys[i] - meanY);
    denominator += (xs[i] - meanX) * (xs[i] - meanX);
  }

  if (denominator === 0) {
    return { slope: 0, intercept: meanY };
  }

  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  return { slope, intercept };
}

export function projectSeries(history = [], options = {}) {
  const {
    key,
    timestampKey = "timestamp",
    horizonsMin = FORECAST_HORIZONS_MIN,
  } = options;

  const usable = history.filter(
    (entry) =>
      typeof entry?.[key] === "number" &&
      typeof entry?.[timestampKey] === "number"
  );

  if (usable.length < 2) {
    const lastValue =
      usable.length > 0 ? usable[usable.length - 1][key] : 0;

    return {
      slope: 0,
      trendDirection: "stable",
      projections: horizonsMin.map((minutesAhead) => ({
        minutesAhead,
        value: lastValue,
      })),
    };
  }

  const xs = usable.map((entry) => entry[timestampKey]);
  const ys = usable.map((entry) => entry[key]);

  const { slope, intercept } = linearRegression(xs, ys);

  const lastTimestamp = xs[xs.length - 1];
  const lastValue = ys[ys.length - 1];

  const projections = horizonsMin.map((minutesAhead) => {
    const futureTimestamp = lastTimestamp + minutesAhead * 60000;

    return {
      minutesAhead,
      value: slope * futureTimestamp + intercept,
    };
  });

  const farthestValue = projections[projections.length - 1].value;

  const percentChange =
    ((farthestValue - lastValue) / Math.max(Math.abs(lastValue), 1)) * 100;

  let trendDirection = "stable";

  if (percentChange > 3) {
    trendDirection = "rising";
  } else if (percentChange < -3) {
    trendDirection = "falling";
  }

  return { slope, intercept, trendDirection, projections };
}

export function estimateMinutesToThreshold(
  regression,
  thresholdValue,
  fromTimestamp
) {
  const { slope, intercept } = regression;

  if (!slope) {
    return null;
  }

  const currentValue = slope * fromTimestamp + intercept;

  if (slope > 0 && currentValue >= thresholdValue) {
    return 0;
  }

  if (slope < 0 && currentValue <= thresholdValue) {
    return currentValue >= thresholdValue ? 0 : null;
  }

  const movingToward =
    (slope > 0 && currentValue < thresholdValue) ||
    (slope < 0 && currentValue > thresholdValue);

  if (!movingToward) {
    return null;
  }

  const targetTimestamp = (thresholdValue - intercept) / slope;

  return (targetTimestamp - fromTimestamp) / 60000;
}

export function computeThresholdBand(
  predictedGas,
  predictedTemperature,
  thresholds = DEFAULT_THRESHOLDS
) {
  let total = 0;

  if (
    typeof predictedGas === "number" &&
    predictedGas > thresholds.sensors.gas
  ) {
    total += thresholds.factors.gasHigh.points;
  }

  if (
    typeof predictedTemperature === "number" &&
    predictedTemperature > thresholds.sensors.temperature
  ) {
    total += thresholds.factors.temperatureHigh.points;
  }

  const safetyScore = Math.min(100, total);

  return {
    safetyScore,
    band: getBandFromScore(safetyScore, thresholds),
  };
}
