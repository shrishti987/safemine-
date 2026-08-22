// SafeMine explainable risk-prediction engine.
//
// Turns raw sensor readings + a short rolling history into a 0-100
// safety score with a plain-language breakdown of *why* — rate of
// change, threshold violations, and multi-sensor combination. This is
// rule-based trend analysis, not machine learning.

export const SAFETY_BANDS = {
  SAFE: "SAFE",
  MODERATE: "MODERATE",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
};

// Thresholds are intentionally in one place so they're easy to tune.
export const DEFAULT_THRESHOLDS = {
  bands: {
    safe: 30,
    moderate: 60,
    high: 80,
  },

  factors: {
    gasRising: { points: 30, changePercent: 15, label: "Gas rising rapidly" },
    tempRising: { points: 20, value: 38, label: "Temperature rising" },
    abnormalMotion: { points: 25, value: 0.5, label: "Abnormal motion" },
    lowBattery: { points: 10, value: 30, label: "Low helmet battery" },
    weakSignal: { points: 10, value: 70, label: "Weak network signal" },
  },
};

export function getBandFromScore(score, thresholds = DEFAULT_THRESHOLDS) {
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
      return { text: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", dot: "bg-red-400" };
    case SAFETY_BANDS.HIGH:
      return { text: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20", dot: "bg-orange-400" };
    case SAFETY_BANDS.MODERATE:
      return { text: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", dot: "bg-amber-400" };
    default:
      return { text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", dot: "bg-emerald-400" };
  }
}

// Legacy 3-tier status, for components built before the 4-band system
// (WorkerCard, WorkerTable, WorkerDetails, AlertCard, EmergencyPanel).
export function getLegacyStatus(band) {
  if (band === SAFETY_BANDS.CRITICAL) {
    return "Critical";
  }

  if (band === SAFETY_BANDS.HIGH || band === SAFETY_BANDS.MODERATE) {
    return "Warning";
  }

  return "Safe";
}

// Rate-of-change over a rolling history window for one sensor key.
export function analyzeTrend(history = [], key) {
  const values = history
    .map((reading) => reading?.[key])
    .filter((value) => typeof value === "number");

  if (values.length < 2) {
    return { direction: "stable", changePercent: 0, current: values[0] ?? null, previous: null };
  }

  const current = values[values.length - 1];
  const previous = values[0];

  if (previous === 0) {
    return { direction: "stable", changePercent: 0, current, previous };
  }

  const changePercent = ((current - previous) / Math.abs(previous)) * 100;

  let direction = "stable";
  if (changePercent > 5) {
    direction = "increasing";
  } else if (changePercent < -5) {
    direction = "decreasing";
  }

  return { direction, changePercent, current, previous };
}

// Explainable per-worker risk: sums contributing factors (each with a
// human-readable reason), clamps 0-100, and derives the legacy 0-10
// riskScore + 3-tier status from the same number so nothing disagrees.
export function computeWorkerRisk(worker, history = [], thresholds = DEFAULT_THRESHOLDS) {
  const gasTrend = analyzeTrend(history, "gas");
  const tempTrend = analyzeTrend(history, "temperature");

  const factors = [];

  if (gasTrend.direction === "increasing" && gasTrend.changePercent >= thresholds.factors.gasRising.changePercent) {
    factors.push({
      key: "gasRising",
      label: thresholds.factors.gasRising.label,
      points: thresholds.factors.gasRising.points,
      reason: `Gas level increased ${gasTrend.changePercent.toFixed(0)}% over the last ${history.length} readings.`,
    });
  }

  if (tempTrend.direction === "increasing" && worker.temperature > thresholds.factors.tempRising.value) {
    factors.push({
      key: "tempRising",
      label: thresholds.factors.tempRising.label,
      points: thresholds.factors.tempRising.points,
      reason: `Temperature is ${worker.temperature.toFixed(1)}°C, above the ${thresholds.factors.tempRising.value}°C normal range and still rising.`,
    });
  }

  if (worker.motion > thresholds.factors.abnormalMotion.value) {
    factors.push({
      key: "abnormalMotion",
      label: thresholds.factors.abnormalMotion.label,
      points: thresholds.factors.abnormalMotion.points,
      reason: `Motion reading of ${worker.motion.toFixed(2)}g suggests an abnormal movement pattern.`,
    });
  }

  if (worker.battery < thresholds.factors.lowBattery.value) {
    factors.push({
      key: "lowBattery",
      label: thresholds.factors.lowBattery.label,
      points: thresholds.factors.lowBattery.points,
      reason: `Helmet battery is at ${Math.round(worker.battery)}%, below the ${thresholds.factors.lowBattery.value}% safety margin.`,
    });
  }

  if (worker.signal < thresholds.factors.weakSignal.value) {
    factors.push({
      key: "weakSignal",
      label: thresholds.factors.weakSignal.label,
      points: thresholds.factors.weakSignal.points,
      reason: `Network signal is at ${Math.round(worker.signal)}%, below the ${thresholds.factors.weakSignal.value}% reliable threshold.`,
    });
  }

  const safetyScore = Math.min(100, factors.reduce((total, factor) => total + factor.points, 0));
  const band = getBandFromScore(safetyScore, thresholds);

  return {
    safetyScore,
    band,
    riskScore: Number((safetyScore / 10).toFixed(1)),
    status: getLegacyStatus(band),
    factors,
    trend: { gas: gasTrend, temperature: tempTrend },
    explanation: factors.map((factor) => factor.reason),
  };
}

// Zone-level aggregate risk. Flags a potential environmental hazard
// when multiple workers in the same zone are trending upward at once
// — a single outlier worker is a worker problem, several at once is a
// zone problem.
export function computeZoneRisk(zoneId, zoneWorkers = []) {
  const safeCount = zoneWorkers.filter((worker) => worker.status === "Safe").length;
  const warningCount = zoneWorkers.filter((worker) => worker.status === "Warning").length;
  const criticalCount = zoneWorkers.filter((worker) => worker.status === "Critical").length;
  const offlineCount = zoneWorkers.filter((worker) => worker.status === "Offline").length;

  const workerCount = zoneWorkers.length;

  const avgGas = workerCount > 0
    ? zoneWorkers.reduce((total, worker) => total + (worker.gas || 0), 0) / workerCount
    : 0;

  const avgTemperature = workerCount > 0
    ? zoneWorkers.reduce((total, worker) => total + (worker.temperature || 0), 0) / workerCount
    : 0;

  const avgSafetyScore = workerCount > 0
    ? zoneWorkers.reduce((total, worker) => total + (worker.safetyScore || 0), 0) / workerCount
    : 0;

  // Reuses the same already-computed, properly-thresholded factors that
  // drive each worker's score and alerts (>=15% gas change, temperature
  // genuinely above range) rather than the looser raw trend direction
  // (>5%) — idle sensor noise crosses that looser bar often enough to
  // produce false zone hazards that have nothing to do with an actual
  // incident.
  const risingWorkers = zoneWorkers.filter((worker) =>
    (worker.factors || []).some((factor) => factor.key === "gasRising" || factor.key === "tempRising")
  );

  const hazardDetected = risingWorkers.length >= 2;

  return {
    zoneId,
    workerCount,
    safeCount,
    warningCount,
    criticalCount,
    offlineCount,
    avgGas: Number(avgGas.toFixed(1)),
    avgTemperature: Number(avgTemperature.toFixed(1)),
    safetyScore: Math.round(avgSafetyScore),
    band: getBandFromScore(avgSafetyScore),
    hazardDetected,
    hazardReason: hazardDetected
      ? `Potential Environmental Hazard Detected in ${zoneId} — ${risingWorkers.length} workers show rising gas/temperature readings.`
      : null,
  };
}
