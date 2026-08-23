import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

/* Firebase */
import { onValue, ref } from "firebase/database";
import { database } from "../firebase";

const HISTORY_LIMIT = 30;
const TIMELINE_LIMIT = 20;

const MineDataContext = createContext(null);

const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max);

const meanRevert = (
  current,
  baseline,
  amount,
  decay = 0.85
) =>
  baseline +
  (current - baseline) * decay +
  (Math.random() * amount * 2 - amount);

/*
|--------------------------------------------------------------------------
| BASELINE READINGS
|--------------------------------------------------------------------------
*/

function buildBaselineReadings() {
  const readings = {};

  workersRoster.forEach((worker) => {
    if (worker.id === PRIMARY_WORKER_ID) {
      readings[worker.id] = {
        ...getScenarioStage(0)[PRIMARY_WORKER_ID],
      };

      return;
    }

    readings[worker.id] = {
      gas: worker.gas,
      temperature: worker.temperature,
      motion: worker.motion,
      battery: worker.battery,
      signal: worker.signal,
    };
  });

  return readings;
}

const BASELINE_READINGS = buildBaselineReadings();

/*
|--------------------------------------------------------------------------
| BASELINE HISTORY
|--------------------------------------------------------------------------
*/

function buildBaselineHistory(readings, timestamp) {
  const history = {};

  workersRoster.forEach((worker) => {
    history[worker.id] = [
      {
        ...readings[worker.id],
        timestamp,
      },
    ];
  });

  return history;
}

/*
|--------------------------------------------------------------------------
| BASELINE TIMELINE
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| PROVIDER
|--------------------------------------------------------------------------
*/

export function MineDataProvider({ children }) {
  const [readings, setReadings] = useState(
    buildBaselineReadings
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

  const [riskHistory, setRiskHistory] = useState(() => [
    {
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      score: 2.0,
    },
  ]);

  /*
  |--------------------------------------------------------------------------
  | FIREBASE LIVE DATA
  |--------------------------------------------------------------------------
  */

  const [firebaseData, setFirebaseData] =
    useState({});

  const [firebaseConnected, setFirebaseConnected] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | FIREBASE REAL-TIME LISTENER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const sensorRef = ref(
      database,
      "SafeMine"
    );

    const unsubscribe = onValue(
      sensorRef,
      (snapshot) => {
        const data = snapshot.val();

        console.log(
          "🔥 Firebase Live Data:",
          data
        );

        if (data !== null) {
          setFirebaseData(data);
          setFirebaseConnected(true);
        } else {
          setFirebaseData({});
          setFirebaseConnected(false);
        }
      },
      (error) => {
        console.error(
          "❌ Firebase read error:",
          error
        );

        setFirebaseData({});
        setFirebaseConnected(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | TRACK PREVIOUS CONDITIONS
  |--------------------------------------------------------------------------
  */

  const previousBandRef = useRef({});

  const previousFactorKeysRef = useRef({});

  const previousUncertainRef = useRef({});

  /*
  |--------------------------------------------------------------------------
  | MAIN SENSOR TICK
  |--------------------------------------------------------------------------
  */

  const tick = useCallback(() => {
    const nextStageIndex = simulationActive
      ? Math.min(
          stageIndex + 1,
          STAGE_COUNT - 1
        )
      : stageIndex;

    const scenario = simulationActive
      ? getScenarioStage(nextStageIndex)
      : null;

    const timestamp = Date.now();

    const nextReadings = {};

    /*
    |--------------------------------------------------------------------------
    | UPDATE SENSOR READINGS
    |--------------------------------------------------------------------------
    */

    workersRoster.forEach((worker) => {
      const isScripted =
        scenario &&
        (
          worker.id === PRIMARY_WORKER_ID ||
          worker.id === SECONDARY_WORKER_ID
        );

      /*
      |--------------------------------------------------------------
      | Scripted simulation workers
      |--------------------------------------------------------------
      */

      if (isScripted) {
        nextReadings[worker.id] = {
          ...scenario[worker.id],
        };

        return;
      }

      /*
      |--------------------------------------------------------------
      | Normal workers
      |--------------------------------------------------------------
      */

      const current = readings[worker.id];

      const baseline =
        BASELINE_READINGS[worker.id];

      nextReadings[worker.id] = {
        gas: Number(
          clamp(
            meanRevert(
              current.gas,
              baseline.gas,
              6
            ),
            0,
            1500
          ).toFixed(1)
        ),

        temperature: Number(
          clamp(
            meanRevert(
              current.temperature,
              baseline.temperature,
              0.25
            ),
            20,
            55
          ).toFixed(1)
        ),

        motion: Number(
          clamp(
            meanRevert(
              current.motion,
              baseline.motion,
              0.015
            ),
            0,
            1
          ).toFixed(2)
        ),

        battery: Number(
          clamp(
            current.battery -
              Math.random() * 0.1,
            0,
            100
          ).toFixed(0)
        ),

        signal: Number(
          clamp(
            meanRevert(
              current.signal,
              baseline.signal,
              1.2
            ),
            0,
            100
          ).toFixed(0)
        ),
      };
    });

    /*
    |--------------------------------------------------------------------------
    | UPDATE HISTORY
    |--------------------------------------------------------------------------
    */

    const nextHistory = {};

    workersRoster.forEach((worker) => {
      const existing =
        history[worker.id] || [];

      nextHistory[worker.id] = [
        ...existing,
        {
          ...nextReadings[worker.id],
          timestamp,
        },
      ].slice(-HISTORY_LIMIT);
    });

    /*
    |--------------------------------------------------------------------------
    | ALERT + TIMELINE STORAGE
    |--------------------------------------------------------------------------
    */

    const newAlerts = [];

    const timelineAdditions = {};

    const pushTimeline = (
      workerId,
      entry
    ) => {
      timelineAdditions[workerId] =
        timelineAdditions[workerId] || [];

      timelineAdditions[workerId].push(
        entry
      );
    };

    let totalSafetyScore = 0;

    /*
    |--------------------------------------------------------------------------
    | CALCULATE RISK FOR EVERY WORKER
    |--------------------------------------------------------------------------
    */

    workersRoster.forEach((worker) => {
      const workerWithReading = {
        ...worker,
        ...nextReadings[worker.id],
      };

      const risk = computeWorkerRisk(
        workerWithReading,
        nextHistory[worker.id]
      );

      totalSafetyScore +=
        risk.safetyScore;

      /*
      |--------------------------------------------------------------------------
      | PREVIOUS STATE
      |--------------------------------------------------------------------------
      */

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

      /*
      |--------------------------------------------------------------------------
      | UNCERTAIN CONDITION
      |--------------------------------------------------------------------------
      */

      const isUncertain =
        risk.isUncertain === true;

      const wasUncertain =
        previousUncertainRef.current[
          worker.id
        ] || false;

      /*
      |--------------------------------------------------------------------------
      | TIMELINE FOR NEW FACTORS
      |--------------------------------------------------------------------------
      */

      risk.factors
        .filter(
          (factor) =>
            !previousFactorKeys.includes(
              factor.key
            )
        )
        .forEach((factor) => {
          pushTimeline(worker.id, {
            id: `${worker.id}-${timestamp}-${factor.key}`,

            time: timestamp,

            icon:
              risk.band ===
              SAFETY_BANDS.CRITICAL
                ? "🔴"
                : "🟡",

            label: factor.reason,
          });
        });

      /*
      |--------------------------------------------------------------------------
      | NEW UNCERTAIN CONDITION ALERT
      |--------------------------------------------------------------------------
      */

      const newUncertainCondition =
        isUncertain && !wasUncertain;

      if (newUncertainCondition) {
        const alertType =
          risk.band ===
          SAFETY_BANDS.CRITICAL
            ? "Critical"
            : risk.band ===
              SAFETY_BANDS.HIGH
              ? "High"
              : "Warning";

        const alertTitle =
          risk.band ===
          SAFETY_BANDS.CRITICAL
            ? "Critical safety condition"
            : risk.band ===
              SAFETY_BANDS.HIGH
              ? "High risk condition detected"
              : "Uncertain condition detected";

        const alert = {
          id: `ALT-${timestamp}-${worker.id}-uncertain`,

          kind: "predictive",

          type: alertType,

          title: alertTitle,

          message:
            risk.explanation[0] ||
            `${worker.name}'s sensor readings indicate an uncertain safety condition.`,

          worker: worker.name,

          workerId: worker.id,

          zone: worker.zone,

          time: timestamp,

          acknowledged: false,
        };

        newAlerts.push(alert);

        pushTimeline(worker.id, {
          id: `${alert.id}-tl`,

          time: timestamp,

          icon:
            risk.band ===
            SAFETY_BANDS.CRITICAL
              ? "🔴"
              : risk.band ===
                SAFETY_BANDS.HIGH
                ? "🟠"
                : "🟡",

          label:
            risk.band ===
            SAFETY_BANDS.CRITICAL
              ? "Critical safety condition detected"
              : "Uncertain safety condition detected",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | CRITICAL ALERT
      |--------------------------------------------------------------------------
      */

      if (
        risk.band ===
          SAFETY_BANDS.CRITICAL &&
        previousBand !==
          SAFETY_BANDS.CRITICAL &&
        !newUncertainCondition
      ) {
        const alert = {
          id: `ALT-${timestamp}-${worker.id}-crit`,

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

        pushTimeline(worker.id, {
          id: `${alert.id}-tl-1`,

          time: timestamp,

          icon: "🔴",

          label: "High risk detected",
        });

        pushTimeline(worker.id, {
          id: `${alert.id}-tl-2`,

          time: timestamp,

          icon: "🚨",

          label: "Critical alert generated",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | SAVE CURRENT STATE
      |--------------------------------------------------------------------------
      */

      previousBandRef.current[
        worker.id
      ] = risk.band;

      previousFactorKeysRef.current[
        worker.id
      ] = currentFactorKeys;

      previousUncertainRef.current[
        worker.id
      ] = isUncertain;
    });

    /*
    |--------------------------------------------------------------------------
    | UPDATE READINGS + HISTORY
    |--------------------------------------------------------------------------
    */

    setReadings(nextReadings);

    setHistory(nextHistory);

    /*
    |--------------------------------------------------------------------------
    | OVERALL RISK HISTORY
    |--------------------------------------------------------------------------
    */

    const averageSafetyScore =
      totalSafetyScore /
      workersRoster.length;

    setRiskHistory((current) => {
      const point = {
        time: new Date(
          timestamp
        ).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),

        score: Number(
          (
            averageSafetyScore / 10
          ).toFixed(1)
        ),
      };

      return [
        ...current,
        point,
      ].slice(-20);
    });

    /*
    |--------------------------------------------------------------------------
    | UPDATE TIMELINE
    |--------------------------------------------------------------------------
    */

    if (
      Object.keys(timelineAdditions)
        .length > 0
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
              ...(current[workerId] ||
                []),
              ...entries,
            ].slice(-TIMELINE_LIMIT);
          }
        );

        return merged;
      });
    }

    /*
    |--------------------------------------------------------------------------
    | ADD ALERTS
    |--------------------------------------------------------------------------
    */

    if (newAlerts.length > 0) {
      setAlerts((current) =>
        [
          ...newAlerts,
          ...current,
        ].slice(0, 40)
      );
    }

    /*
    |--------------------------------------------------------------------------
    | ADVANCE SIMULATION
    |--------------------------------------------------------------------------
    */

    if (simulationActive) {
      setStageIndex(
        nextStageIndex
      );
    }
  }, [
    readings,
    history,
    simulationActive,
    stageIndex,
  ]);

  /*
  |--------------------------------------------------------------------------
  | SENSOR UPDATE TIMER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const interval = setInterval(
      tick,
      TICK_INTERVAL_MS
    );

    return () =>
      clearInterval(interval);
  }, [tick]);

  /*
  |--------------------------------------------------------------------------
  | RESET
  |--------------------------------------------------------------------------
  */

  const resetToBaseline =
    useCallback(() => {
      const baseline =
        buildBaselineReadings();

      const timestamp =
        Date.now();

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
          time: new Date(
            timestamp
          ).toLocaleTimeString(
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

      previousFactorKeysRef.current =
        {};

      previousUncertainRef.current =
        {};
    }, []);

  /*
  |--------------------------------------------------------------------------
  | SIMULATION CONTROLS
  |--------------------------------------------------------------------------
  */

  const startSimulation =
    useCallback(() => {
      resetToBaseline();
      setSimulationActive(true);
    }, [resetToBaseline]);

  const stopSimulation =
    useCallback(() => {
      setSimulationActive(false);
    }, []);

  const resetSimulation =
    useCallback(() => {
      setSimulationActive(false);
      resetToBaseline();
    }, [resetToBaseline]);

  /*
  |--------------------------------------------------------------------------
  | ACKNOWLEDGE ALERT
  |--------------------------------------------------------------------------
  */

  const acknowledgeAlert =
    useCallback((alertId) => {
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
    }, []);

  /*
  |--------------------------------------------------------------------------
  | ENRICHED WORKERS
  |--------------------------------------------------------------------------
  */

  const enrichedWorkers =
    useMemo(
      () =>
        workersRoster.map(
          (worker) => {
            const workerWithReading = {
              ...worker,
              ...readings[worker.id],
            };

            const risk =
              computeWorkerRisk(
                workerWithReading,
                history[worker.id] ||
                  []
              );

            return {
              ...workerWithReading,
              ...risk,
            };
          }
        ),
      [readings, history]
    );

  /*
  |--------------------------------------------------------------------------
  | ZONE RISK
  |--------------------------------------------------------------------------
  */

  const zones = useMemo(
    () =>
      zonesRoster.map((zone) => {
        const zoneWorkers =
          enrichedWorkers.filter(
            (worker) =>
              worker.zone === zone.id
          );

        return {
          ...zone,
          ...computeZoneRisk(
            zone.id,
            zoneWorkers
          ),
        };
      }),
    [enrichedWorkers]
  );

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const statistics = useMemo(() => {
    const sortedByRisk = [
      ...enrichedWorkers,
    ].sort(
      (a, b) =>
        b.safetyScore -
        a.safetyScore
    );

    const sortedZonesByRisk = [
      ...zones,
    ].sort(
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
            worker.status ===
            "Safe"
        ).length,

      atRiskWorkers:
        enrichedWorkers.filter(
          (worker) =>
            worker.status ===
            "Warning"
        ).length,

      criticalWorkers:
        enrichedWorkers.filter(
          (worker) =>
            worker.status ===
            "Critical"
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
        sortedZonesByRisk[0] ||
        null,

      overallSafetyScore:
        Math.round(
          averageSafetyScore
        ),

      overallRiskScore:
        Number(
          (
            averageSafetyScore /
            10
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

  /*
  |--------------------------------------------------------------------------
  | CONTEXT VALUE
  |--------------------------------------------------------------------------
  */

  const value = useMemo(
    () => ({
      /*
      |--------------------------------------------------------------------------
      | FIREBASE DATA
      |--------------------------------------------------------------------------
      */

      firebase: {
        connected:
          firebaseConnected,

        data:
          firebaseData,

        path:
          "SafeMine",
      },

      /*
      |--------------------------------------------------------------------------
      | EXISTING DATA
      |--------------------------------------------------------------------------
      */

      workers:
        enrichedWorkers,

      zones,

      alerts,

      history,

      timeline,

      riskHistory,

      statistics,

      /*
      |--------------------------------------------------------------------------
      | SIMULATION
      |--------------------------------------------------------------------------
      */

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

      /*
      |--------------------------------------------------------------------------
      | CONTROLS
      |--------------------------------------------------------------------------
      */

      startSimulation,

      stopSimulation,

      resetSimulation,

      acknowledgeAlert,
    }),
    [
      firebaseData,
      firebaseConnected,

      enrichedWorkers,
      zones,
      alerts,
      history,
      timeline,
      riskHistory,
      statistics,

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

/*
|--------------------------------------------------------------------------
| HOOK
|--------------------------------------------------------------------------
*/

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