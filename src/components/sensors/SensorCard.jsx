import {
  Activity,
  Battery,
  Gauge,
  Radio,
  Thermometer,
  Wind,
} from "lucide-react";

const sensorConfig = {
  gas: {
    label: "Gas",
    icon: Wind,
    unit: "ppm",
    normalLabel: "Normal",
    getValue: (sensor) => sensor?.gas?.value,
    getStatus: (sensor) => sensor?.gas?.status,
  },

  temperature: {
    label: "Temperature",
    icon: Thermometer,
    unit: "°C",
    normalLabel: "Normal",
    getValue: (sensor) => sensor?.temperature?.value,
    getStatus: (sensor) => sensor?.temperature?.status,
  },

  motion: {
    label: "Motion",
    icon: Activity,
    unit: "g",
    normalLabel: "Normal",
    getValue: (sensor) => sensor?.motion?.value,
    getStatus: (sensor) => sensor?.motion?.status,
  },

  battery: {
    label: "Battery",
    icon: Battery,
    unit: "%",
    normalLabel: "Good",
    getValue: (sensor) => sensor?.battery?.value,
    getStatus: (sensor) => sensor?.battery?.status,
  },

  signal: {
    label: "Signal",
    icon: Radio,
    unit: "%",
    normalLabel: "Good",
    getValue: (sensor) => sensor?.signal?.value,
    getStatus: (sensor) => sensor?.signal?.status,
  },
};

const statusStyles = {
  Normal: {
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/15",
    bar: "bg-emerald-400",
  },

  Good: {
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/15",
    bar: "bg-emerald-400",
  },

  Excellent: {
    text: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/15",
    bar: "bg-cyan-400",
  },

  Warning: {
    text: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/15",
    bar: "bg-amber-400",
  },

  Weak: {
    text: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/15",
    bar: "bg-amber-400",
  },

  Critical: {
    text: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/15",
    bar: "bg-red-400",
  },

  Danger: {
    text: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/15",
    bar: "bg-red-400",
  },
};

function getProgress(type, value) {
  if (value === null || value === undefined) {
    return 0;
  }

  if (type === "gas") {
    return Math.min((value / 100) * 100, 100);
  }

  if (type === "temperature") {
    return Math.min((value / 50) * 100, 100);
  }

  if (type === "motion") {
    return Math.min((value / 1) * 100, 100);
  }

  return Math.min(Math.max(value, 0), 100);
}

function SensorCard({
  sensor,
  type = "gas",
  compact = false,
}) {
  const config =
    sensorConfig[type] || sensorConfig.gas;

  const Icon = config.icon;

  const value = config.getValue(sensor);
  const status = config.getStatus(sensor) || config.normalLabel;

  const style =
    statusStyles[status] || statusStyles.Normal;

  const progress = getProgress(type, value);

  return (
    <div
      className={`group rounded-2xl border border-white/[0.06] bg-[#0c121c] transition-all duration-200 hover:border-white/[0.1] hover:bg-[#0f1621] ${
        compact ? "p-3" : "p-4"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3">

        <div className="flex items-center gap-2.5">

          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${style.bg}`}
          >
            <Icon
              size={15}
              className={style.text}
            />
          </div>

          <div>
            <p className="text-[10px] font-semibold text-white">
              {config.label}
            </p>

            {!compact && (
              <p className="mt-0.5 text-[8px] text-slate-600">
                {sensor?.helmetId || "Sensor"}
              </p>
            )}
          </div>

        </div>

        <span
          className={`rounded-md border px-2 py-1 text-[7px] font-bold uppercase tracking-wider ${style.bg} ${style.border} ${style.text}`}
        >
          {status}
        </span>

      </div>

      {/* VALUE */}
      <div className="mt-4 flex items-end justify-between">

        <div>
          <span className="text-xl font-bold tracking-tight text-white">
            {value !== null && value !== undefined
              ? value
              : "--"}
          </span>

          {value !== null &&
            value !== undefined && (
              <span className="ml-1 text-[9px] text-slate-600">
                {config.unit}
              </span>
            )}
        </div>

        {!compact &&
          sensor?.zone && (
            <span className="text-[8px] text-slate-600">
              {sensor.zone}
            </span>
          )}

      </div>

      {/* PROGRESS */}
      <div className="mt-3">

        <div className="h-1 overflow-hidden rounded-full bg-white/[0.04]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

      </div>

      {/* THRESHOLD */}
      {!compact && (
        <div className="mt-3 flex items-center justify-between">

          <span className="text-[8px] text-slate-600">
            Threshold
          </span>

          <span className="text-[8px] font-medium text-slate-400">
            {sensor?.[type]?.threshold ??
              "--"}{" "}
            {sensor?.[type]?.threshold !==
              undefined
              ? config.unit
              : ""}
          </span>

        </div>
      )}

    </div>
  );
}

export default SensorCard;