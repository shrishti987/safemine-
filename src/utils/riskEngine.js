// SafeMine explainable risk-prediction engine.
//
// Sensor safety thresholds:
// Gas > 1200  -> uncertain condition
// Temperature > 36°C -> uncertain condition
//
// Alerts are based on actual threshold violations.
// Trend analysis is still available for explanation/prediction.

export const SAFETY_BANDS = {
  SAFE: "SAFE",
  MODERATE: "MODERATE",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
};

// All important sensor thresholds are kept here.
export const DEFAULT_THRESHOLDS = {
  bands: {
    safe: 30,
    moderate: 60,
    high: 80,
  },

  sensors: {
    gas: 1200,
    temperature: 36,
  },

  factors: {
    gasHigh: {
      points: 60,
      value: 1200,
      label: "High gas level",
    },

    temperatureHigh: {
      points: 40,
      value: 36,
      label: "High temperature",
    },
  },
};

export function getBandFromScore(
  score,
  thresholds = DEFAULT_THRESHOLDS
) {
  if (score >= thresholds.bands.high) {
    return SAFETY_BANDS.CRITICAL;
  }

  if (score >= thresholds.bands.moderate) {
    return SAFETY_BANDS.HIGH;
  }

  if (score >= thresholds.bands.safe) {
    return SAFETY_BANDS.MODERATE;
  }

  return SAFETY_BANDS.SAFE;
}

export function getBandStyle(band) {
  switch (band) {
    case SAFETY_BANDS.CRITICAL:
      return {
        text: "text-red-400",
        bg: "bg-red-400/10",
        border: "border-red-400/20",
        dot: "bg-red-400",
      };

    case SAFETY_BANDS.HIGH:
      return {
        text: "text-orange-400",
        bg: "bg-orange-400/10",
        border: "border-orange-400/20",
        dot: "bg-orange-400",
      };

    case SAFETY_BANDS.MODERATE:
      return {
        text: "text-amber-400",
        bg: "bg-amber-400/10",
        border: "border-amber-400/20",
        dot: "bg-amber-400",
      };

    default:
      return {
        text: "text-emerald-400",
        bg: "bg-emerald-400/10",
        border: "border-emerald-400/20",
        dot: "bg-emerald-400",
      };
  }
}

// Legacy 3-tier status.
export function getLegacyStatus(band) {
  if (band === SAFETY_BANDS.CRITICAL) {
    return "Critical";
  }

  if (
    band === SAFETY_BANDS.HIGH ||
    band === SAFETY_BANDS.MODERATE
  ) {
    return "Warning";
  }

  return "Safe";
}

// Rate-of-change analysis.
export function analyzeTrend(history = [], key) {
  const values = history
    .map((reading) => reading?.[key])
    .filter((value) => typeof value === "number");

  if (values.length < 2) {
    return {
      direction: "stable",
      changePercent: 0,
      current: values[0] ?? null,
      previous: null,
    };
  }

  const current = values[values.length - 1];
  const previous = values[0];

  if (previous === 0) {
    return {
      direction: "stable",
      changePercent: 0,
      current,
      previous,
    };
  }

  const changePercent =
    ((current - previous) / Math.abs(previous)) * 100;

  let direction = "stable";

  if (changePercent > 5) {
    direction = "increasing";
  } else if (changePercent < -5) {
    direction = "decreasing";
  }

  return {
    direction,
    changePercent,
    current,
    previous,
  };
}

// ------------------------------------------------------------
// WORKER RISK
// ------------------------------------------------------------

export function computeWorkerRisk(
  worker,
  history = [],
  thresholds = DEFAULT_THRESHOLDS
) {
  const gasTrend = analyzeTrend(history, "gas");
  const tempTrend = analyzeTrend(
    history,
    "temperature"
  );

  const factors = [];

  const gasLimit =
    thresholds.sensors.gas;

  const temperatureLimit =
    thresholds.sensors.temperature;

  // ----------------------------------------------------------
  // GAS ABSOLUTE THRESHOLD
  // ----------------------------------------------------------

  if (
    typeof worker.gas === "number" &&
    worker.gas > gasLimit
  ) {
    factors.push({
      key: "gasHigh",
      label:
        thresholds.factors.gasHigh.label,
      points:
        thresholds.factors.gasHigh.points,
      reason: `Gas level is ${worker.gas.toFixed(
        1
      )}, above the safety limit of ${gasLimit}.`,
    });
  }

  // ----------------------------------------------------------
  // TEMPERATURE ABSOLUTE THRESHOLD
  // ----------------------------------------------------------

  if (
    typeof worker.temperature === "number" &&
    worker.temperature > temperatureLimit
  ) {
    factors.push({
      key: "temperatureHigh",
      label:
        thresholds.factors.temperatureHigh.label,
      points:
        thresholds.factors.temperatureHigh.points,
      reason: `Temperature is ${worker.temperature.toFixed(
        1
      )}°C, above the safety limit of ${temperatureLimit}°C.`,
    });
  }

  const safetyScore = Math.min(
    100,
    factors.reduce(
      (total, factor) =>
        total + factor.points,
      0
    )
  );

  const band = getBandFromScore(
    safetyScore,
    thresholds
  );

  return {
    safetyScore,

    band,

    riskScore: Number(
      (safetyScore / 10).toFixed(1)
    ),

    status: getLegacyStatus(band),

    factors,

    trend: {
      gas: gasTrend,
      temperature: tempTrend,
    },

    explanation: factors.map(
      (factor) => factor.reason
    ),

    // Very useful for the alert system.
    isUncertain: factors.length > 0,
  };
}

// ------------------------------------------------------------
// ZONE RISK
// ------------------------------------------------------------

export function computeZoneRisk(
  zoneId,
  zoneWorkers = []
) {
  const safeCount =
    zoneWorkers.filter(
      (worker) =>
        worker.status === "Safe"
    ).length;

  const warningCount =
    zoneWorkers.filter(
      (worker) =>
        worker.status === "Warning"
    ).length;

  const criticalCount =
    zoneWorkers.filter(
      (worker) =>
        worker.status === "Critical"
    ).length;

  const offlineCount =
    zoneWorkers.filter(
      (worker) =>
        worker.status === "Offline"
    ).length;

  const workerCount =
    zoneWorkers.length;

  const avgGas =
    workerCount > 0
      ? zoneWorkers.reduce(
          (total, worker) =>
            total + (worker.gas || 0),
          0
        ) / workerCount
      : 0;

  const avgTemperature =
    workerCount > 0
      ? zoneWorkers.reduce(
          (total, worker) =>
            total +
            (worker.temperature || 0),
          0
        ) / workerCount
      : 0;

  const avgSafetyScore =
    workerCount > 0
      ? zoneWorkers.reduce(
          (total, worker) =>
            total +
            (worker.safetyScore || 0),
          0
        ) / workerCount
      : 0;

  // Zone becomes hazardous if at least 2 workers
  // have an actual gas/temperature threshold violation.
  const uncertainWorkers =
    zoneWorkers.filter(
      (worker) =>
        worker.isUncertain === true
    );

  const hazardDetected =
    uncertainWorkers.length >= 2;

  return {
    zoneId,

    workerCount,

    safeCount,

    warningCount,

    criticalCount,

    offlineCount,

    avgGas: Number(
      avgGas.toFixed(1)
    ),

    avgTemperature: Number(
      avgTemperature.toFixed(1)
    ),

    safetyScore: Math.round(
      avgSafetyScore
    ),

    band: getBandFromScore(
      avgSafetyScore
    ),

    hazardDetected,

    hazardReason: hazardDetected
      ? `Potential Environmental Hazard Detected in ${zoneId} — ${uncertainWorkers.length} workers have gas/temperature readings above the safety threshold.`
      : null,
  };
}