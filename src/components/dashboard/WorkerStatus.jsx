import { ChevronRight, ShieldCheck } from "lucide-react";

const defaultWorkers = [
  {
    id: "SM-021",
    name: "Arjun Singh",
    zone: "Zone A",
    risk: 1.2,
    status: "Safe",
  },
  {
    id: "SM-014",
    name: "Rohit Kumar",
    zone: "Zone B",
    risk: 2.1,
    status: "Safe",
  },
  {
    id: "SM-032",
    name: "Vikas Negi",
    zone: "Zone B",
    risk: 5.8,
    status: "Warning",
  },
  {
    id: "SM-024",
    name: "Aman Rawat",
    zone: "Zone C",
    risk: 9.4,
    status: "Critical",
  },
];

function WorkerStatus({ workers = defaultWorkers }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Worker Status
          </h3>

          <p className="mt-1 text-[10px] text-slate-600">
            Highest risk workers
          </p>
        </div>

        <button className="flex items-center gap-1 text-[10px] text-emerald-400">
          All workers
          <ChevronRight size={12} />
        </button>
      </div>

      <div className="mt-5 space-y-2">
        {workers.map((worker) => {
          const critical = worker.status === "Critical";
          const warning = worker.status === "Warning";

          return (
            <div
              key={worker.id}
              className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.015] p-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-300">
                {worker.name
                  .split(" ")
                  .map((name) => name[0])
                  .join("")}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-white">
                  {worker.name}
                </p>

                <p className="mt-0.5 text-[9px] text-slate-600">
                  {worker.id} · {worker.zone}
                </p>
              </div>

              <div className="text-right">
                <p
                  className={`text-[11px] font-bold ${
                    critical
                      ? "text-red-400"
                      : warning
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  {worker.risk}
                </p>

                <p className="text-[8px] text-slate-600">
                  risk
                </p>
              </div>

              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                  critical
                    ? "bg-red-400/10"
                    : warning
                    ? "bg-amber-400/10"
                    : "bg-emerald-400/10"
                }`}
              >
                <ShieldCheck
                  size={13}
                  className={
                    critical
                      ? "text-red-400"
                      : warning
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WorkerStatus;