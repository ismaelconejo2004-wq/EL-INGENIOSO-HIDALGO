/* ===== VIS · arranque ===== */
(function () {
  const listo = () => document.documentElement.classList.remove('vis-cargando');
  let ok = false;
  try { ok = VIS.instalar(); } catch (e) { console.error('VIS: no se pudo instalar el motor visual', e); }
  // sin motor visual (navegador sin lienzo, pruebas en Node) se muestra la página tal cual
  if (!ok || typeof requestAnimationFrame !== 'function') { listo(); return; }
  // con motor: se muestra cuando el menú ya tiene su primer fotograma pintado
  requestAnimationFrame(() => requestAnimationFrame(() => { if (VIS.pedir) VIS.pedir(); requestAnimationFrame(listo); }));
})();
