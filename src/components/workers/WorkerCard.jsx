import {
  Activity,
  Battery,
  ChevronRight,
  MapPin,
  Radio,
  ShieldCheck,
  Thermometer,
  User,
  Wind,
} from "lucide-react";

const statusConfig = {
  Safe: {
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/15",
    dot: "bg-emerald-400",
  },

  Warning: {
    text: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/15",
    dot: "bg-amber-400",
  },

  Critical: {
    text: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/15",
    dot: "bg-red-400",
  },

  Offline: {
    text: "text-slate-500",
    bg: "bg-slate-500/10",
    border: "border-slate-500/15",
    dot: "bg-slate-500",
  },
};

function getRiskStyle(score) {
  if (score >= 8) {
    return {
      text: "text-red-400",
      label: "Critical Risk",
    };
  }

  if (score >= 5) {
    return {
      text: "text-amber-400",
      label: "Elevated Risk",
    };
  }

  return {
    text: "text-emerald-400",
    label: "Low Risk",
  };
}

function WorkerCard({
  worker,
  onClick,
  showDetails = true,
  compact = false,
}) {
  if (!worker) {
    return null;
  }

  const status =
    worker.status || "Safe";

  const statusStyle =
    statusConfig[status] ||
    statusConfig.Safe;

  const riskScore =
    Number(worker.riskScore) || 0;

  const riskStyle =
    getRiskStyle(riskScore);

  return (
    <div
      onClick={onClick}
      className={`group overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c121c] transition-all duration-200 ${
        onClick
          ? "cursor-pointer hover:border-white/[0.11] hover:bg-[#0f1621]"
          : ""
      }`}
    >
      {/* TOP */}
      <div className="flex items-start justify-between gap-3 p-4">

        <div className="flex min-w-0 items-center gap-3">

          {/* AVATAR */}
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.07] bg-[#111925]">

            {worker.avatar ? (
              <img
                src={worker.avatar}
                alt={worker.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User
                size={17}
                className="text-slate-500"
              />
            )}

            <span
              className={`absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full border-2 border-[#111925] ${statusStyle.dot}`}
            />

          </div>

          {/* NAME */}
          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <h3 className="truncate text-xs font-semibold text-white">
                {worker.name || "Unknown Worker"}
              </h3>

              {status === "Safe" && (
                <ShieldCheck
                  size={12}
                  className="shrink-0 text-emerald-400"
                />
              )}

            </div>

            <p className="mt-1 truncate text-[8px] text-slate-600">
              {worker.role ||
                "Mining Operator"}
            </p>

          </div>

        </div>

        {/* STATUS */}
        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1 text-[7px] font-bold uppercase tracking-wider ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
          />

          {status}
        </span>

      </div>

      {/* WORKER INFO */}
      <div className="grid grid-cols-2 gap-2 px-4">

        <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-2.5">

          <div className="flex items-center gap-1.5 text-[8px] text-slate-600">
            <MapPin size={10} />
            Zone
          </div>

          <p className="mt-1 text-[10px] font-medium text-slate-300">
            {worker.zone || "--"}
          </p>

        </div>

        <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-2.5">

          <div className="flex items-center gap-1.5 text-[8px] text-slate-600">
            <Radio size={10} />
            Helmet
          </div>

          <p className="mt-1 text-[10px] font-medium text-slate-300">
            {worker.helmetId || "--"}
          </p>

        </div>

      </div>

      {/* RISK */}
      <div className="px-4 pt-3">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-[8px] uppercase tracking-wider text-slate-600">
              Risk Score
            </p>

            <div className="mt-1 flex items-baseline gap-1.5">

              <span
                className={`text-lg font-bold ${riskStyle.text}`}
              >
                {riskScore.toFixed(1)}
              </span>

              <span className="text-[8px] text-slate-600">
                / 10
              </span>

            </div>

          </div>

          <span
            className={`text-[8px] font-medium ${riskStyle.text}`}
          >
            {riskStyle.label}
          </span>

        </div>

        {/* RISK BAR */}
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.04]">

          <div
            className={`h-full rounded-full transition-all duration-500 ${
              riskScore >= 8
                ? "bg-red-400"
                : riskScore >= 5
                ? "bg-amber-400"
                : "bg-emerald-400"
            }`}
            style={{
              width: `${Math.min(
                riskScore * 10,
                100
              )}%`,
            }}
          />

        </div>

      </div>

      {/* SENSOR DETAILS */}
      {showDetails && !compact && (
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/[0.05] px-4 pt-3">

          {/* TEMPERATURE */}
          <div>
            <div className="flex items-center gap-1 text-[7px] uppercase tracking-wider text-slate-600">
              <Thermometer size={9} />
              Temp
            </div>

            <p className="mt-1 text-[9px] font-semibold text-slate-300">
              {worker.temperature ??
                "--"}{" "}
              <span className="font-normal text-slate-600">
                °C
              </span>
            </p>
          </div>

          {/* GAS */}
          <div>
            <div className="flex items-center gap-1 text-[7px] uppercase tracking-wider text-slate-600">
              <Wind size={9} />
              Gas
            </div>

            <p className="mt-1 text-[9px] font-semibold text-slate-300">
              {worker.gas ??
                "--"}{" "}
              <span className="font-normal text-slate-600">
                ppm
              </span>
            </p>
          </div>

          {/* MOTION */}
          <div>
            <div className="flex items-center gap-1 text-[7px] uppercase tracking-wider text-slate-600">
              <Activity size={9} />
              Motion
            </div>

            <p className="mt-1 text-[9px] font-semibold text-slate-300">
              {worker.motion ??
                "--"}{" "}
              <span className="font-normal text-slate-600">
                g
              </span>
            </p>
          </div>

        </div>
      )}

      {/* FOOTER */}
      <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] px-4 py-3">

        <div className="flex items-center gap-3">

          {/* BATTERY */}
          <div className="flex items-center gap-1.5">

            <Battery
              size={12}
              className={
                worker.battery < 30
                  ? "text-red-400"
                  : "text-slate-500"
              }
            />

            <span className="text-[8px] text-slate-500">
              {worker.battery ??
                "--"}%
            </span>

          </div>

          {/* SIGNAL */}
          <div className="flex items-center gap-1.5">

            <Radio
              size={12}
              className={
                worker.signal < 70
                  ? "text-amber-400"
                  : "text-slate-500"
              }
            />

            <span className="text-[8px] text-slate-500">
              {worker.signal ??
                "--"}%
            </span>

          </div>

          {worker.lastSeen && (
            <span className="hidden text-[8px] text-slate-600 sm:block">
              {worker.lastSeen}
            </span>
          )}

        </div>

        {onClick && (
          <ChevronRight
            size={13}
            className="text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-400"
          />
        )}

      </div>
    </div>
  );
}

export default WorkerCard;