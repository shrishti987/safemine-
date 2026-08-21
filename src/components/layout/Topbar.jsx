import {
  Bell,
  Search,
  ChevronDown,
  CircleHelp,
  CalendarDays,
} from "lucide-react";

function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-[76px] items-center justify-between border-b border-white/[0.06] bg-[#070b12]/90 px-6 backdrop-blur-xl">
      {/* Left */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
          Mine Operations
        </p>

        <h2 className="mt-0.5 text-lg font-semibold text-white">
          Safety Command Center
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden h-10 w-56 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 md:flex">
          <Search size={16} className="text-slate-500" />

          <input
            type="text"
            placeholder="Search workers..."
            className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-600"
          />

          <span className="rounded border border-white/[0.08] px-1.5 py-0.5 text-[9px] text-slate-600">
            /
          </span>
        </div>

        {/* Date */}
        <div className="hidden items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 lg:flex">
          <CalendarDays size={15} className="text-slate-500" />
          <span className="text-xs text-slate-400">
            Aug 20, 2026
          </span>
        </div>

        {/* Help */}
        <button className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] text-slate-500 transition hover:bg-white/[0.04] hover:text-white sm:flex">
          <CircleHelp size={17} />
        </button>

        {/* Notification */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] text-slate-400 transition hover:bg-white/[0.04] hover:text-white">
          <Bell size={17} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-2 py-1.5 transition hover:bg-white/[0.05]">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 text-[10px] font-bold text-slate-950">
            AD
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-[11px] font-semibold text-white">
              Admin
            </p>
            <p className="text-[9px] text-slate-500">
              Safety Manager
            </p>
          </div>

          <ChevronDown size={14} className="text-slate-500" />
        </button>
      </div>
    </header>
  );
}

export default Topbar;