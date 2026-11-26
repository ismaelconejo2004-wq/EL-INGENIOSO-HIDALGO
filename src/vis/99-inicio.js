/* ===== VIS · arranque ===== */
(function () {
  const listo = () => document.documentElement.classList.remove('vis-cargando');
  try { VIS.instalar(); } catch (e) { console.error('VIS: no se pudo instalar el motor visual', e); listo(); return; }
  // se muestra la página cuando el menú ya tiene su primer fotograma pintado
  requestAnimationFrame(() => requestAnimationFrame(() => { if (VIS.pedir) VIS.pedir(); requestAnimationFrame(listo); }));
})();
