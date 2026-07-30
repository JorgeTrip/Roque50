/**
 * Gestiona la pantalla de bienvenida con el sobre cerrado.
 * Al presionar el sobre, se desvanece la pantalla e inicia el reproductor de audio.
 */
window.inicializarSobre = function() {
  const envelopeScreen = document.getElementById('envelopeScreen');
  const audio = document.getElementById('audio');

  if (!envelopeScreen || !audio) {
    console.error('❌ [Sobre] No se encontraron los elementos necesarios en el DOM.');
    return;
  }

  console.log('✉️ [Sobre] Inicializando pantalla de bienvenida con sobre cerrado...');

  let abierto = false;

  const abrirInvitacion = (e) => {
    if (abierto) return;
    abierto = true;

    console.log(`🚀 [Sobre] Gesto directo detectado (${e ? e.type : 'clic'}). Ocultando sobre e iniciando audio...`);
    envelopeScreen.classList.add('hidden');
    // Activar animación de caída de la tela ahora que el sobre desapareció
    document.body.classList.add('invitacion-abierta');

    // Bloquear scroll verticalmente solo durante la animación de caída (5s), luego restaurar
    document.body.style.overflowY = 'hidden';
    setTimeout(() => { document.body.style.overflowY = ''; }, 5200);

    audio.muted = false;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('✅ [Sobre] ¡Audio reproduciéndose exitosamente con sonido!');
        if (typeof window.actualizarEstadoReproductor === 'function') {
          window.actualizarEstadoReproductor(true);
        }
      }).catch((err) => {
        console.warn('⚠️ [Sobre] Error al reproducir audio:', err.message || err);
      });
    }
  };

  ['click', 'touchend'].forEach((evt) => {
    envelopeScreen.addEventListener(evt, abrirInvitacion, { once: true });
  });
};
