import {
  Award,
  ChevronRight,
  ShieldCheck,
  User,
} from "lucide-react";

const rankStyles = {
  1: {
    icon: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/15",
  },

  2: {
    icon: "text-slate-300",
    bg: "bg-slate-300/10",
    border: "border-slate-300/15",
  },

  3: {
    icon: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/15",
  },
};

function Leader({
  rank,
  name,
  role = "Mining Operator",
  zone,
  score,
  status = "Safe",
  avatar,
  onClick,
  showArrow = false,
}) {
  const rankStyle =
    rankStyles[rank] || {
      icon: "text-slate-500",
      bg: "bg-white/[0.03]",
      border: "border-white/[0.06]",
    };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] p-3 transition ${
        onClick
          ? "cursor-pointer hover:bg-white/[0.035]"
          : ""
      }`}
    >
      {/* RANK */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${rankStyle.bg} ${rankStyle.border}`}
      >
        {rank <= 3 ? (
          <Award
            size={14}
            className={rankStyle.icon}
          />
        ) : (
          <span className="text-[9px] font-bold text-slate-500">
            #{rank}
          </span>
        )}
      </div>

      {/* AVATAR */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/[0.06] bg-[#111925]">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <User
            size={15}
            className="text-slate-500"
          />
        )}
      </div>

      {/* DETAILS */}
      <div className="min-w-0 flex-1">

        <div className="flex items-center gap-2">

          <p className="truncate text-[10px] font-semibold text-white">
            {name}
          </p>

          <span
            className={`hidden items-center gap-1 text-[7px] font-semibold sm:flex ${
              status === "Safe"
                ? "text-emerald-400"
                : status === "Warning"
                ? "text-amber-400"
                : "text-red-400"
            }`}
          >
            <ShieldCheck size={9} />
            {status}
          </span>

        </div>

        <div className="mt-1 flex items-center gap-2 text-[8px] text-slate-600">

          <span>{role}</span>

          {zone && (
            <>
              <span>•</span>
              <span>{zone}</span>
            </>
          )}

        </div>

      </div>

      {/* SCORE */}
      {score !== undefined && (
        <div className="text-right">

          <p className="text-xs font-bold text-cyan-400">
            {score}
          </p>

          <p className="text-[7px] uppercase tracking-wider text-slate-600">
            Safety Score
          </p>

        </div>
      )}

      {showArrow && (
        <ChevronRight
          size={13}
          className="shrink-0 text-slate-600"
        />
      )}
    </div>
  );
}

export default Leader;