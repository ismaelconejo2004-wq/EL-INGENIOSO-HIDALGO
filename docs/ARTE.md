# Dirección de arte · El ingenioso hidalgo

Fase 0 del rediseño visual. Este documento describe cómo se pinta hoy el juego, qué arte existe, qué falta y la dirección de arte que propongo. No incluye código. **Espera visto bueno antes de empezar la Fase 1.**

> La referencia estética («Yes, Your Grace») se usa solo como guía de *tono*: pixel art pictórico, escenas de perfil con profundidad, luz cálida contrastada y diálogo en cajas con retrato. No se copia ningún sprite, fondo, interfaz, nombre ni texto. Todo el arte se genera por código y se ambienta en la Mancha de 1600.

---

## 1. Estado actual (lectura de `index.html`)

### 1.1 Cifras

| Dato | Valor |
|---|---|
| Tamaño del archivo | 429 KB (861 líneas, muchas de varios KB) |
| Escenas en `scenes` | **119** (31 son incidentes, alertas o crisis `ev_*`) |
| Opciones | 341, de las cuales 72 llevan prueba de dados |
| Sprites (`SPR`) | 48 PNG en base64, de un solo fotograma, ~62 KB en total |
| Fondos (`bgSVG`) | 19 claves SVG vectoriales, 600×220 |
| Voces (`voice`) | todas las escenas tienen exactamente una: Sancho 51, La Razón 43, El Caballero 21 y 4 puntuales (El Impostor, Claudia, El Estómago, El Cuerpo) |
| Errores de JS al cargar | ninguno (comprobado con Chromium sin red) |

### 1.2 Cómo se pinta hoy una escena

1. `render()` (encadenado varias veces: `_render0`, `_r6`…; cada fase envuelve a la anterior) compone el HTML de la columna central: lugar, título, párrafos de `body`, la caja `voice`, el escenario y las opciones.
2. **Escenario** (`stageHTML()`): una `<figure class="stage">` de 236 px de alto (156 px en móvil) con:
   - **Fondo**: `bgSVG(st.bg)` dibuja un SVG con un degradado de cielo y unas pocas formas planas (colinas, árboles en piruleta, casas en caja, molinos, castillo, olas). Hay 19 claves: `cuarto, patio, casa, noche, camino, molinos, bosque, campo, venta, sierra, aldea, castillo, ciudad, mar, rio, playa, banquete, lluvia, cueva`.
   - **Suelo**: una franja `.stg-gr` con `repeating-linear-gradient`, que se desplaza en las escenas `walk`.
   - **Actores**: `<img>` con los PNG de `SPR`, `image-rendering: pixelated`, escalados ×2 (×1 en móvil). A la izquierda van siempre Sancho (con el rucio, en un solo sprite) y don Quijote (con Rocinante, también en un solo sprite), salvo en las escenas de `NOSAN`. A la derecha, los PNJ de la columna 4 de `STG`, volteados con `scaleX(-1)`.
   - **Animación**: solo CSS sobre el sprite entero. Hay 11 «actuaciones» (`an`): `talk` 62, `watch` 13, `fight` 12, `bow` 9, `walk` 7, `sleep` 5, `faint` 4, `read` 2, `fly` 2, `toss` 2 y `eat` 1. Son balanceos, embestidas por `translateX`, rotaciones y glifos tipográficos (✦, «z Z z», ♨, bocadillos «…»).
   - **Datos**: una tabla de texto `STG` (`escena|fondo|izquierda|derecha|anim|pie`) que se convierte en `ST`, más añadidos posteriores (`STG6`, `Object.assign(ST,…)`). `stOf()` devuelve `camino/walk` por defecto.
3. **`illustration(scene, i)`**: una viñeta SVG de 80×70 por opción. Solo tiene arte específico para `start/book/vision`, `sancho` y `yard/helmet`; **en el resto de escenas todas las opciones muestran el mismo dibujo genérico** (cruz de lanzas o similar, según el índice).
4. **Dados**: modal `#modal` con dos dados CSS (`setDie`), fuera del escenario.
5. **Menú e introducción**: SVG grandes a pantalla completa (1200×800) con molinos animados (`.blades`), amanecer y estrellas.
6. **Libro** (perfil, alforjas, logros, diario, ruta, ajustes): modal con aspecto de libro abierto, cintas de colores y el mapa SVG con filtros `feTurbulence`.
7. **Temas** (`CFG.theme`): `pergamino`, `noche` (`filter: invert(.9) hue-rotate(180deg)` sobre `.app`), `bosque` (`hue-rotate`) y `contraste` (`contrast(1.35) saturate(.5)`). **Ojo:** cualquier escenario pixel art que viva dentro de `.app` quedaría invertido en el tema noche. Hay que excluirlo del filtro (ver §6.5).
8. **Animación global**: `CFG.anim` (clase `body.noanim`) y `@media (prefers-reduced-motion)` ya desactivan las animaciones del escenario. **No hay ningún `requestAnimationFrame` ni escucha de `visibilitychange`.**

### 1.3 Problemas detectados que afectan al arte

| # | Problema | Escenas |
|---|---|---|
| P1 | **Sancho sale dos veces** (a la izquierda por defecto y otra vez en la lista de PNJ) | `ev_barca`, `ev_lluvia`, `ev_rucio`, `sancho_cuenta`, `torneo` |
| P2 | **`claudia` no tiene entrada en `ST`**: sale `camino/walk` genérico, sin Claudia | `claudia` |
| P3 | Caballo duplicado: se usa `yegua` para representar a Rocinante, que ya está montado por don Quijote | `ev_rocin` |
| P4 | Montura y jinete son un único PNG: no se puede desmontar, caer del caballo, mantear a Sancho sin el rucio ni hacer que Rocinante «se plante» | `faint`, `toss`, `ev_caida`, `ev_rocin`, `yangueses` |
| P5 | Reparto que no encaja con el texto: un estudiante hace de pescador, un galeote de bandolero, el ama de condesa Trifaldi y de litigantes de Barataria, un cura y un carretero de disciplinantes, un comediante de pregonero, y la duquesa recibe sin el duque | `ev_pescador`, `ev_bandolero`, `trifaldi`, `barataria`, `disciplinantes`, `ev_pregonero`, `duques` |
| P6 | Fondos que no encajan: Clavileño en «castillo» con una yegua; Casa del Nuncio y cárcel en «casa» o «ciudad»; declaración ante escribano en «ciudad»; los batanes y la fiebre en una «noche» genérica | `booktrap`, `toledo`, `a_azotado`, `tarfe`, `batanes`, `ev_fever` |
| P7 | 10 de las 48 figuras femeninas son la misma plantilla recoloreada, y 4 PNJ masculinos comparten silueta | — |
| P8 | Escalas incoherentes: los animales miden 22-24 px de alto (el león es más bajo que una oveja), y los PNJ van de 68 a 79 px | `leones`, `sheep`, `cerdos` |
| P9 | No se indica la hora: solo 19 escenas la mencionan en el texto (5 amanecer, 11 noche, 3 tarde) y el resto se pinta siempre a pleno día salvo `bg:noche` | todas |
| P10 | Dependencia externa: Google Fonts (`<link>` y `@import`), lo que incumple la regla de cero dependencias. La línea 1 trae además un `<!doctype><html><head>…<body>` sobrante de una exportación, antes del documento real | — |
| P11 | **El repositorio no tiene pruebas** (ni `tests/` ni `package.json`). Las pruebas de Node y jsdom de la Fase 4 hay que crearlas, no mantenerlas | — |

---

## 2. Inventario

### 2.1 Fondos: lo que hay y la propuesta

Propongo **25 escenarios base**. Cada uno es una función que pinta en canvas con la paleta indexada (§3.2) y tiene tres capas de parallax, un suelo, un primer plano y puntos de anclaje para props y actores. Las variaciones se hacen por **hora** (4 paletas), **clima** (polvo, lluvia, niebla, antorchas, luciérnagas) y **props** opcionales.

| # | Id | Escenario | Sustituye a | Props y variantes | Escenas |
|---|---|---|---|---|---|
| 1 | `biblioteca` | Aposento con estantes, vela y libros apilados | `cuarto` | vela encendida, libro abierto | 2 |
| 2 | `alcoba` | Alcoba del hidalgo: cama de cordeles, crucifijo, ventana | `cuarto`/`casa` | ama y cura al pie | 2 |
| 3 | `patio` | Patio de casa hidalga: pozo, poyo, armadura colgada | `patio` | armadura en el poyo o puesta | 2 |
| 4 | `cocina` | Cocina labriega: lar, olla, ristras de ajo | `casa` | Teresa, mesa | 1 |
| 5 | `camino` | Camino real de perfil, con cuatro sub-paisajes según `LOC`: Mancha llana, olivar, ribera aragonesa, costa catalana | `camino` | cruz de término, carreta, coche de camino, carro-jaula, puente con garita, mojón | 29 |
| 6 | `molinos` | Loma de Criptana con molinos (aspas girando) | `molinos` | — | 1 |
| 7 | `llanura` | Campo de Montiel: rastrojo, encina solitaria, cielo enorme | `campo` | rebaños, charco, pedregal, melonar | 10 |
| 8 | `vado` | Arroyo con chopos y prado | `campo` | yeguas, barca | 3 |
| 9 | `venta` | Exterior de venta: tapia, portalón, pozo, abrevadero; de noche, el patio con la manta | `venta` | manta, carro | 4 |
| 10 | `ventainterior` | Sala de venta: vigas, candil, mesa larga, cueros de vino | `venta` | retablo de títeres, mesa de escribano | 5 |
| 11 | `majada` | Fogata de cabreros bajo encinas, de noche | `noche` | fogata, zurrones | 4 |
| 12 | `encinar` | Bosque de encinas y alcornoques | `bosque` | cortejo fúnebre, carro de Merlín | 4 |
| 13 | `pinar` | Pinar catalán con peñas | `bosque` | ahorcados entre los árboles, en silueta discreta (Roque) | 4 |
| 14 | `sierra` | Sierra Morena: peñas, jaras, barranco | `sierra` | maleta abandonada, ermita | 4 |
| 15 | `plaza` | Plaza de aldea manchega: iglesia, olmo, casas encaladas | `aldea` | enramada de bodas, pregón, barra de tirar | 11 |
| 16 | `ciudad` | Calle de ciudad: soportales, balcones, torres al fondo (Zaragoza, Sigüenza, Madrid, Alcalá) | `ciudad` | tablado, carteles | 4 |
| 17 | `casanoble` | Sala noble: tapices, bufete, chimenea, mesa de banquete | `banquete`/`casa`/`ciudad` | cabeza de bronce, mesa puesta | 7 |
| 18 | `salon` | Salón del palacio de los duques: arcos, tapices, estrado | `castillo` | catafalco, trono de gobernador | 5 |
| 19 | `liza` | Patio del palacio y palenque | `castillo` | Clavileño de madera, tablados con público | 2 |
| 20 | `calabozo` | Cárcel y Casa del Nuncio: muro, reja, paja, luz cenital | `casa`/`ciudad` | cadena, caldero | 3 |
| 21 | `rio` | Ribera del Ebro: álamos, aceña, barca | `rio`/`lluvia` | barca sin remos | 2 |
| 22 | `batanes` | Noche cerrada junto al río, con los mazos del batán | `noche` | mazos batiendo | 1 |
| 23 | `cueva` | Boca de la cueva de Montesinos y su interior soñado | `cueva` | soga, cripta de cristal | 1 |
| 24 | `playa` | Playa de Barcelona con murallas, galeras y el puerto | `mar`/`playa` | galeras, bote | 4 |
| 25 | `entrepaginas` | **Paisaje de papel**: la Mancha dibujada en grabado sobre páginas, con letras que flotan. Sirve para el sueño, la fiebre y la locura (idea original, no tomada de la referencia) | `noche` | página que se pasa, letras volando | 4 |

La lluvia deja de ser un fondo y pasa a ser **clima** sobre `llanura`, `vado` o `rio`. Ningún escenario existente se queda sin reemplazo. La asignación completa escena por escena está en el **Anexo A**.

### 2.2 Personajes: lo que hay y la propuesta

**Hoy:** 48 sprites estáticos (44 humanos y 4 animales). Todos existen en `SPR`: ningún nombre referenciado por `STG` falta. Faltan, en cambio, figuras para los papeles de P5 y P2.

**Propuesta:** personajes por *capas* (cuerpo base + traje + tocado + accesorio + paleta), todos de la misma altura y escala, con **4 animaciones mínimas**:

| Animación | Fotogramas | Uso |
|---|---|---|
| reposo | 2 (respiración, parpadeo) | `watch`, fondo de `talk` |
| caminar | 4 | entradas desde el borde, `walk` |
| hablar | 2 (boca y gesto de mano) | el que habla en la caja de diálogo |
| reacción o golpe | 2 (recibir golpe o asustarse, y atacar) | `fight`, `faint`, `toss`, tiradas fallidas |

**Protagonistas (diseño propio, más fotogramas):**

| Personaje | Nota de diseño |
|---|---|
| Don Quijote (a pie y montado) | Muy alto y enjuto, celada de cartón con visera atada, lanza larga. La bacía-yelmo sustituye a la celada cuando se tiene el objeto `yelmo` y lanza brillo animado |
| Alonso Quijano | Mismo cuerpo, ropa de casa y gorro de dormir |
| Sancho (a pie y montado) | Bajo y ancho, sombrero de paja y alforjas |
| Rocinante | **Actor independiente**: flaco, costillas marcadas, cabeza baja. Montado o suelto |
| El rucio | **Actor independiente**: el asno con alforjas |

**Tipos reutilizables (los 12 pedidos):** arriero, ventero, cabrero, dama, cura, bandolero, duque, duquesa, moza, clérigo, estudiante y soldado.

**Variantes por paleta y accesorio** (sin silueta nueva): ama, Teresa, Maritornes, Marcela, Dorotea, Zoraida, Ana Félix, Altisidora, Aldonza y Bárbara (de *dama* y *moza*); Cardenio (estudiante harapiento); Sansón Carrasco (estudiante); canónigo, ermitaño, Mosén Valentín y encamisados (de *clérigo* y *cura*); galeote y Ginés (de *bandolero*, con cadena); Roque Guinart (bandolero con capa); vizcaíno, Tosilos y Caballero de los Espejos o de la Blanca Luna (de *soldado* con armadura); don Diego, don Antonio Moreno, Álvaro Tarfe, don Carlos, el Archipámpano y Bracamonte (de *duque* con distintos colores); escribano, pregonero, alguacil y labradores (de *ventero* o *estudiante*); peregrinos (de *estudiante* con esclavina); dueña o Trifaldi (de *duquesa* con tocas y barba); penitentes (túnica y capirote); comediantes (la Muerte, el Ángel, el diablo); titiritero; Merlín; Bramidán; el impostor (don Quijote en tinta negra) y **Claudia Jerónima (nueva)**.

**Animales y props animados:** oveja, cerdo, yeguas, león (a escala real y en su carro-jaula), Clavileño, carreta de las Cortes de la Muerte, barca, galeras y molinos.

Los PNG actuales se usarán como **referencia de color e identidad** (que el jugador reconozca a cada uno) y se retiran cuando el nuevo formato los cubra todos. Eso ahorra unos 62 KB.

### 2.3 Retratos para las cajas de diálogo

Busto de 40×40 px internos, con 2 fotogramas (boca y parpadeo):

| Hablante | Retrato | Marco |
|---|---|---|
| Sancho | Busto de Sancho | Madera y cuero |
| La Razón | **Alegoría** al modo de los libros de emblemas del XVI: dama de perfil con compás y lámpara, en grisalla azulada | Marco de plata, frío, geométrico |
| El Caballero | **Alegoría**: yelmo cerrado con penacho y una llama tras la visera, en grisalla dorada | Marco de oro con ornamento de fuego |
| El Impostor | Don Quijote en negro de tinta, con el borde corrido | Marco de imprenta (orla tipográfica) |
| Claudia | Busto de Claudia | Madera |
| El Estómago y El Cuerpo | Emblema: una olla vacía y un corazón con vendas | Marco de plata desgastado |

---

## 3. Dirección de arte

### 3.1 Principios

1. **Pictórico, no «retro»**: masas de color grandes, dithering suave solo en cielos y sombras, contorno de color (sin negro puro) y luz que entra de un lado. Pensar en un bodegón de Zurbarán o un paisaje de Velázquez reducido a píxeles.
2. **Perfil y profundidad**: el horizonte va bajo y el cielo ocupa más de la mitad, como en la Mancha. Hay tres capas de parallax y un primer plano oscuro que enmarca.
3. **Luz cálida contra sombra violácea**: las sombras nunca son grises. Tiran a ciruela y añil, y las luces a paja y ocre.
4. **Lectura primero**: los personajes se recortan del fondo por valor (claro sobre oscuro o al revés), no por color.
5. **Época**: arquitectura manchega encalada, ventas de tapial, trajes de 1600 (calzas, jubón, valona, saya, toca). Nada de castillos de cuento salvo cuando don Quijote los imagina.

### 3.2 Resolución y escalado

- **Resolución interna: 320×180** (16:9) en un único `<canvas>`, dibujado con `imageSmoothingEnabled = false` y mostrado con `image-rendering: pixelated`.
- **Ancho elástico 320–400 px**: el alto es siempre 180. El ancho interno se ajusta para que el escalado sea **entero** (×2 en escritorio a 640×360, ×3 en un móvil de 390 px CSS con DPR 3 a 390×180 internos). Los fondos se pintan a 400 de ancho con la zona segura en los 320 centrales.
- Suelo en y≈150, humanos de **~44 px** de alto y don Quijote montado de ~66 px (casi tres cabezas por encima de Sancho, que es el chiste visual).

### 3.3 Paleta: 32 colores semánticos × 4 momentos del día

Cada fondo y cada sprite se escribe con **índices semánticos** (0–31), no con colores. Cada momento del día es una tabla de 32 hex. Así, cambiar de hora es cambiar la tabla, y los personajes se integran solos en la luz de la escena (como los sprites recoloreados de los juegos de 16 bits). La brasa (22) y el destello (31) apenas cambian por la noche, para que el fuego y el yelmo brillen en la oscuridad.

| # | Uso | Mediodía | Amanecer | Ocaso | Noche |
|---|---|---|---|---|---|
| 0 | sombra profunda | `#1b1424` | `#1d1630` | `#22122a` | `#0a0a18` |
| 1 | sombra violeta | `#3a2740` | `#3b2a4e` | `#4a2238` | `#141a33` |
| 2 | cielo alto | `#4f7fb5` | `#6a6fa8` | `#3b3a78` | `#0e1636` |
| 3 | cielo medio | `#7fa8cf` | `#c48fa0` | `#b8506a` | `#1c2a52` |
| 4 | cielo horizonte | `#c9dbe0` | `#f2c48c` | `#f2914a` | `#34466e` |
| 5 | sol o luna | `#fff4cf` | `#fff0b8` | `#ffd27a` | `#e8e4c8` |
| 6 | nube | `#f3efe2` | `#f6d6c0` | `#e98a6c` | `#3a4466` |
| 7 | sierra lejana | `#8f97b0` | `#9a88a8` | `#7a4f74` | `#1f2742` |
| 8 | colina media | `#a89a72` | `#a8836c` | `#8c5a50` | `#26304a` |
| 9 | tierra luz | `#e8c97f` | `#f0c890` | `#f0a860` | `#4a5470` |
| 10 | ocre | `#c99a52` | `#c98a5e` | `#c0703e` | `#36405a` |
| 11 | tierra sombra | `#8a5e34` | `#87573e` | `#7c3e2c` | `#262c44` |
| 12 | tierra profunda | `#553620` | `#533228` | `#4a2420` | `#181c30` |
| 13 | hierba agostada | `#b8b070` | `#b89c78` | `#b07a50` | `#2e3a48` |
| 14 | olivo | `#6b7a3e` | `#6a6a4a` | `#5f4a36` | `#1e2a34` |
| 15 | verde encina | `#3a4a2a` | `#3a3a36` | `#362a2a` | `#121a24` |
| 16 | cal | `#f4ecd8` | `#f6dcc4` | `#f2b890` | `#5a6488` |
| 17 | cal en sombra | `#c8b9a6` | `#c4a2a0` | `#b07a78` | `#3a4466` |
| 18 | madera | `#7a4e2c` | `#7a4a34` | `#6e3a24` | `#2a2434` |
| 19 | madera oscura | `#4a2c1a` | `#482a22` | `#3c1c16` | `#16141e` |
| 20 | bermellón | `#b3361f` | `#b8402e` | `#c83a1e` | `#5a2238` |
| 21 | bermellón oscuro | `#6e1c16` | `#6e2022` | `#701810` | `#2e1424` |
| 22 | brasa | `#e8783a` | `#f0844a` | `#ff8a2e` | `#ff9a40` |
| 23 | oro | `#d8a640` | `#e0aa58` | `#f0b040` | `#c08a3a` |
| 24 | añil (paños) | `#34508a` | `#44508a` | `#3a3a70` | `#1a2448` |
| 25 | hierro | `#7c808c` | `#8a7e8e` | `#7a5e6a` | `#343c58` |
| 26 | hierro luz | `#d0d4dc` | `#f0d6c8` | `#ffc8a0` | `#8a9ac0` |
| 27 | piel luz | `#e8b48c` | `#f0b896` | `#f0a07a` | `#7a7088` |
| 28 | piel sombra | `#a8704c` | `#a86a52` | `#9c5040` | `#44405a` |
| 29 | paño negro o pelo | `#2a2228` | `#2c2430` | `#2a1c24` | `#0e0e18` |
| 30 | lino o papel | `#f2e6c8` | `#f6dcc4` | `#f2c8a0` | `#8890a8` |
| 31 | destello | `#fffbe8` | `#fff4d8` | `#fff0c0` | `#fff6d8` |

Los valores definitivos se ajustarán viendo capturas. Las rampas de tierra (9→12), cielo (2→4) y piel (27→28) están pensadas para que haya 3-4 pasos de valor por material.

**Variaciones de ropa:** los personajes usan una sub-paleta de 4 ranuras (paño A, paño B, tocado y detalle) que apuntan a índices de la tabla. Así, «dama azul» y «dama bermellón» son el mismo sprite con dos ranuras distintas y siguen respondiendo a la hora.

### 3.4 Capas de una escena

| Capa | Parallax (en `walk`) | Contenido |
|---|---|---|
| L0 cielo | 0 | degradado con dithering ordenado, sol o luna, estrellas |
| L1 lejos | 0,15 | sierra azulada, nubes lentas |
| L2 medio | 0,4 | colinas, pueblo, molinos y arboleda |
| L3 escena | 1 | suelo, props, **actores** y partículas de suelo (polvo) |
| L4 primer plano | 1,6 | siluetas oscuras (jaras, un poste, el marco de la puerta) que enmarcan sin tapar a nadie |
| Postproceso | — | tinte por tensión, viñeta, grano y transición |

Las capas L0–L2 de cada combinación fondo × hora se **pintan una vez** en un canvas fuera de pantalla y se cachean (máximo ~8 en memoria, con LRU). Cada fotograma solo compone de 5 a 12 `drawImage`.

### 3.5 Luz y tensión

La hora sale de una tabla explícita por escena (`HORA`, Anexo A): no se deduce del turno, para que sea determinista y revisable. Encima va la **tensión**, calculada con los mismos umbrales que ya usa `isTense()`:

| Estado | Efecto visual |
|---|---|
| Cordura < 25 | Viñeta violeta y un leve vaivén del horizonte de 1 px (que se desactiva con movimiento reducido). Con Cordura < 10, las sombras de los molinos o árboles del fondo se recortan por un instante como gigantes |
| Salud < 25 | Viñeta bermellón oscura que late despacio (cada 2,4 s, como la música tensa) |
| Saciedad < 20 | Desaturación del 35 % y grano fino |
| Varios a la vez | Los efectos se suman con tope. El texto nunca pierde contraste porque el efecto va solo en el canvas |

### 3.6 Transiciones y entradas

- **Cambio de escena:** cierre en iris (círculo que se cierra sobre don Quijote) y apertura en la nueva escena, en 450 ms.
- **Cambio de parte o rama** (Primera parte → Segunda; entrada en Avellaneda; finales): **cortinilla de página** que se pasa, en sepia.
- **Entradas:** don Quijote y Sancho entran caminando desde la izquierda y los PNJ desde la derecha hasta su marca (de 0,8 a 1,2 s). Con `prefers-reduced-motion`, con `CFG.anim = 0` o en modo rápido (`CFG.fast`), todo aparece ya en su sitio.

### 3.7 Cajas de diálogo

- **Narración** (`body`): caja de pergamino sin retrato y texto letra a letra (≈45 caracteres por segundo, con pausa en las comas). Una pulsación, Espacio o Intro completa el texto, y otra pasa a la caja siguiente.
- **Voz** (`voice`): caja con retrato a la izquierda y el nombre en versalitas. La Razón y El Caballero usan los marcos alegóricos de §2.3 y su propio color de texto. El retrato anima la boca mientras sale el texto.
- **Accesibilidad:** el texto completo está en el DOM desde el principio (el efecto letra a letra solo enmascara visualmente). Los lectores de pantalla y las pruebas leen el texto entero, las opciones están siempre en el DOM y son pulsables, y elegir una opción termina el efecto.

### 3.8 Efectos y partículas

Polvo del camino (sale de los cascos al caminar o embestir), lluvia oblicua con salpicaduras en el suelo, niebla en dos bandas con parallax, luciérnagas de noche en `majada` y `encinar`, chispas de la fogata, brillo que recorre el yelmo o la bacía cada pocos segundos, aspas girando, olas y banderolas al viento. Todo con un tope de unas 120 partículas por escena.

### 3.9 Dados sobre el escenario

Al resolver una prueba, un dado de 12×12 px cae sobre el suelo del escenario, rebota dos veces y muestra su cara. Después aparece «ÉXITO» en oro o «FALLO» en bermellón, con letra de mapa de bits, y el actor reacciona (golpe o celebración). **El modal actual y su información se conservan**: la animación del escenario es un añadido.

### 3.10 Interfaz (avance para la Fase 3)

Pergamino barroco con orlas pixeladas y **iconos de 12×12** para Salud (corazón), Cordura (yelmo o molino), Honor (escudo), Saciedad (pan) y Sancho (sombrero de paja). Las barras cambian con animación y muestran números flotantes «+5» y «−3». Las consecuencias de cada opción se muestran como iconos de color, sin quitar el texto de los chips actuales. La pastilla de dados usa un icono de dado.

---

## 4. Arquitectura técnica (resumen para la Fase 1)

- **Sin tocar la lógica:** el motor se engancha al final de la cadena `render` (envoltura `const _rv=render; render=function(){...}`, igual que hacen las fases anteriores) y solo lee `state.scene`, el estado y el resultado de las tiradas. No toca `scenes`, `apply`, `choose` ni los efectos.
- **DOM compatible:** se mantiene `<figure class="stage" role="img" aria-label>` y su `figcaption`, y el canvas va dentro. Si no hay `getContext('2d')` (como en jsdom), el motor no hace nada y se sigue mostrando el escenario actual, así que las pruebas en Node no dependen del arte.
- **Un solo bucle `requestAnimationFrame`.** Se detiene cuando:
  - la pestaña está oculta (`visibilitychange`);
  - el escenario sale de la vista (`IntersectionObserver`);
  - el menú, la introducción, el libro o un modal tapan el juego;
  - no hay nada animándose y el movimiento reducido está activo (entonces se dibuja un único fotograma por cambio).
- **Formato de sprite:** cada fotograma es una cadena de índices de paleta con RLE (`"a3b2…"`), decodificada una sola vez al primer uso a un canvas fuera de pantalla por hora. Los fondos son funciones de dibujo con primitivas (rectángulos, polígonos, dithering y ruido con semilla), no mapas de bits.
- **Datos por escena:** una nueva tabla `ESC` con `id → {f: fondo, h: hora, c: clima, p: props, r: reparto, an: actuación}`. Se rellena a partir de `ST` y del Anexo A, y `ST` se mantiene como respaldo.

## 5. Presupuesto

| Concepto | Estimación |
|---|---|
| Archivo actual | 429 KB |
| − PNG de `SPR` retirados | −62 KB |
| − envoltorio sobrante de la línea 1 y fuentes externas | −1 KB |
| + motor (bucle, cámara, luz, transiciones, diálogo) | +35–45 KB |
| + 25 fondos procedurales | +70–100 KB |
| + personajes (5 protagonistas + 12 tipos + capas, animales y props) | +80–110 KB |
| + retratos, iconos e interfaz | +25–35 KB |
| **Total previsto** | **≈ 580–660 KB** (límite: 1,2 MB) |

Rendimiento objetivo: un primer fotograma del escenario en menos de 50 ms tras `render`; menos de 4 ms por fotograma de composición en un móvil medio, frente a los 16,6 ms disponibles a 60 fps; y ningún coste con la pestaña oculta.

## 6. Decisiones que necesitan tu visto bueno

1. **Posición del escenario.** Propongo pasarlo **arriba**, justo bajo el título y a todo el ancho de la columna central, a 16:9. En escritorio, la caja de voz con retrato **se superpone al pie del escenario**, como en un juego de rol de diálogos. En móvil va debajo, para no tapar la escena. Hoy el escenario está entre el texto y las opciones.
2. **Texto letra a letra activado por defecto**, saltable y desactivado automáticamente en modo rápido o con movimiento reducido. Tendrá un interruptor nuevo en Ajustes que se guarda en `hidalgo_cfg` como clave nueva y opcional, así que las configuraciones guardadas siguen valiendo.
3. **Redibujar los 48 sprites** en el nuevo formato animado, manteniendo sus colores identificativos, y retirar los PNG. La alternativa es conservar los PNG para los PNJ secundarios, que es más barato pero mezcla dos estilos.
4. **Fuentes:** eliminar Google Fonts por la regla de cero dependencias. La propuesta es usar una pila serif del sistema (`"Iowan Old Style", Palatino, "Book Antiqua", Georgia, serif`) para el texto largo y una **fuente de mapa de bits propia** (dibujada en código, ~3 KB) para el escenario, los números e iconos. Esto cambia algo el aspecto de los títulos actuales.
5. **Temas:** el escenario pixel art se excluye del filtro de los temas `noche`, `bosque` y `contraste`. En `noche` se usa la paleta nocturna más oscura; en `contraste`, una viñeta más débil y contornos de 1 px más claros alrededor de los actores. El texto y los paneles siguen el tema como hoy.
6. **Correcciones de reparto y fondo** del §1.3 (P1–P6). Cambian *qué figura* sale en el escenario, no el texto, las opciones ni los números. Interpreto que están dentro de «solo cómo se ve», pero lo marco para que lo confirmes.

### 6.1 Cómo se aplicaron (fases 1–3)

1. **Posición del escenario: con un cambio.** El escenario y las voces forman un único «marco»: el lienzo arriba y debajo, pegadas, las cajas de diálogo con retrato. **No va encima del título**, sino entre la narración y las opciones. Así se respeta el orden de lectura del texto original (narración → voz → decisión), y la caja de voz no tapa los pies de los personajes, que es lo que ocurría al superponerla.
2. **Texto letra a letra activado**: unos 62 caracteres por segundo, con pausas en la puntuación. Se salta con un clic o pulsación sobre el texto o el escenario, con Espacio o con Intro, y también al elegir una opción. Se desactiva con «Texto letra a letra: No» en Ajustes (clave nueva y opcional `CFG.tw`), con el modo rápido o con movimiento reducido. El texto completo está siempre en el DOM.
3. **Los 48 sprites se redibujaron** en el sistema por capas y se retiraron los PNG.
4. **Sin Google Fonts.** Los nombres de fuente del CSS original (`IM Fell English`, `Literata`, `DM Mono`) se convirtieron en alias `@font-face` con `local()` hacia tipos instalados en el sistema (Iowan, Palatino, Georgia, Menlo…). No cambia ninguna regla de estilo antigua ni se descarga nada.
5. **Temas**: el filtro de los temas noche, bosque y contraste ya no se aplica a `.app` entera, sino a sus paneles. El lienzo solo recibe un ajuste suave de brillo o contraste.
6. **Reparto y fondos corregidos** según P1–P6 (tabla `src/vis/30-escenas.js`). No se tocaron textos, opciones, efectos ni rutas.

Además, la hora del día no basta para la noche. Hay dos paletas derivadas: **«lumbre»**, para interiores nocturnos y figuras junto al fuego, y **«luna»**, para que las figuras se lean a cielo abierto.

## 7. Plan de fases y commits

| Fase | Commit | Verificación |
|---|---|---|
| 0 | `docs: dirección de arte (ARTE.md)` | — |
| 1 | `motor visual: canvas 320x180, bucle único, luz, transiciones, diálogo` | Capturas de 10 escenas representativas; prueba de pausa con la pestaña oculta y de movimiento reducido |
| 2 | Uno por bloque: `fondos`, `personajes`, `efectos y dados` | Capturas de las 119 escenas |
| 3 | `interfaz: pergamino barroco, iconos, barras animadas` | Los temas, el alto contraste y el tamaño de texto siguen funcionando |
| 4 | `pruebas: jsdom (miles de partidas) + capturas Playwright + RENDIMIENTO.md` | Las pruebas se crean primero, en la Fase 1, contra el archivo original, para comparar antes y después |

---

## Anexo A · Asignación propuesta escena por escena

«Fondo hoy» y «Reparto hoy» salen de `stOf()` en el código actual. La **hora** es una propuesta: el texto la fija en 19 escenas y el resto se ha elegido por coherencia con la ruta y el tono. «=» significa que el reparto se mantiene. Entre paréntesis van los props.

| Escena | Fondo hoy | Reparto hoy | Fondo propuesto | Hora | Clima/FX | Reparto propuesto (si cambia) |
|---|---|---|---|---|---|---|
| `start` | cuarto | — | **biblioteca** | noche | — | alonso |
| `yard` | patio | — | **patio** | amanecer | — | = |
| `book` | cuarto | — | **biblioteca** | noche | — | = |
| `sancho` | casa | — | **cocina** | tarde | — | = |
| `helmet` | patio | — | **patio** | amanecer | — | = |
| `vision` | noche | — | **entrepaginas** | noche | — | = |
| `road` | camino | — | **camino** | ocaso | polvo | = |
| `mills` | molinos | — | **molinos** | mediodia | polvo | = |
| `adventure` | camino | cabrero | **camino** | ocaso | — | cabrero (prop: cruz de término) |
| `cabreros` | noche | cabrero | **majada** | noche | luciérnagas | = |
| `marcela` | bosque | marcela | **encinar** | mediodia | — | marcela+cabrero |
| `sheep` | campo | oveja*3 | **llanura** | mediodia | polvo | = |
| `inn` | venta | maritornes | **venta** | tarde | — | = |
| `mambrino` | camino | barbero_bacia | **camino** | mediodia | lluvia ligera | = |
| `galeotes` | camino | galeote | **camino** | mediodia | polvo | galeote*3+soldado |
| `sierra` | sierra | cardenio | **sierra** | tarde | — | = |
| `toboso` | aldea | aldonza | **plaza** | noche | — | aldonza+moza |
| `duques` | castillo | duquesa | **salon** | tarde | — | duque+duquesa |
| `barataria` | castillo | ama | **salon** | mediodia | — | labrador*2 |
| `booktrap` | castillo | yegua | **liza** | noche | — | duque (Clavileño como prop) |
| `avellaneda` | venta | estudiante | **ventainterior** | tarde | — | estudiante*2 |
| `impostor` | camino | caballero_de_tinta | **camino** | tarde | — | = |
| `tarfe` | ciudad | alvaro_tarfe | **ventainterior** | tarde | — | alvaro_tarfe+escribano |
| `barcelona` | mar | moreno | **playa** | mediodia | — | = |
| `home` | casa | ama+cura | **plaza** | ocaso | — | ama+cura |
| `end` | casa | — | **alcoba** | amanecer | — | = |
| `embajada` | sierra | — | **sierra** | mediodia | — | = |
| `espejos` | bosque | caballero_de_los_espejos | **encinar** | noche | — | = |
| `leones` | camino | leon | **camino** | mediodia | polvo | leonero (carro-jaula con león) |
| `camacho` | aldea | camacho_el_rico+basilio_el_pobre | **plaza** | mediodia | — | camacho+basilio+moza |
| `barco` | rio | — | **rio** | mediodia | — | = |
| `desencanto` | bosque | merlin | **encinar** | noche | niebla | merlin+duque |
| `cabeza` | ciudad | moreno | **casanoble** | noche | — | = |
| `duelo` | playa | blanca_luna | **playa** | amanecer | — | = |
| `amor` | aldea | aldonza | **plaza** | ocaso | — | = |
| `ateca` | aldea | cura | **plaza** | tarde | — | clerigo |
| `zaragoza` | ciudad | anselmo | **ciudad** | mediodia | — | = |
| `siguenza` | ciudad | corregidor_de_siguenza | **ciudad** | mediodia | — | = |
| `madrid` | ciudad | archipampano | **casanoble** | tarde | — | = |
| `toledo` | casa | cura | **calabozo** | tarde | — | clerigo |
| `a_arg` | aldea | alvaro_tarfe | **plaza** | tarde | — | = |
| `a_venta` | venta | maritornes | **venta** | tarde | — | ventero+moza |
| `a_melonar` | campo | carretero | **llanura** | mediodia | — | = |
| `a_azotado` | ciudad | galeote | **calabozo** | tarde | — | galeote+soldado |
| `a_carlos` | banquete | anselmo | **casanoble** | noche | — | = |
| `a_bracamonte` | campo | antonio_de_bracamonte | **camino** | tarde | — | = |
| `a_ermitano` | sierra | cura | **sierra** | tarde | — | ermitaño (cura) |
| `a_pinar` | bosque | barbara | **pinar** | tarde | — | = |
| `a_estudiantes` | camino | estudiante | **camino** | mediodia | — | estudiante*2 |
| `a_alcala` | ciudad | estudiante | **ciudad** | mediodia | — | = |
| `a_archi` | ciudad | archipampano | **ciudad** | tarde | — | = |
| `a_bramidan` | banquete | bramidan_rey_de_chipre | **casanoble** | noche | — | = |
| `a_sancho` | casa | — | **casanoble** | noche | — | = |
| `a_sanchono` | camino | — | **camino** | tarde | — | = |
| `a_epilogo` | casa | cura | **calabozo** | amanecer | — | = |
| `ev_refran` | camino | estudiante | **camino** | mediodia | — | = |
| `ev_tormenta` | lluvia | — | **llanura** | tarde | lluvia | = |
| `ev_viajero` | camino | carretero | **camino** | mediodia | polvo | arriero |
| `ev_noche` | noche | — | **majada** | noche | — | = |
| `ev_rocin` | campo | yegua | **vado** | mediodia | — | (sin yegua: Rocinante actúa) |
| `ev_faint` | campo | — | **llanura** | mediodia | — | = |
| `ev_fever` | noche | — | **entrepaginas** | noche | — | = |
| `vizcaino` | camino | vizcaino | **camino** | mediodia | polvo | vizcaino+dama (prop: coche) |
| `batanes` | noche | — | **batanes** | noche | — | = |
| `dorotea` | bosque | dorotea+cardenio | **encinar** | mediodia | — | = |
| `montesinos` | cueva | — | **cueva** | tarde | — | = |
| `retablo` | venta | comediante | **ventainterior** | tarde | — | titiritero (retablo como prop) |
| `lecho` | cuarto | — | **alcoba** | tarde | — | = |
| `salida` | camino | — | **camino** | amanecer | — | = |
| `ev_adios` | camino | — | **camino** | ocaso | — | = |
| `yangueses` | campo | arriero+yegua | **vado** | mediodia | — | arriero*2+yegua*2 |
| `manteo` | venta | maritornes | **venta** | noche | — | maritornes+arriero*2 |
| `encamisados` | noche | cura+cura | **camino** | noche | antorchas | encamisado*3 (clerigo) |
| `cardenio` | sierra | cardenio | **sierra** | tarde | — | = |
| `curioso` | venta | anselmo+cura | **ventainterior** | noche | — | cura |
| `cautivo` | venta | zoraida | **ventainterior** | noche | — | = |
| `jaula` | camino | canonigo | **camino** | tarde | — | canonigo+cura (carro-jaula) |
| `disciplinantes` | camino | carretero+cura | **camino** | tarde | — | penitente*2+clerigo |
| `sanson` | aldea | estudiante+teresa | **plaza** | mediodia | — | = |
| `muerte` | camino | muerte+comediante | **camino** | tarde | — | muerte+comediante (carreta) |
| `gaban` | camino | diego | **camino** | mediodia | — | = |
| `lorenzo` | casa | diego | **casanoble** | tarde | — | diego+estudiante |
| `trifaldi` | castillo | ama | **salon** | tarde | — | dueña |
| `rodriguez` | noche | ama+altisidora | **salon** | noche | — | dueña+altisidora |
| `ricote` | camino | ricote | **camino** | tarde | — | ricote+peregrino |
| `tosilos` | castillo | tosilos | **liza** | mediodia | polvo | tosilos+duque+duquesa |
| `claudia` | camino | — | **pinar** | tarde | — | claudia (nuevo) — hoy sin escenario |
| `roque` | bosque | roque | **pinar** | tarde | — | roque+bandolero |
| `galeras` | mar | ana+ricote | **playa** | mediodia | — | ana+ricote+soldado (prop: galeras) |
| `arcadia` | campo | cabrero | **llanura** | ocaso | — | cabrero+oveja*2 |
| `cerdos` | noche | cerdo*3 | **camino** | noche | polvo | = |
| `altisidora` | castillo | altisidora | **salon** | noche | — | altisidora (catafalco)+duque+duquesa |
| `ev_ladrones` | camino | arriero+arriero | **camino** | tarde | — | bandolero*2 |
| `ev_caida` | campo | — | **llanura** | mediodia | — | = |
| `ev_aguas` | campo | oveja*2 | **llanura** | mediodia | — | = |
| `ev_cabrero_med` | campo | cabrero | **llanura** | tarde | — | = |
| `ev_calentura` | noche | — | **majada** | noche | — | = |
| `ev_c_hambre` | campo | — | **llanura** | mediodia | — | = |
| `ev_c_locura` | noche | — | **entrepaginas** | noche | — | = |
| `ev_c_honor` | venta | arriero | **venta** | ocaso | — | ventero+arriero |
| `ev_c_sancho` | camino | — | **camino** | ocaso | — | = |
| `ev_c_salud` | camino | — | **camino** | mediodia | — | = |
| `ev_deshonra` | aldea | estudiante | **plaza** | ocaso | — | estudiante*2 |
| `ev_muerte` | camino | — | **camino** | ocaso | — | = |
| `ev_locura` | noche | — | **entrepaginas** | noche | — | = |
| `ev_barca` | lluvia | sancho | **rio** | tarde | lluvia ligera | (sin 2º Sancho) |
| `ev_puente` | camino | arriero | **camino** | mediodia | — | soldado (alguacil) |
| `ev_pregonero` | aldea | comediante | **plaza** | mediodia | — | pregonero (soldado) |
| `ev_bandolero` | camino | galeote | **pinar** | tarde | — | bandolero |
| `ev_pescador` | playa | estudiante | **playa** | mediodia | — | pescador |
| `ev_moza` | aldea | ana | **camino** | mediodia | — | moza |
| `ev_niebla` | lluvia | — | **llanura** | amanecer | niebla | = |
| `ev_lluvia` | lluvia | sancho | **vado** | tarde | lluvia | (sin 2º Sancho) |
| `ev_rucio` | noche | sancho | **majada** | noche | — | (sin 2º Sancho) |
| `ev_peregrinos` | camino | estudiante+estudiante | **camino** | mediodia | — | peregrino*2 |
| `torneo` | aldea | sancho+cabrero | **plaza** | mediodia | polvo | estudiante+cabrero |
| `sancho_cuenta` | camino | sancho | **camino** | tarde | — | (sin 2º Sancho) |
| `diego_frio` | venta | diego | **casanoble** | tarde | — | = |
| `cirujano` | aldea | barbero_bacia | **plaza** | mediodia | — | = |
