/**
 * Módulo para gestionar las opciones de confirmación de asistencia (RSVP) por WhatsApp
 * y el desplegable interactivo de transporte/traslado.
 */
window.inicializarAsistencia = function() {
  const btnWhats = document.querySelector('.btn.whats');
  if (!btnWhats) return;

  btnWhats.removeAttribute('href');
  btnWhats.style.cursor = 'pointer';

  const actionsWrap = btnWhats.parentElement;
  if (actionsWrap) actionsWrap.style.position = 'relative';

  let dropdown = document.getElementById('asistenciaDropdown');
  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.id = 'asistenciaDropdown';
    dropdown.className = 'asistencia-dropdown';
    dropdown.innerHTML = `
      <div class="asistencia-title">¿Cómo venís a la fiesta?</div>
      <button class="asistencia-opt" data-opt="1"><span class="ic">🚗</span> <span>Voy en auto y puedo llevar gente</span></button>
      <div class="asistencia-subselect" id="subselectAuto">
        <span style="font-size:12px; color:var(--champagne);">¿Cuántos lugares libres tenés?</span>
        <div class="asistencia-num-wrap">
          <button class="asistencia-num-btn" data-num="1">1</button>
          <button class="asistencia-num-btn" data-num="2">2</button>
          <button class="asistencia-num-btn" data-num="3">3</button>
          <button class="asistencia-num-btn" data-num="4">4+</button>
        </div>
      </div>
      <button class="asistencia-opt" data-opt="2"><span class="ic">🚘</span> <span>Voy en auto y no puedo llevar gente</span></button>
      <button class="asistencia-opt" data-opt="3"><span class="ic">🙋‍♂️</span> <span>Voy sin auto y me gustaría que me lleven</span></button>
      <div class="asistencia-subselect" id="subselectSinAuto">
        <span style="font-size:12px; color:var(--champagne);">¿Cuántas personas son?</span>
        <div class="asistencia-num-wrap">
          <button class="asistencia-num-btn" data-num="1">1</button>
          <button class="asistencia-num-btn" data-num="2">2</button>
          <button class="asistencia-num-btn" data-num="3">3</button>
          <button class="asistencia-num-btn" data-num="4">4+</button>
        </div>
      </div>
      <button class="asistencia-opt" data-opt="4"><span class="ic">🚌</span> <span>Voy sin auto (transporte público)</span></button>
      <button class="asistencia-opt" data-opt="5"><span class="ic">😢</span> <span>No puedo asistir</span></button>
    `;
    actionsWrap.appendChild(dropdown);
  }

  function asegurarVisibilidadDropdown() {
    setTimeout(() => {
      if (!dropdown.classList.contains('active')) return;
      const rect = dropdown.getBoundingClientRect();
      const paddingBottom = 24;
      const viewHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.bottom > viewHeight - paddingBottom) {
        const scrollAmount = rect.bottom - (viewHeight - paddingBottom);
        window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
      }
    }, 120);
  }

  btnWhats.addEventListener('click', (e) => {
    e.stopPropagation();
    const activo = dropdown.classList.toggle('active');
    if (activo) asegurarVisibilidadDropdown();
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== btnWhats) {
      dropdown.classList.remove('active');
      ocultarSubselects();
    }
  });

  const subAuto = document.getElementById('subselectAuto');
  const subSinAuto = document.getElementById('subselectSinAuto');

  function ocultarSubselects() {
    subAuto?.classList.remove('active');
    subSinAuto?.classList.remove('active');
  }

  const TEL = '541140686925';
  const BASE_MSG = 'Hola Jor! Nos vemos el domingo 16/8 en La Reja!';

  function enviarWa(msg) {
    dropdown.classList.remove('active');
    ocultarSubselects();
    window.open(`https://wa.me/${TEL}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  }

  dropdown.addEventListener('click', (e) => {
    const optBtn = e.target.closest('.asistencia-opt');
    const numBtn = e.target.closest('.asistencia-num-btn');

    if (optBtn) {
      const op = optBtn.dataset.opt;
      if (op === '1') {
        subSinAuto?.classList.remove('active');
        if (subAuto?.classList.toggle('active')) asegurarVisibilidadDropdown();
      } else if (op === '2') {
        enviarWa(`${BASE_MSG} Voy en auto pero no tengo lugares disponibles.`);
      } else if (op === '3') {
        subAuto?.classList.remove('active');
        if (subSinAuto?.classList.toggle('active')) asegurarVisibilidadDropdown();
      } else if (op === '4') {
        dropdown.classList.remove('active');
        ocultarSubselects();
        mostrarTransportePublico();
      } else if (op === '5') {
        enviarWa('Hola Jor! Lamentablemente no voy a poder ir. Que lo pasen lindo!');
      }
    } else if (numBtn) {
      const cant = numBtn.dataset.num;
      const esAuto = subAuto?.contains(numBtn);
      if (esAuto) {
        enviarWa(`${BASE_MSG} Voy en auto y tengo ${cant} lugar${cant === '1' ? '' : 'es'} libre${cant === '1' ? '' : 's'}.`);
      } else {
        enviarWa(`${BASE_MSG} Voy sin auto y somos ${cant} persona${cant === '1' ? '' : 's'}.`);
      }
    }
  });

  function mostrarTransportePublico() {
    const overlay = document.getElementById('lightboxOverlay');
    const contentEl = document.getElementById('lightboxContent');
    if (!overlay || !contentEl) return;

    contentEl.innerHTML = `
      <div class="transport-title">Cómo llegar en Transporte Público</div>
      <div class="transport-search-wrap" style="margin: 10px 0 16px; text-align: left; width: 100%;">
        <label style="font-size: 12px; color: var(--champagne); display: block; margin-bottom: 6px; font-weight: 600;">📍 ¿Desde dónde viajás?</label>
        <div style="display: flex; gap: 8px;">
          <input type="text" id="inputOrigen" placeholder="Ej: Morón, Ramos Mejía, CABA..." style="flex: 1; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(231, 201, 138, 0.4); background: rgba(0, 0, 0, 0.4); color: var(--paper); font-size: 13.5px; outline: none;" />
          <button id="btnBuscarMaps" style="padding: 10px 14px; border-radius: 10px; border: none; background: var(--champagne); color: var(--ink); font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13px; cursor: pointer;">Buscar</button>
        </div>
      </div>
      <div class="transport-item">
        <h4>🚆 Tren Sarmiento</h4>
        <p>Tren Sarmiento hasta <b>Estación Moreno</b> o <b>Estación La Reja</b> + colectivo local / remis al salón.</p>
      </div>
      <div class="transport-item">
        <h4>🚌 Colectivos Locales</h4>
        <p>Línea <b>501</b> (Ramal La Reja / Parque Leloir) te deja cerca de la quinta en Ushuaia 1990, La Reja.</p>
      </div>
      <button class="btn whats" id="btnWaTransporte" style="margin-top:14px; width:100%;">Confirmar asistencia por WhatsApp</button>
    `;

    overlay.classList.add('active');
    const inputOrigen = document.getElementById('inputOrigen');

    const buscarEnMaps = () => {
      const origen = inputOrigen?.value.trim();
      if (!origen) return inputOrigen?.focus();
      const destino = 'Ushuaia 1990, La Reja, Provincia de Buenos Aires';
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origen)}&destination=${encodeURIComponent(destino)}&travelmode=transit`, '_blank', 'noopener');
    };

    document.getElementById('btnBuscarMaps')?.addEventListener('click', buscarEnMaps);
    inputOrigen?.addEventListener('keydown', (e) => { if (e.key === 'Enter') buscarEnMaps(); });
    document.getElementById('btnWaTransporte')?.addEventListener('click', () => {
      overlay.classList.remove('active');
      enviarWa(BASE_MSG);
    });
  }
};
