/**
 * Componentes Auxiliares para las Tarjetas de Invitados - Módulo Transporte
 */

function generateWhatsappMessage(guestId) {
  const g = guests.find(x => x.id === guestId);
  if (!g) return "";
  const eventName = (settings && settings.eventName) ? settings.eventName.trim() : "Cumple 50 de Roque";
  const hostNames = (settings && settings.hostNames) ? settings.hostNames.trim() : "Roque y Jorge";
  const destName = (destination && destination.name) ? destination.name : "La Reja";

  let msg = `Hola ${g.names}! 👋 Te escribimos por el ${eventName} (festejamos en ${destName}).\n\n`;
  msg += `Queríamos confirmar cómo venís con la asistencia y la organización del transporte.\n`;
  if (g.zone) msg += `📍 Zona registrada: ${g.zone}\n`;
  if (g.transport && g.transport !== "pending") msg += `🚗 Modo transporte: ${TRANSPORT_LABELS[g.transport] || g.transport}\n`;
  msg += `\nCualquier novedad nos avisás. ¡Un abrazo! - ${hostNames}`;
  return msg;
}

function copyWhatsappMessage(guestId, btnEl) {
  const text = generateWhatsappMessage(guestId);
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    if (btnEl) {
      const orig = btnEl.innerHTML;
      btnEl.innerHTML = "✅ ¡Copiado!";
      setTimeout(() => btnEl.innerHTML = orig, 2000);
    }
  }).catch(() => alert(text));
}

function renderPeopleList(g) {
  if (!Array.isArray(g.people)) return "";
  return g.people.map((p, idx) => `
    <div class="person-row">
      <input type="text" class="person-name-inp" value="${escHtml(p.name)}" data-action="personName" data-id="${g.id}" data-idx="${idx}" placeholder="Nombre del integrante">
      <label class="child-toggle">
        <input type="checkbox" ${p.isChild ? 'checked' : ''} data-action="personChild" data-id="${g.id}" data-idx="${idx}">
        <span>Niñ@</span>
      </label>
      ${g.people.length > 1 ? `<button type="button" class="small-btn" style="padding:2px 6px;min-height:auto;font-size:0.75rem;" data-action="removePerson" data-id="${g.id}" data-idx="${idx}">✕</button>` : ''}
    </div>
  `).join("");
}

function renderDriverSelector(g) {
  const drivers = driverCandidates(g.id);
  const options = drivers.map(d => `<option value="${d.id}" ${g.assignedDriverName === d.names ? 'selected' : ''}>${escHtml(d.names)} (${d.zone || 'sin zona'})</option>`).join("");
  return `
    <select data-action="assignDriverToRow" data-id="${g.id}">
      <option value="">-- Seleccionar chofer --</option>
      ${options}
    </select>
  `;
}

function renderPassengerChecklist(driver) {
  const candidates = passengerCandidates(driver.id);
  if (candidates.length === 0) return `<div style="font-size:0.8rem;color:var(--muted);">No hay pasajeros pendientes disponibles para asignar en este momento.</div>`;

  return candidates.map(p => {
    const isAssigned = (driver.assignedPassengers || []).includes(p.id);
    const distInfo = distanceTag(driver, p);
    return `
      <label class="passenger-item">
        <input type="checkbox" ${isAssigned ? 'checked' : ''} data-action="togglePassenger" data-driver="${driver.id}" data-passenger="${p.id}">
        <span><b>${escHtml(p.names)}</b> (${p.zone || 'sin zona'}) ${distInfo}</span>
      </label>
    `;
  }).join("");
}
