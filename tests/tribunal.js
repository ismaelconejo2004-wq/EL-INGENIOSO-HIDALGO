// Comprueba que siguen aplicadas las nueve recomendaciones de docs/EVALUACION_TRIBUNAL.md.
const fs=require('fs'),{JSDOM}=require('jsdom');
const w=new JSDOM(fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8'),{runScripts:'dangerously',url:'https://x.test/',beforeParse(w){w.setTimeout=()=>0;w.setInterval=()=>0}}).window;
const ev=c=>w.eval(c);const R=[];const ok=(n,c,d)=>R.push((c?'OK   ':'FALLA')+' '+n+(d?' — '+d:''));
// 1 voz
const voz=ev(`(()=>{const o=[];for(const k in scenes){if(['lecho','end'].includes(k))continue;scenes[k].body.forEach(p=>{const m=p.match(/[^.]*\\b(Don Quijote|don Quijote|El hidalgo|el hidalgo)\\b[^.]*\\b(ve|cree|toma|hace|escucha|vuelve|desciende|impide|se levanta|jura|aprieta|regresa|recorre|llevaba|no ha|ya está)\\b[^.]*\\./g);if(m)m.forEach(x=>{if(!/«|otro|un don Quijote|el don Quijote|aquel|hacía llamar|personaje|Avellaneda|de este/.test(x))o.push(k+': '+x.trim())})})}return o})()`);
ok('1 Voz en segunda persona',voz.length===0,voz.length?voz.join(' | '):'0 frases en tercera persona fuera del lecho');
// 2 puentes
const p2=ev(`[BR['yard#0'][1],BR['helmet#1'][1],BR['embajada#2'][1]].join(' | ')`);
const voso=ev(`['start','yard','helmet','book','vision','primera_venta','andres','escrutinio'].flatMap(k=>Object.keys(BR).filter(b=>b.startsWith(k+'#')).flatMap(b=>BR[b])).filter(t=>/(^|[^a-záéíóúñ])(vosotros|partís|bajáis|salís|os|vuestro|vuestra)(?![a-záéíóúñ])/i.test(t))`);
ok('2 Puentes coherentes',!/vosotros|bajáis hacia una venta/.test(p2)&&voso.length===0,voso.length?voso.join(' | '):'sin plurales en la primera salida; embajada#2 → sierra');
// 3 ánimo
const m3=ev(`(()=>{const r=[];state.honor=95;state.health=80;state.hunger=10;state.loyalty=50;for(const s of ['home','amor','lecho','salida','end','a_epilogo','tarfe']){state.scene=s;state.turn+=7;r.push(mood())}const vistos=[];state.scene='road';state.moodK=null;for(let t=0;t<40;t++){state.turn++;const m=mood();if(m)vistos.push(m[1])}return {finales:r.filter(Boolean).length,distintos:new Set(vistos).size,veces:vistos.length}})()`);
ok('3 Voces del ánimo',m3.finales===0&&m3.distintos>1,`en finales: ${m3.finales}; en 40 jornadas: ${m3.veces} apariciones, ${m3.distintos} frases distintas`);
// 4 mercado/consejos
const m4=ev(`(()=>{state.loyalty=90;state.alone=0;CFG.advice=1;const r=[];for(const s of ['home','amor','lecho','salida','end']){state.scene=s;r.push(shopBtn()+advice())}return r.join('').length})()`);
ok('4 Sin mercado ni consejos en los finales',m4===0);
// 5 saltos y desvíos
const x5=ev(`!!(scenes.toboso.x.salto2&&scenes.avellaneda.x.salto3)`);
const d5=ev(`(()=>{const ORD=['mills','vizcaino','adventure','cabreros','marcela','yangueses','manteo','inn'];state.mode=null;state.scene='mills';const a=detPool();state.scene='a_venta';state.mode='apo';const b=detPool();return {c:a,a:b}})()`);
ok('5 Saltos señalados y desvíos en orden',x5&&d5.c.every(k=>!k.startsWith('a_'))&&!d5.c.includes('road')&&d5.a.every(k=>k.startsWith('a_')||['ateca','zaragoza','siguenza','madrid','toledo'].includes(k)),'desde molinos → '+d5.c.join(', ')+' · desde la venta apócrifa → '+d5.a.join(', '));
// 6 cierres
const c6=ev(`(()=>{const c={};for(const k in BR)for(const t of BR[k]){const m=typeof t==='string'&&t.match(/^([A-ZÁÉÍÓÚ][^,]{2,22}),/);if(m)c[m[1]]=(c[m[1]]||0)+1}return c})()`);
const max6=Math.max(...['Sea como sea','Pase lo que pase','Al cabo','A fin de cuentas','De un modo u otro','Con suerte o sin ella'].map(k=>c6[k]||0));
ok('6 Cierres variados',max6<=6,'máximo por fórmula: '+max6+' · fórmulas: '+['Salga como salga','Mal que bien','Así las cosas','Con todo','En cualquier caso','Bien o mal'].filter(k=>c6[k]).length+' nuevas en uso');
// 7 fuentes
const f7=ev(`BKT.some(b=>b[0]==='fuentes')&&/Rico/.test(bkRight('fuentes'))&&/Riquer/.test(bkRight('fuentes'))&&/Criterio de cita/.test(bkRight('fuentes'))&&/Tipos de glosa/.test(bkRight('fuentes'))`);
ok('7 Página Fuentes y criterios',f7);
// 8 epílogos
const e8=ev(`(()=>{state.fin='lucido';state.scene='end';state.flags={};const t=epilogue();state.fin='muerte';state.alone=1;render();const b=scenes.end.body.join(' ');return {rara:/más rara/.test(t),sancho:/Sancho volvió/.test(b)}})()`);
ok('8 Epílogos ajustados',!e8.rara&&!e8.sancho,'«la forma más rara» eliminado; la muerte sin escudero no menciona a Sancho');
// 9 ecos
const e9=ev(`/rebuzno/.test(scenes.barco.body.join(' '))&&/sima/.test(scenes.tosilos.body.join(' '))&&/Teresa/.test(scenes.ricote.x.md_teresa||'')`);
ok('9 Rebuzno, sima y carta de Teresa',e9);
console.log(R.join('\n'));
process.exit(R.some(x=>x.startsWith('FALLA'))?1:0);
