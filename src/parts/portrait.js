/* ============ v3.1 PHONE PORTRAIT ============
   On an iPhone held upright the screen becomes a tall canvas 760 units wide:
   · a top bar (Home, Pause, Sections · Back, Skip, Sound),
   · the scene, cropped to the part that matters ("focus") and scaled to the full width,
   · a dock underneath for the goal, the scores and a big thumb area for swipes and taps.
   Menus (Sections, Arcade, Dress Mona, the intro) get their own upright layouts.
   Landscape screens keep the original 1240 x 900 layout untouched. */
let LOX = 0, LOY = 0, AMB = null;
let PORT = false, PW = W, PH = H, SAFE_T = 0, SAFE_B = 0;
let SCENE_INV = new DOMMatrix(), LAST_DEV = { x: 0, y: 0 }, PDEFER = null, PLATE = null, DOCK = null, SKIP_CB = null;
function deferLate(fn) { if (PLATE) PLATE.push(fn); else fn(); }
const VPW = 760, VPH = 1400, TOPBAR = 134;

// the iPhone's clock, signal and battery sit over the top of the screen when the game runs from the Home Screen:
// measure the real safe area with a hidden probe (custom properties don't resolve env() reliably)
function safeInsets() {
  let pr = document.getElementById('safeprobe');
  if (!pr) { pr = document.createElement('div'); pr.id = 'safeprobe'; pr.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)'; document.body.appendChild(pr); }
  const cs = getComputedStyle(pr);
  let t = parseFloat(cs.paddingTop) || 0, b = parseFloat(cs.paddingBottom) || 0;
  if (window.__SAFE) { t = window.__SAFE.t; b = window.__SAFE.b; }
  // safety net: an iPhone app launched from the Home Screen always has a status bar on top
  const ios = /iP(hone|od)/.test(navigator.userAgent), standalone = navigator.standalone || matchMedia('(display-mode: standalone)').matches;
  if (ios && standalone && t < 20) t = 50;
  if (ios && standalone && b < 10 && screen.height >= 812) b = 34;
  return { t, b };
}
function resize() {
  const vw = window.innerWidth, vh = window.innerHeight;
  PORT = vh > vw * 1.1;
  DPR = Math.min(window.devicePixelRatio || 1, 3);
  if (PORT) {
    PW = 760; PH = Math.round(760 * vh / vw); viewScale = vw / PW;
    cv.style.width = vw + 'px'; cv.style.height = vh + 'px'; cv.style.left = '0px'; cv.style.top = '0px';
    cv.width = Math.round(vw * DPR); cv.height = Math.round(vh * DPR);
    K = cv.width / PW;
    const ins = safeInsets(), u = PW / vw;
    SAFE_T = ins.t * u; SAFE_B = ins.b * u;
  } else {
    PW = W; PH = H; SAFE_T = SAFE_B = 0;
    // sideways: the canvas covers the whole screen; the game sits in the middle at full height
    // and the spare width either side is filled with the scene's own colours (no black bars)
    viewScale = Math.min(vw / W, vh / H);
    cv.style.width = vw + 'px'; cv.style.height = vh + 'px'; cv.style.left = '0px'; cv.style.top = '0px';
    DPR = Math.min(DPR, 2); cv.width = Math.round(vw * DPR); cv.height = Math.round(vh * DPR);
    K = cv.width / vw * viewScale; LOX = (vw / viewScale - W) / 2; LOY = (vh / viewScale - H) / 2;
  }
  cacheStore.clear();
  const rot = document.getElementById('rotate'); if (rot) rot.style.display = 'none';
}
function devPt(e) { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * cv.width, y: (e.clientY - r.top) / r.height * cv.height }; }
function toLogical(e) { const d = devPt(e); LAST_DEV = d; const p = SCENE_INV.transformPoint(new DOMPoint(d.x, d.y)); return { x: p.x, y: p.y }; }
function screenPt() { return { x: LAST_DEV.x / K, y: LAST_DEV.y / K }; }
function fullFill() { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillRect(0, 0, cv.width, cv.height); ctx.restore(); }
// buttons remember the transform they were drawn with, so a tilted, scaled or cropped button is hit exactly where it shows
UI.button = function (id, x, y, w, h, draw, cb) {
  let m = null; try { m = ctx.getTransform().inverse(); } catch (e) { }
  this.next.push({ id, x, y, w, h, cb, m });
  ctx.save();
  if (this.pressed === id) { ctx.translate(x + w / 2, y + h / 2); ctx.scale(.94, .94); ctx.translate(-x - w / 2, -y - h / 2); }
  draw(); ctx.restore();
};
UI.hit = function () {
  for (let i = this.regions.length - 1; i >= 0; i--) {
    const r = this.regions[i]; if (!r.m || isNaN(r.m.a)) continue;
    const p = r.m.transformPoint(new DOMPoint(LAST_DEV.x, LAST_DEV.y)), pad = PORT ? 6 : 0;
    if (p.x >= r.x - pad && p.x <= r.x + r.w + pad && p.y >= r.y - pad && p.y <= r.y + r.h + pad) return r;
  }
  return null;
};

/* ---- which part of each scene to show on a phone (scene units) ----
   The scene is scaled to fill the full height under the top bar. minW is the narrowest slice that still
   plays well; a scene that needs more width is fitted to the width instead. cx says where to look,
   pan lets her swipe sideways to look around, rot turns a sideways game (Pong) upright. */
const PI2 = Math.PI / 2;
const P_FOCUS = {
  home: { x0: 0, x1: 1240, y: 0, h: 900, minW: 760, cx: 620, dock: 400 },
  rave: { dockMin: 290, x0: 0, x1: 1240, y: 0, h: 900, cx: 620, minW: 1000 },
  arrive: { dockMin: 140, x0: 0, x1: 1240, y: 0, h: 900, minW: 1240, cx: 620 },
  pantry: { x0: 236, x1: 1240, y: 40, h: 860, minW: 680, cx: 612 },
  // the TV remote on a phone is a split screen: the telly up top, the sofa and cat bed below
  remote: { dock: 640, panels: [{ x0: -2, x1: 330, y: 178, h: 196, minW: 332, cx: 164 }, { x0: 760, x1: 1240, y: 330, h: 300, minW: 480, cx: 1000 }] },
  sofa: { x0: 120, x1: 1240, y: 0, h: 900, minW: 1120, cx: 680 },
  morning: { x0: 260, x1: 1240, y: 0, h: 900, minW: 980, cx: 750 },
  bed: { dockMin: 230, x0: 0, x1: 1240, y: 0, h: 900, minW: 620, cx: 616 },
  card: { dockMin: 150, x0: 0, x1: 1240, y: 0, h: 900, minW: sc => sc.opened ? 880 : 540, cx: 620 },
  pong: { x0: 110, x1: 1130, y: 80, h: 720, rot: -PI2, dock: 250 },
  pac: { x0: 74, x1: 966, y: 94, h: 712, minW: 892, cx: 520 },
  tetris: { x0: 74, x1: 966, y: 94, h: 712, minW: 640, cx: 600 },
  plat: { x0: 74, x1: 966, y: 94, h: 712, minW: 892, cx: 520 },
  run: { x0: 74, x1: 966, y: 94, h: 712, minW: 892, cx: 520 },
  fight: { x0: 74, x1: 966, y: 94, h: 712, minW: 892, cx: 520, dock: 380 },
  kart: { x0: 214, x1: 826, y: 94, h: 712, minW: 612, cx: 520 }
};
let PVIEW = { s: 1, fill: false };
const pv = (v, sc) => typeof v === 'function' ? v(sc) : v;
function vpXf() { const u = Math.min(PW / VPW, (PH - SAFE_T - SAFE_B) / VPH); return { u, ox: (PW - VPW * u) / 2, oy: SAFE_T }; }
function vigDraw() {
  ctx.drawImage(cached('vig', W, H, g => {
    const gr = g.createRadialGradient(W / 2, H / 2, H * .38, W / 2, H / 2, H * .98); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(70,25,10,.26)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const g2 = g.createRadialGradient(W / 2, H * .38, 10, W / 2, H * .38, H * .75); g2.addColorStop(0, 'rgba(255,236,200,.10)'); g2.addColorStop(1, 'rgba(255,236,200,0)'); g.fillStyle = g2; g.fillRect(0, 0, W, H);
  }), 0, 0, W, H);
}
function overlay(fn, cardW) { // draw a W x H-centred overlay (how card, pause, done card) in the middle of the phone
  if (!PORT) { fn(); return; }
  const u = Math.min(1, (PW - 28) / cardW); ctx.save(); ctx.translate(PW / 2, PH / 2); ctx.scale(u, u); ctx.translate(-W / 2, -H / 2); fn(); ctx.restore();
}
function renderFrame(dt) {
  ctx.setTransform(K, 0, 0, K, 0, 0); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  UI.next = []; SKIP_CB = null;
  if (scene) {
    if (!paused && !howCard) { scene.t += dt; if (scene.update) scene.update(dt); updateParticles(dt); }
    if (!PORT) {
      ctx.setTransform(K, 0, 0, K, LOX * K, LOY * K);
      SCENE_INV = new DOMMatrix([K, 0, 0, K, LOX * K, LOY * K]).inverse();
      { const sh = shakeIn(paused ? 0 : dt); scene.draw(); if (sh) ctx.restore(); }
      if (scene.vignette !== false) vigDraw();
      ambientSides();
      drawParticles(ctx); drawRipples(dt);
      if (howCard) drawHow(); else if (paused) drawPause();
      if (!paused && scene.hud !== false && !howCard) drawHUD();
      if (!paused && !howCard) drawToast();
      drawToasts(dt);
    } else portraitFrame(dt);
  }
  if (fade.a > 0) { ctx.fillStyle = 'rgba(43,29,26,' + E.sine(fade.a) + ')'; fullFill(); }
}
function portraitFrame(dt) {
  const sc = scene;
  ctx.fillStyle = '#1e1517'; ctx.fillRect(0, 0, PW, PH);
  DOCK = null;
  if (sc.drawP) { // an upright menu, laid out on a 760 x 1400 page
    const V = vpXf(); SCENE_INV = new DOMMatrix([K, 0, 0, K, 0, 0]).translate(V.ox, V.oy).scale(V.u).inverse();
    ctx.save(); ctx.translate(V.ox, V.oy); ctx.scale(V.u, V.u); sc.drawP(); drawParticles(ctx); drawRipples(dt); ctx.restore();
  } else {
    const F = P_FOCUS[sceneName] || { x0: 0, x1: 1240, y: 0, h: 900, minW: 1240, cx: 620 };
    if (F.panels) portraitPanels(sc, F, dt); else {
    const dockRes = (F.dock != null ? F.dock : Math.max(sc._dockMax || 0, F.dockMin || 120)) + SAFE_B;
    const top0 = SAFE_T + TOPBAR, avail = PH - top0 - dockRes, x0 = F.x0, x1 = F.x1, sw = x1 - x0;
    let top = top0;
    let s, bh, M;
    if (F.rot) { // turned upright: the scene's height runs across the phone
      s = Math.min(PW / F.h, avail / sw); bh = Math.min(avail, sw * s);
      M = new DOMMatrix().translate(PW / 2, top + bh / 2).rotate(F.rot * 180 / Math.PI).scale(s).translate(-(x0 + x1) / 2, -(F.y + F.h / 2));
    } else {
      const minW = Math.min(sw, pv(F.minW, sc) || 900); s = avail / F.h; if (PW / s < minW) s = PW / minW; bh = Math.min(avail, F.h * s);
      const vis = PW / s; let cx = pv(F.cx, sc) + (pv(F.pan, sc) ? (sc._pan || 0) : 0);
      const lo = x0 + vis / 2, hi = x1 - vis / 2; if (lo <= hi) { const c2 = clamp(cx, lo, hi); if (pv(F.pan, sc)) sc._pan = (sc._pan || 0) + (c2 - cx); cx = c2; } else cx = (x0 + x1) / 2;
      // when the whole scene has to fit across the phone, sit it in the middle of the free space
      const spare = avail - bh; if (spare > 40) top = top0 + spare * .5;
      M = new DOMMatrix().translate(PW / 2, top + bh / 2).scale(s).translate(-cx, -(F.y + F.h / 2));
    }
    PVIEW = { s, fill: false, pan: false };
    SCENE_INV = new DOMMatrix([K, 0, 0, K, 0, 0]).multiply(M).inverse();
    DOCK = { y: top + bh + 16, y0: top + bh, stats: [], items: [] };
    // story scenes: the captions and scores sit at the bottom of the phone, the scene fills the space above
    if (!F.rot && F.dock == null && !GAMES[sceneName] && !sc.swipeDock) {
      const dk = Math.max(sc._dockMax || 0, F.dockMin || 120), y0 = PH - SAFE_B - dk - 14;
      if (y0 > top + bh) {
        const nt = top0 + Math.max(0, y0 - top0 - bh) * .5; M = new DOMMatrix().translate(0, nt - top).multiply(M); top = nt;
        SCENE_INV = new DOMMatrix([K, 0, 0, K, 0, 0]).multiply(M).inverse();
        DOCK = { y: y0 + 16, y0, stats: [], items: [] };
      }
    }
    // the scene, scaled and cropped into its band
    ctx.save(); ctx.beginPath(); ctx.rect(0, top, PW, bh); ctx.clip(); ctx.transform(M.a, M.b, M.c, M.d, M.e, M.f);
    PDEFER = []; PLATE = [];
    UNROT = F.rot ? -F.rot : 0;
    { const sh = shakeIn(paused ? 0 : dt); try { sc.draw(); } finally { if (sh) ctx.restore(); } }
    const Q = PDEFER, QL = PLATE; PDEFER = null; PLATE = null;
    if (sc.vignette !== false) vigDraw();
    drawParticles(ctx); drawRipples(dt); UNROT = 0;
    ctx.restore();
    // the dock: when the scene fills the phone, the goal and scores float over the bottom of it;
    // otherwise they sit on a warm dark panel with a festive edge
    if (!PVIEW.fill) {
      // no borders: the scene's own colours carry on above and below it, right down to the bottom of the phone
      ambientPortrait(top0, top, bh);
    }
    Q.forEach(fn => fn());
    dockLayout();
    QL.forEach(fn => fn());
    if (sc.dockP) sc.dockP();
    else if (!drawPad() && !PVIEW.fill && !sc.res && !howCard && !paused && DOCK.y < PH - 150 && (GAMES[sceneName] || sc.swipeDock)) dockPad();
    if (PVIEW.pan && !howCard && !paused) { const k = .5 + .5 * Math.sin(gameTime * 3); ctx.save(); ctx.globalAlpha = .55 + .3 * k; for (const sd of [-1, 1]) { ctx.save(); ctx.translate(PW / 2 + sd * (PW / 2 - 34), top + 70); circ(ctx, 0, 0, 24); fillP(ctx, 'rgba(20,10,20,.55)'); ctx.beginPath(); ctx.moveTo(-sd * 6, -11); ctx.lineTo(sd * 8, 0); ctx.lineTo(-sd * 6, 11); strokeP(ctx, '#fff', 4); ctx.restore(); } ctx.restore(); }
  }}
  if (howCard) overlay(drawHow, 860); else if (paused) overlay(drawPause, 680);
  if (sc.hud !== false && !paused && !howCard) drawHUDP();
  if (!paused && !howCard) drawToast();
  ctx.save(); ctx.translate((PW - W) / 2, SAFE_T + 96); drawToasts(dt); ctx.restore();
}
/* split screen: several views of the same scene stacked down the phone; the last one takes the taps */
function portraitPanels(sc, F, dt) {
  const top = SAFE_T + TOPBAR, avail = PH - top - (F.dock || 200) - SAFE_B, gap = 8;
  const P = F.panels.map(p => { const s = PW / p.minW; return { p, s, h: p.h * s }; });
  const tot = P.reduce((a, q) => a + q.h, 0) + gap * (P.length - 1), f = Math.min(1, avail / tot);
  let y = top, Q = [], QL = [];
  P.forEach((q, i) => {
    const s = q.s * f, bh = q.p.h * s, last = i === P.length - 1, vis = PW / s, cx = vis >= q.p.x1 - q.p.x0 ? (q.p.x0 + q.p.x1) / 2 : clamp(q.p.cx, q.p.x0 + vis / 2, q.p.x1 - vis / 2);
    const M = new DOMMatrix().translate(PW / 2, y + bh / 2).scale(s).translate(-cx, -(q.p.y + q.p.h / 2));
    if (last) { SCENE_INV = new DOMMatrix([K, 0, 0, K, 0, 0]).multiply(M).inverse(); PVIEW = { s, fill: false, pan: false }; DOCK = { y: y + bh + 16, y0: y + bh, stats: [], items: [] }; }
    else DOCK = null;
    (sc._pm || (sc._pm = []))[i] = { M, y, bh };
    ctx.save(); rr(ctx, 10, y, PW - 20, bh, 22); ctx.clip(); ctx.transform(M.a, M.b, M.c, M.d, M.e, M.f);
    PDEFER = []; PLATE = [];
    { const sh = shakeIn(paused || !last ? 0 : dt); try { sc.draw(); } finally { if (sh) ctx.restore(); } }
    if (last) { Q = PDEFER; QL = PLATE; }
    PDEFER = null; PLATE = null;
    if (sc.vignette !== false) vigDraw();
    drawParticles(ctx); if (last) drawRipples(dt);
    ctx.restore();
    rr(ctx, 10, y, PW - 20, bh, 22); strokeP(ctx, 'rgba(255,240,220,.18)', 2);
    y += bh + gap;
  });
  dockBg(DOCK.y0 + 4);
  Q.forEach(fn => fn()); dockLayout(); QL.forEach(fn => fn());
}
/* a soft thumb-zone hint at the bottom of the dock in the arcade games */
function dockPad() {
  const y0 = Math.max(DOCK.y + 6, PH - 300 - SAFE_B), h = PH - SAFE_B - 24 - y0; if (h < 90) return;
  const cx = PW / 2, cy = y0 + h / 2, R = Math.min(h / 2 - 8, 120), p = .5 + .5 * Math.sin(gameTime * 2.4);
  rr(ctx, 26, y0, PW - 52, h, 34); fillP(ctx, 'rgba(255,255,255,.035)');
  ctx.save(); ctx.setLineDash([10, 12]); rr(ctx, 26, y0, PW - 52, h, 34); strokeP(ctx, 'rgba(255,255,255,.13)', 2); ctx.restore();
  // a soft thumb target with four chevrons: swipe in any direction, or tap
  glowAt(ctx, cx, cy, R * 1.6, '255,214,150', .08 + .05 * p);
  circ(ctx, cx, cy, R); strokeP(ctx, 'rgba(255,240,220,.16)', 3); circ(ctx, cx, cy, R * .34); fillP(ctx, 'rgba(255,240,220,.1)');
  for (let i = 0; i < 4; i++) { ctx.save(); ctx.translate(cx, cy); ctx.rotate(i * PI2); ctx.translate(0, -R * .7 - p * 6); ctx.beginPath(); ctx.moveTo(-14, 7); ctx.lineTo(0, -7); ctx.lineTo(14, 7); strokeP(ctx, 'rgba(255,240,220,.4)', 5); ctx.restore(); }
  text(ctx, 'SWIPE  ·  TAP', cx, cy + 1, { size: 18, color: 'rgba(255,240,220,.5)', weight: 700 });
}
function dockStat(label, value) { if (DOCK) DOCK.stats.push([label, String(value)]); }
function dockItem(h, draw) { if (DOCK) DOCK.items.push({ h, draw }); }
function dockLayout() {
  const S = DOCK.stats, items = [];
  if (S.length) items.push({ h: 80, draw: y => { const n = S.length, gap = 12, w = (PW - 40 - gap * (n - 1)) / n; S.forEach(([l, v], i) => { const x = 20 + i * (w + gap); rr(ctx, x, y + 6, w, 72, 14); fillP(ctx, '#bfa98a'); rr(ctx, x, y, w, 72, 14); fillP(ctx, XC.cream); text(ctx, l.toUpperCase(), x + w / 2, y + 20, { size: 15, color: XC.red, weight: 800 }); text(ctx, v, x + w / 2, y + 50, { size: 34, color: XC.pine, display: true });}); } });
  items.push(...DOCK.items);
  const gap = 12, total = items.reduce((a, it) => a + it.h + gap, 0);
  if (scene) scene._dockMax = Math.max(scene._dockMax || 0, total + 20);
  let y = DOCK.y0 + 34;
  if (PVIEW.fill && total > 0) { const g = ctx.createLinearGradient(0, y - 60, 0, PH); g.addColorStop(0, 'rgba(20,10,12,0)'); g.addColorStop(1, 'rgba(20,10,12,.55)'); ctx.fillStyle = g; ctx.fillRect(0, y - 60, PW, PH - y + 60); }
  for (const it of items) { it.draw(y); y += it.h + gap; }
  DOCK.y = y;
}
/* ---- the top bar on a phone ---- */
function drawHUDP() {
  const C = UIC.pill, y = SAFE_T + 60;
  ctx.save(); const tg = ctx.createLinearGradient(0, 0, 0, SAFE_T + TOPBAR); tg.addColorStop(0, 'rgba(20,12,14,.85)'); tg.addColorStop(1, 'rgba(20,12,14,.55)'); ctx.fillStyle = tg; ctx.fillRect(0, 0, PW, SAFE_T + TOPBAR); ctx.restore();
  if (scene.home !== false) {
    iconBtn('hud-home', 52, y, 32, (x, yy) => { ctx.save(); ctx.translate(x, yy); ctx.scale(1.05, 1.05); glyphHouse(0, 0); ctx.restore(); }, () => { paused = false; go('home'); }, C);
    iconBtn('hud-pause', 126, y, 32, (x, yy) => glyphBars(x, yy), () => { if (!paused) { paused = true; audio.sfx('click'); } }, C);
    if (sceneName !== 'levels') iconBtn('hud-jump', 200, y, 32, (x, yy) => glyphGrid(x, yy), () => { paused = false; go('levels'); }, C);
  }
  if (sceneName !== 'home') navPill('back', PW - 380, y - 25, 118, 50, 'Back', true, storyBack);
  if (!scene.res && sceneName !== 'home') navPill('skip', PW - 252, y - 25, 118, 50, 'Skip', false, SKIP_CB || skipHere);
  iconBtn('hud-music', PW - 52, y, 32, (x, yy) => glyphSound(x, yy), () => audio.toggle(), C);
}

/* ---- things scenes draw in their own corners: on a phone they move into the dock ---- */
const _showGoal = showGoal; showGoal = function (g, t, wide) { if (PDEFER) { PDEFER.push(() => _showGoal(g, t, wide)); return; } _showGoal(g, t, wide); };
const _goalBar = goalBar; goalBar = function (msg, sub, t, col, wide) {
  if (!PORT || !DOCK) { _goalBar(msg, sub, t, col, wide); return; }
  const w = PW - 40, x = 20, lines = wrapLines(ctx, msg, w - 120, 28, 700), sl = sub ? wrapLines(ctx, sub, w - 120, 21, 600).slice(0, 2) : [];
  const h = 30 + lines.length * 34 + sl.length * 27;
  dockItem(h, y => {
    rr(ctx, x, y + 6, w, h, 18); fillP(ctx, '#bfa98a'); rr(ctx, x, y, w, h, 18); fillP(ctx, XC.cream);
    const tb = col === '#2f9a5e' || col === '#7b5aa8' ? XC.fir : XC.red; ctx.save(); rr(ctx, x, y, 72, h, 18); ctx.clip(); ctx.fillStyle = tb; ctx.fillRect(x, y, 72, h); ctx.restore(); const p = 1 + .06 * Math.sin(t * 5); ctx.save(); ctx.translate(x + 36, y + h / 2); ctx.scale(p, p); xIcon(tb === XC.red ? 'starburst' : 'snowflake', 0, 0, 52, tb); ctx.restore();
    lines.forEach((ln, i) => text(ctx, ln, x + 90, y + 32 + i * 34, { size: 28, align: 'left', color: '#3b2f2a', weight: 700 }));
    sl.forEach((ln, i) => text(ctx, ln, x + 90, y + 32 + lines.length * 34 + i * 27 - 4, { size: 21, align: 'left', color: '#7a5a4e', weight: 600 }));
  });
};
const _hintPill = hintPill; hintPill = function (msg, y) {
  if (PDEFER) { const lines = wrapLines(ctx, msg, PW - 90, 23, 600), h = 22 + lines.length * 30; dockItem(h, y => { rr(ctx, 24, y, PW - 48, h, 26); fillP(ctx, 'rgba(255,250,240,.92)'); lines.forEach((ln, i) => text(ctx, ln, PW / 2, y + 26 + i * 30, { size: 23, color: '#5a3a30', weight: 600 })); }); return; }
  _hintPill(msg, y);
};
const _scoreCard = scoreCard; scoreCard = function (x, y, t, goal) {
  if (PDEFER) { GAME.shown += (GAME.pts - GAME.shown) * .18; if (Math.abs(GAME.pts - GAME.shown) < 1) GAME.shown = GAME.pts; dockStat('Score', Math.round(GAME.shown)); return; }
  _scoreCard(x, y, t, goal);
};
const _controlsCard = controlsCard; controlsCard = function (...a) { if (PORT) return; _controlsCard(...a); };
const _arcSide = arcSide; arcSide = function (id, t, rows, stats, mood) { if (PDEFER) { stats.forEach(([l, v]) => dockStat(l, v)); return; } _arcSide(id, t, rows, stats, mood); };
const _doneCard = doneCard; doneCard = function (...a) { if (PDEFER) { deferLate(() => overlay(() => _doneCard(...a), 780)); return; } _doneCard(...a); };
const _skipBtn = skipBtn; skipBtn = function (cb) { if (PORT) { SKIP_CB = cb; skipShown = true; return; } _skipBtn(cb); };
const _drawToast = drawToast; drawToast = function () {
  if (!PORT) { _drawToast(); return; }
  ctx.save(); ctx.translate(PW / 2 - W / 2, SAFE_T + TOPBAR - 20); ctx.translate(W / 2, 0); const u = Math.min(1, (PW - 30) / 760); ctx.scale(u, u); ctx.translate(-W / 2, 0); _drawToast(); ctx.restore();
};

/* ======================= upright menus ======================= */
function vpBackdrop(t, top, bot) {
  const V = vpXf(); ctx.save(); ctx.setTransform(K, 0, 0, K, 0, 0); const g = ctx.createLinearGradient(0, 0, 0, PH); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(0, 0, PW, PH); ctx.restore();
  ctx.save(); ctx.globalAlpha = .07; for (let r = 0; r < 12; r++) for (let c = 0; c < 6; c++) { const x = 40 + c * 140 + (r % 2) * 70, y = 150 + r * 120 + Math.sin(t * .4 + c) * 6; if ((r + c) % 2) drawPaw(ctx, x, y, 1.5, '#fff'); else snowflake(ctx, x, y, 20, '#fff'); } ctx.restore();
  for (let i = 0; i < 17; i++) bulb(ctx, 10 + i * 46, TOPBAR + 12 + Math.sin(i * 1.3) * 8, LIGHT_COLS[i % 5], .5 + .5 * Math.sin(t * 3 + i), .8);
  drawSnow(ctx, 0, 0, VPW, VPH, t, 30, .7);
}
SCENES.levels.drawP = function () {
  const t = this.t; vpBackdrop(t, '#2d2523', '#1e1517');
  xBanner('Jump to any section', VPW / 2, 182, 560);
  const X0 = 30, CW = 340, GAP = 20, RH = 70;
  capsTitle('The story', X0, 240, { align: 'left', size: 22 });
  JUMP_STORY.forEach((S, i) => {
    const c = i % 2, r = Math.floor(i / 2), x = X0 + c * (CW + GAP), y = 262 + r * (RH + 14), k = E.back((t - i * .04) / .45); if (k <= 0) return;
    const done = save.story > S.at || (save.finished && S.at < 9), here = save.story === S.at;
    jumpPill('js-' + i, x, y, CW, RH, k, () => {
      circ(ctx, x + 38, y + RH / 2, 21); fillP(ctx, '#c8453b'); text(ctx, String(i + 1), x + 38, y + RH / 2 + 1, { size: 21, color: '#fff', weight: 700 });
      text(ctx, S.name, x + 70, y + RH / 2 + 1, { size: S.name.length > 15 ? 21 : 24, color: '#3b2f2a', weight: 700, align: 'left' });
      if (here) { rr(ctx, x + CW - 84, y + RH / 2 - 14, 72, 28, 14); fillP(ctx, '#2f9a5e'); text(ctx, 'Up to', x + CW - 48, y + RH / 2 + 1, { size: 15, color: '#fff', weight: 700 }); } else if (done) jumpTick(x + CW - 30, y + RH / 2);
    }, () => storyGo(S.at));
  });
  const ay = 262 + 5 * (RH + 14) + 40; capsTitle("Mona's arcade", X0, ay - 16, { align: 'left', size: 22 });
  GAME_IDS.forEach((id, i) => {
    const c = i % 2, r = Math.floor(i / 2), x = X0 + c * (CW + GAP), y = ay + 6 + r * (RH + 14), k = E.back((t - .3 - i * .05) / .45), g = GAMES[id]; if (k <= 0) return;
    jumpPill('ja-' + id, x, y, CW, RH, k, () => {
      circ(ctx, x + 38, y + RH / 2, 21); fillP(ctx, g.col); drawStarShape(ctx, x + 38, y + RH / 2 + 1, 11, '#fff', 0);
      text(ctx, gname(id), x + 70, y + RH / 2 - (g.toggle ? 9 : 0), { size: 22, color: '#3b2f2a', weight: 700, align: 'left' });
      if (g.toggle) text(ctx, modeOf(id) === 'mona' ? 'Mona-fied' : 'Classic 1980s', x + 70, y + RH / 2 + 16, { size: 15, color: '#9a7a6a', weight: 600, align: 'left' });
    }, () => go(id));
  });
  const by = ay + 6 + 4 * (RH + 14) + 30;
  btn('lv-cont', 60, by, 640, 84, save.story > 0 ? 'Carry on the story' : 'Start the story', () => storyResume(), { color: '#2f9a5e', size: 30 });
  btn('lv-arcade', 130, by + 104, 500, 70, 'Arcade gallery', () => go('arcade'), { color: '#7b5aa8', size: 26, theme: 'arcade' });
};
SCENES.arcade.drawP = function () {
  const t = this.t, story = inStory(); vpBackdrop(t, '#2a1846', '#0d1a33');
  for (let i = 0; i < 10; i++) glowAt(ctx, (i * 211) % VPW, 200 + (i * 131) % 1100, 70, ['255,90,80', '255,210,90', '90,220,140', '110,160,255', '255,130,210'][i % 5], .12 + .06 * Math.sin(t * 1.3 + i));
  xBanner(story ? 'Arcade break!' : "Mona's Arcade", VPW / 2, 182, 470);
  const CW = 345, CH = 236, GAP = 18;
  GAME_IDS.forEach((id, i) => {
    const c = i % 2, r = Math.floor(i / 2), x = 26 + c * (CW + GAP) + (i === 6 ? (CW + GAP) / 2 : 0), y = 262 + r * (CH + 16);
    const k = E.back((t - .1 - i * .07) / .5), G = GAMES[id], m = modeOf(id), tl = tiltOf('cab' + id), jg = jiggle(t, tl.seed); if (k <= 0) return;
    ctx.save(); ctx.translate(x + CW / 2, y + CH / 2); ctx.rotate(tl.rot * .4 + jg.rot * .6); ctx.scale(k * jg.sx, k * jg.sy); ctx.translate(-x - CW / 2, -y - CH / 2);
    UI.button('cab-' + id, x, y, CW, CH - (G.toggle ? 46 : 0), () => {
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10; rr(ctx, x, y, CW, CH, 22); fillP(ctx, '#2a2236'); ctx.restore();
      const tc = m === 'mona' ? [XC.red, XC.fir, XC.pine][i % 3] : '#2a3fa8'; rr(ctx, x + 5, y + 5, CW - 10, CH - 10, 19); fillP(ctx, tc);
      ctx.save(); rr(ctx, x + 5, y + 5, CW - 10, CH - 10, 19); ctx.clip(); xStrip(x + 5, y + 5, CW - 10, 16, i * 2 + 1); ctx.restore();
      text(ctx, G[m], x + CW / 2, y + 46, { size: 30, color: XC.snow, display: true });
      rr(ctx, x + 14, y + 64, CW - 28, CH - (G.toggle ? 128 : 80), 10); fillP(ctx, '#05040a');
      drawPreview(id, m, x + 18, y + 68, CW - 36, CH - (G.toggle ? 136 : 88), t + i * 1.7);
      if (save.played && save.played[id]) { ctx.save(); ctx.translate(x + CW - 30, y + 26); ctx.rotate(.25); rr(ctx, -42, -13, 84, 26, 13); fillP(ctx, '#ffd34d'); text(ctx, 'Played ✓', 0, 1, { size: 14, color: '#5a3a10', weight: 700 }); ctx.restore(); }
    }, () => { save.played[id] = true; persist(); go(id, { story }); });
    if (G.toggle) modeToggle('cab-mode-' + id, x + 30, y + CH - 56, CW - 60, id);
    ctx.restore();
  });
  const by = 262 + 4 * (CH + 16) + 6;
  btn(story ? 'arc-on' : 'arc-back', 120, by, 520, 80, story || save.story > 0 ? 'On with the story' : 'Start the story', () => story ? storyNext() : onWithStory(), { color: '#2f9a5e', size: 30 });
  if (this.flash > 0) { ctx.fillStyle = 'rgba(255,255,255,' + E.inOut(this.flash) + ')'; fullFill(); }
};
SCENES.dress.drawP = function () {
  const t = this.t;
  ctx.save(); ctx.translate(VPW / 2 - 380, 0); ctx.drawImage(cached('dress-bg', LIV.w, H, g => drawLiving(g, 'evening')), -300, -60, LIV.w * 1.6, H * 1.6); ctx.restore();
  ctx.fillStyle = 'rgba(40,20,30,.55)'; ctx.fillRect(-400, -400, VPW + 800, VPH + 800);
  xTitle('Dress Mona!', VPW / 2, 196, 64, { seed: 5 });
  text(ctx, 'Pick any outfit. Change it any time.', VPW / 2, 226, { size: 23, color: '#ffe9c8', weight: 600 });
  const mx = VPW / 2, my = 560; this.pM = { x: mx, y: my - 160 };
  glowAt(ctx, mx, my - 100, 260, '255,214,150', .35, .55); ell(ctx, mx, my, 170, 34); fillP(ctx, 'rgba(255,240,220,.18)');
  const k = 1 + .14 * Math.exp(-this.pop * 6) * Math.sin(this.pop * 32);
  ctx.save(); ctx.translate(mx, my); ctx.scale(k, 2 - k); drawMona(ctx, 0, 0, 2, { pose: this.celebrate > 0 ? 'celebrate' : 'sit', t, outfit: curOutfit(), eyes: this.pop < 1.2 ? 'happy' : undefined }); ctx.restore();
  const cur = OUTFITS.find(o => o.id === curOutfit()); text(ctx, cur ? cur.name : '', mx, my + 50, { size: 30, color: '#fff3c4', weight: 700, stroke: 'rgba(43,29,26,.5)', sw: 7 });
  const TW = 222, TH = 196, G2 = 16;
  OUTFITS.forEach((o, i) => {
    const c = i % 3, r = Math.floor(i / 3), x = VPW / 2 - (3 * TW + 2 * G2) / 2 + c * (TW + G2), y = 640 + r * (TH + G2), sel = curOutfit() === o.id, ki = E.back((t - i * .04) / .45); if (ki <= 0) return;
    ctx.save(); ctx.translate(x + TW / 2, y + TH / 2); ctx.scale(ki, ki); ctx.translate(-x - TW / 2, -y - TH / 2);
    UI.button('of-' + o.id, x, y, TW, TH, () => {
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.3)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6; rr(ctx, x, y, TW, TH, 24); fillP(ctx, sel ? '#fff3c4' : '#fffaf0'); ctx.restore();
      if (sel) { rr(ctx, x + 4, y + 4, TW - 8, TH - 8, 21); strokeP(ctx, '#d99a2a', 5); }
      drawMonaHead(ctx, x + TW / 2, y + 88, 1.05, { t, outfit: o.id, eyes: sel ? 'happy' : undefined });
      text(ctx, o.name, x + TW / 2, y + TH - 24, { size: o.name.length > 14 ? 19 : 22, color: '#3b2f2a', weight: 600 });
    }, () => { save.outfit = o.id; persist(); this.pop = 0; audio.sfx('jingle'); audio.sfx('meow', .8); spawn('sparkle', mx, my - 180, 18); });
    ctx.restore();
  });
  const by = 640 + 3 * (TH + G2) + 14;
  if (inStory()) btn('dress-go', 160, by, 440, 88, "Let's go!  ›", () => storyNext(), { color: '#2f9a5e', size: 38 });
  else btn('dress-done', 160, by, 440, 88, 'Done', () => go('home'), { color: '#2f9a5e', size: 38 });
};
{ const _tap = SCENES.dress.tap; SCENES.dress.tap = function (x, y) { if (PORT && this.pM) { if (dist(x, y, this.pM.x, this.pM.y) < 170) { this.celebrate = 1.6; audio.sfx('meow', 1.1); audio.sfx('bugle'); spawn('confetti', this.pM.x, this.pM.y - 100, 30); } return; } _tap.call(this, x, y); }; }
SCENES.splash.drawP = function () {
  const t = this.t; vpBackdrop(t, '#b8332d', '#4a1512');
  const k = E.back(t / .6); ctx.save(); ctx.translate(VPW / 2, 700); ctx.scale(.85 + .15 * k, .85 + .15 * k); ctx.globalAlpha = clamp(t / .3, 0, 1); ctx.translate(-VPW / 2, -700);
  ctx.save(); ctx.shadowColor = 'rgba(30,5,5,.45)'; ctx.shadowBlur = 34; ctx.shadowOffsetY = 12; rr(ctx, 30, 170, 700, 960, 40); fillP(ctx, '#fff8ec'); ctx.restore();
  candyBorder(ctx, 46, 186, 668, 928, 30, t); drawHolly(ctx, 56, 196, 1, -.6); drawHolly(ctx, 704, 196, 1, .6);
  drawGarland(ctx, 70, 690, 232, 16); drawLights(ctx, garlandLights(70, 690, 232, 16), t, 1);
  xTitle("It's Christmas week!", VPW / 2, 316, 64, { maxW: 600, seed: 3 });
  para(ctx, 'Samantha is out at Grocery Outlet. Mona has a secret: a cat rave. Help her get away with it!', VPW / 2, 384, 600, { size: 26, color: '#5a4a42', weight: 500, lh: 36 });
  SPLASH_ROWS.forEach(([ic, str], i) => {
    const y = 520 + i * 108; ctx.save(); ctx.translate(110, y);
    if (ic === 'heart') drawHeart(ctx, 0, 4, 2.3, '#e2443b'); else if (ic === 'fish') requestBubble(ctx, 0, -2, 'food', null, t); else if (ic === 'paw') drawPaw(ctx, 0, 0, 1.9, '#8a5a3a'); else { circ(ctx, 0, 0, 28); ink(ctx, '#f3ebe0', 2.4); glyphHome(0, 0); }
    ctx.restore(); para(ctx, str, 430, y - (wrapLines(ctx, str, 520, 25, 600).length - 1) * 15, 520, { size: 25, color: '#3b2f2a', weight: 600, lh: 31 });
  });
  const m = this.m; drawMona(ctx, VPW / 2 + Math.sin(t * .5) * 160, 1060, .9, { pose: 'walk', face: Math.cos(t * .5) > 0 ? 1 : -1, gait: t * 6, t, outfit: curOutfit() === 'none' ? 'santa' : curOutfit() });
  ctx.restore();
  if (t > .5) btn('go', 160, 1170, 440, 96, "Let's go!", () => { save.seenIntro = true; persist(); if (inStory()) storyNext(); else go('home'); }, { color: '#2f9a5e', size: 42 });
};
/* home: the room in the middle, the sign above, the big present buttons below */
SCENES.home.pband = true;
function homeOverlayP(sc, t) {
  const V = vpXf(); ctx.save(); ctx.translate(V.ox, V.oy); ctx.scale(V.u, V.u);
  ctx.save(); ctx.translate(VPW / 2 - W / 2, 120); ctx.translate(W / 2, 0); ctx.scale(1.02, 1.02); ctx.translate(-W / 2, 0); sc.drawSign(t); ctx.restore();
  ctx.restore();
}
function homeButtonsP(sc, t) {
  const V = vpXf(); ctx.save(); ctx.translate(V.ox, PH - SAFE_B - 360 * V.u); ctx.scale(V.u, V.u);
  const bk = E.back((sc.t - .3) / .6); if (bk <= 0) { ctx.restore(); return; }
  const resume = save.story > 0 && save.story < STORY.length - 1, bounce = 1 + .04 * Math.sin(t * 4);
  if (resume) text(ctx, 'Up to: ' + (STORY_TITLES[STORY[save.story]] || ''), VPW / 2, 6, { size: 22, color: '#fff8ec', weight: 700, stroke: 'rgba(90,30,20,.55)', sw: 6 });
  ctx.save(); ctx.translate(VPW / 2, 90); ctx.scale(bk * bounce, bk * bounce); ctx.translate(-VPW / 2, -90);
  UI.button('play', VPW / 2 - 220, 30, 440, 120, () => {
    ctx.save(); ctx.shadowColor = 'rgba(40,10,5,.4)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8; rr(ctx, VPW / 2 - 210, 40, 420, 104, 22); fillP(ctx, '#e2332e'); ctx.restore();
    rr(ctx, VPW / 2 - 210, 40, 420, 104, 22); ink(ctx, rad(ctx, VPW / 2, 66, 220, '#e2332e'), 3.5);
    ctx.fillStyle = '#ffd34d'; ctx.fillRect(VPW / 2 - 14, 42, 28, 100); ctx.fillRect(VPW / 2 - 208, 80, 416, 22); drawBow(ctx, VPW / 2, 38, 1.1);
    text(ctx, resume ? 'CONTINUE' : 'PLAY!', VPW / 2, 94, { size: resume ? 42 : 54, color: '#fff', weight: 700, stroke: '#9a1f1a', sw: 8 });
  }, () => storyGo(resume ? save.story : 0));
  ctx.restore();
  btn('levels', 40, 190, 330, 76, 'Sections', () => go('levels'), { color: '#2f9a5e', size: 30 });
  btn('wardrobe', 390, 190, 330, 76, 'Dress Mona', () => go('dress'), { color: '#d99a2a', size: 30 });
  if (resume) btn('startover', VPW / 2 - 120, 282, 240, 50, 'Start again', () => storyGo(0), { color: 'rgba(80,40,30,.7)', size: 21 });
  ctx.restore();
}
SCENES.home.dockP = function () { homeButtonsP(this, this.t); };

/* ---- the TV remote lives in the dock on a phone, right under her thumb ---- */
function remoteDockXY(sc) { const y0 = DOCK ? DOCK.y : PH - 500, h = PH - SAFE_B - y0 - 10, s = clamp(h / 560, .5, .82); return { x: PW / 2, y: y0 + h / 2 + 20, s, h }; }

/* ---- the frame: hand drawing over to renderFrame ---- */

/* ---- sharper pictures: cached backgrounds are rendered at the size they will actually appear on the phone
   (scenes are scaled up to fill it), capped so no single picture is too big for the iPhone's memory ---- */
function cacheRes(w, h) { const want = K * (PORT ? 1.8 : 1); return Math.max(.5, Math.min(want, Math.sqrt(9e6 / (w * h)))); }
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => cacheStore.clear());
/* ---- speech bubbles: on a phone they are drawn at full reading size, wherever the character is ---- */
const _speech = speech;
speech = function (g, msg, x, y, t0, t, maxW) {
  if (!PDEFER || g !== ctx) { _speech(g, msg, x, y, t0, t, maxW); return; }
  const m = ctx.getTransform(), px = (m.a * x + m.c * y + m.e) / K, py = (m.b * x + m.d * y + m.f) / K;
  PDEFER.push(() => {
    const mw = Math.min(PW - 60, Math.max(300, (maxW || 300) * 1.15));
    ctx.save(); ctx.font = '600 26px ' + FONT; ctx.restore();
    _speech(ctx, msg, clamp(px, mw / 2 + 24, PW - mw / 2 - 24), clamp(py, SAFE_T + TOPBAR + 150, PH - 260), t0, t, mw);
  });
};

/* ======================= on-screen touch controls for the arcade games =======================
   Big buttons under her thumbs, in the space below the game. They work with several fingers at once
   (hold right and tap jump), repeat while held where that helps, and the game itself still takes taps and swipes. */
let PAD_BTNS = [];
const PAD_HELD = new Map();   // pointerId -> button
function padLayout(id, A) {
  const B = (k, x, y, w, h, g, o) => Object.assign({ k, x, y, w, h, g }, o || {});
  const cx = A.x + A.w / 2, cy = A.y + A.h / 2;
  if (id === 'pac') { const s = Math.min(A.h / 3, 130); return [B('up', cx - s / 2, cy - s * 1.5, s, s, 'up'), B('down', cx - s / 2, cy + s * .5, s, s, 'down'), B('left', cx - s * 1.5, cy - s / 2, s, s, 'left'), B('right', cx + s * .5, cy - s / 2, s, s, 'right')]; }
  const h = Math.min(A.h, 170), y = cy - h / 2;
  if (id === 'tetris') { const w = (A.w - 36) / 4; return [B('left', A.x, y, w, h, 'left', { rep: 1 }), B('up', A.x + (w + 12), y, w, h, 'rotate'), B('right', A.x + 2 * (w + 12), y, w, h, 'right', { rep: 1 }), B('space', A.x + 3 * (w + 12), y, w, h, 'drop')]; }
  if (id === 'plat') { const w = (A.w - 24) / 3; return [B('left', A.x, y, w, h, 'left', { hold: 1 }), B('right', A.x + w + 12, y, w, h, 'right', { hold: 1 }), B('up', A.x + 2 * (w + 12), y, w, h, 'jump', { hold: 1, col: '#2f9a5e' })]; }
  if (id === 'run') { const w = (A.w - 12) / 2; return [B('down', A.x, y, w, h, 'slide', { col: '#4a8cf0' }), B('up', A.x + w + 12, y, w, h, 'jump', { col: '#2f9a5e' })]; }
  if (id === 'kart') { const w = (A.w - 12) / 2; return [B('left', A.x, y, w, h, 'left', { hold: 1 }), B('right', A.x + w + 12, y, w, h, 'right', { hold: 1 })]; }
  if (id === 'pong') { const w = (A.w - 12) / 2; return [B('up', A.x, y, w, h, 'left', { hold: 1 }), B('down', A.x + w + 12, y, w, h, 'right', { hold: 1 })]; }
  return null;
}
function padGlyph(g, x, y, s, col) {
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 9 * s; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const arrow = a => { ctx.save(); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(-14 * s, -22 * s); ctx.lineTo(12 * s, 0); ctx.lineTo(-14 * s, 22 * s); ctx.stroke(); ctx.restore(); };
  if (g === 'right') arrow(0); else if (g === 'left') arrow(Math.PI); else if (g === 'up') arrow(-PI2); else if (g === 'down') arrow(PI2);
  else if (g === 'rotate') { ctx.beginPath(); ctx.arc(0, 0, 20 * s, -2.6, 1.9); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-26 * s, -26 * s); ctx.lineTo(-14 * s, -12 * s); ctx.lineTo(-2 * s, -28 * s); ctx.stroke(); }
  else if (g === 'drop') { ctx.beginPath(); ctx.moveTo(0, -24 * s); ctx.lineTo(0, 16 * s); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-16 * s, 2 * s); ctx.lineTo(0, 18 * s); ctx.lineTo(16 * s, 2 * s); ctx.stroke(); ctx.fillRect(-20 * s, 26 * s, 40 * s, 6 * s); }
  else if (g === 'jump' || g === 'slide') { const up = g === 'jump'; ctx.save(); if (!up) ctx.rotate(Math.PI); ctx.beginPath(); ctx.moveTo(-18 * s, 8 * s); ctx.lineTo(0, -12 * s); ctx.lineTo(18 * s, 8 * s); ctx.stroke(); ctx.restore(); text(ctx, up ? 'JUMP' : 'SLIDE', 0, up ? 30 * s : -30 * s, { size: 20 * s, color: col, weight: 700 }); }
  ctx.restore();
}
function drawPad() {
  PAD_BTNS = [];
  if (!PORT || !DOCK || !GAMES[sceneName] || sceneName === 'fight' || scene.res || scene.over || howCard || paused) return false;
  const y0 = DOCK.y + 4, A = { x: 28, y: y0, w: PW - 56, h: PH - SAFE_B - 20 - y0 }; if (A.h < 100) return false;
  const L = padLayout(sceneName, A); if (!L) return false;
  PAD_BTNS = L;
  for (const b of L) {
    const on = [...PAD_HELD.values()].includes(b), P = { face: '#fff8ec', base: b.col ? shade(b.col, -.25) : '#a8322a', ink: b.col || '#c8453b', edge: b.col ? shade(b.col, -.35) : '#7e1620' };
    ctx.save();
    const dy = toyFace(b.x, b.y, b.w, b.h - 12, P, on, 'pad');
    padGlyph(b.g, b.x + b.w / 2, b.y + dy + (b.h - 12) / 2 - (b.g === 'jump' ? 12 : b.g === 'slide' ? -12 : 0), Math.min(1.6, Math.min(b.w, b.h) / 100), b.col || '#c8453b');
    ctx.restore();
  }
  return true;
}
function padHit(e) { const d = devPt(e), x = d.x / K, y = d.y / K; return PAD_BTNS.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h); }
function padPress(b) {
  if (!scene || !scene.key) return; audio.sfx('tick'); scene.key(b.k);
  if (b.rep) { b._rt = setTimeout(function rep() { if ([...PAD_HELD.values()].includes(b) && scene.key) { scene.key(b.k); b._rt = setTimeout(rep, 90); } }, 260); }
}
function padRelease(b) { clearTimeout(b._rt); if (b.hold && scene && scene.keyUp) scene.keyUp(b.k); }
window.addEventListener('pointerdown', e => { if (!PORT || !PAD_BTNS.length) return; const b = padHit(e); if (!b) return; e.stopPropagation(); e.preventDefault(); PAD_HELD.set(e.pointerId, b); padPress(b); }, true);
window.addEventListener('pointermove', e => { if (PAD_HELD.has(e.pointerId)) e.stopPropagation(); }, true);
const padEnd = e => { const b = PAD_HELD.get(e.pointerId); if (!b) return; e.stopPropagation(); PAD_HELD.delete(e.pointerId); if (![...PAD_HELD.values()].includes(b)) padRelease(b); };
window.addEventListener('pointerup', padEnd, true); window.addEventListener('pointercancel', padEnd, true);

/* ---- brighter, richer colour throughout: every scene's lighting is lifted (night stays night, just not murky),
   coloured light glows a little stronger, and scaled pictures are smoothed at the highest quality ---- */
const _lightMap = lightMap;
lightMap = function (amb, lights) {
  const p = String(amb).split(','); if (p.length === 4) p[3] = String(+(parseFloat(p[3]) * .6).toFixed(3));
  _lightMap(p.join(','), lights.map(L => Object.assign({}, L, { ca: (L.ca == null ? .16 : L.ca) * 1.3 })));
};

/* ---- no borders: carry the scene's own edge colours out into any spare space ----
   The edge of the scene is shrunk to a few pixels and stretched back out, which blurs it into a soft wash. */
function ambCanvas() { if (!AMB) { AMB = document.createElement('canvas'); AMB.width = 32; AMB.height = 32; } return AMB; }
function ambientSides() {
  if (LOX <= .5 && LOY <= .5) return;
  const c = ambCanvas(), g = c.getContext('2d'), x0 = LOX * K, y0 = LOY * K, w = W * K, h = H * K;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = true;
  if (LOX > .5) {
    const sw = Math.max(2, 140 * K);
    for (const side of [0, 1]) {
      g.clearRect(0, 0, 32, 32); g.drawImage(cv, side ? x0 + w - sw : x0, y0, sw, h, 0, 0, 4, 12);
      const dx = side ? x0 + w : 0, dw = x0 + 1;
      ctx.drawImage(c, side ? 3 : 0, 0, 1, 12, side ? dx - 1 : 0, y0, dw, h);
      const gr = ctx.createLinearGradient(side ? dx : dx + dw, 0, side ? dx + dw : dx, 0); gr.addColorStop(0, 'rgba(20,12,14,0)'); gr.addColorStop(1, 'rgba(20,12,14,.38)'); ctx.fillStyle = gr; ctx.fillRect(dx - 1, y0, dw + 1, h);
    }
  }
  if (LOY > .5) {
    const sh = Math.max(2, 120 * K);
    for (const side of [0, 1]) {
      g.clearRect(0, 0, 32, 32); g.drawImage(cv, 0, side ? y0 + h - sh : y0, cv.width, sh, 0, 0, 32, 4);
      const dy = side ? y0 + h : 0, dh = y0 + 1;
      ctx.drawImage(c, 0, side ? 3 : 0, 32, 1, 0, side ? dy - 1 : 0, cv.width, dh);
    }
  }
  ctx.restore();
}
function ambientPortrait(top0, top, bh) {
  const c = ambCanvas(), g = c.getContext('2d'), Kk = K, sh = Math.max(2, 90 * Kk);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = true;
  const bandT = top * Kk, bandB = (top + bh) * Kk, t0 = top0 * Kk;
  if (bandT - t0 > 1) { // above the scene, up to the top bar
    g.clearRect(0, 0, 32, 32); g.drawImage(cv, 0, bandT, cv.width, sh, 0, 0, 12, 4);
    ctx.drawImage(c, 0, 0, 12, 1, 0, t0, cv.width, bandT - t0 + 1);
    const gr = ctx.createLinearGradient(0, bandT, 0, t0); gr.addColorStop(0, 'rgba(20,12,14,0)'); gr.addColorStop(1, 'rgba(20,12,14,.35)'); ctx.fillStyle = gr; ctx.fillRect(0, t0, cv.width, bandT - t0 + 1);
  }
  if (cv.height - bandB > 1) { // below the scene, all the way to the bottom of the phone
    g.clearRect(0, 0, 32, 32); g.drawImage(cv, 0, bandB - sh, cv.width, sh, 0, 0, 12, 4);
    ctx.drawImage(c, 0, 3, 12, 1, 0, bandB - 1, cv.width, cv.height - bandB + 1);
    const gr = ctx.createLinearGradient(0, bandB, 0, cv.height); gr.addColorStop(0, 'rgba(20,12,14,.05)'); gr.addColorStop(1, 'rgba(20,12,14,.5)'); ctx.fillStyle = gr; ctx.fillRect(0, bandB - 1, cv.width, cv.height - bandB + 1);
  }
  ctx.restore();
}
