document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.inicializarParalaje === 'function') window.inicializarParalaje();
  if (typeof window.inicializarReproductor === 'function') window.inicializarReproductor();
  if (typeof window.inicializarSobre === 'function') window.inicializarSobre();
  if (typeof window.inicializarCuentaRegresiva === 'function') window.inicializarCuentaRegresiva();
  if (typeof window.inicializarLightbox === 'function') window.inicializarLightbox();
  if (typeof window.inicializarAsistencia === 'function') window.inicializarAsistencia();

  const indicator = document.getElementById('scrollIndicator');
  if (indicator) {
    indicator.addEventListener('click', () => {
      document.querySelector('.actions')?.scrollIntoView({ behavior: 'smooth' });
    });
    window.addEventListener('scroll', () => {
      if (window.scrollY > 70) {
        indicator.classList.add('hidden');
      } else {
        indicator.classList.remove('hidden');
      }
    }, { passive: true });
  }
});
