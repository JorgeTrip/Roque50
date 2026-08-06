/**
 * Lógica de Negocio y Evaluaciones de Estado - Módulo Transporte
 */

function isNotComing(row) {
  return row.confirmed === "no";
}

function zoneNeeded(row) {
  return !["host", "not-coming"].includes(row.transport) && !row.zone.trim();
}

function personaCount(g) {
  return g.people ? g.people.length : (g.personas || 0);
}

function getAssignedPassengersPeopleCount(driver) {
  if (!Array.isArray(driver.assignedPassengers)) return 0;
  return driver.assignedPassengers.reduce((sum, passId) => {
    const p = guests.find(x => x.id === passId);
    return sum + (p ? personaCount(p) : 0);
  }, 0);
}

function isCarFull(row) {
  if (row.transport !== "car-space" || !row.freeSpots || row.freeSpots <= 0) return false;
  return getAssignedPassengersPeopleCount(row) >= row.freeSpots;
}

function isResolved(row) {
  if (row.confirmed === "no") return false;
  if (row.transport === "ride-assigned") return true;
  if (row.confirmed !== "yes") return false;
  if (["car-no-space", "public", "host"].includes(row.transport)) return true;
  if (row.transport === "car-space") return !!row.assignmentDone || isCarFull(row);
  return false;
}

function matchesFilters(g) {
  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    const matchName = g.names.toLowerCase().includes(q);
    const matchZone = (g.zone || "").toLowerCase().includes(q);
    const matchPeople = (g.people || []).some(p => p.name.toLowerCase().includes(q));
    if (!matchName && !matchZone && !matchPeople) return false;
  }
  if (currentFilter === "all") return true;
  if (currentFilter === "pending") return !isResolved(g) && !isNotComing(g);
  if (currentFilter === "resolved") return isResolved(g);
  if (currentFilter === "notcoming") return isNotComing(g);
  if (currentFilter === "zoneMissing") return zoneNeeded(g);
  if (currentFilter === "confirmed") return g.confirmed === "yes";
  if (currentFilter === "confirmedPending") return ["pending", "tentative"].includes(g.confirmed);
  if (currentFilter === "transportPending") return g.transport === "pending" && g.confirmed !== "no";
  if (currentFilter === "carSpace") return g.transport === "car-space" && g.confirmed !== "no" && !isResolved(g);
  if (currentFilter === "needsRide") return g.transport === "needs-ride" && g.confirmed !== "no";
  if (currentFilter === "adults") return (g.confirmed === "yes" || g.special) && (g.people || []).some(p => !p.isChild);
  if (currentFilter === "children") return (g.confirmed === "yes" || g.special) && (g.people || []).some(p => p.isChild);
  return true;
}

function driverCandidates(excludeId) {
  return guests.filter(g => g.transport === "car-space" && g.id !== excludeId);
}

function passengerCandidates(driverId) {
  return guests.filter(g =>
    g.id !== driverId &&
    ["pending", "needs-ride"].includes(g.transport) &&
    g.confirmed !== "no"
  );
}

function distanceTag(a, b) {
  if (!a.zoneLat || !b.zoneLat) return `<span class="far-tag">sin coordenadas</span>`;
  const d = haversine(a.zoneLat, a.zoneLon, b.zoneLat, b.zoneLon);
  const threshold = (b.zoneRegion === "CABA") ? settings.caba : settings.pba;
  if (d <= threshold) return `<span class="near-tag">📍 cerca · ${d.toFixed(1)} km</span>`;
  return `<span class="far-tag">${d.toFixed(1)} km</span>`;
}
