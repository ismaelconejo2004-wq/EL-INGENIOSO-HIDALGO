/* ===== VIS · diálogo: cajas con retrato, texto letra a letra y enganches con el juego ===== */
(function (V) {
  'use strict';
  const { B, C, cache, TONO } = V;

  /* ---------- retratos (40x40) ---------- */
  const QUIEN = s => {
    s = String(s || '').toUpperCase();
    if (s.startsWith('SANCHO')) return 'sancho';
    if (s.startsWith('LA RAZ')) return 'razon';
    if (s.startsWith('EL CABALLERO')) return 'caballero';
    if (s.startsWith('EL IMPOSTOR')) return 'impostor';
    if (s.startsWith('CLAUDIA')) return 'claudia';
    if (s.startsWith('EL EST')) return 'estomago';
    if (s.startsWith('EL CUERPO')) return 'cuerpo';
    return 'narrador';
  };
  V.QUIEN = QUIEN;
  const PELO = { negro: 29, pardo: 19, gris: 17, oro: 23, blanco: 30 };
  function busto(id, f) {
    const b = new B(40, 40), s = V.spec(id), J = TONO[s.jubon] || TONO.pardo, pelo = PELO[s.pelo] || 19;
    const piel = s.tinta ? [30, 17] : [C.piel, C.pielS];
    // hombros
    b.poly([2, 40, 38, 40, 34, 31, 24, 28, 14, 28, 6, 31], J[0]); b.poly([2, 40, 12, 40, 12, 29, 6, 31], J[1]);
    if ((s.extra || '').includes('armadura')) { b.poly([4, 40, 36, 40, 33, 31, 7, 31], C.hierro); b.r(18, 31, 4, 9, C.hierroL); }
    if ((s.extra || '').includes('gola') || s.id === 'dq') b.r(13, 27, 14, 2, C.lino);
    // cuello y cara (tres cuartos, mirando a la derecha)
    b.r(17, 23, 7, 6, piel[1]);
    b.ell(21, 16, 8, 10, piel[0]); b.ell(16, 17, 3, 8, piel[1]);
    b.p(29, 17, piel[0]); b.p(30, 18, piel[0]); b.p(29, 19, piel[1]); // nariz
    b.r(24, 14, 2, 1, C.pano); b.r(19, 14, 2, 1, C.pano); // ojos
    if (f === 2) { b.r(24, 14, 2, 1, piel[1]); b.r(19, 14, 2, 1, piel[1]); } // parpadeo
    b.hl(18, 21, 12, pelo); b.hl(23, 26, 12, pelo); // cejas
    b.r(22, 22, 4, 1, C.rojoO); if (f === 1) b.r(22, 22, 4, 2, C.rojoO), b.p(23, 23, C.negro);
    // pelo
    b.ell(18, 8, 8, 4, pelo); b.r(12, 8, 4, 12, pelo);
    if (s.cuerpo === 'mujer' && !['toca', 'tocas', 'velo'].includes(s.tocado)) { b.r(10, 8, 5, 22, pelo); b.ell(20, 7, 9, 4, pelo); }
    const br = s.barba;
    if (br === 'corta') { b.poly([14, 20, 29, 20, 27, 27, 17, 28], pelo); b.r(22, 22, 4, 1, C.rojoO); }
    else if (br === 'larga') { b.poly([14, 20, 29, 20, 26, 33, 18, 33], pelo); b.r(22, 22, 4, 1, C.rojoO); }
    else if (br === 'blanca') { b.poly([14, 20, 29, 20, 26, 36, 18, 36], C.lino); }
    else if (br === 'perilla') { b.hl(20, 28, 21, pelo); b.poly([21, 24, 26, 24, 24, 31], pelo); }
    else if (br === 'bigote') b.hl(20, 28, 21, pelo);
    // tocado
    const t = s.tocado;
    if (t === 'celada') { b.poly([10, 12, 32, 12, 30, 2, 14, 0, 10, 4], C.hierro); b.r(16, 2, 10, 2, C.hierroL); b.r(10, 12, 3, 14, C.hierro); b.line(14, 1, 8, -6, C.rojo, 2); }
    else if (t === 'bacia') { b.r(9, 5, 25, 3, C.oro); b.ell(21, 4, 8, 4, C.oro); b.r(18, 2, 3, 2, C.destello); }
    else if (t === 'paja') { b.r(5, 6, 32, 3, C.tierraL); b.ell(20, 4, 9, 4, C.tierraL); b.hl(12, 28, 6, C.ocre); }
    else if (t === 'chambergo') { b.r(5, 6, 32, 3, C.pano); b.ell(20, 3, 9, 4, C.pano); }
    else if (t === 'gorro') { b.ell(18, 6, 10, 4, C.lino); b.line(10, 6, 6, 14, C.lino, 2); }
    else if (t === 'toca' || t === 'tocas' || t === 'velo') { b.ell(19, 7, 11, 5, C.lino); b.r(8, 7, 5, 24, C.lino); }
    else if (t === 'gorra' || t === 'bonete') b.ell(19, 6, 10, 4, C.pano);
    else if (t === 'yelmo') { b.ell(21, 13, 11, 14, C.hierro); b.r(18, 14, 14, 2, C.pano); }
    return b.outline(C.negro);
  }
  function alegoria(k, f) {
    const b = new B(40, 40);
    if (k === 'razon') {
      // dama de perfil en grisalla azul, con compás y lámpara
      b.poly([4, 40, 34, 40, 30, 30, 20, 27, 10, 30], C.cieloM); b.poly([4, 40, 14, 40, 14, 30, 10, 30], C.anil);
      b.ell(21, 16, 7, 9, C.cieloH); b.ell(17, 17, 3, 7, C.cieloM); b.p(28, 17, C.cieloH); b.p(25, 14, C.anil);
      b.ell(18, 9, 9, 5, C.anil); b.r(10, 9, 5, 18, C.anil); b.r(14, 6, 12, 2, C.nube); // tocado y diadema
      b.line(30, 38, 34, 26, C.hierroL); b.line(34, 26, 37, 38, C.hierroL); b.p(34, 25, C.destello); // compás
      b.r(4, 22, 4, 3, C.oro); b.p(5, 20, f === 1 ? C.destello : C.oro); b.p(6, 19, C.brasa); // lámpara
      if (f === 1) b.r(22, 22, 3, 1, C.anil); else b.r(22, 22, 3, 1, C.cieloM);
    } else if (k === 'caballero') {
      // yelmo cerrado con penacho y fuego tras la visera
      b.poly([2, 40, 38, 40, 34, 30, 6, 30], C.oro); b.poly([2, 40, 10, 40, 10, 31, 6, 30], C.tierraS);
      b.ell(20, 17, 11, 13, C.hierro); b.ell(17, 15, 6, 9, C.hierroL); b.ell(25, 18, 5, 10, C.hierro);
      b.r(10, 15, 22, 3, C.negro); b.r(12, 16, 18, 1, f === 1 ? C.destello : C.brasa); b.p(20, 16, C.oro);
      for (let i = 0; i < 5; i++) b.p(14 + i * 3, 22, C.negro);
      b.line(20, 4, 10, -4, C.rojo, 3); b.line(22, 4, 16, -6, C.brasa, 2);
      b.r(16, 30, 8, 3, C.oro);
    } else if (k === 'estomago') {
      b.ell(20, 28, 14, 8, C.pano); b.r(6, 20, 28, 8, C.pano); b.hl(6, 34, 20, C.hierro); b.ell(20, 20, 13, 2, C.negro);
      b.r(3, 19, 4, 2, C.pano); b.r(33, 19, 4, 2, C.pano); if (f === 1) b.p(20, 12, C.nube);
    } else if (k === 'cuerpo') {
      b.ell(15, 17, 8, 8, C.rojo); b.ell(25, 17, 8, 8, C.rojo); b.poly([7, 19, 33, 19, 20, 34], C.rojo); b.ell(14, 14, 3, 3, C.brasa);
      b.line(8, 26, 32, 12, C.lino, 3); b.line(8, 12, 30, 28, C.lino, 2); if (f === 1) b.r(18, 20, 4, 1, C.rojoO);
    }
    return b.outline(C.negro);
  }
  function retrato(k, f) {
    return cache('ret|' + k + '|' + f, () => {
      let b;
      if (['razon', 'caballero', 'estomago', 'cuerpo'].includes(k)) b = alegoria(k, f);
      else b = busto(k === 'impostor' ? 'impostor' : k, f);
      return b.canvas('mediodia');
    });
  }
  V.retrato = retrato;

  /* ---------- texto letra a letra ---------- */
  const D = V.dialogo = { cola: [], activo: false, clave: '' };
  function cps() { return 62; }
  function preparar(el) {
    const nodos = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentNode.closest('.speaker') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    while (w.nextNode()) nodos.push(w.currentNode);
    const partes = [];
    for (const n of nodos) {
      const txt = n.nodeValue; if (!txt) continue;
      const v = document.createElement('span'), h = document.createElement('span');
      v.className = 'tw-v'; h.className = 'tw-h'; h.textContent = txt;
      n.parentNode.replaceChild(h, n); h.parentNode.insertBefore(v, h);
      partes.push({ v, h, txt, n: 0 });
    }
    return partes;
  }
  function empezar(objetivos, clave) {
    terminar(true);
    D.clave = clave; D.cola = [];
    for (const o of objetivos) { const p = preparar(o.el); if (p.length) D.cola.push({ el: o.el, partes: p, quien: o.quien, ret: o.ret }); }
    D.t = performance.now(); D.pausa = 0; D.activo = D.cola.length > 0; D.i = 0;
    D.cola.forEach(c => c.el.classList.add('tw-espera'));
    if (D.cola[0]) D.cola[0].el.classList.remove('tw-espera');
    V.pedir();
  }
  function paso(now) {
    if (!D.activo) return;
    const c = D.cola[D.i]; if (!c) { terminar(); return; }
    if (now < D.pausa) return;
    // como mucho ~16 cambios de DOM por segundo: cada cambio obliga a recolocar el párrafo
    if (now - (D.ult || 0) < 60) return; D.ult = now;
    const lleva = Math.floor((now - D.t) / 1000 * cps());
    let restante = lleva, hecho = true, ultimo = '';
    for (const p of c.partes) {
      if (restante <= 0) { hecho = false; break; }
      const n = Math.min(p.txt.length, restante);
      if (n !== p.n) { p.n = n; p.v.textContent = p.txt.slice(0, n); p.h.textContent = p.txt.slice(n); ultimo = p.txt[n - 1]; }
      restante -= p.txt.length; if (n < p.txt.length) { hecho = false; break; }
    }
    if (c.quien) V.habla(c.quien);
    if (c.ret) { const f = hecho ? (Math.floor(now / 2600) % 7 === 0 ? 2 : 0) : (Math.floor(now / 120) & 1); dibRet(c.ret, f); }
    if (ultimo && /[.;:!?…]/.test(ultimo)) { D.pausa = now + 220; D.t += 220; } else if (ultimo === ',') { D.pausa = now + 90; D.t += 90; }
    if (hecho) {
      D.i++; D.t = now + 250; D.pausa = now + 250; V.habla(null);
      if (D.cola[D.i]) D.cola[D.i].el.classList.remove('tw-espera'); else terminar();
    }
  }
  function terminar(silencio) {
    for (const c of D.cola) {
      c.el.classList.remove('tw-espera');
      for (const p of c.partes) { p.v.textContent = p.txt; p.h.textContent = ''; }
      if (c.ret) dibRet(c.ret, 0);
    }
    D.activo = false; D.cola = []; if (!silencio) V.habla(null);
    document.querySelectorAll('#scene .tw-pendiente').forEach(e => e.classList.remove('tw-pendiente'));
  }
  D.paso = paso; D.saltar = () => { if (D.activo) terminar(); }; D.activoYa = () => D.activo;
  function dibRet(r, f) {
    const cv = r.cv, k = r.k; if (!cv) return; const c = retrato(k, f); const x = cv.getContext('2d'); if (!x) return;
    if (r.f === f) return; r.f = f; x.imageSmoothingEnabled = false; x.clearRect(0, 0, 40, 40); x.drawImage(c, 0, 0);
  }

  /* ---------- enganches con el juego ---------- */
  let prev = null, eraPrev = '', ultimaClave = '';
  function statsDe() { return { health: state.health, sanity: state.sanity, honor: state.honor, hunger: 100 - state.hunger, loyalty: state.loyalty }; }
  const NOMBRE = { health: 'SALUD', sanity: 'CORDURA', honor: 'HONOR', hunger: 'SACIEDAD', loyalty: 'SANCHO' };

  V.trasRender = function () {
    const sc = document.getElementById('scene'); if (!sc) return;
    const fig = sc.querySelector('figure.stage'); if (!fig) return;
    const nar = sc.querySelector('.narration');
    // marco: escenario + cajas de voz
    const marco = document.createElement('div'); marco.className = 'marco';
    fig.parentNode.insertBefore(marco, fig); marco.appendChild(fig);
    const dlg = document.createElement('div'); dlg.className = 'dlg'; marco.appendChild(dlg);
    const voces = nar ? [...nar.querySelectorAll(':scope > .voice')] : [];
    const objetivos = [];
    const bridge = sc.querySelector('.bridge'); if (bridge) objetivos.push({ el: bridge });
    if (nar) nar.querySelectorAll(':scope > p').forEach(p => objetivos.push({ el: p }));
    for (const v of voces) {
      const sp = v.querySelector('.speaker'), k = QUIEN(sp && sp.textContent);
      v.classList.add('v-' + k); dlg.appendChild(v);
      let ret = null;
      if (k !== 'narrador') {
        const c = document.createElement('canvas'); c.width = 40; c.height = 40; c.className = 'retrato'; c.setAttribute('aria-hidden', 'true');
        v.insertBefore(c, v.firstChild); ret = { cv: c, k, f: -1 }; dibRet(ret, 0);
      }
      const habla = k === 'sancho' ? 'sancho' : (k === 'impostor' || k === 'claudia') ? 'npc' : null;
      objetivos.push({ el: v, quien: habla, ret });
    }
    // escena
    V.colocarEn(fig);
    const era = (document.getElementById('era') || {}).textContent || '';
    const eraBase = era.split(' · Modo')[0];
    const cambioParte = eraPrev && eraBase !== eraPrev && !state.scene.startsWith('ev_');
    const clave = state.scene + '#' + state.turn + '#' + (state.seed || '');
    const nueva = clave !== ultimaClave;
    V.cambiar(state.scene, { pagina: cambioParte });
    eraPrev = eraBase;
    // texto letra a letra solo al llegar a una escena nueva
    if (nueva && !V.menosMov() && CFG.tw !== 0 && !CFG.fast) empezar(objetivos, clave);
    else { terminar(true); objetivos.forEach(o => o.ret && dibRet(o.ret, 0)); }
    ultimaClave = clave;
    // números flotantes
    const ahora = statsDe();
    if (prev && nueva) for (const k in ahora) { const d = ahora[k] - prev[k]; if (d) setTimeout(() => V.flotar(NOMBRE[k] + ' ' + (d > 0 ? '+' : '−') + Math.abs(d), d > 0), 500 + Object.keys(ahora).indexOf(k) * 180); }
    prev = ahora;
  };

  V.instalar = function () {
    if (!V.soportado()) return false;
    document.documentElement.classList.add('vis-on');
    if (typeof CFG !== 'undefined' && CFG.tw === undefined) CFG.tw = 1;
    // el escenario antiguo se sustituye por el lienzo
    window.stageHTML = function () {
      const st = stOf(state.scene), cap = (state.scene === 'end' && state.fin === 'amor') ? stOf('amor').cap : st.cap;
      return `<figure class="stage vis" role="img" aria-label="${esc(cap)}"><figcaption>${esc(cap)}</figcaption></figure>`;
    };
    const _r = window.render;
    window.render = function () { const r = _r.apply(this, arguments); try { V.trasRender(); } catch (e) { console.error('VIS', e); } return r; };
    const _ch = window.choose;
    window.choose = function (i) {
      D.saltar();
      const r = _ch.apply(this, arguments);
      if (!V.modoLibro && window.pending && document.getElementById('modal').classList.contains('show')) {
        const m = document.querySelector('#scene .marco'); if (m && m.scrollIntoView) m.scrollIntoView({ block: 'start', behavior: V.menosMov() ? 'auto' : 'smooth' });
      }
      return r;
    };
    const _sd = window.setDie;
    window.setDie = function (id, face, rolling) {
      _sd.apply(this, arguments);
      if (id === 'dieTwo' && !rolling && window.pending) {
        const a = +((document.getElementById('dieOne').className.match(/face-(\d)/) || [])[1] || 1);
        const m = (document.getElementById('rollText').textContent || '').match(/(\d+) o más/);
        V.tirarDados(a, face, window.pending.success, m ? +m[1] : '?');
      }
    };
    const _cr = window.closeRoll;
    window.closeRoll = function () { const r = _cr.apply(this, arguments); V.limpiarDados(); return r; };
    // ajustes: interruptor del texto letra a letra
    if (typeof cfgHTML === 'function') {
      const _cfg = window.cfgHTML;
      window.cfgHTML = function () {
        return _cfg.apply(this, arguments) + `<div class='crow'><span>Texto letra a letra</span><span><button class='tg${CFG.tw !== 0 ? ' on' : ''}' onclick="setC('tw',${CFG.tw !== 0 ? 0 : 1})">${CFG.tw !== 0 ? 'Sí' : 'No'}</button></span></div>`;
      };
    }
    // teclado: Espacio o Intro completan el texto
    addEventListener('keydown', ev => {
      if (!D.activo || (typeof MENUON === 'function' && MENUON())) return;
      if (document.querySelector('.modal.show')) return;
      if ((ev.key === ' ' || ev.key === 'Enter') && !/INPUT|TEXTAREA|BUTTON/.test((ev.target || {}).tagName || '')) { ev.preventDefault(); D.saltar(); }
    }, true);
    document.addEventListener('click', ev => { if (D.activo && ev.target.closest && ev.target.closest('#scene .narration, #scene .dlg, #scene .bridge')) D.saltar(); });
    V.ganchos.push({ activo: () => D.activo, paso });
    // al volver del menú, retomar el bucle
    const _mc = window.mContinue; if (_mc) window.mContinue = function () { const r = _mc.apply(this, arguments); V.pedir(); return r; };
    const _ie = window.introEnd; if (_ie) window.introEnd = function () { const r = _ie.apply(this, arguments); V.pedir(); return r; };
    const _cb = window.closeBook; if (_cb) window.closeBook = function () { const r = _cb.apply(this, arguments); V.pedir(); return r; };
    if (V.instalarUI) V.instalarUI();
    if (V.instalarLibro) V.instalarLibro();
    if (V.instalarMenu) V.instalarMenu();
    window.render();
    return true;
  };
})(VIS);
