// Comprueba la regla de los mercados: como mucho dos compras por visita.
'use strict';
const fs = require('fs'), path = require('path'), assert = require('assert');
const { JSDOM } = require('jsdom');
const w = new JSDOM(fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8'), {
  runScripts: 'dangerously', url: 'https://hidalgo.test/', beforeParse(w) { w.setTimeout = () => 0; w.setInterval = () => 0; }
}).window;
const ev = c => w.eval(c);
ev("GM='clasico';restart();state.scene='inn';state.coins=500;render();openMkt()");
const compra = i => ev(`(()=>{const n=state.inventory['${i}']||0;trade('b','${i}');return (state.inventory['${i}']||0)-n})()`);
assert.strictEqual(compra('panqueso'), 1, 'primera compra');
assert.strictEqual(compra('panqueso'), 1, 'segunda compra');
assert.strictEqual(compra('vino'), 0, 'la tercera compra debe rechazarse');
assert.strictEqual(ev("document.querySelector('.mk-cupo b').textContent"), '2 de 2');
assert.ok(ev(`[...document.querySelectorAll('#mktModal button')].filter(b=>(b.getAttribute('onclick')||'').startsWith("trade('b'")).every(b=>b.disabled)`), 'botones de compra desactivados');
// vender sigue permitido
const r0 = ev('state.coins'); ev("trade('s','panqueso')"); assert.ok(ev('state.coins') > r0, 'vender sigue funcionando');
// otra visita (otra jornada) vuelve a permitir dos compras
ev("state.turn++;render();openMkt()");
assert.strictEqual(compra('vino'), 1, 'nueva visita: se puede comprar');
// partidas guardadas antiguas (sin state.mk) siguen funcionando
ev("delete state.mk;state.turn++;render();openMkt()");
assert.strictEqual(compra('vino'), 1, 'partida sin la clave nueva');
console.log('Mercados: OK (2 compras por visita, venta libre, cupo por jornada)');
