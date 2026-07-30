/**
 * Inicializa el reproductor de audio con diagnóstico en consola
 * y estrategia adaptativa de autoplay para navegadores.
 */
window.inicializarReproductor = function() {
  const audio = document.getElementById('audio');
  const playerCard = document.getElementById('playerCard');
  const playBtn = document.getElementById('playBtn');
  const playerCover = document.getElementById('playerCover');
  const playerTitle = document.getElementById('playerTitle');
  const playerArtist = document.getElementById('playerArtist');
  const playerMeta = document.getElementById('playerMeta');

  if (!audio || !playerCard || !playBtn) {
    console.error('❌ [Reproductor] No se encontraron los elementos del DOM necesarios.');
    return;
  }

  console.log('🎵 [Reproductor] Inicializando reproductor de audio...');

  // Cargar metadatos desde cancion.m4a (o valores pre-extraídos de respaldo)
  if (typeof window.obtenerMetadatosM4A === 'function') {
    window.obtenerMetadatosM4A('musica/cancion.m4a').then((metadatos) => {
      console.log('ℹ️ [Reproductor] Metadatos cargados:', metadatos);
      if (playerCover && metadatos.caratula) playerCover.src = metadatos.caratula;
      if (playerTitle && metadatos.titulo) playerTitle.textContent = metadatos.titulo;
      if (playerArtist && metadatos.artista) playerArtist.textContent = metadatos.artista;
      if (playerMeta && metadatos.album) playerMeta.textContent = `${metadatos.album} · ${metadatos.anio}`;
    });
  }

  const actualizarEstadoUI = (reproduciendo) => {
    if (reproduciendo) {
      playerCard.classList.remove('paused');
      playBtn.textContent = '❚❚';
      playBtn.setAttribute('aria-label', 'Pausar música');
      document.body.classList.add('disco-mode');
    } else {
      playerCard.classList.add('paused');
      playBtn.textContent = '▶';
      playBtn.setAttribute('aria-label', 'Reproducir música');
      document.body.classList.remove('disco-mode');
    }
  };

  const removerOyentesInteraccion = () => {
    ['click', 'touchstart', 'pointerdown', 'keydown'].forEach((evento) => {
      document.removeEventListener(evento, desSilenciarYReproducir);
    });
  };

  const desSilenciarYReproducir = (e) => {
    console.log(`⚡ [Reproductor] Gesto del usuario detectado (${e.type}). Activando sonido...`);
    audio.muted = false;
    audio.play().then(() => {
      console.log('✅ [Reproductor] Música sonando correctamente.');
      actualizarEstadoUI(true);
    }).catch((err) => {
      console.warn('⚠️ [Reproductor] Requiere clic directo en el botón:', err.message);
    });
    removerOyentesInteraccion();
  };

  const iniciarAutoplay = async () => {
    const esArchivoLocal = window.location.protocol === 'file:';
    if (esArchivoLocal) {
      console.info('ℹ️ [Reproductor] Modo file:// local. Abrí en http://localhost:8080 para habilitar autoplay nativo de servidor.');
    } else {
      console.info('🌐 [Reproductor] Modo HTTP/localhost activo. Autoplay disponible.');
    }

    console.log('🔊 [Reproductor] Intentando reproducción automática con sonido...');
    try {
      audio.muted = false;
      await audio.play();
      console.log('🎉 [Reproductor] ¡Autoplay con sonido permitido por el navegador!');
      actualizarEstadoUI(true);
    } catch (errorSonido) {
      console.warn('🚫 [Reproductor] Autoplay directo bloqueado por el navegador (falta de interacción previa).');

      try {
        console.log('🔇 [Reproductor] Iniciando reproducción silenciada (muted)...');
        audio.muted = true;
        await audio.play();
        console.log('▶️ [Reproductor] Reproducción iniciada (muted). El ecualizador está activo.');
        actualizarEstadoUI(true);
      } catch (errorMuted) {
        console.warn('ℹ️ [Reproductor] Reproducción silenciada bloqueada por origen local. Esperando primer clic o toque.');
        actualizarEstadoUI(false);
      }

      console.log('👇 [Reproductor] Escuchando primer clic, toque o tecla para activar sonido...');
      ['click', 'touchstart', 'pointerdown', 'keydown'].forEach((evento) => {
        document.addEventListener(evento, desSilenciarYReproducir, { once: true, passive: true });
      });
    }
  };

  if (document.readyState === 'complete') {
    iniciarAutoplay();
  } else {
    window.addEventListener('load', iniciarAutoplay);
  }

  playBtn.addEventListener('click', (evento) => {
    evento.stopPropagation();
    removerOyentesInteraccion();
    if (audio.paused) {
      console.log('▶️ [Reproductor] Botón Play presionado.');
      audio.muted = false;
      audio.play().then(() => actualizarEstadoUI(true)).catch((err) => {
        console.error('❌ [Reproductor] Error al presionar Play:', err);
      });
    } else {
      console.log('⏸️ [Reproductor] Botón Pausa presionado.');
      audio.pause();
      actualizarEstadoUI(false);
    }
  });
};
