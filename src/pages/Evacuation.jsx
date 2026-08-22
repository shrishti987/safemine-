import { useState } from "react";
import {
  Route,
  Navigation,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Megaphone,
  Users,
  MapPin,
} from "lucide-react";
import { useMineContext } from "../context/MineDataContext";
import EmergencyPanel from "../components/alerts/EmergencyPanel";
import Badge from "../components/common/Badge";

const bandVariant = {
  SAFE: "success",
  MODERATE: "warning",
  HIGH: "orange",
  CRITICAL: "danger",
};

const recommendedAction = {
  CRITICAL: "Evacuate the zone immediately via the nearest surface route.",
  HIGH: "Prepare for evacuation and increase monitoring frequency.",
  MODERATE: "Continue close monitoring — no evacuation required yet.",
  SAFE: "No action required. Zone is operating normally.",
};

function toEmergencyAlertShape(alert) {
  return {
    id: alert.id,
    title: alert.title,
    severity: alert.type,
    worker: alert.worker,
    zone: alert.zone,
    acknowledged: alert.acknowledged,
    status: alert.acknowledged ? "Resolved" : undefined,
  };
}

function Evacuation() {
  const { alerts, zones, workers, acknowledgeAlert } = useMineContext();
  const [evacuationActive, setEvacuationActive] = useState(false);
  const [routeBroadcasted, setRouteBroadcasted] = useState(false);

  const hazardZone = zones.find((zone) => zone.hazardDetected)
    || zones.find((zone) => zone.band === "CRITICAL")
    || zones.find((zone) => zone.band === "HIGH");

  const targetZone = hazardZone || zones.find((zone) => zone.id === "Zone C") || zones[0];
  const zoneWorkers = workers.filter((worker) => worker.zone === targetZone?.id);
  const affectedWorkers = zoneWorkers.filter((worker) => worker.status !== "Safe");
  const leadWorker = affectedWorkers[0] || zoneWorkers[0];

  const handleBroadcast = () => {
    setRouteBroadcasted(true);
    setTimeout(() => setRouteBroadcasted(false), 2500);
  };

  const handleEmergencyAction = (action) => {
    if (action === "evacuate") {
      setEvacuationActive(true);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-400">
          Emergency Response
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white">
          Evacuation & Emergency Response
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          AI-recommended evacuation routing and zone-level decision support.
        </p>
      </div>

      <EmergencyPanel
        alerts={alerts.map(toEmergencyAlertShape)}
        onAcknowledge={acknowledgeAlert}
        onEmergencyAction={handleEmergencyAction}
      />

      {/* AFFECTED ZONE SUMMARY */}
      <div
        className={`rounded-2xl border p-5 ${
          targetZone?.hazardDetected
            ? "border-red-500/20 bg-red-500/[0.04]"
            : "border-white/[0.06] bg-[#0c121c]"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-slate-400" />
            <h3 className="text-sm font-semibold text-white">
              Affected Zone: {targetZone?.name || "--"}
            </h3>
          </div>

          {targetZone && <Badge variant={bandVariant[targetZone.band]} dot>{targetZone.band}</Badge>}
        </div>

        <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
          {targetZone?.hazardReason || "No active environmental hazard detected. Showing standard protocol for this zone."}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">
            <p className="text-[9px] uppercase text-slate-600">Workers in Zone</p>
            <p className="mt-1 text-lg font-bold text-white">{zoneWorkers.length}</p>
          </div>

          <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">
            <p className="text-[9px] uppercase text-slate-600">Need Attention</p>
            <p className="mt-1 text-lg font-bold text-amber-400">{affectedWorkers.length}</p>
          </div>

          <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">
            <p className="text-[9px] uppercase text-slate-600">Zone Risk</p>
            <p className="mt-1 text-lg font-bold text-white">{targetZone?.safetyScore ?? "--"}/100</p>
          </div>

          <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">
            <p className="text-[9px] uppercase text-slate-600">Avg Gas</p>
            <p className="mt-1 text-lg font-bold text-white">{targetZone?.avgGas ?? "--"} ppm</p>
          </div>
        </div>

        {affectedWorkers.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {affectedWorkers.map((worker) => (
              <span
                key={worker.id}
                className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 text-[10px] text-slate-300"
              >
                <Users size={11} className="text-slate-500" />
                {worker.name} · {worker.status}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-cyan-400/[0.05] p-3">
          <ShieldAlert size={14} className="text-cyan-400" />
          <p className="text-[10px] text-slate-300">
            <span className="font-semibold text-cyan-400">Recommended action:</span>{" "}
            {recommendedAction[targetZone?.band] || recommendedAction.SAFE}
          </p>
        </div>
      </div>

      {/* ROUTE VISUALIZATION */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_350px]">
        <div className="relative h-[450px] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c121c]">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute left-[10%] top-[20%] h-1 w-[75%] rotate-12 bg-slate-600" />
            <div className="absolute left-[15%] top-[55%] h-1 w-[70%] -rotate-12 bg-slate-600" />
            <div className="absolute left-[25%] top-[30%] h-[55%] w-1 rotate-[15deg] bg-slate-600" />
          </div>

          <div className="absolute left-[20%] top-[30%] rounded-full bg-red-500/20 p-3">
            <ShieldAlert className="text-red-400" size={20} />
          </div>

          <div className="absolute right-[20%] bottom-[20%] rounded-full bg-emerald-500/20 p-3">
            <Navigation className="text-emerald-400" size={20} />
          </div>

          <div className="absolute left-[22%] top-[33%] h-[220px] w-[55%] rotate-[18deg] border-t-2 border-dashed border-emerald-400/60" />

          <div className="absolute bottom-5 left-5 rounded-xl border border-white/[0.06] bg-[#0c121c]/90 px-4 py-3 backdrop-blur">
            <p className="text-[9px] text-slate-600">OPTIMAL ROUTE</p>
            <p className="mt-1 text-sm font-bold text-emerald-400">
              248 meters
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center gap-2">
            <Route size={17} className="text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">
              Evacuation Path
            </h3>
          </div>

          <div className="mt-6 space-y-5">
            {[
              ["Current Location", `${targetZone?.name || "--"} — Worker ${leadWorker?.id || "N/A"}`],
              ["Nearest Junction", `Junction ${targetZone?.id?.slice(-1) || "C"}4`],
              ["Safe Route", `Tunnel ${targetZone?.id?.slice(-1) || "C"}4 → Main Shaft`],
              ["Exit", "Surface Gate 01"],
            ].map(([label, value], index) => (
              <div key={label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/10 text-[9px] font-bold text-emerald-400">
                    {index + 1}
                  </div>

                  {index < 3 && (
                    <div className="mt-1 h-7 w-px bg-slate-800" />
                  )}
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-600">
                    {label}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-white">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-xl bg-emerald-400/[0.05] p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span className="text-[10px] font-semibold text-emerald-400">
                Route verified
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px]">
              <span className="text-slate-500">Estimated time</span>
              <span className="font-semibold text-white">3m 12s</span>
            </div>
          </div>

          <button
            onClick={() => setEvacuationActive((current) => !current)}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition ${
              evacuationActive
                ? "bg-emerald-500 text-white hover:bg-emerald-400"
                : "bg-red-500 text-white hover:bg-red-400"
            }`}
          >
            {evacuationActive && (
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            )}
            {evacuationActive ? "Evacuation Active" : "Start Evacuation"}
          </button>

          <button
            onClick={handleBroadcast}
            disabled={routeBroadcasted}
            className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-xs transition ${
              routeBroadcasted
                ? "border-emerald-400/30 bg-emerald-400/[0.06] text-emerald-400"
                : "border-white/[0.07] text-slate-300 hover:bg-white/[0.04]"
            }`}
          >
            {routeBroadcasted ? (
              <>
                <Megaphone size={14} />
                Route Broadcasted
              </>
            ) : (
              <>
                Broadcast Route
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Evacuation;
