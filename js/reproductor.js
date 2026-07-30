/**
 * Inicializa el reproductor de audio y expone la función de actualización de interfaz.
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

  window.actualizarEstadoReproductor = function(reproduciendo) {
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

  // Control manual por el usuario desde el botón flotante
  playBtn.addEventListener('click', (evento) => {
    evento.stopPropagation();
    if (audio.paused) {
      console.log('▶️ [Reproductor] Botón Play presionado.');
      audio.muted = false;
      audio.play().then(() => window.actualizarEstadoReproductor(true)).catch((err) => {
        console.error('❌ [Reproductor] Error al presionar Play:', err);
      });
    } else {
      console.log('⏸️ [Reproductor] Botón Pausa presionado.');
      audio.pause();
      window.actualizarEstadoReproductor(false);
    }
  });
};
