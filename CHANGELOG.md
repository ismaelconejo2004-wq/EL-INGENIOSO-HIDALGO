# Registro de cambios

## Sprites del pack y pantalla completa

No cambian la historia, las escenas, las opciones ni los efectos numéricos.

- **Sprites en el escenario** (`src/vis/25-sprites.js`, `assets/`): los actores del pack sustituyen al dibujo por código.
  - Don Quijote a caballo y Sancho con el rucio usan los sprites de Piskel; unos 45 personajes del pack cubren los tipos del motor.
  - Cada hora del día tiñe el sprite (mediodía, amanecer, ocaso, noche, lumbre y luna) y se animan con rebotes de 1-2 px.
  - Si un sprite no carga, o no existe para ese actor (ovejas, cerdos, Clavileño, personajes tumbados…), se usa el dibujo por código de siempre.
- **Retratos de las voces** (La Razón, El Caballero, Sancho, El Impostor) y **objetos del inventario** salen del pack.
- `src/vis/22-sprites-datos.js`: recuadro útil de cada sprite, para alinear los pies al suelo.
- **Pantalla completa** (`src/vis/70-pantalla.js`): botón en la cabecera, tecla **F** e interruptor al principio de Ajustes. En iPhone Safari no existe la API; el botón lo avisa.
- Cambios mínimos en el motor: `40-motor.js` marca montura y jinete para el sprite combinado; `50-dialogo.js` usa los retratos del pack.
- Limitación: aún no hay un Don Quijote a pie; cuando desmonta se usa el sprite del Caballero Desamorado.
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
