const limeStreetStation = {
  lat: 53.407822,
  lng: -2.977385,
};

const tacticalMapElement = document.querySelector("#tactical-map");
const tacticalOverlay = document.querySelector("#tactical-map-overlay");
const tacticalStatus = document.querySelector("#tactical-map-status");
const tacticalCamera = {
  bearing: 18,
  pitch: 48,
};

const TACTICAL_ZOOM = 17.6;
const MIN_PITCH = 0;
const MAX_PITCH = 72;

const tacticalStyle = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
    },
  ],
};

function buildPlayerMarker() {
  const marker = document.createElement("div");
  marker.className = "tactical-player-marker";
  marker.setAttribute("aria-label", "Player position placeholder");
  return marker;
}

function setMapStatus(message, isVisible = true) {
  if (tacticalStatus) {
    tacticalStatus.textContent = message;
  }

  if (tacticalOverlay) {
    tacticalOverlay.hidden = !isVisible;
  }
}

function getCameraOffset() {
  return [0, Math.round(window.innerHeight * 0.28)];
}

function applyCamera(map) {
  map.easeTo({
    center: [limeStreetStation.lng, limeStreetStation.lat],
    zoom: TACTICAL_ZOOM,
    bearing: tacticalCamera.bearing,
    pitch: tacticalCamera.pitch,
    offset: getCameraOffset(),
    duration: 0,
  });
}

function bindDragRotation(map, surface) {
  const rotationState = {
    pointerId: null,
    clientX: 0,
    clientY: 0,
    bearing: 0,
    pitch: 0,
  };

  const endRotation = () => {
    rotationState.pointerId = null;
    surface.classList.remove("is-rotating");
  };

  surface.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary) {
      return;
    }

    rotationState.pointerId = event.pointerId;
    rotationState.clientX = event.clientX;
    rotationState.clientY = event.clientY;
    rotationState.bearing = map.getBearing();
    rotationState.pitch = map.getPitch();
    surface.classList.add("is-rotating");
    surface.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  surface.addEventListener("pointermove", (event) => {
    if (rotationState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - rotationState.clientX;
    const deltaY = event.clientY - rotationState.clientY;

    tacticalCamera.bearing = rotationState.bearing + deltaX * 0.35;
    tacticalCamera.pitch = Math.max(
      MIN_PITCH,
      Math.min(MAX_PITCH, rotationState.pitch - deltaY * 0.18),
    );

    applyCamera(map);
    event.preventDefault();
  });

  surface.addEventListener("pointerup", (event) => {
    if (rotationState.pointerId !== event.pointerId) {
      return;
    }

    surface.releasePointerCapture(event.pointerId);
    endRotation();
  });

  surface.addEventListener("pointercancel", endRotation);
  surface.addEventListener("lostpointercapture", endRotation);
}

function bootTacticalMap() {
  if (!tacticalMapElement || !window.maplibregl) {
    return;
  }

  setMapStatus("Loading tactical map...", true);

  const map = new window.maplibregl.Map({
    container: tacticalMapElement,
    style: tacticalStyle,
    center: [limeStreetStation.lng, limeStreetStation.lat],
    zoom: TACTICAL_ZOOM,
    minZoom: TACTICAL_ZOOM,
    maxZoom: TACTICAL_ZOOM,
    bearing: tacticalCamera.bearing,
    pitch: tacticalCamera.pitch,
    attributionControl: false,
    dragPan: false,
    dragRotate: true,
    scrollZoom: false,
    boxZoom: false,
    doubleClickZoom: false,
    touchPitch: false,
    keyboard: false,
    pitchWithRotate: false,
    cooperativeGestures: false,
  });

  map.dragRotate.disable();
  map.touchZoomRotate.disable();

  map.addControl(
    new window.maplibregl.AttributionControl({
      compact: true,
    }),
    "bottom-right",
  );

  map.on("error", () => {
    setMapStatus("Map failed to load. Check the CDN and tile network requests.", true);
  });

  map.on("load", () => {
    tacticalMapElement.classList.add("tactical-map-ready");
    setMapStatus("Loading tactical map...", false);
    applyCamera(map);

    new window.maplibregl.Marker({
      element: buildPlayerMarker(),
      anchor: "center",
    })
      .setLngLat([limeStreetStation.lng, limeStreetStation.lat])
      .addTo(map);

    map.addSource("station-radius", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [limeStreetStation.lng, limeStreetStation.lat],
        },
      },
    });

    map.addLayer({
      id: "station-radius-fill",
      type: "circle",
      source: "station-radius",
      paint: {
        "circle-radius": 80,
        "circle-color": "rgba(31, 90, 136, 0.16)",
        "circle-stroke-color": "rgba(31, 90, 136, 0.58)",
        "circle-stroke-width": 2,
      },
    });
    map.resize();
  });

  window.addEventListener("resize", () => applyCamera(map));
  bindDragRotation(map, tacticalMapElement);
}

window.addEventListener("load", bootTacticalMap);
