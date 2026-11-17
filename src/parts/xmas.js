/* ============ v5 CHRISTMAS DESIGN: flat geometric tiles ============
   Inspired by mid-century Christmas pattern tiles: cream, deep pine green, bright pine, cranberry red,
   snow white and a little gold. Flat colour, bold simple shapes, no gloss. Used for buttons, panels,
   menus, the top bar, the bottom panel and the arcade cabinets. */
const XC = { cream: '#ecdfca', pine: '#1d3b31', fir: '#2b5e47', red: '#b23a3a', snow: '#fbf6ee', gold: '#e8c77a', ink: '#24170f' };
const TILE_BG = [XC.cream, XC.pine, XC.red, XC.pine, XC.red, XC.cream, XC.cream, XC.fir, XC.red, XC.fir, XC.cream, XC.pine, XC.cream, XC.fir, XC.cream];
const TILE_KIND = ['wreathStripe', 'santa', 'starburst', 'tree', 'wreath', 'stripes', 'poinsettia', 'ornament', 'snowflake', 'gift', 'sparkles', 'candy', 'triangles', 'bell', 'dots'];
/* one geometric Christmas icon, centred at (x, y), about s units across, on a tile of colour bg */
function xIcon(kind, x, y, s, bg, G) {
  const g = G || ctx, light = bg === XC.cream || bg === XC.snow, fg = light ? XC.pine : XC.snow, ac = bg === XC.red ? XC.pine : XC.red, u = s / 100;
  g.save(); g.translate(x, y); g.scale(u, u); g.lineCap = 'round'; g.lineJoin = 'round';
  const C = (cx, cy, r, c) => { g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fillStyle = c; g.fill(); };
  if (kind === 'wreathStripe') { g.save(); g.beginPath(); g.arc(0, 4, 32, 0, TAU); g.arc(0, 4, 18, 0, TAU, true); g.clip(); for (let i = -40; i < 44; i += 10) { g.fillStyle = i % 20 ? fg : 'transparent'; if (i % 20) g.fillRect(-40, i, 80, 5.5); } g.restore(); g.strokeStyle = ac; g.lineWidth = 4; g.beginPath(); g.ellipse(-7, -32, 7, 5, -.4, 0, TAU); g.ellipse(7, -32, 7, 5, .4, 0, TAU); g.stroke(); }
  else if (kind === 'santa') { g.fillStyle = ac === XC.pine ? XC.snow : XC.red; g.beginPath(); g.moveTo(-20, -6); g.lineTo(0, -36); g.lineTo(20, -6); g.fill(); C(0, -38, 6, XC.snow); g.fillStyle = XC.snow; g.fillRect(-24, -8, 48, 9); [[-16, 14], [0, 20], [16, 14], [-20, 4], [20, 4]].forEach(([a, b]) => C(a, b, 11, XC.snow)); g.fillStyle = XC.cream; g.fillRect(-9, 2, 18, 8); }
  else if (kind === 'starburst') { g.strokeStyle = fg; g.lineWidth = 6; for (let i = 0; i < 4; i++) { g.save(); g.rotate(i * Math.PI / 4); g.beginPath(); g.moveTo(0, -34); g.lineTo(0, 34); g.stroke(); g.restore(); } }
  else if (kind === 'tree') { g.fillStyle = ac; g.beginPath(); g.moveTo(-32, 26); g.lineTo(32, 26); [[24, 14], [14, 2], [8, -10], [0, -18]].forEach(([w2, yy]) => { g.lineTo(w2, yy); }); [[-8, -10], [-14, 2], [-24, 14]].forEach(([w2, yy]) => g.lineTo(w2, yy)); g.closePath(); g.fill(); drawStarShape(g, 0, -24, 9, XC.gold, 0); }
  else if (kind === 'wreath') { for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; C(Math.cos(a) * 24, Math.sin(a) * 24, 12, fg === XC.snow ? XC.pine : fg); } C(0, 0, 13, bg); }
  else if (kind === 'stripes') { for (let i = 0; i < 5; i++) { g.fillStyle = i % 2 ? XC.red : XC.pine; g.fillRect(-30, -24 + i * 11, 60, 6); } }
  else if (kind === 'poinsettia') { g.fillStyle = XC.red; for (let i = 0; i < 4; i++) { g.save(); g.rotate(i * Math.PI / 2 + Math.PI / 4); g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-16, -14, -12, -34, 0, -34); g.bezierCurveTo(12, -34, 16, -14, 0, 0); g.fill(); g.restore(); } }
  else if (kind === 'ornament') { C(0, -4, 22, XC.snow); g.fillStyle = XC.red; g.beginPath(); g.roundRect ? g.roundRect(-18, 12, 36, 10, 5) : g.rect(-18, 12, 36, 10); g.fill(); g.fillRect(-4, 12, 9, 22); }
  else if (kind === 'snowflake') { g.strokeStyle = fg; g.lineWidth = 2.5; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * 28, Math.sin(a) * 28); g.stroke(); C(Math.cos(a) * 28, Math.sin(a) * 28, 6, fg); } C(0, 0, 4, fg); }
  else if (kind === 'gift') { g.fillStyle = XC.red; g.fillRect(-22, -12, 44, 40); g.strokeStyle = XC.snow; g.lineWidth = 5; g.beginPath(); g.ellipse(-8, -18, 8, 6, 0, 0, TAU); g.ellipse(8, -18, 8, 6, 0, 0, TAU); g.stroke(); }
  else if (kind === 'sparkles') { g.fillStyle = XC.fir; [[-15, -15], [15, -15], [-15, 15], [15, 15]].forEach(([a, b]) => { g.beginPath(); g.moveTo(a, b - 15); g.quadraticCurveTo(a, b, a + 15, b); g.quadraticCurveTo(a, b, a, b + 15); g.quadraticCurveTo(a, b, a - 15, b); g.quadraticCurveTo(a, b, a, b - 15); g.fill(); }); }
  else if (kind === 'candy') { g.save(); g.lineWidth = 11; g.strokeStyle = XC.snow; g.beginPath(); g.moveTo(8, 32); g.lineTo(8, -14); g.arc(-4, -14, 12, 0, Math.PI, true); g.stroke(); g.setLineDash([5, 7]); g.strokeStyle = XC.red; g.stroke(); g.restore(); }
  else if (kind === 'triangles') { g.fillStyle = XC.pine; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { g.beginPath(); g.moveTo(-30 + c * 20, -14 + r * 18); g.lineTo(-20 + c * 20, -24 + r * 18); g.lineTo(-10 + c * 20, -14 + r * 18); g.fill(); } }
  else if (kind === 'bell') { g.fillStyle = XC.red; g.beginPath(); g.moveTo(-26, 16); g.quadraticCurveTo(-18, 12, -16, -6); g.quadraticCurveTo(-14, -24, 0, -24); g.quadraticCurveTo(14, -24, 16, -6); g.quadraticCurveTo(18, 12, 26, 16); g.closePath(); g.fill(); C(0, 20, 6, XC.snow); g.strokeStyle = XC.red; g.lineWidth = 4; g.beginPath(); g.arc(0, -28, 5, 0, TAU); g.stroke(); }
  else if (kind === 'dots') { for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) C(-21 + c * 14, -21 + r * 14, 3.5, XC.red); }
  else if (kind === 'star') drawStarShape(g, 0, 0, 30, XC.gold, 0);
  g.restore();
}
/* a quilt of tiles over a rectangle */
function xQuilt(x, y, w, h, cell, seed, alpha, G) {
  const ctx = G || window.ctx || cv.getContext('2d');
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); if (alpha != null) ctx.globalAlpha = alpha;
  const cols = Math.ceil(w / cell) + 1, rows = Math.ceil(h / cell) + 1;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = (r * 3 + c * 7 + (seed || 0)) % 15, bg = TILE_BG[i], tx = x + c * cell, ty = y + r * cell; ctx.fillStyle = bg; ctx.fillRect(tx, ty, cell + .5, cell + .5); xIcon(TILE_KIND[i], tx + cell / 2, ty + cell / 2, cell * .78, bg, ctx); }
  ctx.restore();
}
function xQuiltCached(w, h, cell, seed) { return cached('quilt-' + w + 'x' + h + '-' + cell + '-' + seed, w, h, g => xQuilt(0, 0, w, h, cell, seed, null, g)); }
/* a narrow strip of little tiles: used as a festive edge on the bars */
function xStrip(x, y, w, cell, seed) { ctx.drawImage(xQuiltCached(Math.ceil(w), cell, cell, seed || 3), x, y, Math.ceil(w), cell); }

/* ---- flat Christmas buttons: a solid tile with a geometric icon square on the left, a hard offset shadow ---- */
const XBTN = {
  gift: { face: XC.fir, base: XC.pine, ink: XC.snow, chip: XC.cream, icon: 'gift' },
  candy: { face: XC.red, base: '#7e2427', ink: XC.snow, chip: XC.cream, icon: 'tree' },
  arcade: { face: XC.pine, base: '#0f241d', ink: XC.gold, chip: XC.red, icon: 'snowflake' },
  gold: { face: XC.gold, base: '#b8924a', ink: XC.pine, chip: XC.cream, icon: 'bell' },
  tag: { face: XC.cream, base: '#d99da2', ink: XC.red, chip: XC.fir, icon: 'starburst' },
  quiet: { face: '#3a2c2c', base: '#1a1214', ink: XC.snow, chip: null, icon: null }
};
btn = function (id, x, y, w, h, label, cb, o) {
  o = o || {};
  const minH = PORT ? 92 : 66, minW = PORT ? 210 : 150;
  if (h < minH) { y -= (minH - h) / 2; h = minH; } if (w < minW) { x -= (minW - w) / 2; w = minW; }
  const th = btnPal(o)[0], P = XBTN[th] || XBTN.tag, lab = label.replace(/\s*›\s*$/, ''), arrow = /›\s*$/.test(label);
  const now = gameTime, seen = BTN_SEEN[id];
  if (!seen || now - seen.last > .5) BTN_SEEN[id] = { t0: now, last: now }; else seen.last = now;
  const tt = now - BTN_SEEN[id].t0, tl = tiltOf(id), pop = REDUCE_MOTION ? 1 : E.back(clamp(tt * 3.4, 0, 1)), rot = o.straight ? 0 : tl.rot * .3;
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot); ctx.scale(pop, pop); ctx.translate(-x - w / 2, -y - h / 2);
  UI.button(id, x, y - 6, w, h + 18, () => {
    ctx.restore(); ctx.save();
    const down = UI.pressed === id, dp = 8, dy = down ? dp - 2 : 0, r = 18;
    rr(ctx, x, y + dp, w, h, r); fillP(ctx, P.base);
    rr(ctx, x, y + dy, w, h, r); fillP(ctx, P.face);
    let tx0 = x + 20;
    if (P.chip && h >= 56) { const cs = h - 20; rr(ctx, x + 10, y + dy + 10, cs, cs, 12); fillP(ctx, P.chip); xIcon(P.icon, x + 10 + cs / 2, y + dy + 10 + cs / 2, cs * 1.15, P.chip); tx0 = x + 10 + cs; }
    const cx = (tx0 + x + w - (arrow ? 40 : 14)) / 2, cy = y + dy + h / 2 + 2;
    let fs = Math.min(o.size ? Math.max(o.size, PORT ? 32 : 0) : h * .42, h * .48);
    const avail = x + w - (arrow ? 44 : 16) - tx0 - 10; ctx.font = fontFor(fs, 700, { display: true }); while (fs > 14 && ctx.measureText(lab).width > avail) { fs -= 1; ctx.font = fontFor(fs, 700, { display: true }); }
    text(ctx, lab, cx, cy, { size: fs, color: P.ink, display: true });
    if (arrow) { const ax = x + w - 30; ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(ax - 6, cy - 12); ctx.lineTo(ax + 6, cy); ctx.lineTo(ax - 6, cy + 12); strokeP(ctx, P.ink, 6); ctx.restore(); }
  }, cb);
  ctx.restore();
};
iconBtn = function (id, x, y, r, glyph, cb) {
  if (PORT) r = Math.max(r, 40);
  UI.button(id, x - r, y - r, r * 2, r * 2 + 8, () => {
    ctx.restore(); ctx.save();
    const down = UI.pressed === id, dp = 6, dy = down ? dp - 2 : 0;
    rr(ctx, x - r, y - r + dp, r * 2, r * 2, 16); fillP(ctx, '#d99da2');
    rr(ctx, x - r, y - r + dy, r * 2, r * 2, 16); fillP(ctx, XC.cream);
    ctx.save(); ctx.translate(x, y + dy); const k = r / 32; ctx.scale(k, k); glyph(0, 0); ctx.restore();
  }, cb);
};
navPill = function (id, x, y, w, h, label, back, cb) {
  if (PORT) { const H2 = 80; y -= (H2 - h) / 2; h = H2; x -= 6; w += 12; }
  UI.button(id, x, y, w, h + 8, () => {
    ctx.restore(); ctx.save();
    const down = UI.pressed === id, dp = 6, dy = down ? dp - 2 : 0;
    rr(ctx, x, y + dp, w, h, 16); fillP(ctx, '#7e2427'); rr(ctx, x, y + dy, w, h, 16); fillP(ctx, XC.red);
    const cy = y + dy + h / 2 + 1; text(ctx, label, x + w / 2 + (back ? 12 : -12), cy, { size: PORT ? 30 : 22, color: XC.snow, display: true });
    const ax = back ? x + 26 : x + w - 26, d = back ? -1 : 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(ax - d * 5, cy - 10); ctx.lineTo(ax + d * 5, cy); ctx.lineTo(ax - d * 5, cy + 10); strokeP(ctx, XC.snow, 5);
  }, cb);
};
/* top bar: pine green, cream square buttons, a strip of little tiles along the bottom edge */
drawHUDP = function () {
  const y = SAFE_T + 60;
  ctx.fillStyle = XC.pine; ctx.fillRect(0, 0, PW, SAFE_T + TOPBAR);
  xStrip(0, SAFE_T + TOPBAR - 18, PW, 18, 5);
  if (scene.home !== false) {
    iconBtn('hud-home', 54, y, 40, (x, yy) => glyphHouse(x, yy), () => { paused = false; go('home'); });
    iconBtn('hud-pause', 146, y, 40, (x, yy) => glyphBars(x, yy), () => { if (!paused) { paused = true; audio.sfx('click'); } });
    if (sceneName !== 'levels') iconBtn('hud-jump', 238, y, 40, (x, yy) => glyphGrid(x, yy), () => { paused = false; go('levels'); });
  }
  if (sceneName !== 'home') navPill('back', PW - 410, y - 25, 124, 50, 'Back', true, storyBack);
  if (!scene.res && sceneName !== 'home') navPill('skip', PW - 270, y - 25, 124, 50, 'Skip', false, SKIP_CB || skipHere);
  iconBtn('hud-music', PW - 54, y, 40, (x, yy) => glyphSound(x, yy), () => audio.toggle());
};
/* the bottom panel: deep pine with a tile strip along its top edge */
function dockBg(y0) { ctx.fillStyle = XC.pine; ctx.fillRect(0, y0, PW, PH - y0); xStrip(0, y0, PW, 22, 9); if (DOCK) DOCK.y = Math.max(DOCK.y, y0 + 34); }
/* panels (how-to, pause, game over): pine card with a cream inset line and tile corners */
panel = function (x, y, w, h) {
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12; rr(ctx, x, y, w, h, 28); fillP(ctx, XC.pine); ctx.restore();
  rr(ctx, x + 12, y + 12, w - 24, h - 24, 20); strokeP(ctx, 'rgba(236,223,202,.55)', 3);
  ctx.save(); rr(ctx, x, y, w, h, 28); ctx.clip();
  [[x, y, 'starburst', XC.red], [x + w - 64, y, 'snowflake', XC.red], [x, y + h - 64, 'candy', XC.fir], [x + w - 64, y + h - 64, 'gift', XC.fir]].forEach(([tx, ty, k, bg]) => { ctx.fillStyle = bg; ctx.fillRect(tx, ty, 64, 64); xIcon(k, tx + 32, ty + 32, 46, bg); });
  ctx.restore();
};
/* menu pages: the full Christmas quilt behind everything */
vpBackdrop = function (t) {
  ctx.save(); ctx.setTransform(K, 0, 0, K, 0, 0); ctx.drawImage(xQuiltCached(PW, Math.ceil(PH), 152, 0), 0, 0, PW, Math.ceil(PH)); ctx.fillStyle = 'rgba(20,40,32,.42)'; ctx.fillRect(0, 0, PW, PH); ctx.restore();
  drawSnow(ctx, 0, 0, VPW, VPH, t, 26, .6);
};
menuBackdrop = function (t) { ctx.drawImage(xQuiltCached(W, H, 150, 0), 0, 0, W, H); ctx.fillStyle = 'rgba(20,40,32,.42)'; ctx.fillRect(0, 0, W, H); drawSnow(ctx, 0, 0, W, H, t, 30, .6); };
/* a title on a cream ribbon banner, for the menu pages */
function xBanner(msg, x, y, w) { const h = 84; ctx.save(); ctx.fillStyle = '#d99da2'; ctx.fillRect(x - w / 2 - 26, y - h / 2 + 14, 40, h - 8); ctx.fillRect(x + w / 2 - 14, y - h / 2 + 14, 40, h - 8); rr(ctx, x - w / 2, y - h / 2, w, h, 14); fillP(ctx, XC.cream); text(ctx, msg, x, y + 3, { size: 46, color: XC.red, display: true }); ctx.restore(); }

/* flat pressable faces for the thumb pads and any other toy button */
toyFace = function (x, y, w, h, P, down) {
  const dp = 8, dy = down ? dp - 2 : 0;
  rr(ctx, x, y + dp, w, h, 18); fillP(ctx, '#d99da2'); rr(ctx, x, y + dy, w, h, 18); fillP(ctx, down ? '#f6ecd9' : XC.cream);
  rr(ctx, x + 6, y + dy + 6, w - 12, h - 12, 13); strokeP(ctx, P.ink || XC.red, 3);
  return dy;
};
