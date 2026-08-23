import { useMemo } from "react";
import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Gauge,
  AlertTriangle,
  Clock,
  MapPin,
  Radar,
} from "lucide-react";

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import useRiskForecast from "../hooks/useRiskForecast";
import Badge from "../components/common/Badge";

/*
|--------------------------------------------------------------------------
| BAND -> BADGE VARIANT
|--------------------------------------------------------------------------
*/

function bandVariant(band) {
  switch (band) {
    case "CRITICAL":
      return "danger";

    case "HIGH":
      return "orange";

    case "MODERATE":
      return "warning";

    case "SAFE":
      return "success";

    default:
      return "default";
  }
}

/*
|--------------------------------------------------------------------------
| TREND ICON
|--------------------------------------------------------------------------
*/

function TrendIndicator({ direction, size = 14 }) {
  if (direction === "rising") {
    return (
      <TrendingUp
        size={size}
        className="text-red-400"
      />
    );
  }

  if (direction === "falling") {
    return (
      <TrendingDown
        size={size}
        className="text-emerald-400"
      />
    );
  }

  return (
    <Minus
      size={size}
      className="text-slate-500"
    />
  );
}

const trendLabel = {
  rising: "Rising",
  falling: "Falling",
  stable: "Stable",
};

const trendTextClass = {
  rising: "text-red-400",
  falling: "text-emerald-400",
  stable: "text-slate-500",
};

function formatEta(minutes) {
  if (minutes === null || minutes === undefined) {
    return "--";
  }

  const rounded = Math.round(minutes);

  return `${rounded <= 0 ? "<1" : rounded}m`;
}

function Forecast() {
  const {
    horizons,
    mineForecast,
    zoneForecasts,
    workerForecasts,
    earlyWarnings,
    insight,
  } = useRiskForecast();

  /*
  |--------------------------------------------------------------------------
  | CHART DATA — concat historical + forecast on one time axis
  |--------------------------------------------------------------------------
  */

  const chartData = useMemo(() => {
    const historicalPoints = (mineForecast?.history || []).map((point) => ({
      time: point.time,
      risk: point.score,
      value: undefined,
      range: undefined,
    }));

    const forecastPoints = (mineForecast?.forecast || []).map((point) => ({
      time: point.time,
      risk: undefined,
      value: point.value,
      range:
        typeof point.lower === "number" && typeof point.upper === "number"
          ? [point.lower, point.upper]
          : undefined,
    }));

    return [...historicalPoints, ...forecastPoints];
  }, [mineForecast]);

  const currentMineScore =
    mineForecast?.history?.length > 0
      ? mineForecast.history[mineForecast.history.length - 1].score
      : 0;

  const farthestForecast =
    mineForecast?.forecast?.length > 0
      ? mineForecast.forecast[mineForecast.forecast.length - 1]
      : null;

  const hasWarnings = earlyWarnings.length > 0;

  return (
    <div className="mx-auto max-w-[1700px] space-y-5">

      {/* HEADER */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Predictive Intelligence
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white">
          AI Risk Forecast
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Trend-based early-warning forecasting across the mine, zones, and workers — projected {horizons.join("/")} minutes ahead.
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Current Mine Risk
            </p>

            <Activity
              size={18}
              className="text-cyan-400"
            />
          </div>

          <p className="mt-3 text-3xl font-bold text-white">
            {currentMineScore.toFixed(1)}
          </p>

          <p className="mt-2 text-[9px] text-slate-600">
            live 0–10 risk score
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Predicted Risk (+{horizons[horizons.length - 1]}m)
            </p>

            <Gauge
              size={18}
              className="text-violet-400"
            />
          </div>

          <p className="mt-3 text-3xl font-bold text-white">
            {farthestForecast ? farthestForecast.value.toFixed(1) : "--"}
          </p>

          <div className="mt-2">
            <Badge variant={bandVariant(mineForecast?.predictedBandIn30)} dot>
              {mineForecast?.predictedBandIn30 || "--"}
            </Badge>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Active Early Warnings
            </p>

            <AlertTriangle
              size={18}
              className={hasWarnings ? "text-red-400" : "text-slate-500"}
            />
          </div>

          <p className="mt-3 text-3xl font-bold text-white">
            {earlyWarnings.length}
          </p>

          <p className={`mt-2 text-[9px] ${hasWarnings ? "text-red-400" : "text-emerald-400"}`}>
            {hasWarnings ? "requires attention" : "no breaches predicted"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Mine-Wide Trend
            </p>

            <TrendIndicator direction={mineForecast?.trendDirection} size={18} />
          </div>

          <p className={`mt-3 text-2xl font-bold ${trendTextClass[mineForecast?.trendDirection] || "text-white"}`}>
            {trendLabel[mineForecast?.trendDirection] || "Stable"}
          </p>

          <p className="mt-2 text-[9px] text-slate-600">
            over the next {horizons[horizons.length - 1]} minutes
          </p>
        </div>

      </div>

      {/* AI INSIGHT */}
      <div className={`rounded-2xl border p-5 ${hasWarnings ? "border-red-400/15 bg-red-400/[0.03]" : "border-cyan-400/10 bg-cyan-400/[0.03]"}`}>
        <div className="flex gap-4">

          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${hasWarnings ? "bg-red-400/10" : "bg-cyan-400/10"}`}>
            <BrainCircuit
              size={20}
              className={hasWarnings ? "text-red-400" : "text-cyan-400"}
            />
          </div>

          <div>
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${hasWarnings ? "text-red-400" : "text-cyan-400"}`}>
              AI Insight
            </p>

            <h3 className="mt-1 text-sm font-semibold text-white">
              {insight}
            </h3>

            <p className="mt-1 max-w-3xl text-[10px] leading-relaxed text-slate-500">
              SafeMine AI fits a trend line over each worker's and the mine's recent gas, temperature, and risk readings, then projects it forward across {horizons.join(", ")} minute checkpoints to flag threshold breaches before they happen.
            </p>
          </div>

        </div>
      </div>

      {/* RISK TREND & FORECAST CHART */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">

        <div>
          <h3 className="text-sm font-semibold text-white">
            Risk Trend & Forecast
          </h3>

          <p className="mt-1 text-[10px] text-slate-600">
            Historical mine-wide risk score with projected trend and confidence band
          </p>
        </div>

        <div className="mt-5 h-[300px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <ComposedChart data={chartData}>

              <defs>
                <linearGradient
                  id="forecastHistoryGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#34d399"
                    stopOpacity={0.25}
                  />

                  <stop
                    offset="100%"
                    stopColor="#34d399"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

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
                domain={[0, 10]}
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
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  fontSize: "10px",
                }}
              />

              <Area
                type="monotone"
                dataKey="range"
                stroke="none"
                fill="#a78bfa"
                fillOpacity={0.12}
                connectNulls
                isAnimationActive={false}
              />

              <Area
                type="monotone"
                dataKey="risk"
                stroke="#34d399"
                strokeWidth={2}
                fill="url(#forecastHistoryGradient)"
                connectNulls={false}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#a78bfa"
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={{ r: 2.5, fill: "#a78bfa", strokeWidth: 0 }}
                connectNulls
                isAnimationActive={false}
              />

            </ComposedChart>
          </ResponsiveContainer>

        </div>
      </div>

      {/* ZONE FORECAST CARDS */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-white">
          Zone Forecasts
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

          {zoneForecasts.map((zone) => (
            <div
              key={zone.zoneId}
              className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5"
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-1.5">
                  <MapPin
                    size={12}
                    className="text-slate-600"
                  />

                  <span className="text-xs font-semibold text-white">
                    {zone.name}
                  </span>
                </div>

                <Badge variant={bandVariant(zone.currentBand)} dot>
                  {zone.currentBand}
                </Badge>

              </div>

              <div className="mt-4 flex items-center gap-1.5">
                <TrendIndicator direction={zone.trendDirection} size={12} />

                <span className={`text-[9px] ${trendTextClass[zone.trendDirection] || "text-slate-500"}`}>
                  {trendLabel[zone.trendDirection] || "Stable"} trend
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {zone.predicted.map((point) => (
                  <div
                    key={point.minutesAhead}
                    className="rounded-lg border border-white/[0.05] bg-white/[0.015] px-2 py-2 text-center"
                  >
                    <p className="text-[8px] text-slate-600">
                      +{point.minutesAhead}m
                    </p>

                    <p className="mt-1 text-sm font-bold text-white">
                      {Math.round(point.score)}
                    </p>
                  </div>
                ))}
              </div>

              {zone.earliestBreach && (
                <div className="mt-3">
                  <Badge
                    variant={zone.earliestBreach.band === "CRITICAL" ? "danger" : "orange"}
                    dot
                  >
                    {zone.earliestBreach.band} in ~{formatEta(zone.earliestBreach.etaMinutes)}
                  </Badge>
                </div>
              )}

            </div>
          ))}

        </div>
      </div>

      {/* EARLY WARNINGS */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c121c]">

        <div className="border-b border-white/[0.05] p-4">
          <h3 className="text-sm font-semibold text-white">
            Early Warnings
          </h3>

          <p className="mt-1 text-[9px] text-slate-600">
            Predicted threshold breaches within the next {horizons[horizons.length - 1]} minutes
          </p>
        </div>

        {earlyWarnings.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-12 text-center">

            <Radar
              size={22}
              className="text-slate-700"
            />

            <p className="mt-3 text-xs font-medium text-slate-500">
              No early warnings active
            </p>

            <p className="mt-1 text-[9px] text-slate-700">
              No worker or zone is trending toward a higher risk band right now.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead>
                <tr className="border-b border-white/[0.05]">

                  <th className="px-4 py-3 text-left">
                    <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                      Level
                    </span>
                  </th>

                  <th className="px-4 py-3 text-left">
                    <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                      Name
                    </span>
                  </th>

                  <th className="px-4 py-3 text-left">
                    <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                      Predicted Band
                    </span>
                  </th>

                  <th className="px-4 py-3 text-left">
                    <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                      ETA
                    </span>
                  </th>

                  <th className="px-4 py-3 text-left">
                    <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                      Reason
                    </span>
                  </th>

                </tr>
              </thead>

              <tbody>
                {earlyWarnings.map((warning) => (
                  <tr
                    key={`${warning.level}-${warning.id}`}
                    className="border-b border-white/[0.04] last:border-b-0"
                  >

                    <td className="px-4 py-3">
                      <Badge variant={warning.level === "worker" ? "purple" : "info"} size="xs">
                        {warning.level}
                      </Badge>
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-[10px] font-semibold text-white">
                        {warning.name}
                      </p>

                      {warning.zone && (
                        <p className="mt-0.5 text-[8px] text-slate-600">
                          {warning.zone}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant={bandVariant(warning.predictedBand)} dot>
                        {warning.predictedBand}
                      </Badge>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Clock
                          size={11}
                          className="text-slate-600"
                        />

                        <span className="text-[9px] font-medium text-slate-300">
                          {formatEta(warning.etaMinutes)}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <p className="max-w-md text-[9px] leading-relaxed text-slate-500">
                        {warning.reason}
                      </p>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* WORKER FORECAST TABLE */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c121c]">

        <div className="border-b border-white/[0.05] p-4">
          <h3 className="text-sm font-semibold text-white">
            Worker Forecasts
          </h3>

          <p className="mt-1 text-[9px] text-slate-600">
            Workers ranked by how soon their sensor trend crosses a safety threshold
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[650px]">

            <thead>
              <tr className="border-b border-white/[0.05]">

                <th className="px-4 py-3 text-left">
                  <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                    Worker
                  </span>
                </th>

                <th className="px-4 py-3 text-left">
                  <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                    Zone
                  </span>
                </th>

                <th className="px-4 py-3 text-left">
                  <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                    Current Band
                  </span>
                </th>

                <th className="px-4 py-3 text-left">
                  <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                    Predicted (+{horizons[0]}m)
                  </span>
                </th>

                <th className="px-4 py-3 text-left">
                  <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                    ETA to Breach
                  </span>
                </th>

              </tr>
            </thead>

            <tbody>
              {workerForecasts.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-10 text-center text-[9px] text-slate-700"
                  >
                    No workers to forecast.
                  </td>
                </tr>
              ) : (
                workerForecasts.slice(0, 8).map((worker) => (
                  <tr
                    key={worker.workerId}
                    className="border-b border-white/[0.04] last:border-b-0"
                  >

                    <td className="px-4 py-3">
                      <p className="text-[10px] font-semibold text-white">
                        {worker.name}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <MapPin
                          size={11}
                          className="text-slate-600"
                        />

                        <span className="text-[9px] text-slate-400">
                          {worker.zone || "--"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant={bandVariant(worker.currentBand)} dot>
                        {worker.currentBand}
                      </Badge>
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant={bandVariant(worker.predicted?.[0]?.band)} dot>
                        {worker.predicted?.[0]?.band || "--"}
                      </Badge>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Clock
                          size={11}
                          className={worker.etaMinutes !== null ? "text-amber-400" : "text-slate-700"}
                        />

                        <span className={`text-[9px] font-medium ${worker.etaMinutes !== null ? "text-amber-400" : "text-slate-600"}`}>
                          {formatEta(worker.etaMinutes)}
                        </span>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

export default Forecast;
