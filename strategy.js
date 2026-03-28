const limeStreetStation = {
  lat: 53.407822,
  lng: -2.977385,
  name: "Lime Street Station",
};

const recenterButton = document.querySelector("#recenter-button");
let strategyMap = null;

function setFallbackReadout() {
  return;
}

function updateLeafletReadout() {
  return;
}

function initLeafletMap() {
  if (typeof window.L === "undefined") {
    setFallbackReadout();
    return;
  }

  strategyMap = L.map("strategy-map", {
    zoomControl: false,
    attributionControl: true,
  }).setView([limeStreetStation.lat, limeStreetStation.lng], 16);

  L.control.zoom({ position: "bottomleft" }).addTo(strategyMap);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(strategyMap);

  L.circle([limeStreetStation.lat, limeStreetStation.lng], {
    radius: 180,
    color: "#1f5a88",
    weight: 2,
    fillColor: "#1f5a88",
    fillOpacity: 0.12,
  }).addTo(strategyMap);

  L.marker([limeStreetStation.lat, limeStreetStation.lng])
    .addTo(strategyMap)
    .bindPopup("<strong>Lime Street Station</strong><br />Initial strategy anchor.")
    .openPopup();

  strategyMap.on("moveend zoomend", updateLeafletReadout);
  updateLeafletReadout();
  document.body.classList.add("strategy-map-ready");
}

recenterButton.addEventListener("click", () => {
  if (!strategyMap) {
    window.location.href =
      "https://www.openstreetmap.org/?mlat=53.407822&mlon=-2.977385#map=16/53.40782/-2.97739";
    return;
  }

  strategyMap.setView([limeStreetStation.lat, limeStreetStation.lng], 16, {
    animate: true,
  });
});

setFallbackReadout();
initLeafletMap();
