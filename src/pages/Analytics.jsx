import { useMemo } from "react";
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Users,
  Activity,
  BrainCircuit,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { useMineContext } from "../context/MineDataContext";

function Analytics() {
  const { workers, zones, alerts, riskHistory, statistics } = useMineContext();

  const riskTrendData = useMemo(
    () => riskHistory.map((point) => ({ time: point.time, risk: point.score })),
    [riskHistory]
  );

  const zoneRiskData = useMemo(
    () => zones.map((zone) => ({ zone: zone.name, risk: Number((zone.safetyScore / 10).toFixed(1)) })),
    [zones]
  );

  const sensorActivityData = useMemo(() => {
    const countFactor = (key) => workers.filter((worker) => worker.factors.some((factor) => factor.key === key)).length;

    return [
      { name: "Gas", value: countFactor("gasRising") },
      { name: "Temp", value: countFactor("tempRising") },
      { name: "Motion", value: countFactor("abnormalMotion") },
      { name: "Battery", value: countFactor("lowBattery") },
      { name: "Signal", value: countFactor("weakSignal") },
    ];
  }, [workers]);

  const safetyScorePercent = (100 - statistics.overallSafetyScore).toFixed(1);
  const alertsToday = alerts.length;
  const activeAlerts = statistics.activeAlerts;

  const insight = zones.find((zone) => zone.hazardDetected);

  return (
    <div className="mx-auto max-w-[1700px] space-y-5">

      {/* HEADER */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Intelligence
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white">
          Analytics
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          AI-powered insights and historical safety analysis.
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Safety Score
            </p>

            <ShieldCheck
              size={18}
              className="text-emerald-400"
            />
          </div>

          <p className="mt-3 text-3xl font-bold text-white">
            {safetyScorePercent}%
          </p>

          <div className="mt-2 flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-400" />

            <span className="text-[9px] text-emerald-400">
              {statistics.overallBand}
            </span>

            <span className="text-[9px] text-slate-600">
              mine-wide
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Avg Risk
            </p>

            <Activity
              size={18}
              className="text-cyan-400"
            />
          </div>

          <p className="mt-3 text-3xl font-bold text-white">
            {statistics.overallRiskScore}
          </p>

          <p className="mt-2 text-[9px] text-emerald-400">
            {statistics.overallSafetyScore}/100 safety score
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Alerts Logged
            </p>

            <AlertTriangle
              size={18}
              className="text-amber-400"
            />
          </div>

          <p className="mt-3 text-3xl font-bold text-white">
            {alertsToday}
          </p>

          <p className="mt-2 text-[9px] text-amber-400">
            {activeAlerts} currently active
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Workers Monitored
            </p>

            <Users
              size={18}
              className="text-violet-400"
            />
          </div>

          <p className="mt-3 text-3xl font-bold text-white">
            {statistics.totalWorkers}
          </p>

          <p className="mt-2 text-[9px] text-slate-500">
            {statistics.safeWorkers} currently safe
          </p>
        </div>

      </div>

      {/* AI INSIGHT */}
      <div className={`rounded-2xl border p-5 ${insight ? "border-red-400/15 bg-red-400/[0.03]" : "border-cyan-400/10 bg-cyan-400/[0.03]"}`}>
        <div className="flex gap-4">

          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${insight ? "bg-red-400/10" : "bg-cyan-400/10"}`}>
            <BrainCircuit
              size={20}
              className={insight ? "text-red-400" : "text-cyan-400"}
            />
          </div>

          <div>
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${insight ? "text-red-400" : "text-cyan-400"}`}>
              AI Insight
            </p>

            <h3 className="mt-1 text-sm font-semibold text-white">
              {insight ? `Risk concentration detected in ${insight.name}` : "All zones operating within normal parameters"}
            </h3>

            <p className="mt-1 max-w-3xl text-[10px] leading-relaxed text-slate-500">
              {insight
                ? insight.hazardReason
                : "SafeMine AI is continuously analyzing gas, temperature, and motion trends across every zone. No sustained upward trend has been detected."}
            </p>
          </div>

        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        {/* RISK TREND */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">

          <div>
            <h3 className="text-sm font-semibold text-white">
              Risk Trend
            </h3>

            <p className="mt-1 text-[10px] text-slate-600">
              Average mine-wide risk score over time
            </p>
          </div>

          <div className="mt-5 h-[280px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart data={riskTrendData}>

                <defs>
                  <linearGradient
                    id="riskGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#34d399"
                      stopOpacity={0.25}
                    />

                    <stop
                      offset="100%"
                      stopColor="#34d399"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />

                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#475569",
                    fontSize: 9,
                  }}
                />

                <YAxis
                  domain={[0, 10]}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#475569",
                    fontSize: 9,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#111925",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    fontSize: "10px",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="#34d399"
                  strokeWidth={2}
                  fill="url(#riskGradient)"
                />

              </AreaChart>
            </ResponsiveContainer>

          </div>
        </div>

        {/* ZONE RISK */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">

          <div>
            <h3 className="text-sm font-semibold text-white">
              Risk By Zone
            </h3>

            <p className="mt-1 text-[10px] text-slate-600">
              Current average risk score by mine zone
            </p>
          </div>

          <div className="mt-5 h-[280px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={zoneRiskData}>

                <CartesianGrid
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />

                <XAxis
                  dataKey="zone"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#475569",
                    fontSize: 9,
                  }}
                />

                <YAxis
                  domain={[0, 10]}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#475569",
                    fontSize: 9,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#111925",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    fontSize: "10px",
                  }}
                />

                <Bar
                  dataKey="risk"
                  fill="#22d3ee"
                  radius={[5, 5, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>
        </div>

      </div>

      {/* SENSOR ACTIVITY */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">

        <div>
          <h3 className="text-sm font-semibold text-white">
            Sensor Activity
          </h3>

          <p className="mt-1 text-[10px] text-slate-600">
            Number of workers currently contributing each risk factor
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">

          {sensorActivityData.map((sensor) => (
            <div
              key={sensor.name}
              className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-4"
            >
              <p className="text-[9px] text-slate-500">
                {sensor.name}
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {sensor.value}
              </p>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-cyan-400"
                  style={{
                    width: `${Math.min(
                      (sensor.value / Math.max(statistics.totalWorkers, 1)) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}

export default Analytics;
