# El ingenioso hidalgo

Juego narrativo de decisiones sobre don Quijote. Recorre la primera y la segunda parte de Cervantes (1605 y 1615) y la continuación apócrifa de Avellaneda (1614), con 122 escenas, modos Clásico y Pesadilla, y una interfaz de libro abierto con escenas en pixel art generadas por código.

Es el Trabajo de Fin de Grado de su autor.

## Cómo jugar

Abre **`index.html`** en el navegador. No necesita servidor, instalación ni conexión: es un único archivo HTML, sin dependencias externas. Las partidas se guardan solas en el navegador.

**La rama `main` es la única versión del proyecto.** Cualquier otra rama o carpeta que aparezca es antigua y no debe usarse como referencia.

## Qué hay en el repositorio

| Ruta | Qué es |
|---|---|
| `index.html` | **El juego completo.** Contiene el texto, las reglas y, ya incrustado, el motor visual. |
| `src/vis/*.js`, `src/vis.css` | Código fuente del motor visual: escenas pintadas por código, personajes, libro, menús e interfaz. |
| `tools/build.js` | Copia `src/` dentro de `index.html`. |
| `tools/dossier.js` | Genera `docs/El-ingenioso-hidalgo-dossier.pdf` con capturas actuales. |
| `tests/` | Pruebas automáticas: partidas simuladas, mercados, capturas y rendimiento. |
| `docs/ARTE.md` | Dirección de arte: paleta, escenarios, personajes y la escena que corresponde a cada episodio. |
| `docs/RENDIMIENTO.md` | Tamaño, tiempos de carga y fluidez medidos. |
| `docs/EVALUACION_TRIBUNAL.md` | Evaluación simulada del trabajo como TFG y correcciones aplicadas. |
| `docs/El-ingenioso-hidalgo-dossier.pdf` | Dossier del juego con capturas. |
| `CHANGELOG.md` | Historial de cambios y defensa de las decisiones de arte. |

## Dónde se cambia cada cosa

Esta sección es importante para cualquier persona o IA que vaya a modificar el juego.

- **Historia, escenas, opciones, efectos y finales.** Se editan en el `<script>` principal de `index.html`:
  - `scenes` y los bloques `NEW`, `NEW2`… `NEW6` contienen las escenas;
  - `BR` contiene las frases que enlazan una decisión con la escena siguiente;
  - `RD` y `RDF` contienen los desvíos entre escenas;
  - los bloques `FASE 9`, `FASE 10` y `FASE 10b` contienen la primera salida, los ecos entre historias, los textos de los finales, las glosas del cronista y la página de fuentes.
- **Aspecto visual.** Se edita en `src/vis/` y `src/vis.css`, nunca dentro de `index.html`. Después hay que ejecutar `npm run build`.
  - El bloque entre `<!--VIS:INI-->` y `<!--VIS:FIN-->` de `index.html` se **sobrescribe** en cada construcción, así que cualquier cambio hecho ahí a mano se pierde.
- **Qué fondo, hora, clima y personajes tiene cada escena.** Está en `src/vis/30-escenas.js`.

## Reglas del proyecto

- Un **único archivo HTML** jugable y sin dependencias externas: nada de fuentes, imágenes ni librerías descargadas. Todo el arte se genera por código.
- **No se pueden romper las partidas guardadas**. Las claves de `localStorage` son `hidalgo`, `hidalgo_prof`, `hidalgo_cfg` y `hidalgo_gm`. Los datos nuevos que se añadan han de ser opcionales.
- **Textos en español.** En las cadenas JavaScript entre comillas simples no se usan comillas rectas ni apóstrofos: las citas van con comillas angulares «».
- **Fidelidad a las obras.** Lo que procede de las novelas se cita con parte y capítulo (por ejemplo, I, 8). Lo inventado se declara como «Rama hipotética» o «Incidente del juego», y cada escena lo indica en su glosa del cronista.
- **Versión en cada cambio.** Cualquier cambio que se suba a `main`, por pequeño que sea, sube el número de versión. El número está en `const VERSION_JUEGO` de `index.html` y en `package.json`. Además, hay que añadir una entrada al principio de `VERSIONES.md`. La versión se ve en el menú principal y en los ajustes, y `npm test` falla si no coincide en los tres sitios.
- Tamaño por debajo de 1,2 MB, 60 fps y el bucle de animación detenido con la pestaña oculta y con `prefers-reduced-motion`.

## Comandos

Para probar y construir hace falta Node.js. Jugar no necesita nada.

```
npm install          # instala jsdom, solo para las pruebas
npm run build        # incrusta src/ en index.html
npm test             # mercados, recomendaciones del tribunal y miles de partidas simuladas
npm run capturas     # capturas de todas las escenas en tests/capturas/ (no se suben a GitHub)
npm run rendimiento  # tamaño, carga y fps → tests/rendimiento.json
npm run dossier      # regenera el dossier en PDF
```

`capturas`, `rendimiento` y `dossier` usan Playwright con Chromium.

## Fuentes

- Miguel de Cervantes, *Don Quijote de la Mancha* (1605 y 1615). Edición del Instituto Cervantes dirigida por Francisco Rico.
- Alonso Fernández de Avellaneda, *Segundo tomo del ingenioso hidalgo don Quijote de la Mancha* (1614). Ediciones de Martín de Riquer y de Luis Gómez Canseco.

Los criterios de cita y el recuento de escenas por tipo de glosa están en la página **Fuentes** del Libro del hidalgo, dentro del juego.
