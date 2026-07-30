/**
 * Maneja el efecto parallax multi-capa en la sección Hero y Plataforma.
 */
window.inicializarParalaje = function() {
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducido) return;

  const tela = document.getElementById('telaLayer');
  const tri = document.getElementById('triLayer');
  const platform = document.getElementById('platformLayer');

  if (!tela || !tri || !platform) return;

  let ticking = false;

  function actualizarPosiciones() {
    const y = window.scrollY || window.pageYOffset;
    tela.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
    tri.style.transform = `translate3d(0, ${y * -0.05}px, 0)`;
    platform.style.transform = `translate3d(0, ${y * -0.06}px, 0)`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(actualizarPosiciones);
      ticking = true;
    }
  }, { passive: true });
};
