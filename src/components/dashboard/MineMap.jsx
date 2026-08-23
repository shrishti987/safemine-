import {
  Layers,
  Maximize2,
  Navigation,
  MapPin,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polygon,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { useMineContext } from "../../context/MineDataContext";


// --------------------------------------------------
// MAP CENTER
// --------------------------------------------------

const MAP_CENTER = [30.3165, 78.0322];


// --------------------------------------------------
// COMPACT WORKER POSITION
// --------------------------------------------------
// Your workers.js already contains x/y positions.
// We convert them into a SMALL area around the
// mine center so workers stay close together.
// --------------------------------------------------

function positionToCoordinates(position) {
  const x = parseFloat(position?.x || "50") / 100;
  const y = parseFloat(position?.y || "50") / 100;

  // Small geographic spread
  const latitude =
    MAP_CENTER[0] + (0.006 - y * 0.012);

  const longitude =
    MAP_CENTER[1] + (x * 0.016 - 0.008);

  return [latitude, longitude];
}


// --------------------------------------------------
// MAP CONTROLS
// --------------------------------------------------

function MapControls() {
  const map = useMap();

  const handleLocate = () => {
    map.setView(MAP_CENTER, 16, {
      animate: true,
    });
  };

  const handleFullscreen = () => {
    const container = map.getContainer();

    if (container.requestFullscreen) {
      container.requestFullscreen();
    }
  };

  return (
    <div className="absolute right-3 top-3 z-[1000] flex flex-col gap-2">

      <button
        type="button"
        onClick={handleLocate}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#0c121c]/90 text-slate-400 shadow-lg backdrop-blur hover:bg-[#111a27] hover:text-white"
        title="Center map"
      >
        <Navigation size={14} />
      </button>

      <button
        type="button"
        onClick={handleFullscreen}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#0c121c]/90 text-slate-400 shadow-lg backdrop-blur hover:bg-[#111a27] hover:text-white"
        title="Fullscreen"
      >
        <Maximize2 size={14} />
      </button>

    </div>
  );
}


// --------------------------------------------------
// ZONE AREAS
// --------------------------------------------------

const ZONE_A = [
  [30.322, 78.024],
  [30.322, 78.030],
  [30.316, 78.030],
  [30.316, 78.024],
];

const ZONE_B = [
  [30.322, 78.030],
  [30.322, 78.038],
  [30.316, 78.038],
  [30.316, 78.030],
];

const ZONE_C = [
  [30.316, 78.024],
  [30.316, 78.033],
  [30.310, 78.033],
  [30.310, 78.024],
];


// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

function MineMap() {
  const { workers } = useMineContext();

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>

          <div className="flex items-center gap-2">

            <h3 className="text-sm font-semibold text-white">
              Live Mine Map
            </h3>

            <span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] font-medium text-emerald-400">

              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

              LIVE

            </span>

          </div>

          <p className="mt-1 text-[10px] text-slate-600">
            Real-time worker locations and safety status
          </p>

        </div>


        {/* HEADER BUTTONS */}

        <div className="flex gap-1.5">

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-slate-500 hover:bg-white/[0.04] hover:text-white"
            title="Map layers"
          >
            <Layers size={14} />
          </button>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-slate-500 hover:bg-white/[0.04] hover:text-white"
            title="Navigation"
          >
            <Navigation size={14} />
          </button>

        </div>

      </div>


      {/* MAP */}

      <div className="relative mt-5 h-[350px] overflow-hidden rounded-xl border border-white/[0.05]">

        <MapContainer
          center={MAP_CENTER}
          zoom={16}
          minZoom={14}
          maxZoom={19}
          scrollWheelZoom={true}
          zoomControl={true}
          className="h-full w-full"
        >

          {/* OPEN STREET MAP */}

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


          {/* ---------------------------------------- */}
          {/* ZONE A */}
          {/* ---------------------------------------- */}

          <Polygon
            positions={ZONE_A}
            pathOptions={{
              color: "#10b981",
              fillColor: "#10b981",
              fillOpacity: 0.08,
              weight: 1,
            }}
          />


          {/* ---------------------------------------- */}
          {/* ZONE B */}
          {/* ---------------------------------------- */}

          <Polygon
            positions={ZONE_B}
            pathOptions={{
              color: "#f59e0b",
              fillColor: "#f59e0b",
              fillOpacity: 0.08,
              weight: 1,
            }}
          />


          {/* ---------------------------------------- */}
          {/* ZONE C */}
          {/* ---------------------------------------- */}

          <Polygon
            positions={ZONE_C}
            pathOptions={{
              color: "#38bdf8",
              fillColor: "#38bdf8",
              fillOpacity: 0.08,
              weight: 1,
            }}
          />


          {/* ---------------------------------------- */}
          {/* WORKERS */}
          {/* ---------------------------------------- */}

          {workers.map((worker) => {

            const position = positionToCoordinates(
              worker.position
            );

            const status = String(
              worker.status || "Safe"
            ).toLowerCase();

            const isCritical =
              status === "critical" ||
              worker.band === "CRITICAL";

            const isWarning =
              status === "warning" ||
              worker.band === "MODERATE" ||
              worker.band === "HIGH";

            const markerColor = isCritical
              ? "#f87171"
              : isWarning
              ? "#fbbf24"
              : "#34d399";


            return (
              <CircleMarker
                key={worker.id}
                center={position}
                radius={8}
                pathOptions={{
                  color: markerColor,
                  fillColor: markerColor,
                  fillOpacity: 0.9,
                  weight: 3,
                }}
              >

                {/* WORKER POPUP */}

                <Popup>

                  <div className="min-w-[180px]">

                    <div className="mb-2 flex items-center gap-2">

                      <MapPin
                        size={16}
                        color={markerColor}
                      />

                      <strong>
                        {worker.name}
                      </strong>

                    </div>


                    <div className="space-y-1 text-sm">

                      <div>
                        <b>ID:</b> {worker.id}
                      </div>

                      <div>
                        <b>Zone:</b> {worker.zone}
                      </div>

                      <div>
                        <b>Status:</b>{" "}
                        <span
                          style={{
                            color: markerColor,
                            fontWeight: 600,
                          }}
                        >
                          {worker.status || "Safe"}
                        </span>
                      </div>

                      <div>
                        <b>Risk:</b>{" "}
                        {Number(
                          worker.riskScore || 0
                        ).toFixed(1)}
                      </div>

                      <div>
                        <b>Gas:</b>{" "}
                        {Number(
                          worker.gas || 0
                        ).toFixed(1)}
                        {" "}ppm
                      </div>

                      <div>
                        <b>Temperature:</b>{" "}
                        {Number(
                          worker.temperature || 0
                        ).toFixed(1)}
                        °C
                      </div>

                      <div>
                        <b>Motion:</b>{" "}
                        {Number(
                          worker.motion || 0
                        ).toFixed(2)}
                        g
                      </div>

                      <div>
                        <b>Battery:</b>{" "}
                        {Math.round(
                          worker.battery || 0
                        )}
                        %
                      </div>

                      <div>
                        <b>Signal:</b>{" "}
                        {Math.round(
                          worker.signal || 0
                        )}
                        %
                      </div>

                    </div>

                  </div>

                </Popup>

              </CircleMarker>
            );
          })}


          {/* MAP CONTROLS */}

          <MapControls />

        </MapContainer>


        {/* ---------------------------------------- */}
        {/* LIVE TRACKING */}
        {/* ---------------------------------------- */}

        <div className="pointer-events-none absolute left-3 top-3 z-[1000]">

          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0c121c]/90 px-3 py-2 backdrop-blur">

            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

            <span className="text-[9px] font-medium text-slate-300">
              LIVE TRACKING
            </span>

          </div>

        </div>


        {/* ---------------------------------------- */}
        {/* ZONE LABELS */}
        {/* ---------------------------------------- */}

        <div className="pointer-events-none absolute left-[22%] top-[22%] z-[900]">

          <span className="rounded-md bg-[#0c121c]/70 px-2 py-1 text-[8px] font-semibold uppercase tracking-widest text-emerald-400/70">
            Zone A
          </span>

        </div>


        <div className="pointer-events-none absolute right-[18%] top-[25%] z-[900]">

          <span className="rounded-md bg-[#0c121c]/70 px-2 py-1 text-[8px] font-semibold uppercase tracking-widest text-amber-400/70">
            Zone B
          </span>

        </div>


        <div className="pointer-events-none absolute bottom-[24%] left-[28%] z-[900]">

          <span className="rounded-md bg-[#0c121c]/70 px-2 py-1 text-[8px] font-semibold uppercase tracking-widest text-cyan-400/70">
            Zone C
          </span>

        </div>


        {/* ---------------------------------------- */}
        {/* MAIN SHAFT */}
        {/* ---------------------------------------- */}

        <div className="absolute bottom-4 left-4 z-[1000] flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#0c121c]/90 px-3 py-2 backdrop-blur">

          <Navigation
            size={12}
            className="text-emerald-400"
          />

          <span className="text-[9px] text-slate-400">
            Main Shaft
          </span>

        </div>


        {/* ---------------------------------------- */}
        {/* LEGEND */}
        {/* ---------------------------------------- */}

        <div className="absolute bottom-4 right-4 z-[1000] flex gap-3 rounded-lg border border-white/[0.06] bg-[#0c121c]/90 px-3 py-2 backdrop-blur">

          <span className="flex items-center gap-1 text-[8px] text-slate-500">

            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

            Safe

          </span>


          <span className="flex items-center gap-1 text-[8px] text-slate-500">

            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />

            Warning

          </span>


          <span className="flex items-center gap-1 text-[8px] text-slate-500">

            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />

            Critical

          </span>

        </div>

      </div>


      {/* FOOTER */}

      <div className="mt-3 flex items-center justify-between">

        <span className="text-[9px] text-slate-600">
          {workers.length} workers tracked
        </span>

        <span className="flex items-center gap-1 text-[9px] text-emerald-400">

          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

          Tracking active

        </span>

      </div>

    </div>
  );
}

export default MineMap;