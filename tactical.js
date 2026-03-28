const limeStreetStation = {
  lat: 53.407822,
  lng: -2.977385,
};

const tacticalMapElement = document.querySelector("#tactical-map");
const tacticalOverlay = document.querySelector("#tactical-map-overlay");
const tacticalStatus = document.querySelector("#tactical-map-status");

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

function bindDragRotation(map, surface) {
  const rotationState = {
    pointerId: null,
    clientX: 0,
    bearing: 0,
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
    rotationState.bearing = map.getBearing();
    surface.classList.add("is-rotating");
    surface.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  surface.addEventListener("pointermove", (event) => {
    if (rotationState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - rotationState.clientX;
    map.jumpTo({
      center: [limeStreetStation.lng, limeStreetStation.lat],
      bearing: rotationState.bearing + deltaX * 0.35,
    });
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
    zoom: 17.6,
    minZoom: 17.6,
    maxZoom: 17.6,
    bearing: 18,
    pitch: 48,
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

  bindDragRotation(map, tacticalMapElement);
}

window.addEventListener("load", bootTacticalMap);
