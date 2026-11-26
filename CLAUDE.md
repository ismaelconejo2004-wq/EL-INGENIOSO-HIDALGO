# Instrucciones para trabajar en este repositorio

- `main` es la única rama del proyecto: los cambios se suben ahí.
- **Cada cambio, por pequeño que sea, sube la versión del juego:**
  1. Cambia `const VERSION_JUEGO` en `index.html` y `version` en `package.json`. Usa `MAYOR.MENOR.PARCHE`: PARCHE para correcciones y retoques, MENOR para funciones o contenidos nuevos, MAYOR para cambios de naturaleza.
  2. Añade la entrada `## x.y.z · Título` al principio de `VERSIONES.md`, con los cambios en lenguaje llano.
  3. Añade también el detalle técnico en `CHANGELOG.md`.
  4. `npm test` comprueba que las tres versiones coinciden.
- El resto de reglas (partidas guardadas, textos en español, fidelidad a las obras, rendimiento) están en `README.md`, en el apartado «Reglas del proyecto».
- Después de tocar `src/vis/` o `src/vis.css`, ejecuta `npm run build` para regenerar `index.html`.
