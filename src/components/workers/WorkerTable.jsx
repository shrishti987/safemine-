import {
  Activity,
  ArrowDown,
  ArrowUp,
  Battery,
  ChevronRight,
  MapPin,
  Radio,
  Search,
  ShieldCheck,
  Thermometer,
  User,
  Wind,
} from "lucide-react";

const statusConfig = {
  Safe: {
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/15",
    dot: "bg-emerald-400",
  },

  Warning: {
    text: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/15",
    dot: "bg-amber-400",
  },

  Critical: {
    text: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/15",
    dot: "bg-red-400",
  },

  Offline: {
    text: "text-slate-500",
    bg: "bg-slate-500/10",
    border: "border-slate-500/15",
    dot: "bg-slate-500",
  },
};

function SortIcon({
  active,
  direction,
}) {
  if (!active) {
    return (
      <span className="text-slate-700">
        ↕
      </span>
    );
  }

  return direction === "asc" ? (
    <ArrowUp
      size={10}
      className="text-cyan-400"
    />
  ) : (
    <ArrowDown
      size={10}
      className="text-cyan-400"
    />
  );
}

function WorkerTable({
  workers = [],
  onWorkerClick,
  searchTerm = "",
  onSearchChange,
  statusFilter = "All",
  onStatusChange,
  sortBy = "name",
  sortDirection = "asc",
  onSort,
}) {
  const filteredWorkers = workers
    .filter((worker) => {
      const query =
        searchTerm.toLowerCase();

      const matchesSearch =
        !query ||
        worker.name
          ?.toLowerCase()
          .includes(query) ||
        worker.id
          ?.toLowerCase()
          .includes(query) ||
        worker.helmetId
          ?.toLowerCase()
          .includes(query) ||
        worker.zone
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        worker.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    })
    .sort((a, b) => {
      let first = a[sortBy];
      let second = b[sortBy];

      if (
        typeof first === "string"
      ) {
        first = first.toLowerCase();
        second = second?.toLowerCase();
      }

      if (first < second) {
        return sortDirection === "asc"
          ? -1
          : 1;
      }

      if (first > second) {
        return sortDirection === "asc"
          ? 1
          : -1;
      }

      return 0;
    });

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c121c]">

      {/* TOOLBAR */}
      <div className="flex flex-col gap-3 border-b border-white/[0.05] p-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h2 className="text-sm font-semibold text-white">
            Mine Personnel
          </h2>

          <p className="mt-1 text-[9px] text-slate-600">
            Monitor workers and their connected safety helmets
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">

          {/* SEARCH */}
          {onSearchChange && (
            <div className="relative">

              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  onSearchChange(
                    event.target.value
                  )
                }
                placeholder="Search worker..."
                className="h-9 w-full rounded-xl border border-white/[0.07] bg-white/[0.02] pl-9 pr-3 text-[9px] text-slate-300 outline-none transition placeholder:text-slate-700 focus:border-cyan-400/20 sm:w-52"
              />

            </div>
          )}

          {/* FILTER */}
          {onStatusChange && (
            <select
              value={statusFilter}
              onChange={(event) =>
                onStatusChange(
                  event.target.value
                )
              }
              className="h-9 rounded-xl border border-white/[0.07] bg-[#101722] px-3 text-[9px] text-slate-400 outline-none focus:border-cyan-400/20"
            >
              <option value="All">
                All Status
              </option>
              <option value="Safe">
                Safe
              </option>
              <option value="Warning">
                Warning
              </option>
              <option value="Critical">
                Critical
              </option>
              <option value="Offline">
                Offline
              </option>
            </select>
          )}

        </div>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full min-w-[850px]">

          <thead>
            <tr className="border-b border-white/[0.05]">

              <th className="px-4 py-3 text-left">
                <button
                  type="button"
                  onClick={() =>
                    onSort?.("name")
                  }
                  className="flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-wider text-slate-600"
                >
                  Worker
                  <SortIcon
                    active={
                      sortBy === "name"
                    }
                    direction={
                      sortDirection
                    }
                  />
                </button>
              </th>

              <th className="px-4 py-3 text-left">
                <button
                  type="button"
                  onClick={() =>
                    onSort?.("zone")
                  }
                  className="flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-wider text-slate-600"
                >
                  Zone
                  <SortIcon
                    active={
                      sortBy === "zone"
                    }
                    direction={
                      sortDirection
                    }
                  />
                </button>
              </th>

              <th className="px-4 py-3 text-left">
                <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                  Helmet
                </span>
              </th>

              <th className="px-4 py-3 text-left">
                <button
                  type="button"
                  onClick={() =>
                    onSort?.(
                      "riskScore"
                    )
                  }
                  className="flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-wider text-slate-600"
                >
                  Risk
                  <SortIcon
                    active={
                      sortBy ===
                      "riskScore"
                    }
                    direction={
                      sortDirection
                    }
                  />
                </button>
              </th>

              <th className="px-4 py-3 text-left">
                <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                  Sensors
                </span>
              </th>

              <th className="px-4 py-3 text-left">
                <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                  Battery
                </span>
              </th>

              <th className="px-4 py-3 text-left">
                <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                  Status
                </span>
              </th>

              <th className="px-4 py-3" />

            </tr>
          </thead>

          <tbody>

            {filteredWorkers.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="px-4 py-12 text-center"
                >
                  <div className="flex flex-col items-center">

                    <User
                      size={22}
                      className="text-slate-700"
                    />

                    <p className="mt-3 text-xs font-medium text-slate-500">
                      No workers found
                    </p>

                    <p className="mt-1 text-[9px] text-slate-700">
                      Try changing your search or filter.
                    </p>

                  </div>
                </td>
              </tr>
            ) : (
              filteredWorkers.map(
                (worker) => {
                  const status =
                    worker.status ||
                    "Safe";

                  const style =
                    statusConfig[
                      status
                    ] ||
                    statusConfig.Safe;

                  const risk =
                    Number(
                      worker.riskScore
                    ) || 0;

                  return (
                    <tr
                      key={worker.id}
                      onClick={() =>
                        onWorkerClick?.(
                          worker
                        )
                      }
                      className={`border-b border-white/[0.04] transition last:border-b-0 ${
                        onWorkerClick
                          ? "cursor-pointer hover:bg-white/[0.02]"
                          : ""
                      }`}
                    >

                      {/* WORKER */}
                      <td className="px-4 py-3">

                        <div className="flex items-center gap-3">

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/[0.06] bg-[#111925]">

                            {worker.avatar ? (
                              <img
                                src={
                                  worker.avatar
                                }
                                alt={
                                  worker.name
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User
                                size={14}
                                className="text-slate-600"
                              />
                            )}

                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-[10px] font-semibold text-white">
                              {worker.name}
                            </p>

                            <p className="mt-0.5 text-[8px] text-slate-600">
                              {worker.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* ZONE */}
                      <td className="px-4 py-3">

                        <div className="flex items-center gap-1.5">

                          <MapPin
                            size={11}
                            className="text-slate-600"
                          />

                          <span className="text-[9px] text-slate-400">
                            {worker.zone ||
                              "--"}
                          </span>

                        </div>

                      </td>

                      {/* HELMET */}
                      <td className="px-4 py-3">

                        <div className="flex items-center gap-1.5">

                          <Radio
                            size={11}
                            className="text-slate-600"
                          />

                          <span className="font-mono text-[9px] text-slate-400">
                            {worker.helmetId ||
                              "--"}
                          </span>

                        </div>

                      </td>

                      {/* RISK */}
                      <td className="px-4 py-3">

                        <div className="w-20">

                          <div className="flex items-center justify-between">

                            <span
                              className={`text-[10px] font-bold ${
                                risk >= 8
                                  ? "text-red-400"
                                  : risk >=
                                    5
                                  ? "text-amber-400"
                                  : "text-emerald-400"
                              }`}
                            >
                              {risk.toFixed(
                                1
                              )}
                            </span>

                            <span className="text-[7px] text-slate-700">
                              /10
                            </span>

                          </div>

                          <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/[0.04]">

                            <div
                              className={`h-full rounded-full ${
                                risk >= 8
                                  ? "bg-red-400"
                                  : risk >=
                                    5
                                  ? "bg-amber-400"
                                  : "bg-emerald-400"
                              }`}
                              style={{
                                width: `${Math.min(
                                  risk *
                                    10,
                                  100
                                )}%`,
                              }}
                            />

                          </div>

                        </div>

                      </td>

                      {/* SENSORS */}
                      <td className="px-4 py-3">

                        <div className="flex items-center gap-3">

                          <span
                            title="Temperature"
                            className="flex items-center gap-1 text-[8px] text-slate-500"
                          >
                            <Thermometer
                              size={10}
                            />
                            {worker.temperature ??
                              "--"}
                          </span>

                          <span
                            title="Gas"
                            className="flex items-center gap-1 text-[8px] text-slate-500"
                          >
                            <Wind
                              size={10}
                            />
                            {worker.gas ??
                              "--"}
                          </span>

                          <span
                            title="Motion"
                            className="flex items-center gap-1 text-[8px] text-slate-500"
                          >
                            <Activity
                              size={10}
                            />
                            {worker.motion ??
                              "--"}
                          </span>

                        </div>

                      </td>

                      {/* BATTERY */}
                      <td className="px-4 py-3">

                        <div className="flex items-center gap-1.5">

                          <Battery
                            size={12}
                            className={
                              worker.battery <
                              30
                                ? "text-red-400"
                                : "text-slate-500"
                            }
                          />

                          <span
                            className={`text-[9px] font-medium ${
                              worker.battery <
                              30
                                ? "text-red-400"
                                : "text-slate-400"
                            }`}
                          >
                            {worker.battery ??
                              "--"}
                            %
                          </span>

                        </div>

                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-3">

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[7px] font-bold uppercase tracking-wider ${style.bg} ${style.border} ${style.text}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                          />

                          {status}
                        </span>

                      </td>

                      {/* ACTION */}
                      <td className="px-4 py-3 text-right">

                        {onWorkerClick && (
                          <ChevronRight
                            size={13}
                            className="ml-auto text-slate-700 transition group-hover:text-slate-400"
                          />
                        )}

                      </td>

                    </tr>
                  );
                }
              )
            )}

          </tbody>

        </table>

      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between border-t border-white/[0.05] px-4 py-3">

        <span className="text-[8px] text-slate-600">
          Showing{" "}
          <span className="text-slate-400">
            {filteredWorkers.length}
          </span>{" "}
          of{" "}
          <span className="text-slate-400">
            {workers.length}
          </span>{" "}
          workers
        </span>

        <div className="flex items-center gap-1.5">

          <ShieldCheck
            size={11}
            className="text-emerald-400"
          />

          <span className="text-[8px] text-slate-600">
            Safety monitoring active
          </span>

        </div>

      </div>

    </div>
  );
}

export default WorkerTable;