import { ref, onValue } from "firebase/database";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { database } from "../firebase";
import workersRoster from "../data/workers";
import zonesRoster from "../data/zones";

import {
  SAFETY_BANDS,
  computeWorkerRisk,
  computeZoneRisk,
  getBandFromScore,
} from "../utils/riskEngine";

import {
  PRIMARY_WORKER_ID,
  SECONDARY_WORKER_ID,
  STAGE_COUNT,
  TICK_INTERVAL_MS,
  getScenarioStage,
  isFinalStage,
} from "../utils/simulationScenario";

const HISTORY_LIMIT = 30;
const TIMELINE_LIMIT = 20;

const FIREBASE_PATH = "SafeMine";

const MineDataContext = createContext(null);

// =========================================================
// HELPERS
// =========================================================

const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max);

function buildBaselineReadings() {
  const readings = {};

  workersRoster.forEach((worker) => {
    readings[worker.id] = {
      gas: worker.gas,
      temperature: worker.temperature,
      motion: worker.motion,
      battery: worker.battery,
      signal: worker.signal,
    };
  });

  // Simulation starts with Aman Rawat's scripted baseline.
  if (workersRoster.some((worker) => worker.id === PRIMARY_WORKER_ID)) {
    readings[PRIMARY_WORKER_ID] = {
      ...getScenarioStage(0)[PRIMARY_WORKER_ID],
    };
  }

  return readings;
}

function buildBaselineHistory(readings, timestamp) {
  const history = {};

  workersRoster.forEach((worker) => {
    history[worker.id] = [
      {
        ...(readings[worker.id] || {}),
        timestamp,
      },
    ];
  });

  return history;
}

function buildBaselineTimeline(timestamp) {
  const timeline = {};

  workersRoster.forEach((worker) => {
    timeline[worker.id] = [
      {
        id: `${worker.id}-seed-${timestamp}`,
        time: timestamp,
        icon: "🟢",
        label: "Monitoring started — all readings normal.",
      },
    ];
  });

  return timeline;
}

// =========================================================
// FIREBASE CONVERTER
// =========================================================

function convertFirebaseData(firebaseData, previous = {}) {
  if (!firebaseData || typeof firebaseData !== "object") {
    return previous;
  }

  const numberValue = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const motionValue =
    typeof firebaseData.motion === "boolean"
      ? firebaseData.motion
        ? 1
        : 0
      : numberValue(firebaseData.motion, previous.motion ?? 0);

  return {
    ...previous,

    gas: numberValue(
      firebaseData.gas,
      previous.gas ?? 0
    ),

    temperature: numberValue(
      firebaseData.temperature,
      previous.temperature ?? 25
    ),

    motion: motionValue,

    battery: numberValue(
      firebaseData.battery,
      previous.battery ?? 100
    ),

    signal: numberValue(
      firebaseData.signal,
      previous.signal ?? 100
    ),

    humidity:
      firebaseData.humidity ??
      previous.humidity ??
      null,

    pressure:
      firebaseData.pressure ??
      previous.pressure ??
      null,

    impact:
      firebaseData.impact ??
      previous.impact ??
      false,

    noMotion:
      firebaseData.noMotion ??
      previous.noMotion ??
      false,

    systemStatus:
      firebaseData.systemStatus ??
      previous.systemStatus ??
      "ONLINE",

    lastUpdate:
      firebaseData.lastUpdate ??
      previous.lastUpdate ??
      null,

    dhtOK:
      firebaseData.dhtOK ??
      previous.dhtOK ??
      false,

    bmpOK:
      firebaseData.bmpOK ??
      previous.bmpOK ??
      false,

    mpuOK:
      firebaseData.mpuOK ??
      previous.mpuOK ??
      false,

    acceleration:
      firebaseData.acceleration ??
      previous.acceleration ??
      {
        ax: 0,
        ay: 0,
        az: 0,
      },

    gyro:
      firebaseData.gyro ??
      previous.gyro ??
      {
        gx: 0,
        gy: 0,
        gz: 0,
      },
  };
}

// =========================================================
// PROVIDER
// =========================================================

export function MineDataProvider({ children }) {
  const [readings, setReadings] = useState(() =>
    buildBaselineReadings()
  );

  const [history, setHistory] = useState(() =>
    buildBaselineHistory(
      buildBaselineReadings(),
      Date.now()
    )
  );

  const [timeline, setTimeline] = useState(() =>
    buildBaselineTimeline(Date.now())
  );

  const [alerts, setAlerts] = useState([]);

  const [simulationActive, setSimulationActive] =
    useState(false);

  const [stageIndex, setStageIndex] = useState(0);

  const [firebaseConnected, setFirebaseConnected] =
    useState(false);

  const [firebaseData, setFirebaseData] =
    useState(null);

  const [riskHistory, setRiskHistory] = useState([
    {
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      score: 2.0,
    },
  ]);

  const previousBandRef = useRef({});
  const previousFactorKeysRef = useRef({});

  // =========================================================
  // FIREBASE REALTIME LISTENER
  // =========================================================

  useEffect(() => {
    console.log(
      `🔥 Firebase listener started: ${FIREBASE_PATH}`
    );

    const firebaseRef = ref(
      database,
      FIREBASE_PATH
    );

    const unsubscribe = onValue(
      firebaseRef,
      (snapshot) => {
        const data = snapshot.val();

        console.log(
          "🔥 Firebase realtime:",
          data
        );

        if (!data) {
          setFirebaseConnected(false);
          setFirebaseData(null);
          return;
        }

        setFirebaseConnected(true);
        setFirebaseData(data);

        // ---------------------------------------------------
        // IMPORTANT:
        // During simulation Firebase is NOT allowed to
        // overwrite the scripted simulation values.
        // ---------------------------------------------------

        if (simulationActive) {
          return;
        }

        // ---------------------------------------------------
        // FIREBASE -> SM-004
        // ---------------------------------------------------

        setReadings((current) => {
          const previous =
            current[PRIMARY_WORKER_ID] || {};

          const liveReading =
            convertFirebaseData(
              data,
              previous
            );

          return {
            ...current,
            [PRIMARY_WORKER_ID]:
              liveReading,
          };
        });
      },
      (error) => {
        console.error(
          "❌ Firebase listener error:",
          error
        );

        setFirebaseConnected(false);
      }
    );

    return () => {
      console.log(
        "🔌 Firebase listener stopped"
      );

      unsubscribe();
    };
  }, [simulationActive]);

  // =========================================================
  // FIREBASE HISTORY
  // =========================================================

  useEffect(() => {
    if (
      !firebaseConnected ||
      !firebaseData ||
      simulationActive
    ) {
      return;
    }

    const timestamp = Date.now();

    setHistory((currentHistory) => {
      const workerHistory =
        currentHistory[PRIMARY_WORKER_ID] || [];

      const currentReading =
        readings[PRIMARY_WORKER_ID];

      if (!currentReading) {
        return currentHistory;
      }

      const lastReading =
        workerHistory[
          workerHistory.length - 1
        ];

      // Prevent identical readings from being added
      // repeatedly without an actual Firebase change.
      const importantKeys = [
        "gas",
        "temperature",
        "motion",
        "battery",
        "signal",
      ];

      const changed =
        !lastReading ||
        importantKeys.some(
          (key) =>
            lastReading[key] !==
            currentReading[key]
        );

      if (!changed) {
        return currentHistory;
      }

      return {
        ...currentHistory,

        [PRIMARY_WORKER_ID]: [
          ...workerHistory,
          {
            ...currentReading,
            timestamp,
          },
        ].slice(-HISTORY_LIMIT),
      };
    });
  }, [
    firebaseData,
    firebaseConnected,
    simulationActive,
    readings,
  ]);

  // =========================================================
  // SIMULATION TICK
  // =========================================================

  const tick = useCallback(() => {
    if (!simulationActive) {
      return;
    }

    const nextStageIndex = Math.min(
      stageIndex + 1,
      STAGE_COUNT - 1
    );

    const scenario =
      getScenarioStage(nextStageIndex);

    const timestamp = Date.now();

    const nextReadings = {
      ...readings,
    };

    // -------------------------------------------------------
    // Only the two scripted workers change during simulation.
    // Every other worker remains unchanged.
    // -------------------------------------------------------

    nextReadings[PRIMARY_WORKER_ID] = {
      ...scenario[PRIMARY_WORKER_ID],
    };

    nextReadings[SECONDARY_WORKER_ID] = {
      ...scenario[SECONDARY_WORKER_ID],
    };

    // -------------------------------------------------------
    // HISTORY
    // -------------------------------------------------------

    const nextHistory = {
      ...history,
    };

    workersRoster.forEach((worker) => {
      const existing =
        history[worker.id] || [];

      nextHistory[worker.id] = [
        ...existing,
        {
          ...(nextReadings[worker.id] || {}),
          timestamp,
        },
      ].slice(-HISTORY_LIMIT);
    });

    const newAlerts = [];
    const timelineAdditions = {};

    const pushTimeline = (
      workerId,
      entry
    ) => {
      timelineAdditions[workerId] =
        timelineAdditions[workerId] || [];

      timelineAdditions[workerId].push(entry);
    };

    let totalSafetyScore = 0;

    // -------------------------------------------------------
    // RISK
    // -------------------------------------------------------

    workersRoster.forEach((worker) => {
      const workerWithReading = {
        ...worker,
        ...(nextReadings[worker.id] || {}),
      };

      const risk =
        computeWorkerRisk(
          workerWithReading,
          nextHistory[worker.id] || []
        );

      totalSafetyScore +=
        risk.safetyScore;

      const previousBand =
        previousBandRef.current[
          worker.id
        ] || SAFETY_BANDS.SAFE;

      const previousFactorKeys =
        previousFactorKeysRef.current[
          worker.id
        ] || [];

      const currentFactorKeys =
        risk.factors.map(
          (factor) => factor.key
        );

      // New risk factors
      risk.factors
        .filter(
          (factor) =>
            !previousFactorKeys.includes(
              factor.key
            )
        )
        .forEach((factor) => {
          pushTimeline(
            worker.id,
            {
              id: `${worker.id}-${timestamp}-${factor.key}`,
              time: timestamp,
              icon:
                risk.band ===
                SAFETY_BANDS.CRITICAL
                  ? "🔴"
                  : "🟡",
              label: factor.reason,
            }
          );
        });

      // Moderate / High
      const enteringModerateOrHigh =
        risk.band !== previousBand &&
        (
          risk.band ===
            SAFETY_BANDS.MODERATE ||
          risk.band ===
            SAFETY_BANDS.HIGH
        ) &&
        risk.band !==
          SAFETY_BANDS.CRITICAL;

      if (enteringModerateOrHigh) {
        const alert = {
          id:
            `ALT-${timestamp}-${worker.id}-pred`,

          kind: "predictive",

          type:
            risk.band ===
            SAFETY_BANDS.HIGH
              ? "High"
              : "Warning",

          title:
            risk.band ===
            SAFETY_BANDS.HIGH
              ? "Risk escalating"
              : "Early Warning",

          message:
            risk.explanation[0] ||
            `${worker.name}'s readings are trending toward unsafe levels.`,

          worker: worker.name,
          workerId: worker.id,
          zone: worker.zone,
          time: timestamp,
          acknowledged: false,
        };

        newAlerts.push(alert);

        pushTimeline(
          worker.id,
          {
            id: `${alert.id}-tl`,
            time: timestamp,
            icon: "🟡",
            label:
              risk.band ===
              SAFETY_BANDS.HIGH
                ? "Risk escalating"
                : "Early warning generated",
          }
        );
      }

      // Critical
      if (
        risk.band ===
          SAFETY_BANDS.CRITICAL &&
        previousBand !==
          SAFETY_BANDS.CRITICAL
      ) {
        const alert = {
          id:
            `ALT-${timestamp}-${worker.id}-crit`,

          kind: "current",
          type: "Critical",

          title:
            risk.factors[0]?.label
              ? `Critical: ${risk.factors[0].label}`
              : "Critical safety threshold exceeded",

          message:
            risk.explanation.join(" ") ||
            "Multiple safety thresholds exceeded.",

          worker: worker.name,
          workerId: worker.id,
          zone: worker.zone,
          time: timestamp,
          acknowledged: false,
        };

        newAlerts.push(alert);

        pushTimeline(
          worker.id,
          {
            id: `${alert.id}-tl-1`,
            time: timestamp,
            icon: "🔴",
            label: "High risk detected",
          }
        );

        pushTimeline(
          worker.id,
          {
            id: `${alert.id}-tl-2`,
            time: timestamp,
            icon: "🚨",
            label: "Critical alert generated",
          }
        );
      }

      previousBandRef.current[
        worker.id
      ] = risk.band;

      previousFactorKeysRef.current[
        worker.id
      ] = currentFactorKeys;
    });

    // -------------------------------------------------------
    // STATE
    // -------------------------------------------------------

    setReadings(nextReadings);
    setHistory(nextHistory);

    // -------------------------------------------------------
    // RISK HISTORY
    // -------------------------------------------------------

    const averageSafetyScore =
      totalSafetyScore /
      workersRoster.length;

    setRiskHistory((current) => [
      ...current,
      {
        time:
          new Date(timestamp).toLocaleTimeString(
            "en-IN",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
        score: Number(
          (
            averageSafetyScore / 10
          ).toFixed(1)
        ),
      },
    ].slice(-20));

    // -------------------------------------------------------
    // TIMELINE
    // -------------------------------------------------------

    if (
      Object.keys(
        timelineAdditions
      ).length > 0
    ) {
      setTimeline((current) => {
        const merged = {
          ...current,
        };

        Object.entries(
          timelineAdditions
        ).forEach(
          ([workerId, entries]) => {
            merged[workerId] = [
              ...(current[workerId] || []),
              ...entries,
            ].slice(-TIMELINE_LIMIT);
          }
        );

        return merged;
      });
    }

    // -------------------------------------------------------
    // ALERTS
    // -------------------------------------------------------

    if (newAlerts.length > 0) {
      setAlerts((current) =>
        [
          ...newAlerts,
          ...current,
        ].slice(0, 40)
      );
    }

    setStageIndex(
      nextStageIndex
    );
  }, [
    simulationActive,
    stageIndex,
    readings,
    history,
  ]);

  // =========================================================
  // SIMULATION INTERVAL
  // =========================================================

  useEffect(() => {
    if (!simulationActive) {
      return;
    }

    const interval = setInterval(
      tick,
      TICK_INTERVAL_MS
    );

    return () =>
      clearInterval(interval);
  }, [
    simulationActive,
    tick,
  ]);

  // =========================================================
  // RESET
  // =========================================================

  const resetToBaseline =
    useCallback(() => {
      const baseline =
        buildBaselineReadings();

      const timestamp = Date.now();

      setReadings(baseline);

      setHistory(
        buildBaselineHistory(
          baseline,
          timestamp
        )
      );

      setTimeline(
        buildBaselineTimeline(
          timestamp
        )
      );

      setAlerts([]);

      setStageIndex(0);

      setRiskHistory([
        {
          time:
            new Date(timestamp).toLocaleTimeString(
              "en-IN",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
          score: 2.0,
        },
      ]);

      previousBandRef.current = {};
      previousFactorKeysRef.current = {};
    }, []);

  // =========================================================
  // START SIMULATION
  // =========================================================

  const startSimulation =
    useCallback(() => {
      resetToBaseline();

      setSimulationActive(true);
    }, [
      resetToBaseline,
    ]);

  // =========================================================
  // STOP SIMULATION
  // =========================================================

  const stopSimulation =
    useCallback(() => {
      setSimulationActive(false);
    }, []);

  // =========================================================
  // RESET SIMULATION
  // =========================================================

  const resetSimulation =
    useCallback(() => {
      setSimulationActive(false);
      resetToBaseline();
    }, [
      resetToBaseline,
    ]);

  // =========================================================
  // ACKNOWLEDGE ALERT
  // =========================================================

  const acknowledgeAlert =
    useCallback(
      (alertId) => {
        setAlerts((current) =>
          current.map((alert) =>
            alert.id === alertId
              ? {
                  ...alert,
                  acknowledged: true,
                }
              : alert
          )
        );
      },
      []
    );

  // =========================================================
  // ENRICHED WORKERS
  // =========================================================

  const enrichedWorkers =
    useMemo(
      () =>
        workersRoster.map(
          (worker) => {
            const workerWithReading = {
              ...worker,
              ...(readings[worker.id] || {}),
            };

            const risk =
              computeWorkerRisk(
                workerWithReading,
                history[
                  worker.id
                ] || []
              );

            return {
              ...workerWithReading,
              ...risk,
            };
          }
        ),
      [
        readings,
        history,
      ]
    );

  // =========================================================
  // ZONES
  // =========================================================

  const zones =
    useMemo(
      () =>
        zonesRoster.map(
          (zone) => {
            const zoneWorkers =
              enrichedWorkers.filter(
                (worker) =>
                  worker.zone ===
                  zone.id
              );

            return {
              ...zone,
              ...computeZoneRisk(
                zone.id,
                zoneWorkers
              ),
            };
          }
        ),
      [enrichedWorkers]
    );

  // =========================================================
  // STATISTICS
  // =========================================================

  const statistics =
    useMemo(() => {
      const sortedByRisk =
        [...enrichedWorkers].sort(
          (a, b) =>
            b.safetyScore -
            a.safetyScore
        );

      const sortedZonesByRisk =
        [...zones].sort(
          (a, b) =>
            b.safetyScore -
            a.safetyScore
        );

      const averageSafetyScore =
        enrichedWorkers.length > 0
          ? enrichedWorkers.reduce(
              (total, worker) =>
                total +
                worker.safetyScore,
              0
            ) /
            enrichedWorkers.length
          : 0;

      return {
        totalWorkers:
          enrichedWorkers.length,

        safeWorkers:
          enrichedWorkers.filter(
            (worker) =>
              worker.status === "Safe"
          ).length,

        atRiskWorkers:
          enrichedWorkers.filter(
            (worker) =>
              worker.status === "Warning"
          ).length,

        criticalWorkers:
          enrichedWorkers.filter(
            (worker) =>
              worker.status === "Critical"
          ).length,

        activeAlerts:
          alerts.filter(
            (alert) =>
              !alert.acknowledged
          ).length,

        highRiskZones:
          zones.filter(
            (zone) =>
              zone.band ===
                SAFETY_BANDS.HIGH ||
              zone.band ===
                SAFETY_BANDS.CRITICAL
          ).length,

        highestRiskWorker:
          sortedByRisk[0] || null,

        highestRiskZone:
          sortedZonesByRisk[0] || null,

        overallSafetyScore:
          Math.round(
            averageSafetyScore
          ),

        overallRiskScore:
          Number(
            (
              averageSafetyScore / 10
            ).toFixed(1)
          ),

        overallBand:
          getBandFromScore(
            averageSafetyScore
          ),
      };
    }, [
      enrichedWorkers,
      zones,
      alerts,
    ]);

  // =========================================================
  // CONTEXT VALUE
  // =========================================================

  const value =
    useMemo(
      () => ({
        workers: enrichedWorkers,
        zones,
        alerts,
        history,
        timeline,
        riskHistory,
        statistics,

        firebase: {
          connected:
            firebaseConnected,

          data:
            firebaseData,

          path:
            FIREBASE_PATH,
        },

        simulation: {
          active:
            simulationActive,

          stage:
            stageIndex,

          stageCount:
            STAGE_COUNT,

          isFinalStage:
            isFinalStage(
              stageIndex
            ),
        },

        startSimulation,
        stopSimulation,
        resetSimulation,
        acknowledgeAlert,
      }),
      [
        enrichedWorkers,
        zones,
        alerts,
        history,
        timeline,
        riskHistory,
        statistics,
        firebaseConnected,
        firebaseData,
        simulationActive,
        stageIndex,
        startSimulation,
        stopSimulation,
        resetSimulation,
        acknowledgeAlert,
      ]
    );

  return (
    <MineDataContext.Provider
      value={value}
    >
      {children}
    </MineDataContext.Provider>
  );
}

// =========================================================
// HOOK
// =========================================================

export function useMineContext() {
  const context =
    useContext(
      MineDataContext
    );

  if (!context) {
    throw new Error(
      "useMineContext must be used within a MineDataProvider"
    );
  }

  return context;
}
