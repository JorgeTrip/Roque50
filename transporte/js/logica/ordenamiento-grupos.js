/**
 * Lógica de Agrupación Contigua y Ordenamiento de Invitados - Módulo Transporte
 */

function groupContiguousTransport(list) {
  if (!Array.isArray(list) || list.length <= 1) return list;

  const result = [];
  const addedIds = new Set();

  function addGuestWithPassengers(g) {
    if (addedIds.has(g.id)) return;
    addedIds.add(g.id);
    result.push(g);

    const passengerIds = new Set(g.assignedPassengers || []);
    list.forEach(p => {
      if (!addedIds.has(p.id)) {
        const isAssignedById = passengerIds.has(p.id);
        const isAssignedByName = (p.transport === "ride-assigned" && p.assignedDriverName && (p.assignedDriverName === g.names || g.names.includes(p.assignedDriverName) || p.assignedDriverName.includes(g.names)));
        if (isAssignedById || isAssignedByName) {
          addGuestWithPassengers(p);
        }
      }
    });
  }

  list.forEach(g => {
    const isDriver = (Array.isArray(g.assignedPassengers) && g.assignedPassengers.length > 0) || g.special || g.transport === "car-space";
    if (isDriver && !addedIds.has(g.id)) {
      addGuestWithPassengers(g);
    }
  });

  list.forEach(g => {
    if (!addedIds.has(g.id)) {
      addGuestWithPassengers(g);
    }
  });

  return result;
}

function sortGreenList(greenList) {
  if (!Array.isArray(greenList) || greenList.length <= 1) return greenList;
  const grouped = groupContiguousTransport(greenList);
  const pendingCoord = [];
  const completeCoord = [];
  const standaloneResolved = [];
  const handledIds = new Set();

  grouped.forEach(g => {
    if (handledIds.has(g.id)) return;

    if (g.transport === "car-space" && Array.isArray(g.assignedPassengers) && g.assignedPassengers.length > 0) {
      const isComplete = isGuestCoordinationComplete(g);
      const groupMembers = [g];
      handledIds.add(g.id);
      g.assignedPassengers.forEach(pId => {
        const p = greenList.find(x => x.id === pId);
        if (p && !handledIds.has(p.id)) {
          groupMembers.push(p);
          handledIds.add(p.id);
        }
      });
      if (isComplete) completeCoord.push(...groupMembers);
      else pendingCoord.push(...groupMembers);
    } else if (g.transport === "ride-assigned") {
      handledIds.add(g.id);
      if (isGuestCoordinationComplete(g)) completeCoord.push(g);
      else pendingCoord.push(g);
    } else if (["car-no-space", "public", "host"].includes(g.transport)) {
      handledIds.add(g.id);
      standaloneResolved.push(g);
    } else {
      handledIds.add(g.id);
      if (isGuestCoordinationComplete(g)) completeCoord.push(g);
      else pendingCoord.push(g);
    }
  });

  return [...pendingCoord, ...completeCoord, ...standaloneResolved];
}

function sortedGuests() {
  const specialList = [], pendingList = [], greenList = [], grayList = [];
  const passengerToDriver = new Map();

  guests.forEach(d => {
    if (Array.isArray(d.assignedPassengers)) {
      d.assignedPassengers.forEach(pId => passengerToDriver.set(pId, d));
    }
  });

  guests.forEach(g => {
    if (g.special) {
      if (isResolved(g)) greenList.push(g);
      else specialList.push(g);
    } else if (isNotComing(g)) {
      grayList.push(g);
    } else {
      const driver = passengerToDriver.get(g.id) || guests.find(d => d.names && g.assignedDriverName && (g.assignedDriverName === d.names || d.names.includes(g.assignedDriverName)));
      if (driver && driver.special && !isResolved(driver)) {
        specialList.push(g);
      } else if (driver && isResolved(driver)) {
        greenList.push(g);
      } else if (isResolved(g)) {
        greenList.push(g);
      } else {
        pendingList.push(g);
      }
    }
  });

  return {
    specialList: groupContiguousTransport(specialList),
    pendingList: groupContiguousTransport(pendingList),
    greenList: sortGreenList(greenList),
    grayList: groupContiguousTransport(grayList)
  };
}
