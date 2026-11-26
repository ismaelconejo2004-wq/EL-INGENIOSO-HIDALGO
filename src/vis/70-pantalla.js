/* ===== VIS · pantalla completa: botón de la cabecera, tecla F y opción en Ajustes ===== */
(function (V) {
  'use strict';
  const el = () => document.documentElement;
  const soportada = () => !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  const activa = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
  V.pantallaCompleta = activa;

  window.toggleFullscreen = function () {
    if (!soportada()) { if (typeof toast === 'function') toast('Este navegador no permite pantalla completa. En iPhone: Compartir → Añadir a pantalla de inicio.'); return; }
    try {
      if (activa()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else {
        const p = (el().requestFullscreen || el().webkitRequestFullscreen).call(el(), { navigationUI: 'hide' });
        if (p && p.catch) p.catch(() => { if (typeof toast === 'function') toast('No se pudo activar la pantalla completa'); });
      }
    } catch (e) { if (typeof toast === 'function') toast('No se pudo activar la pantalla completa'); }
  };

  function sincronizar() {
    const on = activa(), b = document.getElementById('fsBtn');
    document.body.classList.toggle('is-fs', on);
    if (b) {
      b.setAttribute('aria-pressed', on);
      b.title = on ? 'Salir de pantalla completa (F o Esc)' : 'Pantalla completa (F)';
      const t = b.querySelector('.fs-label'); if (t) t.textContent = on ? 'Salir' : 'Pantalla completa';
    }
    // si Ajustes está abierto, refresca el interruptor
    try { if (typeof BK !== 'undefined' && BK.open && BK.tab === 'ajustes' && typeof drawBook === 'function') drawBook(1); } catch (e) { }
    if (V.pedir) setTimeout(() => { V.pedir(); V.dibujarYa && V.dibujarYa(); }, 120); // el lienzo cambia de tamaño al entrar/salir
  }

  V.instalarPantalla = function () {
    ['fullscreenchange', 'webkitfullscreenchange'].forEach(ev => document.addEventListener(ev, sincronizar));
    document.addEventListener('keydown', e => {
      if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !e.altKey && !/^(INPUT|TEXTAREA|SELECT)$/.test((e.target || {}).tagName || '')) { e.preventDefault(); window.toggleFullscreen(); }
    });
    // fila al principio de Ajustes
    const _c = window.cfgHTML;
    if (typeof _c === 'function') window.cfgHTML = function () {
      const on = activa();
      const ctl = soportada() ? `<button class='tg ${on ? 'on' : ''}' onclick="toggleFullscreen()">${on ? 'Sí' : 'No'}</button>` : `<span class='stat-note'>No disponible en este navegador</span>`;
      return `<div class='crow'><span>Pantalla completa (tecla F)</span><span>${ctl}</span></div>` + _c.apply(this, arguments);
    };
    sincronizar();
  };
})(VIS);
