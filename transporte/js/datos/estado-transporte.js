/**
 * Gestión del Estado de la Aplicación - Módulo Transporte
 */

let destination = Object.assign({}, DEFAULT_DESTINATION);
let zoneOptions = ZONE_DEFAULTS.slice();
let guests = [];
let settings = { caba: 3, pba: 8 };
let currentFilter = "all";
let searchTerm = "";
let leafletMap = null;
let mapInitialized = false;
let zoneSearchTargetId = null;
let zoneSearchTimer = null;

/**
 * Normaliza un texto removiendo diacríticos (acentos/tildes) y convirtiéndolo a minúsculas.
 * Permite comparaciones y búsquedas insensibles a caracteres con acento.
 * @param {string} texto - Texto a normalizar.
 * @returns {string} Texto sin acentos y en minúsculas.
 */
function normalizarTexto(texto) {
  if (!texto) return "";
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Funciones para sanitizar la lista de invitados
function sanitizeGuestsList(list) {
  if (!Array.isArray(list)) return [];
  return list.map(g => {
    let copy = Object.assign({}, g);
    if (copy.special) {
      const hostNames = (settings && settings.hostNames) ? settings.hostNames.trim() : "";
      copy.names = hostNames || "Roque y Jorge (nosotros)";
      if (!Array.isArray(copy.people) || copy.people.length === 0) {
        copy.people = [
          { name: "Roque", isChild: false },
          { name: "Jorge", isChild: false }
        ];
      }
    }
    return copy;
  });
}

function refreshGroupName(g) {
  if (!g.people || g.people.length === 0) return;
  if (g.special) return;
  const namesArr = g.people.map(p => p.name.trim()).filter(Boolean);
  if (namesArr.length > 0) {
    if (namesArr.length === 1) g.names = namesArr[0];
    else if (namesArr.length === 2) g.names = namesArr.join(" y ");
    else g.names = namesArr.slice(0, -1).join(", ") + " y " + namesArr[namesArr.length - 1];
  }
}
