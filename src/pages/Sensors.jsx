import {
  Wind,
  Thermometer,
  Gauge,
  Move3d,
  CircleAlert,
  Radio,
} from "lucide-react";

const sensors = [
  ["Gas Sensor", "18.4", "ppm", "Normal", Wind],
  ["Temperature", "31.8", "°C", "Normal", Thermometer],
  ["Pressure", "1.02", "bar", "Stable", Gauge],
  ["Motion", "0.12", "g", "Normal", Move3d],
  ["Impact", "0", "events", "Normal", CircleAlert],
];

function Sensors() {
  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Telemetry
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white">Sensors</h1>
        <p className="mt-1 text-xs text-slate-500">
          Real-time sensor telemetry from smart helmets.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {sensors.map(([name, value, unit, status, Icon]) => (
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
              620 sensors connected across 124 helmets
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sensors;