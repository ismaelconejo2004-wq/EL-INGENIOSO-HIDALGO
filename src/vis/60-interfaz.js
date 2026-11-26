/* ===== VIS · interfaz: iconos pixel art, marco barroco, barras animadas y opciones ilustradas ===== */
(function (V) {
  'use strict';
  const { B, C, HEX } = V;

  /* ---------- iconos 16x16 ---------- */
  const ICO = {
    salud(b) { b.circ(5, 6, 3, C.rojo); b.circ(10, 6, 3, C.rojo); b.poly([2, 7, 14, 7, 8, 14], C.rojo); b.p(4, 5, C.brasa); b.p(5, 4, C.destello); },
    cordura(b) { b.poly([6, 15, 10, 15, 9, 7, 7, 7], C.cal); b.poly([6, 7, 10, 7, 8, 4], C.tierraP); b.line(8, 6, 2, 1, C.maderaO); b.line(8, 6, 14, 1, C.maderaO); b.line(8, 6, 2, 11, C.maderaO); b.line(8, 6, 14, 11, C.maderaO); b.r(7, 12, 2, 3, C.maderaO); },
    honor(b) { b.poly([2, 2, 14, 2, 14, 8, 8, 15, 2, 8], C.anil); b.poly([2, 2, 8, 2, 8, 15, 2, 8], C.rojo); b.r(7, 4, 2, 8, C.oro); b.r(4, 6, 8, 2, C.oro); },
    saciedad(b) { b.ell(8, 9, 6, 4, C.ocre); b.ell(8, 8, 5, 3, C.tierraL); b.line(5, 7, 7, 10, C.tierraS); b.line(8, 6, 10, 9, C.tierraS); b.line(11, 7, 12, 9, C.tierraS); },
    sancho(b) { b.r(1, 8, 14, 2, C.tierraL); b.r(4, 4, 8, 4, C.tierraL); b.hl(4, 11, 7, C.ocre); b.hl(1, 14, 10, C.ocre); },
    reales(b) { b.circ(8, 8, 6, C.oro); b.circ(8, 8, 4, C.tierraL); b.r(7, 5, 2, 6, C.oro); b.p(5, 5, C.destello); },
    gana(b) { b.ell(8, 10, 6, 5, C.madera); b.r(5, 3, 6, 3, C.madera); b.hl(5, 10, 6, C.maderaO); b.r(10, 9, 5, 1, C.oro); b.r(12, 7, 1, 5, C.oro); },
    pierde(b) { b.ell(8, 10, 6, 5, C.madera); b.r(5, 3, 6, 3, C.madera); b.hl(5, 10, 6, C.maderaO); b.r(10, 9, 5, 1, C.rojo); },
    dado(b) { b.r(2, 2, 12, 12, C.lino); b.r(2, 13, 12, 1, C.calS); b.r(13, 2, 1, 12, C.calS); [[5, 5], [10, 5], [7, 8], [5, 11], [10, 11]].forEach(([x, y]) => b.r(x - 1, y - 1, 2, 2, C.pano)); },
    rel(b) { b.circ(5, 6, 3, C.brasa); b.circ(10, 6, 3, C.brasa); b.poly([2, 7, 14, 7, 8, 13], C.brasa); b.line(3, 14, 13, 2, C.oro); },
    dulcinea(b) { b.circ(8, 6, 4, C.rojo); b.circ(7, 5, 2, C.rojoO); b.line(8, 10, 8, 15, C.olivo); b.p(9, 12, C.olivo); b.p(10, 11, C.olivo); },
    nada(b) { b.hl(4, 11, 8, C.calS); },
    infeccion(b) { b.circ(8, 8, 5, C.olivo); b.circ(8, 8, 2, C.encina); b.p(3, 3, C.olivo); b.p(13, 13, C.olivo); },
    cura(b) { b.r(6, 2, 4, 12, C.lino); b.r(2, 6, 12, 4, C.lino); b.r(7, 3, 2, 10, C.rojo); b.r(3, 7, 10, 2, C.rojo); },
    ruta(b) { b.r(2, 3, 12, 10, C.lino); b.r(6, 3, 1, 10, C.calS); b.r(10, 3, 1, 10, C.calS); b.line(3, 11, 9, 6, C.rojo); b.p(12, 5, C.rojo); },
    jugar(b) { b.line(2, 14, 13, 3, C.madera, 2); b.poly([11, 2, 15, 1, 14, 5], C.hierroL); b.r(2, 12, 3, 3, C.rojo); },
    ajustes(b) { b.circ(8, 8, 6, C.hierro); b.circ(8, 8, 3, C.lino); for (const [x, y] of [[8, 1], [8, 15], [1, 8], [15, 8], [3, 3], [13, 13], [3, 13], [13, 3]]) b.r(x - 1, y - 1, 2, 2, C.hierro); b.circ(8, 8, 1, C.hierro); },
    salida(b) { b.r(4, 2, 9, 13, C.maderaO); b.r(5, 3, 7, 12, C.madera); b.p(10, 9, C.oro); b.r(2, 14, 13, 1, C.tierraS); },
    calavera(b) { b.ell(8, 7, 6, 5, C.lino); b.r(5, 11, 7, 3, C.lino); b.r(5, 6, 2, 2, C.negro); b.r(9, 6, 2, 2, C.negro); b.p(8, 9, C.negro); b.p(6, 13, C.calS); b.p(8, 13, C.calS); b.p(10, 13, C.calS); },
    pantalla(b) { for (const [x, y, dx, dy] of [[2, 2, 1, 1], [13, 2, -1, 1], [2, 13, 1, -1], [13, 13, -1, -1]]) { b.r(x - (dx < 0 ? 3 : 0), y, 4, 1, C.lino); b.r(x, y - (dy < 0 ? 3 : 0), 1, 4, C.lino); } b.r(5, 5, 6, 6, C.anil); b.r(6, 6, 4, 2, C.cieloM); },
    continuar(b) { b.r(3, 3, 10, 10, C.lino); b.r(3, 3, 3, 10, C.rojo); b.r(7, 6, 5, 1, C.calS); b.r(7, 9, 4, 1, C.calS); },
    libro(b) { b.r(2, 3, 12, 10, C.rojoO); b.r(3, 4, 5, 8, C.lino); b.r(8, 4, 5, 8, C.lino); b.r(8, 3, 1, 10, C.maderaO); }
  };
  const URL = {};
  function icono(k, escala) {
    const key = k + '|' + (escala || 1);
    if (URL[key]) return URL[key];
    const b = new B(16, 16); (ICO[k] || ICO.nada)(b); b.outline(C.negro);
    const cv = b.canvas('mediodia');
    URL[key] = cv.toDataURL(); return URL[key];
  }
  V.icono = icono; V.vineta = (t, b) => vineta(t, b);

  /* ---------- marco barroco (9 piezas) y papel ---------- */
  function marco() {
    const b = new B(24, 24);
    b.r(0, 0, 24, 24, C.maderaO); b.r(1, 1, 22, 22, C.oro); b.r(2, 2, 20, 20, C.madera); b.r(3, 3, 18, 18, C.lino);
    for (const [x, y] of [[1, 1], [20, 1], [1, 20], [20, 20]]) { b.r(x, y, 3, 3, C.oro); b.p(x + 1, y + 1, C.destello); }
    for (const [x, y, dx, dy] of [[4, 4, 1, 1], [19, 4, -1, 1], [4, 19, 1, -1], [19, 19, -1, -1]]) { b.p(x, y, C.oro); b.p(x + dx, y, C.oro); b.p(x, y + dy, C.oro); b.p(x + 2 * dx, y + dy, C.tierraS); b.p(x + dx, y + 2 * dy, C.tierraS); }
    for (let i = 8; i < 16; i += 2) { b.p(i, 1, C.tierraL); b.p(i, 22, C.tierraL); b.p(1, i, C.tierraL); b.p(22, i, C.tierraL); }
    return b.canvas('mediodia').toDataURL();
  }
  function marcoRojo() {
    const b = new B(24, 24);
    b.r(0, 0, 24, 24, C.rojoO); b.r(1, 1, 22, 22, C.oro); b.r(2, 2, 20, 20, C.rojoO); b.r(3, 3, 18, 18, C.rojo);
    for (const [x, y] of [[1, 1], [20, 1], [1, 20], [20, 20]]) { b.r(x, y, 3, 3, C.oro); b.p(x + 1, y + 1, C.destello); }
    return b.canvas('mediodia').toDataURL();
  }
  function papel() {
    const b = new B(32, 32), r = V.rng(9); b.r(0, 0, 32, 32, C.lino);
    for (let i = 0; i < 40; i++) b.p(r() * 32 | 0, r() * 32 | 0, r() < 0.7 ? C.cal : C.calS);
    return b.canvas('mediodia').toDataURL();
  }
  // mesa de madera rústica: tablones con veta, nudos, juntas y clavos (pixel art, se repite sin costuras)
  /* tablero de mesa visto desde arriba: dos tablas anchas encoladas, veta larga y
     arcos de catedral, barniz gastado; sin clavos ni topes (eso lo hacía parecer suelo) */
  function mesa() {
    const W = 256, H = 192, b = new B(W, H), r = V.rng(1605), PL = 96;
    for (let t = 0; t < H / PL; t++) {
      const y0 = t * PL, base = t ? C.maderaO : C.madera, osc = t ? C.tierraP : C.maderaO;
      b.r(0, y0, W, PL, base);
      // bandas suaves de tono a lo largo de la tabla (el tinte nunca es uniforme)
      for (let k = 0; k < 5; k++) { const yy = y0 + 6 + ((r() * (PL - 16)) | 0), h = 3 + ((r() * 6) | 0);
        for (let y = yy; y < Math.min(y0 + PL, yy + h); y++) for (let x = 0; x < W; x++) if (((x * 7 + y * 3) & 3) === 0) b.p(x, y, osc); }
      // veta larga, de periodo W para que la textura case en horizontal
      for (let k = 0; k < 16; k++) {
        const yy = y0 + 3 + k * 6 + ((r() * 3) | 0), amp = 0.8 + r() * 2, f = 2 * Math.PI / W, ph = r() * 6.3;
        const col = r() < 0.55 ? osc : C.tierraP;
        for (let x = 0; x < W; x++) { if (r() < 0.22) continue; const y = Math.round(yy + Math.sin(x * f + ph) * amp + Math.sin(x * f * 3 + ph) * 0.6); if (y > y0 && y < y0 + PL - 1) b.p(x, y, col); }
      }
      // arcos de catedral: la veta que se cierra en punta, típica del tablero aserrado
      const cx = 64 + t * 128, cy = y0 + PL / 2;
      for (let n = 0; n < 6; n++) { const a = 10 + n * 6, h = 8 + n * 5;
        for (let x = -a * 3; x <= 0; x++) { const y = cy - h + Math.round((x * x) / (a * 9) * h / 4); const xx = (cx + x + W) % W;
          if (y > y0 + 1 && r() > 0.15) b.p(xx, Math.min(y, cy + h), n % 2 ? C.tierraP : osc);
          const y2 = cy + h - Math.round((x * x) / (a * 9) * h / 4); if (y2 < y0 + PL - 1 && r() > 0.15) b.p(xx, Math.max(y2, cy - h), n % 2 ? C.tierraP : osc); } }
      // un nudo pequeño por tabla, con la veta que lo rodea
      const nx = (cx + 70) % W, ny = y0 + 22 + ((r() * (PL - 44)) | 0);
      b.ell(nx, ny, 4, 2, C.tierraP); b.ell(nx, ny, 2, 1, C.negro);
      for (let x = -12; x <= 12; x++) { const d = Math.abs(x) / 12; b.p((nx + x + W) % W, Math.round(ny - 3 - (1 - d) * 3), C.tierraP); b.p((nx + x + W) % W, Math.round(ny + 3 + (1 - d) * 3), C.tierraP); }
      // brillos del barniz y alguna marca de uso (vasos, roces)
      for (let k = 0; k < 70; k++) b.p((r() * W) | 0, y0 + 2 + ((r() * (PL - 4)) | 0), C.ocre);
      for (let k = 0; k < 3; k++) { const x0 = (r() * W) | 0, y = y0 + 8 + ((r() * (PL - 16)) | 0), l = 10 + ((r() * 20) | 0); for (let x = 0; x < l; x++) if (r() > 0.3) b.p((x0 + x) % W, y + ((x / 7) | 0), C.tierraL); }
      // junta encolada: una sola línea fina, sin clavos
      b.r(0, y0, W, 1, C.tierraP); for (let x = 0; x < W; x += 1) if (r() < 0.4) b.p(x, y0, C.negro);
    }
    return b.canvas('ocaso').toDataURL();
  }
  /* utilidades para los objetos de la mesa: tramado ordenado y sombra proyectada en pixel art */
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const umbral = (x, y) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
  // escala de colores con tramado: v en [0,1] elige entre los tonos de la lista sin bandas duras
  const rampa = (lista, v, x, y) => { v = Math.max(0, Math.min(0.999, v)) * (lista.length - 1); const k = v | 0; return lista[k + ((v - k) > umbral(x, y) ? 1 : 0)] ?? lista[lista.length - 1]; };
  // sombra cenital: la luz de la vela cae desde el centro de la mesa, la sombra va hacia fuera y abajo
  function sombraDe(b, W, H, dentro, dx, dy) {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++)
      if (!dentro(x, y) && dentro(x - dx, y - dy)) { const borde = !dentro(x - dx + 1, y - dy) || !dentro(x - dx, y - dy + 1);
        if (!borde || ((x + y) & 1)) b.p(x, y, ((x + y) & 1) ? C.negro : C.tierraP); }
  }
  /* la pluma de ave tumbada sobre la mesa, vista desde arriba */
  function pluma() {
    const W = 84, H = 132, b = new B(W, H), r = V.rng(1615);
    const x0 = 8, y0 = 124, x1 = 74, y1 = 6, L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L;
    const cortes = [0.52, 0.74].map(t => [t, 0.55 + r() * 0.2]);      // barbas separadas en el borde
    const geo = (x, y) => {
      const s = (x - x0) * ux + (y - y0) * uy; if (s < -1 || s > L + 0.5) return null;
      const t = s / L, d = (x - x0) * -uy + (y - y0) * ux - Math.sin(Math.max(0, t) * Math.PI) * 4, u = (t - 0.27) / 0.73;
      const wa = u > 0 ? Math.sin(Math.min(1, u * 1.08) * Math.PI * 0.93) * 12 + 0.6 : 0;
      const wb = u > 0 ? Math.sin(Math.min(1, u * 1.15) * Math.PI * 0.88) * 5.5 : 0;
      const raq = t < 0.08 ? 1.3 : t < 0.27 ? 1.2 : 1.1 - t * 0.6;
      if (Math.abs(d) <= raq) return { k: t < 0.07 ? 'plumin' : t < 0.27 ? 'canon' : 'raquis', s, d, t };
      if (d > 0 && d <= wa) { for (const [ct, cw] of cortes) if (Math.abs(t - ct - d * 0.004) < 0.004 && d > wa * cw) return null; return { k: 'ancha', s, d, t, w: wa }; }
      if (d < 0 && -d <= wb) return { k: 'estrecha', s, d: -d, t, w: wb };
      if (t > 0.2 && t < 0.3 && Math.abs(d) < 5 && ((x * 7 + y * 13) % 5) < 2) return { k: 'plumon', s, d, t };   // plumón de la base
      return null; };
    const dentro = (x, y) => !!geo(x, y);
    sombraDe(b, W, H, dentro, 3, 3);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const g = geo(x, y); if (!g) continue;
      const borde = !dentro(x + 1, y) || !dentro(x - 1, y) || !dentro(x, y + 1) || !dentro(x, y - 1);
      let c;
      if (g.k === 'plumin') c = g.t < 0.02 ? C.negro : (Math.round(g.d * 2) === 0 ? C.negro : C.pano);
      else if (g.k === 'canon') c = g.d > 0.3 ? C.tierraS : g.d < -0.4 ? C.destello : C.ocre;
      else if (g.k === 'raquis') c = g.d > 0.2 ? C.tierraL : C.lino;
      else if (g.k === 'plumon') c = ((x + y) & 1) ? C.cal : C.calS;
      else if (g.k === 'ancha') {
        const barba = ((g.s - g.d * 1.3) % 3 + 3) % 3 < 0.9;                              // barbas inclinadas hacia la punta
        const v = g.d / g.w * 0.8 + (1 - g.t) * 0.2; c = borde ? C.calS : rampa([C.lino, C.lino, C.cal, C.calS, C.hierroL], v + (barba && g.d > 1.2 ? 0.25 : 0), x, y);
      } else {
        const barba = ((g.s - g.d * 1.3) % 3 + 3) % 3 < 0.8;
        c = borde ? C.hierro : barba ? C.hierroL : rampa([C.cal, C.calS, C.hierroL], g.d / g.w, x, y);
      }
      b.p(x, y, c);
    }
    // tinta: el plumín mojado y dos gotas que se le escaparon
    b.r(x0 - 2, y0 + 1, 2, 2, C.negro); b.p(x0 - 1, y0 + 1, C.anil);
    b.ell(x0 + 9, y0 + 3, 2, 1, C.negro); b.p(x0 + 8, y0 + 3, C.anil); b.p(x0 - 4, y0 - 5, C.negro);
    return b.canvas('ocaso').toDataURL();
  }
  /* tintero de loza de Talavera visto desde arriba: planta ochavada con biseles, collar de latón y la tinta */
  function tintero() {
    const W = 72, H = 72, b = new B(W, H), cx = 33, cy = 33, R = 23, RT = 16;
    const lx = -0.62, ly = -0.78;                                                          // la vela queda arriba a la izquierda
    const oct = (dx, dy) => Math.max(Math.abs(dx), Math.abs(dy), (Math.abs(dx) + Math.abs(dy)) / 1.3);
    const dentro = (x, y) => oct(x - cx, y - cy) <= R;
    sombraDe(b, W, H, dentro, 5, 5);
    for (const [gx, gy, gr] of [[64, 60, 2.6], [58, 67, 1.5], [7, 63, 1.8], [67, 47, 1.1]]) for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++)
      if (x * x + y * y <= gr * gr) b.p(gx + x, gy + y, x === -1 && y === -1 ? C.anil : C.negro);
    for (let y = cy - R; y <= cy + R; y++) for (let x = cx - R; x <= cx + R; x++) {
      const dx = x - cx, dy = y - cy, m = oct(dx, dy); if (m > R) continue;
      const r = Math.hypot(dx, dy);
      if (m > RT) {                                                                         // bisel: cada cara recibe la luz según su orientación
        const ax = Math.abs(dx), ay = Math.abs(dy), d3 = (ax + ay) / 1.3;
        let nx = 0, ny = 0; if (ax >= ay && ax >= d3) nx = Math.sign(dx); else if (ay >= d3) ny = Math.sign(dy); else { nx = Math.sign(dx) * 0.707; ny = Math.sign(dy) * 0.707; }
        const cara = nx * lx + ny * ly, aris = m > R - 1;
        b.p(x, y, aris ? C.hierro : rampa([C.hierro, C.calS, C.cal, C.lino], cara * 0.5 + 0.5 - (m - RT) / (R - RT) * 0.15, x, y));
        if (Math.abs(m - RT - 0.5) < 0.5) b.p(x, y, cara > 0.2 ? C.lino : C.calS);
        if (Math.abs(m - (R - 2.5)) < 0.5 && ((x + y) % 3)) b.p(x, y, C.anil);        // filete azul del bisel                 // filo superior del bisel
      } else if (r > 9.5) {                                                                 // tapa plana vidriada, con un reflejo largo
        const v = 0.45 - (dx + dy) / (RT * 3.5);
        const refl = Math.abs(dx - dy * 0.2 + 8) < 1 && dy < -2 && dy > -12, ang = Math.atan2(dy, dx);
        const Q = Math.PI / 4, da = (ang - Math.round(ang / Q) * Q) * r, db = (ang - (Math.round(ang / Q - 0.5) + 0.5) * Q) * r;
        const flor = Math.abs(r - 13.6) < 2.3 && Math.abs(da) < 1.5 * (1 - Math.abs(r - 13.6) / 2.6) || (Math.abs(r - 13) < 0.7 && Math.abs(db) < 0.7), aro = Math.abs(r - 10.6) < 0.5;   // decoración de Talavera en azul
        b.p(x, y, refl ? C.destello : flor ? (r > 14.6 ? C.violeta : C.anil) : aro ? C.anil : rampa([C.calS, C.cal, C.lino, C.lino], v, x, y));
      } else if (r > 6.5) {                                                                 // collar de latón
        const ang = Math.atan2(dy, dx), cara = Math.cos(ang - Math.atan2(ly, lx));
        b.p(x, y, r > 9 ? C.tierraS : r < 7.3 ? (cara > 0 ? C.tierraP : C.oro) : rampa([C.tierraS, C.oro, C.oro, C.destello], cara * 0.5 + 0.5, x, y));
      } else {                                                                              // tinta, con el reflejo de la vela
        const gl = Math.hypot(dx + 2.5, dy + 2.5);
        b.p(x, y, gl < 0.8 ? C.destello : gl < 1.8 ? C.anil : C.negro);
      }
    }
    // reguero de tinta que resbaló desde la boca por la tapa y el bisel
    for (let k = 0; k < 15; k++) { const px = cx + 7 + k, py = cy + 5 + Math.round(k * 0.55 + Math.sin(k * 0.9) * 0.6);
      if (!dentro(px, py)) break; b.p(px, py, C.negro); if (k < 9) b.p(px, py + 1, C.negro); if (k === 4) b.p(px, py - 1, C.anil); }
    return b.canvas('ocaso').toDataURL();
  }
  function hojaEstilo() {
    const css = [`:root{--px-mesa:url(${mesa()});--px-pluma:url(${pluma()});--px-tintero:url(${tintero()});--px-marco:url(${marco()});--px-marco-rojo:url(${marcoRojo()});--px-papel:url(${papel()})}`];
    for (const k in ICO) css.push(`.pxi-${k}{background-image:url(${icono(k)})}`);
    const st = document.createElement('style'); st.id = 'vis-iconos'; st.textContent = css.join('\n'); document.head.appendChild(st);
  }

  /* ---------- panel de estadísticas ---------- */
  const STK = { health: 'salud', sanity: 'cordura', honor: 'honor', hunger: 'saciedad', loyalty: 'sancho' };
  let prev = null;
  function valor(k) { return k === 'hunger' ? 100 - state.hunger : state[k]; }
  function panel() {
    const izq = document.querySelector('aside.left'); if (!izq) return;
    izq.classList.add('pergamino');
    for (const k in STK) {
      const m = document.getElementById('m_' + k); if (!m) continue;
      const head = m.querySelector('.meter-head span:first-child');
      if (head && !head.querySelector('.pxi')) head.insertAdjacentHTML('afterbegin', `<i class="pxi pxi-${STK[k]}" aria-hidden="true"></i>`);
      const tr = m.querySelector('.track'), fill = document.getElementById(k + 'Bar');
      if (tr && !tr.querySelector('.ghost')) tr.insertAdjacentHTML('afterbegin', '<div class="ghost" aria-hidden="true"></div>');
      const g = tr && tr.querySelector('.ghost'), v = valor(k);
      if (prev && prev[k] !== undefined && prev[k] !== v) {
        const d = v - prev[k];
        // estela: al bajar, queda la marca del valor anterior y se consume despacio
        if (g) { g.style.transition = 'none'; g.style.width = Math.max(prev[k], v) + '%'; g.className = 'ghost ' + (d < 0 ? 'baja' : 'sube'); requestAnimationFrame(() => { g.style.transition = ''; setTimeout(() => { g.style.width = v + '%'; }, V.menosMov() ? 0 : 450); }); }
        const num = document.getElementById(k + 'Num');
        if (num) {
          const f = document.createElement('span'); f.className = 'flot ' + (d > 0 ? 'up' : 'down'); f.textContent = (d > 0 ? '+' : '−') + Math.abs(d); f.setAttribute('aria-hidden', 'true');
          num.parentNode.style.position = 'relative'; num.parentNode.appendChild(f); setTimeout(() => f.remove(), 1800);
          m.classList.remove('pulso-up', 'pulso-down'); requestAnimationFrame(() => m.classList.add(d > 0 ? 'pulso-up' : 'pulso-down'));
        }
      } else if (g) g.style.width = v + '%';
      if (fill) fill.setAttribute('data-v', v);
    }
    prev = {}; for (const k in STK) prev[k] = valor(k);
  }

  /* ---------- opciones ilustradas ---------- */
  function temaDe(c) {
    if (c[2]) return { CORDURA: 'cordura', HONOR: 'honor', SACIEDAD: 'saciedad' }[c[2]] || 'dado';
    const e = c[3] || {}; let best = null, bv = 0;
    for (const k of ['health', 'sanity', 'honor', 'hunger', 'loyalty']) if (e[k] && Math.abs(e[k]) > bv) { bv = Math.abs(e[k]); best = STK[k]; }
    if ((e.items || []).length && bv < 6) return 'gana';
    if (e.coins && Math.abs(e.coins) >= bv) return 'reales';
    return best || 'libro';
  }
  const TONOF = { salud: 20, cordura: 24, honor: 23, saciedad: 10, sancho: 14, reales: 23, gana: 18, dado: 30, libro: 21 };
  function vineta(tema, buena) {
    const key = 'vin|' + tema + '|' + buena;
    if (URL[key]) return URL[key];
    const b = new B(28, 28), fondo = TONOF[tema] || 18;
    b.circ(14, 14, 13, C.maderaO); b.circ(14, 14, 12, C.oro); b.circ(14, 14, 10, fondo);
    b.dith(4, 4, 20, 20, 255, C.negro, (x, y) => Math.hypot(x - 11, y - 10) / 26);
    const i = new B(16, 16); (ICO[tema] || ICO.libro)(i); i.outline(C.negro); b.blit(i, 6, 6);
    if (buena !== undefined) b.p(22, 5, buena ? C.oro : C.rojo);
    URL[key] = b.canvas('mediodia').toDataURL(); return URL[key];
  }
  function ilustracion(scene, i) {
    const c = scenes[scene] && scenes[scene].choices[i]; if (!c) return '';
    const t = temaDe(c);
    return `<span class="choice-art px" aria-hidden="true"><img src="${vineta(t)}" alt="" width="56" height="56"></span>`;
  }
  // chips de consecuencias con icono (el texto se conserva tal cual)
  function iconoChip(txt) {
    const s = txt.trim();
    if (/^Salud/i.test(s)) return 'salud'; if (/^Cordura/i.test(s)) return 'cordura'; if (/^Honor/i.test(s)) return 'honor';
    if (/^Saciedad/i.test(s)) return 'saciedad'; if (/^Sancho/i.test(s)) return 'sancho'; if (/^Reales|reales/i.test(s)) return 'reales';
    if (/^＋/.test(s)) return 'gana'; if (/^−|^-/.test(s)) return 'pierde'; if (/Dulcinea/i.test(s)) return 'dulcinea';
    if (/infec/i.test(s)) return 'infeccion'; if (/Cura/i.test(s)) return 'cura'; if (/sin cambio/i.test(s)) return 'nada';
    return 'rel';
  }
  function chips(root) {
    root.querySelectorAll('.effect:not(.pxd)').forEach(e => { e.classList.add('pxd'); e.insertAdjacentHTML('afterbegin', `<i class="pxi pxi-${iconoChip(e.textContent)}" aria-hidden="true"></i>`); });
    root.querySelectorAll('.effect-roll:not(.pxd)').forEach(e => { e.classList.add('pxd'); e.innerHTML = e.innerHTML.replace('🎲', '<i class="pxi pxi-dado" aria-hidden="true"></i>'); });
    root.querySelectorAll('.check:not(.pxd)').forEach(e => { e.classList.add('pxd'); e.innerHTML = e.innerHTML.replace('◉', '<i class="pxi pxi-dado" aria-hidden="true"></i>'); });
  }
  function opciones() {
    const sc = document.getElementById('scene'); if (!sc) return;
    sc.querySelectorAll('.choice').forEach((b, i) => { b.classList.add('px-op'); const n = b.querySelector('.num'); if (n) n.setAttribute('aria-hidden', 'true'); });
    chips(sc);
  }

  /* ---------- mapa, alforjas y perfil con el mismo lenguaje ---------- */
  const RIB = { perfil: 'honor', alforjas: 'gana', logros: 'reales', diario: 'libro', ruta: 'ruta', fuentes: 'continuar', ajustes: 'ajustes' };
  function cintas() {
    document.querySelectorAll('#bkRibbons .rib').forEach(r => {
      if (r.querySelector('.pxi')) return;
      const k = Object.keys(RIB).find(x => (r.getAttribute('onclick') || '').includes("'" + x + "'"));
      if (k) r.insertAdjacentHTML('afterbegin', `<i class="pxi pxi-${RIB[k]}" aria-hidden="true"></i>`);
    });
  }
  function libro() {
    const pg = document.getElementById('bkPage'); if (!pg) return;
    pg.querySelectorAll('.chapter:not(.pxd)').forEach(h => {
      h.classList.add('pxd');
      const t = h.textContent.toLowerCase();
      const k = /ruta|mapa/.test(t) ? 'ruta' : /bolsa|alforja|inventario|comprar|vender/.test(t) ? 'gana' : /logro|t[ií]tulo|bestiario/.test(t) ? 'honor' : /relaci/.test(t) ? 'rel' : /estado|diario/.test(t) ? 'salud' : 'libro';
      h.insertAdjacentHTML('afterbegin', `<i class="pxi pxi-${k}" aria-hidden="true"></i>`);
    });
    chips(pg);
  }

  V.instalarUI = function () {
    hojaEstilo();
    window.illustration = ilustracion;
    const _db = window.drawBook; if (_db) window.drawBook = function () { const r = _db.apply(this, arguments); try { libro(); cintas(); } catch (e) { } return r; };
    const _om = window.openMkt; if (_om) window.openMkt = function () { const r = _om.apply(this, arguments); try { chips(document.getElementById('mktModal')); } catch (e) { } return r; };
    // el mapa lateral (SVG con filtros caros) solo se reconstruye si cambia la ruta o el contador
    const _rm = window.renderMap; let kMapa = '';
    if (_rm) window.renderMap = function () {
      const f = state.flags || {}, k = (state.trail || []).join(',') + '|' + loc(state.scene) + '|' + (f.dul || 0) + '|' + (f.des || 0) + '|' + state.mode;
      if (k === kMapa && document.querySelector('#mapbox .mapwrap')) return;
      kMapa = k; return _rm.apply(this, arguments);
    };
    const _t = V.trasRender;
    V.trasRender = function () { _t.apply(this, arguments); panel(); opciones(); };
  };
})(VIS);
