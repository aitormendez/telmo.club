import * as L from "https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js";

const stadiaKey = import.meta.env?.PUBLIC_STADIA_API_KEY;
const stamenBase =
  "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg";
const stamenUrl = stadiaKey ? `${stamenBase}?api_key=${stadiaKey}` : stamenBase;
const stamenAttribution =
  'Map tiles by <a href="https://stamen.com" target="_blank" rel="noreferrer">Stamen Design</a>, ' +
  'under <a href="https://creativecommons.org/licenses/by/3.0" target="_blank" rel="noreferrer">CC BY 3.0</a>. ' +
  'Data by <a href="https://openstreetmap.org" target="_blank" rel="noreferrer">OpenStreetMap</a>, ' +
  "under ODbL.";

// Capa satélite de fallback (ESRI World Imagery).
const osmUrl =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const osmAttribution =
  'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

function initMap(el) {
  const markersData = el.dataset.markers;
  let markers = [];

  if (markersData) {
    try {
      const parsed = JSON.parse(markersData);
      if (Array.isArray(parsed)) {
        markers = parsed.filter(
          (m) =>
            typeof m?.lat === "number" &&
            typeof m?.lng === "number" &&
            !Number.isNaN(m.lat) &&
            !Number.isNaN(m.lng)
        );
      }
    } catch (err) {
      console.error("No se pudieron parsear los marcadores", err);
    }
  }

  const lat = Number(el.dataset.lat);
  const lng = Number(el.dataset.lng);
  const hasSingle =
    !markers.length && !Number.isNaN(lat) && !Number.isNaN(lng);
  if (!hasSingle && markers.length === 0) return;
  const zoom = Number(el.dataset.zoom) || 14;

  const initialCenter = hasSingle
    ? [lat, lng]
    : [markers[0].lat, markers[0].lng];

  const map = L.map(el, { zoomControl: false }).setView(initialCenter, zoom);

  const stamenLayer = L.tileLayer(stamenUrl, {
    attribution: stamenAttribution,
    maxZoom: 16,
    subdomains: [],
    detectRetina: false,
    crossOrigin: true,
  });

  const osmLayer = L.tileLayer(osmUrl, {
    attribution: osmAttribution,
    maxZoom: 19,
  });

  let errorCount = 0;
  let usingFallback = false;

  const useStamen = () => {
    if (!map.hasLayer(stamenLayer)) {
      stamenLayer.addTo(map);
    }
    if (map.hasLayer(osmLayer) && usingFallback) {
      map.removeLayer(osmLayer);
    }
    usingFallback = false;
  };

  const useOsm = () => {
    if (map.hasLayer(stamenLayer)) {
      map.removeLayer(stamenLayer);
    }
    if (!map.hasLayer(osmLayer)) {
      osmLayer.addTo(map);
    }
    usingFallback = true;
  };

  stamenLayer.on("tileerror", () => {
    // Con clave de Stadia evitamos el fallback (suele ser transitorio).
    if (stadiaKey) return;
    errorCount += 1;
    // Solo caer a OSM si fallan varios tiles.
    if (errorCount >= 3) {
      useOsm();
    }
  });

  // Si volvemos a un zoom soportado, reintentar stamen.
  map.on("zoomend", () => {
    if (stadiaKey) return;
    const z = map.getZoom();
    if (usingFallback && z <= 16) {
      errorCount = 0;
      useStamen();
      stamenLayer.redraw();
    }
  });

  useStamen();

  // Controles de zoom y pantalla completa.
  L.control.zoom({ position: "topright" }).addTo(map);

  const setFullscreenState = (active) => {
    const center = map.getCenter();
    const currentZoom = map.getZoom();
    if (active) {
      el.classList.add("is-fullscreen");
      document.body.classList.add("leaflet-fullscreen-open");
    } else {
      el.classList.remove("is-fullscreen");
      document.body.classList.remove("leaflet-fullscreen-open");
    }
    setTimeout(() => {
      map.invalidateSize();
      map.setView(center, currentZoom, { animate: false });
      stamenLayer.redraw();
    }, 120);
  };

  const toggleFullscreen = async () => {
    const isNativeSupported = !!el.requestFullscreen;
    const isDocFs = !!document.fullscreenElement;

    if (isNativeSupported && !isDocFs) {
      try {
        await el.requestFullscreen();
        setFullscreenState(true);
        return;
      } catch {
        // fallback a clase
      }
    }

    if (isNativeSupported && isDocFs) {
      await document.exitFullscreen?.();
      setFullscreenState(false);
      return;
    }

    const nowActive = !el.classList.contains("is-fullscreen");
    setFullscreenState(nowActive);
  };

  const onFsChange = () => {
    const active = document.fullscreenElement === el;
    setFullscreenState(active);
  };

  document.addEventListener("fullscreenchange", onFsChange);

  const FullscreenControl = L.Control.extend({
    options: { position: "topright" },
    onAdd() {
      const container = L.DomUtil.create(
        "div",
        "leaflet-bar leaflet-control"
      );
      const button = L.DomUtil.create(
        "button",
        "leaflet-fullscreen-btn",
        container
      );
      button.type = "button";
      button.title = "Pantalla completa";
      button.setAttribute("aria-label", "Pantalla completa");
      button.innerHTML = "⛶";

      L.DomEvent.on(button, "click", L.DomEvent.stopPropagation)
        .on(button, "click", L.DomEvent.preventDefault)
        .on(button, "click", toggleFullscreen);

      return container;
    },
    onRemove() {
      document.removeEventListener("fullscreenchange", onFsChange);
    },
  });

  map.addControl(new FullscreenControl());

  const cross = L.divIcon({
    className: "pirate-pin",
    html: '<span class="cross"></span>',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

  if (hasSingle) {
    L.marker([lat, lng], {
      icon: cross,
      title: el.dataset.title || "",
    }).addTo(map);
  } else {
    const bounds = L.latLngBounds([]);
  markers.forEach((m) => {
    const marker = L.marker([m.lat, m.lng], {
      icon: cross,
      title: m.title || "",
    });

    // Popup con thumbnail y título si existe.
    if (m.thumbnail || m.title) {
      const href = m.slug ? `/merz/${m.slug}` : null;
      const img = m.thumbnail
        ? `<img src="${m.thumbnail}" alt="${m.title || "Merk"}" />`
        : "";
      const title = m.title ? `<div class="popup-title">${m.title}</div>` : "";
      const content = href
        ? `<a class="map-popup" href="${href}">${img}${title}</a>`
        : `<div class="map-popup">${img}${title}</div>`;
      marker.bindPopup(content, { closeButton: false, autoPan: true });

    }

    marker.addTo(map);
    bounds.extend([m.lat, m.lng]);
  });
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 14 });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".leaflet-map")
    .forEach((el) => initMap(el));
});
