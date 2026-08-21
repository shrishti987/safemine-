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

const riskData = [
  { time: "18:00", risk: 2.1 },
  { time: "19:00", risk: 2.4 },
  { time: "20:00", risk: 2.8 },
  { time: "21:00", risk: 3.1 },
  { time: "22:00", risk: 2.7 },
  { time: "23:00", risk: 3.2 },
];

const zoneData = [
  { zone: "Zone A", risk: 1.8 },
  { zone: "Zone B", risk: 4.2 },
  { zone: "Zone C", risk: 6.7 },
  { zone: "Zone D", risk: 2.4 },
  { zone: "Zone E", risk: 3.1 },
];

const sensorData = [
  { name: "Gas", value: 18 },
  { name: "Temp", value: 32 },
  { name: "Pressure", value: 12 },
  { name: "Motion", value: 21 },
  { name: "Impact", value: 4 },
];

function Analytics() {
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
            94.8%
          </p>

          <div className="mt-2 flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-400" />

            <span className="text-[9px] text-emerald-400">
              +3.4%
            </span>

            <span className="text-[9px] text-slate-600">
              this week
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
            3.2
          </p>

          <p className="mt-2 text-[9px] text-emerald-400">
            Low risk range
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Alerts Today
            </p>

            <AlertTriangle
              size={18}
              className="text-amber-400"
            />
          </div>

          <p className="mt-3 text-3xl font-bold text-white">
            20
          </p>

          <p className="mt-2 text-[9px] text-amber-400">
            3 currently active
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
            128
          </p>

          <p className="mt-2 text-[9px] text-slate-500">
            124 currently online
          </p>
        </div>

      </div>

      {/* AI INSIGHT */}
      <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-5">
        <div className="flex gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10">
            <BrainCircuit
              size={20}
              className="text-cyan-400"
            />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
              AI Insight
            </p>

            <h3 className="mt-1 text-sm font-semibold text-white">
              Risk concentration detected in Zone C
            </h3>

            <p className="mt-1 max-w-3xl text-[10px] leading-relaxed text-slate-500">
              SafeMine AI has identified increased environmental
              risk in Zone C. Gas concentration and temperature
              readings are slightly above the mine-wide average.
              Increased monitoring is recommended.
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
              Average AI risk score over the last 6 hours
            </p>
          </div>

          <div className="mt-5 h-[280px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart data={riskData}>

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
              <BarChart data={zoneData}>

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
            Number of abnormal readings detected today
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">

          {sensorData.map((sensor) => (
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
                      sensor.value * 3,
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