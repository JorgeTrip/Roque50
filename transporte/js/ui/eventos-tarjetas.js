/**
 * Delegación de Eventos para Tarjetas, Tecla Enter y Autocompletado - Módulo Transporte
 */

let isSelectingSuggestion = false;

function initGuestCardsEventListeners() {
  let zoneSearchTimer = null;

  document.addEventListener("focus", (e) => {
    if (e.target && e.target.classList && e.target.classList.contains("zone-input")) {
      openZoneSuggestions(e.target, e.target.dataset.id || "destination");
    }
  }, true);

  // Selección de sugerencia de autocompletado en mousedown (evita conflicto con focusout)
  document.addEventListener("mousedown", async (e) => {
    if (e.target.closest(".sugg-item")) {
      e.preventDefault();
      isSelectingSuggestion = true;
      const item = e.target.closest(".sugg-item");
      const dropdown = item.closest("#zoneSuggDropdown");
      const targetId = (dropdown && dropdown.dataset.targetId) || zoneSearchTargetId;

      const name = item.dataset.name;
      const lat = item.dataset.lat ? parseFloat(item.dataset.lat) : null;
      const lon = item.dataset.lon ? parseFloat(item.dataset.lon) : null;
      const region = item.dataset.region || null;
      const kind = item.dataset.kind || "zone";

      closeZoneSuggestions();

      if (targetId === "destination") {
        const destInp = document.getElementById("destInput");
        if (destInp) destInp.value = name;
        destination = { name, lat, lon };
        await saveDestination(); updateHeaderDynamic();
        if (mapInitialized) refreshMapMarkers();
      } else if (targetId) {
        const g = guests.find(x => x.id === targetId);
        if (g) {
          let resolved = await resolveZoneEntry({ name, lat, lon, region, kind });
          const finalName = resolved.name || name;
          g.zone = finalName; g.zoneLat = resolved.lat; g.zoneLon = resolved.lon; g.zoneRegion = resolved.region; g.zoneKind = resolved.kind;
          const activeInp = document.querySelector(`input.zone-input[data-id="${targetId}"]`);
          if (activeInp) activeInp.value = finalName;
          await saveGuests(); render();
        }
      }
      setTimeout(() => { isSelectingSuggestion = false; }, 600);
    }
  });

  // Clicks en la tarjeta (eliminar, integrante, whatsapp, pasajes)
  document.addEventListener("click", async (e) => {
    const t = e.target.closest("[data-action]") || e.target;
    const action = t.dataset ? t.dataset.action : null;
    if (!action) return;

    const id = t.dataset.id;
    const g = guests.find(x => x.id === id);

    if (action === "copyWhatsapp") {
      copyWhatsappMessage(id || (t.closest("button")?.dataset.id), t.closest("button") || t);
    } else if (action === "delete") {
      if (confirm("¿Eliminar a este invitado de la lista?")) { guests = guests.filter(x => x.id !== id); await saveGuests(); render(); }
    } else if (action === "addPerson" && g) {
      if (!g.people) g.people = []; g.people.push({ name: "", isChild: false }); refreshGroupName(g); await saveGuests(); render();
    } else if (action === "removePerson" && g) {
      const idx = parseInt(t.dataset.idx);
      if (g.people && g.people.length > 1) { g.people.splice(idx, 1); refreshGroupName(g); await saveGuests(); render(); }
      else alert("Un invitado necesita al menos un integrante.");
    } else if (action === "togglePassenger") {
      const driver = guests.find(x => x.id === t.dataset.driver), passenger = guests.find(x => x.id === t.dataset.passenger);
      if (driver && passenger) {
        if (!Array.isArray(driver.assignedPassengers)) driver.assignedPassengers = [];
        if (t.checked) {
          if (!driver.assignedPassengers.includes(passenger.id)) driver.assignedPassengers.push(passenger.id);
          passenger.transport = "ride-assigned"; passenger.assignedDriverName = driver.names;
        } else {
          driver.assignedPassengers = driver.assignedPassengers.filter(x => x !== passenger.id);
          if (passenger.assignedDriverName === driver.names) { passenger.transport = "needs-ride"; passenger.assignedDriverName = ""; }
        }
        await saveGuests(); render();
      }
    }
  });

  // Cambios de Selects y Checkboxes
  document.addEventListener("change", async (e) => {
    const t = e.target, action = t.dataset ? t.dataset.action : null;
    if (!action) return;
    const g = guests.find(x => x.id === t.dataset.id);
    if (!g) return;

    if (action === "transport") { g.transport = t.value; if (t.value !== "car-space") g.assignmentDone = false; }
    else if (action === "confirmed") { g.confirmed = t.value; if (t.value === "no") g.transport = "not-coming"; else if (g.transport === "not-coming") g.transport = "pending"; }
    else if (action === "personChild") { const idx = parseInt(t.dataset.idx); if (g.people && g.people[idx]) g.people[idx].isChild = t.checked; }
    else if (action === "freeSpots") { g.freeSpots = Math.max(0, parseInt(t.value) || 0); }
    else if (action === "assignmentDone") { g.assignmentDone = t.checked; }
    else if (action === "notes") { g.notes = t.value; }
    else if (action === "assignDriverToRow") {
      if (g.assignedDriverName) {
        const oldD = guests.find(x => x.names === g.assignedDriverName || (x.assignedPassengers || []).includes(g.id));
        if (oldD && Array.isArray(oldD.assignedPassengers)) oldD.assignedPassengers = oldD.assignedPassengers.filter(x => x !== g.id);
      }
      const driver = guests.find(x => x.id === t.value);
      if (driver) {
        g.transport = "ride-assigned"; g.assignedDriverName = driver.names;
        if (!Array.isArray(driver.assignedPassengers)) driver.assignedPassengers = [];
        if (!driver.assignedPassengers.includes(g.id)) driver.assignedPassengers.push(g.id);
      } else { g.transport = "needs-ride"; g.assignedDriverName = ""; }
    }
    await saveGuests(); render();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target && e.target.tagName === "INPUT" && (e.target.type === "text" || e.target.type === "number")) {
      e.preventDefault(); e.target.blur();
    }
  });

  document.addEventListener("input", (e) => {
    const t = e.target;
    if (t && t.classList && t.classList.contains("zone-input")) {
      clearTimeout(zoneSearchTimer);
      const id = t.dataset.id || "destination";
      zoneSearchTimer = setTimeout(() => openZoneSuggestions(t, id), 250);
      return;
    }
    if (!t.dataset) return;
    if (t.dataset.action === "notes") {
      const g = guests.find(x => x.id === t.dataset.id); if (g) g.notes = t.value;
      t.style.height = "auto"; t.style.height = Math.max(42, t.scrollHeight) + "px";
    }
    if (t.dataset.action === "personName") {
      const g = guests.find(x => x.id === t.dataset.id);
      const idx = parseInt(t.dataset.idx);
      if (g && g.people && g.people[idx]) g.people[idx].name = t.value;
    }
  });

  document.addEventListener("focusout", async (e) => {
    if (isSelectingSuggestion) return;
    const t = e.target;
    if (!t) return;
    if (t.classList && t.classList.contains("zone-input")) {
      setTimeout(async () => {
        if (isSelectingSuggestion) return;
        const id = t.dataset.id;
        if (id && id !== "destination") {
          const g = guests.find(x => x.id === id);
          if (g) {
            const val = t.value.trim();
            if (!val || val === g.zone) return;
            closeZoneSuggestions();
            let resolved = await resolveZoneEntry({ name: val, lat: null, lon: null, region: null, kind: null });
            if (!resolved.lat && val) {
              const geo = await geocodeAddressOnline(val);
              if (geo && geo.lat != null) resolved = await resolveZoneEntry(geo);
            }
            g.zone = resolved.name || val; g.zoneLat = resolved.lat; g.zoneLon = resolved.lon; g.zoneRegion = resolved.region; g.zoneKind = resolved.kind;
            await saveGuests(); render();
          }
        }
      }, 200);
    } else if (t.dataset && t.dataset.action === "personName") {
      const g = guests.find(x => x.id === t.dataset.id);
      if (g) { refreshGroupName(g); await saveGuests(); render(); }
    }
  });
}

document.addEventListener("DOMContentLoaded", initGuestCardsEventListeners);
