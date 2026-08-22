import { useMemo } from "react";
import {
  Wind,
  Thermometer,
  Move3d,
  Gauge,
  CircleAlert,
  Play,
  Square,
  RotateCcw,
  Siren,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { useMineContext } from "../context/MineDataContext";
import StatCard from "../components/dashboard/StatCard";
import RiskScore from "../components/dashboard/RiskScore";
import MineMap from "../components/dashboard/MineMap";
import AlertPanel from "../components/dashboard/AlertPanel";
import SensorOverview from "../components/dashboard/SensorOverview";
import WorkerStatus from "../components/dashboard/WorkerStatus";
import RiskChart from "../components/dashboard/RiskChart";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";

const bandVariant = {
  SAFE: "success",
  MODERATE: "warning",
  HIGH: "orange",
  CRITICAL: "danger",
};

function Dashboard() {
  const {
    workers,
    zones,
    alerts,
    statistics,
    riskHistory,
    simulation,
    startSimulation,
    stopSimulation,
    resetSimulation,
  } = useMineContext();

  const hazardZone = zones.find((zone) => zone.hazardDetected);

  const mapWorkers = useMemo(
    () =>
      workers.map((worker) => ({
        id: worker.id,
        x: worker.position.x,
        y: worker.position.y,
        status: worker.status.toLowerCase(),
      })),
    [workers]
  );

  const panelAlerts = useMemo(
    () =>
      alerts.slice(0, 4).map((alert) => ({
        id: alert.id,
        worker: alert.workerId,
        title: alert.title,
        detail: alert.message,
        time: new Date(alert.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        type: alert.type === "Critical" ? "critical" : "warning",
        icon: alert.type === "Critical" ? Siren : AlertTriangle,
      })),
    [alerts]
  );

  const criticalAlertCount = alerts.filter((alert) => alert.type === "Critical" && !alert.acknowledged).length;

  const topRiskWorkers = useMemo(
    () =>
      [...workers]
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 4)
        .map((worker) => ({
          id: worker.id,
          name: worker.name,
          zone: worker.zone,
          risk: worker.riskScore,
          status: worker.status,
        })),
    [workers]
  );

  const riskTrendData = useMemo(
    () => riskHistory.map((point) => ({ time: point.time, risk: point.score })),
    [riskHistory]
  );

  const liveSensors = useMemo(() => {
    const count = workers.length || 1;
    const avgGas = workers.reduce((total, worker) => total + worker.gas, 0) / count;
    const avgTemperature = workers.reduce((total, worker) => total + worker.temperature, 0) / count;
    const avgMotion = workers.reduce((total, worker) => total + worker.motion, 0) / count;

    return [
      {
        name: "Gas",
        value: avgGas.toFixed(1),
        unit: "ppm",
        status: avgGas > 50 ? "Elevated" : "Normal",
        icon: Wind,
        color: avgGas > 50 ? "cyan" : "emerald",
      },
      {
        name: "Temperature",
        value: avgTemperature.toFixed(1),
        unit: "°C",
        status: avgTemperature > 38 ? "Elevated" : "Normal",
        icon: Thermometer,
        color: "emerald",
      },
      {
        name: "Pressure",
        value: "1.02",
        unit: "bar",
        status: "Stable",
        icon: Gauge,
        color: "cyan",
      },
      {
        name: "Motion",
        value: avgMotion.toFixed(2),
        unit: "g",
        status: avgMotion > 0.5 ? "Abnormal" : "Normal",
        icon: Move3d,
        color: "emerald",
      },
      {
        name: "Impact",
        value: String(statistics.criticalWorkers),
        unit: "critical",
        status: statistics.criticalWorkers > 0 ? "Requires attention" : "No impact",
        icon: CircleAlert,
        color: "emerald",
      },
    ];
  }, [workers, statistics.criticalWorkers]);

  return (
    <div className="mx-auto max-w-[1700px] space-y-5">

      {/* PAGE HEADER + SIMULATION CONTROL */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Command Center
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Mine Safety Dashboard
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Real-time monitoring, zone risk, and predictive safety intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {simulation.active ? (
            <>
              <span className="flex items-center gap-1.5 rounded-lg border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2 text-[10px] font-semibold text-amber-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                Simulation running — stage {simulation.stage + 1}/{simulation.stageCount}
              </span>

              <Button size="sm" variant="secondary" icon={Square} onClick={stopSimulation}>
                Stop
              </Button>

              <Button size="sm" variant="ghost" icon={RotateCcw} onClick={resetSimulation}>
                Reset
              </Button>
            </>
          ) : (
            <Button size="sm" variant="danger" icon={Play} onClick={startSimulation}>
              Start Safety Simulation
            </Button>
          )}
        </div>
      </div>

      {/* ZONE HAZARD BANNER */}
      {hazardZone && (
        <div className="flex items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-400/10">
            <ShieldAlert size={19} className="text-red-400" />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-red-400">
              Environmental Hazard
            </p>
            <p className="mt-0.5 text-xs font-medium text-white">{hazardZone.hazardReason}</p>
          </div>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard type="workers" title="Total Workers" value={String(statistics.totalWorkers)} subtitle="registered workers" />
        <StatCard type="safe" title="Safe" value={String(statistics.safeWorkers)} subtitle="within normal range" />
        <StatCard type="warning" title="At Risk" value={String(statistics.atRiskWorkers)} subtitle="require monitoring" />
        <StatCard type="critical" title="Critical" value={String(statistics.criticalWorkers)} subtitle="immediate response" />
        <StatCard type="alerts" title="Active Alerts" value={String(statistics.activeAlerts)} subtitle="unacknowledged" />
        <StatCard type="zones" title="High-Risk Zones" value={String(statistics.highRiskZones)} subtitle="of 3 zones" />
      </div>

      {/* COMMAND SUMMARY */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Mine Risk Level</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={bandVariant[statistics.overallBand]} dot>{statistics.overallBand}</Badge>
            <span className="text-xs text-slate-500">{statistics.overallSafetyScore}/100</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Highest-Risk Zone</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs font-semibold text-white">{statistics.highestRiskZone?.name || "--"}</span>
            {statistics.highestRiskZone && (
              <Badge variant={bandVariant[statistics.highestRiskZone.band]}>{statistics.highestRiskZone.band}</Badge>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Highest-Risk Worker</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs font-semibold text-white">{statistics.highestRiskWorker?.name || "--"}</span>
            {statistics.highestRiskWorker && (
              <Badge variant={bandVariant[statistics.highestRiskWorker.band]}>{statistics.highestRiskWorker.band}</Badge>
            )}
          </div>
        </div>
      </div>

      {/* LIVE MAP + RISK + ALERTS */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_330px]">
        <MineMap workers={mapWorkers} />

        <div className="space-y-5">
          <RiskScore score={statistics.overallRiskScore} />
          <AlertPanel alerts={panelAlerts} criticalCount={criticalAlertCount} />
        </div>
      </div>

      {/* SENSOR OVERVIEW */}
      <SensorOverview sensors={liveSensors} />

      {/* ANALYTICS */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <RiskChart data={riskTrendData} />
        <WorkerStatus workers={topRiskWorkers} />
      </div>

    </div>
  );
}

export default Dashboard;
