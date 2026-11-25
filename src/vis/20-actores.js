/* ===== VIS · actores: personajes por capas y animales, con animación ===== */
(function (V) {
  'use strict';
  const { B, C, TONO, cache } = V;
  const FW = 44, FH = 72, AX = 22, AY = 71; // búfer de figura y ancla (pies)

  /* ---------- catálogo ----------
     cuerpo: flaco|medio|grueso|mujer|habito ; alto en px ; tonos de TONO ;
     tocado, barba, pelo, acc (accesorio), capa, extra */
  const P = {
    dq: { n: 'Don Quijote', cuerpo: 'flaco', alto: 52, pelo: 'gris', barba: 'perilla', tocado: 'celada', jubon: 'hierro', calzas: 'pardo', capa: null, acc: 'lanza', extra: 'armadura' },
    alonso: { n: 'Alonso Quijano', cuerpo: 'flaco', alto: 50, pelo: 'gris', barba: 'perilla', tocado: 'gorro', jubon: 'pardo', calzas: 'negro', acc: null, extra: 'ropon' },
    sancho: { n: 'Sancho Panza', cuerpo: 'grueso', alto: 38, pelo: 'negro', barba: 'corta', tocado: 'paja', jubon: 'ocre', calzas: 'pardo', acc: null, extra: 'barriga' },
    // los doce tipos
    arriero: { cuerpo: 'medio', alto: 44, pelo: 'negro', barba: 'corta', tocado: 'panuelo', jubon: 'pardo', calzas: 'tierra', acc: 'vara' },
    ventero: { cuerpo: 'grueso', alto: 42, pelo: 'negro', barba: 'bigote', tocado: 'gorra', jubon: 'blanco', calzas: 'pardo', extra: 'mandil barriga' },
    cabrero: { cuerpo: 'medio', alto: 44, pelo: 'pardo', barba: 'corta', tocado: 'gorra', jubon: 'tierra', calzas: 'pardo', acc: 'cayado', extra: 'zamarra' },
    dama: { cuerpo: 'mujer', alto: 42, pelo: 'negro', tocado: 'toca', jubon: 'rojo', saya: 'rojo', extra: 'gola' },
    cura: { cuerpo: 'habito', alto: 44, pelo: 'gris', tocado: 'teja', jubon: 'negro', acc: 'libro' },
    bandolero: { cuerpo: 'medio', alto: 45, pelo: 'negro', barba: 'larga', tocado: 'chambergo', jubon: 'verde', calzas: 'pardo', capa: 'pardo', acc: 'arcabuz' },
    duque: { cuerpo: 'medio', alto: 46, pelo: 'pardo', barba: 'perilla', tocado: 'chambergo', jubon: 'negro', calzas: 'negro', capa: 'negro', extra: 'gola espada', pluma: 'blanco' },
    duquesa: { cuerpo: 'mujer', alto: 43, pelo: 'oro', tocado: 'tocado', jubon: 'verde', saya: 'verde', extra: 'gola joyas' },
    moza: { cuerpo: 'mujer', alto: 41, pelo: 'pardo', tocado: 'panuelo', jubon: 'blanco', saya: 'ocre', extra: 'mandil' },
    clerigo: { cuerpo: 'habito', alto: 45, pelo: 'gris', tocado: 'capucha', jubon: 'pardo', acc: 'cruz' },
    estudiante: { cuerpo: 'medio', alto: 44, pelo: 'pardo', tocado: 'bonete', jubon: 'negro', calzas: 'negro', capa: 'negro', acc: 'libro' },
    soldado: { cuerpo: 'medio', alto: 46, pelo: 'negro', barba: 'bigote', tocado: 'morrion', jubon: 'rojo', calzas: 'ocre', acc: 'pica', extra: 'peto' }
  };
  // variantes (heredan de un tipo y cambian tonos o piezas)
  const VAR = {
    alonso_noche: ['alonso', { tocado: 'gorro', jubon: 'blanco' }],
    impostor: ['dq', { n: 'El impostor', jubon: 'negro', calzas: 'negro', pelo: 'negro', tinta: 1 }],
    ama: ['moza', { n: 'El ama', jubon: 'negro', saya: 'negro', tocado: 'toca', pelo: 'gris' }],
    teresa: ['moza', { n: 'Teresa Panza', saya: 'rojo', jubon: 'ocre' }],
    maritornes: ['moza', { n: 'Maritornes', saya: 'pardo', jubon: 'blanco', pelo: 'negro', tocado: null, extra: 'mandil grueso' }],
    marcela: ['moza', { n: 'Marcela', saya: 'verde', jubon: 'blanco', tocado: null, pelo: 'oro', acc: 'cayado' }],
    dorotea: ['moza', { n: 'Dorotea', saya: 'azul', jubon: 'blanco', tocado: null, pelo: 'oro' }],
    zoraida: ['dama', { n: 'Zoraida', jubon: 'azul', saya: 'azul', tocado: 'velo', extra: 'joyas' }],
    ana: ['dama', { n: 'Ana Félix', jubon: 'oro', saya: 'rojo', tocado: 'velo' }],
    altisidora: ['dama', { n: 'Altisidora', jubon: 'blanco', saya: 'blanco', tocado: 'corona_flores', pelo: 'oro' }],
    aldonza: ['moza', { n: 'Aldonza Lorenzo', saya: 'ocre', jubon: 'rojo', pelo: 'negro', tocado: null, acc: 'cantaro' }],
    barbara: ['moza', { n: 'Bárbara', saya: 'tierra', jubon: 'pardo', pelo: 'negro', extra: 'mandil grueso' }],
    claudia: ['dama', { n: 'Claudia Jerónima', jubon: 'verde', saya: 'verde', tocado: 'chambergo', acc: 'arcabuz', capa: 'pardo' }],
    duena: ['duquesa', { n: 'Dueña', jubon: 'negro', saya: 'negro', tocado: 'tocas', pelo: 'gris', barba: 'larga' }],
    cardenio: ['estudiante', { n: 'Cardenio', jubon: 'pardo', calzas: 'tierra', capa: null, tocado: null, barba: 'larga', extra: 'harapos', acc: null }],
    sanson: ['estudiante', { n: 'Sansón Carrasco', pelo: 'negro', barba: 'no' }],
    canonigo: ['cura', { n: 'El canónigo', jubon: 'negro', tocado: 'bonete', acc: 'libro', extra: 'roquete' }],
    ermitano: ['clerigo', { n: 'Ermitaño', barba: 'blanca', jubon: 'tierra' }],
    encamisado: ['clerigo', { n: 'Encamisado', jubon: 'blanco', tocado: 'capucha', acc: 'antorcha' }],
    penitente: ['clerigo', { n: 'Disciplinante', jubon: 'blanco', tocado: 'capirote', acc: 'cruz' }],
    galeote: ['bandolero', { n: 'Galeote', jubon: 'tierra', capa: null, tocado: null, acc: 'cadena', barba: 'corta' }],
    roque: ['bandolero', { n: 'Roque Guinart', jubon: 'rojo', capa: 'negro', acc: 'espada', extra: 'pistolas' }],
    vizcaino: ['soldado', { n: 'El vizcaíno', jubon: 'azul', tocado: 'boina', acc: 'espada', extra: 'almohada' }],
    tosilos: ['soldado', { n: 'Tosilos', jubon: 'hierro', calzas: 'hierro', tocado: 'yelmo', acc: 'lanza', extra: 'armadura' }],
    espejos: ['soldado', { n: 'Caballero de los Espejos', jubon: 'hierro', tocado: 'yelmo', acc: 'lanza', extra: 'armadura espejos', pluma: 'verde' }],
    blanca_luna: ['soldado', { n: 'Caballero de la Blanca Luna', jubon: 'blanco', calzas: 'blanco', tocado: 'yelmo', acc: 'lanza', extra: 'armadura luna', pluma: 'blanco' }],
    diego: ['duque', { n: 'Don Diego de Miranda', jubon: 'verde', capa: 'verde', calzas: 'pardo' }],
    moreno: ['duque', { n: 'Don Antonio Moreno', jubon: 'azul', capa: 'negro', pluma: 'azul' }],
    tarfe: ['duque', { n: 'Álvaro Tarfe', jubon: 'rojo', capa: 'oro', pluma: 'rojo' }],
    anselmo: ['duque', { n: 'Caballero', jubon: 'pardo', capa: 'ocre', pluma: 'oro' }],
    archipampano: ['duque', { n: 'El Archipámpano', jubon: 'violeta', capa: 'oro', tocado: 'gorra', extra: 'gola joyas', pluma: null }],
    bracamonte: ['duque', { n: 'Bracamonte', jubon: 'negro', capa: 'rojo', pelo: 'gris' }],
    corregidor: ['duque', { n: 'El corregidor', jubon: 'negro', capa: 'negro', acc: 'vara', pelo: 'gris', barba: 'larga', pluma: null }],
    camacho: ['duque', { n: 'Camacho el rico', jubon: 'oro', capa: 'rojo', pluma: 'oro' }],
    basilio: ['estudiante', { n: 'Basilio', jubon: 'pardo', capa: null, tocado: null, barba: 'no', acc: null }],
    escribano: ['estudiante', { n: 'Escribano', tocado: 'gorra', acc: 'pluma_e' }],
    pregonero: ['soldado', { n: 'Pregonero', jubon: 'azul', tocado: 'gorra', acc: 'papel', extra: '' }],
    alguacil: ['soldado', { n: 'Alguacil', jubon: 'negro', tocado: 'chambergo', acc: 'vara', extra: 'gola' }],
    labrador: ['arriero', { n: 'Labrador', jubon: 'ocre', tocado: 'paja', acc: null }],
    peregrino: ['estudiante', { n: 'Peregrino', jubon: 'pardo', capa: 'pardo', tocado: 'chambergo', acc: 'bordon', extra: 'esclavina' }],
    carretero: ['arriero', { n: 'Carretero', jubon: 'azul', acc: 'vara' }],
    barbero: ['arriero', { n: 'El barbero', jubon: 'blanco', tocado: 'bacia', barba: 'bigote', acc: null }],
    pescador: ['arriero', { n: 'Pescador', jubon: 'azul', calzas: 'blanco', tocado: 'gorra', acc: 'red' }],
    leonero: ['arriero', { n: 'Leonero', jubon: 'rojo', tocado: 'gorra', acc: 'vara' }],
    ricote: ['estudiante', { n: 'Ricote', jubon: 'pardo', capa: 'pardo', tocado: 'chambergo', barba: 'larga', acc: 'bordon', extra: 'esclavina' }],
    comediante: ['estudiante', { n: 'Comediante', jubon: 'rojo', capa: 'oro', tocado: 'corona', acc: null }],
    muerte: ['clerigo', { n: 'La Muerte', jubon: 'negro', tocado: 'calavera', acc: 'guadana' }],
    titiritero: ['arriero', { n: 'Maese Pedro', jubon: 'verde', tocado: 'panuelo', extra: 'parche' }],
    merlin: ['clerigo', { n: 'Merlín', jubon: 'violeta', tocado: 'capucha', barba: 'blanca', acc: 'baston' }],
    bramidan: ['soldado', { n: 'Bramidán', jubon: 'oro', tocado: 'turbante', barba: 'larga', acc: 'espada', extra: 'grueso' }]
  };
  function spec(id) {
    if (P[id]) return P[id];
    const v = VAR[id]; if (!v) return P.estudiante;
    const s = Object.assign({}, spec(v[0]), v[1]); P[id] = s; return s;
  }
  V.spec = spec; V.ACTORES = P; V.VARIANTES = VAR;
  V.esAnimal = id => ['rocinante', 'rucio', 'yegua', 'oveja', 'cerdo', 'leon', 'clavileno'].includes(id);

  /* ---------- figura humana ---------- */
  const T = k => TONO[k] || TONO.pardo;
  const PELO = { negro: 29, pardo: 19, gris: 17, oro: 23, blanco: 30 };

  function figura(s, pose, f) {
    const b = new B(FW, FH), cx = AX, fy = AY;
    const grueso = s.cuerpo === 'grueso' || (s.extra || '').includes('grueso');
    const A = s.alto, ll = Math.round(A * (s.cuerpo === 'grueso' ? 0.36 : 0.44)), tl = Math.round(A * 0.3);
    let hip = fy - ll, sh = hip - tl, top = sh - 8;
    const ext = ' ' + (s.extra || '') + ' ';
    const J = T(s.jubon), K = T(s.calzas || s.jubon), Sy = T(s.saya || s.jubon);
    const lw = grueso ? 4 : s.cuerpo === 'flaco' ? 2 : 3, tw = grueso ? 11 : s.cuerpo === 'flaco' ? 6 : s.cuerpo === 'mujer' ? 7 : 8;
    // fases de las piernas: [delante, detrás, levanta-delante, levanta-detrás]
    let L1 = 2, L2 = -2, u1 = 0, u2 = 0, bob = 0;
    if (pose === 'caminar') { [L1, L2, u1, u2] = [[4, -3, 0, 0], [1, 0, 2, 0], [-3, 4, 0, 0], [0, 1, 0, 2]][f & 3]; bob = (f & 1) ? -1 : 0; }
    if (pose === 'reposo' || pose === 'hablar') bob = f & 1 ? 0 : 0;
    hip += bob; sh += bob; top += bob;
    if (pose === 'reposo' && (f & 1)) { sh += 0; top += 0; } // respiración: se nota en el brazo
    let lean = 0;
    if (pose === 'golpe' && f === 0) lean = -2; // recibe: se echa atrás
    if (pose === 'golpe' && f === 1) lean = 2; // ataca: se echa adelante
    const montado = pose === 'montado', rodilla = pose === 'arrodillado';
    if (rodilla) { hip += 8; sh += 8; top += 8; }

    // brazo trasero
    const hb = mano(pose, f, 'atras', s);
    b.line(cx - 1 + lean, sh + 1, cx + hb[0] + lean, sh + hb[1], J[1], 2); b.p(cx + hb[0] + lean, sh + hb[1] + 1, C.pielS);
    // piernas
    const pie = (dx, up, c, osc) => {
      if (montado) { b.line(cx, hip, cx + 6, hip + 1, c, lw); b.line(cx + 6, hip + 1, cx + 5, hip + 9, c, lw - (lw > 2 ? 1 : 0)); b.r(cx + 5, hip + 9, 3, 2, osc); return; }
      if (rodilla) { if (c === K[1]) { b.line(cx, hip, cx - 5, fy - 1, c, lw); b.r(cx - 8, fy - 1, 4, 1, osc); } else { b.line(cx, hip, cx + 5, hip, c, lw); b.line(cx + 5, hip, cx + 5, fy - 1, c, lw); b.r(cx + 5, fy - 1, 4, 1, osc); } return; }
      b.line(cx, hip, cx + dx, fy - 1 - up, c, lw); b.r(cx + dx - 1, fy - 1 - up, lw + 2, 2, osc);
    };
    const larga = s.cuerpo === 'mujer' || s.cuerpo === 'habito';
    if (!larga) pie(L2, u2, K[1], C.maderaO);
    // capa (detrás)
    if (s.capa) { const Cp = T(s.capa); b.poly([cx - tw / 2 + lean, sh, cx + 1 + lean, sh, cx - 2, hip + (larga ? 10 : 6), cx - tw / 2 - 4, hip + (larga ? 10 : 6) + (pose === 'caminar' ? (f & 1) : 0)], Cp[1]); }
    // cuerpo
    if (larga) {
      const hem = fy - 1, sw = (pose === 'caminar') ? ((f & 1) ? 1 : -1) : 0, base = s.cuerpo === 'habito' ? 6 : 9;
      if (!montado) {
        b.poly([cx - tw / 2 + lean, sh, cx + tw / 2 + lean, sh, cx + base + sw, hem, cx - base - 1 + sw, hem], Sy[0]);
        b.poly([cx - tw / 2 + lean, sh, cx - 1 + lean, sh, cx - 2 + sw, hem, cx - base - 1 + sw, hem], Sy[1]);
        if (s.cuerpo === 'mujer') { b.r(cx - tw / 2 + lean, sh, tw, Math.round(tl * 0.55), J[0]); b.r(cx - tw / 2 + lean, sh, 2, Math.round(tl * 0.55), J[1]); }
        if (ext.includes(' mandil')) b.poly([cx + lean, hip - 4, cx + tw / 2 + 1 + lean, hip - 4, cx + base - 1 + sw, hem - 3, cx + 1 + sw, hem - 3], C.lino);
        b.r(cx + 1 + sw, hem, 3, 1, C.maderaO);
        if (s.cuerpo === 'habito') b.r(cx - tw / 2 + lean, hip - 2, tw, 1, ext.includes('roquete') ? C.lino : C.maderaO);
      } else { b.r(cx - tw / 2, sh, tw, tl, Sy[0]); b.poly([cx - 3, hip, cx + 9, hip, cx + 10, hip + 10, cx + 1, hip + 10], Sy[0]); }
    } else {
      b.r(cx - tw / 2 + lean, sh, tw, tl, J[0]);
      b.r(cx - tw / 2 + lean, sh, Math.ceil(tw / 3), tl, J[1]);
      if (ext.includes('barriga') || grueso) b.ell(cx + tw / 2 - 1 + lean, sh + tl * 0.65, 3, tl * 0.32, J[0]);
      if (ext.includes(' mandil')) b.r(cx + lean, sh + tl - 6, tw / 2 + 2, 9, C.lino);
      if (ext.includes(' zamarra')) { b.r(cx - tw / 2 + lean, sh, tw, 5, C.lino); for (let i = 0; i < tw; i += 2) b.p(cx - tw / 2 + i + lean, sh + 5, C.calS); }
      b.r(cx - tw / 2 + lean, hip - 1, tw, 1, ext.includes('armadura') ? C.hierro : C.maderaO); // cinto
      if (ext.includes('armadura') || ext.includes('peto')) { b.r(cx - tw / 2 + 1 + lean, sh + 1, tw - 2, tl - 3, C.hierro); b.r(cx + lean, sh + 2, 2, tl - 6, C.hierroL); b.r(cx - tw / 2 - 1 + lean, sh, 3, 3, C.hierroL); }
      if (ext.includes('espejos')) for (let i = 0; i < 3; i++) b.p(cx - 1 + i * 2 + lean, sh + 4 + i * 2, C.destello);
      if (ext.includes('luna')) { b.circ(cx + lean, sh + tl / 2, 2, C.cal); b.p(cx + 1 + lean, sh + tl / 2 - 1, C.hierroL); }
      if (ext.includes('harapos')) for (let i = 0; i < tw; i += 2) b.p(cx - tw / 2 + i + lean, hip + (i % 4 ? 1 : 2), J[1]);
      if (ext.includes('ropon')) b.poly([cx - tw / 2 + lean, hip - 1, cx + tw / 2 + lean, hip - 1, cx + tw / 2 + 2, hip + 10, cx - tw / 2 - 2, hip + 10], J[0]);
      if (ext.includes('esclavina')) { b.poly([cx - tw / 2 - 1 + lean, sh, cx + tw / 2 + 1 + lean, sh, cx + tw / 2 + 2 + lean, sh + 6, cx - tw / 2 - 2 + lean, sh + 6], C.tierraS); b.p(cx + 1 + lean, sh + 3, C.oro); }
      pie(L1, u1, K[0], C.maderaO);
    }
    if (ext.includes('gola')) b.r(cx - 3 + lean, sh - 1, 7, 2, C.lino);
    if (ext.includes('joyas')) { b.p(cx + lean, sh + 2, C.oro); b.p(cx + 2 + lean, sh + 3, C.destello); }
    if (ext.includes('espada') && s.acc !== 'espada') b.line(cx - 3, hip, cx - 9, hip + 9, C.hierro);
    if (ext.includes('pistolas')) { b.r(cx - 3 + lean, hip - 3, 3, 2, C.pano); b.r(cx + 2 + lean, hip - 3, 3, 2, C.pano); }
    // cabeza
    const hx = cx - 3 + lean + (rodilla ? 0 : 0), pelo = PELO[s.pelo] || 19, piel = s.tinta ? [30, 17] : [C.piel, C.pielS];
    b.r(hx, top, 7, 8, piel[0]); b.r(hx, top, 2, 8, piel[1]);
    b.p(hx + 7, top + 4, piel[0]); // nariz
    b.p(hx + 5, top + 3, C.pano); // ojo
    if (pose === 'hablar' && (f & 1)) b.p(hx + 6, top + 6, C.rojoO); // boca abierta
    if (pose === 'golpe' && f === 0) { b.p(hx + 5, top + 2, C.pano); b.p(hx + 6, top + 6, C.pano); }
    b.r(hx, top, 3, 4, pelo); b.r(hx, top - 1, 6, 2, pelo);
    if (s.cuerpo === 'mujer' && !['toca', 'tocas', 'velo'].includes(s.tocado)) { b.r(hx - 2, top, 3, 11, pelo); b.r(hx - 1, top - 1, 6, 2, pelo); }
    const br = s.barba;
    if (br === 'corta') { b.r(hx + 3, top + 6, 4, 2, pelo); b.p(hx + 2, top + 5, pelo); }
    else if (br === 'larga') { b.r(hx + 2, top + 6, 5, 3, pelo); b.r(hx + 3, top + 9, 3, 3, pelo); }
    else if (br === 'blanca') { b.r(hx + 2, top + 6, 5, 3, C.lino); b.r(hx + 2, top + 9, 4, 5, C.lino); b.p(hx + 3, top + 14, C.calS); }
    else if (br === 'perilla') { b.hl(hx + 4, hx + 6, top + 5, pelo); b.r(hx + 5, top + 7, 2, 3, pelo); }
    else if (br === 'bigote') b.hl(hx + 4, hx + 7, top + 5, pelo);
    tocado(b, s, hx, top, f);
    // brazo delantero y accesorio
    const hf = mano(pose, f, 'delante', s);
    const hxF = cx + hf[0] + lean, hyF = sh + hf[1];
    if (pose !== 'leer') { b.line(cx + 1 + lean, sh + 1, hxF, hyF, J[0], 2); b.p(hxF, hyF + 1, piel[0]); }
    accesorio(b, s, pose, f, hxF, hyF, cx, fy, sh, lean);
    if (pose === 'leer') { b.r(cx + 3, sh + 6, 6, 4, C.lino); b.p(cx + 6, sh + 6, C.calS); b.line(cx + 1, sh + 1, cx + 3, sh + 8, J[0], 2); b.p(cx + 4, sh + 9, piel[0]); }
    if (s.tinta) b.swap({ 27: 30, 28: 17 });
    return b.outline(C.negro);
  }
  function mano(pose, f, lado, s) {
    if (lado === 'atras') {
      if (pose === 'caminar') return [[-3, 10], [-1, 11], [2, 10], [0, 11]][f & 3];
      if (pose === 'golpe') return f === 0 ? [-5, -3] : [-4, 9];
      return [-2, 11 + (pose === 'reposo' && (f & 1) ? 1 : 0)];
    }
    if (pose === 'hablar') return f & 1 ? [7, 2] : [6, 5];
    if (pose === 'golpe') return f === 0 ? [-3, -5] : [10, 2];
    if (pose === 'caminar') return [[2, 10], [0, 11], [-3, 10], [-1, 11]][f & 3];
    if (pose === 'arrodillado') return [5, 6];
    if (pose === 'montado') return [5, 7];
    if (pose === 'celebrar') return [4, -6];
    return [2, 11 + ((pose === 'reposo') && (f & 1) ? 1 : 0)];
  }
  function tocado(b, s, x, y, f) {
    const t = s.tocado;
    if (!t || t === 'no') return;
    if (t === 'celada') { b.r(x - 1, y - 3, 9, 6, C.hierro); b.r(x + 3, y - 3, 4, 2, C.hierroL); b.r(x + 5, y + 1, 3, 2, C.hierro); b.r(x + 6, y - 1, 2, 1, C.pano); b.line(x + 1, y - 3, x - 2, y - 8, C.rojo); b.p(x - 3, y - 9, C.lino); b.r(x - 1, y + 3, 2, 5, C.hierro); }
    else if (t === 'bacia') { b.r(x - 2, y - 2, 11, 2, C.oro); b.r(x, y - 5, 7, 3, C.oro); b.p(x + 2, y - 4, C.destello); b.p(x + 8, y - 1, C.tierraS); }
    else if (t === 'yelmo') { b.r(x - 1, y - 3, 9, 11, C.hierro); b.r(x + 4, y + 2, 4, 1, C.pano); b.r(x + 3, y - 3, 3, 2, C.hierroL); if (s.pluma) { const pl = T(s.pluma)[0]; b.line(x + 1, y - 4, x - 3, y - 9, pl, 2); } }
    else if (t === 'paja') { b.r(x - 3, y - 1, 14, 2, C.tierraL); b.r(x, y - 4, 8, 3, C.tierraL); b.hl(x, x + 7, y - 2, C.ocre); }
    else if (t === 'chambergo') { b.r(x - 3, y - 1, 13, 2, C.pano); b.r(x, y - 5, 8, 4, C.pano); if (s.pluma) b.line(x + 1, y - 5, x - 4, y - 8, T(s.pluma)[0], 2); }
    else if (t === 'gorra' || t === 'bonete' || t === 'boina') { b.r(x - 1, y - 3, 8, 3, t === 'boina' ? C.anil : C.pano); if (t === 'bonete') b.r(x + 1, y - 5, 4, 2, C.pano); }
    else if (t === 'gorro') { b.r(x - 1, y - 3, 8, 3, C.lino); b.line(x, y - 3, x - 3, y + 3, C.lino); }
    else if (t === 'panuelo') { b.r(x - 1, y - 2, 8, 3, s.cuerpo === 'mujer' ? C.rojo : C.lino); b.p(x - 2, y + 1, s.cuerpo === 'mujer' ? C.rojo : C.lino); }
    else if (t === 'toca' || t === 'tocas') { b.r(x - 2, y - 2, 9, 3, C.lino); b.r(x - 2, y, 3, t === 'tocas' ? 14 : 10, C.lino); b.r(x + 6, y + 6, 1, 3, C.lino); }
    else if (t === 'velo') { b.r(x - 2, y - 2, 9, 3, C.lino); b.r(x - 3, y, 4, 13, C.calS); }
    else if (t === 'tocado') { b.r(x - 1, y - 3, 8, 3, C.oro); b.p(x + 3, y - 4, C.destello); b.r(x - 2, y, 3, 8, PELO[s.pelo] || 19); }
    else if (t === 'corona_flores') { for (let i = 0; i < 4; i++) b.p(x + i * 2, y - 2, [C.rojo, C.lino, C.oro, C.rojo][i]); }
    else if (t === 'teja') { b.r(x - 4, y - 2, 15, 2, C.pano); b.r(x, y - 4, 7, 2, C.pano); }
    else if (t === 'capucha') { b.r(x - 2, y - 2, 9, 4, T(s.jubon)[1]); b.r(x - 2, y, 3, 8, T(s.jubon)[1]); }
    else if (t === 'capirote') { b.poly([x - 1, y + 2, x + 8, y + 2, x + 3, y - 12], C.lino); b.r(x - 1, y, 9, 9, C.lino); b.p(x + 5, y + 3, C.pano); }
    else if (t === 'calavera') { b.r(x - 1, y - 2, 9, 11, C.pano); b.r(x + 2, y, 5, 7, C.cal); b.p(x + 4, y + 2, C.negro); b.p(x + 6, y + 2, C.negro); b.hl(x + 3, x + 6, y + 5, C.calS); }
    else if (t === 'morrion') { b.r(x - 2, y - 2, 11, 2, C.hierro); b.ell(x + 3, y - 4, 4, 3, C.hierro); b.p(x + 3, y - 8, C.hierroL); }
    else if (t === 'corona') { b.r(x, y - 3, 7, 3, C.oro); b.p(x, y - 4, C.oro); b.p(x + 3, y - 4, C.oro); b.p(x + 6, y - 4, C.oro); }
    else if (t === 'turbante') { b.ell(x + 3, y - 2, 6, 3, C.lino); b.p(x + 3, y - 4, C.rojo); }
  }
  function accesorio(b, s, pose, f, hx, hy, cx, fy, sh, lean) {
    const a = s.acc; if (!a) return;
    if (a === 'lanza') {
      if (pose === 'golpe' && f === 1) { b.line(hx - 14, hy + 3, hx + 20, hy - 1, C.madera); b.r(hx + 20, hy - 2, 3, 2, C.hierroL); }
      else { b.line(hx, hy + 6, hx + 2, hy - 44, C.madera); b.r(hx + 1, hy - 48, 2, 4, C.hierroL); if (s.extra && s.extra.includes('armadura') && s.n === 'Don Quijote') b.r(hx + 3, hy - 40, 3, 2, C.rojo); }
    } else if (a === 'pica') b.line(hx, hy + 8, hx + 1, hy - 40, C.maderaO), b.r(hx, hy - 44, 3, 4, C.hierroL);
    else if (a === 'vara' || a === 'baston' || a === 'bordon') { b.line(hx, hy - (a === 'bordon' ? 12 : 6), hx, fy - 1, a === 'vara' ? C.maderaO : C.madera); if (a === 'bordon') b.p(hx + 1, hy - 10, C.oro); }
    else if (a === 'cayado') { b.line(hx, hy - 8, hx, fy - 1, C.madera); b.p(hx + 1, hy - 9, C.madera); b.p(hx + 2, hy - 8, C.madera); }
    else if (a === 'espada') { if (pose === 'golpe' && f === 1) b.line(hx, hy, hx + 12, hy - 6, C.hierroL); else b.line(hx, hy, hx + 2, hy - 12, C.hierroL); b.hl(hx - 1, hx + 1, hy, C.oro); }
    else if (a === 'arcabuz') b.line(hx - 6, hy + 2, hx + 10, hy - 4, C.maderaO), b.line(hx + 4, hy - 2, hx + 12, hy - 5, C.hierro);
    else if (a === 'libro') b.r(hx, hy - 1, 3, 4, C.rojoO);
    else if (a === 'cruz') { b.line(hx, hy + 4, hx, hy - 16, C.maderaO); b.hl(hx - 3, hx + 3, hy - 12, C.maderaO); }
    else if (a === 'antorcha') { b.line(hx, hy + 2, hx + 1, hy - 8, C.maderaO); b.r(hx, hy - 11, 3, 3, C.brasa); b.p(hx + 1, hy - 12, C.oro); }
    else if (a === 'cadena') { for (let i = 0; i < 6; i++) b.p(hx - 2 + i * 2, hy + 2 + (i & 1), C.hierro); }
    else if (a === 'guadana') { b.line(hx, fy - 1, hx + 2, hy - 18, C.maderaO); b.poly([hx + 2, hy - 18, hx + 12, hy - 14, hx + 3, hy - 16], C.hierroL); }
    else if (a === 'cantaro') { b.ell(hx + 1, hy - 4, 3, 4, C.tierraS); b.r(hx, hy - 9, 3, 2, C.tierraS); }
    else if (a === 'papel') b.r(hx, hy - 6, 5, 7, C.lino);
    else if (a === 'pluma_e') b.line(hx, hy, hx + 3, hy - 5, C.lino);
    else if (a === 'red') { for (let i = 0; i < 4; i++) b.line(hx, hy, hx + 2 + i, fy - 4, C.calS); }
  }

  /* ---------- cuadrúpedos ---------- */
  function caballo(tipo, pose, f) {
    const b = new B(64, 50), gy = 49;
    const asno = tipo === 'rucio', yegua = tipo === 'yegua', madera = tipo === 'clavileno';
    const c = madera ? [C.madera, C.maderaO] : asno ? [C.hierro, C.violeta] : yegua ? [C.madera, C.maderaO] : [C.ocre, C.tierraS];
    const s = asno ? 0.8 : 1, bx = 30, by = gy - Math.round(22 * s);
    let fase = pose === 'caminar' ? [[4, -3, -3, 4], [1, 0, 0, 1], [-3, 4, 4, -3], [0, 1, 1, 0]][f & 3] : [0, 0, 0, 0];
    const up = pose === 'caminar' ? [[0, 0], [2, 0], [0, 0], [0, 2]][f & 3] : [0, 0];
    const pata = (x, d, u, col) => { b.line(x, by + 3, x + d, gy - 1 - u, col, madera ? 2 : 2); b.r(x + d - 1, gy - 1 - u, 3, 1, madera ? C.maderaO : C.pano); };
    pata(bx - 11 * s, fase[1], up[1], c[1]); pata(bx + 10 * s, fase[3], up[0], c[1]);
    b.ell(bx, by, Math.round(15 * s), Math.round(6 * s), c[0]);
    b.hl(bx - 13 * s, bx + 13 * s, by + 5 * s, c[1]);
    if (!asno && !yegua && !madera) for (let i = 0; i < 4; i++) b.r(bx - 4 + i * 3, by, 1, 4, c[1]); // costillas de Rocinante
    pata(bx - 9 * s, fase[0], up[1], c[0]); pata(bx + 12 * s, fase[2], up[0], c[0]);
    // cuello y cabeza
    const bajo = tipo === 'rocinante' ? 4 : 0, rp = (pose === 'reposo' && (f & 1)) ? 1 : 0;
    const nx = bx + 13 * s, ny = by - 3 * s;
    b.poly([nx - 3, ny + 4, nx + 3, ny + 2, nx + 10 * s, ny - 8 * s + bajo + rp, nx + 5 * s, ny - 10 * s + bajo + rp], c[0]);
    const hx = nx + 7 * s, hy = ny - 11 * s + bajo + rp;
    b.poly([hx, hy, hx + 5, hy - 1, hx + 11 * s, hy + 6 * s, hx + 9 * s, hy + 8 * s, hx + 2, hy + 5], c[0]);
    b.p(hx + 4, hy + 1, C.pano);
    if (asno) { b.line(hx + 1, hy, hx - 2, hy - 7, c[0], 2); b.line(hx + 3, hy, hx + 2, hy - 7, c[1], 2); }
    else { b.p(hx + 1, hy - 2, c[0]); b.p(hx + 2, hy - 3, c[0]); }
    if (!madera) for (let i = 0; i < 6; i++) b.p(nx + i * s, ny - 2 - i * 1.6 * s + bajo * (i / 6), asno ? C.pano : C.maderaO); // crin
    // cola
    if (madera) { b.r(bx - 18, by - 2, 4, 2, C.maderaO); b.r(nx + 2, ny - 4, 2, 2, C.oro); }
    else { const cs = pose === 'caminar' ? (f & 1) : 0; b.line(bx - 14 * s, by - 2, bx - 18 * s - cs, by + 10 * s, asno ? C.violeta : C.maderaO, 2); if (asno) b.r(bx - 19 * s, by + 9 * s, 3, 3, C.pano); }
    // arreos
    if (tipo === 'rocinante') { b.r(bx - 4, by - 7, 9, 4, C.rojo); b.r(bx - 4, by - 3, 9, 3, C.rojoO); b.line(bx + 1, by - 3, bx + 2, by + 8, C.maderaO); }
    if (asno) { b.r(bx - 9, by - 5, 6, 9, C.rojo); b.r(bx + 2, by - 5, 6, 9, C.ocre); b.hl(bx - 9, bx + 7, by - 6, C.maderaO); }
    if (madera) { b.r(bx - 4, by - 7, 9, 3, C.rojo); b.p(hx + 5, hy - 2, C.hierro); b.r(hx + 4, hy - 3, 2, 2, C.hierro); }
    return b.outline(C.negro);
  }
  const SILLA = { rocinante: [30, 21], rucio: [30, 25], clavileno: [30, 21] }; // punto de la cadera del jinete
  function menor(tipo, pose, f) {
    const b = new B(40, 26), gy = 25, w = (pose === 'caminar') ? (f & 1) : 0;
    if (tipo === 'oveja') { for (const x of [12, 16, 22, 26]) b.r(x + (x < 20 ? w : -w), gy - 5, 1, 5, C.pano); b.ell(19, gy - 8, 8, 4, C.lino); b.ell(18, gy - 10, 6, 2, C.cal); b.r(26, gy - 11, 4, 5, C.pano); b.p(29, gy - 9, C.lino); }
    else if (tipo === 'cerdo') { for (const x of [12, 15, 22, 25]) b.r(x + (x < 20 ? w : -w), gy - 4, 2, 4, C.pielS); b.ell(19, gy - 8, 9, 5, C.piel); b.hl(12, 26, gy - 4, C.pielS); b.r(27, gy - 9, 3, 3, C.piel); b.p(30, gy - 8, C.pielS); b.p(26, gy - 10, C.pano); b.p(10, gy - 10, C.pielS); b.p(9, gy - 11, C.pielS); }
    else if (tipo === 'leon') { for (const x of [8, 12, 24, 28]) b.r(x + (x < 20 ? w : -w), gy - 7, 2, 7, C.ocre); b.ell(18, gy - 11, 12, 5, C.ocre); b.hl(8, 28, gy - 7, C.tierraS); b.ell(30, gy - 14, 6, 7, C.tierraS); b.ell(32, gy - 13, 3, 4, C.ocre); b.p(33, gy - 15, C.pano); b.line(6, gy - 13, 2, gy - 6, C.ocre); b.p(2, gy - 5, C.tierraS); if (pose === 'hablar' && (f & 1)) b.p(35, gy - 11, C.rojoO); }
    return b.outline(C.negro);
  }

  /* ---------- API: lienzo cacheado de un actor en una pose, fotograma y hora ---------- */
  V.actorCanvas = function (id, pose, f, hora, flip, extra) {
    const k = 'a|' + id + '|' + pose + '|' + f + '|' + hora + '|' + (flip ? 1 : 0) + '|' + (extra || '');
    return V.cache(k, () => {
      let b;
      if (id === 'rocinante' || id === 'rucio' || id === 'yegua' || id === 'clavileno') b = caballo(id, pose, f);
      else if (id === 'oveja' || id === 'cerdo' || id === 'leon') b = menor(id, pose, f);
      else {
        let s = spec(id);
        if (extra === 'bacia' && id === 'dq') s = Object.assign({}, s, { tocado: 'bacia' });
        b = figura(s, pose, f);
      }
      if (flip) { const o = new B(b.w, b.h); o.blit(b, 0, 0, true); b = o; }
      const cv = b.canvas(hora); cv._ax = flip ? b.w - (b.w === FW ? AX : b.w / 2) : (b.w === FW ? AX : b.w / 2); cv._ay = b.h - 1; return cv;
    });
  };
  V.SILLA = SILLA; V.FIG = { FW, FH, AX, AY };
  V.altura = id => V.esAnimal(id) ? (id === 'oveja' || id === 'cerdo' ? 12 : id === 'leon' ? 20 : 34) : spec(id).alto;
})(VIS);
