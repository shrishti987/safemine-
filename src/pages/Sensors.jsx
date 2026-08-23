import { useMemo, useState } from "react";
import {
  Wind,
  Thermometer,
  Gauge,
  Move3d,
  CircleAlert,
  Radio,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useMineContext } from "../context/MineDataContext";
import SensorCard from "../components/sensors/SensorCard";
import Badge from "../components/common/Badge";

const bandVariant = {
  SAFE: "success",
  MODERATE: "warning",
  HIGH: "orange",
  CRITICAL: "danger",
};

// =========================================================
// TREND TAG
// =========================================================

function TrendTag({ trend }) {
  if (!trend) {
    return (
      <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
        <Minus size={12} /> Stable
      </span>
    );
  }

  if (trend.direction === "increasing") {
    return (
      <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400">
        <TrendingUp size={12} />
        +{trend.changePercent.toFixed(0)}%
      </span>
    );
  }

  if (trend.direction === "decreasing") {
    return (
      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
        <TrendingDown size={12} />
        {trend.changePercent.toFixed(0)}%
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
      <Minus size={12} /> Stable
    </span>
  );
}

// =========================================================
// SENSORS
// =========================================================

function Sensors() {
  const {
    workers,
    history,
    firebase,
  } = useMineContext();

  const [selectedId, setSelectedId] = useState(null);

  const selectedWorker =
    workers.find(
      (worker) => worker.id === selectedId
    ) || workers[0];

  // =======================================================
  // FIREBASE LIVE DATA
  // SAME SOURCE AS DASHBOARD
  // =======================================================

  const firebaseData =
    firebase?.data || {};

  // -------------------------------------------------------
  // LIVE GAS
  // -------------------------------------------------------

  const liveGas = Number(
    firebaseData.gas
  );

  // -------------------------------------------------------
  // LIVE TEMPERATURE
  // -------------------------------------------------------

  const liveTemperature = Number(
    firebaseData.temperature
  );

  // -------------------------------------------------------
  // LIVE PRESSURE
  // -------------------------------------------------------

  const livePressure = Number(
    firebaseData.pressure
  );

  // -------------------------------------------------------
  // LIVE MOTION
  // -------------------------------------------------------

  const liveMotion =
    typeof firebaseData.motion === "boolean"
      ? firebaseData.motion
        ? 1
        : 0
      : Number(firebaseData.motion);

  // -------------------------------------------------------
  // LIVE IMPACT
  // -------------------------------------------------------

  const liveImpact =
    firebaseData.impact === true ||
    firebaseData.impact === 1 ||
    firebaseData.impact === "true";

  // =======================================================
  // SELECTED WORKER HISTORY
  // =======================================================

  const workerHistory =
    history[selectedWorker?.id] || [];

  const chartData = useMemo(
    () =>
      workerHistory.map((reading) => ({
        time: new Date(
          reading.timestamp
        ).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        gas: reading.gas,
      })),
    [workerHistory]
  );

  // =======================================================
  // SENSOR OVERVIEW
  // EXACTLY SAME VALUES AS DASHBOARD
  // =======================================================

  const overviewSensors = useMemo(() => {
    return [
      // ---------------------------------------------------
      // GAS
      // ---------------------------------------------------

      {
        name: "Gas Sensor",
        value: Number.isFinite(liveGas)
          ? liveGas.toFixed(1)
          : "--",
        unit: "ppm",
        status: Number.isFinite(liveGas)
          ? liveGas > 50
            ? "Elevated"
            : "Normal"
          : "No data",
        icon: Wind,
      },

      // ---------------------------------------------------
      // TEMPERATURE
      // ---------------------------------------------------

      {
        name: "Temperature",
        value: Number.isFinite(
          liveTemperature
        )
          ? liveTemperature.toFixed(1)
          : "--",
        unit: "°C",
        status: Number.isFinite(
          liveTemperature
        )
          ? liveTemperature > 38
            ? "Elevated"
            : "Normal"
          : "No data",
        icon: Thermometer,
      },

      // ---------------------------------------------------
      // PRESSURE
      // ---------------------------------------------------

      {
        name: "Pressure",
        value: Number.isFinite(
          livePressure
        )
          ? livePressure.toFixed(1)
          : "--",
        unit: "hPa",
        status: Number.isFinite(
          livePressure
        )
          ? "Live"
          : "No data",
        icon: Gauge,
      },

      // ---------------------------------------------------
      // MOTION
      // ---------------------------------------------------

      {
        name: "Motion",
        value: Number.isFinite(liveMotion)
          ? liveMotion.toFixed(2)
          : "--",
        unit: "g",
        status: Number.isFinite(liveMotion)
          ? liveMotion > 0.5
            ? "Abnormal"
            : "Normal"
          : "No data",
        icon: Move3d,
      },

      // ---------------------------------------------------
      // IMPACT
      // ---------------------------------------------------

      {
        name: "Impact",
        value: liveImpact ? "1" : "0",
        unit: "event",
        status: liveImpact
          ? "Impact detected"
          : "No impact",
        icon: CircleAlert,
      },
    ];
  }, [
    liveGas,
    liveTemperature,
    livePressure,
    liveMotion,
    liveImpact,
  ]);

  // =======================================================
  // SENSOR HISTORY CARDS
  // USE LIVE FIREBASE VALUES FOR CURRENT HELMET
  // =======================================================

  const sensorShape = useMemo(() => {
    const worker = selectedWorker || {};

    return {
      id: worker.helmetId,
      helmetId: worker.helmetId,
      zone: worker.zone,

      gas: {
        value: Number.isFinite(liveGas)
          ? liveGas
          : Number(worker.gas || 0),
        unit: "ppm",
        status:
          Number.isFinite(liveGas)
            ? liveGas > 50
              ? "Critical"
              : liveGas > 35
                ? "Warning"
                : "Normal"
            : "Normal",
        threshold: 50,
      },

      temperature: {
        value: Number.isFinite(
          liveTemperature
        )
          ? liveTemperature
          : Number(worker.temperature || 0),
        unit: "°C",
        status:
          Number.isFinite(liveTemperature)
            ? liveTemperature > 40
              ? "Warning"
              : "Normal"
            : "Normal",
        threshold: 40,
      },

      motion: {
        value: Number.isFinite(liveMotion)
          ? liveMotion
          : Number(worker.motion || 0),
        unit: "g",
        status:
          Number.isFinite(liveMotion)
            ? liveMotion > 0.5
              ? "Warning"
              : "Normal"
            : "Normal",
        threshold: 0.5,
      },

      battery: {
        value: Math.round(
          Number(worker.battery || 0)
        ),
        unit: "%",
        status:
          Number(worker.battery || 0) < 30
            ? "Critical"
            : "Good",
        threshold: 30,
      },

      signal: {
        value: Math.round(
          Number(worker.signal || 0)
        ),
        unit: "%",
        status:
          Number(worker.signal || 0) < 70
            ? "Weak"
            : "Excellent",
        threshold: 70,
      },
    };
  }, [
    selectedWorker,
    liveGas,
    liveTemperature,
    liveMotion,
  ]);

  // =======================================================
  // NO WORKER
  // =======================================================

  if (!selectedWorker) {
    return null;
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Telemetry
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white">
          Sensors
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Real-time sensor telemetry from smart helmets across the mine.
        </p>

        {/* FIREBASE STATUS */}

        <div className="mt-3 flex items-center gap-2">

          <span
            className={`h-2 w-2 rounded-full ${
              firebase?.connected
                ? "bg-emerald-400 animate-pulse"
                : "bg-red-400"
            }`}
          />

          <span
            className={`text-[10px] font-semibold ${
              firebase?.connected
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {firebase?.connected
              ? "Firebase Live"
              : "Firebase Disconnected"}
          </span>

        </div>
      </div>

      {/* ===================================================
          LIVE SENSOR OVERVIEW
      =================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

        {overviewSensors.map(
          ({
            name,
            value,
            unit,
            status,
            icon: Icon,
          }) => (
            <div
              key={name}
              className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                  <Icon
                    size={18}
                    className="text-cyan-400"
                  />
                </div>

                <span
                  className={`h-2 w-2 rounded-full ${
                    status === "Elevated" ||
                    status === "Abnormal" ||
                    status === "Impact detected"
                      ? "bg-amber-400"
                      : status === "No data"
                        ? "bg-slate-500"
                        : "bg-emerald-400"
                  }`}
                />

              </div>

              <p className="mt-5 text-xs text-slate-500">
                {name}
              </p>

              <div className="mt-1 flex items-baseline gap-1">

                <span className="text-3xl font-bold text-white">
                  {value}
                </span>

                <span className="text-xs text-slate-600">
                  {unit}
                </span>

              </div>

              <p
                className={`mt-3 text-[10px] font-medium ${
                  status === "Elevated" ||
                  status === "Abnormal" ||
                  status === "Impact detected"
                    ? "text-amber-400"
                    : status === "No data"
                      ? "text-slate-500"
                      : "text-emerald-400"
                }`}
              >
                ● {status}
              </p>

            </div>
          )
        )}

      </div>

      {/* ===================================================
          HELMET SENSOR HISTORY
      =================================================== */}

      <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h3 className="text-sm font-semibold text-white">
              Helmet Sensor History
            </h3>

            <p className="mt-1 text-[10px] text-slate-600">
              Select a worker to inspect their smart helmet's live and historical readings.
            </p>

          </div>

          <select
            value={selectedWorker.id}
            onChange={(event) =>
              setSelectedId(event.target.value)
            }
            className="h-10 rounded-xl border border-white/[0.07] bg-[#111925] px-3 text-xs text-white outline-none"
          >

            {workers.map((worker) => (
              <option
                key={worker.id}
                value={worker.id}
              >
                {worker.name} ·{" "}
                {worker.helmetId} ·{" "}
                {worker.zone}
              </option>
            ))}

          </select>

        </div>

        {/* SENSOR CARDS */}

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

          <SensorCard
            sensor={sensorShape}
            type="gas"
            compact
          />

          <SensorCard
            sensor={sensorShape}
            type="temperature"
            compact
          />

          <SensorCard
            sensor={sensorShape}
            type="motion"
            compact
          />

          <SensorCard
            sensor={sensorShape}
            type="battery"
            compact
          />

          <SensorCard
            sensor={sensorShape}
            type="signal"
            compact
          />

        </div>

        {/* =================================================
            CHART + RISK
        ================================================= */}

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">

          {/* GAS TREND */}

          <div className="rounded-xl border border-white/[0.05] bg-[#080d15] p-4">

            <p className="mb-3 text-[10px] uppercase tracking-wider text-slate-500">
              Gas Trend (ppm)
            </p>

            <div className="h-[220px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart data={chartData}>

                  <CartesianGrid
                    stroke="rgba(255,255,255,0.04)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#475569",
                      fontSize: 9,
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#475569",
                      fontSize: 9,
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#111925",
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "10px",
                      fontSize: "10px",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="gas"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: "#22d3ee",
                      stroke: "#0c121c",
                      strokeWidth: 2,
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* RISK LEVEL */}

          <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-4">

            <div className="flex items-center justify-between">

              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Risk Level
              </p>

              <Badge
                variant={
                  bandVariant[
                    selectedWorker.band
                  ]
                }
                dot
              >
                {selectedWorker.band}
              </Badge>

            </div>

            <p className="mt-2 text-2xl font-bold text-white">

              {selectedWorker.safetyScore}

              <span className="text-xs font-normal text-slate-600">
                /100
              </span>

            </p>

            <div className="mt-4 space-y-2 border-t border-white/[0.05] pt-3">

              <div className="flex items-center justify-between">

                <span className="text-[10px] text-slate-500">
                  Gas
                </span>

                <TrendTag
                  trend={
                    selectedWorker.trend?.gas
                  }
                />

              </div>

              <div className="flex items-center justify-between">

                <span className="text-[10px] text-slate-500">
                  Temperature
                </span>

                <TrendTag
                  trend={
                    selectedWorker.trend?.temperature
                  }
                />

              </div>

            </div>

            <div className="mt-4 border-t border-white/[0.05] pt-3">

              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                Why?
              </p>

              {selectedWorker.explanation?.length >
              0 ? (
                <div className="mt-2 space-y-1.5">

                  {selectedWorker.explanation.map(
                    (line, index) => (
                      <p
                        key={index}
                        className="text-[10px] leading-relaxed text-slate-400"
                      >
                        • {line}
                      </p>
                    )
                  )}

                </div>
              ) : (
                <p className="mt-2 text-[10px] leading-relaxed text-emerald-400">
                  All readings are within the normal safety range.
                </p>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* ===================================================
          SENSOR NETWORK
      =================================================== */}

      <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">

            <Radio
              size={18}
              className="text-emerald-400"
            />

          </div>

          <div>

            <h3 className="text-sm font-semibold text-white">
              Sensor Network
            </h3>

            <p className="text-[10px] text-slate-600">
              {workers.length * 5} sensors connected across{" "}
              {workers.length} helmets
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Sensors;