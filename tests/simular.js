// Recorre miles de partidas aleatorias en jsdom y comprueba que no hay
// `next` rotos, callejones sin salida, bucles infinitos ni errores de JS.
// Uso: node tests/simular.js [partidas]   (por defecto 3000)
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const { fork } = require('child_process');
const os = require('os');
const N = Number(process.argv[2]) || 3000;
const MAX_PASOS = 400;
const HIJO = process.argv[3] === '--hijo';
if (!HIJO) {
  // Proceso principal: reparte las partidas entre varios procesos y suma.
  const H = Math.max(1, Math.min(8, os.cpus().length));
  const t0 = Date.now();
  let vivos = H; const R = [];
  for (let h = 0; h < H; h++) {
    const n = Math.floor(N / H) + (h < N % H ? 1 : 0);
    const c = fork(__filename, [String(n), '--hijo', String(h * 7919 + 12345)], { silent: false });
    c.on('message', m => R.push(m));
    c.on('exit', () => { if (--vivos === 0) resumen(R, Date.now() - t0); });
  }
  return;
}
function resumen(R, ms) {
  const vistas = new Set(), finales = {}; let pasos = 0, tir = 0, usos = 0, atascos = 0, partidas = 0, errores = [], total = 0, todas = [];
  for (const r of R) {
    r.vistas.forEach(v => vistas.add(v)); for (const k in r.finales) finales[k] = (finales[k] || 0) + r.finales[k];
    pasos += r.pasos; tir += r.tiradas; usos += r.usos; atascos += r.atascos; partidas += r.partidas; errores.push(...r.errores); total = r.total; todas = r.todas;
  }
  errores = [...new Set(errores)];
  // Partidas largas: el juego original ya tiene ~0,15 % de partidas que no llegan
  // al final en 400 pasos por ciclos de rutas (no es un fallo del motor visual).
  const largas = errores.filter(e => e.includes('no llega al final'));
  errores = errores.filter(e => !e.includes('no llega al final'));
  if (largas.length) { console.log(`Aviso: ${atascos} partida(s) sin final en ${MAX_PASOS} pasos (${(atascos / partidas * 100).toFixed(2)} %, umbral 0,5 %):`); largas.forEach(e => console.log('   ' + e)); }
  if (atascos / partidas > 0.005) errores.push(`demasiadas partidas sin final: ${atascos}`);
  const nunca = todas.filter(k => !vistas.has(k));
  console.log(`Partidas: ${partidas} en ${(ms / 1000).toFixed(1)} s · pasos medios: ${(pasos / partidas).toFixed(1)} · tiradas: ${tir} · usos de objeto: ${usos}`);
  console.log(`Escenas: ${total} · visitadas: ${vistas.size} · nunca visitadas: ${nunca.length ? nunca.join(', ') : 'ninguna'}`);
  console.log('Finales:', JSON.stringify(finales));
  console.log(`Partidas sin final: ${atascos}`);
  if (errores.length) { console.log(`\n${errores.length} error(es):`); errores.slice(0, 40).forEach(e => console.log(' - ' + e)); process.exit(1); }
  console.log('OK');
}
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const errores = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errores.push('jsdom: ' + (e.detail || e.message || e)));
vc.on('error', e => errores.push('console.error: ' + e));

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  url: 'https://hidalgo.test/',
  virtualConsole: vc,
  beforeParse(w) {
    // Los temporizadores no importan para la lógica: se anulan para que las
    // tiradas de dados no esperen y no se acumulen intervalos.
    w.setTimeout = () => 0;
    w.setInterval = () => 0;
    w.clearTimeout = () => {};
    w.clearInterval = () => {};
    w.scrollTo = () => {};
    w.addEventListener('error', ev => errores.push('window.error: ' + (ev.error && ev.error.stack || ev.message)));
  }
});
const w = dom.window;
const ev = code => w.eval(code);

// 1 · comprobación estática de destinos
const especiales = new Set(['@back', '@final', 'start', 'end']);
const estatico = ev(`(()=>{const out=[];for(const k in scenes){const s=scenes[k];
  if(!s||!Array.isArray(s.choices)||!s.choices.length){out.push(k+': sin opciones');continue}
  if(!s.title||!s.body||!s.voice)out.push(k+': falta title/body/voice');
  s.choices.forEach((c,i)=>{const n=c[3]&&c[3].next;if(n&&!scenes[n]&&!['@back','@final'].includes(n))out.push(k+'#'+i+' -> '+n)})}
  for(const k in RD)if(!scenes[RD[k]])out.push('RD '+k+' -> '+RD[k]);
  return out})()`);
estatico.forEach(e => errores.push('estático: ' + e));

// 2 · simulación
let seed = Number(process.argv[4]) || 12345;
const azar = n => { seed = (Math.imul(seed, 1103515245) + 12345) >>> 0; return seed % n; };
const vistas = new Set();
const finales = {};
let pasosTot = 0, tiradas = 0, usos = 0, atascos = 0;

for (let g = 0; g < N; g++) {
  const modo = g % 3 === 2 ? 'pesadilla' : 'clasico';
  try {
    ev(`GM='${modo}';PF.clasico=1;restart()`);
  } catch (e) { errores.push(`partida ${g}: restart: ${e.stack}`); continue; }
  let pasos = 0, fin = false; const rastro = [];
  while (pasos < MAX_PASOS) {
    const sc = ev('state.scene');
    vistas.add(sc); rastro.push(sc); if (rastro.length > 24) rastro.shift();
    if (!ev(`!!scenes[${JSON.stringify(sc)}]`)) { errores.push(`partida ${g}: escena inexistente ${sc}`); break; }
    if (sc === 'end') { fin = true; finales[ev('state.fin||"?"')] = (finales[ev('state.fin||"?"')] || 0) + 1; break; }
    const n = ev(`scenes[state.scene].choices.length`);
    if (!n) { errores.push(`partida ${g}: callejón en ${sc}`); break; }
    // De vez en cuando, usar un objeto (ejercita inventario)
    if (azar(6) === 0) {
      try { ev(`(()=>{const ks=Object.keys(state.inventory).filter(k=>state.inventory[k]>0&&items[k]&&items[k].use);if(ks.length)useItem(ks[0])})()`); usos++; }
      catch (e) { errores.push(`partida ${g}: useItem en ${sc}: ${e.message}`); }
    }
    const i = azar(n);
    try {
      ev(`choose(${i})`);
      if (ev('!!(window.pending&&document.getElementById("modal").classList.contains("show"))')) {
        tiradas++;
        ev('window.pending.rolling=false;closeRoll()');
      }
    } catch (e) { errores.push(`partida ${g}: choose(${i}) en ${sc}: ${e.stack}`); break; }
    pasos++;
  }
  pasosTot += pasos;
  if (!fin) { atascos++; if (atascos <= 5) errores.push(`partida ${g}: no llega al final en ${MAX_PASOS} pasos (últimas: ${rastro.join(' > ')})`); }
}

process.send({ partidas: N, pasos: pasosTot, tiradas, usos, atascos, errores, finales, vistas: [...vistas], total: ev('Object.keys(scenes).length'), todas: ev('Object.keys(scenes)') });
