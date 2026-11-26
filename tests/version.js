// Comprueba que el número de versión coincide en el juego, en package.json y en VERSIONES.md,
// que las versiones del registro bajan en orden y que el menú muestra la versión.
'use strict';
const fs = require('fs'), path = require('path'), assert = require('assert');
const raiz = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
const m = html.match(/const VERSION_JUEGO='(\d+\.\d+\.\d+)'/);
assert.ok(m, 'index.html debe definir VERSION_JUEGO con formato MAYOR.MENOR.PARCHE');
const v = m[1];
const pkg = JSON.parse(fs.readFileSync(path.join(raiz, 'package.json'), 'utf8'));
assert.strictEqual(pkg.version, v, 'package.json y el juego deben tener la misma versión');
const reg = fs.readFileSync(path.join(raiz, 'VERSIONES.md'), 'utf8');
const vs = [...reg.matchAll(/^## (\d+)\.(\d+)\.(\d+) · .+$/gm)].map(x => x.slice(1, 4).map(Number));
assert.ok(vs.length, 'VERSIONES.md debe tener entradas «## x.y.z · título»');
assert.strictEqual(vs[0].join('.'), v, 'la primera entrada de VERSIONES.md debe ser la versión actual');
const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
for (let i = 1; i < vs.length; i++) assert.ok(cmp(vs[i - 1], vs[i]) > 0, 'las versiones deben ir de la más nueva a la más antigua: ' + vs[i - 1].join('.') + ' / ' + vs[i].join('.'));
const { JSDOM } = require('jsdom');
const w = new JSDOM(html, { runScripts: 'dangerously', url: 'https://hidalgo.test/', beforeParse(w) { w.setTimeout = () => 0; w.setInterval = () => 0; } }).window;
assert.strictEqual(w.document.getElementById('m-ver').textContent, 'versión ' + v, 'el menú muestra la versión');
console.log('Versión: OK (' + v + ', ' + vs.length + ' entradas en VERSIONES.md)');
