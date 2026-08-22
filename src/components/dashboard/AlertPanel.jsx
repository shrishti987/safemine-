import {
  AlertTriangle,
  Flame,
  Wind,
  Activity,
  ChevronRight,
} from "lucide-react";

const defaultAlerts = [
  {
    worker: "SM-024",
    title: "Critical gas level detected",
    detail: "Methane concentration above threshold",
    time: "2 min ago",
    type: "critical",
    icon: Wind,
  },
  {
    worker: "SM-032",
    title: "Abnormal temperature",
    detail: "Temperature reached 42.8°C",
    time: "5 min ago",
    type: "warning",
    icon: Flame,
  },
  {
    worker: "SM-019",
    title: "Unusual movement detected",
    detail: "Possible fatigue or instability",
    time: "8 min ago",
    type: "warning",
    icon: Activity,
  },
];

function AlertPanel({ alerts = defaultAlerts, criticalCount }) {
  const activeCriticalCount = criticalCount ?? alerts.filter((alert) => alert.type === "critical").length;
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Active Alerts
          </h3>

          <p className="mt-1 text-[10px] text-slate-600">
            Requires attention
          </p>
        </div>

        <button className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 hover:text-emerald-300">
          View all
          <ChevronRight size={12} />
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {alerts.length === 0 && (
          <p className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-4 text-center text-[10px] text-slate-500">
            No active alerts. All readings are within normal range.
          </p>
        )}

        {alerts.map((alert, index) => {
          const Icon = alert.icon;
          const critical = alert.type === "critical";

          return (
            <div
              key={alert.id || `${alert.worker}-${index}`}
              className={`rounded-xl border p-3 ${
                critical
                  ? "border-red-500/15 bg-red-500/[0.04]"
                  : "border-amber-500/10 bg-amber-500/[0.025]"
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    critical
                      ? "bg-red-400/10 text-red-400"
                      : "bg-amber-400/10 text-amber-400"
                  }`}
                >
                  <Icon size={15} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[11px] font-semibold text-white">
                      {alert.title}
                    </p>

                    <span
                      className={`shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase ${
                        critical
                          ? "bg-red-400/10 text-red-400"
                          : "bg-amber-400/10 text-amber-400"
                      }`}
                    >
                      {alert.type}
                    </span>
                  </div>

                  <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
                    {alert.detail}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[9px] font-medium text-slate-400">
                      {alert.worker}
                    </span>

                    <span className="h-1 w-1 rounded-full bg-slate-700" />

                    <span className="text-[9px] text-slate-600">
                      {alert.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeCriticalCount > 0 && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/[0.04] px-3 py-2.5">
          <AlertTriangle size={13} className="text-red-400" />

          <p className="text-[9px] text-slate-500">
            <span className="font-semibold text-red-400">
              {activeCriticalCount} critical alert{activeCriticalCount > 1 ? "s" : ""}
            </span>{" "}
            require{activeCriticalCount > 1 ? "" : "s"} immediate response.
          </p>
        </div>
      )}
    </div>
  );
}

export default AlertPanel;