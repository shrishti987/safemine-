const variants = {
  default: {
    text: "text-slate-300",
    bg: "bg-slate-400/10",
    border: "border-slate-400/15",
  },

  success: {
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/15",
  },

  warning: {
    text: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/15",
  },

  danger: {
    text: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/15",
  },

  info: {
    text: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/15",
  },

  orange: {
    text: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/15",
  },

  purple: {
    text: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/15",
  },
};

function Badge({
  children,
  variant = "default",
  size = "sm",
  dot = false,
  className = "",
}) {
  const style = variants[variant] || variants.default;

  const sizes = {
    xs: "px-1.5 py-0.5 text-[7px]",
    sm: "px-2 py-1 text-[8px]",
    md: "px-2.5 py-1.5 text-[9px]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-semibold uppercase tracking-wider ${style.text} ${style.bg} ${style.border} ${sizes[size] || sizes.sm} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${style.text.replace(
            "text-",
            "bg-"
          )}`}
        />
      )}

      {children}
    </span>
  );
}

export default Badge;