import { useState } from "react";
import { useMineContext } from "../context/MineDataContext";
import WorkerTable from "../components/workers/WorkerTable";
import WorkerDetails from "../components/workers/WorkerDetails";
import Modal from "../components/common/Modal";

function Workers() {
  const { workers, acknowledgeAlert, alerts } = useMineContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("riskScore");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);

  const selectedWorker = workers.find((worker) => worker.id === selectedWorkerId) || null;

  const handleSort = (column) => {
    if (column === sortBy) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(column);
    setSortDirection("desc");
  };

  const totalWorkers = workers.length;
  const onlineWorkers = workers.filter((worker) => worker.status !== "Offline").length;
  const atRiskWorkers = workers.filter((worker) => worker.status === "Warning" || worker.status === "Critical").length;

  const handleAcknowledge = (worker) => {
    const openAlert = alerts.find((alert) => alert.workerId === worker.id && !alert.acknowledged);

    if (openAlert) {
      acknowledgeAlert(openAlert.id);
    }
  };

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
          <p className="mt-2 text-3xl font-bold text-white">{totalWorkers}</p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Online</p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">{onlineWorkers}</p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">At Risk</p>
          <p className="mt-2 text-3xl font-bold text-red-400">{atRiskWorkers}</p>
        </div>
      </div>

      <WorkerTable
        workers={workers}
        onWorkerClick={(worker) => setSelectedWorkerId(worker.id)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      <Modal
        isOpen={Boolean(selectedWorker)}
        onClose={() => setSelectedWorkerId(null)}
        size="lg"
        showClose={false}
      >
        {selectedWorker && (
          <WorkerDetails
            worker={selectedWorker}
            onClose={() => setSelectedWorkerId(null)}
            onAcknowledge={handleAcknowledge}
          />
        )}
      </Modal>
    </div>
  );
}

export default Workers;
