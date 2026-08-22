import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const defaultData = [
  { time: "18:00", risk: 2.1 },
  { time: "19:00", risk: 2.4 },
  { time: "20:00", risk: 2.8 },
  { time: "21:00", risk: 3.1 },
  { time: "21:30", risk: 2.7 },
  { time: "22:00", risk: 3.2 },
  { time: "22:30", risk: 3.2 },
];

function RiskChart({ data = defaultData }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Risk Trend
          </h3>

          <p className="mt-1 text-[10px] text-slate-600">
            Average AI risk score over time
          </p>
        </div>

        <select className="rounded-lg border border-white/[0.06] bg-[#111925] px-2.5 py-1.5 text-[9px] text-slate-400 outline-none">
          <option>Last 6 hours</option>
          <option>Last 24 hours</option>
          <option>Last 7 days</option>
        </select>
      </div>

      <div className="mt-5 h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                fontSize: "10px",
              }}
              labelStyle={{
                color: "#94a3b8",
              }}
            />

            <Line
              type="monotone"
              dataKey="risk"
              stroke="#34d399"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                fill: "#34d399",
                stroke: "#0c121c",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RiskChart;