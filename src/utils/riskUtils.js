// SafeMine Risk Utility Functions

// Risk levels used throughout the dashboard
export const RISK_LEVELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};


// Get risk level from a numerical risk score
export const getRiskLevel = (score) => {
  const value = Number(score);

  if (Number.isNaN(value)) {
    return RISK_LEVELS.LOW;
  }

  if (value <= 3) {
    return RISK_LEVELS.LOW;
  }

  if (value <= 6) {
    return RISK_LEVELS.MEDIUM;
  }

  if (value <= 8) {
    return RISK_LEVELS.HIGH;
  }

  return RISK_LEVELS.CRITICAL;
};


// Get risk color classes for Tailwind
export const getRiskColor = (score) => {
  const level = getRiskLevel(score);

  switch (level) {
    case RISK_LEVELS.LOW:
      return {
        text: "text-emerald-400",
        bg: "bg-emerald-400/10",
        border: "border-emerald-400/20",
        dot: "bg-emerald-400",
      };

    case RISK_LEVELS.MEDIUM:
      return {
        text: "text-amber-400",
        bg: "bg-amber-400/10",
        border: "border-amber-400/20",
        dot: "bg-amber-400",
      };

    case RISK_LEVELS.HIGH:
      return {
        text: "text-orange-400",
        bg: "bg-orange-400/10",
        border: "border-orange-400/20",
        dot: "bg-orange-400",
      };

    case RISK_LEVELS.CRITICAL:
      return {
        text: "text-red-400",
        bg: "bg-red-400/10",
        border: "border-red-400/20",
        dot: "bg-red-400",
      };

    default:
      return {
        text: "text-slate-400",
        bg: "bg-slate-400/10",
        border: "border-slate-400/20",
        dot: "bg-slate-400",
      };
  }
};


// Get a simple risk percentage from a score out of 10
export const getRiskPercentage = (score) => {
  const value = Number(score);

  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value * 10));
};


// Determine whether a score requires immediate attention
export const isCriticalRisk = (score) => {
  return Number(score) > 8;
};


// Determine whether a score is high or critical
export const isHighRisk = (score) => {
  return Number(score) > 6;
};


// Determine whether a score is within the safe range
export const isLowRisk = (score) => {
  return Number(score) <= 3;
};


// Calculate an overall risk score from multiple factors
export const calculateRiskScore = ({
  gas = 0,
  temperature = 0,
  motion = 0,
  heartRate = 0,
} = {}) => {
  let score = 0;

  // Gas contribution
  if (gas > 75) {
    score += 4;
  } else if (gas > 50) {
    score += 3;
  } else if (gas > 25) {
    score += 2;
  } else if (gas > 15) {
    score += 1;
  }

  // Temperature contribution
  if (temperature > 45) {
    score += 3;
  } else if (temperature > 40) {
    score += 2;
  } else if (temperature > 35) {
    score += 1;
  }

  // Motion / impact contribution
  if (motion > 0.8) {
    score += 3;
  } else if (motion > 0.5) {
    score += 2;
  } else if (motion > 0.3) {
    score += 1;
  }

  // Heart-rate contribution
  if (heartRate > 140 || (heartRate > 0 && heartRate < 50)) {
    score += 2;
  } else if (heartRate > 120 || (heartRate > 0 && heartRate < 60)) {
    score += 1;
  }

  return Math.min(10, score);
};


// Get a human-readable recommendation
export const getRiskRecommendation = (score) => {
  const level = getRiskLevel(score);

  switch (level) {
    case RISK_LEVELS.LOW:
      return "Conditions are within the normal safety range.";

    case RISK_LEVELS.MEDIUM:
      return "Continue monitoring the worker and surrounding conditions.";

    case RISK_LEVELS.HIGH:
      return "Safety team attention is recommended.";

    case RISK_LEVELS.CRITICAL:
      return "Immediate intervention and safety response required.";

    default:
      return "Continue monitoring.";
  }
};


// Return risk information in one object
export const getRiskInfo = (score) => {
  const numericScore = Number(score) || 0;

  return {
    score: numericScore,
    level: getRiskLevel(numericScore),
    percentage: getRiskPercentage(numericScore),
    colors: getRiskColor(numericScore),
    critical: isCriticalRisk(numericScore),
    high: isHighRisk(numericScore),
    low: isLowRisk(numericScore),
    recommendation: getRiskRecommendation(numericScore),
  };
};


// Sort workers/alerts by highest risk first
export const sortByRisk = (items = []) => {
  return [...items].sort(
    (a, b) => Number(b.riskScore || 0) - Number(a.riskScore || 0)
  );
};


// Get alert severity from risk score
export const getAlertSeverity = (score) => {
  const level = getRiskLevel(score);

  if (level === RISK_LEVELS.CRITICAL) {
    return "Critical";
  }

  if (level === RISK_LEVELS.HIGH) {
    return "High";
  }

  if (level === RISK_LEVELS.MEDIUM) {
    return "Warning";
  }

  return "Normal";
};