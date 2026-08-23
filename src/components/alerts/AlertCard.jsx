import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Flame,
  Info,
  MapPin,
  User,
  XCircle,
} from "lucide-react";

const alertConfig = {
  Critical: {
    icon: Flame, 
    text: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    badge: "bg-red-400/10 text-red-400",
  },

  High: {
    icon: AlertTriangle,
    text: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    badge: "bg-orange-400/10 text-orange-400",
  },

  Warning: {
    icon: AlertTriangle,
    text: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    badge: "bg-amber-400/10 text-amber-400",
  },

  Medium: {
    icon: AlertTriangle,
    
    text: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    badge: "bg-amber-400/10 text-amber-400",
  },

  Info: {
    icon: Info,
    text: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
    badge: "bg-cyan-400/10 text-cyan-400",
  },
};

function AlertCard({
  alert,
  onAcknowledge,
  compact = false,
}) {
  if (!alert) {
    return null;
  }

  const severity =
    alert.severity ||
    alert.type ||
    "Info";

  const config =
    alertConfig[severity] ||
    alertConfig.Info;

  const Icon = config.icon;

  const acknowledged =
    alert.acknowledged ||
    alert.status === "Resolved";

  return (
    <div
      className={`group rounded-2xl border ${
        config.border
      } bg-[#0c121c] p-4 transition hover:bg-[#101824] ${
        compact ? "p-3" : "p-4"
      }`}
    >
      {/* TOP ROW */}
      <div className="flex items-start justify-between gap-3">

        <div className="flex min-w-0 items-start gap-3">

          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.bg}`}
          >
            <Icon
              size={17}
              className={config.text}
            />
          </div>

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h3 className="truncate text-xs font-semibold text-white">
                {alert.title || "Safety Alert"}
              </h3>

              <span
                className={`rounded-md px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${config.badge}`}
              >
                {severity}
              </span>

            </div>

            <p className="mt-1 text-[10px] leading-4 text-slate-500">
              {alert.message || "Safety event detected."}
            </p>

          </div>

        </div>

        <div className="flex shrink-0 items-center gap-1 text-[9px] text-slate-600">
          <Clock3 size={11} />
          {alert.time || "Just now"}
        </div>

      </div>

      {/* DETAILS */}
      {!compact && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">

          {alert.worker && (
            <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-2.5">

              <div className="flex items-center gap-1.5 text-[8px] uppercase tracking-wider text-slate-600">
                <User size={10} />
                Worker
              </div>

              <p className="mt-1 truncate text-[10px] font-medium text-slate-300">
                {alert.worker}
              </p>

            </div>
          )}

          {alert.zone && (
            <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-2.5">

              <div className="flex items-center gap-1.5 text-[8px] uppercase tracking-wider text-slate-600">
                <MapPin size={10} />
                Zone
              </div>

              <p className="mt-1 text-[10px] font-medium text-slate-300">
                {alert.zone}
              </p>

            </div>
          )}

          {alert.value !== null &&
            alert.value !== undefined && (
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-2.5">

                <p className="text-[8px] uppercase tracking-wider text-slate-600">
                  Reading
                </p>

                <p className={`mt-1 text-[10px] font-semibold ${config.text}`}>
                  {alert.value}
                  {alert.unit ? ` ${alert.unit}` : ""}
                </p>

              </div>
            )}

          {alert.threshold !== null &&
            alert.threshold !== undefined && (
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-2.5">

                <p className="text-[8px] uppercase tracking-wider text-slate-600">
                  Threshold
                </p>

                <p className="mt-1 text-[10px] font-medium text-slate-300">
                  {alert.threshold}
                  {alert.unit ? ` ${alert.unit}` : ""}
                </p>

              </div>
            )}

        </div>
      )}

      {/* FOOTER */}
      <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3">

        <div className="flex items-center gap-2">

          {acknowledged ? (
            <>
              <CheckCircle2
                size={13}
                className="text-emerald-400"
              />

              <span className="text-[9px] font-medium text-emerald-400">
                Acknowledged
              </span>
            </>
          ) : (
            <>
              <XCircle
                size={13}
                className={config.text}
              />

              <span className={`text-[9px] font-medium ${config.text}`}>
                Active alert
              </span>
            </>
          )}

        </div>

        {!acknowledged &&
          typeof onAcknowledge === "function" && (
            <button
              type="button"
              onClick={() =>
                onAcknowledge(alert.id)
              }
              className="rounded-lg border border-white/[0.07] px-3 py-1.5 text-[9px] font-semibold text-slate-400 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.05] hover:text-cyan-400"
            >
              Acknowledge
            </button>
          )}

      </div>
    </div>
  );
}

export default AlertCard;