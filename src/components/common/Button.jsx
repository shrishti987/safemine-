import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-cyan-500 text-[#061018] hover:bg-cyan-400",

  secondary:
    "border border-white/[0.08] bg-white/[0.02] text-slate-300 hover:bg-white/[0.05] hover:text-white",

  danger:
    "bg-red-500 text-white hover:bg-red-400",

  warning:
    "bg-amber-500 text-[#171006] hover:bg-amber-400",

  ghost:
    "text-slate-400 hover:bg-white/[0.04] hover:text-white",

  outline:
    "border border-cyan-400/20 bg-cyan-400/[0.03] text-cyan-400 hover:bg-cyan-400/[0.08]",

  success:
    "bg-emerald-500 text-[#06150d] hover:bg-emerald-400",
};

const sizes = {
  xs: "h-7 px-2.5 text-[8px] gap-1.5",
  sm: "h-8 px-3 text-[9px] gap-1.5",
  md: "h-10 px-4 text-[10px] gap-2",
  lg: "h-11 px-5 text-xs gap-2",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  type = "button",
  onClick,
  className = "",
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
        variants[variant] || variants.primary
      } ${sizes[size] || sizes.md} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {loading ? (
        <Loader2
          size={14}
          className="animate-spin"
        />
      ) : (
        Icon && <Icon size={14} />
      )}

      {children}
    </button>
  );
}

export default Button;