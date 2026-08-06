/**
 * Eventos y Sincronización del Panel de Configuración - Módulo Transporte
 */

function updateHeaderDynamic() {
  const hTitle = document.getElementById("headerTitle");
  const hSub = document.getElementById("headerSubtitle");
  const hDest = document.getElementById("headerDestText");
  const hHosts = document.getElementById("headerHostsText");

  const eventName = (settings && settings.eventName) ? settings.eventName.trim() : "Cumple 50 de Roque";
  const destName = (destination && destination.name) ? destination.name : "La Reja, Moreno";
  const hostNames = (settings && settings.hostNames) ? settings.hostNames.trim() : "Roque y Jorge";

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

  if (eventNameInp) eventNameInp.value = settings.eventName || "";
  if (hostInp) hostInp.value = settings.hostNames || "";
  if (radiusCaba) radiusCaba.value = settings.caba || 3;
  if (radiusPba) radiusPba.value = settings.pba || 8;
  if (destInp) destInp.value = (destination && destination.name) ? destination.name : "";

  updateHeaderDynamic();
}

function initSettingsListeners() {
  const eventNameInp = document.getElementById("eventNameInput");
  if (eventNameInp) {
    eventNameInp.addEventListener("input", async (e) => {
      if (!settings) settings = {};
      settings.eventName = e.target.value;
      await saveSettings();
      updateHeaderDynamic();
    });
  }

  const hostInp = document.getElementById("hostNamesInput");
  if (hostInp) {
    hostInp.addEventListener("input", async (e) => {
      if (!settings) settings = {};
      const val = e.target.value;
      settings.hostNames = val;
      const specialGuest = guests.find(g => g.special);
      if (specialGuest) {
        specialGuest.names = val || "Anfitriones";
        refreshGroupName(specialGuest);
        await saveGuests();
      }
      await saveSettings();
      render();
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
    destInp.addEventListener("focus", (e) => openZoneSuggestions(e.target, "destination"));
    destInp.addEventListener("input", (e) => openZoneSuggestions(e.target, "destination"));
    destInp.addEventListener("blur", async (e) => {
      setTimeout(async () => {
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

document.addEventListener("DOMContentLoaded", initSettingsListeners);
