document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.inicializarParalaje === 'function') {
    window.inicializarParalaje();
  }
  if (typeof window.inicializarReproductor === 'function') {
    window.inicializarReproductor();
  }
});
