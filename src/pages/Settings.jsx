import {
  User,
  Bell,
  Shield,
  Database,
  Globe,
  Monitor,
  Moon,
  Save,
  Lock,
  Smartphone,
  Mail,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

function Settings() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-5">

      {/* HEADER */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
          System
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white">
          Settings
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Manage SafeMine preferences, alerts, security and system configuration.
        </p>
      </div>

      {/* PROFILE */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
            <User
              size={18}
              className="text-cyan-400"
            />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">
              Profile
            </h2>

            <p className="text-[10px] text-slate-600">
              Your SafeMine administrator information
            </p>
          </div>

        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

          <div>
            <label className="text-[9px] font-medium uppercase tracking-wider text-slate-600">
              Full Name
            </label>

            <input
              type="text"
              defaultValue="SafeMine Administrator"
              className="mt-2 h-10 w-full rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 text-xs text-white outline-none transition focus:border-cyan-400/30"
            />
          </div>

          <div>
            <label className="text-[9px] font-medium uppercase tracking-wider text-slate-600">
              Email Address
            </label>

            <input
              type="email"
              defaultValue="admin@safemine.ai"
              className="mt-2 h-10 w-full rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 text-xs text-white outline-none transition focus:border-cyan-400/30"
            />
          </div>

          <div>
            <label className="text-[9px] font-medium uppercase tracking-wider text-slate-600">
              Role
            </label>

            <input
              type="text"
              defaultValue="Safety Administrator"
              disabled
              className="mt-2 h-10 w-full cursor-not-allowed rounded-xl border border-white/[0.05] bg-white/[0.01] px-3 text-xs text-slate-500 outline-none"
            />
          </div>

          <div>
            <label className="text-[9px] font-medium uppercase tracking-wider text-slate-600">
              Mine Location
            </label>

            <input
              type="text"
              defaultValue="SafeMine Operations"
              className="mt-2 h-10 w-full rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 text-xs text-white outline-none transition focus:border-cyan-400/30"
            />
          </div>

        </div>

      </div>

      {/* PREFERENCES */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        {/* NOTIFICATIONS */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10">
              <Bell
                size={18}
                className="text-amber-400"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Notifications
              </h2>

              <p className="text-[10px] text-slate-600">
                Configure safety alert notifications
              </p>
            </div>

          </div>

          <div className="mt-5 space-y-3">

            <ToggleRow
              icon={AlertTriangle}
              title="Critical alerts"
              description="Immediately notify when a critical event occurs"
              enabled
            />

            <ToggleRow
              icon={Mail}
              title="Email notifications"
              description="Receive important alerts by email"
              enabled
            />

            <ToggleRow
              icon={Smartphone}
              title="Mobile notifications"
              description="Send push notifications to connected devices"
              enabled
            />

            <ToggleRow
              icon={Bell}
              title="Maintenance reminders"
              description="Notify technicians about scheduled maintenance"
              enabled
            />

          </div>

        </div>

        {/* APPEARANCE */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10">
              <Monitor
                size={18}
                className="text-violet-400"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Appearance
              </h2>

              <p className="text-[10px] text-slate-600">
                Customize your dashboard experience
              </p>
            </div>

          </div>

          <div className="mt-5 space-y-4">

            <div>
              <p className="text-[9px] uppercase tracking-wider text-slate-600">
                Theme
              </p>

              <div className="mt-2 grid grid-cols-2 gap-3">

                <button className="flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/[0.06] p-3 text-left">
                  <Moon
                    size={15}
                    className="text-cyan-400"
                  />

                  <div>
                    <p className="text-[10px] font-semibold text-white">
                      Dark
                    </p>

                    <p className="text-[8px] text-slate-600">
                      Recommended
                    </p>
                  </div>

                </button>

                <button className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left">
                  <Monitor
                    size={15}
                    className="text-slate-500"
                  />

                  <div>
                    <p className="text-[10px] font-semibold text-slate-400">
                      System
                    </p>

                    <p className="text-[8px] text-slate-600">
                      Follow device
                    </p>
                  </div>

                </button>

              </div>
            </div>

            <div>
              <label className="text-[9px] uppercase tracking-wider text-slate-600">
                Dashboard Refresh Rate
              </label>

              <select
                defaultValue="10"
                className="mt-2 h-10 w-full rounded-xl border border-white/[0.07] bg-[#111925] px-3 text-xs text-white outline-none"
              >
                <option value="5">Every 5 seconds</option>
                <option value="10">Every 10 seconds</option>
                <option value="30">Every 30 seconds</option>
                <option value="60">Every 60 seconds</option>
              </select>
            </div>

          </div>

        </div>

      </div>

      {/* SECURITY + SYSTEM */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        {/* SECURITY */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
              <Shield
                size={18}
                className="text-emerald-400"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Security
              </h2>

              <p className="text-[10px] text-slate-600">
                Account and access security
              </p>
            </div>

          </div>

          <div className="mt-5 space-y-3">

            <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.015] p-4">

              <div className="flex items-center gap-3">

                <Lock
                  size={15}
                  className="text-slate-400"
                />

                <div>
                  <p className="text-xs font-medium text-white">
                    Two-factor authentication
                  </p>

                  <p className="mt-0.5 text-[9px] text-slate-600">
                    Add an additional layer of account security
                  </p>
                </div>

              </div>

              <span className="flex items-center gap-1.5 text-[9px] font-semibold text-emerald-400">
                <CheckCircle2 size={12} />
                Enabled
              </span>

            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.015] p-4">

              <div>
                <p className="text-xs font-medium text-white">
                  Session timeout
                </p>

                <p className="mt-0.5 text-[9px] text-slate-600">
                  Automatically sign out after inactivity
                </p>
              </div>

              <select
                defaultValue="30"
                className="rounded-lg border border-white/[0.06] bg-[#111925] px-3 py-2 text-[9px] text-slate-300 outline-none"
              >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="60">60 min</option>
                <option value="120">2 hours</option>
              </select>

            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.06] py-2.5 text-[10px] font-medium text-slate-400 transition hover:bg-white/[0.03] hover:text-white">
              <Lock size={13} />
              Change Password
            </button>

          </div>

        </div>

        {/* SYSTEM */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
              <Database
                size={18}
                className="text-cyan-400"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                System
              </h2>

              <p className="text-[10px] text-slate-600">
                SafeMine platform configuration
              </p>
            </div>

          </div>

          <div className="mt-5 space-y-3">

            <SettingItem
              icon={Globe}
              title="Language"
              value="English"
            />

            <SettingItem
              icon={Database}
              title="Data retention"
              value="90 days"
            />

            <SettingItem
              icon={Monitor}
              title="Dashboard version"
              value="v1.0.0"
            />

            <SettingItem
              icon={ServerIcon}
              title="API status"
              value="Operational"
              success
            />

          </div>

        </div>

      </div>

      {/* SAVE */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-white/[0.06] bg-[#0c121c] p-4 sm:flex-row sm:items-center">

        <div>
          <p className="text-xs font-semibold text-white">
            Save your changes
          </p>

          <p className="mt-1 text-[9px] text-slate-600">
            Your preferences will be applied across the dashboard.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-semibold text-[#061018] transition hover:bg-cyan-400">
          <Save size={14} />
          Save Changes
        </button>

      </div>

    </div>
  );
}

/* TOGGLE COMPONENT */

function ToggleRow({
  icon: Icon,
  title,
  description,
  enabled,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">

      <div className="flex items-center gap-3">

        <Icon
          size={15}
          className="text-slate-500"
        />

        <div>
          <p className="text-xs font-medium text-white">
            {title}
          </p>

          <p className="mt-0.5 text-[9px] text-slate-600">
            {description}
          </p>
        </div>

      </div>

      <div
        className={`relative h-5 w-9 rounded-full transition ${
          enabled
            ? "bg-cyan-500"
            : "bg-slate-700"
        }`}
      >
        <div
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled
              ? "left-[18px]"
              : "left-0.5"
          }`}
        />
      </div>

    </div>
  );
}

/* SETTING ITEM */

function SettingItem({
  icon: Icon,
  title,
  value,
  success,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">

      <div className="flex items-center gap-3">

        <Icon
          size={15}
          className="text-slate-500"
        />

        <span className="text-xs text-slate-300">
          {title}
        </span>

      </div>

      <span
        className={`text-[9px] font-semibold ${
          success
            ? "text-emerald-400"
            : "text-slate-500"
        }`}
      >
        {value}
      </span>

    </div>
  );
}

/* SIMPLE SERVER ICON ALIAS */

function ServerIcon(props) {
  return <Database {...props} />;
}

export default Settings;