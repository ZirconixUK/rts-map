const limeStreetStation = {
  lat: 53.407822,
  lng: -2.977385,
  name: "Lime Street Station",
};

const mapCenterReadout = document.querySelector("#map-center-readout");
const mapZoomReadout = document.querySelector("#map-zoom-readout");
const recenterButton = document.querySelector("#recenter-button");

const strategyMap = L.map("strategy-map", {
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

function updateReadout() {
  const center = strategyMap.getCenter();
  mapCenterReadout.textContent = `${center.lat.toFixed(5)}, ${center.lng.toFixed(5)}`;
  mapZoomReadout.textContent = `${strategyMap.getZoom()}`;
}

recenterButton.addEventListener("click", () => {
  strategyMap.setView([limeStreetStation.lat, limeStreetStation.lng], 16, {
    animate: true,
  });
});

strategyMap.on("moveend zoomend", updateReadout);
updateReadout();
