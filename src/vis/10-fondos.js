/* ===== VIS · fondos: 25 escenarios base pintados por código ===== */
(function (V) {
  'use strict';
  const { B, C, rng, perfil } = V;
  const W = 400, H = 180, GY = 158; // GY: línea de los pies
  V.W0 = W; V.H0 = H; V.GY = GY;

  /* ---------- piezas comunes ---------- */
  function cielo(b, o, yH, nubes) {
    const r = rng(o.seed + 7);
    b.bandas(0, 0, W, yH + 6, [C.cieloA, C.cieloM, C.cieloH], (x, y) => Math.pow(y / (yH + 4), 0.85), 4);
    if (o.hora === 'noche') {
      for (let i = 0; i < 90; i++) { const x = r() * W | 0, y = r() * yH * 0.85 | 0; b.p(x, y, r() < 0.2 ? C.astro : C.nube); }
      for (let i = 0; i < 6; i++) { const x = r() * W | 0, y = r() * yH * 0.6 | 0; b.p(x, y, C.astro); b.p(x - 1, y, C.nube); b.p(x + 1, y, C.nube); b.p(x, y - 1, C.nube); b.p(x, y + 1, C.nube); }
    }
    // sol o luna
    const A = { mediodia: [300, 26, 9], amanecer: [70, yH - 14, 12], ocaso: [330, yH - 12, 13], noche: [86, 30, 8] }[o.hora];
    if (A && !o.sinAstro) {
      if (o.hora !== 'noche' && o.hora !== 'mediodia') { b.dith(A[0] - 40, A[1] - 26, 80, 52, C.T, C.cieloH, (x, y) => 0.55 - Math.hypot(x - A[0], (y - A[1]) * 1.5) / 60); }
      b.circ(A[0], A[1], A[2], C.astro);
      if (o.hora === 'noche') b.circ(A[0] + 4, A[1] - 2, A[2] - 1, C.cieloA);
    }
    if (nubes !== false) {
      for (let i = 0; i < (o.hora === 'mediodia' ? 5 : 4); i++) {
        const cx = r() * W | 0, cy = 14 + r() * yH * 0.45 | 0, w = 24 + r() * 46 | 0;
        nube(b, cx, cy, w, o.hora === 'noche' ? C.sierra : C.nube, o.hora === 'noche' ? C.cieloM : C.cieloH);
        nube(b, cx - W, cy, w, o.hora === 'noche' ? C.sierra : C.nube, o.hora === 'noche' ? C.cieloM : C.cieloH);
      }
    }
  }
  function nube(b, x, y, w, c, s) {
    b.ell(x, y, w / 2, 3, s); b.ell(x - w / 6, y - 2, w / 4, 3, c); b.ell(x + w / 8, y - 3, w / 5, 3, c); b.hl(x - w / 2 + 3, x + w / 2 - 3, y + 2, s);
  }
  // silueta de montes o colinas (periódica en W)
  function montes(b, y, amp, seed, c, cl, oct) {
    const f = perfil(seed, W, oct || 4);
    for (let x = 0; x < W; x++) { const t = Math.round(y - (f(x) * 0.5 + 0.5) * amp); b.r(x, t, 1, H - t, c); if (cl !== undefined) b.p(x, t, cl); }
  }
  function suelo(b, y, o, cf) {
    cf = cf || [C.tierraL, C.ocre, C.tierraS];
    const r = rng(o.seed + 3);
    b.r(0, y, W, H - y, cf[0]);
    b.bandas(0, y, W, H - y, [cf[0], cf[1], cf[2]], (x, yy) => (yy - y) / (H - y) * 0.95, 3);
    for (let i = 0; i < 140; i++) { const x = r() * W | 0, yy = y + 2 + r() * (H - y - 2) | 0; b.p(x, yy, r() < 0.5 ? cf[2] : C.hierba); }
    for (let i = 0; i < 18; i++) { const x = r() * W | 0, yy = y + 6 + r() * (H - y - 8) | 0; b.p(x, yy, C.colina); b.p(x + 1, yy, C.tierraS); }
  }
  function camino(b, y, o) {
    // franja de camino que cruza de lado a lado bajo los pies
    b.r(0, GY - 7, W, 15, C.tierraL);
    b.dith(0, GY - 9, W, 3, C.T, C.tierraL, (x) => 0.5 + Math.sin(x * 0.3) * 0.4);
    const r = rng(o.seed + 11);
    for (let i = 0; i < 60; i++) b.p(r() * W | 0, GY - 6 + r() * 13 | 0, r() < 0.5 ? C.ocre : C.cal);
    for (let x = 0; x < W; x += 7 + (r() * 9 | 0)) b.hl(x, x + 2, GY + 2 + (r() * 4 | 0), C.ocre);
  }
  function mata(b, x, y, c1, c2) { b.ell(x, y, 4, 2, c2); b.ell(x - 1, y - 1, 3, 2, c1); b.p(x + 2, y - 2, C.hierba); }
  function encina(b, x, y, s, c) {
    c = c || [C.olivo, C.encina];
    b.r(x - 1, y - 9 * s, 2 + (s > 1 ? 1 : 0), 9 * s, C.maderaO);
    b.ell(x, y - 13 * s, 10 * s, 6 * s, c[1]);
    b.ell(x - 2 * s, y - 15 * s, 7 * s, 4 * s, c[0]);
    b.ell(x + 4 * s, y - 14 * s, 4 * s, 3 * s, c[0]);
    b.hl(x - 9 * s, x + 9 * s, y - 8 * s, c[1]);
  }
  function olivo(b, x, y, s) {
    b.line(x, y, x - 1, y - 6 * s, C.maderaO, 2); b.line(x - 1, y - 5 * s, x + 3, y - 8 * s, C.maderaO);
    b.ell(x, y - 10 * s, 8 * s, 4 * s, C.olivo); b.ell(x + 2, y - 12 * s, 5 * s, 3 * s, C.hierba); b.ell(x - 4, y - 9 * s, 3 * s, 2 * s, C.encina);
  }
  function chopo(b, x, y, s) { b.r(x, y - 6 * s, 1, 6 * s, C.maderaO); b.ell(x, y - 18 * s, 4 * s, 13 * s, C.encina); b.ell(x - 1, y - 20 * s, 2 * s, 10 * s, C.olivo); }
  function pino(b, x, y, s) {
    b.line(x, y, x + 2, y - 22 * s, C.maderaO, 2); b.ell(x + 2, y - 24 * s, 14 * s, 4 * s, C.encina); b.ell(x, y - 26 * s, 9 * s, 3 * s, C.olivo);
  }
  function casa(b, x, y, w, h, o) {
    o = o || {};
    b.r(x, y - h, w, h, C.cal); b.r(x, y - h, 2, h, C.calS); b.r(x + w - 3, y - h, 3, h, C.calS);
    b.poly([x - 3, y - h, x + w + 3, y - h, x + w - 2, y - h - 7, x + 2, y - h - 7], C.rojoO);
    b.hl(x - 3, x + w + 2, y - h, C.tierraS);
    for (let i = x; i < x + w; i += 3) b.p(i, y - h - 4, C.rojo);
    if (o.puerta !== false) { b.r(x + w * 0.35 | 0, y - 9, 5, 9, C.maderaO); b.p(x + w * 0.35 + 3 | 0, y - 5, C.oro); }
    if (h > 12) { b.r(x + w * 0.7 | 0, y - h + 5, 3, 3, o.luz ? C.brasa : C.pano); }
    if (o.chimenea) b.r(x + w - 7, y - h - 11, 3, 5, C.calS);
  }
  function molinoCuerpo(b, x, y, s) {
    const h = 26 * s, w = 9 * s;
    b.poly([x - w / 2, y, x + w / 2, y, x + w / 2 - 2 * s, y - h, x - w / 2 + 2 * s, y - h], C.cal);
    b.poly([x - w / 2, y, x - w / 2 + 3 * s, y, x - w / 2 + 3 * s + 2 * s, y - h, x - w / 2 + 2 * s, y - h], C.calS);
    b.poly([x - w / 2 + 1, y - h, x + w / 2 - 1, y - h, x, y - h - 7 * s], C.tierraP);
    b.r(x - 1, y - 7 * s, 3, 7 * s, C.maderaO); b.p(x + 1, y - h * 0.6, C.pano);
    return [x + w / 2 - 1, y - h + 2]; // eje de las aspas
  }
  function iglesia(b, x, y) {
    b.r(x, y - 26, 30, 26, C.cal); b.r(x, y - 26, 3, 26, C.calS); b.poly([x - 2, y - 26, x + 32, y - 26, x + 15, y - 34], C.rojoO);
    b.r(x + 22, y - 48, 10, 48, C.cal); b.r(x + 30, y - 48, 2, 48, C.calS); b.poly([x + 21, y - 48, x + 33, y - 48, x + 27, y - 58], C.rojoO);
    b.r(x + 25, y - 44, 4, 6, C.pano); b.p(x + 27, y - 41, C.oro); b.r(x + 10, y - 13, 7, 13, C.maderaO); b.p(x + 27, y - 60, C.hierro); b.r(x + 26, y - 62, 3, 1, C.hierro);
  }
  function viga(b, y, c) { b.r(0, y, W, 4, c || C.maderaO); b.hl(0, W, y, C.madera); for (let x = 12; x < W; x += 44) b.r(x, y + 4, 3, 3, C.maderaO); }
  function suelobaldosa(b, y, c1, c2) {
    b.r(0, y, W, H - y, c1);
    for (let j = y; j < H; j += 6) { b.hl(0, W, j, c2); for (let i = ((j / 6) & 1) * 6; i < W; i += 12) b.r(i, j, 1, 6, c2); }
  }
  function muro(b, y0, y1, c1, c2, seed) {
    const r = rng(seed); b.r(0, y0, W, y1 - y0, c1);
    for (let i = 0; i < 260; i++) b.p(r() * W | 0, y0 + r() * (y1 - y0) | 0, c2);
    for (let i = 0; i < 18; i++) { const x = r() * W | 0, y = y0 + r() * (y1 - y0 - 6) | 0; b.ell(x, y, 3 + r() * 5 | 0, 1 + r() * 2 | 0, c2); }
  }
  function ventana(b, x, y, w, h, o) {
    b.r(x - 2, y - 2, w + 4, h + 4, C.maderaO);
    if (o.noche) b.dith(x, y, w, h, C.cieloA, C.cieloM, (xx, yy) => (yy - y) / h);
    else b.dith(x, y, w, h, C.cieloH, C.astro, (xx, yy) => 0.3 + (yy - y) / h * 0.4);
    b.r(x + (w >> 1), y, 1, h, C.maderaO); b.r(x, y + (h >> 1), w, 1, C.maderaO);
  }
  function estante(b, x, y, w, rr) {
    b.r(x, y, w, 2, C.madera); b.hl(x, x + w, y + 2, C.maderaO);
    for (let i = x + 1; i < x + w - 2;) { const t = 2 + (rr() * 2 | 0), h = 7 + (rr() * 4 | 0), c = [C.rojoO, C.ocre, C.anil, C.pano, C.tierraS, C.oro][rr() * 6 | 0];
      if (rr() < 0.12) { b.line(i, y, i + 5, y - 6, c, 2); i += 6; continue; } b.r(i, y - h, t, h, c); b.p(i, y - h + 2, C.oro); i += t + (rr() < 0.2 ? 2 : 0); }
  }
  function antorcha(b, x, y) { b.r(x, y, 2, 7, C.maderaO); b.r(x - 1, y - 1, 4, 2, C.hierro); }
  function tapiz(b, x, y, w, h, c) {
    b.r(x, y, w, h, c[0]); b.r(x + 2, y + 2, w - 4, h - 4, c[1]); b.r(x + 4, y + 4, w - 8, h - 8, c[0]);
    for (let i = x + 6; i < x + w - 6; i += 5) b.p(i, y + h / 2 | 0, C.oro);
    b.hl(x - 2, x + w + 1, y - 1, C.oro); for (let i = x; i < x + w; i += 2) b.p(i, y + h, c[1]);
  }

  /* ---------- props animados (se pintan cada fotograma, directamente en el contexto) ---------- */
  // Cada fondo puede declarar: luces [{x,y,r,f}] (resplandor), anim [{t:'aspas'|'fuego'|...,x,y,s}]

  /* ---------- 25 escenarios ---------- */
  const F = {};
  const L5 = () => ({ cielo: new B(W, H), lejos: new B(W, H), medio: new B(W, H), suelo: new B(W, H), frente: new B(W, H), luces: [], anim: [], interior: false });

  function exterior(L, o, yH, lejos) {
    cielo(L.cielo, o, yH);
    if (lejos !== false) montes(L.lejos, yH + 2, 18, o.seed + 1, C.sierra, C.nube, 3);
  }

  // 1 biblioteca
  F.biblioteca = (L, o) => {
    const b = L.medio, r = rng(o.seed); L.interior = true;
    muro(b, 0, 132, C.calS, C.cal, o.seed); b.bandas(0, 0, W, 132, [C.T, C.T, C.tierraS], (x, y) => Math.min(0.99, Math.abs(x - 257) / 420 + y / 900), 2);
    viga(b, 0); viga(b, 22);
    for (let s = 0; s < 4; s++) { b.r(20, 40 + s * 22, 150, 22, C.maderaO); estante(b, 22, 60 + s * 22, 146, r); }
    b.r(18, 36, 3, 110, C.madera); b.r(170, 36, 3, 110, C.madera);
    ventana(b, 250, 38, 36, 48, { noche: o.hora === 'noche' });
    b.r(186, 128, 210, 4, C.maderaO);
    suelobaldosa(L.suelo, 132, C.tierraS, C.tierraP);
    // mesa con libros y vela
    const m = L.frente; m.r(196, 132, 74, 4, C.madera); m.r(200, 136, 3, 22, C.maderaO); m.r(262, 136, 3, 22, C.maderaO);
    for (let i = 0; i < 5; i++) m.r(204 + i * 2, 126 - i * 3, 18 - i * 2, 3, [C.rojoO, C.ocre, C.anil, C.pano, C.tierraS][i]);
    m.r(236, 128, 14, 4, C.lino); m.p(243, 128, C.pano);
    m.r(256, 122, 2, 10, C.lino); L.anim.push({ t: 'llama', x: 257, y: 121, s: 1 }); L.luces.push({ x: 257, y: 118, r: 70, f: 1 });
    // silla de cuero
    m.r(282, 112, 4, 46, C.maderaO); m.r(282, 136, 26, 3, C.rojoO); m.r(304, 139, 3, 19, C.maderaO);
  };
  // 2 alcoba
  F.alcoba = (L, o) => {
    const b = L.medio; L.interior = true;
    muro(b, 0, 134, C.cal, C.calS, o.seed); viga(b, 0);
    b.bandas(0, 0, W, 134, [C.cal, C.calS], (x, y) => y / 150, 3);
    ventana(b, 64, 40, 30, 40, { noche: o.hora === 'noche' });
    // crucifijo y arcón
    b.r(200, 44, 2, 16, C.maderaO); b.r(196, 48, 10, 2, C.maderaO);
    b.r(30, 112, 40, 22, C.madera); b.r(30, 112, 40, 3, C.maderaO); b.p(50, 122, C.oro);
    suelobaldosa(L.suelo, 134, C.ocre, C.tierraS);
    // cama de cordeles al fondo derecha
    const m = L.medio; m.r(236, 120, 130, 8, C.lino); m.r(236, 128, 130, 4, C.maderaO); m.r(236, 100, 5, 34, C.maderaO); m.r(362, 108, 5, 26, C.maderaO);
    m.r(244, 114, 22, 7, C.cal);
    if (o.hora === 'noche') { L.anim.push({ t: 'llama', x: 150, y: 110 }); m.r(146, 112, 8, 2, C.hierro); m.r(149, 112, 2, 6, C.lino); L.luces.push({ x: 150, y: 106, r: 80, f: 1 }); }
  };
  // 3 patio
  F.patio = (L, o) => {
    exterior(L, o, 84, false);
    const b = L.medio;
    b.r(0, 60, W, 82, C.cal); b.bandas(0, 60, W, 82, [C.cal, C.calS], (x, y) => (y - 60) / 82 * 0.9, 3);
    b.poly([0, 60, W, 60, W, 52, 0, 52], C.rojoO); for (let x = 0; x < W; x += 3) b.p(x, 55, C.rojo);
    b.r(40, 90, 30, 52, C.maderaO); b.r(43, 93, 24, 49, C.madera); b.p(63, 118, C.oro); // portón
    ventana(b, 150, 80, 16, 18, {}); ventana(b, 300, 78, 16, 20, {});
    b.r(220, 70, 3, 40, C.maderaO); b.r(208, 70, 28, 3, C.maderaO); // percha de armadura
    b.ell(222, 84, 6, 7, C.hierro); b.ell(221, 83, 4, 5, C.hierroL); b.r(216, 95, 12, 14, C.hierro);
    suelo(L.suelo, 140, o, [C.tierraL, C.ocre, C.tierraS]);
    // pozo
    const f = L.frente; f.r(338, 132, 28, 24, C.calS); f.r(338, 132, 28, 4, C.cal); f.r(340, 100, 2, 32, C.maderaO); f.r(362, 100, 2, 32, C.maderaO); f.r(338, 98, 28, 3, C.maderaO); f.line(352, 101, 352, 120, C.pano);
    f.r(10, 146, 40, 12, C.calS); f.r(10, 146, 40, 2, C.cal); // poyo
  };
  // 4 cocina
  F.cocina = (L, o) => {
    const b = L.medio; L.interior = true;
    muro(b, 0, 136, C.calS, C.tierraS, o.seed); viga(b, 0); viga(b, 30);
    b.bandas(0, 0, W, 136, [C.T, C.T, C.tierraS], (x, y) => Math.min(0.99, Math.abs(x - 85) / 500 + y / 700), 2);
    // lar con fuego
    b.r(40, 70, 90, 66, C.tierraS); b.r(48, 98, 74, 38, C.negro); b.poly([36, 70, 134, 70, 116, 40, 54, 40], C.calS); b.r(70, 0, 30, 40, C.calS);
    b.r(76, 116, 18, 12, C.pano); b.ell(85, 112, 10, 6, C.pano); b.hl(77, 93, 108, C.hierro);
    L.anim.push({ t: 'fuego', x: 85, y: 134, s: 1.2 }); L.luces.push({ x: 85, y: 120, r: 120, f: 1 });
    for (let i = 0; i < 6; i++) { b.r(170 + i * 8, 40, 1, 14 + (i % 2) * 4, C.lino); b.ell(170 + i * 8, 56 + (i % 2) * 4, 2, 3, C.cal); }
    b.r(240, 60, 60, 2, C.madera); [C.ocre, C.cal, C.tierraS, C.rojoO].forEach((c, i) => b.ell(250 + i * 13, 56, 5, 4, c));
    ventana(b, 330, 50, 22, 26, { noche: o.hora === 'noche' });
    suelobaldosa(L.suelo, 136, C.tierraS, C.tierraP);
    const f = L.frente; f.r(220, 128, 96, 4, C.madera); f.r(224, 132, 3, 26, C.maderaO); f.r(308, 132, 3, 26, C.maderaO); f.ell(250, 125, 7, 3, C.cal); f.ell(282, 124, 5, 4, C.ocre);
  };
  // 5 camino real (4 sub-paisajes según región)
  F.camino = (L, o) => {
    const v = o.variante || 'mancha', r = rng(o.seed);
    exterior(L, o, 108);
    if (v === 'costa') { L.medio.r(0, 108, W, 10, C.anil); L.medio.dith(0, 108, W, 10, C.anil, C.cieloM, (x, y) => 0.5 - (y - 108) / 20); }
    montes(L.medio, 122, 12, o.seed + 2, C.colina, C.tierraL, 4);
    if (v === 'olivar' || v === 'costa') for (let x = 10; x < W; x += 26 + (r() * 10 | 0)) olivo(L.medio, x, 122 + (r() * 4 | 0), 0.7);
    else if (v === 'ribera') { for (let x = 6; x < W; x += 16 + (r() * 14 | 0)) chopo(L.medio, x, 121, 1); }
    else { for (let i = 0; i < 3; i++) encina(L.medio, r() * W | 0, 124, 0.7); casa(L.medio, 260, 120, 18, 8, {}); casa(L.medio, 282, 121, 12, 7, {}); }
    suelo(L.suelo, 124, o); camino(L.suelo, 124, o);
    for (let i = 0; i < 9; i++) mata(L.suelo, r() * W | 0, 132 + r() * 12 | 0, C.hierba, C.olivo);
    if (o.props && o.props.includes('cruz')) { const f = L.medio; f.r(330, 112, 2, 26, C.calS); f.r(326, 118, 10, 2, C.calS); f.r(326, 136, 10, 3, C.calS); }
    if (o.props && o.props.includes('puente')) { const f = L.medio; f.r(40, 124, 120, 8, C.calS); for (let i = 0; i < 3; i++) f.ell(60 + i * 40, 132, 12, 6, C.violeta); f.r(130, 106, 16, 18, C.cal); f.poly([128, 106, 148, 106, 138, 98], C.rojoO); }
    // primer plano: retamas oscuras en los bordes
    const fr = L.frente; fr.ell(-4, 176, 26, 10, C.encina); fr.ell(14, 172, 10, 6, C.olivo); fr.ell(W + 2, 178, 30, 10, C.encina);
  };
  // 6 molinos
  F.molinos = (L, o) => {
    exterior(L, o, 112);
    montes(L.medio, 128, 30, o.seed + 5, C.colina, C.tierraL, 2);
    const ejes = [[90, 104, 1.1], [205, 96, 1.4], [318, 106, 1.15]];
    for (const [x, y, s] of ejes) { const e = molinoCuerpo(L.medio, x, y + 12, s); L.anim.push({ t: 'aspas', x: e[0], y: e[1], s: s }); }
    suelo(L.suelo, 130, o); camino(L.suelo, 130, o);
    const fr = L.frente; fr.ell(W - 10, 176, 34, 12, C.encina); fr.ell(-6, 178, 22, 8, C.encina);
  };
  // 7 llanura de Montiel
  F.llanura = (L, o) => {
    const r = rng(o.seed); exterior(L, o, 116);
    montes(L.medio, 126, 6, o.seed + 9, C.colina, C.tierraL, 3);
    encina(L.medio, 300, 128, 1.3);
    suelo(L.suelo, 126, o, [C.hierba, C.tierraL, C.ocre]);
    for (let y = 128; y < H; y += 4) for (let x = (y * 7) % 11; x < W; x += 11) L.suelo.p(x, y, C.ocre); // rastrojo
    for (let i = 0; i < 8; i++) mata(L.suelo, r() * W | 0, 134 + r() * 14 | 0, C.olivo, C.encina);
    if (o.props && o.props.includes('charco')) { L.suelo.ell(250, 166, 26, 4, C.olivo); L.suelo.ell(250, 165, 20, 2, C.cieloH); }
    if (o.props && o.props.includes('pedregal')) for (let i = 0; i < 26; i++) { const x = 40 + r() * 320 | 0, y = 150 + r() * 22 | 0; L.suelo.ell(x, y, 3, 2, C.calS); L.suelo.p(x - 1, y - 1, C.cal); }
    if (o.props && o.props.includes('melonar')) for (let i = 0; i < 20; i++) { const x = 220 + (i % 7) * 24, y = 136 + (i / 7 | 0) * 10; L.suelo.ell(x, y, 4, 3, C.olivo); L.suelo.ell(x + 2, y + 1, 2, 2, C.hierba); }
    L.frente.ell(-2, 178, 24, 8, C.encina);
  };
  // 8 vado
  F.vado = (L, o) => {
    const r = rng(o.seed); exterior(L, o, 104);
    montes(L.medio, 120, 10, o.seed + 4, C.colina, C.hierba, 3);
    for (let x = 0; x < W; x += 18 + (r() * 20 | 0)) chopo(L.medio, x, 122, 1.1);
    suelo(L.suelo, 122, o, [C.hierba, C.olivo, C.encina]);
    L.suelo.r(0, 168, W, 12, C.anil); L.suelo.dith(0, 166, W, 6, C.T, C.anil, (x, y) => (y - 166) / 4 + Math.sin(x * 0.2) * 0.2);
    L.anim.push({ t: 'agua', y: 170, h: 10 });
    for (let i = 0; i < 10; i++) mata(L.suelo, r() * W | 0, 128 + r() * 12 | 0, C.hierba, C.olivo);
  };
  // 9 venta (exterior)
  F.venta = (L, o) => {
    exterior(L, o, 108);
    montes(L.medio, 124, 8, o.seed + 6, C.colina, C.tierraL, 3);
    const b = L.medio;
    b.r(150, 70, 230, 64, C.cal); b.bandas(150, 70, 230, 64, [C.cal, C.calS], (x, y) => (y - 70) / 80, 3);
    b.poly([144, 70, 386, 70, 370, 56, 160, 56], C.rojoO); for (let x = 160; x < 370; x += 3) b.p(x, 62, C.rojo);
    b.r(230, 92, 34, 42, C.maderaO); b.r(233, 95, 28, 39, C.madera); b.r(246, 95, 1, 39, C.maderaO);
    b.r(300, 84, 10, 10, o.hora === 'noche' || o.hora === 'ocaso' ? C.brasa : C.pano); b.r(180, 86, 10, 10, o.hora === 'noche' ? C.brasa : C.pano);
    if (o.hora === 'noche' || o.hora === 'ocaso') { L.luces.push({ x: 305, y: 89, r: 40, f: 0 }); L.luces.push({ x: 185, y: 91, r: 34, f: 0 }); }
    b.r(366, 40, 8, 16, C.calS); b.r(276, 76, 18, 4, C.madera); b.r(282, 80, 2, 10, C.maderaO); // rama de venta
    b.r(70, 100, 80, 34, C.tierraL); b.dith(70, 100, 80, 34, C.T, C.ocre, (x, y) => (y - 100) / 40); b.hl(70, 150, 100, C.cal); // tapia
    suelo(L.suelo, 134, o); camino(L.suelo, 134, o);
    const f = L.frente; f.r(30, 136, 36, 10, C.calS); f.r(32, 138, 32, 3, C.anil); // abrevadero
    if (o.props && o.props.includes('manta')) { L.anim.push({ t: 'manta', x: 270, y: 146 }); }
  };
  // 10 venta (interior)
  F.ventainterior = (L, o) => {
    const b = L.medio, r = rng(o.seed); L.interior = true;
    muro(b, 0, 136, C.ocre, C.tierraS, o.seed); b.bandas(0, 0, W, 136, [C.T, C.T, C.tierraS], (x, y) => Math.min(0.99, Math.abs(x - 241) / 360 + y / 800), 2);
    viga(b, 0); viga(b, 26); b.r(0, 30, 3, 106, C.maderaO);
    for (let i = 0; i < 4; i++) { const x = 30 + i * 28; b.ell(x, 112, 10, 14, C.tierraP); b.ell(x - 2, 108, 7, 10, C.maderaO); b.r(x - 2, 96, 4, 3, C.madera); } // cueros de vino
    for (let i = 0; i < 5; i++) { b.r(170 + i * 12, 56, 1, 10, C.pano); b.ell(170 + i * 12, 68, 3, 3, C.ocre); }
    b.r(240, 46, 3, 10, C.hierro); L.anim.push({ t: 'llama', x: 241, y: 45 }); L.luces.push({ x: 241, y: 48, r: 110, f: 1 });
    b.r(300, 50, 70, 86, C.maderaO); b.r(304, 54, 62, 82, C.negro); // puerta al patio
    if (o.hora !== 'noche') { b.bandas(304, 54, 62, 50, [C.cieloM, C.cieloH], (x, y) => (y - 54) / 50, 3); b.r(304, 104, 62, 32, C.tierraL); b.r(304, 104, 62, 2, C.colina); }
    suelobaldosa(L.suelo, 136, C.tierraS, C.tierraP);
    const f = L.frente; f.r(150, 132, 120, 4, C.madera); f.r(154, 136, 3, 22, C.maderaO); f.r(262, 136, 3, 22, C.maderaO);
    f.ell(176, 129, 5, 3, C.cal); f.r(200, 124, 5, 8, C.tierraS); f.ell(230, 129, 6, 3, C.ocre);
    if (o.props && o.props.includes('retablo')) { f.r(190, 84, 70, 48, C.rojoO); f.r(196, 90, 58, 34, C.negro); f.r(190, 84, 70, 4, C.oro); f.poly([186, 84, 264, 84, 225, 72], C.oro); }
    if (o.props && o.props.includes('escribano')) { f.r(212, 120, 18, 4, C.lino); f.r(232, 116, 2, 8, C.pano); }
  };
  // 11 majada (fogata de noche)
  F.majada = (L, o) => {
    const r = rng(o.seed); exterior(L, o, 110);
    montes(L.medio, 126, 14, o.seed + 8, C.colina, C.tierraL, 3);
    encina(L.medio, 60, 132, 1.6); encina(L.medio, 352, 130, 1.4); encina(L.medio, 260, 126, 0.8);
    suelo(L.suelo, 128, o, [C.hierba, C.olivo, C.tierraS]);
    const f = L.suelo; for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28; f.ell(200 + Math.cos(a) * 14, 160 + Math.sin(a) * 4, 3, 2, C.calS); }
    f.line(190, 160, 210, 156, C.maderaO, 2); f.line(192, 156, 208, 161, C.maderaO, 2);
    L.anim.push({ t: 'fuego', x: 200, y: 158, s: 1.4 }); L.luces.push({ x: 200, y: 146, r: 150, f: 1 });
    f.ell(130, 162, 7, 4, C.tierraS); f.ell(262, 164, 8, 4, C.maderaO); // zurrones
  };
  // 12 encinar
  F.encinar = (L, o) => {
    const r = rng(o.seed); exterior(L, o, 96);
    for (let x = -10; x < W; x += 30 + (r() * 16 | 0)) encina(L.lejos, x, 118, 1.2, [C.colina, C.sierra]);
    for (let x = 0; x < W; x += 46 + (r() * 30 | 0)) encina(L.medio, x, 128 + (r() * 6 | 0), 1.7);
    suelo(L.suelo, 126, o, [C.hierba, C.olivo, C.encina]);
    for (let i = 0; i < 16; i++) mata(L.suelo, r() * W | 0, 130 + r() * 18 | 0, C.olivo, C.encina);
    const fr = L.frente; fr.r(4, 0, 9, 180, C.maderaO); fr.ell(8, 6, 40, 22, C.encina); fr.ell(W - 6, 4, 46, 26, C.encina); fr.r(W - 14, 0, 7, 180, C.maderaO);
  };
  // 13 pinar
  F.pinar = (L, o) => {
    const r = rng(o.seed); exterior(L, o, 100);
    montes(L.lejos, 112, 26, o.seed + 12, C.sierra, C.nube, 3);
    montes(L.medio, 126, 16, o.seed + 13, C.colina, C.tierraL, 3);
    for (let x = 0; x < W; x += 34 + (r() * 24 | 0)) pino(L.medio, x, 128, 1.1 + r() * 0.4);
    for (let i = 0; i < 4; i++) { const x = r() * W | 0; L.medio.ell(x, 128, 12, 8, C.calS); L.medio.ell(x - 3, 125, 8, 5, C.cal); } // peñas
    suelo(L.suelo, 128, o, [C.tierraL, C.ocre, C.tierraS]);
    for (let i = 0; i < 60; i++) L.suelo.p(r() * W | 0, 130 + r() * 50 | 0, C.maderaO);
    const fr = L.frente; fr.line(W - 18, 180, W - 10, 0, C.maderaO, 6); fr.ell(W - 10, 0, 40, 10, C.encina);
  };
  // 14 sierra
  F.sierra = (L, o) => {
    const r = rng(o.seed); exterior(L, o, 92, false);
    montes(L.lejos, 96, 40, o.seed + 14, C.sierra, C.nube, 5);
    montes(L.medio, 118, 44, o.seed + 15, C.colina, C.tierraL, 5);
    for (let i = 0; i < 10; i++) { const x = r() * W | 0, y = 104 + r() * 18 | 0; L.medio.ell(x, y, 10 + r() * 10 | 0, 6, C.calS); L.medio.ell(x - 3, y - 2, 6, 3, C.cal); }
    for (let i = 0; i < 12; i++) mata(L.medio, r() * W | 0, 112 + r() * 16 | 0, C.olivo, C.encina);
    suelo(L.suelo, 132, o, [C.ocre, C.tierraS, C.tierraP]);
    const fr = L.frente; fr.poly([0, 180, 0, 128, 14, 116, 26, 136, 32, 180], C.tierraP); fr.poly([W, 180, W, 118, W - 22, 138, W - 34, 180], C.tierraP); fr.hl(2, 18, 120, C.tierraS);
    if (o.props && o.props.includes('ermita')) { casa(L.medio, 300, 112, 26, 16, { luz: o.hora === 'noche' }); L.medio.r(312, 82, 2, 12, C.calS); L.medio.r(309, 85, 8, 2, C.calS); }
  };
  // 15 plaza de aldea
  F.plaza = (L, o) => {
    const r = rng(o.seed); exterior(L, o, 100);
    const b = L.medio;
    casa(b, 4, 132, 48, 30, { chimenea: 1, luz: o.hora === 'noche' }); casa(b, 56, 132, 34, 24, {}); iglesia(b, 150, 132);
    casa(b, 210, 132, 40, 28, { luz: o.hora !== 'mediodia' }); casa(b, 256, 132, 30, 22, {}); casa(b, 292, 132, 56, 32, { chimenea: 1 }); casa(b, 352, 132, 46, 26, {});
    encina(b, 118, 134, 1.5, [C.olivo, C.encina]); // olmo
    suelo(L.suelo, 132, o, [C.tierraL, C.ocre, C.tierraS]);
    if (o.props && o.props.includes('bodas')) { for (let x = 30; x < 380; x += 6) L.medio.p(x, 98 + Math.round(Math.sin(x / 20) * 4), [C.rojo, C.oro, C.anil][x / 6 % 3 | 0]); L.medio.r(250, 116, 60, 4, C.madera); }
    L.frente.r(0, 140, 10, 40, C.calS); L.frente.r(W - 12, 128, 12, 52, C.cal); L.frente.r(W - 12, 128, 3, 52, C.calS);
  };
  // 16 ciudad
  F.ciudad = (L, o) => {
    const r = rng(o.seed); exterior(L, o, 90);
    const b = L.lejos; for (let x = 0; x < W; x += 20 + (r() * 16 | 0)) { const h = 20 + r() * 26 | 0; b.r(x, 100 - h, 16, h, C.sierra); if (r() < 0.3) { b.r(x + 5, 100 - h - 16, 6, 16, C.sierra); b.poly([x + 4, 100 - h - 16, x + 12, 100 - h - 16, x + 8, 100 - h - 24], C.sierra); } }
    const m = L.medio;
    for (let x = 0; x < W; x += 60) {
      m.r(x, 52, 58, 84, (x / 60) % 2 ? C.cal : C.tierraL); m.r(x + 56, 52, 2, 84, C.calS);
      m.poly([x - 2, 52, x + 60, 52, x + 56, 46, x + 2, 46], C.rojoO);
      for (let i = 0; i < 3; i++) { m.r(x + 8 + i * 16, 64, 8, 10, o.hora === 'noche' && i === 1 ? C.brasa : C.pano); m.r(x + 6 + i * 16, 74, 12, 2, C.hierro); }
      // soportal
      m.r(x, 106, 58, 3, C.calS); for (let i = 0; i < 3; i++) { m.ell(x + 10 + i * 19, 118, 7, 10, C.violeta); m.r(x + 3 + i * 19, 116, 14, 20, C.violeta); }
      for (let i = 0; i <= 3; i++) m.r(x + i * 19 - 1, 106, 3, 30, C.cal);
    }
    if (o.hora === 'noche') L.luces.push({ x: 140, y: 69, r: 30, f: 0 });
    suelobaldosa(L.suelo, 136, C.calS, C.tierraS);
    if (o.props && o.props.includes('carteles')) { m.r(90, 84, 12, 14, C.lino); m.r(212, 86, 12, 12, C.lino); m.hl(92, 100, 88, C.pano); m.hl(214, 222, 90, C.pano); }
  };
  // 17 casa noble (sala)
  F.casanoble = (L, o) => {
    const b = L.medio; L.interior = true;
    muro(b, 0, 136, C.calS, C.tierraL, o.seed); b.r(0, 96, W, 40, C.madera); b.hl(0, W, 96, C.oro); for (let x = 0; x < W; x += 24) b.r(x, 100, 1, 36, C.maderaO);
    viga(b, 0);
    tapiz(b, 30, 24, 80, 60, [C.rojoO, C.rojo]); tapiz(b, 290, 24, 80, 60, [C.anil, C.violeta]);
    b.r(160, 40, 80, 56, C.calS); b.r(166, 70, 68, 26, C.negro); b.poly([156, 40, 244, 40, 236, 30, 164, 30], C.calS); // chimenea
    L.anim.push({ t: 'fuego', x: 200, y: 94, s: 1.1 }); L.luces.push({ x: 200, y: 84, r: 120, f: 1 });
    suelobaldosa(L.suelo, 136, C.rojoO, C.rojo);
    if (o.props && o.props.includes('banquete')) { const f = L.frente; f.r(120, 130, 170, 5, C.lino); f.r(124, 135, 3, 23, C.maderaO); f.r(282, 135, 3, 23, C.maderaO);
      for (let i = 0; i < 6; i++) { f.ell(136 + i * 26, 127, 5, 3, [C.oro, C.ocre, C.cal][i % 3]); f.r(146 + i * 26, 120, 2, 8, C.oro); } }
    if (o.props && o.props.includes('cabeza')) { const f = L.frente; f.r(230, 128, 30, 30, C.maderaO); f.r(228, 126, 34, 3, C.madera); f.ell(245, 114, 8, 10, C.oro); f.ell(243, 112, 5, 6, C.destello); }
    antorcha(b, 130, 50); antorcha(b, 268, 50); L.anim.push({ t: 'llama', x: 131, y: 49 }, { t: 'llama', x: 269, y: 49 });
  };
  // 18 salón del palacio de los duques
  F.salon = (L, o) => {
    const b = L.medio; L.interior = true;
    b.r(0, 0, W, 136, C.cal); b.bandas(0, 0, W, 136, [C.cal, C.calS], (x, y) => y / 160, 3);
    for (let i = 0; i < 5; i++) { const x = 10 + i * 82; b.r(x, 20, 12, 116, C.calS); b.r(x + 2, 20, 3, 116, C.cal); b.r(x - 2, 18, 16, 4, C.oro); }
    for (let i = 0; i < 4; i++) { const x = 30 + i * 82; b.ell(x + 21, 40, 21, 16, C.violeta); b.r(x, 40, 42, 70, C.violeta); tapiz(b, x + 6, 44, 30, 54, i % 2 ? [C.anil, C.violeta] : [C.rojoO, C.rojo]); }
    b.r(0, 120, W, 16, C.madera); b.hl(0, W, 120, C.oro);
    // estrado
    b.r(140, 108, 120, 12, C.rojoO); b.hl(140, 260, 108, C.oro); b.r(176, 70, 14, 38, C.rojo); b.r(210, 70, 14, 38, C.rojo); b.r(174, 66, 18, 4, C.oro); b.r(208, 66, 18, 4, C.oro);
    suelobaldosa(L.suelo, 136, C.calS, C.tierraS);
    for (let x = 60; x < W; x += 140) { antorcha(b, x, 60); L.anim.push({ t: 'llama', x: x + 1, y: 59 }); L.luces.push({ x: x + 1, y: 60, r: 70, f: 1 }); }
    if (o.props && o.props.includes('catafalco')) { const f = L.frente; f.r(250, 120, 80, 14, C.pano); f.r(254, 112, 72, 8, C.negro); f.r(286, 104, 14, 8, C.lino); for (let i = 0; i < 4; i++) { f.r(252 + i * 24, 96, 2, 16, C.lino); L.anim.push({ t: 'llama', x: 253 + i * 24, y: 95 }); } }
    if (o.props && o.props.includes('trono')) { const f = L.frente; f.r(300, 112, 26, 30, C.rojoO); f.r(298, 106, 30, 6, C.oro); }
  };
  // 19 liza (patio del palacio con palenque)
  F.liza = (L, o) => {
    const r = rng(o.seed); exterior(L, o, 82);
    const b = L.medio;
    b.r(0, 40, W, 74, C.cal); b.bandas(0, 40, W, 74, [C.cal, C.calS], (x, y) => (y - 40) / 90, 3);
    for (let x = 0; x < W; x += 16) { b.r(x, 32, 9, 8, C.cal); } // almenas
    b.r(160, 4, 80, 110, C.cal); b.r(160, 4, 4, 110, C.calS); for (let x = 160; x < 240; x += 14) b.r(x, -4, 8, 10, C.cal);
    for (let i = 0; i < 3; i++) b.r(178 + i * 20, 28, 6, 12, C.pano);
    L.anim.push({ t: 'bandera', x: 200, y: 4 });
    // tablados con público
    for (let i = 0; i < 2; i++) { const x = i ? 270 : 20; b.r(x, 96, 110, 18, C.madera); b.poly([x - 4, 80, x + 114, 80, x + 110, 74, x, 74], i ? C.anil : C.rojo);
      for (let k = 0; k < 14; k++) { const px = x + 4 + k * 8; b.r(px, 88, 4, 8, [C.rojo, C.anil, C.ocre, C.pano, C.verde || C.olivo][k % 5]); b.r(px, 84, 4, 4, C.piel); } }
    suelo(L.suelo, 114, o, [C.tierraL, C.ocre, C.tierraS]);
    for (let x = 0; x < W; x += 20) { L.suelo.r(x, 132, 2, 12, C.madera); } L.suelo.r(0, 134, W, 2, C.madera); // valla
    if (o.props && o.props.includes('clavileno')) L.anim.push({ t: 'clavileno', x: 200, y: 150 });
  };
  // 20 calabozo / Casa del Nuncio
  F.calabozo = (L, o) => {
    const b = L.medio; L.interior = true;
    muro(b, 0, 138, C.tierraS, C.tierraP, o.seed);
    for (let y = 0; y < 138; y += 9) for (let x = (y / 9 & 1) * 12; x < W; x += 24) { b.hl(x, x + 22, y, C.tierraP); b.r(x, y, 1, 9, C.tierraP); }
    b.dith(0, 0, W, 138, C.T, C.violeta, (x, y) => 0.45 + Math.abs(x - 200) / 600);
    b.r(180, 20, 40, 30, C.negro); b.dith(182, 22, 36, 26, C.cieloH, C.astro, () => 0.3); for (let i = 0; i < 4; i++) b.r(186 + i * 9, 20, 2, 30, C.hierro);
    L.luces.push({ x: 200, y: 40, r: 90, f: 0, rayo: 1 });
    b.r(40, 80, 3, 3, C.hierro); b.line(41, 83, 52, 120, C.hierro); b.line(52, 120, 46, 134, C.hierro); // cadena
    suelo(L.suelo, 138, o, [C.tierraS, C.tierraP, C.negro]);
    for (let i = 0; i < 40; i++) { const r = rng(i + 9); L.suelo.line(300 + r() * 80, 150 + r() * 20, 300 + r() * 80 + 6, 150 + r() * 20, C.oro); } // paja
    if (o.props && o.props.includes('caldero')) { const f = L.frente; f.ell(320, 150, 16, 10, C.pano); f.hl(304, 336, 141, C.hierro); }
    const fr = L.frente; for (let i = 0; i < 6; i++) fr.r(i * 9, 0, 3, 180, C.hierro); fr.r(0, 20, 52, 3, C.hierro); fr.r(0, 150, 52, 3, C.hierro);
  };
  // 21 río Ebro
  F.rio = (L, o) => {
    const r = rng(o.seed); exterior(L, o, 98);
    montes(L.medio, 112, 10, o.seed + 16, C.colina, C.hierba, 3);
    for (let x = 0; x < W; x += 14 + (r() * 22 | 0)) chopo(L.medio, x, 114, 1.2);
    // aceña
    casa(L.medio, 300, 114, 40, 22, {}); L.medio.ell(296, 112, 10, 10, C.madera); L.medio.ell(296, 112, 7, 7, C.maderaO);
    L.suelo.r(0, 116, W, 30, C.anil); L.suelo.dith(0, 116, W, 30, C.anil, C.cieloM, (x, y) => 0.6 - (y - 116) / 40 + Math.sin(x * 0.15 + y) * 0.15);
    L.anim.push({ t: 'agua', y: 118, h: 26 });
    suelo(L.suelo, 146, o, [C.hierba, C.olivo, C.encina]);
    if (o.props && o.props.includes('barca')) L.anim.push({ t: 'barca', x: 210, y: 132 });
    L.frente.ell(-6, 176, 30, 10, C.encina); L.frente.ell(W + 4, 178, 24, 10, C.encina);
  };
  // 22 batanes
  F.batanes = (L, o) => {
    const r = rng(o.seed); exterior(L, o, 100);
    for (let x = -20; x < W; x += 40) encina(L.lejos, x, 116, 1.6, [C.sierra, C.colina]);
    const b = L.medio; b.r(250, 84, 110, 46, C.calS); b.poly([244, 84, 366, 84, 350, 70, 260, 70], C.tierraP); b.r(268, 100, 24, 30, C.negro);
    L.anim.push({ t: 'mazos', x: 280, y: 104 });
    L.suelo.r(0, 130, W, 18, C.anil); L.anim.push({ t: 'agua', y: 132, h: 14 });
    suelo(L.suelo, 148, o, [C.hierba, C.olivo, C.encina]);
    const fr = L.frente; fr.ell(10, 10, 60, 30, C.encina); fr.ell(W - 10, 4, 50, 24, C.encina);
  };
  // 23 cueva de Montesinos
  F.cueva = (L, o) => {
    const b = L.medio; L.interior = true;
    b.r(0, 0, W, H, C.tierraP);
    b.dith(0, 0, W, H, C.tierraP, C.negro, (x, y) => Math.abs(x - 200) / 240 + Math.abs(y - 80) / 300);
    b.ell(200, 60, 110, 70, C.violeta); b.ell(200, 60, 90, 56, C.negro);
    // cripta de cristal soñada
    b.poly([150, 140, 250, 140, 236, 70, 200, 40, 164, 70], C.cieloM); b.poly([160, 140, 240, 140, 228, 76, 200, 52, 172, 76], C.cieloH);
    for (let i = 0; i < 5; i++) b.line(172 + i * 14, 140, 180 + i * 10, 70, C.nube);
    L.luces.push({ x: 200, y: 96, r: 120, f: 0, frio: 1 });
    suelo(L.suelo, 140, o, [C.tierraS, C.tierraP, C.negro]);
    const fr = L.frente; fr.poly([0, 0, 90, 0, 60, 60, 30, 180, 0, 180], C.negro); fr.poly([W, 0, W - 90, 0, W - 50, 70, W - 30, 180, W, 180], C.negro);
    fr.line(200, 0, 204, 40, C.ocre); // soga
  };
  // 24 playa de Barcelona
  F.playa = (L, o) => {
    const r = rng(o.seed); exterior(L, o, 96, false);
    const b = L.lejos; b.r(0, 96, W, 30, C.anil); b.dith(0, 96, W, 30, C.cieloM, C.anil, (x, y) => (y - 96) / 16);
    // murallas y ciudad a la izquierda
    const m = L.medio; m.r(0, 78, 130, 40, C.calS); for (let x = 0; x < 130; x += 10) m.r(x, 72, 6, 6, C.calS);
    m.r(40, 52, 18, 30, C.calS); m.r(90, 46, 14, 36, C.calS); m.poly([88, 46, 106, 46, 97, 34], C.rojoO);
    if (o.props && o.props.includes('galeras')) for (let i = 0; i < 3; i++) galera(m, 190 + i * 70, 112 - i * 4, i === 0 ? 1 : 0.8);
    else galera(m, 300, 108, 0.6);
    L.anim.push({ t: 'olas', y: 120 });
    suelo(L.suelo, 126, o, [C.tierraL, C.cal, C.ocre]);
    L.suelo.dith(0, 124, W, 6, C.cal, C.tierraL, (x, y) => (y - 124) / 6);
    for (let i = 0; i < 20; i++) L.suelo.p(r() * W | 0, 134 + r() * 40 | 0, C.calS);
  };
  function galera(b, x, y, s) {
    b.poly([x - 34 * s, y, x + 34 * s, y, x + 26 * s, y + 7 * s, x - 28 * s, y + 7 * s], C.maderaO); b.hl(x - 34 * s, x + 34 * s, y, C.rojo);
    for (let i = -24; i < 24; i += 4) b.line(x + i * s, y + 6 * s, x + (i - 3) * s, y + 12 * s, C.madera);
    b.line(x, y, x, y - 34 * s, C.maderaO); b.poly([x - 20 * s, y - 30 * s, x + 18 * s, y - 8 * s, x, y - 32 * s], C.lino);
    b.r(x - 1, y - 38 * s, 6 * s, 3, C.rojo);
  }
  // 25 entre páginas (sueño, fiebre, locura)
  F.entrepaginas = (L, o) => {
    const r = rng(o.seed); L.interior = true; L.papel = true;
    const b = L.cielo; b.r(0, 0, W, H, C.lino); b.dith(0, 0, W, H, C.lino, C.calS, (x, y) => Math.abs(x - 200) / 260 + y / 600);
    for (let y = 18; y < 120; y += 8) for (let x = 20; x < W - 20;) { const w = 4 + r() * 18 | 0; if (r() < 0.85) b.hl(x, x + w, y, C.calS); x += w + 3; } // renglones
    b.r(198, 0, 4, H, C.calS); b.r(199, 0, 1, H, C.tierraS); // lomo del libro
    // la Mancha en grabado: línea de horizonte, molinos y colinas a plumilla
    const m = L.medio, f = perfil(o.seed + 3, W, 3);
    for (let x = 0; x < W; x++) { const t = 120 - Math.round((f(x) * 0.5 + 0.5) * 16); m.p(x, t, C.pano); if (x % 3 === 0) for (let y = t + 3; y < 136; y += 4) m.p(x + (y & 1), y, C.tierraS); }
    for (const [x, s] of [[70, 0.9], [150, 1.2], [300, 1]]) { const h = 24 * s; m.line(x - 4 * s, 124, x - 2 * s, 124 - h, C.pano); m.line(x + 4 * s, 124, x + 2 * s, 124 - h, C.pano); m.line(x - 3 * s, 124 - h, x, 124 - h - 6 * s, C.pano); m.line(x + 3 * s, 124 - h, x, 124 - h - 6 * s, C.pano); L.anim.push({ t: 'aspasTinta', x: x + 2 * s, y: 124 - h + 2, s: s }); }
    suelo(L.suelo, 136, o, [C.lino, C.calS, C.tierraS]);
    L.anim.push({ t: 'letras' });
  };

  V.FONDOS = F;
  V.pintarFondo = function (id, o) {
    const L = L5(); (F[id] || F.camino)(L, o); return L;
  };
})(VIS);
