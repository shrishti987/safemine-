// The scripted "Start Safety Simulation" incident.
//
// Aman Rawat (SM-004, Zone C) is already the app's established
// problem worker in the existing static alert data — this scenario
// plays that story forward instead of inventing a new one. Karan
// Bisht (SM-006, also Zone C) gets a smaller secondary rise so the
// zone-hazard detection ("multiple workers trending up together")
// has something real to key off, per the requirement that a single
// bad reading is a worker problem but several at once is a zone
// problem.

export const TICK_INTERVAL_MS = 2000;

export const PRIMARY_WORKER_ID = "SM-004";
export const SECONDARY_WORKER_ID = "SM-006";

// Each index is one simulation tick. Values are absolute readings,
// not deltas, so the scenario is easy to read and tune directly.
const primaryStages = [
  { gas: 18, temperature: 31.5, motion: 0.08, battery: 94, signal: 96 },
  { gas: 20, temperature: 32.0, motion: 0.09, battery: 92, signal: 94 },
  { gas: 24, temperature: 33.0, motion: 0.13, battery: 90, signal: 91 },
  { gas: 29, temperature: 34.5, motion: 0.19, battery: 87, signal: 88 },
  { gas: 36, temperature: 36.5, motion: 0.28, battery: 83, signal: 83 },
  { gas: 44, temperature: 38.5, motion: 0.40, battery: 78, signal: 77 },
  { gas: 53, temperature: 40.0, motion: 0.53, battery: 71, signal: 70 },
  { gas: 63, temperature: 41.5, motion: 0.65, battery: 58, signal: 62 },
  { gas: 72, temperature: 43.0, motion: 0.75, battery: 42, signal: 52 },
  { gas: 80, temperature: 44.5, motion: 0.85, battery: 28, signal: 40 },
  { gas: 82, temperature: 45.0, motion: 0.88, battery: 25, signal: 35 },
];

const secondaryStages = [
  { gas: 22.3, temperature: 33.4, motion: 0.13, battery: 82, signal: 89 },
  { gas: 22.3, temperature: 33.4, motion: 0.13, battery: 82, signal: 89 },
  { gas: 22.3, temperature: 33.4, motion: 0.13, battery: 82, signal: 89 },
  { gas: 25.0, temperature: 34.0, motion: 0.15, battery: 81, signal: 87 },
  { gas: 28.0, temperature: 35.0, motion: 0.17, battery: 80, signal: 85 },
  { gas: 31.0, temperature: 36.0, motion: 0.20, battery: 79, signal: 83 },
  { gas: 33.0, temperature: 36.5, motion: 0.22, battery: 78, signal: 82 },
  { gas: 34.0, temperature: 37.0, motion: 0.23, battery: 77, signal: 81 },
  { gas: 34.0, temperature: 37.0, motion: 0.23, battery: 77, signal: 81 },
  { gas: 34.0, temperature: 37.0, motion: 0.23, battery: 77, signal: 81 },
  { gas: 34.0, temperature: 37.0, motion: 0.23, battery: 77, signal: 81 },
];

export const STAGE_COUNT = primaryStages.length;

export function getScenarioStage(stageIndex) {
  const index = Math.min(stageIndex, STAGE_COUNT - 1);

  return {
    [PRIMARY_WORKER_ID]: primaryStages[index],
    [SECONDARY_WORKER_ID]: secondaryStages[index],
  };
}

export function isFinalStage(stageIndex) {
  return stageIndex >= STAGE_COUNT - 1;
}
