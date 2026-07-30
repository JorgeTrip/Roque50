document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.inicializarParalaje === 'function') {
    window.inicializarParalaje();
  }
  if (typeof window.inicializarReproductor === 'function') {
    window.inicializarReproductor();
  }
  if (typeof window.inicializarSobre === 'function') {
    window.inicializarSobre();
  }
  if (typeof window.inicializarCuentaRegresiva === 'function') {
    window.inicializarCuentaRegresiva();
  }
  if (typeof window.inicializarLightbox === 'function') {
    window.inicializarLightbox();
  }
});
