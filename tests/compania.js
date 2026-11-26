// Comprueba que Sancho desaparece al marcharse y que el panel de Compañía se rellena.
'use strict';
const fs = require('fs'), path = require('path'), assert = require('assert');
const { JSDOM } = require('jsdom');
const w = new JSDOM(fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8'), {
  runScripts: 'dangerously', url: 'https://hidalgo.test/', beforeParse(w) { w.setTimeout = () => 0; w.setInterval = () => 0; }
}).window;
const ev = c => w.eval(c);
const panel = () => ev("(document.querySelector('.lj-panel[data-k=compania]')||document.querySelector('aside.right')).textContent");
ev("GM='clasico';restart();state.scene='inn';state.loyalty=60;render()");
assert.ok(/Sancho Panza/.test(panel()), 'Sancho en la compañía');
assert.ok(/Lealtad 60/.test(panel()), 'lealtad visible');
assert.ok(/Rocinante/.test(panel()), 'Rocinante en la compañía');
// la lealtad cae a cero: la despedida no se puede deshacer con ninguna opción
assert.ok(ev("scenes.ev_adios.choices.every(c=>c[3].alone===1)"), 'ambas opciones dejan solo al hidalgo');
ev("state.loyalty=0;state.scene='ev_adios';render();choose(0)");
assert.strictEqual(ev('state.alone'), 1, 'Sancho se ha ido');
ev("state.scene='inn';render()");
const p = panel();
assert.ok(/Ausentes/.test(p) && /Se marchó con el rucio/.test(p), 'Sancho aparece como ausente');
assert.ok(!/Lealtad/.test(p), 'sin tarjeta de Sancho');
assert.strictEqual(ev("document.getElementById('loyaltyNum').textContent"), 'se fue');
assert.ok(ev("[...document.querySelectorAll('.item')].filter(i=>/Sancho/.test(i.textContent)).every(i=>i.style.display==='none')"), 'voz interior de Sancho oculta');
// una escena con voz de Sancho la cambia por su recuerdo
const k = ev("Object.keys(scenes).find(k=>scenes[k].voice&&/^SANCHO/.test(scenes[k].voice[0])&&scenes[k].choices)");
ev(`state.scene='${k}';render()`);
assert.ok(!ev("[...document.querySelectorAll('#scene .speaker')].some(s=>/^SANCHO/.test(s.textContent))"), 'sin voz de Sancho en ' + k);
assert.ok(ev("scenes['" + k + "'].voice[0]").startsWith('SANCHO'), 'la escena original queda intacta');
// Aldonza acompaña si te la llevas
ev("restart();state.flags.aldonza_viaja=1;state.scene='inn';render()");
assert.ok(/Aldonza Lorenzo/.test(panel()), 'Aldonza en la compañía');
console.log('Compañía: OK (' + k + ')');
