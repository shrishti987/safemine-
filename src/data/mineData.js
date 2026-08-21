import workers from "./workers";
import sensors from "./sensors";
import alerts from "./alerts";

const gateways = [
  {
    id: "GW-001",
    name: "Gateway Alpha",
    location: "Zone A",
    zone: "Zone A",
    type: "Gateway",
    status: "Online",
    signal: 96,
    latency: 18,
    uptime: "99.98%",
    devices: 42,
    download: "8.4 Mbps",
    upload: "2.1 Mbps",
  },

  {
    id: "GW-002",
    name: "Gateway Beta",
    location: "Zone B",
    zone: "Zone B",
    type: "Gateway",
    status: "Online",
    signal: 91,
    latency: 24,
    uptime: "99.91%",
    devices: 38,
    download: "7.8 Mbps",
    upload: "1.9 Mbps",
  },

  {
    id: "GW-003",
    name: "Gateway Gamma",
    location: "Zone C",
    zone: "Zone C",
    type: "Gateway",
    status: "Warning",
    signal: 67,
    latency: 82,
    uptime: "98.74%",
    devices: 31,
    download: "4.2 Mbps",
    upload: "1.1 Mbps",
  },

  {
    id: "GW-004",
    name: "Gateway Delta",
    location: "Zone D",
    zone: "Zone D",
    type: "Gateway",
    status: "Offline",
    signal: 0,
    latency: null,
    uptime: "96.12%",
    devices: 17,
    download: "--",
    upload: "--",
  },
];


const helmets = workers.map((worker) => ({
  id: worker.helmetId,
  workerId: worker.id,
  worker: worker.name,
  zone: worker.zone,
  status:
    worker.status === "Critical"
      ? "Critical"
      : worker.status === "Warning"
      ? "Warning"
      : "Active",

  battery: worker.battery,
  signal: worker.signal,
  temperature: worker.temperature,
  gas: worker.gas,
  motion: worker.motion,
}));


const riskHistory = [
  {
    time: "08:00",
    score: 2.8,
  },
  {
    time: "09:00",
    score: 3.1,
  },
  {
    time: "10:00",
    score: 3.4,
  },
  {
    time: "11:00",
    score: 3.0,
  },
  {
    time: "12:00",
    score: 3.7,
  },
  {
    time: "13:00",
    score: 4.1,
  },
  {
    time: "14:00",
    score: 3.6,
  },
  {
    time: "15:00",
    score: 3.2,
  },
];


const maintenanceTasks = [
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
];


const statistics = {
  totalWorkers: 128,
  onlineWorkers: 124,
  safeWorkers: 118,
  warningWorkers: 3,
  criticalWorkers: 1,

  totalHelmets: 128,
  activeHelmets: 124,
  lowBatteryHelmets: 7,

  totalGateways: 4,
  onlineGateways: 3,

  averageRisk: 3.2,
  networkHealth: 96.4,

  activeAlerts: 3,
  criticalAlerts: 1,

  averageTemperature: 33.8,
  averageGas: 21.7,
};


const mineData = {
  mine: {
    name: "SafeMine Operations",
    location: "Underground Mining Site",
    status: "Operational",
    lastUpdated: new Date(),
  },

  workers,
  helmets,
  sensors,
  alerts,
  gateways,
  riskHistory,
  maintenanceTasks,
  statistics,
};


export default mineData;

export {
  workers,
  helmets,
  sensors,
  alerts,
  gateways,
  riskHistory,
  maintenanceTasks,
  statistics,
};