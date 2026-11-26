/* ===== VIS · el juego como libro abierto: página izquierda (estado y escena) y derecha (texto y decisiones) ===== */
(function (V) {
  'use strict';
  let libro, izq, der, cuerpoDer, hojaPend = null, claveAnt = '', pestana = 'alforjas';

  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };
  const ico = k => `<i class="pxi pxi-${k}" aria-hidden="true"></i>`;

  function construir() {
    const app = document.querySelector('.app'); if (!app) return false;
    const aL = app.querySelector('aside.left'), aR = app.querySelector('aside.right'), main = app.querySelector('main');
    libro = el('div', 'libro-juego'); libro.setAttribute('role', 'main');
    // ---- página izquierda ----
    izq = el('section', 'lj-pag izq'); izq.setAttribute('aria-label', 'Estado del hidalgo y escena');
    const sup = el('div', 'lj-izq-sup lj-hojita');
    sup.appendChild(el('header', 'lj-cab', `<span>Relación de sucesos</span><b>El ingenioso hidalgo</b>`));
    const stats = el('div', 'lj-stats'); aL.querySelectorAll('.meter').forEach(m => stats.appendChild(m));
    sup.appendChild(stats);
    const cond = aL.querySelector('#cond'); if (cond) sup.appendChild(cond);
    const voces = el('div', 'lj-voces'); aL.querySelectorAll(':scope > .item').forEach(i => voces.appendChild(i)); sup.appendChild(voces);
    const esc = el('div', 'lj-escena'); esc.id = 'lj-escena'; sup.appendChild(esc);
    izq.appendChild(sup);
    const inf = el('div', 'lj-izq-inf lj-hojita');
    const tabs = [['alforjas', 'gana', 'Alforjas'], ['ruta', 'ruta', 'Ruta'], ['cuaderno', 'libro', 'Cuaderno'], ['compania', 'sancho', 'Compañía']];
    const barra = el('div', 'lj-tabs'); barra.setAttribute('role', 'tablist');
    tabs.forEach(([k, i, n]) => { const b = el('button', 'lj-tab', ico(i) + n); b.type = 'button'; b.dataset.k = k; b.setAttribute('role', 'tab'); b.onclick = () => abrirPestana(k); barra.appendChild(b); });
    inf.appendChild(barra);
    const paneles = el('div', 'lj-paneles');
    const P = (k, nodos) => { const d = el('div', 'lj-panel'); d.dataset.k = k; d.setAttribute('role', 'tabpanel'); nodos.forEach(n => n && d.appendChild(n)); paneles.appendChild(d); };
    P('alforjas', [aR.querySelector('#inventory')]);
    P('ruta', [aR.querySelector('#mapbox')]);
    P('cuaderno', [aR.querySelector('#journal')]);
    const comp = [...aR.querySelectorAll('.item')]; P('compania', comp.length ? comp : [el('p', 'stat-note', 'Sin compañía.')]);
    inf.appendChild(paneles);
    inf.appendChild(el('div', 'lj-folio izq', ''));
    izq.appendChild(inf);
    // ---- página derecha ----
    der = el('section', 'lj-pag der'); der.setAttribute('aria-label', 'Relato y decisiones');
    const mast = main.querySelector('.mast'); mast.classList.add('lj-cab'); der.appendChild(mast);
    cuerpoDer = el('div', 'lj-cuerpo'); cuerpoDer.appendChild(main.querySelector('#scene')); der.appendChild(cuerpoDer);
    der.appendChild(el('div', 'lj-folio der', ''));
    der.appendChild(el('div', 'lj-cinta', ''));
    libro.appendChild(izq); libro.appendChild(el('div', 'lj-lomo')); libro.appendChild(der);
    app.parentNode.insertBefore(libro, app);
    ['pluma', 'tintero'].forEach(k => { const o = el('div', 'mesa-obj ' + k, ''); o.setAttribute('aria-hidden', 'true'); document.body.appendChild(o); });
    document.body.classList.add('modo-libro');
    abrirPestana(pestana);
    return true;
  }
  function abrirPestana(k) {
    pestana = k;
    libro.querySelectorAll('.lj-tab').forEach(b => { const on = b.dataset.k === k; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    libro.querySelectorAll('.lj-panel').forEach(p => { p.hidden = p.dataset.k !== k; });
  }

  /* ---------- la hoja que se pasa ---------- */
  // La hoja que gira es ligera: papel con el título y el comienzo del texto anterior, no una copia
  // de toda la página. Así arranca al instante en cualquier dispositivo y nunca deja la página
  // anterior tapando la nueva.
  const esc = t => String(t || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
  function capturar() {
    if (!der || V.menosMov()) return;
    const sc = document.getElementById('scene'); if (!sc) return;
    const q = s => { const e = sc.querySelector(s); return e ? e.textContent.trim() : ''; };
    const ps = [...sc.querySelectorAll('.narration > p')].map(p => p.textContent.trim()).filter(Boolean);
    hojaPend = { lugar: q('.eyebrow'), titulo: q('.title'), texto: ps.slice(0, 2) };
  }
  V.DUR_HOJA = 950;
  function pasarPagina() {
    libro.querySelectorAll('.hoja').forEach(x => x.remove()); // si se decide muy deprisa, la hoja anterior se va ya
    const h = hojaPend; hojaPend = null; if (!h) return;
    const hoja = el('div', 'hoja');
    const cara = el('div', 'cara', `<div class="h-lugar">${esc(h.lugar)}</div><div class="h-titulo">${esc(h.titulo)}</div><div class="h-orla">❦</div>${h.texto.map(t => `<p>${esc(t)}</p>`).join('')}`);
    const dorso = el('div', 'dorso', `<div class="dorso-orn">❦</div>`);
    hoja.appendChild(cara); hoja.appendChild(dorso);
    hoja.style.left = der.offsetLeft + 'px'; hoja.style.top = der.offsetTop + 'px';
    hoja.style.width = der.offsetWidth + 'px'; hoja.style.height = der.offsetHeight + 'px';
    libro.appendChild(hoja);
    libro.classList.remove('pasando'); void libro.offsetWidth; libro.classList.add('pasando');
    if (typeof sfx === 'function') try { sfx('page'); } catch (e) { }
    // retirada exacta al acabar el giro, sin depender de animationend
    setTimeout(() => { hoja.remove(); libro.classList.remove('pasando'); }, V.DUR_HOJA + 40);
  }

  V.instalarLibro = function () {
    if (!construir()) return;
    V.modoLibro = true; V.sinIris = true;
    const _ap = window.apply;
    window.apply = function () { try { capturar(); } catch (e) { hojaPend = null; } return _ap.apply(this, arguments); };
    const _rs = window.restart;
    if (_rs) window.restart = function () { try { capturar(); } catch (e) { } return _rs.apply(this, arguments); };
    const _t = V.trasRender;
    V.trasRender = function () {
      const sc = document.getElementById('scene');
      // la escena (lienzo) va a la página izquierda; las voces se quedan en la derecha
      const fig = sc && sc.querySelector('figure.stage');
      _t.apply(this, arguments);
      const slot = document.getElementById('lj-escena');
      if (fig && slot) { slot.querySelectorAll('figure.stage').forEach(f => f !== fig && f.remove()); slot.appendChild(fig); }
      const clave = state.scene + '#' + state.turn + '#' + (state.seed || '');
      if (clave !== claveAnt) {
        if (claveAnt) { cuerpoDer.scrollTop = 0; pasarPagina(); } else hojaPend = null;
        claveAnt = clave;
      } else hojaPend = null;
      const t = state.turn || 0;
      libro.querySelector('.lj-folio.izq').textContent = 'fol. ' + (2 * t + 1);
      libro.querySelector('.lj-folio.der').textContent = 'fol. ' + (2 * t + 2);
    };
  };
})(VIS);
