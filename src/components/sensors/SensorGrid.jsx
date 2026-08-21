import {
  Activity,
  Battery,
  Radio,
  Thermometer,
  Wind,
} from "lucide-react";

import SensorCard from "./SensorCard";

const sensorTypes = [
  {
    key: "gas",
    label: "Gas Levels",
    icon: Wind,
  },
  {
    key: "temperature",
    label: "Temperature",
    icon: Thermometer,
  },
  {
    key: "motion",
    label: "Motion",
    icon: Activity,
  },
  {
    key: "battery",
    label: "Battery",
    icon: Battery,
  },
  {
    key: "signal",
    label: "Signal",
    icon: Radio,
  },
];

function SensorGrid({
  sensors = [],
  types = sensorTypes,
  compact = false,
  title = "Live Sensor Monitoring",
  showHeader = true,
}) {
  if (!sensors.length) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-8 text-center">
        <p className="text-xs font-medium text-slate-400">
          No sensor data available
        </p>

        <p className="mt-1 text-[9px] text-slate-600">
          Sensor readings will appear here when devices
          connect to the network.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* HEADER */}
      {showHeader && (
        <div className="flex items-end justify-between gap-4">

          <div>
            <h2 className="text-sm font-semibold text-white">
              {title}
            </h2>

            <p className="mt-1 text-[9px] text-slate-600">
              Real-time readings from connected safety helmets
            </p>
          </div>

          <div className="hidden items-center gap-2 sm:flex">

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

            <span className="text-[8px] font-medium uppercase tracking-wider text-emerald-400">
              Live
            </span>

          </div>

        </div>
      )}

      {/* SENSOR SECTIONS */}
      <div className="space-y-6">

        {types.map((type) => {
          const Icon = type.icon;

          return (
            <section key={type.key}>

              {/* SECTION TITLE */}
              <div className="mb-3 flex items-center gap-2">

                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.04]">
                  <Icon
                    size={12}
                    className="text-slate-500"
                  />
                </div>

                <h3 className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                  {type.label}
                </h3>

                <div className="h-px flex-1 bg-white/[0.04]" />

              </div>

              {/* CARDS */}
              <div
                className={`grid gap-3 ${
                  compact
                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                }`}
              >

                {sensors.map((sensor) => (
                  <SensorCard
                    key={`${sensor.id}-${type.key}`}
                    sensor={sensor}
                    type={type.key}
                    compact={compact}
                  />
                ))}

              </div>

            </section>
          );
        })}

      </div>

    </div>
  );
}

export default SensorGrid;