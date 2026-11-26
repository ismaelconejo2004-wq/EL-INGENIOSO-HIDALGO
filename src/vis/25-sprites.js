/* ===== VIS · sprites del pack: sustituyen al dibujo por código donde existe un sprite =====
   - Los PNG están en assets/ (1x). Se pintan sin suavizar sobre el lienzo, que ya escala por enteros.
   - Cada hora del día tiñe el sprite (multiplicar + recorte por su propia silueta), como hacía la paleta.
   - Si un sprite no carga, o no existe para ese actor, se sigue usando el dibujo por código (20-actores.js).
   - Don Quijote y Sancho se dibujan con sus caballería/rucio incluidos en el mismo sprite. */
(function (V) {
  'use strict';
  const RUTA = 'assets/';
  const BB = V.SPRBB || {};

  /* id de actor del motor -> sprite del pack (personajes/) */
  const MAPA = {
    alonso: 'alonso_quijano', alonso_noche: 'alonso_quijano', impostor: 'quijote_desamorado',
    arriero: 'arriero', labrador: 'cabrero', carretero: 'arriero', pescador: 'arriero', ventero: 'ventero', cabrero: 'cabrero',
    dama: 'princesa_micomicona', zoraida: 'princesa_micomicona', ana: 'princesa_micomicona',
    cura: 'cura', canonigo: 'cura', bandolero: 'gines_de_pasamonte', roque: 'gines_de_pasamonte', galeote: 'galeote',
    duque: 'duque', duquesa: 'duquesa', duena: 'duquesa',
    moza: 'barbara', ama: 'barbara', teresa: 'barbara', maritornes: 'barbara', barbara: 'barbara',
    marcela: 'marcela', dorotea: 'dorotea', altisidora: 'dorotea', claudia: 'dorotea', aldonza: 'dulcinea_aldonza',
    clerigo: 'mosen_valentin', ermitano: 'ermitano', encamisado: 'fraile_benito', penitente: 'fraile_benito', muerte: 'fraile_benito',
    peregrino: 'ermitano', ricote: 'ermitano',
    estudiante: 'estudiante_de_alcala', sanson: 'estudiante_de_alcala', escribano: 'estudiante_de_alcala',
    basilio: 'basilio_el_pobre', cardenio: 'cardenio', comediante: 'comediante',
    soldado: 'guarda_del_rey', alguacil: 'guarda_del_rey', pregonero: 'guarda_del_rey', tosilos: 'guarda_del_rey',
    vizcaino: 'escudero_vizcaino', espejos: 'caballero_de_los_espejos', blanca_luna: 'blanca_luna', bramidan: 'bramidan_rey_de_chipre',
    diego: 'don_carlos', moreno: 'don_carlos', anselmo: 'don_carlos', tarfe: 'alvaro_tarfe', archipampano: 'archipampano',
    bracamonte: 'antonio_de_bracamonte', corregidor: 'corregidor_de_siguenza', camacho: 'camacho_el_rico',
    barbero: 'barbero_bacia', leonero: 'leonero', titiritero: 'maese_pedro', merlin: 'merlin', leon: 'leon'
  };
  /* objetos del inventario -> objetos/ */
  const OBJ = {
    panqueso: 'panqueso', vino: 'vino', unguento: 'unguento', balsamo: 'balsamo', remedio: 'remedio', yelmo: 'bacia_yelmo',
    carta: 'carta_sierra_morena', pliego: 'quijote_apocrifo', declaracion: 'declaracion_tarfe', queso: 'queso_manchego',
    libro: 'libro_caballerias', regalo: 'regalo_sancho', cartel: 'cartel_desamorado', cartaaldonza: 'carta_aldonza'
  };
  const RETR = { sancho: 'retrato_sancho', razon: 'retrato_la_razon', caballero: 'retrato_el_caballero', impostor: 'retrato_el_impostor' };

  /* ---------- carga ---------- */
  const IMG = {}; // 'p:cura' -> { img, ok }
  function cargar(ref, ruta) {
    if (IMG[ref]) return;
    const o = IMG[ref] = { img: new Image(), ok: false };
    o.img.onload = () => {
      o.ok = true; V.spritesOn = true; V.pedir && V.pedir(); V.dibujarYa && V.dibujarYa();
      if (ref[0] === 'o') { try { if (typeof renderInventory === 'function') renderInventory(); } catch (e) { } } // el inventario ya pintado usaba el dibujo antiguo
    };
    o.img.onerror = () => { o.ok = false; };
    o.img.src = RUTA + ruta;
  }
  const listo = ref => !!(IMG[ref] && IMG[ref].ok);
  V.spriteListo = listo;

  /* ---------- tinte por hora ---------- */
  const TINTE = { mediodia: null, amanecer: 'rgb(255,228,208)', ocaso: 'rgb(255,186,142)', noche: 'rgb(112,122,190)', lumbre: 'rgb(238,176,126)', luna: 'rgb(156,170,218)' };

  const VACIO = (ax, ay) => { const c = document.createElement('canvas'); c.width = 1; c.height = 1; c._ax = ax || 0; c._ay = ay || 0; return c; };

  /* Lienzo de un sprite en una pose. Ancla: centro del recuadro útil, pies en la última fila. */
  function lienzo(ref, pose, f, hora, flip) {
    const bb = BB[ref.replace('h:dq', 'h:don_quijote')];
    const o = IMG[ref]; if (!o || !o.ok) return null;
    const [bx, by, bw, bh] = bb || [0, 0, o.img.width, o.img.height];
    const PAD = 6, TOP = 6;
    const cv = document.createElement('canvas'); cv.width = bw + PAD * 2; cv.height = bh + TOP;
    const x = cv.getContext('2d'); if (!x) return null; x.imageSmoothingEnabled = false;
    // movimiento: el sprite es de un solo fotograma, así que se anima con desplazamientos de 1-2 px
    let dx = 0, dy = 0;
    const dir = flip ? -1 : 1;
    if (pose === 'caminar') { dy = -(f & 1) * 2; }
    else if (pose === 'hablar') { dy = -(f & 1) * 2; }
    else if (pose === 'reposo') { dy = -(f & 1); }
    else if (pose === 'golpe') { dx = (f === 0 ? -3 : 4) * dir; }
    else if (pose === 'arrodillado') { dy = Math.round(bh * 0.14); }
    const dibujar = () => {
      x.save();
      const ox = PAD + dx, oy = cv.height - bh + dy;
      if (flip) { x.translate(cv.width, 0); x.scale(-1, 1); x.drawImage(o.img, bx, by, bw, bh, cv.width - (ox + bw), oy, bw, bh); }
      else x.drawImage(o.img, bx, by, bw, bh, ox, oy, bw, bh);
      x.restore();
    };
    dibujar();
    const t = TINTE[hora];
    if (t) { x.globalCompositeOperation = 'multiply'; x.fillStyle = t; x.fillRect(0, 0, cv.width, cv.height); x.globalCompositeOperation = 'destination-in'; dibujar(); x.globalCompositeOperation = 'source-over'; }
    cv._ax = cv.width >> 1; cv._ay = cv.height - 1;
    return cv;
  }

  /* ¿qué sprite le toca a este actor? null = dibujo por código */
  function elegir(id, pose, extra) {
    extra = extra || '';
    if (id === 'dq') {
      if (pose === 'montado') return /@rocinante/.test(extra) && listo('h:dq') ? 'VACIO' : null; // el jinete va dentro del sprite del caballo
      return listo('p:quijote_desamorado') ? 'p:quijote_desamorado' : null; // a pie (aún no hay un Don Quijote a pie)
    }
    if (id === 'rocinante') return extra === 'mont' && listo('h:dq') ? 'h:dq' : null;
    if (id === 'sancho') return (pose === 'montado' && /@(clavileno|barca)/.test(extra)) || !listo('h:sancho') ? null : 'h:sancho';
    if (id === 'rucio') return listo('h:sancho') ? 'RUCIO' : null; // el rucio ya está en el sprite de Sancho
    const f = MAPA[id]; return f && listo('p:' + f) ? 'p:' + f : null;
  }

  const _ac = V.actorCanvas;
  V.actorCanvas = function (id, pose, f, hora, flip, extra) {
    // tumbado: el sprite (de pie, 70-90 px) quedaría más largo que la cama; se mantiene el dibujo por código
    if (pose === 'tendido') return _ac.call(this, id, 'reposo', f, hora, flip, String(extra || '').replace(/@.*$/, '').replace(/^mont$/, ''));
    if (V.spritesOn) {
      const r = elegir(id, pose, extra);
      if (r === 'VACIO') return V.cache('s|vacio', () => VACIO(0, 0));
      if (r === 'RUCIO') return V.cache('s|rucio', () => VACIO(30, 39)); // punto de silla de V.SILLA.rucio + cadera de Sancho
      if (r) {
        const k = 's|' + r + '|' + pose + '|' + (f & 1) + '|' + hora + '|' + (flip ? 1 : 0);
        const c = V.cache(k, () => lienzo(r, pose, f, hora, flip));
        if (c) return c;
      }
    }
    const limpio = String(extra || '').replace(/@.*$/, '').replace(/^mont$/, '');
    return _ac.call(this, id, pose, f, hora, flip, limpio);
  };

  /* ---------- retratos de las voces (40x40) ---------- */
  V.retratoSprite = function (k) {
    const n = RETR[k]; if (!n) return null; const ref = 'r:' + n;
    if (!listo(ref)) return null;
    return V.cache('sr|' + n, () => { const c = document.createElement('canvas'); c.width = 40; c.height = 40; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(IMG[ref].img, 0, 0); return c; });
  };

  /* ---------- objetos del inventario ---------- */
  function instalarObjetos() {
    const _ia = window.itemArt; if (typeof _ia !== 'function') return;
    window.itemArt = function (item) {
      let id = null;
      try { id = Object.keys(items).find(k => items[k] === item); } catch (e) { }
      const f = id && OBJ[id];
      if (!f || !listo('o:' + f)) return _ia(item);
      return `<img class="px-item" src="${RUTA}objetos/${f}.png" alt="${String(item.name).replace(/"/g, '&quot;')}" draggable="false">`;
    };
  }

  V.instalarSprites = function () {
    cargar('h:dq', 'heroes/don_quijote.png'); cargar('h:sancho', 'heroes/sancho.png');
    const unicos = {}; for (const k in MAPA) unicos[MAPA[k]] = 1;
    for (const n in unicos) cargar('p:' + n, 'personajes/' + n + '.png');
    for (const k in RETR) cargar('r:' + RETR[k], 'retratos/' + RETR[k] + '.png');
    for (const k in OBJ) cargar('o:' + OBJ[k], 'objetos/' + OBJ[k] + '.png');
    instalarObjetos();
  };
})(VIS);
