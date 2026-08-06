/**
 * Servicio de Exportación, Importación y Recarga de Datos - Módulo Transporte
 */

function exportDataJSON() {
  const exportPayload = { guests, zoneOptions, settings, destination };
  const str = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([str], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transporte_roque50_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importDataJSON(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed.guests && Array.isArray(parsed.guests)) {
        guests = sanitizeGuestsList(parsed.guests);
        if (parsed.zoneOptions) zoneOptions = parsed.zoneOptions;
        if (parsed.settings) settings = parsed.settings;
        if (parsed.destination) destination = parsed.destination;
        migrateGuestCoords();
        syncSettingsInputs();
        render();
        await syncToFirebase();
        alert("✅ Datos importados exitosamente.");
      } else {
        alert("❌ El archivo JSON no tiene un formato válido.");
      }
    } catch (err) {
      alert("❌ Error al leer el archivo JSON: " + err.message);
    }
  };
  reader.readAsText(file);
}

async function reloadFromNetlify() {
  if (!confirm("¿Cargar datos desde Netlify? Esto reemplazará el estado actual.")) return;
  try {
    const res = await fetch("../transporte.json");
    if (!res.ok) throw new Error("No se pudo obtener transporte.json");
    const data = await res.json();
    if (data && data.guests) {
      guests = sanitizeGuestsList(data.guests);
      zoneOptions = data.zoneOptions || ZONE_DEFAULTS.slice();
      settings = data.settings || { caba: 3, pba: 8 };
      destination = data.destination || Object.assign({}, DEFAULT_DESTINATION);
      migrateGuestCoords();
      syncSettingsInputs();
      render();
      await syncToFirebase();
      alert("✅ Datos cargados correctamente desde transporte.json.");
    }
  } catch (err) {
    alert("⚠️ Error al recargar desde Netlify: " + err.message);
  }
}
