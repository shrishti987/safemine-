import {
  Activity,
  Battery,
  Clock3,
  MapPin,
  Radio,
  ShieldCheck,
  Thermometer,
  User,
  Wind,
  X,
} from "lucide-react";

const statusConfig = {
  Safe: {
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    dot: "bg-emerald-400",
  },
  Warning: {
    text: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    dot: "bg-amber-400",
  },
  Critical: {
    text: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    dot: "bg-red-400",
  },
  Offline: {
    text: "text-slate-500",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    dot: "bg-slate-500",
  },
};

function Metric({
  icon: Icon,
  label,
  value,
  unit = "",
  status,
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">
      <div className="flex items-center gap-1.5 text-[8px] uppercase tracking-wider text-slate-600">
        <Icon size={11} />
        {label}
      </div>

      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-sm font-bold text-white">
          {value ?? "--"}
        </span>

        {unit && (
          <span className="text-[8px] text-slate-600">
            {unit}
          </span>
        )}
      </div>

      {status && (
        <p className="mt-1 text-[8px] text-slate-600">
          {status}
        </p>
      )}
    </div>
  );
}

function WorkerDetails({
  worker,
  onClose,
  onAcknowledge,
}) {
  if (!worker) {
    return null;
  }

  const status = worker.status || "Safe";

  const config =
    statusConfig[status] ||
    statusConfig.Safe;

  const riskScore =
    Number(worker.riskScore) || 0;

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0c121c] shadow-xl">

      {/* HEADER */}
      <div className="flex items-start justify-between border-b border-white/[0.05] p-5">

        <div className="flex items-center gap-3">

          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-white/[0.07] bg-[#111925]">

            {worker.avatar ? (
              <img
                src={worker.avatar}
                alt={worker.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User
                size={20}
                className="text-slate-500"
              />
            )}

          </div>

          <div>

            <h2 className="text-sm font-semibold text-white">
              {worker.name}
            </h2>

            <p className="mt-1 text-[9px] text-slate-600">
              {worker.role ||
                "Mining Operator"}
            </p>

            <div className="mt-2 flex items-center gap-2">

              <span
                className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-[7px] font-bold uppercase tracking-wider ${config.bg} ${config.border} ${config.text}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
                />
                {status}
              </span>

              <span className="text-[8px] text-slate-600">
                {worker.id}
              </span>

            </div>

          </div>

        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
            aria-label="Close worker details"
          >
            <X size={15} />
          </button>
        )}

      </div>

      {/* BASIC INFORMATION */}
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">

        <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">
          <div className="flex items-center gap-1.5 text-[8px] text-slate-600">
            <MapPin size={10} />
            Zone
          </div>

          <p className="mt-2 text-[10px] font-semibold text-slate-300">
            {worker.zone || "--"}
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">
          <div className="flex items-center gap-1.5 text-[8px] text-slate-600">
            <Radio size={10} />
            Helmet
          </div>

          <p className="mt-2 text-[10px] font-semibold text-slate-300">
            {worker.helmetId || "--"}
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">
          <div className="flex items-center gap-1.5 text-[8px] text-slate-600">
            <Clock3 size={10} />
            Last Seen
          </div>

          <p className="mt-2 text-[10px] font-semibold text-slate-300">
            {worker.lastSeen || "--"}
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">
          <div className="flex items-center gap-1.5 text-[8px] text-slate-600">
            <ShieldCheck size={10} />
            Risk
          </div>

          <p
            className={`mt-2 text-[10px] font-bold ${
              riskScore >= 8
                ? "text-red-400"
                : riskScore >= 5
                ? "text-amber-400"
                : "text-emerald-400"
            }`}
          >
            {riskScore.toFixed(1)} / 10
          </p>
        </div>

      </div>

      {/* SENSOR READINGS */}
      <div className="border-t border-white/[0.05] p-5">

        <div className="mb-3">

          <h3 className="text-[10px] font-semibold text-white">
            Live Sensor Readings
          </h3>

          <p className="mt-1 text-[8px] text-slate-600">
            Current readings from the worker's safety helmet
          </p>

        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          <Metric
            icon={Thermometer}
            label="Temperature"
            value={worker.temperature}
            unit="°C"
            status={
              worker.temperature > 40
                ? "Above threshold"
                : "Normal range"
            }
          />

          <Metric
            icon={Wind}
            label="Gas Level"
            value={worker.gas}
            unit="ppm"
            status={
              worker.gas > 50
                ? "Unsafe concentration"
                : "Normal range"
            }
          />

          <Metric
            icon={Activity}
            label="Motion"
            value={worker.motion}
            unit="g"
            status={
              worker.motion > 0.5
                ? "Abnormal motion"
                : "Normal activity"
            }
          />

          <Metric
            icon={Battery}
            label="Battery"
            value={worker.battery}
            unit="%"
            status={
              worker.battery < 30
                ? "Low battery"
                : "Battery healthy"
            }
          />

        </div>

      </div>

      {/* CONNECTIVITY */}
      <div className="border-t border-white/[0.05] p-5">

        <div className="mb-3 flex items-center justify-between">

          <div>

            <h3 className="text-[10px] font-semibold text-white">
              Connectivity
            </h3>

            <p className="mt-1 text-[8px] text-slate-600">
              Helmet network connection quality
            </p>

          </div>

          <Radio
            size={15}
            className={
              worker.signal < 70
                ? "text-amber-400"
                : "text-emerald-400"
            }
          />

        </div>

        <div className="flex items-center gap-3">

          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.04]">

            <div
              className={`h-full rounded-full ${
                worker.signal < 70
                  ? "bg-amber-400"
                  : "bg-emerald-400"
              }`}
              style={{
                width: `${Math.min(
                  worker.signal ?? 0,
                  100
                )}%`,
              }}
            />

          </div>

          <span className="text-[9px] font-semibold text-slate-400">
            {worker.signal ?? "--"}%
          </span>

        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-end gap-2 border-t border-white/[0.05] p-5">

        {status !== "Safe" &&
          onAcknowledge && (
            <button
              type="button"
              onClick={() =>
                onAcknowledge(worker)
              }
              className="rounded-xl border border-amber-400/15 bg-amber-400/[0.04] px-4 py-2 text-[9px] font-semibold text-amber-400 transition hover:bg-amber-400/10"
            >
              Acknowledge Alert
            </button>
          )}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-2 text-[9px] font-semibold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            Close
          </button>
        )}

      </div>

    </div>
  );
}

export default WorkerDetails;