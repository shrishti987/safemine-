import {
  Wifi,
  WifiOff,
  Radio,
  Activity,
  Server,
  Router,
  Signal,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

const networkNodes = [
  {
    id: "GW-001",
    name: "Gateway Alpha",
    location: "Zone A",
    type: "Gateway",
    status: "Online",
    signal: 96,
    latency: "18 ms",
    uptime: "99.98%",
    devices: 42,
    download: "8.4 Mbps",
    upload: "2.1 Mbps",
  },
  {
    id: "GW-002",
    name: "Gateway Beta",
    location: "Zone B",
    type: "Gateway",
    status: "Online",
    signal: 91,
    latency: "24 ms",
    uptime: "99.91%",
    devices: 38,
    download: "7.8 Mbps",
    upload: "1.9 Mbps",
  },
  {
    id: "GW-003",
    name: "Gateway Gamma",
    location: "Zone C",
    type: "Gateway",
    status: "Warning",
    signal: 67,
    latency: "82 ms",
    uptime: "98.74%",
    devices: 31,
    download: "4.2 Mbps",
    upload: "1.1 Mbps",
  },
  {
    id: "GW-004",
    name: "Gateway Delta",
    location: "Zone D",
    type: "Gateway",
    status: "Offline",
    signal: 0,
    latency: "--",
    uptime: "96.12%",
    devices: 17,
    download: "--",
    upload: "--",
  },
];

function Network() {
  return (
    <div className="mx-auto max-w-[1700px] space-y-5">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
            Infrastructure
          </p>

          <h1 className="mt-1 text-2xl font-bold text-white">
            Network
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Monitor gateways, connectivity, signal strength and network health.
          </p>
        </div>

        <button className="flex w-fit items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-2.5 text-[10px] font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white">
          <RefreshCw size={13} />
          Refresh Network
        </button>
      </div>

      {/* NETWORK STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Network Health
            </p>

            <Activity
              size={18}
              className="text-emerald-400"
            />
          </div>

          <p className="mt-3 text-3xl font-bold text-emerald-400">
            96.4%
          </p>

          <p className="mt-1 text-[9px] text-slate-600">
            Overall network performance
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Connected Nodes
            </p>

            <Server
              size={18}
              className="text-cyan-400"
            />
          </div>

          <p className="mt-3 text-3xl font-bold text-white">
            3/4
          </p>

          <p className="mt-1 text-[9px] text-slate-600">
            Gateways online
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Avg Latency
            </p>

            <Radio
              size={18}
              className="text-violet-400"
            />
          </div>

          <p className="mt-3 text-3xl font-bold text-white">
            41 ms
          </p>

          <p className="mt-1 text-[9px] text-emerald-400">
            Within normal range
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Network Alerts
            </p>

            <AlertTriangle
              size={18}
              className="text-amber-400"
            />
          </div>

          <p className="mt-3 text-3xl font-bold text-amber-400">
            2
          </p>

          <p className="mt-1 text-[9px] text-slate-600">
            1 warning · 1 offline
          </p>
        </div>

      </div>

      {/* NETWORK TOPOLOGY */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">

        <div className="flex items-center justify-between">

          <div>
            <h3 className="text-sm font-semibold text-white">
              Network Topology
            </h3>

            <p className="mt-1 text-[10px] text-slate-600">
              Live connectivity between mine infrastructure and safety devices.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[9px]">
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Online
            </span>

            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Warning
            </span>

            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              Offline
            </span>
          </div>

        </div>

        <div className="mt-6 flex flex-col items-center">

          {/* CORE */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06]">

            <div className="absolute inset-0 animate-pulse rounded-2xl border border-cyan-400/10" />

            <Server
              size={27}
              className="text-cyan-400"
            />

          </div>

          <p className="mt-3 text-xs font-semibold text-white">
            SafeMine Core
          </p>

          <p className="mt-1 text-[9px] text-emerald-400">
            Core Server · Online
          </p>

          {/* CONNECTION LINE */}
          <div className="h-10 w-px bg-gradient-to-b from-cyan-400/40 to-white/[0.06]" />

          {/* GATEWAYS */}
          <div className="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-4">

            {networkNodes.map((node) => {

              const online = node.status === "Online";
              const warning = node.status === "Warning";

              return (
                <div
                  key={node.id}
                  className={`rounded-xl border p-4 ${
                    online
                      ? "border-emerald-400/10 bg-emerald-400/[0.02]"
                      : warning
                      ? "border-amber-400/10 bg-amber-400/[0.02]"
                      : "border-red-400/10 bg-red-400/[0.02]"
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        online
                          ? "bg-emerald-400/10"
                          : warning
                          ? "bg-amber-400/10"
                          : "bg-red-400/10"
                      }`}
                    >
                      <Router
                        size={16}
                        className={
                          online
                            ? "text-emerald-400"
                            : warning
                            ? "text-amber-400"
                            : "text-red-400"
                        }
                      />
                    </div>

                    <span
                      className={`flex items-center gap-1 text-[8px] font-semibold ${
                        online
                          ? "text-emerald-400"
                          : warning
                          ? "text-amber-400"
                          : "text-red-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          online
                            ? "bg-emerald-400"
                            : warning
                            ? "bg-amber-400"
                            : "bg-red-400"
                        }`}
                      />

                      {node.status}
                    </span>

                  </div>

                  <p className="mt-3 text-xs font-semibold text-white">
                    {node.name}
                  </p>

                  <p className="mt-1 text-[9px] text-slate-600">
                    {node.location}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">

                    <div>
                      <p className="text-[8px] text-slate-600">
                        Devices
                      </p>

                      <p className="mt-1 text-xs font-bold text-white">
                        {node.devices}
                      </p>
                    </div>

                    <div>
                      <p className="text-[8px] text-slate-600">
                        Latency
                      </p>

                      <p className="mt-1 text-xs font-bold text-white">
                        {node.latency}
                      </p>
                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </div>
      </div>

      {/* GATEWAY DETAILS */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">

        <div>
          <h3 className="text-sm font-semibold text-white">
            Gateway Performance
          </h3>

          <p className="mt-1 text-[10px] text-slate-600">
            Detailed connectivity and traffic information.
          </p>
        </div>

        <div className="mt-5 overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead>
              <tr className="border-b border-white/[0.05] text-left">

                {[
                  "Gateway",
                  "Signal",
                  "Latency",
                  "Uptime",
                  "Devices",
                  "Traffic",
                  "Status",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-[9px] font-semibold uppercase tracking-wider text-slate-600"
                  >
                    {heading}
                  </th>
                ))}

              </tr>
            </thead>

            <tbody>

              {networkNodes.map((node) => {

                const online = node.status === "Online";
                const warning = node.status === "Warning";

                return (
                  <tr
                    key={node.id}
                    className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.015]"
                  >

                    {/* GATEWAY */}
                    <td className="px-4 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10">
                          <Router
                            size={14}
                            className="text-cyan-400"
                          />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-white">
                            {node.name}
                          </p>

                          <p className="text-[8px] text-slate-600">
                            {node.id} · {node.location}
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* SIGNAL */}
                    <td className="px-4">

                      <div className="flex items-center gap-2">

                        {node.signal === 0 ? (
                          <WifiOff
                            size={14}
                            className="text-red-400"
                          />
                        ) : (
                          <Signal
                            size={14}
                            className={
                              node.signal < 70
                                ? "text-amber-400"
                                : "text-emerald-400"
                            }
                          />
                        )}

                        <div className="w-20">

                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">

                            <div
                              className={`h-full rounded-full ${
                                node.signal < 70
                                  ? "bg-amber-400"
                                  : "bg-emerald-400"
                              }`}
                              style={{
                                width: `${node.signal}%`,
                              }}
                            />

                          </div>

                          <p className="mt-1 text-[8px] text-slate-500">
                            {node.signal}%
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* LATENCY */}
                    <td className="px-4">
                      <span className="text-xs text-slate-400">
                        {node.latency}
                      </span>
                    </td>

                    {/* UPTIME */}
                    <td className="px-4">
                      <span className="text-xs text-slate-400">
                        {node.uptime}
                      </span>
                    </td>

                    {/* DEVICES */}
                    <td className="px-4">
                      <span className="text-xs font-semibold text-white">
                        {node.devices}
                      </span>
                    </td>

                    {/* TRAFFIC */}
                    <td className="px-4">

                      {online ? (
                        <div className="space-y-1">

                          <div className="flex items-center gap-2 text-[8px] text-slate-500">
                            <ArrowDown
                              size={10}
                              className="text-cyan-400"
                            />
                            {node.download}
                          </div>

                          <div className="flex items-center gap-2 text-[8px] text-slate-500">
                            <ArrowUp
                              size={10}
                              className="text-violet-400"
                            />
                            {node.upload}
                          </div>

                        </div>
                      ) : (
                        <span className="text-xs text-slate-700">
                          --
                        </span>
                      )}

                    </td>

                    {/* STATUS */}
                    <td className="px-4">

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[8px] font-semibold ${
                          online
                            ? "bg-emerald-400/10 text-emerald-400"
                            : warning
                            ? "bg-amber-400/10 text-amber-400"
                            : "bg-red-400/10 text-red-400"
                        }`}
                      >

                        {online ? (
                          <CheckCircle2 size={10} />
                        ) : (
                          <AlertTriangle size={10} />
                        )}

                        {node.status}

                      </span>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>
      </div>

      {/* NETWORK ALERT */}
      <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.03] p-5">

        <div className="flex gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10">
            <AlertTriangle
              size={18}
              className="text-amber-400"
            />
          </div>

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
              Network Warning
            </p>

            <h3 className="mt-1 text-sm font-semibold text-white">
              Gateway Gamma has degraded connectivity
            </h3>

            <p className="mt-1 max-w-3xl text-[10px] leading-relaxed text-slate-500">
              Signal strength has dropped to 67% and latency has
              increased above the normal operating range. Monitor
              the gateway and inspect its connection if performance
              continues to decline.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Network;