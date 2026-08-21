import { ShieldAlert, Activity } from "lucide-react";

function RiskScore({ score = 3.2 }) {
  const percentage = score * 10;

  let level = "LOW";
  let levelColor = "text-emerald-400";
  let ringColor = "border-emerald-400";

  if (score >= 7) {
    level = "CRITICAL";
    levelColor = "text-red-400";
    ringColor = "border-red-400";
  } else if (score >= 4) {
    level = "MODERATE";
    levelColor = "text-amber-400";
    ringColor = "border-amber-400";
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
            AI Risk Assessment
          </p>

          <h3 className="mt-1 text-sm font-semibold text-white">
            Overall Mine Risk
          </h3>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/10">
          <ShieldAlert size={17} className="text-emerald-400" />
        </div>
      </div>

      <div className="mt-7 flex items-center justify-center">
        <div
          className={`relative flex h-36 w-36 items-center justify-center rounded-full border-[10px] ${ringColor}`}
        >
          <div className="text-center">
            <p className="text-4xl font-bold text-white">
              {score}
            </p>

            <p className={`mt-0.5 text-[10px] font-bold tracking-[0.15em] ${levelColor}`}>
              {level}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-[10px]">
          <span className="text-slate-500">Risk level</span>
          <span className={levelColor}>{percentage}%</span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-white/[0.05] pt-4">
        <Activity size={13} className="text-emerald-400" />

        <span className="text-[10px] text-slate-500">
          AI analyzing 124 active worker streams
        </span>
      </div>
    </div>
  );
}

export default RiskScore;