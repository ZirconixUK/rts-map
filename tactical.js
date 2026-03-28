const limeStreetStation = {
  lat: 53.407822,
  lng: -2.977385,
};

const tacticalMapElement = document.querySelector("#tactical-map");
const tacticalOverlay = document.querySelector("#tactical-map-overlay");
const tacticalStatus = document.querySelector("#tactical-map-status");
const rotateLeftButton = document.querySelector("#rotate-left");
const rotateRightButton = document.querySelector("#rotate-right");
const pitchOutButton = document.querySelector("#pitch-out");
const pitchInButton = document.querySelector("#pitch-in");
const tacticalCamera = {
  bearing: 18,
  pitch: 48,
};

const TACTICAL_ZOOM = 17.6;
const MIN_PITCH = 0;
const MAX_PITCH = 72;
const ROTATION_STEP = 18;
const PITCH_STEP = 10;

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

function setMapStatus(message, isVisible = true) {
  if (tacticalStatus) {
    tacticalStatus.textContent = message;
  }

  if (tacticalOverlay) {
    tacticalOverlay.hidden = !isVisible;
  }
}

function getCameraOffset() {
  return [0, Math.round(window.innerHeight * 0.22)];
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

function clampPitch(value) {
  return Math.max(MIN_PITCH, Math.min(MAX_PITCH, value));
}

function getDistance(firstPointer, secondPointer) {
  const deltaX = secondPointer.clientX - firstPointer.clientX;
  const deltaY = secondPointer.clientY - firstPointer.clientY;
  return Math.hypot(deltaX, deltaY);
}

function bindSurfaceGestures(map, surface) {
  const activePointers = new Map();
  const gestureState = {
    rotationPointerId: null,
    startX: 0,
    startBearing: 0,
    pinchStartDistance: 0,
    pinchStartPitch: 0,
  };

  const endRotation = () => {
    gestureState.rotationPointerId = null;
    surface.classList.remove("is-rotating");
  };

  surface.addEventListener("pointerdown", (event) => {
    activePointers.set(event.pointerId, {
      clientX: event.clientX,
      clientY: event.clientY,
    });

    surface.setPointerCapture(event.pointerId);

    if (activePointers.size === 1) {
      gestureState.rotationPointerId = event.pointerId;
      gestureState.startX = event.clientX;
      gestureState.startBearing = map.getBearing();
      surface.classList.add("is-rotating");
    } else if (activePointers.size === 2) {
      const [firstPointer, secondPointer] = [...activePointers.values()];
      gestureState.pinchStartDistance = getDistance(firstPointer, secondPointer);
      gestureState.pinchStartPitch = map.getPitch();
      endRotation();
    }

    event.preventDefault();
  });

  surface.addEventListener("pointermove", (event) => {
    if (!activePointers.has(event.pointerId)) {
      return;
    }

    activePointers.set(event.pointerId, {
      clientX: event.clientX,
      clientY: event.clientY,
    });

    if (activePointers.size >= 2) {
      const [firstPointer, secondPointer] = [...activePointers.values()];
      const distance = getDistance(firstPointer, secondPointer);
      const pinchDelta = distance - gestureState.pinchStartDistance;

      tacticalCamera.pitch = clampPitch(gestureState.pinchStartPitch + pinchDelta * 0.18);
      applyCamera(map);
      event.preventDefault();
      return;
    }

    if (gestureState.rotationPointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - gestureState.startX;
    tacticalCamera.bearing = gestureState.startBearing + deltaX * 0.35;
    applyCamera(map);
    event.preventDefault();
  });

  const releasePointer = (event) => {
    if (!activePointers.has(event.pointerId)) {
      return;
    }

    activePointers.delete(event.pointerId);

    if (surface.hasPointerCapture(event.pointerId)) {
      surface.releasePointerCapture(event.pointerId);
    }

    if (gestureState.rotationPointerId === event.pointerId || activePointers.size === 0) {
      endRotation();
    }

    if (activePointers.size === 1) {
      const [[pointerId, pointer]] = [...activePointers.entries()];
      gestureState.rotationPointerId = pointerId;
      gestureState.startX = pointer.clientX;
      gestureState.startBearing = map.getBearing();
      surface.classList.add("is-rotating");
    }
  };

  surface.addEventListener("pointerup", releasePointer);
  surface.addEventListener("pointercancel", releasePointer);
  surface.addEventListener("lostpointercapture", releasePointer);
}

function bindControlButtons(map) {
  rotateLeftButton?.addEventListener("click", () => {
    tacticalCamera.bearing -= ROTATION_STEP;
    applyCamera(map);
  });

  rotateRightButton?.addEventListener("click", () => {
    tacticalCamera.bearing += ROTATION_STEP;
    applyCamera(map);
  });

  pitchOutButton?.addEventListener("click", () => {
    tacticalCamera.pitch = clampPitch(tacticalCamera.pitch - PITCH_STEP);
    applyCamera(map);
  });

  pitchInButton?.addEventListener("click", () => {
    tacticalCamera.pitch = clampPitch(tacticalCamera.pitch + PITCH_STEP);
    applyCamera(map);
  });
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
  bindSurfaceGestures(map, tacticalMapElement);
  bindControlButtons(map);
}

window.addEventListener("load", bootTacticalMap);
