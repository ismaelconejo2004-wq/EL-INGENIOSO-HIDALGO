# Registro de cambios

## Número de versión (2.7.0)

- El menú principal muestra la versión del juego bajo el pie, y los ajustes del Libro del hidalgo también.
- Nuevo `VERSIONES.md` con el historial numerado desde la 1.0.0, que es el juego original de texto.
- La versión se define en `const VERSION_JUEGO` (`index.html`) y en `package.json`. La prueba `tests/version.js` exige que coincidan con la primera entrada de `VERSIONES.md` y que el historial esté ordenado.
- `CLAUDE.md` y el README recogen la regla: cada cambio sube la versión.

## Pluma y tintero vistos desde arriba

- **Perspectiva cenital.** La pluma y el tintero se dibujan ahora como se ven desde arriba, igual que la mesa. Ya no hay perfiles laterales ni sombras borrosas de CSS: cada objeto proyecta su propia sombra tramada en pixel art, desplazada en dirección contraria a la vela.
- **Pluma:** está tumbada y ligeramente curvada, y se dibuja píxel a píxel. Tiene la barba ancha con sombreado tramado y barbas inclinadas hacia la punta, la barba estrecha en sombra, dos barbas separadas en el borde, plumón en la base, un cañón translúcido y el plumín mojado, con dos gotas de tinta.
- **Tintero de loza de Talavera:** tiene planta ochavada con biseles iluminados según su orientación, vidriado blanco con flor y filete azules, collar de latón, la tinta con el reflejo de la vela, un reguero que resbala por la tapa y gotas en la mesa.

## Escritorio con pluma y tintero; Sancho se va de verdad; nueva Compañía

- **Mesa, no suelo.** El tablero ahora son dos tablas anchas encoladas, con veta larga, arcos de catedral, un nudo por tabla y brillos de barniz gastado. Se quitaron los clavos, los topes entre tablas y los tablones estrechos que lo hacían parecer un entarimado. Los colores no cambian.
- **Pluma y tintero.** A la izquierda del libro hay una pluma de ave con el cañón manchado de tinta; a la derecha, un tintero de barro vidriado con collar de latón y dos gotas en la mesa. Ambos se dibujan con código en pixel art y se ocultan en pantallas de menos de 1200 px, donde el libro necesita todo el ancho.
- **Si la lealtad de Sancho llega a 0, se marcha para siempre.** Las dos opciones de la despedida aceptan su marcha (abrazarlo o volverle la espalda), y ya no se le puede retener con una promesa. A partir de ahí no aparece en la escena (tampoco el rucio), la barra de Sancho dice «se fue», desaparece su voz interior y sus intervenciones se convierten en «El recuerdo de Sancho».
- **Nueva pestaña de Compañía.** Cada acompañante tiene una ficha con su retrato pixelado, su papel, su estado y una cita:
  - **Sancho:** lealtad con barra y descripción, el rucio (o su robo), la ínsula, los encargos y si fue armado caballero.
  - **Rocinante:** sus jornadas contigo y sus percances.
  - **Compañeros temporales:** la comitiva de Micomicona, Bárbara de Villalobos y don Álvaro Tarfe en el apócrifo.
  - **Aldonza Lorenzo:** si le pides que viaje contigo, te acompaña hasta el final, y su desenlace pasa a ser «Aldonza, en el camino» en lugar de colgar la armadura.
  - **Ausentes y recuerdos:** los ausentes (Sancho, con la jornada en que se fue) y la lista de quién te recuerda con aprecio o rencor.
- Nueva prueba `tests/compania.js` dentro de `npm test`.

## Pasar página como un libro de verdad, y una mesa de madera

- **La página anterior ya no se queda tapando la nueva.** La hoja que gira era una copia completa de la página (texto, retratos y lienzos): en dispositivos lentos tardaba en empezar a moverse y, mientras tanto, mostraba la decisión anterior. Ahora es un papel ligero con el título y el comienzo del texto anterior, que arranca al instante.
- **Giro con ritmo humano (0,95 s).** La hoja se despega despacio, acelera en el aire y se posa sobre la página izquierda, con una leve curvatura y una sombra sobre la página nueva. También se corrige un fallo de Chrome: al animar la opacidad de la hoja, el dorso desaparecía a mitad del giro; el desvanecimiento final pasa al dorso.
- **Mesa de madera rústica** bajo el libro, en pixel art generado por código: tablones con veta, nudos, juntas y clavos, con un charco de luz cálida de vela y la sombra del libro. El libro deja un margen mayor en escritorio para que se vea la mesa.

## Agilidad: página, texto y arranque

- **Cambio de página sin restos.** La hoja de la decisión anterior se retira a los 0,56 s con un temporizador exacto, sin depender del evento `animationend`, que algunos navegadores retrasaban hasta 1,6 s. Su cara se apaga a mitad del giro (aunque el navegador no oculte bien la cara trasera en 3D) y termina transparente. Si se decide muy deprisa, la hoja anterior desaparece al instante.
- **Texto estático.** Se elimina el efecto de letra a letra y su ajuste: el relato aparece completo al llegar a cada página.
- **Arranque sin destello.** Un script mínimo en `<head>` oculta la página hasta que el motor ha pintado el primer fotograma del menú, así que ya no se ve un instante la interfaz antigua. Si algo fallara, la página se muestra igualmente a los 4 s.

## Narrativa revisada para el tribunal

**Primera ronda (`d06f81f`)**
- **Primera salida** (I, 2-7), que faltaba: la primera venta y el armado caballero, Andrés y los mercaderes toledanos, el escrutinio de la librería y el sabio Frestón. El hidalgo sale solo y Sancho se une en la segunda salida, como en la novela.
- **Fidelidad**. Se han corregido datos y añadido citas:
  - los treinta o cuarenta molinos y Frestón;
  - Cide Hamete y el Alcaná de Toledo;
  - la Edad de Oro;
  - el Caballero de la Triste Figura;
  - la cueva de Montesinos (una hora, el primo humanista);
  - los corsarios franceses del cautivo;
  - Ana Félix y don Gregorio;
  - la muerte de don Vicente;
  - el desenlace de Tosilos;
  - el escudero de Avellaneda, que también se llama Sancho;
  - los consejos a Sancho;
  - los agüeros de II, 73 y el testamento de II, 74;
  - los capítulos exactos.
- **Ecos entre historias**:
  - Andrés vuelve en Sierra Morena;
  - Ginés roba el rucio y Sansón comenta el descuido;
  - el baciyelmo;
  - los azotes cumplidos en las hayas;
  - el doble de tinta;
  - la carta y el saludo a Aldonza;
  - Tarfe entre las dos novelas.
- **Finales**:
  - el canónico (la muerte de Alonso Quijano) es el habitual: basta Cordura 50 al volver a casa;
  - cada desenlace tiene su propio texto, con el epitafio de Sansón y la pluma de Cide Hamete;
  - los finales del apócrifo contrastan las dos segundas partes.
- **Glosa del cronista** en cada escena: fiel, adaptado, hipotético, Avellaneda o incidente del juego.

**Segunda ronda: correcciones del informe del tribunal simulado (`docs/EVALUACION_TRIBUNAL.md`)**
- Voz narrativa única en segunda persona, salvo el lecho de muerte.
- Puentes coherentes con la escena de llegada.
- Voces del ánimo variadas, espaciadas y fuera de los desenlaces.
- Sin mercado ni consejos en las escenas finales.
- Saltos de lectura señalados dentro de la ficción.
- Desvíos del modo Pesadilla solo hacia delante y dentro de la misma parte.
- Cierres de los puentes variados.
- Página **Fuentes y criterios** en el Libro del hidalgo.
- Epílogos ajustados.
- Ecos del rebuzno (II, 25-27), la sima (II, 55) y las cartas de Teresa (II, 50-52).
- En el lecho, el ama y el cura velan al enfermo desde el otro lado de la alcoba.

## Más calidad y dossier en PDF

Mejoras gráficas y estéticas sin cambiar textos, reglas ni números:
- **Gráficos**: sombras de contacto bajo cada figura, luz de borde que da volumen a personajes y animales, parpadeo, bruma del color del horizonte entre los planos, haces de sol al amanecer y al ocaso, tinte rosado al alba y bandadas lejanas.
- **Narrativa** (presentación): capitular iluminada en el primer párrafo de cada escena, orla con florón bajo el título y la frase puente como nota al margen.
- **Mecánicas** (presentación):
  - al señalar una decisión, las barras muestran con franjas cuánto subiría o bajaría cada estadística;
  - las pruebas de dados indican su probabilidad (≈ %), tanto en la opción como en la carta de la tirada.
- **Estética**: papel con fibra y manchas del tiempo, esquinas ornamentadas y cinta marcapáginas.
- **Dossier**: `docs/El-ingenioso-hidalgo-dossier.pdf`, 9 páginas A4 con capturas actuales. Se regenera con `npm run dossier` (`tools/dossier.js`).

## Libro también en el móvil en vertical

- En un móvil en vertical (menos de 700 px de ancho) el juego ya no se apila en una sola columna. Ahora es un **libro de encuadernación superior**, como un cuaderno abierto:
  - página de arriba con las estadísticas (icono y cifra), la escena y las pestañas;
  - lomo horizontal;
  - página de abajo con el relato y las decisiones.
- Cada página se desplaza por dentro y el libro ocupa toda la pantalla.
- **En cada decisión la hoja de abajo se levanta sobre el lomo** y cae sobre la de arriba.
- Al girar el móvil en horizontal aparece el libro clásico de dos páginas, una al lado de la otra.

## Libro de dos páginas en cualquier pantalla

- El libro abierto, con la hoja que gira en cada decisión, se mantiene desde 700 px de ancho: portátiles con zoom, tablets y móviles en horizontal. Antes, por debajo de 960 px las páginas se apilaban en una sola columna y parecía que el libro había desaparecido.
- El alto del libro se ajusta a la ventana en vez de exigir 600 px. En pantallas bajas se compactan las estadísticas (solo icono y cifra), se ocultan las voces y el folio, y la página izquierda se desplaza si no cabe.
- En pantallas medianas, la letra, los márgenes y los botones de decisión se ajustan para que quepan dos páginas.
- Solo los móviles en vertical (menos de 700 px) apilan las páginas. Allí la hoja también gira sobre su borde izquierdo.

## Restauración, pantalla completa e introducción legible

- **Restaurado el aspecto del libro abierto con el arte generado por código.** El commit `0fedcd2` de `main` lo había sustituido por sprites PNG de un pack. Las imágenes siguen en el historial y en las ramas `sprites-*`.
- **Pantalla completa**:
  - botón en la cabecera del libro (icono, con descripción emergente) y en el menú principal;
  - tecla **F**;
  - interruptor «Pantalla completa (tecla F)» en Ajustes;
  - el libro se ajusta al alto de la pantalla y se oculta la ayuda de teclado;
  - en navegadores sin la función (iPhone) aparece un aviso.
- **Introducción legible sobre cualquier fondo**: el texto va sobre una banda oscura translúcida con borde dorado y contorno en las letras. El título final lleva un halo oscuro y la ayuda y «Saltar» tienen fondo propio.

## El juego como libro abierto y mercados limitados

- **Toda la interfaz es un libro abierto** con tapa de cuero, lomo, cantos de hojas y folio al pie de cada página, que avanza con las jornadas:
  - **Página izquierda:** las cinco estadísticas en formato compacto, el estado (crisis), las voces interiores, la **escena animada** y unas pestañas de **Alforjas, Ruta, Cuaderno y Compañía**.
  - **Página derecha:** la época y los botones (Menú, Volver al principio) en la cabecera, el relato, las voces con retrato y las **decisiones**.
- **Cambio de página en cada decisión**: la hoja derecha (una copia de la página anterior) gira sobre el lomo, deja ver la siguiente y su dorso cae sobre la izquierda, con el sonido de página. Sustituye al iris del lienzo. El texto letra a letra empieza cuando la hoja ya ha descubierto la página. Con movimiento reducido el cambio es instantáneo.
- **En pantallas estrechas** (menos de 960 px) las páginas se apilan en este orden: escena con estadísticas, relato con decisiones y pestañas. La hoja se levanta y se desvanece.
- **Temas**: el tema noche usa en el libro una paleta oscura propia en lugar de invertir colores. Bosque y contraste siguen con su filtro, sin tocar el lienzo.
- No cambia ningún `id` ni la lógica: los nodos del juego se recolocan dentro del libro. Si no hay lienzo (por ejemplo en jsdom), la interfaz clásica de tres columnas sigue intacta.
- **Mercados: como mucho dos compras por visita** (regla de juego, en el script principal):
  - el mercado muestra «Compras en este mercado: n de 2» y desactiva la compra al llegar al límite;
  - vender sigue libre;
  - el cupo se renueva en la siguiente jornada (otra visita);
  - se guarda en la clave nueva y opcional `state.mk`, así que las partidas antiguas siguen valiendo;
  - lo comprueba `tests/mercado.js`, incluido en `npm test`.

## Optimización y menús nuevos

- **Rendimiento**:
  - fondo precompuesto, luces y viñetas cacheadas y desaturación por CSS;
  - composición a 30 Hz con acción y 12 Hz en reposo (la página sigue a 60 fps);
  - clics sin pintado síncrono ni lecturas de geometría forzadas (de 90–156 ms a 16–32 ms con CPU 4× más lenta);
  - fondos de las escenas siguientes precalentados en tiempo ocioso;
  - texto letra a letra y mapa lateral más baratos.
  - Detalle en `docs/RENDIMIENTO.md`.
- **Menú principal** con fondo animado por el motor (los molinos al ocaso y don Quijote y Sancho cabalgando con parallax) en lugar del SVG. Carta de pergamino con marco pixelado, escudo y botones-tablilla con iconos (Continuar, Jugar, Ajustes, Salida) que se vuelven rojos al pasar por encima. Medallones pixel art para el Modo clásico y el Modo Pesadilla.
- **Introducción** sobre la misma escena, de la noche (luna, luciérnagas) al amanecer en fundido. En Pesadilla, ocaso con niebla.
- **Libro, mercado y tirada** con el mismo marco. Cintas del libro con iconos, interruptores y deslizadores de Ajustes con los colores del juego.

## Rediseño visual (rama `claude/hidalgo-visual-upgrade-pip31k`)

No cambian la historia, las escenas, las opciones, los efectos numéricos ni el equilibrio: solo cómo se ve y se anima el juego. Las partidas guardadas (`hidalgo`, `hidalgo_prof`, `hidalgo_cfg`, `hidalgo_gm`) siguen valiendo. Solo se añade a `hidalgo_cfg` la clave opcional `tw` (texto letra a letra), con valor 1 por defecto.

### Fase 0 · Dirección de arte
- `docs/ARTE.md`: estado de partida, inventario de fondos y personajes, problemas detectados (P1–P11), paleta de 32 colores × 4 momentos del día y asignación escena por escena.

### Fase 1 · Motor visual
- El escenario es un **lienzo de 320–400 × 180** (ancho elástico para escalar siempre por enteros) con `image-rendering: pixelated`.
- **Un único bucle `requestAnimationFrame`**:
  - compone cielo, tres capas de parallax, suelo, actores, partículas, primer plano, luces y postproceso;
  - se detiene con la pestaña oculta, con el lienzo fuera de vista, con menús abiertos y con movimiento reducido.
- **Luz por estado**:
  - Cordura baja: viñeta violeta y el horizonte ondula.
  - Salud baja: viñeta roja que late.
  - Saciedad baja: desaturación y grano.
- **Transiciones**: cierre en iris entre escenas y cortinilla de página al cambiar de parte o de rama. Los personajes **entran caminando** hasta su marca.
- **Cajas de diálogo con retrato**:
  - marcos alegóricos para La Razón (plata) y El Caballero (oro y fuego), y marcos propios para el Impostor y para El Cuerpo y El Estómago;
  - texto letra a letra que se puede saltar, con la boca del retrato y del personaje animada mientras habla.
- **Dados sobre el escenario**: caen, rebotan, muestran ÉXITO o FALLO y don Quijote reacciona. La carta de la tirada se conserva, más compacta y anclada abajo.
- Código en `src/` y `tools/build.js`, que lo incrusta. `index.html` sigue siendo un único archivo.
- Se quitan Google Fonts y un envoltorio HTML duplicado de una exportación.

### Fase 2 · Escenarios, personajes y efectos
- **25 fondos base** dibujados por código:
  - camino con 4 regiones; incluye molinos, llanura, vado, venta (exterior e interior), majada, encinar, pinar, Sierra Morena, plaza, ciudad, casa noble, salón y liza de los duques, calabozo, Ebro, batanes, cueva de Montesinos, playa de Barcelona y un paisaje «entre páginas»;
  - props: cruz de término, puente, carro-jaula, carreta de la Muerte, coche, retablo, manta, catafalco, Clavileño, barca y galeras.
- **Personajes por capas** (cuerpo, traje, tocado, barba y accesorio), con reposo, caminar, hablar y golpe o reacción, más poses de montado, de rodillas, leyendo y tendido:
  - don Quijote (con celada, o con bacía si llevas el yelmo de Mambrino), Alonso Quijano y Sancho;
  - Rocinante y el rucio como actores propios;
  - los 12 tipos pedidos y 50 variantes;
  - ovejas, cerdos, yeguas y león.
- **Efectos**: polvo del camino, lluvia con salpicaduras, niebla en dos capas, luciérnagas, chispas de la hoguera, brillo en el yelmo, aspas girando, olas, banderas y mazos del batán.
- Paletas nocturnas derivadas («lumbre» y «luna»).
- Se retiran los 62 KB de PNG en base64.

### Fase 3 · Interfaz
- Panel lateral en **pergamino barroco** con marco pixelado, **iconos pixel art** e **barras animadas**: estela al bajar, pulso y números flotantes «+5» y «−3».
- **Opciones como botones ilustrados**: medallón con el efecto principal y chips con icono y color. Se conserva todo el texto: efectos, objetos ganados o perdidos, prueba de dados y lo que pasa si la superas o fallas.
- Mapa, alforjas y libro con el mismo marco e iconos.
- Temas noche, bosque y contraste, y tamaño de texto, comprobados.

### Fase 4 · Pruebas y medidas
- `tests/simular.js`: miles de partidas en jsdom con 4 procesos. Comprueba destinos `next` y redirecciones (`RD`) inexistentes, escenas sin opciones, errores de JS y partidas que no terminan.
- `tests/capturas.js`: **238 capturas** (119 escenas × escritorio 1280×720 y móvil 390×844) en `tests/capturas/`, con informe automático (`informe.json`) de texto desbordado, actores fuera del lienzo o solapados y contraste de las cajas de voz. Resultado: 0 problemas, revisado también a ojo.
- `tests/rendimiento.js` y `docs/RENDIMIENTO.md`: 507 KB, carga de 1,3 s en móvil medio simulado (con gzip), 60 fps estables, bucle detenido con la pestaña oculta y con movimiento reducido.

### Hallazgo en la lógica original (no corregido, por estar fuera del alcance)
- Entre 1 y 3 de cada 2000 partidas aleatorias (0,05–0,15 %) no llegan al final en 400 pasos. El rastro muestra **ciclos amplios de rutas**: por ejemplo, una partida recorre toda la Segunda parte (`toboso > muerte > espejos > gaban > leones > … > avellaneda > impostor`) y vuelve a empezarla. Ocurre igual en el commit original `72995ec`, así que no lo causa el motor visual. La prueba lo trata como aviso hasta el 0,5 % y muestra las últimas 24 escenas para depurarlo.

---

## Decisiones de arte arriesgadas y cómo defenderlas ante el tribunal

1. **Pixel art procedural en lugar de dibujado a mano.**
   - *Riesgo:* «parece hecho por un programa».
   - *Defensa:* era la única forma de cumplir a la vez «un solo HTML», «sin imágenes base64 pesadas» y «menos de 1,2 MB» con 25 fondos y más de 60 personajes animados. El sistema por capas garantiza coherencia de escala y de luz entre todas las figuras, algo difícil a mano. Comprimido, el archivo pesa lo mismo que el original (170 KB). Es arte original, ni copiado ni generado por imagen.

2. **Paleta de 32 colores intercambiable por hora del día, sin filtros de color.**
   - *Riesgo:* parece una limitación innecesaria.
   - *Defensa:* es la técnica del *palette swapping* de los juegos de 16 bits. Un mismo dibujo se relee al amanecer, a mediodía, al ocaso o de noche, y los personajes se integran solos en la luz de la escena. La paleta cálida (ocres, bermellón, cal) con sombras violáceas sale de la luz manchega y de la pintura española del XVII, no de ningún juego concreto.

3. **Alegorías para La Razón y El Caballero en vez de dar cara a don Quijote.**
   - *Riesgo:* el jugador espera ver al protagonista.
   - *Defensa:* las voces interiores no son personajes de la novela, sino lectura crítica del juego. Representarlas como **emblemas** (una dama con compás y lámpara, y un yelmo cerrado con fuego tras la visera) remite a los libros de emblemas del Siglo de Oro (Alciato, Covarrubias), contemporáneos de Cervantes. Los marcos fríos y cálidos codifican además la tensión entre cordura y locura que miden las estadísticas.

4. **Un paisaje «entre páginas» para el sueño, la fiebre y la locura.**
   - *Riesgo:* rompe el realismo del resto de escenarios.
   - *Defensa:* es la metáfora central de la obra: el hidalgo que se mete en los libros. El grabado a plumilla sobre papel, con letras que flotan, distingue visualmente lo que ocurre en la cabeza de don Quijote de lo que ocurre en la Mancha, sin añadir texto.

5. **Corregir el reparto visual (quién aparece en escena) sin tocar el texto.**
   - *Riesgo:* «has cambiado el juego».
   - *Defensa:* el original mostraba figuras que contradecían el texto: un estudiante como pescador, el ama como condesa Trifaldi, Sancho repetido o una duquesa sin duque. Solo cambia la ilustración; textos, opciones, efectos y rutas son idénticos, como prueban las simulaciones de partidas antes y después. Todos los cambios están en una tabla legible (`src/vis/30-escenas.js`) y en el Anexo A de `docs/ARTE.md`.

6. **Texto letra a letra activado por defecto.**
   - *Riesgo:* ralentiza a quien lee rápido y puede perjudicar la accesibilidad.
   - *Defensa:* el texto completo está en el DOM desde el principio (solo se enmascara visualmente), así que los lectores de pantalla lo leen entero. Se salta con un toque o una tecla, elegir una opción lo completa, y se desactiva solo con movimiento reducido o modo rápido. Además hay un interruptor en Ajustes.

7. **Viñeta y grano por estado (tensión diegética en lugar de solo números).**
   - *Riesgo:* «oscurece el juego».
   - *Defensa:* solo se activa por debajo de umbrales que ya usa el código original (`isTense`: Salud y Cordura < 25, Saciedad < 20) y solo afecta al lienzo, nunca al texto. El jugador *siente* el desgaste antes de leer la cifra, que es justo lo que propone la referencia estética: el estado del reino se ve en la escena.

8. **Quitar las fuentes tipográficas descargadas.**
   - *Riesgo:* el aspecto tipográfico es menos «antiguo».
   - *Defensa:* lo exige la regla de cero dependencias, y además la carga es el doble de rápida: Google Fonts bloqueaba el renderizado. Los nombres de las fuentes originales siguen en el CSS como alias `local()` a tipos serif del sistema (Palatino, Iowan, Georgia), y el aire de época lo aporta ahora la fuente de mapa de bits propia del escenario.

9. **El escenario no se mueve arriba del todo, como se propuso en la Fase 0.**
   - *Defensa:* al probarlo, la caja de voz superpuesta tapaba los pies de los personajes, y poner la escena antes de la narración invertía el orden de lectura (voz antes que narración). El «marco» escenario + diálogo entre la narración y las opciones conserva el orden del texto original y el aspecto de escena con caja de diálogo.
