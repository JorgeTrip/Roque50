/**
 * Renderizado de Tarjeta de Invitado - Módulo Transporte
 */

function escHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderGuestCard(g) {
  const resolved = isResolved(g);
  const notCom = isNotComing(g);
  const specialClass = g.special ? "special" : "";
  const statusClass = notCom ? "notcoming" : (resolved ? "resolved" : "");

  let badges = [];
  if (g.confirmed === "yes") badges.push(`<span class="badge b-yes">Sí, confirmado</span>`);
  else if (g.confirmed === "no") badges.push(`<span class="badge b-no">No viene</span>`);
  else badges.push(`<span class="badge b-pending">Pendiente / A confirmar</span>`);

  if (g.transport === "car-space" && Array.isArray(g.assignedPassengers) && g.assignedPassengers.length > 0) {
    const cStat = getDriverCoordinationStatus(g);
    if (cStat.isComplete) {
      badges.push(`<span class="badge b-yes" title="Se notificó a todos los pasajeros asignados">✅ Coordinación completa</span>`);
    } else {
      const tipText = `Falta notificar a: ${cStat.unnotifiedNames.join(', ')}`;
      badges.push(`<span class="badge b-pending tooltip-badge" title="${escHtml(tipText)}">⚠️ ${cStat.notifiedCount}/${cStat.total} notificados</span>`);
    }
  } else if (g.transport === "ride-assigned") {
    if (g.matchNotified) badges.push(`<span class="badge b-yes">📢 Match avisado</span>`);
    if (g.contactsExchanged) badges.push(`<span class="badge b-yes">📱 Contactos listos</span>`);
  }

  const badgeHtml = badges.join("");

  return `
    <div class="card ${specialClass} ${statusClass}" id="card_${g.id}">
      <div class="card-top">
        <div class="card-title-group">
          <div class="card-title-name">${g.special ? '⭐' : '👤'} ${escHtml(g.names)}</div>
          <div class="card-badge-wrap">${badgeHtml}</div>
        </div>
        <div class="card-top-actions">
          <button class="small-btn btn-whatsapp" data-action="copyWhatsapp" data-id="${g.id}" title="Copiar mensaje para WhatsApp"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" style="display:inline-block;vertical-align:middle;"><path d="M17.472 14.382c-.301-.15-1.78-.877-2.056-.977-.276-.101-.477-.15-.678.15-.2.3-.778.978-.953 1.178-.176.2-.351.226-.652.075s-1.272-.469-2.423-1.496c-.896-.799-1.501-1.786-1.677-2.087-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.678-1.635-.929-2.239-.244-.589-.493-.51-.678-.52l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.029-1.054 2.509 1.079 2.909 1.23 3.11c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.38.197 1.9-.119.58-.352 1.78-1.455 2.032-2.133.251-.677.251-1.254.176-1.379-.076-.125-.276-.2-.577-.35z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5.003L2 22l5.137-1.312A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.196a8.17 8.17 0 0 1-4.17-1.139l-.3-.178-3.048.78.813-2.973-.196-.312A8.174 8.174 0 0 1 3.804 12C3.804 7.48 7.48 3.804 12 3.804 16.52 3.804 20.196 7.48 20.196 12c0 4.52-3.676 8.196-8.196 8.196z"/></svg></button>
          ${!g.special ? `<button class="small-btn" data-action="delete" data-id="${g.id}" title="Eliminar invitado">🗑️</button>` : ''}
        </div>
      </div>

      <div class="grid-fields">
        <div class="field">
          <label>Estado de Asistencia</label>
          <select data-action="confirmed" data-id="${g.id}">
            <option value="yes" ${g.confirmed==='yes'?'selected':''}>Sí, confirmado</option>
            <option value="pending" ${g.confirmed==='pending'?'selected':''}>Pendiente</option>
            <option value="tentative" ${g.confirmed==='tentative'?'selected':''}>Tal vez / a confirmar</option>
            <option value="no" ${g.confirmed==='no'?'selected':''}>No viene</option>
          </select>
        </div>

        <div class="field">
          <label>Zona / Barrio de Origen</label>
          <div style="position:relative;display:flex;gap:6px;align-items:center;">
            <input type="text" class="zone-input" value="${escHtml(g.zone)}" data-id="${g.id}" placeholder="Buscar barrio o dirección..." autocomplete="off" style="flex:1;min-width:0;">
            <button type="button" class="small-btn map-zone-btn" data-action="openGuestMap" data-id="${g.id}" title="Ver ubicación en el mapa">🗺️</button>
          </div>
        </div>

        <div class="field">
          <label>Modo de Transporte</label>
          <select data-action="transport" data-id="${g.id}">
            <option value="pending" ${g.transport==='pending'?'selected':''}>Sin definir</option>
            <option value="car-space" ${g.transport==='car-space'?'selected':''}>Auto propio — con lugar</option>
            <option value="car-no-space" ${g.transport==='car-no-space'?'selected':''}>Auto propio — sin lugar</option>
            <option value="needs-ride" ${g.transport==='needs-ride'?'selected':''}>Necesita que lo lleven</option>
            <option value="ride-assigned" ${g.transport==='ride-assigned'?'selected':''}>Transporte asignado</option>
            <option value="public" ${g.transport==='public'?'selected':''}>Transporte público</option>
          </select>
        </div>

        ${g.transport === 'car-space' ? `
          <div class="field">
            <label>Lugares libres en auto</label>
            <input type="number" min="1" max="8" value="${g.freeSpots||0}" data-action="freeSpots" data-id="${g.id}">
          </div>
        ` : ''}
      </div>

      <div class="field" style="margin-bottom:10px;">
        <label>Integrantes del Grupo (${personaCount(g)} personas)</label>
        <div class="people-tags">
          ${renderPeopleList(g)}
          ${!g.special ? `<button type="button" class="small-btn" style="padding:4px 10px;font-size:0.8rem;" data-action="addPerson" data-id="${g.id}">➕ Agregar integrante</button>` : ''}
        </div>
      </div>

      ${['needs-ride', 'ride-assigned'].includes(g.transport) ? `
        <div class="sub-panel">
          <label><b>Asignado a vehículo de:</b></label>
          <div style="margin-top:6px;width:100%;max-width:100%;min-width:0;overflow:hidden;">${renderDriverSelector(g)}</div>
          ${g.transport === 'ride-assigned' ? renderPassengerCoordinationPanel(g) : ''}
        </div>
      ` : ''}

      ${g.transport === 'car-space' ? `
        <div class="sub-panel">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <label><b>Pasajeros Asignados:</b> (${getAssignedPassengersPeopleCount(g)} de ${g.freeSpots||0} lugares ocupados)</label>
            <label style="font-size:0.8rem;cursor:pointer;">
              <input type="checkbox" ${g.assignmentDone ? 'checked' : ''} data-action="assignmentDone" data-id="${g.id}">
              <b>Auto Completo</b>
            </label>
          </div>
          <div class="passenger-list">${renderPassengerChecklist(g)}</div>
        </div>
      ` : ''}

      <div class="notes-input-wrap" style="margin-top:10px;">
        <label style="font-size:0.8rem;color:var(--muted);">Notas / Comentarios:</label>
        <textarea data-action="notes" data-id="${g.id}" placeholder="Detalles de horarios, punto de encuentro, etc.">${escHtml(g.notes)}</textarea>
      </div>
    </div>
  `;
}
