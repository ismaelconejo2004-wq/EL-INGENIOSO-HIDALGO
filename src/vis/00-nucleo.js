/* ===== VIS · núcleo: paletas, búfer indexado, utilidades ===== */
/* Todo el arte se pinta con índices de paleta (0-31) sobre búferes Uint8.
   Cada momento del día es una tabla de 32 colores; cambiar la hora es
   cambiar la tabla. 255 = transparente. */
var VIS = window.VIS = window.VIS || {};
(function (V) {
  'use strict';
  const HORAS = ['mediodia', 'amanecer', 'ocaso', 'noche'];
  // Ver docs/ARTE.md §3.3
  const PAL = {
    mediodia: '1b1424 3a2740 4f7fb5 7fa8cf c9dbe0 fff4cf f3efe2 8f97b0 a89a72 e8c97f c99a52 8a5e34 553620 b8b070 6b7a3e 3a4a2a f4ecd8 c8b9a6 7a4e2c 4a2c1a b3361f 6e1c16 e8783a d8a640 34508a 7c808c d0d4dc e8b48c a8704c 2a2228 f2e6c8 fffbe8',
    amanecer: '1d1630 3b2a4e 6a6fa8 c48fa0 f2c48c fff0b8 f6d6c0 9a88a8 a8836c f0c890 c98a5e 87573e 533228 b89c78 6a6a4a 3a3a36 f6dcc4 c4a2a0 7a4a34 482a22 b8402e 6e2022 f0844a e0aa58 44508a 8a7e8e f0d6c8 f0b896 a86a52 2c2430 f6dcc4 fff4d8',
    ocaso: '22122a 4a2238 3b3a78 b8506a f2914a ffd27a e98a6c 7a4f74 8c5a50 f0a860 c0703e 7c3e2c 4a2420 b07a50 5f4a36 362a2a f2b890 b07a78 6e3a24 3c1c16 c83a1e 701810 ff8a2e f0b040 3a3a70 7a5e6a ffc8a0 f0a07a 9c5040 2a1c24 f2c8a0 fff0c0',
    noche: '0a0a18 141a33 0e1636 1c2a52 34466e e8e4c8 3a4466 1f2742 26304a 4a5470 36405a 262c44 181c30 2e3a48 1e2a34 121a24 5a6488 3a4466 2a2434 16141e 5a2238 2e1424 ff9a40 c08a3a 1a2448 343c58 8a9ac0 7a7088 44405a 0e0e18 8890a8 fff6d8'
  };
  const HEX = {}, U32 = {};
  for (const h of HORAS) {
    HEX[h] = PAL[h].split(' ').map(x => '#' + x);
    U32[h] = new Uint32Array(HEX[h].map(x => {
      const n = parseInt(x.slice(1), 16);
      return (0xff000000 | ((n & 255) << 16) | (n & 0xff00) | (n >> 16)) >>> 0;
    }));
  }
  // paletas derivadas: «lumbre» (noche a la luz del fuego) y «luna» (figuras legibles de noche)
  function mezcla(nom, a, b, k, ajuste) {
    HEX[nom] = HEX[a].map((x, i) => {
      const A = parseInt(x.slice(1), 16), Bc = parseInt(HEX[b][i].slice(1), 16);
      const ch = sh => Math.round(((A >> sh) & 255) * (1 - k) + ((Bc >> sh) & 255) * k * (ajuste || 1));
      return '#' + [16, 8, 0].map(sh => Math.min(255, ch(sh)).toString(16).padStart(2, '0')).join('');
    });
    U32[nom] = new Uint32Array(HEX[nom].map(x => { const n = parseInt(x.slice(1), 16); return (0xff000000 | ((n & 255) << 16) | (n & 0xff00) | (n >> 16)) >>> 0; }));
  }
  mezcla('lumbre', 'noche', 'ocaso', 0.55, 0.92);
  mezcla('luna', 'noche', 'mediodia', 0.32);
  // Índices con nombre (para leer mejor el código de dibujo)
  const C = {
    negro: 0, violeta: 1, cieloA: 2, cieloM: 3, cieloH: 4, astro: 5, nube: 6, sierra: 7, colina: 8,
    tierraL: 9, ocre: 10, tierraS: 11, tierraP: 12, hierba: 13, olivo: 14, encina: 15, cal: 16, calS: 17,
    madera: 18, maderaO: 19, rojo: 20, rojoO: 21, brasa: 22, oro: 23, anil: 24, hierro: 25, hierroL: 26,
    piel: 27, pielS: 28, pano: 29, lino: 30, destello: 31, T: 255
  };
  // Pares (luz, sombra) para paños de personajes: solo índices que no son cielo
  const TONO = {
    rojo: [20, 21], azul: [24, 1], ocre: [10, 11], pardo: [18, 19], negro: [29, 0], blanco: [30, 17],
    verde: [14, 15], oro: [23, 11], hierro: [26, 25], gris: [25, 1], paja: [9, 10], tierra: [11, 12],
    cal: [16, 17], piel: [27, 28], violeta: [1, 0], encina: [15, 0], brasa: [22, 20]
  };

  /* --- búfer indexado --- */
  function B(w, h) { this.w = w; this.h = h; this.d = new Uint8Array(w * h).fill(255); }
  B.prototype = {
    p(x, y, c) { x = Math.round(x); y = Math.round(y); if (c !== 255 && x >= 0 && y >= 0 && x < this.w && y < this.h) this.d[y * this.w + x] = c; },
    g(x, y) { return (x >= 0 && y >= 0 && x < this.w && y < this.h) ? this.d[y * this.w + x] : 255; },
    r(x, y, w, h, c) {
      x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h);
      const x0 = Math.max(0, x), y0 = Math.max(0, y), x1 = Math.min(this.w, x + w), y1 = Math.min(this.h, y + h);
      for (let j = y0; j < y1; j++) this.d.fill(c, j * this.w + x0, j * this.w + Math.max(x0, x1));
    },
    hl(x0, x1, y, c) { if (x1 < x0) [x0, x1] = [x1, x0]; this.r(x0, y, x1 - x0 + 1, 1, c); },
    line(x0, y0, x1, y1, c, t) {
      x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
      const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
      let e = dx + dy;
      for (;;) {
        if (t > 1) this.r(x0 - (t >> 1), y0, t, 1, c); else this.p(x0, y0, c);
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; }
      }
    },
    // polígono relleno (par-impar), pts = [x0,y0,x1,y1,...]
    poly(pts, c) {
      let ymin = 1e9, ymax = -1e9; const n = pts.length / 2;
      for (let i = 1; i < pts.length; i += 2) { ymin = Math.min(ymin, pts[i]); ymax = Math.max(ymax, pts[i]); }
      ymin = Math.max(0, Math.floor(ymin)); ymax = Math.min(this.h - 1, Math.ceil(ymax));
      const xs = [];
      for (let y = ymin; y <= ymax; y++) {
        xs.length = 0; const yc = y + 0.5;
        for (let i = 0, j = n - 1; i < n; j = i++) {
          const yi = pts[i * 2 + 1], yj = pts[j * 2 + 1];
          if ((yi > yc) !== (yj > yc)) xs.push(pts[i * 2] + (yc - yi) / (yj - yi) * (pts[j * 2] - pts[i * 2]));
        }
        xs.sort((a, b) => a - b);
        for (let k = 0; k + 1 < xs.length; k += 2) { const a = Math.round(xs[k]), b = Math.round(xs[k + 1]) - 1; if (b >= a) this.hl(a, b, y, c); }
      }
    },
    ell(cx, cy, rx, ry, c) {
      for (let y = -ry; y <= ry; y++) { const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry + 0.0001)))); this.hl(cx - w, cx + w, cy + y, c); }
    },
    circ(cx, cy, r, c) { this.ell(cx, cy, r, r, c); },
    // trama ordenada: mezcla c1→c2 según f(x,y) en [0,1]
    dith(x, y, w, h, c1, c2, f) {
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
        const X = x + i, Y = y + j; if (X < 0 || Y < 0 || X >= this.w || Y >= this.h) continue;
        const v = f(X, Y), c = v > BAYER[(Y & 3) * 4 + (X & 3)] ? c2 : c1; if (c !== 255) this.d[Y * this.w + X] = c;
      }
    },
    // degradado en bandas: transiciones tramadas estrechas (aspecto pictórico)
    bandas(x, y, w, h, cols, f, ancho) {
      const n = cols.length - 1, k = ancho || 3;
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
        const X = x + i, Y = y + j; if (X < 0 || Y < 0 || X >= this.w || Y >= this.h) continue;
        let v = Math.max(0, Math.min(0.9999, f(X, Y))) * n; const a = Math.floor(v); let fr = v - a;
        fr = Math.max(0, Math.min(1, (fr - 0.5) * k + 0.5));
        const c = fr > BAYER[(Y & 3) * 4 + (X & 3)] ? cols[Math.min(n, a + 1)] : cols[a];
        if (c !== 255) this.d[Y * this.w + X] = c;
      }
    },
    // copia otro búfer (255 transparente); fl = espejo horizontal
    blit(s, dx, dy, fl) {
      dx = Math.round(dx); dy = Math.round(dy);
      for (let j = 0; j < s.h; j++) { const Y = dy + j; if (Y < 0 || Y >= this.h) continue;
        for (let i = 0; i < s.w; i++) { const c = s.d[j * s.w + (fl ? s.w - 1 - i : i)]; if (c === 255) continue; const X = dx + i; if (X >= 0 && X < this.w) this.d[Y * this.w + X] = c; } }
    },
    // contorno de color alrededor de lo opaco
    outline(c) {
      const o = new Uint8Array(this.d);
      for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
        if (o[y * this.w + x] !== 255) continue;
        if ((x > 0 && o[y * this.w + x - 1] !== 255) || (x < this.w - 1 && o[y * this.w + x + 1] !== 255) ||
            (y > 0 && o[(y - 1) * this.w + x] !== 255) || (y < this.h - 1 && o[(y + 1) * this.w + x] !== 255)) this.d[y * this.w + x] = c;
      }
      return this;
    },
    // cambia un índice por otro (para variantes de paño)
    swap(m) { for (let i = 0; i < this.d.length; i++) { const v = m[this.d[i]]; if (v !== undefined) this.d[i] = v; } return this; },
    canvas(hora) {
      const cv = document.createElement('canvas'); cv.width = this.w; cv.height = this.h;
      const cx = cv.getContext('2d'); if (!cx) return cv;
      const im = cx.createImageData(this.w, this.h), u = new Uint32Array(im.data.buffer), p = U32[hora] || U32.mediodia;
      for (let i = 0; i < this.d.length; i++) { const c = this.d[i]; u[i] = c === 255 ? 0 : p[c]; }
      cx.putImageData(im, 0, 0); return cv;
    }
  };
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);

  // generador con semilla (determinista: el mismo fondo siempre igual)
  function rng(s) { s = (s >>> 0) || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  // ruido 1D suave y periódico (periodo P) para perfiles de colinas
  function perfil(seed, P, oct) {
    const r = rng(seed), fases = [];
    for (let i = 0; i < oct; i++) fases.push([r() * 6.283, 1 + i * 2 + Math.floor(r() * 2), 1 / (i + 1.4)]);
    return x => { let v = 0, n = 0; for (const [f, k, a] of fases) { v += Math.sin(x / P * 6.283 * k + f) * a; n += a; } return v / n; };
  }

  /* --- caché de lienzos: clave -> canvas --- */
  const CACHE = new Map();
  function cache(k, mk) {
    let v = CACHE.get(k); if (v) { CACHE.delete(k); CACHE.set(k, v); return v; }
    v = mk(); CACHE.set(k, v);
    if (CACHE.size > 400) CACHE.delete(CACHE.keys().next().value);
    return v;
  }

  /* --- fuente de mapa de bits 5x7 (propia) --- */
  const FNT = {}, GL = {
    A: '0e11111f111111', B: '1e11111e11111e', C: '0e11101010110e', D: '1e11111111111e', E: '1f10101e10101f', F: '1f10101e101010',
    G: '0e1110171111 0f', H: '1111111f111111', I: '0e04040404040e', L: '1010101010101f', M: '111b1515111111', N: '11191513111111',
    O: '0e11111111110e', P: '1e11111e101010', R: '1e11111e141211', S: '0f10100e01011e', T: '1f040404040404', U: '1111111111110e',
    V: '11111111110a04', X: '11110a040a1111', Y: '11110a04040404', Z: '1f01020408101f', 'É': '021f101e10101f', 'Ó': '020e11111111 0e',
    '0': '0e11131519110e', '1': '040c040404040e', '2': '0e11010204081f', '3': '1f02040201110e', '4': '02060a121f0202', '5': '1f101e0101110e',
    '6': '0608101e11110e', '7': '1f010204080808', '8': '0e11110e11110e', '9': '0e11110f01020c', '+': '0004041f040400', '-': '0000001f000000',
    '−': '0000001f000000', '·': '0000000c0c0000', ' ': '00000000000000', '!': '04040404040004', '?': '0e110102040004', '/': '01010204081010', '=': '00001f001f0000'
  };
  for (const k in GL) { const s = GL[k].replace(/ /g, ''); FNT[k] = []; for (let i = 0; i < 7; i++) FNT[k].push(parseInt(s.substr(i * 2, 2), 16)); }
  // escribe texto en un búfer; devuelve ancho
  function texto(b, s, x, y, c, sombra) {
    s = String(s).toUpperCase(); let cx = x;
    for (const ch of s) {
      const g = FNT[ch] || FNT['?'];
      for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (g[j] & (16 >> i)) { if (sombra !== undefined) b.p(cx + i + 1, y + j + 1, sombra); b.p(cx + i, y + j, c); }
      cx += 6;
    }
    return cx - x;
  }
  function anchoTexto(s) { return String(s).length * 6 - 1; }

  V.HORAS = HORAS; V.HEX = HEX; V.C = C; V.TONO = TONO; V.B = B; V.rng = rng; V.perfil = perfil; V.cache = cache;
  V.texto = texto; V.anchoTexto = anchoTexto; V.CACHE = CACHE;
  // la consulta se crea una vez: leer .matches es barato (antes se creaba en cada fotograma)
  const MQ = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  V.menosMov = () => MQ.matches || (typeof CFG !== 'undefined' && !CFG.anim);
})(VIS);
