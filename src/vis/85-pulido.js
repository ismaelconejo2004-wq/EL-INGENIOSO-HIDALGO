/* ===== VIS · pulido: presentación de la narrativa y de las mecánicas (sin cambiar textos ni reglas) ===== */
(function (V) {
  'use strict';
  const NOM = { salud: 'health', cordura: 'sanity', honor: 'honor', saciedad: 'hunger', sancho: 'loyalty' };
  // probabilidad de sacar n o más con dos dados de seis caras
  function prob(n) { let c = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b >= n) c++; return Math.round(c / 36 * 100); }
  V.prob2d6 = prob;

  function valor(k) { return k === 'hunger' ? 100 - state.hunger : state[k]; }
  // efectos visibles de una opción, leídos de sus propias etiquetas (lo mismo que ve el jugador)
  function efectos(btn) {
    const row = btn.querySelector('.effect-row'), base = row || btn.querySelector('.effects');
    const out = {}; if (!base) return out;
    base.querySelectorAll('.effect').forEach(e => {
      const m = e.textContent.trim().match(/^(Salud|Cordura|Honor|Saciedad|Sancho)\s*([+−-])\s*(\d+)/i);
      if (m) out[NOM[m[1].toLowerCase()]] = (m[2] === '+' ? 1 : -1) * +m[3];
    });
    return { d: out, tirada: !!row };
  }
  function mostrar(btn) {
    const { d, tirada } = efectos(btn);
    for (const k in NOM) {
      const id = NOM[k], tr = document.querySelector('#m_' + id + ' .track'); if (!tr) continue;
      let pv = tr.querySelector('.prev'); if (!pv) { pv = document.createElement('div'); pv.className = 'prev'; pv.setAttribute('aria-hidden', 'true'); tr.appendChild(pv); }
      const dv = d[id]; if (!dv) { pv.style.display = 'none'; continue; }
      const v = valor(id), a = Math.max(0, Math.min(100, v + dv));
      pv.style.display = 'block'; pv.style.left = Math.min(v, a) + '%'; pv.style.width = Math.abs(a - v) + '%';
      pv.className = 'prev ' + (dv > 0 ? 'sube' : 'baja') + (tirada ? ' tirada' : '');
    }
  }
  function ocultar() { document.querySelectorAll('.track .prev').forEach(p => { p.style.display = 'none'; }); }

  function narrativa(sc) {
    const nar = sc.querySelector('.narration');
    const p = nar && nar.querySelector(':scope > p'); if (p) p.classList.add('capitular');
    const r = sc.querySelector('.rule'); if (r && !r.classList.contains('orla')) { r.classList.add('orla'); r.innerHTML = '<span>❦</span>'; }
    const br = sc.querySelector('.bridge'); if (br) br.classList.add('nota-margen');
  }
  function mecanicas(sc) {
    sc.querySelectorAll('.effect-roll:not(.prob)').forEach(e => {
      e.classList.add('prob');
      const m = e.textContent.match(/necesitas (\d+) o m[aá]s/); if (!m) return;
      const p = prob(+m[1]);
      e.insertAdjacentHTML('beforeend', ` <b class="pct ${p >= 67 ? 'alta' : p >= 34 ? 'media' : 'baja'}" title="Probabilidad de superar la prueba con dos dados">≈ ${p} %</b>`);
    });
    sc.querySelectorAll('.choice').forEach(b => {
      b.addEventListener('mouseenter', () => mostrar(b)); b.addEventListener('focus', () => mostrar(b));
      b.addEventListener('mouseleave', ocultar); b.addEventListener('blur', ocultar);
    });
    // la carta de la tirada también muestra la probabilidad
    const rt = document.getElementById('rollText');
    if (rt && !rt._obs) { rt._obs = new MutationObserver(() => { const m = rt.textContent.match(/Necesitas (\d+) o m[aá]s\.$/); if (m) rt.textContent += ' Probabilidad: ' + prob(+m[1]) + ' %.'; }); rt._obs.observe(rt, { childList: true }); }
  }

  const _t = V.trasRender;
  V.trasRender = function () {
    _t.apply(this, arguments);
    const sc = document.getElementById('scene'); if (!sc) return;
    ocultar(); narrativa(sc); mecanicas(sc);
  };
})(VIS);
