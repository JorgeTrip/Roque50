/**
 * Cuenta regresiva al evento de cumpleaños de Roque.
 * Objetivo: domingo 16 de agosto de 2026 a las 19:00 hs (GMT-3 Argentina).
 */
window.inicializarCuentaRegresiva = function() {
  const FECHA_EVENTO = new Date('2026-08-16T19:00:00-03:00');
  const el = document.getElementById('cuentaRegresiva');

  if (!el) return;

  const formatear = (n) => String(n).padStart(2, '0');

  const actualizar = () => {
    const diff = FECHA_EVENTO.getTime() - Date.now();
    if (diff <= 0) { el.textContent = '¡Ya es hoy! 🎉'; return; }

    const dias  = Math.floor(diff / 86400000);
    const horas = Math.floor((diff % 86400000) / 3600000);
    const min   = Math.floor((diff % 3600000) / 60000);
    const seg   = Math.floor((diff % 60000) / 1000);

    el.textContent = `${formatear(dias)} días · ${formatear(horas)} horas · ${formatear(min)} minutos · ${formatear(seg)} segundos`;
  };

  actualizar();
  setInterval(actualizar, 1000);
};
