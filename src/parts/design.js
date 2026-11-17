/* ============ v4 DESIGN PASS: type, buttons, cards ============
   Type: Lilita One for big playful headings, Nunito (heavy weights) for everything you read,
   Press Start 2P for the arcade machines. Buttons: chunky 3D "toy" buttons with a glossy face that
   presses down into its base, sized for thumbs (at least 46pt tall on a phone). */
const F_DISPLAY = '"Lilita One", "Fredoka", "Arial Rounded MT Bold", system-ui, sans-serif';
const F_BODY = '"Nunito", "Fredoka", "Arial Rounded MT Bold", system-ui, sans-serif';
const F_PIXEL = '"Press Start 2P", "Courier New", monospace';
const bodyW = w => (w || 600) <= 500 ? 700 : (w || 600) <= 600 ? 800 : 900;
function fontFor(size, weight, o) {
  if (o && o.pixel) return '400 ' + size + 'px ' + F_PIXEL;
  if ((o && o.display) || (size >= 34 && (weight || 600) >= 700)) return '400 ' + size + 'px ' + F_DISPLAY;
  return bodyW(weight) + ' ' + size + 'px ' + F_BODY;
}
text = function (g, s, x, y, o) {
  o = o || {}; const sz = o.size || 28;
  g.font = fontFor(sz, o.weight, o);
  g.textAlign = o.align || 'center'; g.textBaseline = o.base || 'middle';
  if (o.stroke) { g.lineJoin = 'round'; g.lineWidth = o.sw || 6; g.strokeStyle = o.stroke; g.strokeText(s, x, y); }
  g.fillStyle = o.color || '#3b2f2a'; g.fillText(s, x, y);
};
wrapLines = function (g, s, maxW, size, weight) {
  g.font = fontFor(size, weight);
  const words = String(s).split(' '), lines = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur); return lines;
};
retroText = function (msg, x, y, size, col) { text(ctx, msg, x, y, { size: Math.round(size * .62), color: col || '#fff', pixel: true }); };

/* ---- the toy button ---- */
const BTN_PAL = {
  gift: { face: '#3cb15a', base: '#1f7a3a', ink: '#ffffff', edge: '#16602c' },
  candy: { face: '#ef4a43', base: '#a8202a', ink: '#ffffff', edge: '#7e1620' },
  arcade: { face: '#7d55e0', base: '#4a2a9a', ink: '#ffffff', edge: '#3a1f7a' },
  gold: { face: '#ffc93c', base: '#d08a10', ink: '#5a3200', edge: '#9a6400' },
  tag: { face: '#fff8ec', base: '#d9c7ad', ink: '#a8322a', edge: '#b9a385' },
  quiet: { face: '#3a2c2c', base: '#1a1214', ink: '#fff6ea', edge: '#5a4646' }
};
function btnPal(o) {
  if (o.theme && BTN_PAL[o.theme]) return [o.theme, BTN_PAL[o.theme]];
  const c = (o.color || '').toLowerCase();
  if (/^rgba\(/.test(c)) return ['quiet', BTN_PAL.quiet];
  if (c === '#2f9a5e' || c === '#3a9a5b') return ['gift', BTN_PAL.gift];
  if (c === '#7b5aa8' || c === '#4a8cf0') return ['arcade', BTN_PAL.arcade];
  if (c === '#c8453b' || c === '#e2443b' || c === '#d8333b') return ['candy', BTN_PAL.candy];
  if (c === '#d99a2a' || c === '#d9821c' || c === '#f2b83a') return ['gold', BTN_PAL.gold];
  return ['tag', BTN_PAL.tag];
}
function toyFace(x, y, w, h, P, down, th) {
  const r = Math.min(h / 2, 30), depth = Math.max(6, h * .1), dy = down ? depth - 2 : 0;
  ctx.save(); ctx.shadowColor = 'rgba(20,8,10,.45)'; ctx.shadowBlur = down ? 6 : 18; ctx.shadowOffsetY = down ? 3 : 10; rr(ctx, x, y + depth, w, h, r); fillP(ctx, P.base); ctx.restore();
  rr(ctx, x, y + depth, w, h, r); strokeP(ctx, P.edge, 2);
  const g = ctx.createLinearGradient(0, y + dy, 0, y + dy + h); g.addColorStop(0, shade(P.face, .22)); g.addColorStop(.55, P.face); g.addColorStop(1, shade(P.face, -.08));
  rr(ctx, x, y + dy, w, h, r); ctx.fillStyle = g; ctx.fill(); strokeP(ctx, P.edge, 2.5);
  // festive trim
  ctx.save(); rr(ctx, x, y + dy, w, h, r); ctx.clip();
  if (th === 'candy') { ctx.globalAlpha = .22; ctx.fillStyle = '#fff'; for (let s = -h; s < w + h; s += 26) { ctx.beginPath(); ctx.moveTo(x + s, y + dy); ctx.lineTo(x + s + 11, y + dy); ctx.lineTo(x + s + 11 - h, y + dy + h); ctx.lineTo(x + s - h, y + dy + h); ctx.fill(); } }
  if (th === 'gift') { ctx.fillStyle = 'rgba(255,214,90,.9)'; ctx.fillRect(x + w - 54, y + dy, 13, h); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(x + w - 54, y + dy, 4, h); }
  if (th === 'arcade') { ctx.globalAlpha = .12; ctx.fillStyle = '#000'; for (let yy = y + dy; yy < y + dy + h; yy += 4) ctx.fillRect(x, yy, w, 1.5); }
  if (th === 'tag') { ctx.setLineDash([6, 6]); rr(ctx, x + 7, y + dy + 7, w - 14, h - 14, r - 6); strokeP(ctx, 'rgba(168,50,42,.35)', 2); }
  ctx.restore();
  // glossy highlight
  ctx.save(); rr(ctx, x + 10, y + dy + 5, w - 20, h * .38, Math.max(4, r - 8)); ctx.fillStyle = 'rgba(255,255,255,' + (th === 'tag' ? .5 : .28) + ')'; ctx.fill(); ctx.restore();
  if (th === 'gift') { ctx.save(); ctx.translate(x + w - 48, y + dy + 4); for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(sd * 20, -16, sd * 24, 6, 0, 0); fillP(ctx, '#ffcf3a'); strokeP(ctx, 'rgba(120,70,0,.55)', 1.5); } circ(ctx, 0, 0, 5); fillP(ctx, '#ffe07a'); ctx.restore(); }
  return dy;
}
btn = function (id, x, y, w, h, label, cb, o) {
  o = o || {};
  // thumb-sized: grow small buttons about their centre
  const minH = PORT ? 92 : 66, minW = PORT ? 200 : 150;
  if (h < minH) { y -= (minH - h) / 2; h = minH; } if (w < minW) { x -= (minW - w) / 2; w = minW; }
  const [th, P] = btnPal(o), lab = label.replace(/\s*›\s*$/, ''), arrow = /›\s*$/.test(label);
  const now = gameTime, seen = BTN_SEEN[id];
  if (!seen || now - seen.last > .5) BTN_SEEN[id] = { t0: now, last: now }; else seen.last = now;
  const tt = now - BTN_SEEN[id].t0, tl = tiltOf(id), pop = REDUCE_MOTION ? 1 : E.back(clamp(tt * 3.4, 0, 1));
  const rot = o.straight ? 0 : tl.rot * .35, breathe = REDUCE_MOTION ? 0 : Math.sin(now * 2 + tl.seed) * .006;
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot); ctx.scale(pop * (1 + breathe), pop * (1 - breathe)); ctx.translate(-x - w / 2, -y - h / 2);
  UI.button(id, x, y - 6, w, h + 18, () => {
    ctx.restore(); ctx.save(); // undo UI.button's press-shrink: the face presses down into its base instead
    const down = UI.pressed === id, dy = toyFace(x, y, w, h, P, down, th);
    let fs = Math.min(o.size ? Math.max(o.size, PORT ? 30 : 0) : h * .4, h * .46);
    ctx.font = fontFor(fs, 700); const avail = w - 44 - (arrow ? 30 : 0) - (th === 'gift' ? 40 : 0); while (fs > 14 && ctx.measureText(lab).width > avail) { fs -= 1; ctx.font = fontFor(fs, 700); }
    const cx = x + w / 2 - (arrow ? 14 : 0) - (th === 'gift' ? 20 : 0), cy = y + dy + h / 2 + 2;
    if (th !== 'tag') text(ctx, lab, cx, cy + 2, { size: fs, color: 'rgba(0,0,0,.25)', weight: 800 });
    text(ctx, lab, cx, cy, { size: fs, color: P.ink, weight: 800 });
    if (arrow) { const ax = x + w - 40 - (th === 'gift' ? 40 : 0); ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(ax - 6, cy - 12); ctx.lineTo(ax + 6, cy); ctx.lineTo(ax - 6, cy + 12); strokeP(ctx, P.ink, 5); ctx.restore(); }
  }, cb);
  ctx.restore();
};
/* round icon buttons and the top-bar pills, in the same toy style */
iconBtn = function (id, x, y, r, glyph, cb, col) {
  if (PORT) r = Math.max(r, 38);
  UI.button(id, x - r, y - r, r * 2, r * 2 + 8, () => {
    ctx.restore(); ctx.save();
    const down = UI.pressed === id, dp = 6, dy = down ? dp - 2 : 0;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 6; circ(ctx, x, y + dp, r); fillP(ctx, '#c9b496'); ctx.restore();
    const g = ctx.createLinearGradient(0, y - r + dy, 0, y + r + dy); g.addColorStop(0, '#fffdf8'); g.addColorStop(1, '#f1e4d0'); circ(ctx, x, y + dy, r); ctx.fillStyle = g; ctx.fill(); strokeP(ctx, '#b9a385', 2);
    ctx.save(); ctx.translate(x, y + dy); const k = r / 32; ctx.scale(k, k); glyph(0, 0); ctx.restore();
  }, cb);
};
navPill = function (id, x, y, w, h, label, back, cb) {
  if (PORT) { const H2 = 76; y -= (H2 - h) / 2; h = H2; x -= 6; w += 12; }
  UI.button(id, x, y, w, h + 8, () => {
    ctx.restore(); ctx.save();
    const down = UI.pressed === id, dp = 6, dy = down ? dp - 2 : 0, r = h / 2;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 6; rr(ctx, x, y + dp, w, h, r); fillP(ctx, '#c9b496'); ctx.restore();
    const g = ctx.createLinearGradient(0, y + dy, 0, y + dy + h); g.addColorStop(0, '#fffdf8'); g.addColorStop(1, '#f1e4d0'); rr(ctx, x, y + dy, w, h, r); ctx.fillStyle = g; ctx.fill(); strokeP(ctx, '#b9a385', 2);
    const fs = PORT ? 27 : 21, cy = y + dy + h / 2 + 1;
    text(ctx, label, x + w / 2 + (back ? 11 : -11), cy, { size: fs, color: '#5a2f26', weight: 800 });
    const ax = back ? x + 28 : x + w - 28, d = back ? -1 : 1;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(ax - d * 5, cy - 9); ctx.lineTo(ax + d * 4, cy); ctx.lineTo(ax - d * 5, cy + 9); strokeP(ctx, '#c8453b', 5);
  }, cb);
};
/* top bar on a phone: bigger targets, evenly spaced */
drawHUDP = function () {
  const y = SAFE_T + 64;
  ctx.save(); const tg = ctx.createLinearGradient(0, 0, 0, SAFE_T + TOPBAR); tg.addColorStop(0, '#2a1416'); tg.addColorStop(1, '#3e1d1f'); ctx.fillStyle = tg; ctx.fillRect(0, 0, PW, SAFE_T + TOPBAR); ctx.restore();
  ctx.save(); ctx.globalAlpha = .5; ctx.fillStyle = '#c8453b'; for (let x = -20; x < PW + 20; x += 28) { ctx.beginPath(); ctx.moveTo(x, SAFE_T + TOPBAR); ctx.lineTo(x + 14, SAFE_T + TOPBAR); ctx.lineTo(x + 7, SAFE_T + TOPBAR - 8); ctx.fill(); } ctx.restore();
  const C = null;
  if (scene.home !== false) {
    iconBtn('hud-home', 52, y, 40, (x, yy) => glyphHouse(x, yy), () => { paused = false; go('home'); }, C);
    iconBtn('hud-pause', 144, y, 40, (x, yy) => glyphBars(x, yy), () => { if (!paused) { paused = true; audio.sfx('click'); } }, C);
    if (sceneName !== 'levels') iconBtn('hud-jump', 236, y, 40, (x, yy) => glyphGrid(x, yy), () => { paused = false; go('levels'); }, C);
  }
  if (sceneName !== 'home') navPill('back', PW - 404, y - 25, 124, 50, 'Back', true, storyBack);
  if (!scene.res && sceneName !== 'home') navPill('skip', PW - 266, y - 25, 124, 50, 'Skip', false, SKIP_CB || skipHere);
  iconBtn('hud-music', PW - 52, y, 40, (x, yy) => glyphSound(x, yy), () => audio.toggle(), C);
};
/* the dock: deep festive green with a soft snowfall, so cards and buttons pop */
function dockBg(y0) {
  const g = ctx.createLinearGradient(0, y0, 0, PH); g.addColorStop(0, '#1f4a35'); g.addColorStop(1, '#0f261c'); ctx.fillStyle = g; ctx.fillRect(0, y0, PW, PH - y0);
  ctx.save(); ctx.globalAlpha = .08; for (let r = 0; r < 14; r++) for (let c = 0; c < 7; c++) { const px = 40 + c * 116 + (r % 2) * 58, py = y0 + 50 + r * 104; if (py > PH + 20) break; if ((r + c) % 3) snowflake(ctx, px, py, 16, '#fff'); else drawPaw(ctx, px, py, 1.2, '#fff'); } ctx.restore();
};
