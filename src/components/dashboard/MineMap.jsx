import { MapPin, Maximize2, Layers, Navigation } from "lucide-react";

const defaultWorkers = [
  { id: "SM-021", x: "22%", y: "35%", status: "safe" },
  { id: "SM-014", x: "48%", y: "24%", status: "safe" },
  { id: "SM-032", x: "72%", y: "39%", status: "warning" },
  { id: "SM-008", x: "36%", y: "65%", status: "safe" },
  { id: "SM-024", x: "78%", y: "70%", status: "critical" },
  { id: "SM-017", x: "57%", y: "78%", status: "safe" },
];

function MineMap({ workers = defaultWorkers }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">
              Live Mine Map
            </h3>

            <span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              LIVE
            </span>
          </div>

          <p className="mt-1 text-[10px] text-slate-600">
            Worker locations updated every 3 seconds
          </p>
        </div>

        <div className="flex gap-1.5">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-slate-500 hover:bg-white/[0.04] hover:text-white">
            <Layers size={14} />
          </button>

          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-slate-500 hover:bg-white/[0.04] hover:text-white">
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      <div className="relative mt-5 h-[350px] overflow-hidden rounded-xl border border-white/[0.05] bg-[#080d15]">
        {/* Mine tunnel pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-[8%] top-[15%] h-[2px] w-[80%] rotate-[12deg] bg-slate-600" />
          <div className="absolute left-[15%] top-[45%] h-[2px] w-[70%] rotate-[-15deg] bg-slate-600" />
          <div className="absolute left-[25%] top-[75%] h-[2px] w-[65%] rotate-[8deg] bg-slate-600" />

          <div className="absolute left-[20%] top-[8%] h-[90%] w-[2px] rotate-[18deg] bg-slate-700" />
          <div className="absolute left-[60%] top-[5%] h-[90%] w-[2px] rotate-[-14deg] bg-slate-700" />
        </div>

        {/* Zone labels */}
        <span className="absolute left-5 top-5 text-[9px] uppercase tracking-[0.15em] text-slate-700">
          Zone A
        </span>

        <span className="absolute right-8 top-24 text-[9px] uppercase tracking-[0.15em] text-slate-700">
          Zone B
        </span>

        <span className="absolute bottom-10 left-16 text-[9px] uppercase tracking-[0.15em] text-slate-700">
          Zone C
        </span>

        {/* Workers */}
        {workers.map((worker) => (
          <div
            key={worker.id}
            className="absolute"
            style={{
              left: worker.x,
              top: worker.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className={`absolute -inset-2 rounded-full opacity-20 blur-sm ${
                worker.status === "critical"
                  ? "bg-red-400"
                  : worker.status === "warning"
                  ? "bg-amber-400"
                  : "bg-emerald-400"
              }`}
            />

            <div
              className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                worker.status === "critical"
                  ? "border-red-400 bg-red-400/20"
                  : worker.status === "warning"
                  ? "border-amber-400 bg-amber-400/20"
                  : "border-emerald-400 bg-emerald-400/20"
              }`}
            >
              <MapPin
                size={13}
                className={
                  worker.status === "critical"
                    ? "text-red-400"
                    : worker.status === "warning"
                    ? "text-amber-400"
                    : "text-emerald-400"
                }
              />
            </div>

            <span className="absolute left-1/2 top-8 -translate-x-1/2 whitespace-nowrap text-[8px] font-medium text-slate-500">
              {worker.id}
            </span>
          </div>
        ))}

        {/* Route */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M10 82 C25 70, 25 50, 42 52 S62 65, 78 35"
            fill="none"
            stroke="rgba(16,185,129,0.3)"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
        </svg>

        {/* Bottom controls */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#0c121c]/90 px-3 py-2 backdrop-blur">
          <Navigation size={12} className="text-emerald-400" />
          <span className="text-[9px] text-slate-400">
            Main Shaft
          </span>
        </div>

        <div className="absolute bottom-4 right-4 flex gap-3 rounded-lg border border-white/[0.06] bg-[#0c121c]/90 px-3 py-2 backdrop-blur">
          <span className="flex items-center gap-1 text-[8px] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Safe
          </span>

          <span className="flex items-center gap-1 text-[8px] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Warning
          </span>

          <span className="flex items-center gap-1 text-[8px] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            Critical
          </span>
        </div>
      </div>
    </div>
  );
}

export default MineMap;