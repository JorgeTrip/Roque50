/**
 * Renderizado de Métricas KPI y Barra de Progreso - Módulo Transporte
 */

function computeProgress() {
  const relevant = guests.filter(g => !isNotComing(g) && !g.special);
  const total = relevant.reduce((s, g) => s + personaCount(g), 0);
  const resolved = relevant.filter(isResolved).reduce((s, g) => s + personaCount(g), 0);
  const pct = total ? Math.round(resolved / total * 100) : 0;
  
  const pctEl = document.getElementById("pctText");
  const barEl = document.getElementById("barInner");
  const detailEl = document.getElementById("progressDetail");
  
  if (pctEl) pctEl.textContent = pct + "%";
  if (barEl) barEl.style.width = pct + "%";
  if (detailEl) detailEl.textContent = `${resolved} de ${total} personas con transporte resuelto`;

  const nonSpecial = guests.filter(g => !g.special);
  const totalGuestsPeople = nonSpecial.reduce((s, g) => s + personaCount(g), 0);
  const confirmedYes = nonSpecial.filter(g => g.confirmed === "yes").reduce((s, g) => s + personaCount(g), 0);
  const pendingCount = nonSpecial.filter(g => ["pending", "tentative"].includes(g.confirmed)).reduce((s, g) => s + personaCount(g), 0);
  const notComingCount = nonSpecial.filter(g => g.confirmed === "no").reduce((s, g) => s + personaCount(g), 0);

  const resolvedCount = nonSpecial.filter(isResolved).reduce((s, g) => s + personaCount(g), 0);
  const resolvedNotifiedCount = nonSpecial.filter(g => isResolved(g) && (typeof isGuestCoordinationComplete === "function" ? isGuestCoordinationComplete(g) : false)).reduce((s, g) => s + personaCount(g), 0);
  const resolvedUnnotifiedCount = nonSpecial.filter(g => isResolved(g) && (typeof isGuestCoordinationComplete === "function" ? !isGuestCoordinationComplete(g) : true)).reduce((s, g) => s + personaCount(g), 0);

  const transportPendingCount = nonSpecial.filter(g => g.transport === "pending" && g.confirmed !== "no").length;
  const carSpaceCount = guests.filter(g => g.transport === "car-space" && g.confirmed !== "no" && !isResolved(g)).length;
  const needsRideCount = nonSpecial.filter(g => g.transport === "needs-ride" && g.confirmed !== "no").reduce((s, g) => s + personaCount(g), 0);
  const zoneMissingCount = nonSpecial.filter(zoneNeeded).length;

  const confirmedForFood = guests.filter(g => g.confirmed === "yes" || g.special);
  let adultsCount = 0, childrenCount = 0;
  confirmedForFood.forEach(g => {
    (g.people || []).forEach(p => { if (p.isChild) childrenCount++; else adultsCount++; });
  });

  const kpiGrid = document.getElementById("kpiGrid");
  if (kpiGrid) {
    kpiGrid.innerHTML = `
      <div class="kpi-group-box">
        <div class="kpi-group-title">Confirmados (Asistencia)</div>
        <div class="kpi-subgrid">
          <div class="kpi-card k-all ${currentFilter==='all'?'active':''}" data-kpi="all" title="Ver todos los invitados"><div class="kpi-num">${totalGuestsPeople}</div><div class="kpi-label">👥 Invitados totales</div></div>
          <div class="kpi-card k-confirmed ${currentFilter==='confirmed'?'active':''}" data-kpi="confirmed" title="Filtrar por confirmados"><div class="kpi-num">${confirmedYes}</div><div class="kpi-label">✅ Personas confirmadas</div></div>
          <div class="kpi-card k-pending ${currentFilter==='confirmedPending'?'active':''}" data-kpi="confirmedPending" title="Filtrar por pendientes"><div class="kpi-num">${pendingCount}</div><div class="kpi-label">⏳ Personas pendientes</div></div>
          <div class="kpi-card k-notcoming ${currentFilter==='notcoming'?'active':''}" data-kpi="notcoming" title="Filtrar por los que no vienen"><div class="kpi-num">${notComingCount}</div><div class="kpi-label">🚫 No vienen</div></div>
        </div>
      </div>

      <div class="kpi-group-box">
        <div class="kpi-group-title">Transporte</div>
        <div class="kpi-subgrid">
          <div class="kpi-card k-confirmed ${currentFilter==='resolved'?'active':''}" data-kpi="resolved" title="Filtrar por transporte resuelto"><div class="kpi-num">${resolvedCount}</div><div class="kpi-label">✅ Transporte Resuelto</div></div>
          <div class="kpi-card k-confirmed ${currentFilter==='resolvedNotified'?'active':''}" data-kpi="resolvedNotified" title="Filtrar por resueltos notificados/coordinados"><div class="kpi-num">${resolvedNotifiedCount}</div><div class="kpi-label">📢 Resueltos Notificados</div></div>
          <div class="kpi-card k-pending ${currentFilter==='resolvedUnnotified'?'active':''}" data-kpi="resolvedUnnotified" title="Filtrar por resueltos sin notificar"><div class="kpi-num">${resolvedUnnotifiedCount}</div><div class="kpi-label">⚠️ Resueltos Sin Notificar</div></div>
          <div class="kpi-card k-tpending ${currentFilter==='transportPending'?'active':''}" data-kpi="transportPending" title="Filtrar por sin transporte definido"><div class="kpi-num">${transportPendingCount}</div><div class="kpi-label">❓ Sin transporte definido</div></div>
          <div class="kpi-card k-carspace ${currentFilter==='carSpace'?'active':''}" data-kpi="carSpace" title="Filtrar por autos con lugar disponible"><div class="kpi-num">${carSpaceCount}</div><div class="kpi-label">🚘 Autos con lugar disponibles</div></div>
          <div class="kpi-card k-needsride ${currentFilter==='needsRide'?'active':''}" data-kpi="needsRide" title="Filtrar por quienes necesitan viaje"><div class="kpi-num">${needsRideCount}</div><div class="kpi-label">🚗 Necesitan que los lleven</div></div>
          <div class="kpi-card k-zone ${currentFilter==='zoneMissing'?'active':''}" data-kpi="zoneMissing" title="Filtrar por grupos sin zona cargada"><div class="kpi-num">${zoneMissingCount}</div><div class="kpi-label">📍 Grupos sin zona cargada</div></div>
        </div>
      </div>

      <div class="kpi-group-box">
        <div class="kpi-group-title">Comida</div>
        <div class="kpi-subgrid">
          <div class="kpi-card k-food ${currentFilter==='adults'?'active':''}" data-kpi="adults" title="Filtrar por adultos confirmados"><div class="kpi-num">${adultsCount}</div><div class="kpi-label">🍽️ Adultos confirmados</div></div>
          <div class="kpi-card k-food ${currentFilter==='children'?'active':''}" data-kpi="children" title="Filtrar por niños confirmados"><div class="kpi-num">${childrenCount}</div><div class="kpi-label">🍽️ Niñ@s confirmados</div></div>
        </div>
      </div>
    `;
  }
}
