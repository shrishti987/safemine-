import { useState } from "react";
import {
  MapPin,
  Maximize2,
  Navigation,
  Users,
  Radio,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Siren,
  Eye,
} from "lucide-react";
import { useMineContext } from "../context/MineDataContext";
import Modal from "../components/common/Modal";
import Badge from "../components/common/Badge";
import WorkerDetails from "../components/workers/WorkerDetails";

const zoneFilters = ["All", "Zone A", "Zone B", "Zone C"];

const statusStyles = {
  Safe: {
    ring: "border-emerald-400 bg-emerald-400/20",
    glow: "bg-emerald-400",
    icon: "text-emerald-400",
    chip: "bg-emerald-400/10",
  },
  Warning: {
    ring: "border-amber-400 bg-amber-400/20",
    glow: "bg-amber-400",
    icon: "text-amber-400",
    chip: "bg-amber-400/10",
  },
  Critical: {
    ring: "border-red-400 bg-red-400/20",
    glow: "bg-red-400",
    icon: "text-red-400",
    chip: "bg-red-400/10",
  },
  Offline: {
    ring: "border-slate-500 bg-slate-500/20",
    glow: "bg-slate-500",
    icon: "text-slate-500",
    chip: "bg-slate-500/10",
  },
};

const bandVariant = {
  SAFE: "success",
  MODERATE: "warning",
  HIGH: "orange",
  CRITICAL: "danger",
};

function LiveMine() {
  const { workers, zones } = useMineContext();
  const [activeZone, setActiveZone] = useState("All");
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [detailWorkerId, setDetailWorkerId] = useState(null);

  const detailWorker = workers.find((worker) => worker.id === detailWorkerId) || null;

  const visibleWorkers = workers.filter(
    (worker) => activeZone === "All" || worker.zone === activeZone
  );

  const zonesActive = new Set(workers.map((worker) => worker.zone)).size;

  const avgSignal = Math.round(
    workers.reduce((total, worker) => total + worker.signal, 0) / workers.length
  );

  const criticalCount = workers.filter((worker) => worker.status === "Critical").length;

  return (
    <div className="mx-auto max-w-[1700px] space-y-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
          Live Tracking
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white">Live Mine</h1>
        <p className="mt-1 text-xs text-slate-500">
          Real-time underground worker positioning across all zones.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <Users className="text-emerald-400" size={20} />
          <p className="mt-3 text-[10px] uppercase text-slate-500">
            Workers Underground
          </p>
          <p className="mt-1 text-3xl font-bold text-white">{workers.length}</p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <Layers className="text-cyan-400" size={20} />
          <p className="mt-3 text-[10px] uppercase text-slate-500">Active Zones</p>
          <p className="mt-1 text-3xl font-bold text-white">{zonesActive}</p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <Radio className="text-cyan-400" size={20} />
          <p className="mt-3 text-[10px] uppercase text-slate-500">Avg. Signal</p>
          <p className="mt-1 text-3xl font-bold text-white">{avgSignal}%</p>
        </div>

        <div
          className={`rounded-2xl border p-5 ${
            criticalCount > 0
              ? "border-red-500/10 bg-red-500/[0.04]"
              : "border-white/[0.06] bg-[#0c121c]"
          }`}
        >
          <Siren
            className={criticalCount > 0 ? "text-red-400" : "text-slate-500"}
            size={20}
          />
          <p className="mt-3 text-[10px] uppercase text-slate-500">
            Critical Beacons
          </p>
          <p
            className={`mt-1 text-3xl font-bold ${
              criticalCount > 0 ? "text-red-400" : "text-white"
            }`}
          >
            {criticalCount}
          </p>
        </div>
      </div>

      {/* PER-ZONE BREAKDOWN */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className={`rounded-2xl border p-5 ${
              zone.hazardDetected
                ? "border-red-500/20 bg-red-500/[0.04]"
                : "border-white/[0.06] bg-[#0c121c]"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">{zone.name}</h3>
              <Badge variant={bandVariant[zone.band]} dot>{zone.band}</Badge>
            </div>

            <p className="mt-1 text-[10px] text-slate-500">
              👷 {zone.workerCount} Workers
            </p>

            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-[10px]">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Safe
                <span className="ml-auto font-semibold text-white">{zone.safeCount}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Warning
                <span className="ml-auto font-semibold text-white">{zone.warningCount}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                Critical
                <span className="ml-auto font-semibold text-white">{zone.criticalCount}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                Offline
                <span className="ml-auto font-semibold text-white">{zone.offlineCount}</span>
              </div>
            </div>

            {zone.hazardDetected && (
              <p className="mt-3 text-[9px] font-medium leading-relaxed text-red-400">
                ⚠ {zone.hazardReason}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Mine Map</h3>

              <span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                LIVE
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {zoneFilters.map((zone) => (
                <button
                  key={zone}
                  onClick={() => setActiveZone(zone)}
                  className={`rounded-lg px-3 py-1.5 text-[10px] font-medium transition ${
                    activeZone === zone
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-slate-500 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {zone}
                </button>
              ))}

              <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] text-slate-500 hover:bg-white/[0.04] hover:text-white">
                <Maximize2 size={13} />
              </button>
            </div>
          </div>

          <div className="relative mt-5 h-[500px] overflow-hidden rounded-xl border border-white/[0.05] bg-[#080d15]">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute left-[8%] top-[15%] h-[2px] w-[80%] rotate-[12deg] bg-slate-600" />
              <div className="absolute left-[15%] top-[45%] h-[2px] w-[70%] rotate-[-15deg] bg-slate-600" />
              <div className="absolute left-[25%] top-[75%] h-[2px] w-[65%] rotate-[8deg] bg-slate-600" />
              <div className="absolute left-[20%] top-[8%] h-[90%] w-[2px] rotate-[18deg] bg-slate-700" />
              <div className="absolute left-[60%] top-[5%] h-[90%] w-[2px] rotate-[-14deg] bg-slate-700" />
            </div>

            <span className="absolute left-5 top-5 text-[9px] uppercase tracking-[0.15em] text-slate-700">
              Zone A
            </span>
            <span className="absolute right-8 top-24 text-[9px] uppercase tracking-[0.15em] text-slate-700">
              Zone B
            </span>
            <span className="absolute bottom-10 left-16 text-[9px] uppercase tracking-[0.15em] text-slate-700">
              Zone C
            </span>

            {visibleWorkers.map((worker) => {
              const style = statusStyles[worker.status] || statusStyles.Safe;
              const selected = selectedWorker === worker.id;

              return (
                <button
                  key={worker.id}
                  onClick={() =>
                    setSelectedWorker(selected ? null : worker.id)
                  }
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: worker.position.x, top: worker.position.y }}
                >
                  <div
                    className={`absolute -inset-2 rounded-full opacity-20 blur-sm ${style.glow}`}
                  />

                  <div
                    className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 transition-transform ${
                      selected ? "scale-125" : ""
                    } ${style.ring}`}
                  >
                    <MapPin size={13} className={style.icon} />
                  </div>

                  <span className="absolute left-1/2 top-8 -translate-x-1/2 whitespace-nowrap text-[8px] font-medium text-slate-500">
                    {worker.id}
                  </span>
                </button>
              );
            })}

            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#0c121c]/90 px-3 py-2 backdrop-blur">
              <Navigation size={12} className="text-emerald-400" />
              <span className="text-[9px] text-slate-400">Main Shaft</span>
            </div>

            <div className="absolute bottom-4 right-4 flex gap-3 rounded-lg border border-white/[0.06] bg-[#0c121c]/90 px-3 py-2 backdrop-blur">
              <span className="flex items-center gap-1 text-[8px] text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Safe
              </span>
              <span className="flex items-center gap-1 text-[8px] text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Warning
              </span>
              <span className="flex items-center gap-1 text-[8px] text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                Critical
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <h3 className="text-sm font-semibold text-white">On-Site Workers</h3>
          <p className="mt-1 text-[10px] text-slate-600">
            {visibleWorkers.length} tracked in view
          </p>

          <div className="mt-4 max-h-[440px] space-y-2 overflow-y-auto pr-1">
            {visibleWorkers.map((worker) => {
              const style = statusStyles[worker.status] || statusStyles.Safe;
              const selected = selectedWorker === worker.id;

              return (
                <button
                  key={worker.id}
                  onClick={() =>
                    setSelectedWorker(selected ? null : worker.id)
                  }
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                    selected
                      ? "border-emerald-400/30 bg-emerald-400/[0.06]"
                      : "border-white/[0.05] hover:bg-white/[0.02]"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.chip}`}
                  >
                    {worker.status === "Critical" ? (
                      <Siren size={14} className={style.icon} />
                    ) : worker.status === "Warning" ? (
                      <AlertTriangle size={14} className={style.icon} />
                    ) : (
                      <ShieldCheck size={14} className={style.icon} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-white">
                      {worker.name}
                    </p>
                    <p className="text-[9px] text-slate-600">
                      {worker.id} · {worker.zone}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] text-slate-500">{worker.signal}%</p>
                    <p className="text-[9px] text-slate-600">
                      {Math.round(worker.battery)}% bat.
                    </p>
                  </div>

                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation();
                      setDetailWorkerId(worker.id);
                    }}
                    className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-white/[0.06] hover:text-white"
                  >
                    <Eye size={13} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Modal
        isOpen={Boolean(detailWorker)}
        onClose={() => setDetailWorkerId(null)}
        size="lg"
        showClose={false}
      >
        {detailWorker && (
          <WorkerDetails
            worker={detailWorker}
            onClose={() => setDetailWorkerId(null)}
            onAcknowledge={() => setDetailWorkerId(null)}
          />
        )}
      </Modal>
    </div>
  );
}

export default LiveMine;
