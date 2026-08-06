/**
 * Inicialización y Gestión del Mapa Interactivo (Leaflet) - Módulo Transporte
 */

let mapMarkers = [];

function initMap() {
  const mapEl = document.getElementById('mapEl');
  if (!mapEl || typeof L === 'undefined') return;

  leafletMap = L.map('mapEl').setView([-34.62, -58.65], 10);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19
  }).addTo(leafletMap);

  mapInitialized = true;
  refreshMapMarkers();
  setTimeout(() => leafletMap.invalidateSize(), 80);
}

function refreshMapMarkers() {
  if (!leafletMap || typeof L === 'undefined') return;
  mapMarkers.forEach(m => leafletMap.removeLayer(m));
  mapMarkers = [];

  guests.filter(g => g.zoneLat != null && g.zoneLon != null).forEach(g => {
    const color = isNotComing(g) ? "#8f8397" : (isResolved(g) ? "#4fbf82" : "#ff5fa2");
    const marker = L.circleMarker([g.zoneLat, g.zoneLon], {
      radius: 8, color: color, fillColor: color, fillOpacity: 0.85, weight: 1.5
    });
    marker.bindPopup(`<b>${escHtml(g.names)}</b><br>${escHtml(g.zone)}`);
    marker.addTo(leafletMap);
    mapMarkers.push(marker);
  });

  if (destination && destination.lat != null && destination.lon != null) {
    const m = L.marker([destination.lat, destination.lon]).bindPopup(`🎉 <b>Destino del Evento</b><br>${escHtml(destination.name)}`);
    m.addTo(leafletMap);
    mapMarkers.push(m);
  }
}
