/* ===== VIS · menú principal e introducción con escenas del propio motor ===== */
(function (V) {
  'use strict';
  // Fondo del menú: los molinos al ocaso, don Quijote y Sancho cabalgando (parallax).
  const MENU = { clave: 'menu', base: 'road', marcas: { sancho: 0.07, dq: 0.2 }, e: { f: 'molinos', h: 'ocaso', pal: 'ocaso', palA: 'ocaso', tarde: false, props: [], clima: ['polvo'], r: [], an: 'walk', l: 'dq', variante: 'mancha', interior: false } };
  const NOCHE = { clave: 'intro-noche', base: 'road', e: { f: 'molinos', h: 'noche', pal: 'noche', palA: 'luna', tarde: false, props: [], clima: ['luciernagas'], r: [], an: 'walk', l: 'dq', variante: 'mancha', interior: false } };
  const ALBA = { clave: 'intro-alba', base: 'road', e: Object.assign({}, NOCHE.e, { h: 'amanecer', pal: 'amanecer', palA: 'amanecer', clima: ['polvo'] }) };
  const PESA = { clave: 'intro-pesadilla', base: 'road', e: Object.assign({}, NOCHE.e, { h: 'ocaso', pal: 'ocaso', palA: 'lumbre', clima: ['niebla'] }) };
  let cMenu = null, cNoche = null, cAlba = null, introT0 = 0, introPes = false, introDur = 30000;

  function lienzo(padre, cls) {
    const c = document.createElement('canvas'); c.className = 'vis-fondo ' + (cls || ''); c.setAttribute('aria-hidden', 'true');
    padre.insertBefore(c, padre.firstChild); medir(c); return c;
  }
  // ancho interno según la proporción de la pantalla (alto fijo de 180 px)
  function medir(c) {
    const r = innerWidth / Math.max(1, innerHeight), w = Math.max(240, Math.min(400, Math.round(180 * r)));
    if (c.width !== w) { c.width = w; c.height = 180; c._S = null; }
  }
  const visible = id => { const m = document.getElementById(id); return !!(m && m.classList.contains('on')); };

  function decorar() {
    const card = document.querySelector('#menu .m-card'); if (!card) return;
    card.classList.add('px-card');
    // iconos pixel en los botones
    const ic = { 'm-cont': 'continuar' };
    document.querySelectorAll('#m-main .mbtn').forEach(b => {
      const t = b.textContent.trim().toLowerCase();
      const k = ic[b.id] || (t.startsWith('jugar') ? 'jugar' : t.startsWith('ajustes') ? 'ajustes' : t.startsWith('salida') ? 'salida' : 'libro');
      b.insertAdjacentHTML('afterbegin', `<i class="pxi pxi-${k}" aria-hidden="true"></i>`);
    });
    // medallones en lugar de los iconos vectoriales de los modos
    document.querySelectorAll('#m-modes .mode').forEach(m => {
      const svg = m.querySelector('svg'); if (!svg) return;
      const img = document.createElement('img'); img.className = 'pxm'; img.alt = ''; img.width = 56; img.height = 56;
      img.src = V.vineta(m.classList.contains('pes') ? 'calavera' : 'libro'); svg.replaceWith(img);
    });
    // escudo del título
    const t = card.querySelector('.m-title');
    if (t && !card.querySelector('.m-escudo')) t.insertAdjacentHTML('beforebegin', `<img class="m-escudo" src="${V.vineta('cordura')}" alt="" width="56" height="56" aria-hidden="true">`);
  }

  V.instalarMenu = function () {
    const m = document.getElementById('menu'), it = document.getElementById('intro');
    if (m) cMenu = lienzo(m, 'menu');
    if (it) { cNoche = lienzo(it, 'noche'); cAlba = lienzo(it, 'alba'); it.insertBefore(cAlba, cNoche.nextSibling); }
    decorar();
    addEventListener('resize', () => [cMenu, cNoche, cAlba].forEach(c => c && medir(c)));
    const _pi = window.playIntro;
    if (_pi) window.playIntro = function (mode) { introT0 = performance.now(); introPes = mode === 'pesadilla'; if (cNoche) cNoche._S = null; if (cAlba) { cAlba._S = null; cAlba.style.opacity = 0; } const r = _pi.apply(this, arguments); introDur = (parseFloat(document.getElementById('intro').style.getPropertyValue('--dur')) || 30) * 1000; V.pedir(); return r; };
    const _sm = window.showMenu; if (_sm) window.showMenu = function () { const r = _sm.apply(this, arguments); V.pedir(); return r; };
    // un solo bucle: el menú y la introducción son tareas más del mismo requestAnimationFrame
    V.ganchos.push({
      activo: () => !document.hidden && (visible('menu') || visible('intro')),
      paso(now) {
        // fondo ambiental: 15 fotogramas por segundo son suficientes
        if (now - (this.ult || 0) < 80) return; this.ult = now;
        const quieto = V.menosMov();
        if (visible('menu') && cMenu) { if (!quieto || !cMenu._S) V.postal(cMenu, MENU, quieto ? 0 : now); }
        if (visible('intro') && cNoche) {
          const k = quieto ? 1 : Math.min(1, (now - introT0) / introDur);
          V.postal(cNoche, introPes ? PESA : NOCHE, quieto ? 0 : now);
          if (!introPes) { const a = Math.max(0, (k - 0.3) / 0.7); cAlba.style.opacity = a.toFixed(3); if (a > 0) V.postal(cAlba, ALBA, quieto ? 0 : now); }
        }
      }
    });
    V.pedir();
  };
})(VIS);
