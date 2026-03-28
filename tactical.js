const limeStreetStation = {
  lat: 53.407822,
  lng: -2.977385,
};

const tacticalMapElement = document.querySelector("#tactical-map");
const rotateLeftButton = document.querySelector("#rotate-left");
const rotateRightButton = document.querySelector("#rotate-right");
const resetBearingButton = document.querySelector("#reset-bearing");

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

function stepBearing(map, delta) {
  map.rotateTo(map.getBearing() + delta, {
    duration: 220,
  });
}

function bootTacticalMap() {
  if (!tacticalMapElement || !window.maplibregl) {
    return;
  }

  const map = new window.maplibregl.Map({
    container: tacticalMapElement,
    style: tacticalStyle,
    center: [limeStreetStation.lng, limeStreetStation.lat],
    zoom: 16.7,
    minZoom: 16.7,
    maxZoom: 16.7,
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
    cooperativeGestures: false,
  });

  map.touchZoomRotate.disable();
  map.touchZoomRotate.enableRotation();

  map.addControl(
    new window.maplibregl.AttributionControl({
      compact: true,
    }),
    "bottom-right",
  );

  map.addControl(
    new window.maplibregl.NavigationControl({
      showZoom: false,
      visualizePitch: false,
    }),
    "top-right",
  );

  map.on("load", () => {
    tacticalMapElement.classList.add("tactical-map-ready");

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
  });

  rotateLeftButton?.addEventListener("click", () => stepBearing(map, -20));
  rotateRightButton?.addEventListener("click", () => stepBearing(map, 20));
  resetBearingButton?.addEventListener("click", () => {
    map.rotateTo(0, { duration: 250 });
  });
}

window.addEventListener("load", bootTacticalMap);
