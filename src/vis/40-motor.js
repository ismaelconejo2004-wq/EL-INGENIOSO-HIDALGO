/* ===== VIS · motor: un lienzo, un bucle, capas, actores, luz y transiciones ===== */
(function (V) {
  'use strict';
  const { B, C, HEX, rng, cache } = V;
  const H = 180, GY = V.GY;
  let cv = null, ctx = null, W = 320, OX = 40; // ancho interno elástico 320-400 y desplazamiento de fondos
  let S = null; // escena actual
  let raf = 0, visible = true, enVista = true, t0 = 0, ultimo = 0;
  const fpsBuf = [];
  const snap = { cv: null }; // fotograma anterior para transiciones
  const NOSAN_EXTRA = ['ev_adios', 'ev_c_sancho_no'];

  V.soportado = function () {
    if (V._sop !== undefined) return V._sop;
    if (/jsdom/i.test(navigator.userAgent || '')) return (V._sop = false);
    try { const c = document.createElement('canvas'); V._sop = !!(c.getContext && c.getContext('2d')); } catch (e) { V._sop = false; }
    return V._sop;
  };

  /* ---------- lienzo y escalado entero ---------- */
  function crear() {
    cv = document.createElement('canvas'); cv.className = 'vis-cv'; cv.setAttribute('aria-hidden', 'true');
    ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false;
    cv.addEventListener('click', () => V.dialogo && V.dialogo.saltar());
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { enVista = es[0].isIntersecting; pedir(); }).observe(cv);
    document.addEventListener('visibilitychange', () => { visible = !document.hidden; pedir(); });
    addEventListener('resize', () => { medir(); dibujar(performance.now()); });
  }
  function medir() {
    const p = cv.parentNode; if (!p) return;
    const cssW = p.clientWidth || 640, dpr = window.devicePixelRatio || 1;
    const s = Math.max(1, Math.floor(cssW * dpr / 320));
    const w = Math.max(320, Math.min(400, Math.round(cssW * dpr / s)));
    if (w !== W || cv.width !== w) { W = w; cv.width = W; cv.height = H; ctx.imageSmoothingEnabled = false; }
    OX = Math.round((V.W0 - W) / 2);
    cv.style.aspectRatio = W + ' / ' + H;
    if (S) colocar(S, true);
  }
  V.ancho = () => W;

  /* ---------- hora efectiva y tensión ---------- */
  function horaDe(e) { return e.h; }
  function tension() {
    if (typeof state === 'undefined' || !state) return { cor: 0, sal: 0, ham: 0 };
    const k = (v, lim) => Math.max(0, Math.min(1, (lim - v) / lim));
    return { cor: k(state.sanity, 25), sal: k(state.health, 25), ham: k(100 - state.hunger, 20) };
  }
  V.tension = tension;

  /* ---------- capas de fondo cacheadas ---------- */
  function capas(e) {
    const key = e.f + '|' + e.variante + '|' + e.props.join(',') + '|' + e.h;
    return cache('L|' + key, () => {
      const L = V.pintarFondo(e.f, { hora: e.h, seed: hash(e.f + e.variante) , variante: e.variante, props: e.props });
      const out = { luces: L.luces, anim: L.anim, interior: L.interior, papel: L.papel };
      for (const k of ['cielo', 'lejos', 'medio', 'suelo', 'frente']) out[k] = L[k].canvas(e.h);
      return out;
    });
  }
  function hash(s) { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }

  /* ---------- reparto y marcas ---------- */
  function montarReparto(e, id) {
    const A = [], sinSancho = (typeof state !== 'undefined' && state.alone) || (typeof NOSAN !== 'undefined' && NOSAN.includes(id)) || NOSAN_EXTRA.includes(id);
    const L = capas(e), dentro = L.interior || e.f === 'patio' || e.f === 'liza' && e.an === 'fly';
    const bacia = typeof state !== 'undefined' && state.inventory && state.inventory.yelmo > 0;
    const an = e.an;
    if (e.l === 'alonso') {
      if (an === 'sleep') A.push({ id: 'alonso', rol: 'izq', m: 0.62, pose: 'tendido', fija: 1, y: GY - 34 });
      else A.push({ id: 'alonso', rol: 'izq', m: 0.40, pose: an === 'read' ? 'leer' : 'reposo' });
    } else {
      const montado = !dentro && !['bow', 'sleep', 'faint'].includes(an) && !['booktrap', 'barco', 'jaula'].includes(id);
      if (id === 'jaula') { A.push({ id: 'dq', rol: 'dq', m: 0.47, pose: 'reposo', enjaulado: 1, extra: bacia ? 'bacia' : '' }); A.push({ id: 'rocinante', rol: 'montura', m: 0.24, pose: 'reposo' }); }
      else if (an === 'fly') A.push({ id: 'dq', rol: 'dq', m: 0.40, pose: 'montado', vuelo: 1, extra: bacia ? 'bacia' : '', sobre: e.f === 'rio' ? 'barca' : 'clavileno' });
      else if (an === 'sleep' || an === 'faint') { A.push({ id: 'dq', rol: 'dq', m: 0.38, pose: 'tendido', extra: bacia ? 'bacia' : '' }); if (!dentro) A.push({ id: 'rocinante', rol: 'montura', m: 0.20, pose: 'reposo' }); }
      else if (montado) A.push({ id: 'dq', rol: 'dq', m: 0.37, pose: 'montado', mont: 'rocinante', extra: bacia ? 'bacia' : '' });
      else { A.push({ id: 'dq', rol: 'dq', m: 0.36, pose: an === 'bow' ? 'arrodillado' : 'reposo', extra: bacia ? 'bacia' : '' }); if (!dentro && an === 'bow') A.push({ id: 'rocinante', rol: 'montura', m: 0.18, pose: 'reposo' }); }
      if (!sinSancho) {
        if (an === 'fly') A.push({ id: 'sancho', rol: 'sancho', m: 0.40, pose: 'montado', vuelo: 1, detras: 1, sobre: e.f === 'rio' ? 'barca' : 'clavileno' });
        else if (an === 'toss' && id === 'manteo') A.push({ id: 'sancho', rol: 'sancho', m: 0.70, pose: 'golpe', manteo: 1 });
        else if (an === 'sleep' && e.l !== 'alonso') A.push({ id: 'sancho', rol: 'sancho', m: 0.16, pose: 'tendido' });
        else if (an === 'walk' && !dentro) A.push({ id: 'sancho', rol: 'sancho', m: 0.15, pose: 'montado', mont: 'rucio' });
        else { A.push({ id: 'sancho', rol: 'sancho', m: dentro ? 0.20 : 0.19, pose: an === 'eat' ? 'hablar' : 'reposo', come: an === 'eat' }); if (!dentro) A.push({ id: 'rucio', rol: 'montura', m: 0.07, pose: 'reposo', fondo: 1, y: GY - 3 }); }
      }
    }
    // derecha
    let der = [];
    for (const r of e.r) { const m = r.match(/^(\w+)\*(\d)$/); const n = m ? m[1] : r, c = m ? +m[2] : 1; for (let i = 0; i < c; i++) der.push(n); }
    if (id === 'manteo') der = ['maritornes', 'arriero'];
    const ini = 0.62, fin = 0.94, paso = der.length > 1 ? Math.min(0.1, (fin - ini) / (der.length - 1)) : 0;
    der.forEach((n, i) => {
      if (n === 'rocinante_suelto') { A.push({ id: 'rocinante', rol: 'npc', m: 0.74, pose: 'reposo', flip: 1 }); return; }
      const o = { id: n, rol: 'npc', m: (der.length === 1 ? 0.72 : ini + paso * i) + (V.esAnimal(n) ? 0 : 0), pose: 'reposo', flip: 1, k: i };
      if (id === 'manteo') o.m = i ? 0.84 : 0.56;
      if (n === 'oveja' || n === 'cerdo') o.y = GY + (i % 2) * 4 - 2;
      A.push(o);
    });
    return A;
  }
  function colocar(S, sinEntrada) {
    for (const a of S.actores) {
      a.tx = Math.round(a.m * W); a.y = a.y || GY;
      if (sinEntrada || a.fija || a.tendido || V.menosMov() || S.quieto) { a.x = a.tx; a.entrando = 0; }
    }
  }

  /* ---------- cambio de escena ---------- */
  V.cambiar = function (id, o) {
    o = o || {};
    if (!cv) crear();
    const e = V.escena(id);
    const nuevo = !S || S.id !== id || o.forzar;
    if (!nuevo) { S.e = e; refrescarReparto(); pedir(); return; }
    // fotograma anterior para la transición
    if (S && !V.menosMov() && cv.width) { snap.cv = snap.cv || document.createElement('canvas'); snap.cv.width = cv.width; snap.cv.height = cv.height; snap.cv.getContext('2d').drawImage(cv, 0, 0); }
    S = { id, e, t: performance.now(), actores: [], part: [], trans: (S && !V.menosMov()) ? (o.pagina ? 'pagina' : 'iris') : null, quieto: false, habla: null };
    S.actores = montarReparto(e, id);
    S.actores.forEach(a => { a.entrando = 1; a.x = a.rol === 'npc' ? W + 30 + (a.k || 0) * 14 : -40 - (a.rol === 'sancho' ? 30 : 0); });
    medir(); colocar(S, false);
    if (!V.menosMov()) S.actores.forEach(a => { if (a.entrando) { a.dur = 1.1 + Math.abs(a.tx - a.x) / 400; a.x0 = a.x; } });
    pedir(); dibujar(performance.now());
  };
  function refrescarReparto() {
    // el estado cambió sin cambiar de escena (p. ej. se usó un objeto): conserva posiciones
    const bacia = state.inventory && state.inventory.yelmo > 0;
    S.actores.forEach(a => { if (a.id === 'dq') a.extra = bacia ? 'bacia' : ''; });
  }
  V.colocarEn = function (fig) {
    if (!cv) crear();
    if (cv.parentNode !== fig) fig.insertBefore(cv, fig.firstChild);
    medir();
  };
  V.habla = function (quien) { if (S) { S.habla = quien; pedir(); } };

  /* ---------- bucle ---------- */
  V.ganchos = []; // tareas que comparten el bucle (p. ej. el texto letra a letra)
  function puedeDibujar() {
    if (!S || !visible || !enVista) return false;
    if (typeof MENUON === 'function' && MENUON()) return false;
    if (document.querySelector('#bookModal.show,#mktModal.show')) return false;
    if (V.menosMov()) return !!(S.dados && !S.dados.fin);
    return true;
  }
  function hayQueAnimar() {
    if (!visible) return false;
    return V.ganchos.some(g => g.activo()) || puedeDibujar();
  }
  function pedir() { if (!raf && hayQueAnimar()) { ultimo = 0; raf = requestAnimationFrame(tick); } }
  V.pedir = pedir;
  function tick(now) {
    raf = 0;
    if (!hayQueAnimar()) return;
    for (const g of V.ganchos) if (g.activo()) g.paso(now);
    if (puedeDibujar()) {
      if (ultimo) { fpsBuf.push(1000 / Math.max(1, now - ultimo)); if (fpsBuf.length > 120) fpsBuf.shift(); }
      ultimo = now;
      dibujar(now);
    } else ultimo = 0;
    raf = requestAnimationFrame(tick);
  }
  V.fps = () => fpsBuf.length ? fpsBuf.reduce((a, b) => a + b, 0) / fpsBuf.length : 0;
  V.activo = () => !!raf;

  /* ---------- composición de un fotograma ---------- */
  function dibujar(now) {
    if (!S || !ctx) return;
    const t = (now - S.t) / 1000, quieto = V.menosMov(), tt = quieto ? 0 : t;
    const e = S.e, L = capas(e), hora = e.h;
    // cámara: en escenas de camino el paisaje se desplaza
    const marcha = e.an === 'walk' && !quieto ? tt * 14 : 0;
    const tn = tension();
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.fillStyle = HEX[hora][0]; ctx.fillRect(0, 0, W, H);
    capa(L.cielo, 0);
    capa(L.lejos, marcha * 0.15);
    const ond = (tn.cor > 0.3 && !quieto) ? Math.round(Math.sin(tt * 1.7) * tn.cor * 1.5) : 0;
    ctx.save(); ctx.translate(0, ond); capa(L.medio, marcha * 0.4); ctx.restore();
    animFondo(L, tt, hora, 'medio', marcha * 0.4);
    capa(L.suelo, marcha);
    animFondo(L, tt, hora, 'suelo', marcha);
    // actores (de atrás a delante)
    actualizarActores(tt, quieto);
    const orden = S.actores.slice().sort((a, b) => (a.fondo ? -1 : 0) - (b.fondo ? -1 : 0) || a.y - b.y);
    for (const a of orden) pintarActor(a, tt, hora);
    animFondo(L, tt, hora, 'delante', marcha);
    particulas(tt, quieto, hora, e, L);
    capa(L.frente, marcha * 1.6);
    // luz
    luces(L, tt, hora, e);
    if (e.tarde) { ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(255,170,90,.35)'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; }
    if (L.papel && hora === 'noche') { ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(120,110,170,.45)'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; }
    postTension(tn, tt, quieto);
    if (S.dados) dados(now);
    transicion(t, quieto);
  }
  function capa(c, dx) {
    if (!dx) { ctx.drawImage(c, -OX, 0); return; }
    const w = c.width, x = -((Math.round(dx) % w) + w) % w - OX;
    ctx.drawImage(c, x, 0); ctx.drawImage(c, x + w, 0); if (x + w * 2 < W) ctx.drawImage(c, x + w * 2, 0);
  }

  /* ---------- actores ---------- */
  function actualizarActores(t, quieto) {
    for (const a of S.actores) {
      if (a.entrando && !quieto) {
        const k = Math.min(1, t / a.dur); a.x = Math.round(a.x0 + (a.tx - a.x0) * (1 - Math.pow(1 - k, 2)));
        if (k >= 1) { a.entrando = 0; a.x = a.tx; }
      } else if (a.entrando) { a.entrando = 0; a.x = a.tx; }
    }
  }
  const FPS_ANIM = 8;
  function poseDe(a, t) {
    const f = Math.floor(t * FPS_ANIM);
    const an = S.e.an, quien = S.habla;
    if (a.entrando) return a.pose === 'montado' ? ['montado', 0] : ['caminar', f & 3];
    if (a.pose === 'tendido' || a.pose === 'leer' || a.pose === 'arrodillado') return [a.pose === 'tendido' ? 'reposo' : a.pose, Math.floor(t * 1.2) & 1];
    if (a.come) return ['hablar', Math.floor(t * 6) & 1];
    if (a.reac && t < a.reac) return ['golpe', a.reacF || 0];
    if (an === 'walk' && !a.flip && a.pose !== 'montado') return ['caminar', f & 3];
    if (a.pose === 'montado') return ['montado', 0];
    // ¿quién habla?
    if (quien && ((quien === 'sancho' && a.id === 'sancho') || (quien === 'dq' && a.rol === 'dq') || (quien === 'npc' && a.rol === 'npc' && !a.k && !V.esAnimal(a.id))))
      return ['hablar', Math.floor(t * 5) & 1];
    if (an === 'talk' && !quien && a.rol === 'npc' && !a.k && !V.esAnimal(a.id) && (Math.floor(t / 2.4) % 2 === 1)) return ['hablar', Math.floor(t * 5) & 1];
    return ['reposo', Math.floor(t * 1.2) & 1];
  }
  function pintarActor(a, t, hora) {
    let [pose, f] = poseDe(a, t);
    let x = a.x, y = a.y || GY, dy = 0, rot = 0;
    const an = S.e.an;
    // actuaciones
    if (an === 'fight' && !a.entrando && !V.menosMov()) {
      const ciclo = 3.4, k = (t % ciclo) / ciclo, obj = S.actores.find(o => o.rol === 'npc');
      const meta = obj ? obj.x - 34 : Math.round(W * 0.55);
      if (a.rol === 'dq') {
        const d = Math.max(0, meta - a.tx);
        if (k > 0.45 && k < 0.62) { x = a.tx + d * ((k - 0.45) / 0.17); pose = a.pose === 'montado' ? 'montado' : 'caminar'; f = Math.floor(t * 12) & 3; a.carga = 1; }
        else if (k >= 0.62 && k < 0.74) { x = a.tx + d; pose = a.pose === 'montado' ? 'montado' : 'golpe'; f = 1; a.golpeando = 1; if (!S.golpeT || t - S.golpeT > 1) { S.golpeT = t; polvo(x + 20, GY, 10); if (obj) { obj.reac = t + 0.5; obj.reacF = 0; } } }
        else if (k >= 0.74 && k < 0.9) { x = a.tx + d * (1 - (k - 0.74) / 0.16); a.carga = 0; }
        else a.carga = 0;
        S.dqx = x;
      }
      if (a.rol === 'montura' && a.id === 'rucio') {}
      if (obj && a === obj && a.reac && t < a.reac) x += 3;
    }
    if (a.manteo) { const k = (t % 1.4) / 1.4; dy = -Math.round(Math.sin(k * Math.PI) * 54); rot = k * Math.PI * 2 * (k < 0.5 ? 1 : 1); pose = 'golpe'; f = 0; }
    if (a.vuelo) { dy = -18 - Math.round(Math.sin(t * 1.6) * 4); if (a.sobre === 'barca') dy = -10 + Math.round(Math.sin(t * 2.1) * 1.5); }
    if (an === 'plantado' && a.rol === 'dq') { pose = 'montado'; if ((t % 3) > 2.4) dy = -1; }
    // montura
    if (a.pose === 'montado' && (a.mont || a.sobre)) {
      const mid = a.mont || a.sobre;
      if (mid === 'barca') return barcaConJinetes(a, x, y + dy, t, hora);
      const mPose = (a.entrando || (an === 'walk' && !a.flip) || a.carga) ? 'caminar' : 'reposo';
      const mf = mPose === 'caminar' ? Math.floor(t * (a.carga ? 12 : FPS_ANIM)) & 3 : (an === 'plantado' && (t % 3) > 2.2 ? 1 : Math.floor(t * 0.8) & 1);
      const mc = V.actorCanvas(mid, mPose, mf, hora, false);
      const bob = mPose === 'caminar' ? (mf & 1) : 0;
      if (a.detras) x -= 8;
      if (!(a.detras && mid === 'clavileno')) ctx.drawImage(mc, x - mc._ax, y + dy - mc._ay);
      const sp = V.SILLA[mid], hx = x - mc._ax + sp[0], hy = y + dy - mc._ay + sp[1] - bob;
      const rc = V.actorCanvas(a.id, 'montado', 0, hora, false, a.extra);
      // la cadera del jinete (alto*0.44 sobre los pies) va en la silla
      const sp2 = V.spec(a.id), cad = Math.round(sp2.alto * (sp2.cuerpo === 'grueso' ? 0.36 : 0.44));
      ctx.drawImage(rc, hx - rc._ax, hy + cad - rc._ay);
      brillos(a, hx, hy + cad, t, sp2);
      return;
    }
    const c = V.actorCanvas(a.id, pose === 'tendido' ? 'reposo' : pose, f, hora, !!a.flip, a.extra);
    if (a.pose === 'tendido') {
      ctx.save(); ctx.translate(x, y + dy - 3); ctx.rotate(-Math.PI / 2); ctx.drawImage(c, -c._ay + 2, -c._ax); ctx.restore();
      if (!V.menosMov() && Math.floor(t) % 3 === 0 && (t % 1) < 0.03) S.part.push({ k: 'z', x: x + 6, y: y - 12, vx: 4, vy: -8, v: 2.2, t: 0 });
      return;
    }
    if (rot) { ctx.save(); ctx.translate(x, y + dy - 18); ctx.rotate(rot); ctx.drawImage(c, -c._ax, -c._ay + 18); ctx.restore(); return; }
    if (a.enjaulado) { ctx.drawImage(c, x - c._ax, y - 10 - c._ay); return; }
    ctx.drawImage(c, x - c._ax, y + dy - c._ay);
    if (a.id === 'dq') brillos(a, x, y + dy - Math.round(V.spec('dq').alto * 0.44), t, V.spec('dq'));
    if (a.entrando && !V.menosMov() && Math.random() < 0.15) polvo(x, y, 1);
  }
  function brillos(a, hx, hy, t, sp) {
    // brillo que recorre el yelmo o la bacía cada pocos segundos
    if (a.id !== 'dq' || V.menosMov()) return;
    const k = t % 4.2; if (k > 0.5) return;
    const top = hy - Math.round(sp.alto * 0.3) - 10, x = hx - 3 + Math.round(k * 16);
    ctx.fillStyle = HEX[S.e.h][31]; ctx.fillRect(x, top - 1, 1, 1); if (k > 0.1 && k < 0.35) { ctx.fillRect(x - 1, top - 1, 3, 1); ctx.fillRect(x, top - 2, 1, 3); }
  }
  function barcaConJinetes(a, x, y, t, hora) {
    if (a.id !== 'dq') return; // la barca se pinta una vez, con los dos
    const P = HEX[hora];
    const sancho = S.actores.find(o => o.id === 'sancho');
    const rd = V.actorCanvas('dq', 'reposo', 0, hora, false, a.extra), rs = sancho ? V.actorCanvas('sancho', 'reposo', 0, hora, false) : null;
    if (rs) ctx.drawImage(rs, x - 18 - rs._ax, y - rs._ay + 8);
    ctx.drawImage(rd, x + 6 - rd._ax, y - rd._ay + 10);
    ctx.fillStyle = P[19]; ctx.fillRect(x - 34, y - 2, 70, 6); ctx.fillStyle = P[18]; ctx.fillRect(x - 30, y + 4, 62, 4); ctx.fillStyle = P[0]; ctx.fillRect(x - 34, y - 3, 70, 1);
  }

  /* ---------- props animados ---------- */
  function animFondo(L, t, hora, fase, dx) {
    const P = HEX[hora];
    for (const a of L.anim) {
      const capaDe = { aspas: 'medio', aspasTinta: 'medio', llama: 'medio', fuego: 'suelo', agua: 'suelo', olas: 'medio', bandera: 'medio', mazos: 'medio', barca: 'suelo', clavileno: 'delante', manta: 'delante', letras: 'delante' }[a.t] || 'medio';
      if (capaDe !== fase) continue;
      const x = a.x - OX;
      if (a.t === 'aspas' || a.t === 'aspasTinta') {
        const n = 24, i = Math.floor(((t * (a.t === 'aspas' ? 0.35 : 0.6)) % 1) * n) % n;
        const c = cache('asp|' + a.s + '|' + i + '|' + hora + '|' + a.t, () => aspas(a.s, i / n * Math.PI / 2, a.t === 'aspasTinta').canvas(hora));
        ctx.drawImage(c, x - (c.width >> 1) - (fase === 'medio' ? Math.round(dx) : 0), a.y - (c.height >> 1));
      } else if (a.t === 'llama' || a.t === 'fuego') {
        const s = a.s || 0.5, f = Math.floor(t * 9 + a.x) % 4;
        const c = cache('fu|' + s + '|' + f + '|' + hora, () => fuego(s, f).canvas(hora));
        ctx.drawImage(c, x - (c.width >> 1), a.y - c.height + 1);
      } else if (a.t === 'agua' || a.t === 'olas') {
        ctx.fillStyle = P[a.t === 'olas' ? 30 : 4];
        for (let i = 0; i < 26; i++) { const xx = ((i * 53 + t * (8 + i % 3 * 4)) % (W + 20)) - 10, yy = (a.y || 120) + ((i * 7) % (a.h || 8)); ctx.fillRect(Math.round(xx), Math.round(yy), 3 + (i % 3), 1); }
        if (a.t === 'olas') { ctx.fillStyle = P[30]; const k = (Math.sin(t * 1.3) + 1) / 2; ctx.fillRect(0, Math.round(122 + k * 3), W, 1); }
      } else if (a.t === 'bandera') {
        const f = Math.floor(t * 4) & 1; ctx.fillStyle = P[19]; ctx.fillRect(x, a.y - 14, 1, 16); ctx.fillStyle = P[20];
        for (let i = 0; i < 10; i++) ctx.fillRect(x + 1 + i, a.y - 14 + Math.round(Math.sin(i * 0.8 + t * 6) * (f ? 1 : 0.6)), 1, 5);
      } else if (a.t === 'mazos') {
        const k = Math.abs(Math.sin(t * 3.2)); ctx.strokeStyle = P[18]; ctx.fillStyle = P[18];
        for (let i = 0; i < 2; i++) { const ang = (i ? k : 1 - k) * 0.9, hx = x + i * 10, hy = a.y; ctx.fillRect(Math.round(hx + Math.sin(ang) * 14) - 2, Math.round(hy + Math.cos(ang) * 14) - 2, 5, 5); ctx.fillRect(hx, hy, 1, 1); }
        if (k > 0.97 && !V.menosMov()) polvo(x + 4, a.y + 24, 2);
      } else if (a.t === 'barca') {
        if (S.e.an === 'fly') continue; const yy = a.y + Math.round(Math.sin(t * 2) * 1);
        ctx.fillStyle = P[19]; ctx.fillRect(x - 24, yy, 48, 4); ctx.fillStyle = P[18]; ctx.fillRect(x - 20, yy + 4, 40, 3); ctx.fillStyle = P[0]; ctx.fillRect(x - 24, yy - 1, 48, 1);
      } else if (a.t === 'clavileno') {
        const dq = S.actores.find(o => o.rol === 'dq');
        const c = V.actorCanvas('clavileno', 'reposo', 0, hora, false);
        const yy = a.y - (dq && dq.vuelo ? 18 + Math.round(Math.sin(t * 1.6) * 4) : 0);
        ctx.drawImage(c, (dq ? dq.x : x) - c._ax, yy - c._ay);
      } else if (a.t === 'letras' && !V.menosMov()) {
        ctx.fillStyle = P[29];
        const r = rng(7); for (let i = 0; i < 14; i++) { const bx = r() * W, by = r() * 110, sp = 3 + r() * 6; const yy = ((by - t * sp) % 120 + 120) % 120; const xx = bx + Math.sin(t + i) * 6; const g = V.cache('gl|' + i + '|' + S.e.h, () => { const b = new B(6, 8); V.texto(b, 'ABCDEFGHILMNOPRSTUV'[i % 19], 0, 0, C.pano); return b.canvas(S.e.h); }); ctx.globalAlpha = 0.65; ctx.drawImage(g, Math.round(xx), Math.round(yy)); ctx.globalAlpha = 1; }
      }
    }
    if (fase === 'delante') propsDelante(t, hora);
  }
  function propsDelante(t, hora) {
    const P = HEX[hora], e = S.e;
    if (e.props.includes('manta')) {
      const m = S.actores.filter(a => a.rol === 'npc'); if (m.length >= 2) {
        const y = GY - 18 + Math.round(Math.sin(t * 4.5) * 2); ctx.fillStyle = P[30]; ctx.fillRect(m[0].x + 6, y, m[1].x - m[0].x - 12, 3); ctx.fillStyle = P[17]; ctx.fillRect(m[0].x + 6, y + 3, m[1].x - m[0].x - 12, 1);
      }
    }
    if (e.props.includes('carrojaula')) {
      const x = Math.round(W * 0.47), y = GY;
      ctx.fillStyle = P[18]; ctx.fillRect(x - 30, y - 16, 60, 5); ctx.fillStyle = P[19]; ctx.beginPath(); ctx.arc(x - 18, y - 6, 6, 0, 6.3); ctx.arc(x + 18, y - 6, 6, 0, 6.3); ctx.fill();
      ctx.fillStyle = P[25]; for (let i = 0; i < 9; i++) ctx.fillRect(x - 26 + i * 7, y - 56, 1, 40); ctx.fillRect(x - 27, y - 57, 56, 2);
      if (S.id === 'leones') { const c = V.actorCanvas('leon', Math.floor(t / 2.6) % 3 === 2 ? 'hablar' : 'reposo', Math.floor(t * 4) & 1, hora, true); ctx.drawImage(c, x - c._ax, y - 16 - c._ay); for (let i = 0; i < 9; i++) ctx.fillRect(x - 26 + i * 7, y - 56, 1, 40); }
    }
    if (e.props.includes('carreta') || e.props.includes('coche')) {
      const x = Math.round(W * 0.86), y = GY - 4, coche = e.props.includes('coche');
      ctx.fillStyle = P[coche ? 19 : 18]; ctx.fillRect(x - 26, y - (coche ? 30 : 14), 46, coche ? 24 : 8); ctx.fillStyle = P[coche ? 20 : 19]; ctx.fillRect(x - 26, y - (coche ? 32 : 16), 46, 2);
      if (coche) { ctx.fillStyle = P[4]; ctx.fillRect(x - 18, y - 26, 10, 9); ctx.fillRect(x + 2, y - 26, 10, 9); }
      ctx.fillStyle = P[19]; ctx.beginPath(); ctx.arc(x - 16, y, 7, 0, 6.3); ctx.arc(x + 12, y, 7, 0, 6.3); ctx.fill(); ctx.fillStyle = P[18]; ctx.fillRect(x - 17, y - 1, 3, 3); ctx.fillRect(x + 11, y - 1, 3, 3);
    }
  }
  function aspas(s, ang, tinta) {
    const R = Math.round(22 * s), b = new B(R * 2 + 3, R * 2 + 3), c = R + 1;
    for (let k = 0; k < 4; k++) {
      const a = ang + k * Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a), px = -sa, py = ca;
      const P = (d, w) => [c + ca * d + px * w, c + sa * d + py * w];
      if (tinta) { b.line(c, c, c + ca * R, c + sa * R, C.pano); b.line(...P(R * 0.3, 3), ...P(R, 3), C.pano); continue; }
      const q = [...P(R * 0.25, 0), ...P(R, 0), ...P(R, 5 * s), ...P(R * 0.25, 5 * s)];
      b.poly(q, C.lino); b.line(c, c, c + ca * R, c + sa * R, C.maderaO);
      for (let d = R * 0.35; d < R; d += 4) b.line(...P(d, 0), ...P(d, 5 * s), C.madera);
      b.line(...P(R * 0.25, 5 * s), ...P(R, 5 * s), C.madera);
    }
    b.circ(c, c, 2, C.maderaO);
    return b;
  }
  function fuego(s, f) {
    const w = Math.round(16 * s), h = Math.round(20 * s), b = new B(w, h), r = rng(f * 7 + 3);
    for (let i = 0; i < 3; i++) {
      const cx = w / 2 + (r() - 0.5) * w * 0.4, hh = h * (0.6 + r() * 0.4), ww = w * (0.28 + r() * 0.12);
      b.poly([cx - ww, h, cx + ww, h, cx + (r() - 0.5) * 3, h - hh], C.brasa);
    }
    b.poly([w / 2 - w * 0.2, h, w / 2 + w * 0.2, h, w / 2 + (f & 1 ? 1 : -1), h - h * 0.55], C.oro);
    b.poly([w / 2 - w * 0.08, h, w / 2 + w * 0.08, h, w / 2, h - h * 0.3], C.destello);
    return b;
  }

  /* ---------- partículas y clima ---------- */
  function polvo(x, y, n) { if (!S || V.menosMov()) return; for (let i = 0; i < n; i++) S.part.push({ k: 'p', x: x + (Math.random() - 0.5) * 8, y: y - Math.random() * 3, vx: (Math.random() - 0.5) * 14, vy: -4 - Math.random() * 8, v: 0.6 + Math.random() * 0.6, t: 0 }); }
  V.polvo = polvo;
  let tAnt = 0;
  function particulas(t, quieto, hora, e, L) {
    const P = HEX[hora], dt = Math.min(0.05, Math.max(0, t - tAnt)); tAnt = t;
    const cl = e.clima;
    if (!quieto) {
      if (cl.includes('polvo') && Math.random() < 0.3) S.part.push({ k: 'm', x: Math.random() * W, y: 100 + Math.random() * 60, vx: 6 + Math.random() * 6, vy: -1, v: 3, t: 0 });
      if (e.an === 'walk' && Math.random() < 0.25) { const dq = S.actores.find(a => a.rol === 'dq'); if (dq) polvo(dq.x - 8, GY, 1); }
      if (cl.includes('luciernagas') && S.part.filter(p => p.k === 'l').length < 14) S.part.push({ k: 'l', x: Math.random() * W, y: 90 + Math.random() * 60, vx: 0, vy: 0, v: 6 + Math.random() * 6, t: 0, f: Math.random() * 6 });
      if (L.anim.some(a => a.t === 'fuego') && Math.random() < 0.25) { const f = L.anim.find(a => a.t === 'fuego'); S.part.push({ k: 'c', x: f.x - OX + (Math.random() - 0.5) * 6, y: f.y - 10, vx: (Math.random() - 0.5) * 6, vy: -14 - Math.random() * 10, v: 1 + Math.random(), t: 0 }); }
    }
    // lluvia: directa, determinista (no ocupa la lista)
    if (cl.includes('lluvia') || cl.includes('lluvia_l')) {
      const n = cl.includes('lluvia') ? 90 : 36; ctx.fillStyle = P[4]; ctx.globalAlpha = 0.7;
      for (let i = 0; i < n; i++) { const sp = 160 + (i % 5) * 20, x0 = (i * 97) % (W + 60), y0 = (i * 61) % H; const y = (y0 + t * sp) % (H + 10) - 10, x = (x0 - (t * sp * 0.25)) % (W + 60); const xx = ((x % (W + 60)) + W + 60) % (W + 60) - 30;
        ctx.fillRect(Math.round(xx), Math.round(y), 1, 4); if (y > GY + 4 && i % 3 === 0) ctx.fillRect(Math.round(xx) - 1, GY + 8 + (i % 12), 3, 1); }
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(30,40,70,.18)'; ctx.fillRect(0, 0, W, H);
    }
    if (cl.includes('niebla')) {
      for (let k = 0; k < 2; k++) { const c = cache('niebla|' + k + '|' + hora, () => { const b = new B(400, 40); b.dith(0, 0, 400, 40, C.T, k ? C.nube : C.cieloH, (x, y) => (1 - Math.abs(y - 20) / 20) * (0.5 + 0.3 * Math.sin(x / 31 + k * 2))); return b.canvas(hora); });
        const dx = Math.round(-(t * (4 + k * 5)) % 400); ctx.globalAlpha = 0.55; ctx.drawImage(c, dx, 92 + k * 32); ctx.drawImage(c, dx + 400, 92 + k * 32); ctx.globalAlpha = 1; }
    }
    if (cl.includes('antorchas')) {
      for (const a of S.actores) if (a.id === 'encamisado') { L._lucesExtra = L._lucesExtra || []; }
    }
    // actualizar y pintar la lista
    const out = [];
    for (const p of S.part) {
      p.t += dt; if (p.t > p.v) continue;
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.k === 'p') { p.vy += 18 * dt; ctx.fillStyle = P[p.t < p.v * 0.5 ? 9 : 10]; ctx.globalAlpha = 1 - p.t / p.v; ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2); }
      else if (p.k === 'm') { ctx.fillStyle = P[9]; ctx.globalAlpha = 0.5 * (1 - p.t / p.v); ctx.fillRect(Math.round(p.x), Math.round(p.y + Math.sin(p.t * 3) * 2), 1, 1); }
      else if (p.k === 'l') { p.x += Math.sin(t * 1.3 + p.f) * 0.3; p.y += Math.cos(t * 0.9 + p.f) * 0.2; ctx.fillStyle = P[23]; ctx.globalAlpha = (Math.sin(t * 3 + p.f) + 1) / 2; ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1); if (ctx.globalAlpha > 0.7) { ctx.globalAlpha = 0.25; ctx.fillRect(Math.round(p.x) - 1, Math.round(p.y) - 1, 3, 3); } }
      else if (p.k === 'c') { ctx.fillStyle = P[p.t < 0.4 ? 31 : 22]; ctx.globalAlpha = 1 - p.t / p.v; ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1); }
      else if (p.k === 'z') { ctx.globalAlpha = 1 - p.t / p.v; const g = cache('z|' + hora, () => { const b = new B(6, 8); V.texto(b, 'Z', 0, 0, C.lino, C.negro); return b.canvas(hora); }); ctx.drawImage(g, Math.round(p.x), Math.round(p.y)); }
      else if (p.k === 'num') { ctx.globalAlpha = 1 - Math.max(0, p.t - p.v * 0.6) / (p.v * 0.4); ctx.drawImage(p.cv, Math.round(p.x - p.cv.width / 2), Math.round(p.y)); }
      ctx.globalAlpha = 1; out.push(p);
    }
    S.part = out.length > 160 ? out.slice(-160) : out;
  }

  /* ---------- luz ---------- */
  function luces(L, t, hora, e) {
    const noche = hora === 'noche' || L.interior;
    const ls = L.luces.slice();
    if (e.clima.includes('antorchas')) S.actores.forEach(a => { if (a.id === 'encamisado') ls.push({ x: a.x + OX - 2, y: GY - 50, r: 60, f: 1 }); });
    if (!ls.length) return;
    ctx.globalCompositeOperation = 'lighter';
    for (const l of ls) {
      const fl = l.f && !V.menosMov() ? (Math.sin(t * 13 + l.x) * 0.5 + Math.sin(t * 7.3) * 0.5) * 0.08 : 0;
      const x = l.x - OX, r = l.r * (1 + fl);
      const g = ctx.createRadialGradient(x, l.y, 1, x, l.y, r);
      const col = l.frio ? '120,160,220' : '255,150,60';
      g.addColorStop(0, 'rgba(' + col + ',' + ((noche ? 0.42 : 0.18) + fl) + ')'); g.addColorStop(1, 'rgba(' + col + ',0)');
      ctx.fillStyle = g; ctx.fillRect(x - r, l.y - r, r * 2, r * 2);
      if (l.rayo) { ctx.fillStyle = 'rgba(255,230,170,.08)'; ctx.beginPath(); ctx.moveTo(x - 18, l.y - 18); ctx.lineTo(x + 18, l.y - 18); ctx.lineTo(x + 70, GY + 10); ctx.lineTo(x - 10, GY + 10); ctx.fill(); }
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  /* ---------- tensión: viñeta, grano, desaturación ---------- */
  let grano = null, granoT = 0;
  function postTension(tn, t, quieto) {
    const vig = (col, a) => { const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, W * 0.7); g.addColorStop(0, 'rgba(' + col + ',0)'); g.addColorStop(1, 'rgba(' + col + ',' + a + ')'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); };
    vig('20,10,30', 0.35); // viñeta suave siempre: enmarca la escena
    if (tn.cor > 0) vig('70,30,110', 0.55 * tn.cor);
    if (tn.sal > 0) vig('110,10,10', (0.4 + (quieto ? 0 : Math.sin(t * Math.PI * 2 / 2.4) * 0.15)) * tn.sal);
    if (tn.ham > 0) {
      ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = 'rgba(128,128,128,' + (0.35 * tn.ham) + ')'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over';
      if (!grano) { grano = document.createElement('canvas'); grano.width = 128; grano.height = 128; const g = grano.getContext('2d'), im = g.createImageData(128, 128); for (let i = 0; i < im.data.length; i += 4) { const v = Math.random() < 0.5 ? 0 : 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = Math.random() < 0.18 ? 40 : 0; } g.putImageData(im, 0, 0); }
      if (!quieto) granoT = Math.floor(t * 12);
      const ox = (granoT * 37) % 128, oy = (granoT * 53) % 128;
      ctx.globalAlpha = Math.min(1, tn.ham * 1.2);
      for (let x = -ox; x < W; x += 128) for (let y = -oy; y < H; y += 128) ctx.drawImage(grano, x, y);
      ctx.globalAlpha = 1;
    }
  }

  /* ---------- transiciones ---------- */
  function transicion(t, quieto) {
    if (!S.trans || quieto) { S.trans = null; return; }
    const P = HEX[S.e.h];
    if (S.trans === 'iris') {
      const dq = S.actores.find(a => a.rol === 'dq' || a.rol === 'izq') || { x: W / 2 };
      const cx = Math.round(dq.tx || W / 2), cy = GY - 30;
      const T1 = 0.32, T2 = 0.5;
      if (t < T1 && snap.cv) { ctx.drawImage(snap.cv, 0, 0); iris(cx, cy, (1 - t / T1) * W * 0.9); }
      else if (t < T1 + T2) iris(cx, cy, Math.pow((t - T1) / T2, 1.4) * W * 0.9);
      else S.trans = null;
    } else if (S.trans === 'pagina') {
      const T = 0.85; if (t >= T || !snap.cv) { S.trans = null; return; }
      const k = t / T, edge = Math.round(W * (1 - k * k * (3 - 2 * k)));
      ctx.drawImage(snap.cv, 0, 0, edge, H, 0, 0, edge, H);
      // dorso de la página que se pasa
      const w = Math.round(Math.sin(k * Math.PI) * 36);
      const g = ctx.createLinearGradient(edge - w, 0, edge, 0); g.addColorStop(0, P[30]); g.addColorStop(1, P[17]);
      ctx.fillStyle = g; ctx.fillRect(edge - w, 0, w, H);
      ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(edge, 0, 4, H);
    }
  }
  function iris(cx, cy, r) {
    ctx.fillStyle = '#0a0a12'; ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(cx, cy, Math.max(0, r), 0, Math.PI * 2, true); ctx.fill('evenodd');
  }

  /* ---------- dados sobre el escenario ---------- */
  V.tirarDados = function (a, b, ok, objetivo) {
    if (!S) return;
    S.dados = { a, b, ok, obj: objetivo, t: performance.now(), fin: false };
    pedir(); dibujar(performance.now());
  };
  function caraDado(n, hora) {
    return cache('dado|' + n + '|' + hora, () => {
      const b = new B(13, 13); b.r(1, 0, 11, 13, C.lino); b.r(0, 1, 13, 11, C.lino); b.r(1, 11, 11, 1, C.calS); b.r(11, 1, 1, 11, C.calS);
      const pts = { 1: [[6, 6]], 2: [[3, 3], [9, 9]], 3: [[3, 3], [6, 6], [9, 9]], 4: [[3, 3], [9, 3], [3, 9], [9, 9]], 5: [[3, 3], [9, 3], [6, 6], [3, 9], [9, 9]], 6: [[3, 3], [9, 3], [3, 6], [9, 6], [3, 9], [9, 9]] }[n];
      pts.forEach(([x, y]) => { b.r(x - 1, y - 1, 2, 2, n === 1 ? C.rojo : C.pano); });
      return b.outline(C.negro).canvas(hora);
    });
  }
  function dados(now) {
    const d = S.dados, t = (now - d.t) / 1000, quieto = V.menosMov(), hora = S.e.h, T = (typeof CFG !== 'undefined' && CFG.fast) ? 0.25 : 0.95;
    const caer = (i, vals) => {
      const x0 = W * 0.78 + i * 12, x1 = W * 0.5 + (i ? 10 : -10), k = quieto ? 1 : Math.min(1, t / T);
      const x = x0 + (x1 - x0) * k, rebote = Math.abs(Math.sin(k * Math.PI * 2.5)) * (1 - k) * 46;
      const y = GY - 6 - rebote;
      const cara = k < 1 ? 1 + Math.floor((t * 14 + i * 3) % 6) : vals;
      const c = caraDado(cara, hora); ctx.drawImage(c, Math.round(x - 6), Math.round(y - 6));
    };
    caer(0, d.a); caer(1, d.b);
    if (quieto || t >= T) {
      if (!d.fin) {
        d.fin = true; d.tf = t;
        const dq = S.actores.find(a => a.rol === 'dq' || a.rol === 'izq');
        if (dq) { dq.reac = t + 0.8; dq.reacF = d.ok ? 1 : 0; }
        if (!quieto) polvo(W * 0.5, GY, 8);
      }
      const txt = d.ok ? 'ÉXITO' : 'FALLO', sub = (d.a + d.b) + ' / ' + d.obj;
      const c = cache('dtx|' + txt + sub + '|' + hora, () => { const b = new B(V.anchoTexto(txt) * 2 + 8, 26); const tb = new B(V.anchoTexto(txt) + 2, 9); V.texto(tb, txt, 0, 0, d.ok ? C.oro : C.rojo, C.negro);
        for (let y = 0; y < 9; y++) for (let x = 0; x < tb.w; x++) { const v = tb.g(x, y); if (v !== 255) b.r(4 + x * 2, y * 2, 2, 2, v); }
        V.texto(b, sub, (b.w - V.anchoTexto(sub)) >> 1, 19, C.lino, C.negro); return b.canvas(hora); });
      const k = quieto ? 1 : Math.min(1, (t - d.tf) / 0.25);
      ctx.globalAlpha = k; ctx.drawImage(c, Math.round(W / 2 - c.width / 2), Math.round(34 - (1 - k) * 8)); ctx.globalAlpha = 1;
    }
  }
  V.limpiarDados = () => { if (S) S.dados = null; };

  /* ---------- números flotantes sobre la escena (+5, −3) ---------- */
  V.flotar = function (txt, bueno) {
    if (!S || !ctx) return;
    const hora = S.e.h, c = cache('fl|' + txt + '|' + bueno + '|' + hora, () => { const b = new B(V.anchoTexto(txt) + 2, 9); V.texto(b, txt, 0, 0, bueno ? C.oro : C.rojo, C.negro); return b.canvas(hora); });
    const dq = S.actores.find(a => a.rol === 'dq' || a.rol === 'izq') || { x: W / 2 };
    S.part.push({ k: 'num', cv: c, x: dq.x + (S.part.length % 3) * 10 - 10, y: GY - 80, vx: 0, vy: -10, v: 1.6, t: 0 });
    pedir();
  };

  V.escenaActual = () => S;
  V.dibujarYa = () => dibujar(performance.now());
})(VIS);
