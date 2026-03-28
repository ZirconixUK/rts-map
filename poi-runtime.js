const RTS_POI_SOURCE = "POI_UK_runtime.json";

const RTS_POI_CATEGORY_COLORS = {
  civic: "#5c6f7e",
  cultural: "#8c5f9f",
  historic: "#8a5a44",
  landmark: "#d3853c",
  museum: "#6b4f9b",
  park: "#4f8b4a",
  pub: "#b3523a",
  religious: "#7c6f54",
  transport: "#2f7fb5",
};

function getPoiCategoryColor(category) {
  return RTS_POI_CATEGORY_COLORS[category] ?? "#4f6653";
}

function normalizePoiBounds(bounds) {
  if (!bounds) {
    return null;
  }

  if (typeof bounds.getSouth === "function") {
    return {
      south: bounds.getSouth(),
      north: bounds.getNorth(),
      west: bounds.getWest(),
      east: bounds.getEast(),
    };
  }

  if (typeof bounds.getSouthWest === "function") {
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();
    return {
      south: southWest.lat,
      north: northEast.lat,
      west: southWest.lng,
      east: northEast.lng,
    };
  }

  return null;
}

function poiIsWithinBounds(poi, bounds) {
  if (!bounds) {
    return false;
  }

  if (poi.lat < bounds.south || poi.lat > bounds.north) {
    return false;
  }

  if (bounds.west <= bounds.east) {
    return poi.lon >= bounds.west && poi.lon <= bounds.east;
  }

  return poi.lon >= bounds.west || poi.lon <= bounds.east;
}

async function loadRuntimePois() {
  const response = await fetch(RTS_POI_SOURCE);

  if (!response.ok) {
    throw new Error(`Failed to load runtime POIs: ${response.status}`);
  }

  return response.json();
}

function filterPoisInBounds(pois, bounds) {
  const normalizedBounds = normalizePoiBounds(bounds);

  if (!normalizedBounds) {
    return [];
  }

  return pois.filter((poi) => poiIsWithinBounds(poi, normalizedBounds));
}

function poisToGeoJson(pois) {
  return {
    type: "FeatureCollection",
    features: pois.map((poi) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [poi.lon, poi.lat],
      },
      properties: {
        id: poi.id,
        name: poi.name ?? "",
        category: poi.category ?? "unknown",
        subtype: poi.subtype ?? "",
        color: getPoiCategoryColor(poi.category),
      },
    })),
  };
}

window.RtsPoiRuntime = {
  categoryColors: RTS_POI_CATEGORY_COLORS,
  filterPoisInBounds,
  getPoiCategoryColor,
  loadRuntimePois,
  poisToGeoJson,
};
