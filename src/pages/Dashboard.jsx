import StatCard from "../components/dashboard/StatCard";
import RiskScore from "../components/dashboard/RiskScore";
import MineMap from "../components/dashboard/MineMap";
import AlertPanel from "../components/dashboard/AlertPanel";
import SensorOverview from "../components/dashboard/SensorOverview";
import WorkerStatus from "../components/dashboard/WorkerStatus";
import RiskChart from "../components/dashboard/RiskChart";

function Dashboard() {
  return (
    <div className="mx-auto max-w-[1700px] space-y-5">

      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Overview
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Mine Safety Dashboard
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Real-time monitoring and AI-powered worker safety intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-600">
            Last updated
          </span>

          <span className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[10px] text-slate-400">
            Just now
          </span>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          type="workers"
          title="Workers Online"
          value="124"
          subtitle="of 128 registered workers"
          trend="up"
          trendValue="+4.2%"
        />

        <StatCard
          type="safe"
          title="Workers Safe"
          value="118"
          subtitle="95.2% of active workers"
          trend="up"
          trendValue="+1.8%"
        />

        <StatCard
          type="warning"
          title="Warnings"
          value="3"
          subtitle="Require attention"
          trend="down"
          trendValue="-2"
        />

        <StatCard
          type="critical"
          title="Critical Alerts"
          value="1"
          subtitle="Immediate response required"
          trend="down"
          trendValue="-1"
        />

      </div>

      {/* LIVE MAP + RISK + ALERTS */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_330px]">

        <MineMap />

        <div className="space-y-5">
          <RiskScore score={3.2} />

          <AlertPanel />
        </div>

      </div>

      {/* SENSOR OVERVIEW */}
      <SensorOverview />

      {/* ANALYTICS */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        <RiskChart />

        <WorkerStatus />

      </div>

    </div>
  );
}

export default Dashboard;