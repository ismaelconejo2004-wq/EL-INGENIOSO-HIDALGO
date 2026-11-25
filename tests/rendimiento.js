// Mide tamaño, tiempo de carga (móvil medio simulado), FPS y coste por
// fotograma del escenario. Uso: node tests/rendimiento.js
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), zlib = require('zlib');
const { chromium } = require('playwright');
const FILE = process.env.HTML || path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(FILE), gz = zlib.gzipSync(html, { level: 9 });

function servidor(gzip) {
  return new Promise(res => {
    const s = http.createServer((q, r) => {
      if (q.url !== '/' && q.url !== '/index.html') { r.writeHead(404); r.end(); return; }
      const h = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' };
      if (gzip) h['content-encoding'] = 'gzip';
      r.writeHead(200, h); r.end(gzip ? gz : html);
    }).listen(0, () => res(s));
  });
}

(async () => {
  const out = { bytes: html.length, gzip: gz.length };
  const b = await chromium.launch();
  // 1 · carga en un móvil medio: CPU 4x más lenta, red «4G lenta» (1,6 Mb/s, 150 ms)
  for (const gzip of [true, false]) {
    const s = await servidor(gzip), port = s.address().port, tiempos = [];
    for (let i = 0; i < 3; i++) {
      const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      const p = await ctx.newPage(), cdp = await ctx.newCDPSession(p);
      await cdp.send('Network.enable');
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await p.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' });
      const t = await p.evaluate(() => {
        const n = performance.getEntriesByType('navigation')[0], fcp = performance.getEntriesByName('first-contentful-paint')[0];
        return { dcl: n.domContentLoadedEventEnd, load: n.loadEventEnd, fcp: fcp ? fcp.startTime : null, script: n.domContentLoadedEventEnd - n.responseEnd };
      });
      tiempos.push(t); await ctx.close();
    }
    s.close();
    const med = k => tiempos.map(t => t[k]).sort((a, c) => a - c)[1];
    out[gzip ? 'cargaGzip' : 'cargaSinGzip'] = { fcp: Math.round(med('fcp')), dcl: Math.round(med('dcl')), load: Math.round(med('load')), script: Math.round(med('script')) };
  }
  if (process.env.HTML) { await b.close(); console.log(JSON.stringify(out, null, 2)); return; }
  // 2 · FPS y coste por fotograma (escritorio y móvil con CPU 4x más lenta)
  out.fps = {};
  for (const [nom, opt, cpu] of [['escritorio', { viewport: { width: 1280, height: 720 } }, 1], ['movil_cpu4x', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, 4]]) {
    const ctx = await b.newContext(opt), p = await ctx.newPage(), cdp = await ctx.newCDPSession(p);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
    await p.goto('file://' + FILE);
    await p.evaluate(() => { document.getElementById('menu').classList.remove('on'); CFG.tw = 0; });
    const r = {};
    for (const id of ['mills', 'cabreros', 'ev_tormenta', 'galeotes', 'altisidora']) {
      await p.evaluate(id => { state.scene = id; state.turn++; render(); document.querySelector('.marco').scrollIntoView(); VIS.pedir(); }, id);
      await p.waitForTimeout(3500);
      const fps = await p.evaluate(() => VIS.fps());
      const ms = await p.evaluate(() => { const t0 = performance.now(); for (let i = 0; i < 120; i++) VIS.dibujarYa(); return (performance.now() - t0) / 120; });
      r[id] = { fps: Math.round(fps), msFotograma: +ms.toFixed(2) };
    }
    // 3 · el bucle se detiene con la pestaña oculta
    await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
    await p.waitForTimeout(400);
    r.bucleConPestanaOculta = await p.evaluate(() => VIS.activo()) ? 'sigue (MAL)' : 'detenido';
    out.fps[nom] = r; await ctx.close();
  }
  // 4 · movimiento reducido: sin bucle
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' }), p = await ctx.newPage();
    await p.goto('file://' + FILE);
    await p.evaluate(() => { document.getElementById('menu').classList.remove('on'); state.scene = 'mills'; state.turn++; render(); });
    await p.waitForTimeout(600);
    out.movimientoReducido = await p.evaluate(() => VIS.activo()) ? 'bucle activo (MAL)' : 'sin bucle; un fotograma por cambio';
    await ctx.close();
  }
  await b.close();
  console.log(JSON.stringify(out, null, 2));
  if (!process.env.HTML) fs.writeFileSync(path.join(__dirname, 'rendimiento.json'), JSON.stringify(out, null, 2));
})();
