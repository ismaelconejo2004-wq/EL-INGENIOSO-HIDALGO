# Versiones de *El ingenioso hidalgo*

El número de versión aparece en el menú principal y en los ajustes del Libro del hidalgo. Se define en una sola línea de `index.html` (`const VERSION_JUEGO`) y se repite en `package.json`.

**Regla:** cada cambio que se suba a `main`, por pequeño que sea, sube la versión y añade una entrada al principio de este documento. `npm test` falla si `index.html`, `package.json` y la primera entrada de este documento no coinciden.

Numeración `MAYOR.MENOR.PARCHE`:

- **MAYOR:** cambia la naturaleza del juego (por ejemplo, de texto a pixel art).
- **MENOR:** funciones, contenidos o mejoras visibles nuevas.
- **PARCHE:** correcciones, ajustes y retoques pequeños.

El detalle técnico de cada cambio está en `CHANGELOG.md`.

---

## 2.7.0 · Número de versión
- El menú principal muestra la versión del juego, y los ajustes del Libro del hidalgo también.
- Nuevo documento `VERSIONES.md` con el registro de cambios por versión.
- La prueba `tests/version.js` comprueba que la versión coincide en el juego, en `package.json` y en este documento.

## 2.6.1 · Pluma y tintero vistos desde arriba
- La pluma y el tintero se ven en perspectiva cenital, como la mesa, con sombras en pixel art.
- El tintero es de loza de Talavera, blanca y azul, con collar de latón.

## 2.6.0 · Escritorio, la marcha de Sancho y la Compañía
- La mesa parece un tablero y no un suelo. Se añaden una pluma a la izquierda y un tintero a la derecha.
- Si la lealtad de Sancho llega a 0, se marcha para siempre: desaparece de la escena, de la barra, de las voces y de la Compañía.
- Nueva pestaña de Compañía, con fichas de Sancho, Rocinante, la comitiva de Micomicona, Bárbara, Tarfe y Aldonza.
- Si Aldonza viaja contigo, el final cambia.

## 2.5.2 · Pasar página con ritmo humano
- El giro de página dura 0,95 s y la página anterior ya no se queda a la vista.
- Fondo de mesa de madera rústica bajo el libro.

## 2.5.1 · Agilidad
- El texto aparece completo, sin el efecto de letra a letra.
- Ya no se ve la versión antigua durante un instante al arrancar.
- El giro de página es más ligero.

## 2.5.0 · Narrativa revisada para el tribunal
- Revisión de fidelidad a Cervantes y a Avellaneda.
- Primera salida completa, puentes entre escenas, finales pulidos, glosas del cronista y página de Fuentes y criterios.
- Se aplicaron las nueve recomendaciones de la evaluación simulada.

## 2.4.0 · Más calidad y dossier en PDF
- Mejoras gráficas y estéticas: capitulares, orlas, notas al margen y probabilidad de los dados.
- Dossier del proyecto en PDF.

## 2.3.2 · Libro en el móvil en vertical
- El libro se encuaderna por arriba en pantallas verticales.

## 2.3.1 · Libro de dos páginas en cualquier pantalla
- El formato de libro de dos páginas se mantiene en todos los tamaños de escritorio.

## 2.3.0 · Restauración y pantalla completa
- Vuelve el aspecto de libro tras los cambios externos del repositorio.
- Opción de pantalla completa.
- La introducción se lee mejor sobre el fondo.

## 2.2.0 · El juego como libro abierto
- La interfaz es un libro: estado, escena e inventario a la izquierda, y relato y decisiones a la derecha. Se pasa la página con cada decisión.
- En los mercados solo se pueden comprar dos objetos por visita.

## 2.1.0 · Optimización y menús nuevos
- Un solo bucle de animación, fondos precompuestos y pausa con la pestaña oculta. Menos carga del procesador.
- Menú principal e introducción rediseñados.

## 2.0.0 · Rediseño en pixel art
- Motor visual propio en un lienzo de 320–400 × 180, con paletas por hora del día.
- Unos 25 fondos, personajes por capas, efectos, dados e interfaz pixelada. Todo se genera con código.

## 1.0.0 · Juego original
- Juego narrativo de decisiones en texto, con unas 119 escenas, los modos Clásico y Pesadilla, y las fuentes de Cervantes (1605 y 1615) y de Avellaneda (1614).
