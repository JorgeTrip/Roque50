/**
 * Delegación de Eventos para Tarjetas de Invitados - Módulo Transporte
 */

function initGuestCardsEventListeners() {
  // Manejo de Clicks en la tarjeta (eliminar, agregar/quitar persona, whatsapp, toggle pasajeros)
  document.addEventListener("click", async (e) => {
    const t = e.target.closest("[data-action]") || e.target;
    const action = t.dataset ? t.dataset.action : null;
    if (!action) return;

    const id = t.dataset.id;
    const g = guests.find(x => x.id === id);

    if (action === "copyWhatsapp") {
      const btn = t.closest("button");
      copyWhatsappMessage(id || (btn && btn.dataset.id), btn || t);
      return;
    }

    if (action === "delete") {
      if (confirm("¿Eliminar a este invitado de la lista?")) {
        guests = guests.filter(x => x.id !== id);
        await saveGuests();
        render();
      }
      return;
    }

    if (action === "addPerson" && g) {
      if (!g.people) g.people = [];
      g.people.push({ name: "", isChild: false });
      refreshGroupName(g);
      await saveGuests();
      render();
      return;
    }

    if (action === "removePerson" && g) {
      const idx = parseInt(t.dataset.idx);
      if (g.people && g.people.length > 1) {
        g.people.splice(idx, 1);
        refreshGroupName(g);
        await saveGuests();
        render();
      } else {
        alert("Un invitado necesita al menos un integrante. Si querés eliminarlo del todo, usá el botón 🗑️.");
      }
      return;
    }

    if (action === "togglePassenger") {
      const driverId = t.dataset.driver, passId = t.dataset.passenger;
      const driver = guests.find(x => x.id === driverId);
      const passenger = guests.find(x => x.id === passId);
      if (driver && passenger) {
        if (!Array.isArray(driver.assignedPassengers)) driver.assignedPassengers = [];
        if (t.checked) {
          if (!driver.assignedPassengers.includes(passId)) driver.assignedPassengers.push(passId);
          passenger.transport = "ride-assigned";
          passenger.assignedDriverName = driver.names;
        } else {
          driver.assignedPassengers = driver.assignedPassengers.filter(x => x !== passId);
          if (passenger.assignedDriverName === driver.names) {
            passenger.transport = "needs-ride";
            passenger.assignedDriverName = "";
          }
        }
        await saveGuests();
        render();
      }
      return;
    }
  });

  // Manejo de Cambios (Selects, Checkboxes de las tarjetas)
  document.addEventListener("change", async (e) => {
    const t = e.target;
    const action = t.dataset ? t.dataset.action : null;
    if (!action) return;

    const id = t.dataset.id;
    const g = guests.find(x => x.id === id);
    if (!g) return;

    if (action === "transport") {
      g.transport = t.value;
      if (t.value !== "car-space") g.assignmentDone = false;
    } else if (action === "confirmed") {
      g.confirmed = t.value;
      if (t.value === "no") g.transport = "not-coming";
      else if (g.transport === "not-coming") g.transport = "pending";
    } else if (action === "personChild") {
      const idx = parseInt(t.dataset.idx);
      if (g.people && g.people[idx]) g.people[idx].isChild = t.checked;
    } else if (action === "freeSpots") {
      g.freeSpots = Math.max(0, parseInt(t.value) || 0);
    } else if (action === "assignmentDone") {
      g.assignmentDone = t.checked;
    } else if (action === "notes") {
      g.notes = t.value;
    } else if (action === "assignDriverToRow") {
      const oldDriverName = g.assignedDriverName;
      if (oldDriverName) {
        const oldDriver = guests.find(x => x.names === oldDriverName || (x.assignedPassengers || []).includes(g.id));
        if (oldDriver && Array.isArray(oldDriver.assignedPassengers)) {
          oldDriver.assignedPassengers = oldDriver.assignedPassengers.filter(x => x !== g.id);
        }
      }
      const driver = guests.find(x => x.id === t.value);
      if (driver) {
        g.transport = "ride-assigned";
        g.assignedDriverName = driver.names;
        if (!Array.isArray(driver.assignedPassengers)) driver.assignedPassengers = [];
        if (!driver.assignedPassengers.includes(g.id)) driver.assignedPassengers.push(g.id);
      } else {
        g.transport = "needs-ride";
        g.assignedDriverName = "";
      }
    }

    await saveGuests();
    render();
  });

  // Manejo de Inputs de texto (Nombres e Notas)
  document.addEventListener("input", (e) => {
    const t = e.target;
    if (!t.dataset) return;
    const action = t.dataset.action;
    const id = t.dataset.id;

    if (action === "notes") {
      const g = guests.find(x => x.id === id);
      if (g) g.notes = t.value;
      t.style.height = "auto";
      t.style.height = Math.max(42, t.scrollHeight) + "px";
    }
    if (action === "personName") {
      const g = guests.find(x => x.id === id);
      const idx = parseInt(t.dataset.idx);
      if (g && g.people && g.people[idx]) g.people[idx].name = t.value;
    }
  });

  document.addEventListener("focusout", async (e) => {
    const t = e.target;
    if (!t.dataset) return;
    if (t.dataset.action === "personName") {
      const g = guests.find(x => x.id === t.dataset.id);
      if (g) {
        refreshGroupName(g);
        await saveGuests();
        render();
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", initGuestCardsEventListeners);
