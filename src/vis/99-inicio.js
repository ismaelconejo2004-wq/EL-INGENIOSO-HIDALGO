/* ===== VIS · arranque ===== */
(function () {
  try { VIS.instalarSprites && VIS.instalarSprites(); } catch (e) { console.error('VIS: no se pudieron cargar los sprites', e); }
  try { VIS.instalar(); } catch (e) { console.error('VIS: no se pudo instalar el motor visual', e); }
  try { VIS.instalarPantalla && VIS.instalarPantalla(); } catch (e) { console.error('VIS: no se pudo instalar la pantalla completa', e); }
})();
