// Format numbers with commas
export const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return "0";
  }

  return new Intl.NumberFormat("en-IN").format(Number(value));
};


// Format percentage values
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "0%";
  }

  return `${Number(value).toFixed(decimals)}%`;
};


// Format temperature
export const formatTemperature = (value, unit = "°C") => {
  if (value === null || value === undefined || value === "") {
    return `--${unit}`;
  }

  return `${Number(value).toFixed(1)}${unit}`;
};


// Format gas concentration
export const formatGasLevel = (value, unit = "ppm") => {
  if (value === null || value === undefined || value === "") {
    return `-- ${unit}`;
  }

  return `${Number(value).toFixed(1)} ${unit}`;
};


// Format latency
export const formatLatency = (value) => {
  if (value === null || value === undefined || value === "") {
    return "--";
  }

  return `${Number(value).toFixed(0)} ms`;
};


// Format battery percentage
export const formatBattery = (value) => {
  if (value === null || value === undefined || value === "") {
    return "0%";
  }

  const battery = Math.max(0, Math.min(100, Number(value)));

  return `${battery.toFixed(0)}%`;
};


// Format date
export const formatDate = (date) => {
  if (!date) {
    return "--";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "--";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


// Format date and time
export const formatDateTime = (date) => {
  if (!date) {
    return "--";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "--";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


// Format relative time
export const formatRelativeTime = (date) => {
  if (!date) {
    return "--";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "--";
  }

  const difference = Date.now() - parsedDate.getTime();

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return formatDate(date);
};


// Format large numbers
export const formatCompactNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return "0";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0";
  }

  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }

  return number.toString();
};


// Format duration in seconds
export const formatDuration = (seconds) => {
  if (seconds === null || seconds === undefined) {
    return "0 sec";
  }

  const totalSeconds = Math.max(0, Number(seconds));

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
};


// Get status color class
export const getStatusColor = (status) => {
  const normalizedStatus = String(status || "").toLowerCase();

  switch (normalizedStatus) {
    case "active":
    case "online":
    case "safe":
    case "healthy":
    case "completed":
      return "text-emerald-400";

    case "warning":
    case "pending":
    case "scheduled":
      return "text-amber-400";

    case "critical":
    case "offline":
    case "danger":
    case "failed":
      return "text-red-400";

    case "in progress":
      return "text-cyan-400";

    default:
      return "text-slate-400";
  }
};


// Get risk level from score
export const getRiskLevel = (score) => {
  const value = Number(score);

  if (Number.isNaN(value)) {
    return "Unknown";
  }

  if (value <= 3) {
    return "Low";
  }

  if (value <= 6) {
    return "Medium";
  }

  if (value <= 8) {
    return "High";
  }

  return "Critical";
};


// Get risk color
export const getRiskColor = (score) => {
  const level = getRiskLevel(score);

  switch (level) {
    case "Low":
      return "text-emerald-400";

    case "Medium":
      return "text-amber-400";

    case "High":
      return "text-orange-400";

    case "Critical":
      return "text-red-400";

    default:
      return "text-slate-400";
  }
};