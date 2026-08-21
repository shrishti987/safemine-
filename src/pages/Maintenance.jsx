import { useMemo, useState } from "react";
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Search,
  CalendarDays,
  Settings2,
  HardHat,
} from "lucide-react";

const maintenanceData = [
  {
    id: "MT-001",
    device: "HLM-004",
    worker: "Aman Rawat",
    issue: "Gas sensor calibration required",
    priority: "High",
    status: "In Progress",
    technician: "Rajesh Kumar",
    due: "Today",
  },
  {
    id: "MT-002",
    device: "HLM-019",
    worker: "Naveen Rana",
    issue: "Battery replacement",
    priority: "Medium",
    status: "Scheduled",
    technician: "Vikas Singh",
    due: "Tomorrow",
  },
  {
    id: "MT-003",
    device: "HLM-027",
    worker: "Mohit Rawat",
    issue: "Motion sensor inspection",
    priority: "Low",
    status: "Scheduled",
    technician: "Amit Negi",
    due: "Aug 24",
  },
  {
    id: "MT-004",
    device: "HLM-041",
    worker: "Karan Bisht",
    issue: "Firmware update",
    priority: "Medium",
    status: "Completed",
    technician: "Rajesh Kumar",
    due: "Completed",
  },
  {
    id: "MT-005",
    device: "HLM-063",
    worker: "Deepak Joshi",
    issue: "Helmet connectivity check",
    priority: "Low",
    status: "Completed",
    technician: "Amit Negi",
    due: "Completed",
  },
];

function Maintenance() {
  const [query, setQuery] = useState("");

  const filteredTasks = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return maintenanceData;
    }

    return maintenanceData.filter(
      (item) =>
        item.id.toLowerCase().includes(search) ||
        item.device.toLowerCase().includes(search) ||
        item.worker.toLowerCase().includes(search) ||
        item.issue.toLowerCase().includes(search) ||
        item.technician.toLowerCase().includes(search)
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-[1700px] space-y-5">

      {/* HEADER */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-400">
          Device Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white">
          Maintenance
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Track smart helmet maintenance, repairs and scheduled inspections.
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Open Tasks
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-400/10">
              <Wrench size={18} className="text-orange-400" />
            </div>
          </div>

          <p className="mt-3 text-3xl font-bold text-white">
            8
          </p>

          <p className="mt-1 text-[9px] text-slate-600">
            Maintenance tasks
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              In Progress
            </p>

            <Clock3 size={18} className="text-cyan-400" />
          </div>

          <p className="mt-3 text-3xl font-bold text-cyan-400">
            2
          </p>

          <p className="mt-1 text-[9px] text-slate-600">
            Currently being serviced
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Due Today
            </p>

            <AlertTriangle size={18} className="text-amber-400" />
          </div>

          <p className="mt-3 text-3xl font-bold text-amber-400">
            1
          </p>

          <p className="mt-1 text-[9px] text-slate-600">
            Requires attention
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Completed
            </p>

            <CheckCircle2 size={18} className="text-emerald-400" />
          </div>

          <p className="mt-3 text-3xl font-bold text-emerald-400">
            42
          </p>

          <p className="mt-1 text-[9px] text-slate-600">
            This month
          </p>
        </div>

      </div>

      {/* SEARCH + ACTION */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-[#0c121c] p-4 md:flex-row md:items-center md:justify-between">

        <div className="flex h-10 max-w-md items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3">
          <Search size={15} className="text-slate-500" />

          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search maintenance task..."
            className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-600"
          />
        </div>

        <button className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-orange-400">
          <Wrench size={14} />
          Create Maintenance Task
        </button>

      </div>

      {/* MAINTENANCE TABLE */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c121c]">

        <div className="flex items-center justify-between border-b border-white/[0.06] p-5">

          <div>
            <h3 className="text-sm font-semibold text-white">
              Maintenance Schedule
            </h3>

            <p className="mt-1 text-[10px] text-slate-600">
              Recent and upcoming maintenance activities
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-lg border border-white/[0.06] px-3 py-2 text-[10px] text-slate-400 hover:bg-white/[0.03]">
            <CalendarDays size={13} />
            Schedule
          </button>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px]">

            <thead>
              <tr className="border-b border-white/[0.05] text-left">

                {[
                  "Task",
                  "Device",
                  "Issue",
                  "Priority",
                  "Status",
                  "Technician",
                  "Due",
                  "",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-slate-600"
                  >
                    {heading}
                  </th>
                ))}

              </tr>
            </thead>

            <tbody>

              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-xs text-slate-600">
                    No maintenance tasks match your search.
                  </td>
                </tr>
              )}

              {filteredTasks.map((item) => {

                const high = item.priority === "High";
                const medium = item.priority === "Medium";

                const completed = item.status === "Completed";
                const progress = item.status === "In Progress";

                return (
                  <tr
                    key={item.id}
                    className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.015]"
                  >

                    {/* TASK */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                            completed
                              ? "bg-emerald-400/10"
                              : high
                              ? "bg-red-400/10"
                              : "bg-orange-400/10"
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2
                              size={16}
                              className="text-emerald-400"
                            />
                          ) : (
                            <Wrench
                              size={16}
                              className={
                                high
                                  ? "text-red-400"
                                  : "text-orange-400"
                              }
                            />
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-white">
                            {item.id}
                          </p>

                          <p className="text-[9px] text-slate-600">
                            {item.worker}
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* DEVICE */}
                    <td className="px-5">

                      <div className="flex items-center gap-2">

                        <HardHat
                          size={14}
                          className="text-cyan-400"
                        />

                        <span className="text-xs text-slate-400">
                          {item.device}
                        </span>

                      </div>

                    </td>

                    {/* ISSUE */}
                    <td className="px-5">

                      <p className="max-w-[220px] text-xs text-slate-400">
                        {item.issue}
                      </p>

                    </td>

                    {/* PRIORITY */}
                    <td className="px-5">

                      <span
                        className={`rounded-full px-2 py-1 text-[8px] font-bold ${
                          high
                            ? "bg-red-400/10 text-red-400"
                            : medium
                            ? "bg-amber-400/10 text-amber-400"
                            : "bg-slate-400/10 text-slate-400"
                        }`}
                      >
                        {item.priority}
                      </span>

                    </td>

                    {/* STATUS */}
                    <td className="px-5">

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[8px] font-semibold ${
                          completed
                            ? "bg-emerald-400/10 text-emerald-400"
                            : progress
                            ? "bg-cyan-400/10 text-cyan-400"
                            : "bg-orange-400/10 text-orange-400"
                        }`}
                      >

                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            completed
                              ? "bg-emerald-400"
                              : progress
                              ? "bg-cyan-400"
                              : "bg-orange-400"
                          }`}
                        />

                        {item.status}

                      </span>

                    </td>

                    {/* TECHNICIAN */}
                    <td className="px-5">

                      <p className="text-xs text-slate-400">
                        {item.technician}
                      </p>

                    </td>

                    {/* DUE */}
                    <td className="px-5">

                      <span
                        className={`text-[10px] ${
                          item.due === "Today"
                            ? "font-semibold text-red-400"
                            : completed
                            ? "text-emerald-400"
                            : "text-slate-500"
                        }`}
                      >
                        {item.due}
                      </span>

                    </td>

                    {/* ACTION */}
                    <td className="px-5">

                      <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-white/[0.04] hover:text-white">
                        <Settings2 size={14} />
                      </button>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      </div>

      {/* MAINTENANCE HEALTH */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
              <CheckCircle2
                size={18}
                className="text-emerald-400"
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                Device Health
              </h3>

              <p className="text-[10px] text-slate-600">
                Overall smart helmet maintenance health
              </p>
            </div>

          </div>

          <div className="mt-5">

            <div className="flex items-center justify-between">

              <span className="text-[10px] text-slate-500">
                Healthy devices
              </span>

              <span className="text-xs font-bold text-emerald-400">
                93.7%
              </span>

            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">

              <div
                className="h-full rounded-full bg-emerald-400"
                style={{ width: "93.7%" }}
              />

            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-400/10">
              <Wrench
                size={18}
                className="text-orange-400"
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                Preventive Maintenance
              </h3>

              <p className="text-[10px] text-slate-600">
                Scheduled maintenance completion
              </p>
            </div>

          </div>

          <div className="mt-5">

            <div className="flex items-center justify-between">

              <span className="text-[10px] text-slate-500">
                Completed this month
              </span>

              <span className="text-xs font-bold text-orange-400">
                84%
              </span>

            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">

              <div
                className="h-full rounded-full bg-orange-400"
                style={{ width: "84%" }}
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Maintenance;