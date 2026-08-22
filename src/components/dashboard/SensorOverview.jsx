import {
  Wind,
  Thermometer,
  Gauge,
  Move3d,
  CircleAlert,
} from "lucide-react";

const defaultSensors = [
  {
    name: "Gas",
    value: "18.4",
    unit: "ppm",
    status: "Normal",
    icon: Wind,
    color: "emerald",
  },
  {
    name: "Temperature",
    value: "31.8",
    unit: "°C",
    status: "Normal",
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
    value: "0.12",
    unit: "g",
    status: "Normal",
    icon: Move3d,
    color: "emerald",
  },
  {
    name: "Impact",
    value: "0",
    unit: "events",
    status: "No impact",
    icon: CircleAlert,
    color: "emerald",
  },
];

function SensorOverview({ sensors = defaultSensors }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Sensor Overview
          </h3>

          <p className="mt-1 text-[10px] text-slate-600">
            Live telemetry from active helmets
          </p>
        </div>

        <span className="rounded-lg bg-emerald-400/10 px-2 py-1 text-[9px] font-semibold text-emerald-400">
          LIVE DATA
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {sensors.map((sensor) => {
          const Icon = sensor.icon;

          return (
            <div
              key={sensor.name}
              className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3"
            >
              <div className="flex items-center justify-between">
                <Icon
                  size={16}
                  className={
                    sensor.color === "cyan"
                      ? "text-cyan-400"
                      : "text-emerald-400"
                  }
                />

                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>

              <p className="mt-3 text-[10px] text-slate-500">
                {sensor.name}
              </p>

              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-lg font-bold text-white">
                  {sensor.value}
                </span>

                <span className="text-[9px] text-slate-600">
                  {sensor.unit}
                </span>
              </div>

              <p className="mt-1 text-[8px] text-emerald-400">
                {sensor.status}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SensorOverview;