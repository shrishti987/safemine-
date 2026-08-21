import { useCallback, useEffect, useMemo, useState } from "react";

/*
 * SafeMine mine monitoring hook
 *
 * This currently uses simulated real-time data so the dashboard
 * works without a backend. Later, the same hook can be connected
 * to an API, WebSocket, or IoT data source.
 */

const initialWorkers = [
  {
    id: "SM-001",
    name: "Arjun Singh",
    zone: "Zone A",
    helmetId: "HLM-001",
    status: "Safe",
    riskScore: 2.1,
    temperature: 31.2,
    gas: 16.8,
    motion: 0.08,
    battery: 94,
  },
  {
    id: "SM-002",
    name: "Rohit Kumar",
    zone: "Zone B",
    helmetId: "HLM-002",
    status: "Safe",
    riskScore: 2.8,
    temperature: 32.1,
    gas: 19.4,
    motion: 0.11,
    battery: 88,
  },
  {
    id: "SM-003",
    name: "Vikas Negi",
    zone: "Zone B",
    helmetId: "HLM-003",
    status: "Warning",
    riskScore: 6.4,
    temperature: 42.8,
    gas: 31.2,
    motion: 0.42,
    battery: 76,
  },
  {
    id: "SM-004",
    name: "Aman Rawat",
    zone: "Zone C",
    helmetId: "HLM-004",
    status: "Critical",
    riskScore: 9.1,
    temperature: 44.1,
    gas: 78,
    motion: 0.82,
    battery: 61,
  },
  {
    id: "SM-005",
    name: "Deepak Joshi",
    zone: "Zone A",
    helmetId: "HLM-005",
    status: "Safe",
    riskScore: 1.8,
    temperature: 30.8,
    gas: 17.1,
    motion: 0.06,
    battery: 91,
  },
  {
    id: "SM-006",
    name: "Karan Bisht",
    zone: "Zone C",
    helmetId: "HLM-006",
    status: "Safe",
    riskScore: 3.1,
    temperature: 33.4,
    gas: 22.3,
    motion: 0.13,
    battery: 82,
  },
];

const initialHelmets = [
  {
    id: "HLM-001",
    workerId: "SM-001",
    worker: "Arjun Singh",
    zone: "Zone A",
    status: "Active",
    battery: 94,
    signal: 96,
    temperature: 31.2,
    gas: 16.8,
    motion: 0.08,
  },
  {
    id: "HLM-002",
    workerId: "SM-002",
    worker: "Rohit Kumar",
    zone: "Zone B",
    status: "Active",
    battery: 88,
    signal: 91,
    temperature: 32.1,
    gas: 19.4,
    motion: 0.11,
  },
  {
    id: "HLM-003",
    workerId: "SM-003",
    worker: "Vikas Negi",
    zone: "Zone B",
    status: "Warning",
    battery: 76,
    signal: 84,
    temperature: 42.8,
    gas: 31.2,
    motion: 0.42,
  },
  {
    id: "HLM-004",
    workerId: "SM-004",
    worker: "Aman Rawat",
    zone: "Zone C",
    status: "Critical",
    battery: 61,
    signal: 67,
    temperature: 44.1,
    gas: 78,
    motion: 0.82,
  },
  {
    id: "HLM-005",
    workerId: "SM-005",
    worker: "Deepak Joshi",
    zone: "Zone A",
    status: "Active",
    battery: 91,
    signal: 95,
    temperature: 30.8,
    gas: 17.1,
    motion: 0.06,
  },
  {
    id: "HLM-006",
    workerId: "SM-006",
    worker: "Karan Bisht",
    zone: "Zone C",
    status: "Active",
    battery: 82,
    signal: 89,
    temperature: 33.4,
    gas: 22.3,
    motion: 0.13,
  },
];

const initialAlerts = [
  {
    id: "ALT-001",
    type: "Critical",
    title: "High gas concentration",
    message: "Unsafe gas level detected near Aman Rawat.",
    worker: "Aman Rawat",
    zone: "Zone C",
    time: "Just now",
    acknowledged: false,
  },
  {
    id: "ALT-002",
    type: "Warning",
    title: "Temperature rising",
    message: "Temperature exceeded the recommended threshold.",
    worker: "Vikas Negi",
    zone: "Zone B",
    time: "2 min ago",
    acknowledged: false,
  },
  {
    id: "ALT-003",
    type: "Warning",
    title: "Weak helmet signal",
    message: "Helmet HLM-004 has degraded network connectivity.",
    worker: "Aman Rawat",
    zone: "Zone C",
    time: "5 min ago",
    acknowledged: false,
  },
];

const initialGateways = [
  {
    id: "GW-001",
    name: "Gateway Alpha",
    zone: "Zone A",
    status: "Online",
    signal: 96,
    latency: 18,
    devices: 42,
  },
  {
    id: "GW-002",
    name: "Gateway Beta",
    zone: "Zone B",
    status: "Online",
    signal: 91,
    latency: 24,
    devices: 38,
  },
  {
    id: "GW-003",
    name: "Gateway Gamma",
    zone: "Zone C",
    status: "Warning",
    signal: 67,
    latency: 82,
    devices: 31,
  },
  {
    id: "GW-004",
    name: "Gateway Delta",
    zone: "Zone D",
    status: "Offline",
    signal: 0,
    latency: null,
    devices: 17,
  },
];

const initialRiskHistory = [
  { time: "08:00", score: 2.8 },
  { time: "09:00", score: 3.1 },
  { time: "10:00", score: 3.4 },
  { time: "11:00", score: 3.0 },
  { time: "12:00", score: 3.7 },
  { time: "13:00", score: 4.1 },
  { time: "14:00", score: 3.6 },
  { time: "15:00", score: 3.2 },
];

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

const randomChange = (value, amount = 1) => {
  return value + (Math.random() * amount * 2 - amount);
};

const getWorkerStatus = (riskScore) => {
  if (riskScore > 8) {
    return "Critical";
  }

  if (riskScore > 5) {
    return "Warning";
  }

  return "Safe";
};

export default function useMineData(options = {}) {
  const {
    autoRefresh = true,
    refreshInterval = 10000,
  } = options;

  const [workers, setWorkers] = useState(initialWorkers);
  const [helmets, setHelmets] = useState(initialHelmets);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [gateways, setGateways] = useState(initialGateways);
  const [riskHistory, setRiskHistory] = useState(initialRiskHistory);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refreshData = useCallback(() => {
    setWorkers((currentWorkers) =>
      currentWorkers.map((worker) => {
        const temperature = clamp(
          randomChange(worker.temperature, 0.4),
          25,
          50
        );

        const gas = clamp(
          randomChange(worker.gas, 1.5),
          5,
          100
        );

        const motion = clamp(
          randomChange(worker.motion, 0.03),
          0,
          1
        );

        const riskScore = clamp(
          worker.riskScore + randomChange(0, 0.35),
          0,
          10
        );

        return {
          ...worker,
          temperature: Number(temperature.toFixed(1)),
          gas: Number(gas.toFixed(1)),
          motion: Number(motion.toFixed(2)),
          riskScore: Number(riskScore.toFixed(1)),
          status: getWorkerStatus(riskScore),
          battery: clamp(
            worker.battery - Math.random() * 0.2,
            0,
            100
          ),
        };
      })
    );

    setHelmets((currentHelmets) =>
      currentHelmets.map((helmet) => ({
        ...helmet,
        battery: Number(
          clamp(
            helmet.battery - Math.random() * 0.15,
            0,
            100
          ).toFixed(0)
        ),
        signal: Math.round(
          clamp(
            randomChange(helmet.signal, 2),
            0,
            100
          )
        ),
      }))
    );

    setGateways((currentGateways) =>
      currentGateways.map((gateway) => ({
        ...gateway,
        signal:
          gateway.status === "Offline"
            ? 0
            : Math.round(
                clamp(randomChange(gateway.signal, 1.5), 0, 100)
              ),
        latency:
          gateway.status === "Offline"
            ? null
            : Math.round(
                clamp(randomChange(gateway.latency, 4), 5, 200)
              ),
      }))
    );

    setRiskHistory((currentHistory) => {
      const latestScore =
        workers.length > 0
          ? workers.reduce(
              (total, worker) => total + worker.riskScore,
              0
            ) / workers.length
          : 0;

      const newPoint = {
        time: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        score: Number(latestScore.toFixed(1)),
      };

      return [...currentHistory.slice(-7), newPoint];
    });

    setLastUpdated(new Date());
  }, [workers]);

  useEffect(() => {
    if (!autoRefresh) {
      return undefined;
    }

    const interval = setInterval(() => {
      refreshData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshData]);

  const acknowledgeAlert = useCallback((alertId) => {
    setAlerts((currentAlerts) =>
      currentAlerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              acknowledged: true,
            }
          : alert
      )
    );
  }, []);

  const addAlert = useCallback((alert) => {
    setAlerts((currentAlerts) => [
      {
        id: `ALT-${Date.now()}`,
        acknowledged: false,
        time: "Just now",
        ...alert,
      },
      ...currentAlerts,
    ]);
  }, []);

  const resetData = useCallback(() => {
    setWorkers(initialWorkers);
    setHelmets(initialHelmets);
    setAlerts(initialAlerts);
    setGateways(initialGateways);
    setRiskHistory(initialRiskHistory);
    setLastUpdated(new Date());
  }, []);

  const statistics = useMemo(() => {
    const totalWorkers = workers.length;

    const safeWorkers = workers.filter(
      (worker) => worker.status === "Safe"
    ).length;

    const warningWorkers = workers.filter(
      (worker) => worker.status === "Warning"
    ).length;

    const criticalWorkers = workers.filter(
      (worker) => worker.status === "Critical"
    ).length;

    const onlineGateways = gateways.filter(
      (gateway) => gateway.status === "Online"
    ).length;

    const activeHelmets = helmets.filter(
      (helmet) => helmet.status !== "Offline"
    ).length;

    const lowBatteryHelmets = helmets.filter(
      (helmet) => helmet.battery < 30
    ).length;

    const averageRisk =
      totalWorkers > 0
        ? workers.reduce(
            (total, worker) => total + Number(worker.riskScore),
            0
          ) / totalWorkers
        : 0;

    const averageTemperature =
      totalWorkers > 0
        ? workers.reduce(
            (total, worker) => total + Number(worker.temperature),
            0
          ) / totalWorkers
        : 0;

    const averageGas =
      totalWorkers > 0
        ? workers.reduce(
            (total, worker) => total + Number(worker.gas),
            0
          ) / totalWorkers
        : 0;

    return {
      totalWorkers,
      safeWorkers,
      warningWorkers,
      criticalWorkers,
      onlineGateways,
      totalGateways: gateways.length,
      activeHelmets,
      totalHelmets: helmets.length,
      lowBatteryHelmets,
      averageRisk: Number(averageRisk.toFixed(1)),
      averageTemperature: Number(averageTemperature.toFixed(1)),
      averageGas: Number(averageGas.toFixed(1)),
      networkHealth:
        gateways.length > 0
          ? Number(
              (
                (onlineGateways / gateways.length) *
                100
              ).toFixed(1)
            )
          : 0,
      activeAlerts: alerts.filter(
        (alert) => !alert.acknowledged
      ).length,
    };
  }, [workers, helmets, gateways, alerts]);

  const mineData = useMemo(
    () => ({
      workers,
      helmets,
      alerts,
      gateways,
      riskHistory,
      statistics,
      lastUpdated,
    }),
    [
      workers,
      helmets,
      alerts,
      gateways,
      riskHistory,
      statistics,
      lastUpdated,
    ]
  );

  return {
    ...mineData,

    // Actions
    refreshData,
    acknowledgeAlert,
    addAlert,
    resetData,

    // Convenient aliases
    isLoading: false,
    isLive: autoRefresh,
  };
}