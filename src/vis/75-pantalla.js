/* ===== VIS · pantalla completa: botón en la cabecera del libro y en el menú, tecla F y opción en Ajustes ===== */
(function (V) {
  'use strict';
  const raiz = () => document.documentElement;
  const soportada = () => !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  const activa = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
  V.pantallaCompleta = activa;
  const aviso = t => { if (typeof toast === 'function') toast(t); };

  window.toggleFullscreen = function () {
    if (!soportada()) { aviso('Este navegador no permite pantalla completa. En iPhone: Compartir y luego Añadir a pantalla de inicio.'); return; }
    try {
      if (activa()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else {
        const p = (raiz().requestFullscreen || raiz().webkitRequestFullscreen).call(raiz(), { navigationUI: 'hide' });
        if (p && p.catch) p.catch(() => aviso('No se pudo activar la pantalla completa'));
      }
    } catch (e) { aviso('No se pudo activar la pantalla completa'); }
  };

  function boton(id, cls) {
    const b = document.createElement('button');
    b.type = 'button'; b.id = id; b.className = 'fs-btn ' + (cls || '');
    b.innerHTML = '<i class="pxi pxi-pantalla" aria-hidden="true"></i><span class="fs-label">Pantalla completa</span>'; b.setAttribute('aria-label', 'Pantalla completa');
    b.onclick = () => window.toggleFullscreen();
    return b;
  }
  function sincronizar() {
    const on = activa();
    document.body.classList.toggle('is-fs', on);
    document.querySelectorAll('.fs-btn').forEach(b => {
      b.setAttribute('aria-pressed', on);
      b.title = on ? 'Salir de pantalla completa (F o Esc)' : 'Pantalla completa (F)';
      const t = b.querySelector('.fs-label'); if (t) t.textContent = on ? 'Salir de pantalla completa' : 'Pantalla completa';
    });
    try { if (typeof BK !== 'undefined' && BK.open && BK.tab === 'ajustes' && typeof drawBook === 'function') drawBook(); } catch (e) { }
    if (V.pedir) setTimeout(() => { V.pedir(); if (V.dibujarYa) V.dibujarYa(); }, 150); // el lienzo cambia de tamaño
  }

  V.instalarPantalla = function () {
    if (soportada()) {
      const mast = document.querySelector('.mast > span:last-child');
      if (mast) { mast.insertBefore(boton('fsBtn'), mast.firstChild); mast.insertBefore(document.createTextNode(' '), mast.children[1]); }
      const m = document.querySelector('#m-main .m-btns');
      if (m) m.appendChild(boton('fsBtnMenu', 'mbtn'));
    }
    ['fullscreenchange', 'webkitfullscreenchange'].forEach(ev => document.addEventListener(ev, sincronizar));
    document.addEventListener('keydown', e => {
      if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !e.altKey && !/^(INPUT|TEXTAREA|SELECT)$/.test((e.target || {}).tagName || '')) { e.preventDefault(); window.toggleFullscreen(); }
    });
    const _c = window.cfgHTML;
    if (typeof _c === 'function') window.cfgHTML = function () {
      const on = activa();
      const ctl = soportada() ? `<button class='tg${on ? ' on' : ''}' onclick="toggleFullscreen()">${on ? 'Sí' : 'No'}</button>` : `<span class='stat-note'>No disponible en este navegador</span>`;
      return `<div class='crow'><span>Pantalla completa (tecla F)</span><span>${ctl}</span></div>` + _c.apply(this, arguments);
    };
    sincronizar();
  };
})(VIS);
