/**
 * Orquestador Principal de Inicialización y Eventos - Módulo Transporte
 */

async function syncToFirebase() {
  const user = typeof obtenerUsuarioActual === "function" ? obtenerUsuarioActual() : null;
  if (!user) return;
  
  const payload = JSON.parse(JSON.stringify({
    guests: guests || [],
    zoneOptions: zoneOptions || [],
    settings: settings || {},
    destination: destination || {}
  }));

  try {
    localStorage.setItem(`transporte_local_backup_${user.uid}`, JSON.stringify(payload));
  } catch (e) {}

  if (typeof guardarDatosFirebase === "function") {
    await guardarDatosFirebase(user.uid, payload);
  }
}

async function saveGuests() { await syncToFirebase(); }
async function saveZones() { await syncToFirebase(); }
async function saveSettings() { await syncToFirebase(); }
async function saveDestination() { await syncToFirebase(); }

async function loadDataForUser(user) {
  if (!user) return;
  if (typeof renderSkeletons === "function") renderSkeletons();

  try {
    const b = localStorage.getItem(`transporte_local_backup_${user.uid}`);
    if (b) {
      const parsed = JSON.parse(b);
      if (parsed.guests && Array.isArray(parsed.guests)) {
        guests = sanitizeGuestsList(parsed.guests);
        if (parsed.zoneOptions) zoneOptions = parsed.zoneOptions;
        if (parsed.settings) settings = parsed.settings;
        if (parsed.destination) destination = parsed.destination;
        migrateGuestCoords();
        syncSettingsInputs();
        render();
      }
    }
  } catch (e) {}

  if (typeof inicializarUsuarioFirebase === "function") {
    inicializarUsuarioFirebase(user, (data) => {
      if (data && data.guests && Array.isArray(data.guests)) {
        guests = sanitizeGuestsList(data.guests);
        zoneOptions = data.zoneOptions || ZONE_DEFAULTS.slice();
        settings = data.settings || { caba: 3, pba: 8 };
        destination = data.destination || Object.assign({}, DEFAULT_DESTINATION);
        migrateGuestCoords();
        syncSettingsInputs();
        render();
        try { localStorage.setItem(`transporte_local_backup_${user.uid}`, JSON.stringify({ guests, zoneOptions, settings, destination })); } catch (e) {}
      } else {
        const isJorge = user.email && user.email.toLowerCase() === "jorgeotripodi@gmail.com";
        guests = isJorge ? sanitizeGuestsList(DEFAULT_GUESTS.slice()) : [];
        zoneOptions = ZONE_DEFAULTS.slice();
        settings = { caba: 3, pba: 8 };
        destination = Object.assign({}, DEFAULT_DESTINATION);
        migrateGuestCoords();
        syncSettingsInputs();
        render();
        syncToFirebase();
      }
    });
  }
}

function openZoneSuggestions(inputEl, id) {
  zoneSearchTargetId = id;
  updateZoneSuggestions(inputEl, id, inputEl.value || "");
}

function closeZoneSuggestions() {
  zoneSearchTargetId = null;
  const existing = document.getElementById("zoneSuggDropdown");
  if (existing) existing.remove();
}

async function updateZoneSuggestions(inputEl, id, filterText) {
  closeZoneSuggestions();
  zoneSearchTargetId = id;
  const cleanF = filterText ? (typeof normalizarTexto === "function" ? normalizarTexto(filterText.trim()) : filterText.trim().toLowerCase()) : "";
  const list = (zoneOptions && zoneOptions.length) ? zoneOptions : ZONE_DEFAULTS;

  let matches = list.filter(z => !cleanF || (typeof normalizarTexto === "function" ? normalizarTexto(z.name).includes(cleanF) : z.name.toLowerCase().includes(cleanF))).slice(0, 5);
  if (cleanF && !matches.some(z => (typeof normalizarTexto === "function" ? normalizarTexto(z.name) === cleanF : z.name.toLowerCase() === cleanF))) {
    matches.unshift({ name: filterText.trim(), kind: "custom" });
  }

  const dropdown = document.createElement("div");
  dropdown.id = "zoneSuggDropdown";
  dropdown.className = "zone-suggestions";
  dropdown.dataset.targetId = id;
  dropdown.style.left = inputEl.offsetLeft + "px";
  dropdown.style.top = (inputEl.offsetTop + inputEl.offsetHeight + 4) + "px";
  dropdown.style.width = inputEl.offsetWidth + "px";

  const renderDropdownItems = (items) => {
    dropdown.innerHTML = items.map(m => `
      <div class="sugg-item" data-name="${escHtml(m.name)}" data-kind="${m.kind || 'zone'}" data-lat="${m.lat || ''}" data-lon="${m.lon || ''}" data-region="${m.region || ''}">
        ${m.kind === 'custom' ? '➕ Usar esta dirección:' : (m.kind === 'address' ? '📍' : '🏙️')} <b>${escHtml(m.name)}</b>
      </div>
    `).join("");
  };

  renderDropdownItems(matches);
  inputEl.parentNode.appendChild(dropdown);

  if (cleanF.length >= 3 && typeof searchOnlineAutocomplete === "function") {
    const onlineResults = await searchOnlineAutocomplete(cleanF);
    if (onlineResults.length > 0 && zoneSearchTargetId === id) {
      onlineResults.forEach(om => {
        const normOm = typeof normalizarTexto === "function" ? normalizarTexto(om.name) : om.name.toLowerCase();
        if (!matches.some(m => (typeof normalizarTexto === "function" ? normalizarTexto(m.name) === normOm : m.name.toLowerCase() === normOm))) {
          matches.push(om);
        }
      });
      renderDropdownItems(matches);
    }
  }
}

function initMainAppEvents() {
  document.getElementById("kpiGrid")?.addEventListener("click", (e) => {
    const card = e.target.closest(".kpi-card");
    if (!card || !card.dataset.kpi) return;
    currentFilter = (currentFilter === card.dataset.kpi) ? "all" : card.dataset.kpi;
    render();
  });

  document.getElementById("searchBox")?.addEventListener("input", (e) => {
    searchTerm = e.target.value; updateSearchClearBtn(); render();
  });

  document.getElementById("clearSearchBtn")?.addEventListener("click", () => {
    const sb = document.getElementById("searchBox");
    if (sb) { sb.value = ""; searchTerm = ""; updateSearchClearBtn(); sb.focus(); render(); }
  });

  document.getElementById("addGuestBtn")?.addEventListener("click", async () => {
    const name = prompt("Nombre(s) del/los invitado(s):");
    if (!name || !name.trim()) return;
    guests.push({
      id: "g" + Date.now(), names: name.trim(), people: [{ name: name.trim(), isChild: false }], confirmed: "pending",
      zone: "", zoneLat: null, zoneLon: null, zoneRegion: null, transport: "pending", freeSpots: 0, assignedPassengers: [], assignmentDone: false, assignedDriverName: "", notes: ""
    });
    await saveGuests(); render();
  });

  document.getElementById("mapToggleBtn")?.addEventListener("click", () => { if (typeof abrirMapaModal === "function") abrirMapaModal(); });
  document.getElementById("closeMapBtn")?.addEventListener("click", () => { if (typeof cerrarMapaModal === "function") cerrarMapaModal(); });
  document.getElementById("settingsToggleBtn")?.addEventListener("click", () => { if (typeof abrirSettingsModal === "function") abrirSettingsModal(); });
  document.getElementById("closeSettingsBtn")?.addEventListener("click", () => { if (typeof cerrarSettingsModal === "function") cerrarSettingsModal(); });

  document.getElementById("exportBtn")?.addEventListener("click", exportDataJSON);
  document.getElementById("importBtn")?.addEventListener("click", () => document.getElementById("importFile")?.click());
  document.getElementById("importFile")?.addEventListener("change", (e) => importDataJSON(e.target.files[0]));
  document.getElementById("headerLogoutBtn")?.addEventListener("click", cerrarSesionUsuario);

  const fab = document.getElementById("fabScrollTop");
  if (fab) {
    fab.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    const updateFabVisibility = () => {
      const s = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (s > 60) fab.classList.remove("hidden");
      else fab.classList.add("hidden");
    };
    window.addEventListener("scroll", updateFabVisibility, { passive: true });
    document.addEventListener("scroll", updateFabVisibility, { passive: true });
    updateFabVisibility();
  }

  if (typeof observarEstadoSesion === "function") {
    observarEstadoSesion((user) => {
      if (typeof toggleVistaAutenticada === "function") toggleVistaAutenticada(user);
      if (user) loadDataForUser(user);
      else { guests = []; render(); }
    });
  }
}

document.addEventListener("DOMContentLoaded", initMainAppEvents);
