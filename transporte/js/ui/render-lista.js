/**
 * Orquestador de Renderizado de Lista de Invitados - Módulo Transporte
 */

function updateSearchClearBtn() {
  const searchBox = document.getElementById("searchBox");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  if (searchBox && clearSearchBtn) {
    if (searchBox.value.trim().length > 0) {
      clearSearchBtn.classList.remove("hidden");
    } else {
      clearSearchBtn.classList.add("hidden");
    }
  }
}

function renderList() {
  const container = document.getElementById("listContainer");
  if (!container) return;

  const sorted = sortedGuests();
  let html = "";

  const renderSection = (title, icon, list) => {
    const filtered = list.filter(matchesFilters);
    if (filtered.length === 0) return "";
    let secHtml = `<div style="margin: 22px 0 10px; font-weight: 700; font-size: 1.05rem; color: var(--gold);">${icon} ${title} (${filtered.length})</div>`;
    secHtml += filtered.map(renderGuestCard).join("");
    return secHtml;
  };

  html += renderSection("Nuestros Viajes y Especiales", "⭐", sorted.specialList);
  html += renderSection("Pendientes de Definir Transporte", "⏳", sorted.pendingList);
  html += renderSection("Transporte Resuelto y Confirmado", "✅", sorted.greenList);
  html += renderSection("No Asisten al Evento", "🚫", sorted.grayList);

  if (!html.trim()) {
    html = `<div class="empty-msg">No se encontraron invitados que coincidan con la búsqueda o filtro seleccionado.</div>`;
  }

  container.innerHTML = html;
}

function render() {
  computeProgress();
  renderList();
  if (mapInitialized && typeof refreshMapMarkers === "function") {
    refreshMapMarkers();
  }
}
