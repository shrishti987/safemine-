import {
  LayoutDashboard,
  Map,
  Users,
  Bell,
  Radio,
  Route,
  BarChart3,
  HardHat,
  Wifi,
  Wrench,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    id: "dashboard",
  },
  {
    label: "Live Mine",
    icon: Map,
    id: "live-mine",
  },
  {
    label: "Workers",
    icon: Users,
    id: "workers",
  },
  {
    label: "Alerts",
    icon: Bell,
    id: "alerts",
    badge: 3,
  },
  {
    label: "Sensors",
    icon: Radio,
    id: "sensors",
  },
  {
    label: "Evacuation",
    icon: Route,
    id: "evacuation",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    id: "analytics",
  },
];

const systemItems = [
  {
    label: "Smart Helmets",
    icon: HardHat,
    id: "helmets",
  },
  {
    label: "LoRa Network",
    icon: Wifi,
    id: "network",
  },
  {
    label: "Maintenance",
    icon: Wrench,
    id: "maintenance",
  },
  {
    label: "Settings",
    icon: Settings,
    id: "settings",
  },
];

function Sidebar({ activePage, setActivePage, collapsed, setCollapsed }) {
  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-white/[0.06] bg-[#0a0f18] transition-all duration-300 ${
        collapsed ? "w-[78px]" : "w-[250px]"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex h-[76px] items-center border-b border-white/[0.06] ${
          collapsed ? "justify-center" : "px-5"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck size={23} />
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-[17px] font-bold tracking-tight text-white">
                Safe<span className="text-emerald-400">Mine</span>
              </h1>
              <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">
                Safety Command
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        {!collapsed && (
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
            Monitoring
          </p>
        )}

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                title={collapsed ? item.label : ""}
                className={`group flex w-full items-center rounded-xl px-3 py-2.5 text-left transition-all ${
                  collapsed ? "justify-center" : "gap-3"
                } ${
                  active
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.2 : 1.8}
                  className="shrink-0"
                />

                {!collapsed && (
                  <>
                    <span className="flex-1 text-[13px] font-medium">
                      {item.label}
                    </span>

                    {item.badge && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500/15 px-1.5 text-[10px] font-bold text-red-400">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {!collapsed && (
          <p className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
            System
          </p>
        )}

        <nav className="space-y-1">
          {systemItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                title={collapsed ? item.label : ""}
                className={`group flex w-full items-center rounded-xl px-3 py-2.5 text-left transition-all ${
                  collapsed ? "justify-center" : "gap-3"
                } ${
                  active
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon size={18} className="shrink-0" />

                {!collapsed && (
                  <span className="text-[13px] font-medium">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom system status */}
      <div className="border-t border-white/[0.06] p-3">
        <div
          className={`rounded-xl bg-emerald-500/[0.06] ${
            collapsed ? "p-2" : "p-3"
          }`}
        >
          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-2"
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>

            {!collapsed && (
              <span className="text-[11px] font-medium text-emerald-400">
                All systems operational
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-2 flex w-full items-center justify-center rounded-lg py-2 text-slate-600 transition hover:bg-white/[0.04] hover:text-slate-300"
        >
          {collapsed ? (
            <ChevronRight size={17} />
          ) : (
            <ChevronLeft size={17} />
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;