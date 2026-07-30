/**
 * Módulo Lightbox para visualizar en tamaño grande:
 * 1. Carátula del álbum al hacer clic en el reproductor.
 * 2. Biografía y foto ampliada de los personajes del Club del 16 de Agosto.
 */

const DATOS_PERSONAJES = {
  'madonna': {
    nombre: 'Madonna',
    edad: '68 años · 16 de Agosto',
    foto: 'imagenes/madonna.webp',
    bio: 'La incombustible "Reina del Pop". Cantante, compositora, actriz e ícono cultural global. Con más de 300 millones de discos vendidos, revolucionó la música pop y la danza en todo el mundo.'
  },
  'moria casán': {
    nombre: 'Moria Casán',
    edad: '80 años · 16 de Agosto',
    foto: 'imagenes/Moria_casan.jpg',
    bio: 'La gran diva del teatro y la televisión argentina. Vedette, actriz y personalidad icónica de la cultura popular, célebre por su carisma arrollador, lengua karateca y frases inolvidables.'
  },
  'steve carell': {
    nombre: 'Steve Carell',
    edad: '64 años · 16 de Agosto',
    foto: 'imagenes/Steve_Carell.jpg',
    bio: 'Actor, comediante, guionista y productor estadounidense. Inmortalizado por su legendario papel de Michael Scott en "The Office" y aclamado por sus inolvidables comedias y dramas.'
  },
  'angela bassett': {
    nombre: 'Angela Bassett',
    edad: '68 años · 16 de Agosto',
    foto: 'imagenes/Angela-Bassett-Black-Panther.webp',
    bio: 'Aclamada actriz y directora galardonada de Hollywood. Famosa por encarnar a la Reina Ramonda en el universo de "Black Panther" y por sus históricas actuaciones dramáticas.'
  },
  'james cameron': {
    nombre: 'James Cameron',
    edad: '71 años · 16 de Agosto',
    foto: 'imagenes/James_Cameron.jpg',
    bio: 'Cineasta y explorador visionario. Director y creador de las obras maestras más taquilleras de la historia del cine mundial: "Titanic", "Avatar" y la saga "Terminator".'
  },
  'taika waititi': {
    nombre: 'Taika Waititi',
    edad: '50 años · 16 de Agosto',
    foto: 'imagenes/Taika_Waititi.webp',
    bio: 'Director, guionista y actor neozelandés, ganador del premio Óscar por "Jojo Rabbit". Reconocido por su humor irreverente y por transformar el universo cinematográfico de "Thor".'
  }
};

window.inicializarLightbox = function() {
  // Crear contenedor global overlay si no existe
  let overlay = document.getElementById('lightboxOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'lightboxOverlay';
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <div class="lightbox-modal" id="lightboxModal">
        <button class="lightbox-close" id="lightboxCloseBtn" aria-label="Cerrar">✕</button>
        <div id="lightboxContent"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Eventos para cerrar modal
    const cerrar = () => overlay.classList.remove('active');
    document.getElementById('lightboxCloseBtn').addEventListener('click', cerrar);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) cerrar();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') cerrar();
    });
  }

  const contentEl = document.getElementById('lightboxContent');

  // 1. Evento en el reproductor (al tocar cualquier parte excepto el botón Play)
  const playerCard = document.getElementById('playerCard');
  if (playerCard) {
    playerCard.addEventListener('click', (e) => {
      if (e.target.closest('#playBtn')) return; // No abrir lightbox si presiona Play

      const coverSrc = document.getElementById('playerCover')?.src || 'imagenes/cover.jpg';
      const title = document.getElementById('playerTitle')?.textContent || 'Bring Your Love';
      const artist = document.getElementById('playerArtist')?.textContent || 'Madonna';
      const meta = document.getElementById('playerMeta')?.textContent || 'CONFESSIONS II · 2026';

      contentEl.innerHTML = `
        <img class="lightbox-cover-img" src="${coverSrc}" alt="${title}">
        <div class="lightbox-title">${title}</div>
        <div class="lightbox-subtitle">${artist}</div>
        <div class="lightbox-meta">${meta}</div>
      `;
      overlay.classList.add('active');
    });
  }

  // 2. Eventos en los personajes del Club del 16
  const chips = document.querySelectorAll('.chip');
  chips.forEach((chip) => {
    chip.style.cursor = 'pointer';
    chip.addEventListener('click', () => {
      const nombreTxt = chip.querySelector('.who')?.textContent?.trim().toLowerCase() || '';
      const datos = DATOS_PERSONAJES[nombreTxt];

      if (!datos) return;

      contentEl.innerHTML = `
        <img class="lightbox-person-img" src="${datos.foto}" alt="${datos.nombre}">
        <div class="lightbox-title">${datos.nombre}</div>
        <div class="lightbox-person-age">${datos.edad}</div>
        <p class="lightbox-person-bio">${datos.bio}</p>
      `;
      overlay.classList.add('active');
    });
  });
};
