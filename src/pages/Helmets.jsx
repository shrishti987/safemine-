import { useMemo, useState } from "react";
import {
  HardHat,
  BatteryMedium,
  Wifi,
  WifiOff,
  ShieldCheck,
  AlertTriangle,
  Thermometer,
  Wind,
  Activity,
  Search,
} from "lucide-react";

const helmets = [
  {
    id: "HLM-001",
    worker: "Arjun Singh",
    workerId: "SM-001",
    zone: "Zone A",
    battery: 94,
    signal: "Excellent",
    status: "Active",
    temperature: "31.2°C",
    gas: "16.8 ppm",
    motion: "0.08g",
  },
  {
    id: "HLM-002",
    worker: "Rohit Kumar",
    workerId: "SM-002",
    zone: "Zone B",
    battery: 88,
    signal: "Good",
    status: "Active",
    temperature: "32.1°C",
    gas: "19.4 ppm",
    motion: "0.11g",
  },
  {
    id: "HLM-003",
    worker: "Vikas Negi",
    workerId: "SM-003",
    zone: "Zone B",
    battery: 76,
    signal: "Good",
    status: "Warning",
    temperature: "42.8°C",
    gas: "31.2 ppm",
    motion: "0.42g",
  },
  {
    id: "HLM-004",
    worker: "Aman Rawat",
    workerId: "SM-004",
    zone: "Zone C",
    battery: 61,
    signal: "Weak",
    status: "Critical",
    temperature: "44.1°C",
    gas: "78 ppm",
    motion: "0.82g",
  },
  {
    id: "HLM-005",
    worker: "Deepak Joshi",
    workerId: "SM-005",
    zone: "Zone A",
    battery: 91,
    signal: "Excellent",
    status: "Active",
    temperature: "30.8°C",
    gas: "17.1 ppm",
    motion: "0.06g",
  },
  {
    id: "HLM-006",
    worker: "Karan Bisht",
    workerId: "SM-006",
    zone: "Zone C",
    battery: 82,
    signal: "Good",
    status: "Active",
    temperature: "33.4°C",
    gas: "22.3 ppm",
    motion: "0.13g",
  },
];

function Helmets() {
  const [query, setQuery] = useState("");

  const filteredHelmets = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return helmets;
    }

    return helmets.filter(
      (helmet) =>
        helmet.id.toLowerCase().includes(search) ||
        helmet.worker.toLowerCase().includes(search) ||
        helmet.workerId.toLowerCase().includes(search) ||
        helmet.zone.toLowerCase().includes(search)
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-[1700px] space-y-5">

      {/* HEADER */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
          IoT Hardware
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white">
          Smart Helmets
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Monitor connected safety helmets, sensors, battery and network health.
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Total Helmets
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10">
              <HardHat size={18} className="text-cyan-400" />
            </div>
          </div>

          <p className="mt-3 text-3xl font-bold text-white">
            128
          </p>

          <p className="mt-1 text-[9px] text-slate-600">
            Registered devices
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Connected
            </p>

            <Wifi size={18} className="text-emerald-400" />
          </div>

          <p className="mt-3 text-3xl font-bold text-emerald-400">
            124
          </p>

          <p className="mt-1 text-[9px] text-slate-600">
            96.8% connection rate
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Low Battery
            </p>

            <BatteryMedium size={18} className="text-amber-400" />
          </div>

          <p className="mt-3 text-3xl font-bold text-amber-400">
            7
          </p>

          <p className="mt-1 text-[9px] text-slate-600">
            Below 30%
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Device Alerts
            </p>

            <AlertTriangle size={18} className="text-red-400" />
          </div>

          <p className="mt-3 text-3xl font-bold text-red-400">
            3
          </p>

          <p className="mt-1 text-[9px] text-slate-600">
            Require attention
          </p>
        </div>

      </div>

      {/* SEARCH */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-4">
        <div className="flex h-10 max-w-md items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3">
          <Search size={15} className="text-slate-500" />

          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search helmet or worker..."
            className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* HELMET GRID */}
      {filteredHelmets.length === 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-8 text-center text-xs text-slate-600">
          No helmets match your search.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">

        {filteredHelmets.map((helmet) => {
          const critical = helmet.status === "Critical";
          const warning = helmet.status === "Warning";

          return (
            <div
              key={helmet.id}
              className={`rounded-2xl border bg-[#0c121c] p-5 ${
                critical
                  ? "border-red-500/20"
                  : warning
                  ? "border-amber-500/15"
                  : "border-white/[0.06]"
              }`}
            >

              {/* CARD HEADER */}
              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      critical
                        ? "bg-red-400/10"
                        : warning
                        ? "bg-amber-400/10"
                        : "bg-cyan-400/10"
                    }`}
                  >
                    <HardHat
                      size={21}
                      className={
                        critical
                          ? "text-red-400"
                          : warning
                          ? "text-amber-400"
                          : "text-cyan-400"
                      }
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {helmet.id}
                    </h3>

                    <p className="mt-0.5 text-[9px] text-slate-600">
                      {helmet.workerId}
                    </p>
                  </div>

                </div>

                <span
                  className={`rounded-full px-2 py-1 text-[8px] font-bold ${
                    critical
                      ? "bg-red-400/10 text-red-400"
                      : warning
                      ? "bg-amber-400/10 text-amber-400"
                      : "bg-emerald-400/10 text-emerald-400"
                  }`}
                >
                  {helmet.status}
                </span>

              </div>

              {/* WORKER */}
              <div className="mt-5 rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">

                <p className="text-[9px] uppercase tracking-wider text-slate-600">
                  Assigned Worker
                </p>

                <div className="mt-2 flex items-center justify-between">

                  <p className="text-xs font-semibold text-white">
                    {helmet.worker}
                  </p>

                  <span className="text-[9px] text-slate-500">
                    {helmet.zone}
                  </span>

                </div>

              </div>

              {/* SENSOR DATA */}
              <div className="mt-4 grid grid-cols-3 gap-2">

                <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">

                  <Thermometer
                    size={14}
                    className="text-orange-400"
                  />

                  <p className="mt-2 text-[9px] text-slate-600">
                    Temp
                  </p>

                  <p className="mt-0.5 text-xs font-bold text-white">
                    {helmet.temperature}
                  </p>

                </div>

                <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">

                  <Wind
                    size={14}
                    className="text-cyan-400"
                  />

                  <p className="mt-2 text-[9px] text-slate-600">
                    Gas
                  </p>

                  <p className="mt-0.5 text-xs font-bold text-white">
                    {helmet.gas}
                  </p>

                </div>

                <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">

                  <Activity
                    size={14}
                    className="text-violet-400"
                  />

                  <p className="mt-2 text-[9px] text-slate-600">
                    Motion
                  </p>

                  <p className="mt-0.5 text-xs font-bold text-white">
                    {helmet.motion}
                  </p>

                </div>

              </div>

              {/* FOOTER */}
              <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-4">

                <div className="flex items-center gap-2">

                  {helmet.signal === "Weak" ? (
                    <WifiOff
                      size={13}
                      className="text-amber-400"
                    />
                  ) : (
                    <Wifi
                      size={13}
                      className="text-emerald-400"
                    />
                  )}

                  <div>
                    <p className="text-[9px] text-slate-500">
                      Signal
                    </p>

                    <p className="text-[9px] font-medium text-white">
                      {helmet.signal}
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-2">

                  <BatteryMedium
                    size={14}
                    className={
                      helmet.battery < 30
                        ? "text-red-400"
                        : helmet.battery < 50
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }
                  />

                  <div>
                    <p className="text-[9px] text-slate-500">
                      Battery
                    </p>

                    <p className="text-[9px] font-medium text-white">
                      {helmet.battery}%
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-1">
                  <ShieldCheck
                    size={13}
                    className="text-emerald-400"
                  />

                  <span className="text-[9px] text-emerald-400">
                    Protected
                  </span>
                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default Helmets;