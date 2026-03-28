const limeStreetStation = {
  lat: 53.407822,
  lng: -2.977385,
};

const STRATEGY_DEFAULT_ZOOM = 16;
const STRATEGY_MIN_ZOOM = 5;
const STRATEGY_MAX_ZOOM = 18;
const POI_RENDER_LIMIT = 3000;

const strategyMapElement = document.querySelector("#strategy-map");
const fallbackMap = document.querySelector("#strategy-map-fallback");
const recenterButton = document.querySelector("#recenter-button");

function buildStrategyPoiLayer(pois, renderer) {
  return window.L.geoJSON(window.RtsPoiRuntime.poisToGeoJson(pois), {
    pointToLayer: (feature, latlng) =>
      window.L.circleMarker(latlng, {
        radius: 4,
        stroke: false,
        fillOpacity: 0.9,
        fillColor: feature.properties.color,
        renderer,
      }),
  });
}

function bootStrategyMap() {
  if (!strategyMapElement || !window.L || !window.RtsPoiRuntime) {
    return;
  }

  const map = window.L.map(strategyMapElement, {
    zoomControl: true,
    minZoom: STRATEGY_MIN_ZOOM,
    maxZoom: STRATEGY_MAX_ZOOM,
    preferCanvas: true,
  }).setView([limeStreetStation.lat, limeStreetStation.lng], STRATEGY_DEFAULT_ZOOM);

  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const playerMarker = window.L.circleMarker([limeStreetStation.lat, limeStreetStation.lng], {
    radius: 8,
    weight: 3,
    color: "#f9fbff",
    fillColor: "#1f5a88",
    fillOpacity: 1,
  }).addTo(map);
  const poiRenderer = window.L.canvas();

  let poiLayer = window.L.layerGroup().addTo(map);
  let runtimePois = [];

  function refreshVisiblePois() {
    const visiblePois = window.RtsPoiRuntime
      .filterPoisInBounds(runtimePois, map.getBounds())
      .slice(0, POI_RENDER_LIMIT);

    poiLayer.clearLayers();
    buildStrategyPoiLayer(visiblePois, poiRenderer).addTo(poiLayer);
  }

  recenterButton?.addEventListener("click", () => {
    map.setView([limeStreetStation.lat, limeStreetStation.lng], STRATEGY_DEFAULT_ZOOM);
    playerMarker.setLatLng([limeStreetStation.lat, limeStreetStation.lng]);
  });

  map.whenReady(async () => {
    strategyMapElement.parentElement?.classList.add("strategy-map-ready");
    fallbackMap?.setAttribute("aria-hidden", "true");

    try {
      runtimePois = await window.RtsPoiRuntime.loadRuntimePois();
      refreshVisiblePois();
    } catch (error) {
      console.error(error);
    }
  });

  map.on("moveend", refreshVisiblePois);
  map.on("zoomend", refreshVisiblePois);
}

window.addEventListener("load", bootStrategyMap);
