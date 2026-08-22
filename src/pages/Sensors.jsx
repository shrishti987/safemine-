import { useMemo, useState } from "react";
import {
  Wind,
  Thermometer,
  Gauge,
  Move3d,
  CircleAlert,
  Radio,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMineContext } from "../context/MineDataContext";
import SensorCard from "../components/sensors/SensorCard";
import Badge from "../components/common/Badge";

const bandVariant = {
  SAFE: "success",
  MODERATE: "warning",
  HIGH: "orange",
  CRITICAL: "danger",
};

function toSensorShape(worker) {
  return {
    id: worker.helmetId,
    helmetId: worker.helmetId,
    zone: worker.zone,
    gas: {
      value: worker.gas,
      unit: "ppm",
      status: worker.gas > 50 ? "Critical" : worker.gas > 35 ? "Warning" : "Normal",
      threshold: 50,
    },
    temperature: {
      value: worker.temperature,
      unit: "°C",
      status: worker.temperature > 40 ? "Warning" : "Normal",
      threshold: 40,
    },
    motion: {
      value: worker.motion,
      unit: "g",
      status: worker.motion > 0.5 ? "Warning" : "Normal",
      threshold: 0.5,
    },
    battery: {
      value: Math.round(worker.battery),
      unit: "%",
      status: worker.battery < 30 ? "Critical" : "Good",
      threshold: 30,
    },
    signal: {
      value: Math.round(worker.signal),
      unit: "%",
      status: worker.signal < 70 ? "Weak" : "Excellent",
      threshold: 70,
    },
  };
}

function TrendTag({ trend }) {
  if (trend.direction === "increasing") {
    return (
      <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400">
        <TrendingUp size={12} /> +{trend.changePercent.toFixed(0)}%
      </span>
    );
  }

  if (trend.direction === "decreasing") {
    return (
      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
        <TrendingDown size={12} /> {trend.changePercent.toFixed(0)}%
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
      <Minus size={12} /> Stable
    </span>
  );
}

function Sensors() {
  const { workers, history } = useMineContext();
  const [selectedId, setSelectedId] = useState(null);

  const selectedWorker = workers.find((worker) => worker.id === selectedId) || workers[0];
  const workerHistory = history[selectedWorker?.id] || [];

  const chartData = useMemo(
    () =>
      workerHistory.map((reading) => ({
        time: new Date(reading.timestamp).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        gas: reading.gas,
      })),
    [workerHistory]
  );

  const count = workers.length || 1;
  const avgGas = workers.reduce((total, worker) => total + worker.gas, 0) / count;
  const avgTemperature = workers.reduce((total, worker) => total + worker.temperature, 0) / count;
  const avgMotion = workers.reduce((total, worker) => total + worker.motion, 0) / count;
  const criticalCount = workers.filter((worker) => worker.status === "Critical").length;

  const overviewSensors = [
    { name: "Gas Sensor", value: avgGas.toFixed(1), unit: "ppm", status: avgGas > 50 ? "Elevated" : "Normal", icon: Wind },
    { name: "Temperature", value: avgTemperature.toFixed(1), unit: "°C", status: avgTemperature > 38 ? "Elevated" : "Normal", icon: Thermometer },
    { name: "Pressure", value: "1.02", unit: "bar", status: "Stable", icon: Gauge },
    { name: "Motion", value: avgMotion.toFixed(2), unit: "g", status: avgMotion > 0.5 ? "Abnormal" : "Normal", icon: Move3d },
    { name: "Impact", value: String(criticalCount), unit: "critical events", status: criticalCount > 0 ? "Attention" : "No impact", icon: CircleAlert },
  ];

  if (!selectedWorker) {
    return null;
  }

  const sensorShape = toSensorShape(selectedWorker);

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Telemetry
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white">Sensors</h1>
        <p className="mt-1 text-xs text-slate-500">
          Real-time sensor telemetry from smart helmets across the mine.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {overviewSensors.map(({ name, value, unit, status, icon: Icon }) => (
          <div
            key={name}
            className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                <Icon size={18} className="text-cyan-400" />
              </div>

              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>

            <p className="mt-5 text-xs text-slate-500">{name}</p>

            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">{value}</span>
              <span className="text-xs text-slate-600">{unit}</span>
            </div>

            <p className="mt-3 text-[10px] font-medium text-emerald-400">
              ● {status}
            </p>
          </div>
        ))}
      </div>

      {/* HELMET SENSOR HISTORY */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Helmet Sensor History</h3>
            <p className="mt-1 text-[10px] text-slate-600">
              Select a worker to inspect their smart helmet's live and historical readings.
            </p>
          </div>

          <select
            value={selectedWorker.id}
            onChange={(event) => setSelectedId(event.target.value)}
            className="h-10 rounded-xl border border-white/[0.07] bg-[#111925] px-3 text-xs text-white outline-none"
          >
            {workers.map((worker) => (
              <option key={worker.id} value={worker.id}>
                {worker.name} · {worker.helmetId} · {worker.zone}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <SensorCard sensor={sensorShape} type="gas" compact />
          <SensorCard sensor={sensorShape} type="temperature" compact />
          <SensorCard sensor={sensorShape} type="motion" compact />
          <SensorCard sensor={sensorShape} type="battery" compact />
          <SensorCard sensor={sensorShape} type="signal" compact />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          <div className="rounded-xl border border-white/[0.05] bg-[#080d15] p-4">
            <p className="mb-3 text-[10px] uppercase tracking-wider text-slate-500">
              Gas Trend (ppm)
            </p>

            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />

                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#475569", fontSize: 9 }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#475569", fontSize: 9 }}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#111925",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "10px",
                      fontSize: "10px",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="gas"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#22d3ee", stroke: "#0c121c", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Risk Level</p>
              <Badge variant={bandVariant[selectedWorker.band]} dot>{selectedWorker.band}</Badge>
            </div>

            <p className="mt-2 text-2xl font-bold text-white">
              {selectedWorker.safetyScore}
              <span className="text-xs font-normal text-slate-600">/100</span>
            </p>

            <div className="mt-4 space-y-2 border-t border-white/[0.05] pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Gas</span>
                <TrendTag trend={selectedWorker.trend.gas} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Temperature</span>
                <TrendTag trend={selectedWorker.trend.temperature} />
              </div>
            </div>

            <div className="mt-4 border-t border-white/[0.05] pt-3">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                Why?
              </p>

              {selectedWorker.explanation.length > 0 ? (
                <div className="mt-2 space-y-1.5">
                  {selectedWorker.explanation.map((line, index) => (
                    <p key={index} className="text-[10px] leading-relaxed text-slate-400">
                      • {line}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-[10px] leading-relaxed text-emerald-400">
                  All readings are within the normal safety range.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
            <Radio size={18} className="text-emerald-400" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Sensor Network
            </h3>
            <p className="text-[10px] text-slate-600">
              {workers.length * 5} sensors connected across {workers.length} helmets
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sensors;
