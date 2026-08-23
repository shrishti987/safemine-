import {
  AlertOctagon,
  BellRing,
  ChevronRight,
  Flame,
  ShieldAlert,
  Siren,
  X,
} from "lucide-react";

function EmergencyPanel({
  alerts = [],
  onAcknowledge,
  onDismiss,
  onEmergencyAction,
  
}) {
  const criticalAlerts = alerts.filter((alert) => {
    const severity =
      alert?.severity ||
      alert?.type;

    return (
      severity === "Critical" &&
      !alert?.acknowledged &&
      alert?.status !== "Resolved"
    );
  });

  const hasEmergency =
    criticalAlerts.length > 0;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${
        hasEmergency
          ? "border-red-400/25 bg-red-500/[0.035]"
          : "border-white/[0.06] bg-[#0c121c]"
      }`}
    >
      {/* ALERT GLOW */}
      {hasEmergency && (
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-500/10 blur-3xl" />
      )}

      {/* HEADER */}
      <div className="relative flex items-center justify-between border-b border-white/[0.05] p-4">

        <div className="flex items-center gap-3">

          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              hasEmergency
                ? "bg-red-400/10"
                : "bg-emerald-400/10"
            }`}
          >
            {hasEmergency ? (
              <Siren
                size={19}
                className="text-red-400"
              />
            ) : (
              <ShieldAlert
                size={19}
                className="text-emerald-400"
              />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">

              <h2 className="text-sm font-semibold text-white">
                Emergency Response
              </h2>

              {hasEmergency && (
                <span className="flex items-center gap-1 rounded-md bg-red-400/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-red-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
                  Active
                </span>
              )}

            </div>

            <p className="mt-1 text-[9px] text-slate-600">
              {hasEmergency
                ? `${criticalAlerts.length} critical event${
                    criticalAlerts.length > 1
                      ? "s"
                      : ""
                  } require immediate attention`
                : "No critical emergencies detected"}
            </p>
          </div>

        </div>

        <div
          className={`flex h-8 min-w-8 items-center justify-center rounded-lg text-xs font-bold ${
            hasEmergency
              ? "bg-red-400/10 text-red-400"
              : "bg-emerald-400/10 text-emerald-400"
          }`}
        >
          {criticalAlerts.length}
        </div>

      </div>

      {/* CONTENT */}
      <div className="relative p-4">

        {hasEmergency ? (
          <div className="space-y-3">

            {/* MAIN WARNING */}
            <div className="flex items-start gap-3 rounded-xl border border-red-400/15 bg-red-400/[0.04] p-3">

              <div className="mt-0.5 shrink-0">
                <AlertOctagon
                  size={17}
                  className="text-red-400"
                />
              </div>

              <div className="min-w-0">

                <p className="text-[10px] font-semibold text-red-300">
                  Immediate Safety Intervention Required
                </p>

                <p className="mt-1 text-[9px] leading-4 text-slate-500">
                  Critical safety conditions have been detected.
                  Verify the affected worker and initiate the
                  appropriate emergency response procedure.
                </p>

              </div>

            </div>

            {/* CRITICAL ALERTS */}
            <div className="space-y-2">

              {criticalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] p-3"
                >

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-400/10">
                      <Flame
                        size={14}
                        className="text-red-400"
                      />
                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-[10px] font-semibold text-white">
                        {alert.title ||
                          "Critical Safety Alert"}
                      </p>

                      <p className="mt-0.5 truncate text-[9px] text-slate-600">
                        {alert.worker
                          ? `${alert.worker} • `
                          : ""}
                        {alert.zone || "Unknown Zone"}
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onAcknowledge?.(alert.id)
                    }
                    className="shrink-0 rounded-lg border border-red-400/15 px-2.5 py-1.5 text-[8px] font-semibold text-red-400 transition hover:bg-red-400/10"
                  >
                    Acknowledge
                  </button>

                </div>
              ))}

            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

              <button
                type="button"
                onClick={() =>
                  onEmergencyAction?.("evacuate")
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-[10px] font-bold text-white transition hover:bg-red-400"
              >
                <Siren size={14} />
                Initiate Evacuation
              </button>

              <button
                type="button"
                onClick={() =>
                  onEmergencyAction?.("notify")
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-2.5 text-[10px] font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                <BellRing size={14} />
                Notify Safety Team
              </button>

            </div>

          </div>
        ) : (
          /* SAFE STATE */
          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10">
                <ShieldAlert
                  size={16}
                  className="text-emerald-400"
                />
              </div>

              <div>
                <p className="text-[10px] font-semibold text-white">
                  Mine operating normally
                </p>

                <p className="mt-1 text-[9px] text-slate-600">
                  No critical safety events require intervention.
                </p>
              </div>

            </div>

            <div className="hidden items-center gap-1 text-[9px] font-semibold text-emerald-400 sm:flex">
              All Clear
              <ChevronRight size={12} />
            </div>

          </div>
        )}

      </div>

      {/* DISMISS */}
      {hasEmergency &&
        typeof onDismiss === "function" && (
          <button
            type="button"
            onClick={onDismiss}
            className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-600 transition hover:bg-white/[0.05] hover:text-white"
            aria-label="Dismiss emergency panel"
          >
            <X size={13} />
          </button>
        )}

    </div>
  );
}

export default EmergencyPanel;