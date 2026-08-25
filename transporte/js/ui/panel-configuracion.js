/**
 * Eventos y Sincronización del Panel de Configuración - Módulo Transporte
 */

function updateHeaderDynamic() {
  const hTitle = document.getElementById("headerTitle");
  const hSub = document.getElementById("headerSubtitle");
  const hDest = document.getElementById("headerDestText");
  const hHosts = document.getElementById("headerHostsText");

  const eventName = (settings && settings.eventName && settings.eventName.trim()) ? settings.eventName.trim() : "Mi Evento";
  const destName = (destination && destination.name && destination.name.trim()) ? destination.name.trim() : "Lugar a definir";
  const hostNames = (settings && settings.hostNames && settings.hostNames.trim()) ? settings.hostNames.trim() : "Anfitrión";

  if (hTitle) hTitle.textContent = eventName;
  if (hSub) hSub.textContent = "Plataforma central para organizar invitaciones, confirmaciones de asistencia y viajes compartidos.";
  if (hDest) hDest.textContent = destName;
  if (hHosts) hHosts.textContent = hostNames;
}

function syncSettingsInputs() {
  if (!settings) settings = { caba: 3, pba: 8 };
  const eventNameInp = document.getElementById("eventNameInput");
  const hostInp = document.getElementById("hostNamesInput");
  const radiusCaba = document.getElementById("radiusCaba");
  const radiusPba = document.getElementById("radiusPba");
  const destInp = document.getElementById("destInput");

  if (eventNameInp && document.activeElement !== eventNameInp) eventNameInp.value = settings.eventName || "";
  if (hostInp && document.activeElement !== hostInp) hostInp.value = settings.hostNames || "";
  if (radiusCaba && document.activeElement !== radiusCaba) radiusCaba.value = settings.caba || 3;
  if (radiusPba && document.activeElement !== radiusPba) radiusPba.value = settings.pba || 8;
  if (destInp && document.activeElement !== destInp) destInp.value = (destination && destination.name) ? destination.name : "";

  updateHeaderDynamic();
}

let timerSettingsDebounce = null;
function debouncedSaveSettings() {
  clearTimeout(timerSettingsDebounce);
  timerSettingsDebounce = setTimeout(async () => {
    await saveSettings();
  }, 400);
}

function initSettingsListeners() {
  const eventNameInp = document.getElementById("eventNameInput");
  if (eventNameInp) {
    eventNameInp.addEventListener("input", (e) => {
      if (!settings) settings = {};
      settings.eventName = e.target.value;
      updateHeaderDynamic();
      debouncedSaveSettings();
    });
  }

  const hostInp = document.getElementById("hostNamesInput");
  if (hostInp) {
    hostInp.addEventListener("input", (e) => {
      if (!settings) settings = {};
      const val = e.target.value;
      settings.hostNames = val;
      const specialGuest = guests.find(g => g.special);
      if (specialGuest) {
        specialGuest.names = val || "Anfitriones";
        refreshGroupName(specialGuest);
      }
      updateHeaderDynamic();
      debouncedSaveSettings();
    });
  }

  document.getElementById("radiusCaba")?.addEventListener("change", async (e) => {
    settings.caba = parseFloat(e.target.value) || 0; await saveSettings(); render();
  });

  document.getElementById("radiusPba")?.addEventListener("change", async (e) => {
    settings.pba = parseFloat(e.target.value) || 0; await saveSettings(); render();
  });

  const destInp = document.getElementById("destInput");
  if (destInp) {
    destInp.addEventListener("blur", async (e) => {
      setTimeout(async () => {
        if (typeof isSelectingSuggestion !== "undefined" && isSelectingSuggestion) return;
        const val = e.target.value.trim();
        if (val && val !== destination.name) {
          let geo = await geocodeAddressOnline(val);
          if (geo && geo.lat != null) {
            destination = { name: geo.name, lat: geo.lat, lon: geo.lon };
          } else {
            const fallback = findFallbackZone(val);
            if (fallback) destination = { name: val, lat: fallback.lat, lon: fallback.lon };
            else destination = { name: val, lat: null, lon: null };
          }
          await saveDestination();
          updateHeaderDynamic();
          if (mapInitialized) refreshMapMarkers();
        }
      }, 250);
    });
  }
}

/**
 * Control del Modal Flotante de Configuración
 */
function abrirSettingsModal() {
  const overlay = document.getElementById('settingsModalOverlay');
  if (!overlay) return;

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('settings-modal-open');
}

function cerrarSettingsModal() {
  const overlay = document.getElementById('settingsModalOverlay');
  if (!overlay) return;

  if (document.activeElement && overlay.contains(document.activeElement)) {
    document.activeElement.blur();
  }
  if (typeof closeZoneSuggestions === "function") closeZoneSuggestions();
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('settings-modal-open');
}

function toggleSettingsModal() {
  const overlay = document.getElementById('settingsModalOverlay');
  if (overlay && overlay.classList.contains('open')) {
    cerrarSettingsModal();
  } else {
    abrirSettingsModal();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    cerrarSettingsModal();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  initSettingsListeners();

  const overlay = document.getElementById('settingsModalOverlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        cerrarSettingsModal();
      }
    });
  }
});

