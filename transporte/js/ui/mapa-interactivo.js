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

  const coordGroups = {};
  const validGuests = guests.filter(g => g.zoneLat != null && g.zoneLon != null);

  validGuests.forEach(g => {
    const key = `${g.zoneLat.toFixed(5)},${g.zoneLon.toFixed(5)}`;
    if (!coordGroups[key]) coordGroups[key] = [];
    coordGroups[key].push(g);
  });

  Object.values(coordGroups).forEach(group => {
    const totalInGroup = group.length;
    group.forEach((g, idx) => {
      let lat = g.zoneLat;
      let lon = g.zoneLon;

      if (totalInGroup > 1) {
        const shiftFactor = idx - (totalInGroup - 1) / 2;
        lon += shiftFactor * 0.00009;
      }

      const hasCar = ["car-space", "car-no-space"].includes(g.transport);
      let marker;

      if (hasCar) {
        const carIcon = L.divIcon({
          html: `<span title="${escHtml(g.names)}">🚗</span>`,
          className: 'custom-car-marker-icon',
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          popupAnchor: [0, -18]
        });
        marker = L.marker([lat, lon], { icon: carIcon });
      } else {
        const color = isNotComing(g) ? "#8f8397" : (isResolved(g) ? "#4fbf82" : "#ff5fa2");
        marker = L.circleMarker([lat, lon], {
          radius: 8, color: color, fillColor: color, fillOpacity: 0.85, weight: 1.5
        });
      }

      marker.guestId = g.id;
      const popupHtml = `
        <div class="map-popup-card">
          <b class="map-popup-title">${escHtml(g.names)}</b>
          <div class="map-popup-zone">${escHtml(g.zone)}</div>
          <button type="button" class="map-popup-btn" data-action="goToGuestCard" data-id="${g.id}">
            📋 Ver tarjeta de invitado
          </button>
        </div>
      `;
      marker.bindPopup(popupHtml);
      marker.addTo(leafletMap);
      mapMarkers.push(marker);
    });
  });

  if (destination && destination.lat != null && destination.lon != null) {
    const m = L.marker([destination.lat, destination.lon]).bindPopup(`🎉 <b>Destino del Evento</b><br>${escHtml(destination.name)}`);
    m.addTo(leafletMap);
    mapMarkers.push(m);
  }
}

function scrollToGuestCard(guestId) {
  cerrarMapaModal();
  setTimeout(() => {
    if (typeof currentFilter !== "undefined" && currentFilter !== "all") {
      const g = guests.find(x => x.id === guestId);
      if (g && typeof matchesFilters === "function" && !matchesFilters(g)) {
        currentFilter = "all";
        if (typeof render === "function") render();
      }
    }
    const card = document.getElementById(`card_${guestId}`);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.classList.add("card-highlight");
      setTimeout(() => card.classList.remove("card-highlight"), 2000);
    }
  }, 150);
}

/**
 * Control del Modal Flotante del Mapa
 */
function abrirMapaModal(targetGuestId) {
  const overlay = document.getElementById('mapModalOverlay');
  if (!overlay) return;

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('map-modal-open');

  if (!mapInitialized) {
    initMap();
  } else {
    refreshMapMarkers();
  }

  setTimeout(() => {
    if (leafletMap) {
      leafletMap.invalidateSize();
      if (targetGuestId) {
        const g = guests.find(x => x.id === targetGuestId);
        if (g && g.zoneLat != null && g.zoneLon != null) {
          leafletMap.setView([g.zoneLat, g.zoneLon], 14);
          const marker = mapMarkers.find(m => m.guestId === targetGuestId);
          if (marker && typeof marker.openPopup === "function") marker.openPopup();
        }
      }
    }
  }, 180);
}

function cerrarMapaModal() {
  const overlay = document.getElementById('mapModalOverlay');
  if (!overlay) return;

  if (document.activeElement && overlay.contains(document.activeElement)) {
    document.activeElement.blur();
  }
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('map-modal-open');
}

function toggleMapaModal() {
  const overlay = document.getElementById('mapModalOverlay');
  if (overlay && overlay.classList.contains('open')) {
    cerrarMapaModal();
  } else {
    abrirMapaModal();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    cerrarMapaModal();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('mapModalOverlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        cerrarMapaModal();
      }
    });
  }
  document.addEventListener("click", (e) => {
    const btn = e.target.closest('[data-action="goToGuestCard"]');
    if (btn && btn.dataset.id) scrollToGuestCard(btn.dataset.id);
  });
});

