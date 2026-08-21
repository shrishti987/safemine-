import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Siren,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const icons = {
  workers: Users,
  safe: ShieldCheck,
  warning: AlertTriangle,
  critical: Siren,
};

function StatCard({
  type,
  title,
  value,
  subtitle,
  trend,
  trendValue,
}) {
  const Icon = icons[type] || ShieldCheck;

  const isPositive = trend === "up";

  const styles = {
    workers: {
      icon: "text-cyan-400",
      bg: "bg-cyan-400/10",
    },
    safe: {
      icon: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    warning: {
      icon: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    critical: {
      icon: "text-red-400",
      bg: "bg-red-400/10",
    },
  };

  const style = styles[type] || styles.safe;

  return (
    <div className="group rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5 transition-all duration-300 hover:border-white/[0.1] hover:bg-[#0e1520]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold tracking-tight text-white">
            {value}
          </h3>

          <p className="mt-1 text-[11px] text-slate-500">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.bg}`}
        >
          <Icon size={19} className={style.icon} />
        </div>
      </div>

      {trendValue && (
        <div className="mt-4 flex items-center gap-1.5">
          {isPositive ? (
            <TrendingUp size={13} className="text-emerald-400" />
          ) : (
            <TrendingDown size={13} className="text-red-400" />
          )}

          <span
            className={`text-[11px] font-semibold ${
              isPositive ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {trendValue}
          </span>

          <span className="text-[10px] text-slate-600">
            vs last hour
          </span>
        </div>
      )}
    </div>
  );
}

export default StatCard;