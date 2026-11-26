// Genera docs/El-ingenioso-hidalgo-dossier.pdf: capturas nuevas del juego + documento maquetado.
// Uso: node tools/dossier.js   (necesita Playwright con Chromium)
'use strict';
const fs = require('fs'), path = require('path');
const { chromium, devices } = require('playwright');
const RAIZ = path.join(__dirname, '..');
const URL = 'file://' + path.join(RAIZ, 'index.html');
const SALIDA = path.join(RAIZ, 'docs', 'El-ingenioso-hidalgo-dossier.pdf');
const R = JSON.parse(fs.readFileSync(path.join(RAIZ, 'tests', 'rendimiento.json'), 'utf8'));

const jpg = b => 'data:image/jpeg;base64,' + b.toString('base64');
const kb = n => (n / 1024).toFixed(0) + ' KB';

async function capturas(b) {
  const I = {};
  const nueva = async (opt) => { const c = await b.newContext(opt); const p = await c.newPage(); await p.goto(URL); return [c, p]; };
  const juego = async (p, id) => { await p.evaluate(id => { document.getElementById('menu').classList.remove('on'); CFG.tw = 0; if (id === 'start') restart(); else { state.scene = id; state.turn++; render(); } }, id); await p.waitForTimeout(1800); };
  const shot = async (p, opt) => jpg(await p.screenshot(Object.assign({ type: 'jpeg', quality: 78 }, opt || {})));
  // escritorio
  let [c, p] = await nueva({ viewport: { width: 1366, height: 768 } });
  I.cuentas = await p.evaluate(() => { const ks = Object.keys(scenes); return { esc: ks.length, dec: ks.reduce((a, k) => a + scenes[k].choices.length, 0), tir: ks.reduce((a, k) => a + scenes[k].choices.filter(c => c[2]).length, 0) }; });
  await p.waitForTimeout(1200); I.menu = await shot(p);
  await p.evaluate(() => mShow('modes')); await p.waitForTimeout(300); I.modos = await shot(p);
  await p.evaluate(() => { PF.clasico = 1; mPlay('clasico'); }); await p.waitForTimeout(2600); I.intro = await shot(p);
  await p.evaluate(() => introSkip()); await p.waitForTimeout(800);
  await juego(p, 'mills'); await p.hover('.choice >> nth=0'); await p.waitForTimeout(300); I.libro = await shot(p);
  await p.evaluate(() => document.querySelector('.lj-cuerpo').scrollTop = 380); await p.hover('.choice >> nth=1'); await p.waitForTimeout(300); I.tirada = await shot(p);
  await p.evaluate(() => document.querySelectorAll('.choice')[0].click()); await p.waitForTimeout(260); I.giro = await shot(p);
  await p.waitForTimeout(1500);
  await p.evaluate(() => { state.scene = 'inn'; state.turn++; state.coins = 60; render(); openMkt(); trade('b', 'panqueso'); trade('b', 'vino'); }); await p.waitForTimeout(500); I.mercado = await shot(p);
  await p.evaluate(() => { closeMkt(); openBook('ajustes'); }); await p.waitForTimeout(500); I.ajustes = await shot(p);
  await p.evaluate(() => { closeBook(); CFG.theme = 'noche'; applyCfg(); state.scene = 'cabreros'; state.turn++; render(); }); await p.waitForTimeout(1600); I.noche = await shot(p);
  await p.evaluate(() => { CFG.theme = 'pergamino'; applyCfg(); });
  // galería de escenas: el lienzo interno a tamaño real ×2
  const ids = ['road', 'mills', 'cabreros', 'inn', 'sierra', 'duques', 'barcelona', 'ev_tormenta', 'batanes', 'montesinos', 'toboso', 'vision'];
  I.galeria = [];
  for (const id of ids) {
    const u = await p.evaluate(id => { state.scene = id; state.turn++; render(); const S = VIS.escenaActual(); S.t -= 6000; VIS.dibujarYa(); return { u: document.querySelector('.vis-cv').toDataURL('image/png'), t: scenes[id].title, l: scenes[id].place }; }, id);
    I.galeria.push(u);
  }
  // detalle ampliado de personajes y luz
  I.detalle = await p.evaluate(() => { state.scene = 'road'; state.turn++; render(); const S = VIS.escenaActual(); S.t -= 6000; VIS.dibujarYa(); return document.querySelector('.vis-cv').toDataURL('image/png'); });
  await c.close();
  // móvil
  [c, p] = await nueva({ ...devices['iPhone 13'] });
  await juego(p, 'start'); I.movil = await shot(p);
  await p.evaluate(() => document.querySelectorAll('.choice')[0].click()); await p.waitForTimeout(330); I.movilGiro = await shot(p);
  await c.close();
  [c, p] = await nueva({ ...devices['iPhone 13 landscape'] });
  await juego(p, 'mills'); I.movilH = await shot(p);
  await c.close();
  return I;
}

function html(I) {
  const fig = (src, pie, cls) => `<figure class="${cls || ''}"><img src="${src}" alt=""><figcaption>${pie}</figcaption></figure>`;
  const g = R.cargaGzip, m4 = R.fps.movil_cpu4x;
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>El ingenioso hidalgo · Dossier</title><style>
@page{size:A4;margin:16mm 15mm 18mm}
body{font:10.5pt/1.55 'P052','Palatino Linotype','Book Antiqua',Georgia,serif;color:#2a2118;margin:0}
h1,h2,h3{font-weight:400;color:#3a1a10;margin:0}
h2{font-size:21pt;margin:0 0 4mm;padding-bottom:2mm;border-bottom:1.5px solid #b8892f;break-after:avoid}
h2 small{display:block;font:8pt 'DejaVu Sans Mono',monospace;letter-spacing:.2em;color:#9b2a1c;text-transform:uppercase;margin-bottom:1mm}
h3{font-size:12.5pt;margin:5mm 0 1.5mm;color:#7b2417;break-after:avoid}
p{margin:0 0 2.4mm;text-align:justify;hyphens:auto}
ul{margin:0 0 3mm;padding-left:5mm}li{margin:0 0 1mm}
section{break-before:page}
figure{margin:3mm 0;break-inside:avoid}figure img{display:block;width:100%;border:1px solid #6b4a2a;image-rendering:pixelated}
figcaption{font:italic 8.5pt Georgia,serif;color:#6b5a3e;margin-top:1.2mm}
.dos{display:grid;grid-template-columns:1fr 1fr;gap:4mm}.tres{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm}
.tres figure{margin:0}.tres figcaption{font-size:7.5pt}
.movil{display:grid;grid-template-columns:1fr 1fr 2.1fr;gap:4mm;align-items:start}
table{width:100%;border-collapse:collapse;font-size:9.5pt;margin:2mm 0 4mm;break-inside:avoid}
th,td{border-bottom:1px solid #d9c49a;padding:1.4mm 2mm;text-align:left;vertical-align:top}th{background:#efe2c0;font-weight:600}
.nota{background:#f3e8cb;border-left:3px solid #b8892f;padding:2.5mm 3.5mm;font-size:9.5pt;margin:3mm 0;break-inside:avoid}
.cifras{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;margin:4mm 0}
.cifras div{border:1px solid #b8892f;padding:3mm;text-align:center;background:#f6ecd0}.cifras b{display:block;font-size:20pt;color:#7b2417;font-weight:400}
.cifras span{font-size:8.5pt;color:#6b5a3e}
.portada{height:257mm;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;background:#2a1810;color:#f3e6c4;margin:-16mm -15mm 0;padding:0 18mm;break-after:page}
.portada .over{font:9pt 'DejaVu Sans Mono',monospace;letter-spacing:.3em;color:#d8a640}
.portada h1{color:#f6ebc8;font-size:40pt;line-height:1.05;margin:6mm 0 3mm}
.portada .sub{font-style:italic;font-size:13pt;color:#e2d5b6}
.portada img{width:100%;margin:10mm 0 6mm;border:3px double #c9a35a;image-rendering:pixelated}
.portada .pie{font-size:9pt;color:#cdbb93;line-height:1.6}
code{font:8.8pt 'DejaVu Sans Mono',monospace;background:#efe2c0;padding:0 1mm}
</style></head><body>
<div class="portada"><div class="over">Relación de sucesos · Dossier del juego</div><h1>El ingenioso hidalgo</h1><div class="sub">Una aventura interior de decisiones · Cervantes 1605/1615 y Avellaneda 1614</div>
<img src="${I.detalle}" alt=""><div class="pie">Interfaz de libro abierto, arte pixel generado por código, narrativa ramificada en 119 escenas.<br>Versión de ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</div></div>

<section style="break-before:auto"><h2><small>1 · Presentación</small>Qué es el juego</h2>
<p><i>El ingenioso hidalgo</i> es una ficción interactiva de decisiones sobre don Quijote. El jugador guía al hidalgo por los episodios de la <b>Primera parte</b> (1605) y la <b>Segunda parte</b> (1615) de Cervantes y por la continuación apócrifa de <b>Avellaneda</b> (1614), con ramas hipotéticas señaladas como tales. Cada decisión cambia cinco estadísticas (Salud, Cordura, Honor, Saciedad y la lealtad de Sancho) y puede abrir rutas, objetos, relaciones y finales distintos.</p>
<div class="cifras"><div><b>${I.cuentas.esc}</b><span>escenas</span></div><div><b>${I.cuentas.dec}</b><span>decisiones</span></div><div><b>${I.cuentas.tir}</b><span>pruebas de dados</span></div><div><b>2</b><span>modos: Clásico y Pesadilla</span></div></div>
<p>Todo el juego es <b>un único archivo HTML sin dependencias externas</b>: el arte, la música, los sonidos y la interfaz se generan por código al cargar. Pesa ${kb(R.bytes)} (${kb(R.gzip)} comprimido) y las partidas se guardan solas en el navegador.</p>
${fig(I.menu, 'Menú principal: la escena de fondo (molinos al ocaso, don Quijote y Sancho cabalgando) la dibuja el propio motor del juego.')}
<div class="dos">${fig(I.modos, 'Elección de modo. El Modo Pesadilla se desbloquea al terminar el Clásico.')}${fig(I.intro, 'Introducción: de la noche al amanecer sobre la misma escena; el texto va sobre una banda oscura para leerse sobre cualquier fondo.')}</div>
</section>

<section><h2><small>2 · Interfaz</small>El juego es un libro abierto</h2>
<p>Toda la partida se presenta como un libro encuadernado en cuero. La <b>página izquierda</b> recoge el estado del hidalgo: las cinco estadísticas, las voces interiores, la <b>escena animada</b> y unas pestañas de Alforjas, Ruta, Cuaderno y Compañía. La <b>página derecha</b> es el relato: la época, el título del capítulo, la narración, las voces con retrato y las decisiones. Al pie de cada página corre un folio que avanza con las jornadas.</p>
${fig(I.libro, 'Doble página en escritorio. Al pasar el ratón por una decisión, las barras de la izquierda muestran con franjas cuánto subiría o bajaría cada estadística.')}
<h3>Cambio de página en cada decisión</h3>
<div class="dos" style="align-items:start"><div><p>Al elegir, la página derecha gira sobre el lomo como una hoja real (animación 3D de 0,8 s con el sonido de página) y deja ver la siguiente; el texto nuevo empieza a escribirse cuando la hoja ha pasado. Así se avanza a la vez en el juego y en el libro.</p><p>Con movimiento reducido el cambio es instantáneo. El folio al pie de cada página avanza con las jornadas.</p></div>${fig(I.giro, 'La hoja durante el giro: su dorso cruza sobre la página izquierda.')}</div>
</section>

<section><h2><small>2 · Interfaz</small>El libro en el móvil</h2>
<p>En horizontal el móvil muestra la doble página clásica. En vertical no caben dos páginas legibles una junto a otra, así que el libro se abre <b>como un cuaderno de encuadernación superior</b>: página de arriba con el estado y la escena, lomo horizontal y página de abajo con el relato. En cada decisión la hoja de abajo se levanta sobre el lomo y cae sobre la de arriba. Desde 700 px de ancho (portátiles con zoom, tablets) se mantiene siempre la doble página.</p>
<div class="movil">${fig(I.movil, 'iPhone en vertical.')}${fig(I.movilGiro, 'La hoja girando hacia arriba.')}${fig(I.movilH, 'En horizontal: doble página.')}</div>
<h3>Ajustes, temas y pantalla completa</h3>
<div class="dos">${fig(I.ajustes, 'Ajustes en el «libro del hidalgo»: pantalla completa, música, sonido, tema, tamaño de letra, animaciones y texto letra a letra.')}${fig(I.noche, 'Tema noche: el libro usa una paleta oscura propia; la escena no se invierte.')}</div>
<ul><li><b>Pantalla completa</b> desde la cabecera del libro, el menú principal, Ajustes o la tecla F.</li><li>Temas pergamino, noche, bosque y alto contraste; tamaño de texto ajustable.</li><li>Accesibilidad: el texto completo está siempre en el documento, la interfaz se usa con teclado (1–4, M, Espacio) y se respeta <code>prefers-reduced-motion</code>.</li></ul>
</section>

<section><h2><small>3 · Arte</small>Pixel art pictórico generado por código</h2>
<p>La escena es un lienzo de 320–400 × 180 píxeles escalado siempre por números enteros. No hay ninguna imagen dibujada a mano ni descargada: fondos, personajes, iconos, retratos y marcos se pintan con código a partir de una <b>paleta de 32 colores</b> con cuatro versiones (mediodía, amanecer, ocaso y noche) y dos derivadas para la noche (lumbre y luna). Cambiar la hora es cambiar la tabla de colores, así que los personajes se integran solos en la luz de cada escena.</p>
<div class="tres">${I.galeria.map(x => fig(x.u, `<b>${x.t}</b> · ${x.l}`)).join('')}</div>
</section>

<section><h2><small>3 · Arte</small>Escenarios, personajes y luz</h2>
<ul><li><b>25 escenarios base</b> con tres capas de parallax y primer plano: camino real (cuatro regiones), molinos, llanura de Montiel, vado, venta por fuera y por dentro, majada, encinar, pinar, Sierra Morena, plaza de aldea, ciudad, casa noble, salón y liza de los duques, calabozo, Ebro, batanes, cueva de Montesinos, playa de Barcelona y un paisaje «entre páginas» para el sueño, la fiebre y la locura.</li>
<li><b>Personajes por capas</b> (cuerpo, traje, tocado, barba, accesorio) con poses de reposo, caminar, hablar, golpe, montado, de rodillas, leyendo y tendido: don Quijote (con celada o con la bacía de Mambrino), Alonso Quijano, Sancho, Rocinante y el rucio como actores propios, doce tipos y unas cincuenta variantes.</li>
<li><b>Vida y luz</b> (novedades de esta versión): sombras de contacto bajo cada figura, luz de borde que da volumen, parpadeo, bruma del color del horizonte que separa los planos, haces de sol al amanecer y al ocaso, bandadas lejanas, además de polvo, lluvia, niebla, luciérnagas, chispas, aspas girando y brillo en el yelmo.</li>
<li><b>Tensión visible</b>: con Cordura baja aparece una viñeta violeta y el horizonte ondula; con Salud baja, una viñeta roja que late; con hambre, desaturación y grano.</li></ul>
${fig(I.detalle, 'Detalle a resolución interna ampliada: haces de luz, bruma, sombras bajo los pies y luz de borde en las figuras.')}
</section>

<section><h2><small>4 · Narrativa</small>Cómo se presenta el relato</h2>
<p>La narrativa se ha revisado escena a escena contra las dos novelas de Cervantes y la de Avellaneda: se han corregido datos (los treinta o cuarenta molinos, la hora de Montesinos, los corsarios franceses del cautivo, el final de Claudia Jerónima, el desenlace de Tosilos), se ha añadido la <b>primera salida</b> que faltaba (la venta del armado caballero, Andrés y los mercaderes, el escrutinio de la librería) y se han tejido <b>ecos entre historias</b>: Andrés reaparece en Sierra Morena, Ginés roba el rucio y Sansón comenta el descuido, la bacía se convierte en baciyelmo, Tarfe pasa de Avellaneda a Cervantes.</p>
<ul><li><b>Glosa del cronista</b> en cada escena: declara si es fiel a Cervantes, adaptada, del apócrifo, rama hipotética o incidente del juego, con su referencia (I, 8; II, 74). El Libro del hidalgo incluye una página de <b>Fuentes y criterios</b> con las ediciones de referencia.</li>
<li><b>Finales con texto propio</b>: el canónico (la muerte de Alonso Quijano, con el epitafio de Sansón Carrasco y la despedida de la pluma de Cide Hamete) es el desenlace habitual; las ramas hipotéticas (Aldonza, la cuarta salida) y los tres finales del apócrifo explican en qué se apartan de la novela.</li>
<li><b>Voz narrativa única</b>: el jugador es el hidalgo, en segunda persona, salvo en el lecho de muerte, donde el paso a la tercera persona marca que ya no es don Quijote.</li></ul>
<ul><li><b>Capitular iluminada</b> en el primer párrafo de cada escena, orla con florón bajo el título y la frase que enlaza con la decisión anterior como <b>nota al margen</b>.</li>
<li><b>Texto letra a letra</b> que se completa con un toque o una tecla; los personajes mueven la boca mientras hablan.</li>
<li><b>Voces interiores con retrato</b>: Sancho en un marco de madera; <b>La Razón</b> como alegoría de plata (dama con compás y lámpara) y <b>El Caballero</b> como alegoría de oro y fuego (yelmo cerrado con llama tras la visera), a la manera de los libros de emblemas del Siglo de Oro.</li>
<li><b>Escena coherente con el texto</b>: cada una de las escenas tiene fondo, hora, clima, accesorios y reparto propios.</li></ul>
<h2 style="margin-top:6mm"><small>5 · Mecánicas</small>Estadísticas, dados y mercados</h2>
<ul><li><b>Cinco estadísticas</b> con barras animadas, estela al bajar y cifras flotantes (+5, −3) en el panel y sobre la escena.</li>
<li><b>Vista previa</b> del efecto de cada decisión en las barras antes de elegir.</li>
<li><b>Pruebas de dados (2d6)</b>: la opción indica el valor necesario y ahora también la <b>probabilidad</b> de superarla, con color según el riesgo; los dados caen y ruedan sobre la escena y don Quijote reacciona al resultado.</li>
<li><b>Mercados: como mucho dos compras por visita.</b> El mercado muestra «Compras en este mercado: n de 2» y desactiva la compra al llegar al límite; vender sigue siendo libre y el cupo se renueva en la siguiente jornada.</li></ul>
<div class="dos">${fig(I.tirada, 'Decisión con prueba de Cordura: valor necesario, probabilidad (≈ 58 %) y consecuencias si se supera o se falla.')}${fig(I.mercado, 'Mercado de Puerto Lápice tras dos compras: el cupo está lleno y los botones de compra, desactivados.')}</div>
</section>

<section><h2><small>6 · Técnica</small>Rendimiento y pruebas</h2>
<table><tr><th>Requisito</th><th>Límite</th><th>Medido</th></tr>
<tr><td>Tamaño del archivo</td><td>&lt; 1,2 MB</td><td>${kb(R.bytes)} · ${kb(R.gzip)} con gzip</td></tr>
<tr><td>Carga en móvil medio (CPU 4× más lenta, 4G lenta)</td><td>&lt; 2 s</td><td>${(g.load / 1000).toFixed(2).replace('.', ',')} s con gzip · primer pintado en ${g.fcp} ms</td></tr>
<tr><td>Fluidez</td><td>60 fps</td><td>${m4.mills.fpsPagina} fps de página, peor fotograma ${m4.mills.peorFotogramaMs} ms (escena de molinos, CPU 4×)</td></tr>
<tr><td>Pestaña oculta / movimiento reducido</td><td>sin bucle</td><td>bucle detenido · ${R.movimientoReducido}</td></tr>
<tr><td>Dependencias externas</td><td>ninguna</td><td>ninguna</td></tr></table>
<p>El motor usa un único <code>requestAnimationFrame</code> compartido por la escena, el texto letra a letra, el menú y la introducción. Compone a 30 Hz cuando hay acción y a 12 Hz en reposo (los sprites se animan a 8 fotogramas por segundo), con los fondos precompuestos en caché y los de las escenas siguientes preparados en tiempo ocioso.</p>
<h3>Pruebas automáticas</h3>
<table><tr><th>Prueba</th><th>Qué comprueba</th></tr>
<tr><td><code>tests/simular.js</code></td><td>Miles de partidas aleatorias en jsdom: destinos inexistentes, escenas sin salida, errores de JavaScript y partidas que no terminan.</td></tr>
<tr><td><code>tests/mercado.js</code></td><td>Límite de dos compras por visita, venta libre, renovación por jornada y compatibilidad con partidas antiguas.</td></tr>
<tr><td><code>tests/capturas.js</code></td><td>238 capturas (119 escenas en escritorio y móvil) con detección de texto desbordado, personajes fuera de cuadro o solapados y contraste insuficiente.</td></tr>
<tr><td><code>tests/rendimiento.js</code></td><td>Tamaño, tiempos de carga, fps y parada del bucle.</td></tr></table>
<div class="nota">Las partidas guardadas (<code>hidalgo</code>, <code>hidalgo_prof</code>, <code>hidalgo_cfg</code>, <code>hidalgo_gm</code>) siguen siendo válidas: las únicas claves nuevas (<code>tw</code> y <code>mk</code>) son opcionales.</div>
</section>

<section><h2><small>7 · Defensa</small>Decisiones de arte y cómo defenderlas</h2>
<table><tr><th style="width:32%">Decisión</th><th>Defensa</th></tr>
<tr><td>Pixel art procedural en vez de dibujado a mano</td><td>Única forma de cumplir a la vez «un solo HTML», «sin imágenes pesadas» y menos de 1,2 MB con 25 fondos y más de 60 personajes animados; garantiza coherencia de escala y de luz. Es arte original, ni copiado ni generado por imagen.</td></tr>
<tr><td>Paleta de 32 colores intercambiable por hora</td><td>Técnica de <i>palette swapping</i> de los 16 bits: un mismo dibujo se relee al alba, a mediodía, al ocaso o de noche. La gama (ocres, bermellón, cal, sombras violáceas) sale de la luz manchega y de la pintura española del XVII.</td></tr>
<tr><td>El juego entero como libro que se pasa</td><td>La obra trata de un hombre que vive dentro de los libros; jugar es literalmente pasar páginas. El folio y la hoja que gira convierten el progreso del juego en progreso de lectura.</td></tr>
<tr><td>Libro de encuadernación superior en el móvil</td><td>Dos páginas laterales en 390 px dejarían el texto ilegible; abrir el libro en vertical conserva la metáfora (dos páginas y un lomo) y la legibilidad.</td></tr>
<tr><td>Alegorías para La Razón y El Caballero</td><td>Son voces críticas, no personajes; representarlas como emblemas remite a Alciato y Covarrubias, contemporáneos de Cervantes, y los marcos fríos y cálidos codifican la tensión entre cordura y locura.</td></tr>
<tr><td>Paisaje «entre páginas»</td><td>Distingue visualmente lo que ocurre en la cabeza del hidalgo de lo que ocurre en la Mancha, sin añadir texto.</td></tr>
<tr><td>Tensión diegética (viñeta, grano)</td><td>Solo bajo umbrales que ya usa la lógica original y solo sobre la escena: el jugador siente el desgaste antes de leer la cifra.</td></tr>
<tr><td>Probabilidad visible en los dados</td><td>No cambia la regla; hace explícito un riesgo que antes había que calcular, y convierte la decisión en una apuesta informada.</td></tr>
<tr><td>Dos compras por mercado</td><td>Obliga a elegir qué llevar en las alforjas, en línea con la penuria del camino en la novela, sin bloquear la venta.</td></tr></table>
<h3>Historial de esta versión</h3>
<ul><li>Fases 0–4: dirección de arte, motor visual en lienzo, 25 escenarios y personajes, interfaz de pergamino, pruebas y capturas.</li>
<li>Optimización del motor (clic de 90–156 ms a 16–32 ms con CPU 4×) y menús dibujados por el motor.</li>
<li>Interfaz de libro abierto con cambio de página y mercados de dos compras; libro también en pantallas medianas y en el móvil en vertical.</li>
<li>Pantalla completa e introducción legible.</li>
<li>Esta entrega: sombras, luz de borde, parpadeo, bruma, haces de sol y pájaros; capitulares, orlas, papel envejecido y cinta marcapáginas; vista previa de efectos y probabilidad de los dados.</li></ul>
</section>
</body></html>`;
}

(async () => {
  const b = await chromium.launch();
  const I = await capturas(b);
  const p = await b.newPage();
  await p.setContent(html(I), { waitUntil: 'load' });
  await p.pdf({ path: SALIDA, format: 'A4', printBackground: true, margin: { top: '16mm', bottom: '18mm', left: '15mm', right: '15mm' },
    displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: '<div style="width:100%;font:7.5pt Georgia,serif;color:#8a6a3a;text-align:center"><span style="font-style:italic">El ingenioso hidalgo · Dossier</span> · <span class="pageNumber"></span></div>' });
  await b.close();
  console.log('PDF: ' + SALIDA + ' (' + (fs.statSync(SALIDA).size / 1024).toFixed(0) + ' KB)');
})();
