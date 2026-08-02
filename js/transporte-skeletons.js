/**
 * Módulo de Renderizado de Skeleton Screens para el Módulo de Transporte
 */

function renderSkeletons() {
  const kpiGrid = document.getElementById("kpiGrid");
  const listContainer = document.getElementById("listContainer");

  if (kpiGrid) {
    let kpiHtml = "";
    for (let i = 0; i < 10; i++) {
      kpiHtml += `
        <div class="kpi-card skeleton-kpi">
          <div class="skeleton-num skeleton-shimmer"></div>
          <div class="skeleton-line skeleton-shimmer"></div>
        </div>`;
    }
    kpiGrid.innerHTML = kpiHtml;
  }

  if (listContainer) {
    let listHtml = `<div class="section-divider">Cargando datos desde Firebase...</div>`;
    for (let i = 0; i < 4; i++) {
      listHtml += `
        <div class="card skeleton-card">
          <div class="skeleton-header">
            <div class="skeleton-title skeleton-shimmer"></div>
            <div class="skeleton-btn skeleton-shimmer"></div>
          </div>
          <div class="skeleton-grid">
            <div class="skeleton-field skeleton-shimmer"></div>
            <div class="skeleton-field skeleton-shimmer"></div>
            <div class="skeleton-field skeleton-shimmer"></div>
          </div>
        </div>`;
    }
    listContainer.innerHTML = listHtml;
  }
}
