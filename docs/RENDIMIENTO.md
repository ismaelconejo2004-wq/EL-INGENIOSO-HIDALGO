# Rendimiento

Medido con `node tests/rendimiento.js` (Chromium de Playwright, 25-11-2026). Los datos en bruto están en `tests/rendimiento.json`.

## Presupuesto

| Requisito | Límite | Medido | ¿Cumple? |
|---|---|---|---|
| Tamaño del archivo | < 1,2 MB | **507 KB** (519 000 bytes) · 170 KB con gzip | Sí |
| Carga en móvil medio | < 2 s | **1,34 s** hasta `load` con gzip · 0,29 s hasta el primer pintado | Sí (ver nota sin gzip) |
| Fluidez | 60 fps estables | **60 fps** en las 5 escenas más cargadas, también con CPU 4× más lenta | Sí |
| Bucle con la pestaña oculta | detenido | **detenido** (escritorio y móvil) | Sí |
| `prefers-reduced-motion` | respetado | **sin bucle**: un fotograma por cambio, sin letra a letra, sin transiciones ni entradas | Sí |
| Dependencias externas | ninguna | **ninguna** (se quitó Google Fonts) | Sí |

## Carga en «móvil medio»

El móvil se simula así: 390×844 táctil, CPU 4× más lenta y red 4G lenta (1,6 Mb/s de bajada y 150 ms de latencia). Cada valor es la mediana de 3 cargas.

| Versión | Transferencia | Primer pintado | `DOMContentLoaded` | `load` |
|---|---|---|---|---|
| Original (commit `72995ec`), con gzip | 170 KB + Google Fonts | 552 ms | 2 422 ms | 2 723 ms |
| **Actual, con gzip** | **170 KB** | **292 ms** | **1 335 ms** | **1 337 ms** |
| Original, sin gzip | 429 KB + Google Fonts | 560 ms | 3 978 ms | 4 271 ms |
| Actual, sin gzip | 507 KB | 392 ms | 3 041 ms | 3 045 ms |

- Comprimido, el archivo nuevo pesa lo mismo que el original. El arte procedural comprime muy bien, y además se retiraron 62 KB de PNG en base64, que apenas comprimían.
- Carga **el doble de rápido** que el original porque ya no espera a Google Fonts, que bloqueaba el renderizado.
- **Sin gzip** (un servidor mal configurado), en 4G lenta se superan los 2 s: 3,0 s, frente a los 4,3 s del original. GitHub Pages, Netlify y cualquier servidor habitual sirven HTML con gzip o brotli, así que es el caso realista.
- El trabajo de script del primer arranque es de unos 330 ms con CPU 4× más lenta. Los fondos se pintan al pedirlos y se guardan en caché, así que no se paga el coste de los 25 de golpe.

## Fotogramas

`fps` es la media de los últimos 120 fotogramas del bucle real. `ms` es el tiempo de CPU para emitir las órdenes de dibujo de un fotograma (120 repeticiones). No incluye el rasterizado en GPU, que se refleja en los fps.

| Escena (por qué es exigente) | Escritorio fps / ms | Móvil CPU 4× fps / ms |
|---|---|---|
| `mills` (tres molinos con aspas girando, polvo, carga) | 60 / 0,08 | 60 / 0,56 |
| `cabreros` (hoguera, chispas, luciérnagas, luz) | 60 / 0,07 | 60 / 0,32 |
| `ev_tormenta` (90 gotas, salpicaduras, caminata con parallax) | 60 / 0,59 | 60 / 0,32 |
| `galeotes` (seis actores, polvo) | 60 / 0,06 | 60 / 0,40 |
| `altisidora` (catafalco con velas, antorchas, salón) | 60 / 0,07 | 60 / 0,30 |

Por qué es barato:
- Resolución interna de 320–400 × 180.
- Los fondos se pintan una vez por combinación de fondo, hora y paleta, y se guardan en caché (LRU de 400 lienzos).
- Los sprites se generan una vez por pose, fotograma y paleta.
- Cada fotograma solo compone entre 10 y 40 `drawImage`, más unos pocos rellenos de partículas.
- Hay un tope de 160 partículas.

## Cuándo corre el bucle

Hay un único `requestAnimationFrame`, compartido por el escenario y el texto letra a letra. Solo corre si:
- la pestaña está visible (`visibilitychange`);
- el lienzo está en pantalla (`IntersectionObserver`), salvo que siga escribiéndose texto;
- no están abiertos el menú, la introducción, el libro ni el mercado;
- no hay movimiento reducido. Con `prefers-reduced-motion` o la animación desactivada en Ajustes solo se dibuja al cambiar algo, y los dados se resuelven de inmediato.

## Cómo repetir las medidas

```
npm install          # solo jsdom, para las pruebas de Node
npm test             # 3000 partidas en jsdom (unos 10 min con 4 núcleos)
npm run capturas     # 238 capturas en tests/capturas + informe.json
npm run rendimiento  # este documento
```
