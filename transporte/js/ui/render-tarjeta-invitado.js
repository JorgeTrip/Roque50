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

  let badgeHtml = "";
  if (g.confirmed === "yes") badgeHtml = `<span class="badge b-yes">Sí, confirmado</span>`;
  else if (g.confirmed === "no") badgeHtml = `<span class="badge b-no">No viene</span>`;
  else badgeHtml = `<span class="badge b-pending">Pendiente / A confirmar</span>`;

  return `
    <div class="card ${specialClass} ${statusClass}" id="card_${g.id}">
      <div class="card-top">
        <div class="card-title-group">
          <div class="card-title-name">${g.special ? '⭐' : '👤'} ${escHtml(g.names)}</div>
          <div class="card-badge-wrap">${badgeHtml}</div>
        </div>
        <div class="card-top-actions">
          <button class="small-btn" data-action="copyWhatsapp" data-id="${g.id}" title="Copiar mensaje para WhatsApp">💬</button>
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
          <div style="position:relative;">
            <input type="text" class="zone-input" value="${escHtml(g.zone)}" data-id="${g.id}" placeholder="Buscar barrio o dirección..." autocomplete="off">
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
            <option value="host" ${g.transport==='host'?'selected':''}>Anfitriones</option>
            <option value="not-coming" ${g.transport==='not-coming'?'selected':''}>No viene</option>
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
