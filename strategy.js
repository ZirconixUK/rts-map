const limeStreetStation = {
  lat: 53.407822,
  lng: -2.977385,
};

const recenterButton = document.querySelector("#recenter-button");
const fallbackMap = document.querySelector("#strategy-map-fallback");

const fallbackSrc =
  "https://www.openstreetmap.org/export/embed.html?bbox=-2.987%2C53.4025%2C-2.967%2C53.4135&layer=mapnik&marker=53.407822%2C-2.977385";

recenterButton.addEventListener("click", () => {
  fallbackMap.src = fallbackSrc;
});
