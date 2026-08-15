/**
 * Lógica de Negocio y Evaluaciones de Estado - Módulo Transporte
 */

function isNotComing(row) {
  return row.confirmed === "no";
}

function zoneNeeded(row) {
  return !isNotComing(row) && !row.zone.trim();
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

function getCarCapacity(row) {
  if (!row) return 5;
  return Math.max(5, personaCount(row) + (parseInt(row.freeSpots) || 0));
}

function getTotalCarOccupants(row) {
  if (!row) return 0;
  return personaCount(row) + getAssignedPassengersPeopleCount(row);
}

function isCarFull(row) {
  if (!row || row.transport !== "car-space") return false;
  if (row.assignmentDone) return true;
  return getTotalCarOccupants(row) >= getCarCapacity(row);
}

function hasCarAvailableSpots(row) {
  if (!row || row.transport !== "car-space" || row.confirmed === "no") return false;
  return getTotalCarOccupants(row) < getCarCapacity(row);
}

function isResolved(row) {
  if (row.confirmed === "no") return false;
  if (row.transport === "ride-assigned") return true;
  if (row.confirmed !== "yes") return false;
  if (["car-no-space", "public"].includes(row.transport)) return true;
  return row.transport === "car-space" && (!!row.assignmentDone || isCarFull(row));
}

function matchesFilters(g) {
  if (searchTerm) {
    const q = typeof normalizarTexto === "function" ? normalizarTexto(searchTerm) : searchTerm.toLowerCase();
    const matchName = typeof normalizarTexto === "function" ? normalizarTexto(g.names).includes(q) : g.names.toLowerCase().includes(q);
    const matchZone = typeof normalizarTexto === "function" ? normalizarTexto(g.zone || "").includes(q) : (g.zone || "").toLowerCase().includes(q);
    const matchPeople = Array.isArray(g.people) && g.people.some(p => typeof normalizarTexto === "function" ? normalizarTexto(p.name).includes(q) : p.name.toLowerCase().includes(q));
    const matchNotes = typeof normalizarTexto === "function" ? normalizarTexto(g.notes || "").includes(q) : (g.notes || "").toLowerCase().includes(q);
    const matchDriver = typeof normalizarTexto === "function" ? normalizarTexto(g.assignedDriverName || "").includes(q) : (g.assignedDriverName || "").toLowerCase().includes(q);
    if (!matchName && !matchZone && !matchPeople && !matchNotes && !matchDriver) return false;
  }
  if (currentFilter === "all") return true;
  if (currentFilter === "pending") return !isResolved(g) && !isNotComing(g);
  if (currentFilter === "resolved") return isResolved(g);
  if (currentFilter === "resolvedNotified") return isResolved(g) && (typeof isGuestCoordinationComplete === "function" ? isGuestCoordinationComplete(g) : false);
  if (currentFilter === "resolvedUnnotified") return isResolved(g) && !["car-no-space", "public"].includes(g.transport) && (typeof isGuestCoordinationComplete === "function" ? !isGuestCoordinationComplete(g) : true);
  if (currentFilter === "notcoming") return isNotComing(g);
  if (currentFilter === "zoneMissing") return zoneNeeded(g);
  if (currentFilter === "confirmed") return g.confirmed === "yes";
  if (currentFilter === "confirmedPending") return ["pending", "tentative"].includes(g.confirmed);
  if (currentFilter === "transportPending") return g.transport === "pending" && g.confirmed !== "no";
  if (currentFilter === "carSpace") return hasCarAvailableSpots(g);
  if (currentFilter === "carAssigned") return g.transport === "car-space" && g.confirmed !== "no" && Array.isArray(g.assignedPassengers) && g.assignedPassengers.length > 0;
  if (currentFilter === "needsRide") return g.transport === "needs-ride" && g.confirmed !== "no";
  if (currentFilter === "publicTransport") return g.transport === "public" && g.confirmed !== "no";
  if (currentFilter === "adults") return (g.confirmed === "yes" || g.special) && (g.people || []).some(p => !p.isChild);
  if (currentFilter === "children") return (g.confirmed === "yes" || g.special) && (g.people || []).some(p => p.isChild);
  return true;
}

/**
 * Ordena una lista de invitados según la distancia respecto a un objeto de referencia.
 * @param {Array} list - Lista de invitados a ordenar.
 * @param {Object} refObj - Objeto de referencia con coordenadas zoneLat y zoneLon.
 * @returns {Array} Lista ordenada por cercanía.
 */
function sortByProximity(list, refObj) {
  if (!Array.isArray(list)) return [];
  const result = list.slice();
  const hasRefCoords = refObj && refObj.zoneLat != null && refObj.zoneLon != null;

  return result.sort((a, b) => {
    const aHasCoords = a && a.zoneLat != null && a.zoneLon != null;
    const bHasCoords = b && b.zoneLat != null && b.zoneLon != null;

    if (hasRefCoords && aHasCoords && bHasCoords) {
      const distA = haversine(refObj.zoneLat, refObj.zoneLon, a.zoneLat, a.zoneLon);
      const distB = haversine(refObj.zoneLat, refObj.zoneLon, b.zoneLat, b.zoneLon);
      if (Math.abs(distA - distB) > 0.01) return distA - distB;
      return (a.names || "").localeCompare(b.names || "", "es");
    }
    if (aHasCoords && !bHasCoords) return -1;
    if (!aHasCoords && bHasCoords) return 1;
    return (a.names || "").localeCompare(b.names || "", "es");
  });
}

/**
 * Evalúa si un pasajero está efectivamente asignado a un conductor específico.
 * @param {Object} passenger - Objeto del pasajero.
 * @param {Object} driver - Objeto del conductor.
 * @returns {boolean} True si el pasajero tiene asignado al conductor.
 */
function isPassengerAssignedToDriver(passenger, driver) {
  if (!passenger || !driver) return false;
  if (passenger.transport !== "ride-assigned") return false;
  if (passenger.assignedDriverId && passenger.assignedDriverId === driver.id) return true;

  if (passenger.assignedDriverName && driver.names) {
    const pName = typeof normalizarTexto === "function" ? normalizarTexto(passenger.assignedDriverName) : passenger.assignedDriverName.trim().toLowerCase();
    const dName = typeof normalizarTexto === "function" ? normalizarTexto(driver.names) : driver.names.trim().toLowerCase();
    if (pName === dName || dName.includes(pName) || pName.includes(dName)) return true;
  }

  if (Array.isArray(driver.assignedPassengers) && driver.assignedPassengers.includes(passenger.id)) return true;
  return false;
}

function driverCandidates(passengerOrId) {
  const passenger = typeof passengerOrId === "object" ? passengerOrId : guests.find(g => g.id === passengerOrId);
  const passId = passenger ? passenger.id : passengerOrId;
  const neededSpots = passenger ? personaCount(passenger) : 1;

  const drivers = guests.filter(d => {
    if (!d || d.id === passId) return false;
    if (d.transport !== "car-space") return false;
    if (d.confirmed === "no") return false;
    if (isPassengerAssignedToDriver(passenger, d)) return true;
    if (d.assignmentDone || isResolved(d)) return false;
    const totalSpots = parseInt(d.freeSpots) || 0;
    if (totalSpots <= 0) return false;
    const occupiedSpots = getAssignedPassengersPeopleCount(d);
    return (totalSpots - occupiedSpots) >= neededSpots;
  });

  return sortByProximity(drivers, passenger);
}

function passengerCandidates(driverOrId) {
  const driver = typeof driverOrId === "object" ? driverOrId : guests.find(g => g.id === driverOrId);
  const driverId = driver ? driver.id : driverOrId;
  const assigned = (driver && Array.isArray(driver.assignedPassengers)) ? driver.assignedPassengers : [];

  const candidates = guests.filter(g =>
    g.id !== driverId && g.confirmed !== "no" && (assigned.includes(g.id) || ["pending", "needs-ride"].includes(g.transport))
  );

  return sortByProximity(candidates, driver);
}

function distanceTag(a, b) {
  if (!a || !b || a.zoneLat == null || a.zoneLon == null || b.zoneLat == null || b.zoneLon == null) {
    return `<span class="far-tag">sin coordenadas</span>`;
  }
  const d = haversine(a.zoneLat, a.zoneLon, b.zoneLat, b.zoneLon);
  const region = b.zoneRegion || (typeof guessRegion === "function" ? guessRegion(b.zoneLat, b.zoneLon) : "PBA");
  const cabaRadius = (settings && settings.caba != null && !isNaN(parseFloat(settings.caba))) ? parseFloat(settings.caba) : 3;
  const pbaRadius = (settings && settings.pba != null && !isNaN(parseFloat(settings.pba))) ? parseFloat(settings.pba) : 8;
  const threshold = (region === "CABA") ? cabaRadius : pbaRadius;

  if (d <= threshold) return `<span class="near-tag">📍 cerca · ${d.toFixed(1)} km</span>`;
  return `<span class="far-tag">${d.toFixed(1)} km</span>`;
}

function getDriverCoordinationStatus(driver) {
  if (!driver || !Array.isArray(driver.assignedPassengers) || driver.assignedPassengers.length === 0) return { total: 0, notifiedCount: 0, contactsCount: 0, unnotifiedNames: [], isComplete: false };
  const assigned = driver.assignedPassengers.map(pId => guests.find(x => x.id === pId)).filter(Boolean);
  const total = assigned.length;
  const notifiedPassengers = assigned.filter(p => !!p.matchNotified);
  const unnotifiedNames = assigned.filter(p => !p.matchNotified).map(p => p.names);
  return { total, notifiedCount: notifiedPassengers.length, contactsCount: assigned.filter(p => !!p.contactsExchanged).length, unnotifiedNames, isComplete: total > 0 && notifiedPassengers.length === total };
}

function isGuestCoordinationComplete(g) {
  if (!isResolved(g)) return false;
  if (["car-no-space", "public"].includes(g.transport)) return true;
  if (g.transport === "car-space") {
    if (!Array.isArray(g.assignedPassengers) || g.assignedPassengers.length === 0) return true;
    const cStat = getDriverCoordinationStatus(g);
    if (!cStat || !cStat.isComplete) return false;
    const assigned = g.assignedPassengers.map(pId => guests.find(x => x.id === pId)).filter(Boolean);
    return assigned.every(p => !!p.contactsExchanged);
  } else if (g.transport === "ride-assigned") {
    return !!g.matchNotified && !!g.contactsExchanged;
  }
  return true;
}
