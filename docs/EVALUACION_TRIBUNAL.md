# Evaluación simulada del tribunal

Informe escrito en el papel de un profesor de Filología Hispánica que juega y puntúa el trabajo como TFG. Se hizo después de la actualización narrativa (commit `d06f81f`), tras jugar tres partidas completas:

1. **Canónica de Cervantes** (77 escenas): de la biblioteca a la muerte de Alonso Quijano o al final de Aldonza.
2. **Apócrifa** (23 escenas): de Argamesilla a la Casa del Nuncio.
3. **Hipotética** (32 escenas): el caballero de tinta, el encuentro con el doble y el lecho.

Las correcciones que provocó el informe se recogen al final.

---

## Nota: 8,2 / 10 (notable alto) antes de las correcciones

### Lo que defendería ante el tribunal

- **Amplitud del corpus.** Recorre las dos partes de Cervantes y la continuación de Avellaneda en 122 escenas, con referencias de capítulo. Pocas adaptaciones interactivas abarcan las dos segundas partes enfrentadas.
- **Fidelidad comprobable.** Las escenas canónicas respetan los datos del texto: los treinta o cuarenta molinos, los seis mazos del batán, las veinticuatro mamonas de Altisidora y los nombres pastoriles de II, 67. Las citas literales están bien elegidas: la Edad de Oro, «Yo nací libre», «Con la iglesia hemos dado», el epitafio de Sansón y la pluma de Cide Hamete.
- **Metaficción como eje.** El juego entiende que el gran tema del *Quijote* es el libro dentro del libro: Cide Hamete y el Alcaná, Sansón leyendo la primera parte, la cabeza encantada, la imprenta de Barcelona y, sobre todo, la respuesta a Avellaneda con don Álvaro Tarfe (II, 72). La rama del doble de tinta convierte esa disputa en experiencia jugable.
- **Glosas del cronista.** Cada escena declara si es fiel, adaptada, hipotética, del apócrifo o del juego, con su referencia. Es el aparato que un tribunal de Filología espera: separa con honradez la fuente de la invención.
- **Finales con sentido crítico.** El desenlace canónico es ya el más frecuente, y los finales del apócrifo explican la diferencia entre las dos segundas partes: Avellaneda encierra a su personaje y Cervantes lo deja morir cuerdo.
- **Voces interiores.** La Razón y El Caballero como alegorías de emblemática áurea son una lectura personal y defendible del conflicto entre cordura y locura.

### Problemas detectados

| # | Problema | Ejemplo | Gravedad |
|---|---|---|---|
| 1 | **Voz narrativa inconsistente.** La narración alterna la segunda persona (el jugador es don Quijote) con la tercera («Don Quijote ve…») dentro de la misma escena. | `sheep`, `mambrino`, `barco`, `retablo`, `marcela`, `vizcaino`, `ev_moza`… (17 frases) | Alta: es lo primero que señala un filólogo |
| 2 | **Frases puente que contradicen la situación.** Hablan de «vosotros» cuando el hidalgo va solo en la primera salida, o anuncian un destino distinto del que llega. | `yard#0` («el camino se abre ante vosotros»); `embajada#2` («hacia una venta», pero se llega a la sierra) | Media |
| 3 | **La voz del estado de ánimo se repite** idéntica en muchas escenas seguidas, también en los finales. | «Hasta el viento se aparta con respeto. ¿O es solo viento?» en el regreso, en el final de Aldonza y en el epílogo del apócrifo | Media |
| 4 | **La mecánica invade el clímax.** En el regreso a casa aparecen el mercado y el consejo de Sancho sobre qué opción elegir. | `home` | Media |
| 5 | **Saltos de cronología sin marco.** La encrucijada salta de la primera parte al Toboso o a 1615 sin advertir el salto, y los desvíos del modo Pesadilla pueden llevar de los molinos a Barcelona. | `adventure`, `detPool` | Alta para la coherencia |
| 6 | **Fórmulas de cierre repetidas** en los puentes: «Sea como sea», «Pase lo que pase», «Al cabo», «A fin de cuentas», «De un modo u otro», «Con suerte o sin ella». | Unas 50 apariciones | Baja, pero se nota en una lectura seguida |
| 7 | **Falta un aparato de fuentes.** No se indica qué edición se sigue, ni el criterio de cita (en los títulos «Capítulo VIII», en las glosas «I, 8»). Las referencias de capítulo del apócrifo varían según la edición. | Libro del hidalgo | Media para un TFG |
| 8 | **Epílogos desajustados.** El título «Alonso Quijano el Bueno» dice que morir cuerdo «es la forma más rara de despedirse», que ya no es cierto, y la muerte en el camino menciona a Sancho aunque se haya marchado. | `epilogue()`, final `muerte` | Baja |
| 9 | **Episodios célebres ausentes.** La aventura del rebuzno (II, 25-27), la caída de Sancho en la sima (II, 55) y la correspondencia entre Sancho y Teresa (II, 47-52). | — | Baja: se puede justificar por selección |

### Recomendaciones

1. Unificar la voz: segunda persona para el hidalgo en todo el relato. La única excepción deliberada es el lecho (II, 74), donde el paso a la tercera persona marca que ya no es don Quijote.
2. Revisar los puentes que contradicen la escena de llegada.
3. Variar las voces del estado de ánimo y no mostrarlas en los desenlaces.
4. Retirar mercado y consejos de las escenas finales.
5. Señalar los saltos de lectura dentro de la ficción («pasas páginas deprisa…») y hacer que los desvíos de Pesadilla avancen en el orden de la novela, nunca hacia atrás ni a otra parte.
6. Variar los cierres de los puentes.
7. Añadir en el Libro del hidalgo una página de **Fuentes y criterios**: ediciones de referencia, criterio de cita y tipos de glosa.
8. Ajustar los epílogos al nuevo diseño de finales.
9. Incorporar el rebuzno, la sima y la carta de Teresa como ecos breves.

---

## Correcciones aplicadas

Se aplicaron todas las recomendaciones en el commit siguiente a `d06f81f` (ver `CHANGELOG.md`). Con ellas, el informe subiría la nota a **9,0–9,2 (sobresaliente)**. Lo que impediría la matrícula de honor ya no es técnico, sino de alcance: la defensa oral del criterio de selección de episodios y una edición crítica cotejada del apócrifo, que no se ha podido consultar desde este entorno.

### Verificación de las nueve recomendaciones

`tests/tribunal.js` comprueba en cada `npm test` que las nueve recomendaciones siguen aplicadas: la voz narrativa, los puentes, las voces del ánimo, los finales sin mercado, los saltos y desvíos, los cierres variados, la página de Fuentes, los epílogos y los ecos.

Al revisar sistemáticamente todos los puentes que llevan a una escena distinta de la indicada (por los desvíos `RD` y `RDF`), aparecieron otros nueve que contradecían la escena de llegada. Por ejemplo, Clavileño se describía antes de la montería de Merlín, la jaula se anunciaba como el cautivo y la boda aparecía antes que el barbero. Se corrigieron en el bloque `FASE 10b`.

