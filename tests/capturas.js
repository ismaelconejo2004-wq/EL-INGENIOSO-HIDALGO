// Captura las 119 escenas en escritorio (1280x720) y móvil (390x844) con
// Playwright y guarda las imágenes en tests/capturas/. Además comprueba:
// texto desbordado, actores fuera del lienzo o solapados y contraste del
// texto de las cajas de diálogo. Uso: node tests/capturas.js [id,id,...]
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const RAIZ = path.join(__dirname, '..'), OUT = path.join(__dirname, 'capturas');
const URL = 'file://' + path.join(RAIZ, 'index.html');
const solo = process.argv[2] ? process.argv[2].split(',') : null;

const VISTAS = [
  { nom: 'escritorio', opt: { viewport: { width: 1280, height: 720 } } },
  { nom: 'movil', opt: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true } }
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const informe = { fecha: new Date().toISOString(), vistas: {} };
  let problemas = 0;
  for (const v of VISTAS) {
    const ctx = await b.newContext(v.opt), p = await ctx.newPage(), errs = [];
    p.on('pageerror', e => errs.push(e.message));
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.goto(URL);
    await p.evaluate(() => { document.getElementById('menu').classList.remove('on'); CFG.tw = 0; });
    // estado final de cada escena: sin la animación de entrada del texto ni avisos flotantes
    await p.addStyleTag({ content: '#scene>*{animation:none!important}#toast{display:none!important}.flot{display:none!important}' });
    const ids = solo || await p.evaluate(() => Object.keys(scenes));
    const res = informe.vistas[v.nom] = {};
    for (const id of ids) {
      const r = await p.evaluate(id => {
        state.scene = id; state.turn++; render();
        const S = VIS.escenaActual(); S.t -= 6000; S.part = []; VIS.dibujarYa();
        const m = document.getElementById('lj-escena') || document.querySelector('#scene .marco'); window.scrollTo(0, m.getBoundingClientRect().top + scrollY - 8);
        const W = VIS.ancho(), prob = [];
        // texto cortado
        document.querySelectorAll('#scene .dlg .voice, #scene .choice, #scene .narration p, .stage figcaption').forEach(e => {
          if (e.scrollWidth > e.clientWidth + 2) prob.push('texto desbordado: ' + (e.className || e.tagName));
        });
        // actores fuera o solapados (se ignoran monturas y jinetes, que comparten sitio a propósito)
        const A = S.actores.filter(a => !a.vuelo && !a.manteo && a.rol !== 'montura');
        A.forEach(a => { if (a.tx < 4 || a.tx > W - 4) prob.push('actor fuera del lienzo: ' + a.id); });
        for (let i = 0; i < A.length; i++) for (let j = i + 1; j < A.length; j++)
          if (Math.abs(A[i].tx - A[j].tx) < 9 && (A[i].y || 0) === (A[j].y || 0) && !A[i].tendido) prob.push('actores solapados: ' + A[i].id + ' / ' + A[j].id);
        // contraste de las cajas de voz (WCAG, texto grande en cursiva >= 3:1; pedimos 4.5)
        const lum = c => { const m = c.match(/\d+(\.\d+)?/g).map(Number); const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]); };
        document.querySelectorAll('#scene .dlg .voice').forEach(e => {
          const cs = getComputedStyle(e), bg = cs.backgroundImage.match(/rgba?\([^)]*\)/g);
          const fondo = bg ? bg[bg.length - 1] : cs.backgroundColor;
          const a = lum(cs.color), c = lum(fondo), k = (Math.max(a, c) + 0.05) / (Math.min(a, c) + 0.05);
          if (k < 4.5) prob.push('contraste bajo en ' + e.className + ': ' + k.toFixed(2));
        });
        return { fondo: S.e.f, hora: S.e.h, actores: S.actores.map(a => a.id), prob };
      }, id);
      await p.waitForTimeout(30);
      await p.screenshot({ path: path.join(OUT, `${v.nom}-${id}.jpg`), type: 'jpeg', quality: 62 });
      res[id] = r; problemas += r.prob.length;
      if (r.prob.length) console.log(`[${v.nom}] ${id}: ${r.prob.join(' · ')}`);
    }
    if (errs.length) { console.log(`[${v.nom}] errores de JS:`, errs.slice(0, 5)); problemas += errs.length; }
    res._errores = errs;
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, 'informe.json'), JSON.stringify(informe, null, 1));
  await b.close();
  const n = Object.values(informe.vistas).reduce((s, v) => s + Object.keys(v).length - 1, 0);
  console.log(`${n} capturas en tests/capturas · ${problemas} problema(s) detectado(s)`);
  process.exit(problemas ? 1 : 0);
})();
