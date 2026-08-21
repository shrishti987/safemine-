import {
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Siren,
  MoreHorizontal,
} from "lucide-react";

const workers = [
  { id: "SM-001", name: "Arjun Singh", zone: "Zone A", helmet: "HLM-001", risk: 1.2, status: "Safe", battery: 94 },
  { id: "SM-002", name: "Rohit Kumar", zone: "Zone B", helmet: "HLM-002", risk: 2.1, status: "Safe", battery: 88 },
  { id: "SM-003", name: "Vikas Negi", zone: "Zone B", helmet: "HLM-003", risk: 5.8, status: "Warning", battery: 76 },
  { id: "SM-004", name: "Aman Rawat", zone: "Zone C", helmet: "HLM-004", risk: 9.4, status: "Critical", battery: 61 },
  { id: "SM-005", name: "Deepak Joshi", zone: "Zone A", helmet: "HLM-005", risk: 1.7, status: "Safe", battery: 91 },
  { id: "SM-006", name: "Karan Bisht", zone: "Zone C", helmet: "HLM-006", risk: 3.2, status: "Safe", battery: 82 },
  { id: "SM-007", name: "Naveen Rana", zone: "Zone B", helmet: "HLM-007", risk: 6.1, status: "Warning", battery: 69 },
  { id: "SM-008", name: "Mohit Rawat", zone: "Zone A", helmet: "HLM-008", risk: 1.4, status: "Safe", battery: 97 },
];

function Workers() {
  return (
    <div className="mx-auto max-w-[1700px] space-y-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
          Workforce
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white">
          Workers
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Monitor every worker and connected smart helmet.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Total Workers</p>
          <p className="mt-2 text-3xl font-bold text-white">128</p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Online</p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">124</p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">At Risk</p>
          <p className="mt-2 text-3xl font-bold text-red-400">6</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c121c]">
        <div className="flex flex-col gap-3 border-b border-white/[0.06] p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex h-10 max-w-sm items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3">
            <Search size={15} className="text-slate-500" />
            <input
              placeholder="Search worker..."
              className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-600"
            />
          </div>

          <button className="flex items-center gap-2 rounded-xl border border-white/[0.07] px-3 py-2.5 text-xs text-slate-400 hover:bg-white/[0.04]">
            <Filter size={14} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-white/[0.05] text-left">
                {["Worker", "Zone", "Helmet", "Risk", "Status", "Battery", ""].map((heading) => (
                  <th key={heading} className="px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {workers.map((worker) => {
                const critical = worker.status === "Critical";
                const warning = worker.status === "Warning";

                return (
                  <tr key={worker.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.015]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-300">
                          {worker.name.split(" ").map(x => x[0]).join("")}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">{worker.name}</p>
                          <p className="text-[9px] text-slate-600">{worker.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 text-xs text-slate-400">{worker.zone}</td>
                    <td className="px-5 text-xs text-slate-500">{worker.helmet}</td>

                    <td className="px-5">
                      <span className={`text-xs font-bold ${critical ? "text-red-400" : warning ? "text-amber-400" : "text-emerald-400"}`}>
                        {worker.risk}/10
                      </span>
                    </td>

                    <td className="px-5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-semibold ${
                        critical ? "bg-red-400/10 text-red-400" :
                        warning ? "bg-amber-400/10 text-amber-400" :
                        "bg-emerald-400/10 text-emerald-400"
                      }`}>
                        {critical ? <Siren size={10} /> : warning ? <AlertTriangle size={10} /> : <ShieldCheck size={10} />}
                        {worker.status}
                      </span>
                    </td>

                    <td className="px-5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800">
                          <div className="h-full rounded-full bg-emerald-400" style={{ width: `${worker.battery}%` }} />
                        </div>
                        <span className="text-[9px] text-slate-500">{worker.battery}%</span>
                      </div>
                    </td>

                    <td className="px-5">
                      <button className="text-slate-600 hover:text-white">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Workers;