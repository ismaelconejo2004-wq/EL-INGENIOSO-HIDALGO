/* ===== VIS · interfaz: iconos pixel art, marco barroco, barras animadas y opciones ilustradas ===== */
(function (V) {
  'use strict';
  const { B, C, HEX } = V;

  /* ---------- iconos 16x16 ---------- */
  const ICO = {
    salud(b) { b.circ(5, 6, 3, C.rojo); b.circ(10, 6, 3, C.rojo); b.poly([2, 7, 14, 7, 8, 14], C.rojo); b.p(4, 5, C.brasa); b.p(5, 4, C.destello); },
    cordura(b) { b.poly([6, 15, 10, 15, 9, 7, 7, 7], C.cal); b.poly([6, 7, 10, 7, 8, 4], C.tierraP); b.line(8, 6, 2, 1, C.maderaO); b.line(8, 6, 14, 1, C.maderaO); b.line(8, 6, 2, 11, C.maderaO); b.line(8, 6, 14, 11, C.maderaO); b.r(7, 12, 2, 3, C.maderaO); },
    honor(b) { b.poly([2, 2, 14, 2, 14, 8, 8, 15, 2, 8], C.anil); b.poly([2, 2, 8, 2, 8, 15, 2, 8], C.rojo); b.r(7, 4, 2, 8, C.oro); b.r(4, 6, 8, 2, C.oro); },
    saciedad(b) { b.ell(8, 9, 6, 4, C.ocre); b.ell(8, 8, 5, 3, C.tierraL); b.line(5, 7, 7, 10, C.tierraS); b.line(8, 6, 10, 9, C.tierraS); b.line(11, 7, 12, 9, C.tierraS); },
    sancho(b) { b.r(1, 8, 14, 2, C.tierraL); b.r(4, 4, 8, 4, C.tierraL); b.hl(4, 11, 7, C.ocre); b.hl(1, 14, 10, C.ocre); },
    reales(b) { b.circ(8, 8, 6, C.oro); b.circ(8, 8, 4, C.tierraL); b.r(7, 5, 2, 6, C.oro); b.p(5, 5, C.destello); },
    gana(b) { b.ell(8, 10, 6, 5, C.madera); b.r(5, 3, 6, 3, C.madera); b.hl(5, 10, 6, C.maderaO); b.r(10, 9, 5, 1, C.oro); b.r(12, 7, 1, 5, C.oro); },
    pierde(b) { b.ell(8, 10, 6, 5, C.madera); b.r(5, 3, 6, 3, C.madera); b.hl(5, 10, 6, C.maderaO); b.r(10, 9, 5, 1, C.rojo); },
    dado(b) { b.r(2, 2, 12, 12, C.lino); b.r(2, 13, 12, 1, C.calS); b.r(13, 2, 1, 12, C.calS); [[5, 5], [10, 5], [7, 8], [5, 11], [10, 11]].forEach(([x, y]) => b.r(x - 1, y - 1, 2, 2, C.pano)); },
    rel(b) { b.circ(5, 6, 3, C.brasa); b.circ(10, 6, 3, C.brasa); b.poly([2, 7, 14, 7, 8, 13], C.brasa); b.line(3, 14, 13, 2, C.oro); },
    dulcinea(b) { b.circ(8, 6, 4, C.rojo); b.circ(7, 5, 2, C.rojoO); b.line(8, 10, 8, 15, C.olivo); b.p(9, 12, C.olivo); b.p(10, 11, C.olivo); },
    nada(b) { b.hl(4, 11, 8, C.calS); },
    infeccion(b) { b.circ(8, 8, 5, C.olivo); b.circ(8, 8, 2, C.encina); b.p(3, 3, C.olivo); b.p(13, 13, C.olivo); },
    cura(b) { b.r(6, 2, 4, 12, C.lino); b.r(2, 6, 12, 4, C.lino); b.r(7, 3, 2, 10, C.rojo); b.r(3, 7, 10, 2, C.rojo); },
    ruta(b) { b.r(2, 3, 12, 10, C.lino); b.r(6, 3, 1, 10, C.calS); b.r(10, 3, 1, 10, C.calS); b.line(3, 11, 9, 6, C.rojo); b.p(12, 5, C.rojo); },
    jugar(b) { b.line(2, 14, 13, 3, C.madera, 2); b.poly([11, 2, 15, 1, 14, 5], C.hierroL); b.r(2, 12, 3, 3, C.rojo); },
    ajustes(b) { b.circ(8, 8, 6, C.hierro); b.circ(8, 8, 3, C.lino); for (const [x, y] of [[8, 1], [8, 15], [1, 8], [15, 8], [3, 3], [13, 13], [3, 13], [13, 3]]) b.r(x - 1, y - 1, 2, 2, C.hierro); b.circ(8, 8, 1, C.hierro); },
    salida(b) { b.r(4, 2, 9, 13, C.maderaO); b.r(5, 3, 7, 12, C.madera); b.p(10, 9, C.oro); b.r(2, 14, 13, 1, C.tierraS); },
    calavera(b) { b.ell(8, 7, 6, 5, C.lino); b.r(5, 11, 7, 3, C.lino); b.r(5, 6, 2, 2, C.negro); b.r(9, 6, 2, 2, C.negro); b.p(8, 9, C.negro); b.p(6, 13, C.calS); b.p(8, 13, C.calS); b.p(10, 13, C.calS); },
    pantalla(b) { for (const [x, y, dx, dy] of [[2, 2, 1, 1], [13, 2, -1, 1], [2, 13, 1, -1], [13, 13, -1, -1]]) { b.r(x - (dx < 0 ? 3 : 0), y, 4, 1, C.lino); b.r(x, y - (dy < 0 ? 3 : 0), 1, 4, C.lino); } b.r(5, 5, 6, 6, C.anil); b.r(6, 6, 4, 2, C.cieloM); },
    continuar(b) { b.r(3, 3, 10, 10, C.lino); b.r(3, 3, 3, 10, C.rojo); b.r(7, 6, 5, 1, C.calS); b.r(7, 9, 4, 1, C.calS); },
    libro(b) { b.r(2, 3, 12, 10, C.rojoO); b.r(3, 4, 5, 8, C.lino); b.r(8, 4, 5, 8, C.lino); b.r(8, 3, 1, 10, C.maderaO); }
  };
  const URL = {};
  function icono(k, escala) {
    const key = k + '|' + (escala || 1);
    if (URL[key]) return URL[key];
    const b = new B(16, 16); (ICO[k] || ICO.nada)(b); b.outline(C.negro);
    const cv = b.canvas('mediodia');
    URL[key] = cv.toDataURL(); return URL[key];
  }
  V.icono = icono; V.vineta = (t, b) => vineta(t, b);

  /* ---------- marco barroco (9 piezas) y papel ---------- */
  function marco() {
    const b = new B(24, 24);
    b.r(0, 0, 24, 24, C.maderaO); b.r(1, 1, 22, 22, C.oro); b.r(2, 2, 20, 20, C.madera); b.r(3, 3, 18, 18, C.lino);
    for (const [x, y] of [[1, 1], [20, 1], [1, 20], [20, 20]]) { b.r(x, y, 3, 3, C.oro); b.p(x + 1, y + 1, C.destello); }
    for (const [x, y, dx, dy] of [[4, 4, 1, 1], [19, 4, -1, 1], [4, 19, 1, -1], [19, 19, -1, -1]]) { b.p(x, y, C.oro); b.p(x + dx, y, C.oro); b.p(x, y + dy, C.oro); b.p(x + 2 * dx, y + dy, C.tierraS); b.p(x + dx, y + 2 * dy, C.tierraS); }
    for (let i = 8; i < 16; i += 2) { b.p(i, 1, C.tierraL); b.p(i, 22, C.tierraL); b.p(1, i, C.tierraL); b.p(22, i, C.tierraL); }
    return b.canvas('mediodia').toDataURL();
  }
  function marcoRojo() {
    const b = new B(24, 24);
    b.r(0, 0, 24, 24, C.rojoO); b.r(1, 1, 22, 22, C.oro); b.r(2, 2, 20, 20, C.rojoO); b.r(3, 3, 18, 18, C.rojo);
    for (const [x, y] of [[1, 1], [20, 1], [1, 20], [20, 20]]) { b.r(x, y, 3, 3, C.oro); b.p(x + 1, y + 1, C.destello); }
    return b.canvas('mediodia').toDataURL();
  }
  function papel() {
    const b = new B(32, 32), r = V.rng(9); b.r(0, 0, 32, 32, C.lino);
    for (let i = 0; i < 40; i++) b.p(r() * 32 | 0, r() * 32 | 0, r() < 0.7 ? C.cal : C.calS);
    return b.canvas('mediodia').toDataURL();
  }
  function hojaEstilo() {
    const css = [`:root{--px-marco:url(${marco()});--px-marco-rojo:url(${marcoRojo()});--px-papel:url(${papel()})}`];
    for (const k in ICO) css.push(`.pxi-${k}{background-image:url(${icono(k)})}`);
    const st = document.createElement('style'); st.id = 'vis-iconos'; st.textContent = css.join('\n'); document.head.appendChild(st);
  }

  /* ---------- panel de estadísticas ---------- */
  const STK = { health: 'salud', sanity: 'cordura', honor: 'honor', hunger: 'saciedad', loyalty: 'sancho' };
  let prev = null;
  function valor(k) { return k === 'hunger' ? 100 - state.hunger : state[k]; }
  function panel() {
    const izq = document.querySelector('aside.left'); if (!izq) return;
    izq.classList.add('pergamino');
    for (const k in STK) {
      const m = document.getElementById('m_' + k); if (!m) continue;
      const head = m.querySelector('.meter-head span:first-child');
      if (head && !head.querySelector('.pxi')) head.insertAdjacentHTML('afterbegin', `<i class="pxi pxi-${STK[k]}" aria-hidden="true"></i>`);
      const tr = m.querySelector('.track'), fill = document.getElementById(k + 'Bar');
      if (tr && !tr.querySelector('.ghost')) tr.insertAdjacentHTML('afterbegin', '<div class="ghost" aria-hidden="true"></div>');
      const g = tr && tr.querySelector('.ghost'), v = valor(k);
      if (prev && prev[k] !== undefined && prev[k] !== v) {
        const d = v - prev[k];
        // estela: al bajar, queda la marca del valor anterior y se consume despacio
        if (g) { g.style.transition = 'none'; g.style.width = Math.max(prev[k], v) + '%'; g.className = 'ghost ' + (d < 0 ? 'baja' : 'sube'); requestAnimationFrame(() => { g.style.transition = ''; setTimeout(() => { g.style.width = v + '%'; }, V.menosMov() ? 0 : 450); }); }
        const num = document.getElementById(k + 'Num');
        if (num) {
          const f = document.createElement('span'); f.className = 'flot ' + (d > 0 ? 'up' : 'down'); f.textContent = (d > 0 ? '+' : '−') + Math.abs(d); f.setAttribute('aria-hidden', 'true');
          num.parentNode.style.position = 'relative'; num.parentNode.appendChild(f); setTimeout(() => f.remove(), 1800);
          m.classList.remove('pulso-up', 'pulso-down'); requestAnimationFrame(() => m.classList.add(d > 0 ? 'pulso-up' : 'pulso-down'));
        }
      } else if (g) g.style.width = v + '%';
      if (fill) fill.setAttribute('data-v', v);
    }
    prev = {}; for (const k in STK) prev[k] = valor(k);
  }

  /* ---------- opciones ilustradas ---------- */
  function temaDe(c) {
    if (c[2]) return { CORDURA: 'cordura', HONOR: 'honor', SACIEDAD: 'saciedad' }[c[2]] || 'dado';
    const e = c[3] || {}; let best = null, bv = 0;
    for (const k of ['health', 'sanity', 'honor', 'hunger', 'loyalty']) if (e[k] && Math.abs(e[k]) > bv) { bv = Math.abs(e[k]); best = STK[k]; }
    if ((e.items || []).length && bv < 6) return 'gana';
    if (e.coins && Math.abs(e.coins) >= bv) return 'reales';
    return best || 'libro';
  }
  const TONOF = { salud: 20, cordura: 24, honor: 23, saciedad: 10, sancho: 14, reales: 23, gana: 18, dado: 30, libro: 21 };
  function vineta(tema, buena) {
    const key = 'vin|' + tema + '|' + buena;
    if (URL[key]) return URL[key];
    const b = new B(28, 28), fondo = TONOF[tema] || 18;
    b.circ(14, 14, 13, C.maderaO); b.circ(14, 14, 12, C.oro); b.circ(14, 14, 10, fondo);
    b.dith(4, 4, 20, 20, 255, C.negro, (x, y) => Math.hypot(x - 11, y - 10) / 26);
    const i = new B(16, 16); (ICO[tema] || ICO.libro)(i); i.outline(C.negro); b.blit(i, 6, 6);
    if (buena !== undefined) b.p(22, 5, buena ? C.oro : C.rojo);
    URL[key] = b.canvas('mediodia').toDataURL(); return URL[key];
  }
  function ilustracion(scene, i) {
    const c = scenes[scene] && scenes[scene].choices[i]; if (!c) return '';
    const t = temaDe(c);
    return `<span class="choice-art px" aria-hidden="true"><img src="${vineta(t)}" alt="" width="56" height="56"></span>`;
  }
  // chips de consecuencias con icono (el texto se conserva tal cual)
  function iconoChip(txt) {
    const s = txt.trim();
    if (/^Salud/i.test(s)) return 'salud'; if (/^Cordura/i.test(s)) return 'cordura'; if (/^Honor/i.test(s)) return 'honor';
    if (/^Saciedad/i.test(s)) return 'saciedad'; if (/^Sancho/i.test(s)) return 'sancho'; if (/^Reales|reales/i.test(s)) return 'reales';
    if (/^＋/.test(s)) return 'gana'; if (/^−|^-/.test(s)) return 'pierde'; if (/Dulcinea/i.test(s)) return 'dulcinea';
    if (/infec/i.test(s)) return 'infeccion'; if (/Cura/i.test(s)) return 'cura'; if (/sin cambio/i.test(s)) return 'nada';
    return 'rel';
  }
  function chips(root) {
    root.querySelectorAll('.effect:not(.pxd)').forEach(e => { e.classList.add('pxd'); e.insertAdjacentHTML('afterbegin', `<i class="pxi pxi-${iconoChip(e.textContent)}" aria-hidden="true"></i>`); });
    root.querySelectorAll('.effect-roll:not(.pxd)').forEach(e => { e.classList.add('pxd'); e.innerHTML = e.innerHTML.replace('🎲', '<i class="pxi pxi-dado" aria-hidden="true"></i>'); });
    root.querySelectorAll('.check:not(.pxd)').forEach(e => { e.classList.add('pxd'); e.innerHTML = e.innerHTML.replace('◉', '<i class="pxi pxi-dado" aria-hidden="true"></i>'); });
  }
  function opciones() {
    const sc = document.getElementById('scene'); if (!sc) return;
    sc.querySelectorAll('.choice').forEach((b, i) => { b.classList.add('px-op'); const n = b.querySelector('.num'); if (n) n.setAttribute('aria-hidden', 'true'); });
    chips(sc);
  }

  /* ---------- mapa, alforjas y perfil con el mismo lenguaje ---------- */
  const RIB = { perfil: 'honor', alforjas: 'gana', logros: 'reales', diario: 'libro', ruta: 'ruta', fuentes: 'continuar', ajustes: 'ajustes' };
  function cintas() {
    document.querySelectorAll('#bkRibbons .rib').forEach(r => {
      if (r.querySelector('.pxi')) return;
      const k = Object.keys(RIB).find(x => (r.getAttribute('onclick') || '').includes("'" + x + "'"));
      if (k) r.insertAdjacentHTML('afterbegin', `<i class="pxi pxi-${RIB[k]}" aria-hidden="true"></i>`);
    });
  }
  function libro() {
    const pg = document.getElementById('bkPage'); if (!pg) return;
    pg.querySelectorAll('.chapter:not(.pxd)').forEach(h => {
      h.classList.add('pxd');
      const t = h.textContent.toLowerCase();
      const k = /ruta|mapa/.test(t) ? 'ruta' : /bolsa|alforja|inventario|comprar|vender/.test(t) ? 'gana' : /logro|t[ií]tulo|bestiario/.test(t) ? 'honor' : /relaci/.test(t) ? 'rel' : /estado|diario/.test(t) ? 'salud' : 'libro';
      h.insertAdjacentHTML('afterbegin', `<i class="pxi pxi-${k}" aria-hidden="true"></i>`);
    });
    chips(pg);
  }

  V.instalarUI = function () {
    hojaEstilo();
    window.illustration = ilustracion;
    const _db = window.drawBook; if (_db) window.drawBook = function () { const r = _db.apply(this, arguments); try { libro(); cintas(); } catch (e) { } return r; };
    const _om = window.openMkt; if (_om) window.openMkt = function () { const r = _om.apply(this, arguments); try { chips(document.getElementById('mktModal')); } catch (e) { } return r; };
    // el mapa lateral (SVG con filtros caros) solo se reconstruye si cambia la ruta o el contador
    const _rm = window.renderMap; let kMapa = '';
    if (_rm) window.renderMap = function () {
      const f = state.flags || {}, k = (state.trail || []).join(',') + '|' + loc(state.scene) + '|' + (f.dul || 0) + '|' + (f.des || 0) + '|' + state.mode;
      if (k === kMapa && document.querySelector('#mapbox .mapwrap')) return;
      kMapa = k; return _rm.apply(this, arguments);
    };
    const _t = V.trasRender;
    V.trasRender = function () { _t.apply(this, arguments); panel(); opciones(); };
  };
})(VIS);
