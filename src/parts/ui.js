/* ============ UI kit v2: dark menus, cream pills, round buttons (matches the "Jump to any section" look) ============ */
const UIC = { bg: '#2d2523', bg2: '#3a302d', pill: '#f4ece4', ink: '#3b2f2a', gold: '#ffcf7a', cream: '#fffaf0', dim: 'rgba(255,250,240,.72)', red: '#c8453b', green: '#2f9a5e' };

/* ---- extra input: trackpad / mouse wheel, keyboard, mouse hover ---- */
let wheelAcc = { x: 0, y: 0, last: 0 };
cv.addEventListener('wheel', e => {
  e.preventDefault();
  if (!scene || paused || howCard || fade.dir === 1 || !scene.wheel) return;
  const m = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1, now = performance.now();
  if (now - wheelAcc.last > 220) { wheelAcc.x = 0; wheelAcc.y = 0; wheelAcc.fresh = true; } else wheelAcc.fresh = false;
  wheelAcc.last = now;
  // with natural scrolling the deltas are opposite to the fingers, so flip them: (dx, dy) is how the fingers moved, in screen terms
  scene.wheel(-e.deltaX * m, -e.deltaY * m, wheelAcc);
}, { passive: false });
const KEYMAP = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', ' ': 'space', w: 'up', a: 'left', s: 'down', d: 'right', W: 'up', A: 'left', S: 'down', D: 'right' };
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && PAUSABLE.includes(sceneName)) { paused = !paused; return; }
  const k = KEYMAP[e.key]; if (!k || !scene || paused || howCard) return;
  if (scene.key) { e.preventDefault(); scene.key(k, e.repeat); }
});
window.addEventListener('keyup', e => { const k = KEYMAP[e.key]; if (k && scene && scene.keyUp) scene.keyUp(k); });
cv.addEventListener('pointermove', e => {
  if (input.down || e.pointerType !== 'mouse' || !scene || paused || howCard || !scene.hover) return;
  const p = toLogical(e); scene.hover(p.x, p.y);
});

/* ---- dark panel with a faint paw + snowflake wallpaper ---- */
function panel(x, y, w, h) {
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 14; rr(ctx, x, y, w, h, 34); fillP(ctx, UIC.bg); ctx.restore();
  ctx.save(); rr(ctx, x, y, w, h, 34); ctx.clip(); ctx.globalAlpha = .06;
  for (let r = 0; r * 120 < h + 120; r++) for (let c = 0; c * 130 < w + 130; c++) { const px = x + 40 + c * 130 + (r % 2) * 65, py = y + 40 + r * 120; if ((r + c) % 2) drawPaw(ctx, px, py, 1.5, '#fff'); else snowflake(ctx, px, py, 20, '#fff'); }
  ctx.restore();
  rr(ctx, x + 1, y + 1, w - 2, h - 2, 33); strokeP(ctx, 'rgba(255,255,255,.08)', 2);
}
function capsTitle(s, x, y, o) { text(ctx, s.toUpperCase(), x, y, Object.assign({ size: 20, color: UIC.gold, weight: 700 }, o || {})); }

/* ---- glyphs for the round buttons and pill dots ---- */
function glyphHouse(x, y, col) {
  ctx.save(); ctx.translate(x, y + 2); ctx.fillStyle = col || UIC.ink; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-17, -1); ctx.lineTo(0, -17); ctx.lineTo(17, -1); ctx.lineTo(12, -1); ctx.lineTo(12, 15); ctx.lineTo(-12, 15); ctx.lineTo(-12, -1); ctx.closePath(); ctx.fill();
  ctx.fillRect(7, -15, 5, 9); rr(ctx, -4, 4, 8, 11, 2); ctx.fillStyle = UIC.pill; ctx.fill(); ctx.restore();
}
function glyphBars(x, y, col) { rr(ctx, x - 10, y - 13, 7, 26, 3); fillP(ctx, col || UIC.ink); rr(ctx, x + 3, y - 13, 7, 26, 3); fillP(ctx, col || UIC.ink); }
function glyphSound(x, y) {
  ctx.save(); ctx.translate(x - 4, y); ctx.fillStyle = UIC.ink;
  ctx.beginPath(); ctx.moveTo(-12, -6); ctx.lineTo(-5, -6); ctx.lineTo(4, -14); ctx.lineTo(4, 14); ctx.lineTo(-5, 6); ctx.lineTo(-12, 6); ctx.closePath(); ctx.fill();
  if (audio.muted) { line(ctx, 10, -7, 22, 7, '#d8322c', 4); line(ctx, 22, -7, 10, 7, '#d8322c', 4); }
  else { ctx.lineCap = 'round'; ctx.strokeStyle = UIC.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(6, 0, 8, -.8, .8); ctx.stroke(); ctx.beginPath(); ctx.arc(6, 0, 15, -.8, .8); ctx.stroke(); }
  ctx.restore();
}
function dotGlyph(kind, x, y, r) {
  const c = '#fff'; ctx.save(); ctx.translate(x, y);
  if (kind === 'home') { ctx.scale(r / 26, r / 26); glyphHouse(0, -1, '#fff'); ctx.restore(); return; }
  if (kind === 'pause') { ctx.scale(r / 26, r / 26); glyphBars(0, 0, '#fff'); ctx.restore(); return; }
  if (kind === 'play') { ctx.beginPath(); ctx.moveTo(-r * .3, -r * .45); ctx.lineTo(r * .5, 0); ctx.lineTo(-r * .3, r * .45); ctx.closePath(); fillP(ctx, c); }
  else if (kind === 'again') { ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 0, r * .45, -.6, 4.4); strokeP(ctx, c, r * .16); ctx.beginPath(); ctx.moveTo(r * .5, -r * .62); ctx.lineTo(r * .42, -r * .18); ctx.lineTo(r * .02, -r * .32); ctx.closePath(); fillP(ctx, c); }
  else if (kind === 'grid') { for (let i = 0; i < 3; i++) rr(ctx, -r * .45, -r * .42 + i * r * .32, r * .9, r * .18, r * .09), fillP(ctx, c); }
  else if (kind === 'star') drawStarShape(ctx, 0, 1, r * .55, '#fff', .01);
  else if (kind === 'how') text(ctx, '?', 0, 1, { size: r * 1.1, color: c, weight: 700 });
  else if (kind && kind.length <= 2) text(ctx, kind, 0, 1, { size: r * .95, color: c, weight: 700 });
  else { ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-r * .16, -r * .38); ctx.lineTo(r * .22, 0); ctx.lineTo(-r * .16, r * .38); strokeP(ctx, c, r * .2); }
  ctx.restore();
}

/* ---- buttons: Christmas skins (wrapped present, candy cane, gift tag, arcade panel), each set at its own slight angle,
        popping in, then giving the odd jiggle. Quiet actions (rgba colours) stay as a dark outlined pill. ---- */
const BTN_SEEN = {};
function btnTheme(o) {
  if (o.theme) return o.theme; const c = (o.color || '').toLowerCase();
  if (/^rgba\(/.test(c)) return 'quiet';
  if (c === '#2f9a5e' || c === UIC.green || c === '#3a9a5b') return 'gift';
  if (c === '#7b5aa8' || c === '#4a8cf0') return 'arcade';
  if (c === '#c8453b' || c === '#e2443b' || c === UIC.red || c === '#d8333b') return 'candy';
  return 'tag';
}
function btn(id, x, y, w, h, label, cb, o) {
  o = o || {};
  const th = btnTheme(o), lab = label.replace(/\s*›\s*$/, ''), arrow = /›\s*$/.test(label);
  const now = gameTime, seen = BTN_SEEN[id];
  if (!seen || now - seen.last > .5) BTN_SEEN[id] = { t0: now, last: now }; else seen.last = now;
  const tt = now - BTN_SEEN[id].t0, tl = tiltOf(id), pop = REDUCE_MOTION ? 1 : E.back(clamp(tt * 3.4, 0, 1)), jg = o.straight || REDUCE_MOTION ? { rot: 0, sx: 1, sy: 1 } : jiggle(tt, tl.seed);
  const rot = o.straight ? 0 : tl.rot * .8 + jg.rot;
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot); ctx.scale(pop * jg.sx, pop * jg.sy); ctx.translate(-x - w / 2, -y - h / 2);
  UI.button(id, x, y, w, h, () => {
    const r = Math.min(h * .32, 18), fs0 = o.size || Math.round(h * .42);
    if (th === 'quiet') {
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.3)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 3; rr(ctx, x, y, w, h, h / 2); fillP(ctx, 'rgba(30,22,24,.82)'); ctx.restore();
      rr(ctx, x + 1.5, y + 1.5, w - 3, h - 3, h / 2 - 1.5); strokeP(ctx, 'rgba(255,255,255,.55)', 2.5);
      text(ctx, label, x + w / 2, y + h / 2 + 1, { size: Math.min(fs0, h * .45), color: '#fff', weight: 700 }); return;
    }
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.42)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 7;
    if (th === 'tag') { // a cream gift tag: notched left end, punched hole, red string
      const n = Math.min(h * .45, 26); ctx.beginPath(); ctx.moveTo(x + n, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + n, y + h); ctx.lineTo(x, y + h / 2); ctx.closePath(); fillP(ctx, '#fbf3e4');
    } else { rr(ctx, x, y, w, h, r); fillP(ctx, th === 'candy' ? '#fff' : th === 'arcade' ? '#1b0d3a' : '#2a8a43'); }
    ctx.restore();
    ctx.save();
    if (th === 'gift') { // green striped wrapping paper with a gold ribbon and bow
      rr(ctx, x, y, w, h, r); ctx.clip(); ctx.fillStyle = '#3fae4e'; ctx.fillRect(x, y, w, h); ctx.fillStyle = '#2d9140';
      for (let s = -h; s < w; s += 18) { ctx.beginPath(); ctx.moveTo(x + s, y + h); ctx.lineTo(x + s + 9, y + h); ctx.lineTo(x + s + 9 + h, y); ctx.lineTo(x + s + h, y); ctx.fill(); }
      ctx.fillStyle = '#f2c14e'; ctx.fillRect(x + 18, y, 12, h); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(x + 18, y, 4, h);
      ctx.restore(); ctx.save(); ctx.translate(x + 24, y + 6);
      for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(sd * 22, -18, sd * 26, 6, 0, 0); fillP(ctx, '#e8b02e'); strokeP(ctx, 'rgba(120,70,0,.5)', 1.5); }
      circ(ctx, 0, 0, 5); fillP(ctx, '#ffd34d');
    } else if (th === 'candy') { // candy-cane stripes round a red centre
      rr(ctx, x, y, w, h, r); ctx.clip(); ctx.fillStyle = '#e0283c'; for (let s = -h; s < w + h; s += 16) { ctx.beginPath(); ctx.moveTo(x + s, y); ctx.lineTo(x + s + 8, y); ctx.lineTo(x + s + 8 - h, y + h); ctx.lineTo(x + s - h, y + h); ctx.fill(); }
      ctx.restore(); ctx.save(); rr(ctx, x + 6, y + 6, w - 12, h - 12, Math.max(3, r - 5)); ctx.clip();
      const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#e2443b'); g.addColorStop(1, '#a8202a'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    } else if (th === 'arcade') { // neon arcade panel with scanlines and twinkling pixel stars
      rr(ctx, x, y, w, h, r); ctx.clip(); const ag = ctx.createLinearGradient(0, y, 0, y + h); ag.addColorStop(0, '#3a1a6e'); ag.addColorStop(1, '#1b0d3a'); ctx.fillStyle = ag; ctx.fillRect(x, y, w, h);
      ctx.globalAlpha = .18; ctx.fillStyle = '#000'; for (let yy = y; yy < y + h; yy += 3) ctx.fillRect(x, yy, w, 1); ctx.globalAlpha = 1;
      const rs = mulberry(7); for (let i = 0; i < 10; i++) { const sx = x + 10 + rs() * (w - 20), sy = y + 6 + rs() * (h - 12); ctx.fillStyle = Math.sin(gameTime * 4 + i * 1.7) > 0 ? ['#ff4fd8', '#4fe6ff', '#ffd000'][i % 3] : 'rgba(255,255,255,.25)'; ctx.fillRect(sx - 1.5, sy - 1.5, 3, 3); }
      ctx.restore(); ctx.save(); ctx.shadowColor = '#ff2fd0'; ctx.shadowBlur = 10; rr(ctx, x + 2, y + 2, w - 4, h - 4, r - 1); strokeP(ctx, '#ff5fe0', 3);
    } else { // tag: hole + string + a dashed stitch
      circ(ctx, x + Math.min(h * .45, 26) * .9, y + h / 2, 5); fillP(ctx, '#c9a46a');
      ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(x + Math.min(h * .45, 26) + 8, y + 6); ctx.lineTo(x + w - 8, y + 6); ctx.moveTo(x + Math.min(h * .45, 26) + 8, y + h - 6); ctx.lineTo(x + w - 8, y + h - 6); strokeP(ctx, 'rgba(200,69,59,.45)', 1.5); ctx.setLineDash([]);
      ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + Math.min(h * .45, 26) * .9, y + h / 2); ctx.bezierCurveTo(x - 14, y + h / 2 - 6, x - 18, y + h + 6, x - 4, y + h + 14); strokeP(ctx, '#d8333b', 3);
    }
    ctx.restore();
    if (th !== 'tag') { ctx.save(); rr(ctx, x + 4, y + 3, w - 8, h * .4, Math.max(2, r - 3)); ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.fill(); ctx.restore(); }
    // label, shrunk to fit
    const lx0 = x + (th === 'gift' ? 40 : th === 'tag' ? Math.min(h * .45, 26) + 12 : 14), lx1 = x + w - 14 - (arrow ? 18 : 0);
    let fs = fs0; ctx.font = '700 ' + fs + 'px ' + FONT; while (fs > 12 && ctx.measureText(lab).width > lx1 - lx0) { fs -= 1; ctx.font = '700 ' + fs + 'px ' + FONT; }
    const cx = (lx0 + lx1) / 2, dark = th === 'tag';
    text(ctx, lab, cx, y + h / 2 + 1, { size: fs, color: dark ? '#7a2a24' : '#fff', weight: 700, stroke: dark ? null : 'rgba(40,10,20,.45)', sw: 5 });
    if (arrow) { const ax = x + w - 22, ay = y + h / 2; ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(ax - 4, ay - 8); ctx.lineTo(ax + 4, ay); ctx.lineTo(ax - 4, ay + 8); strokeP(ctx, dark ? '#7a2a24' : '#fff', 4); ctx.restore(); }
  }, cb);
  ctx.restore();
}
/* the outlined Skip pill (and its Back twin) beside the sound button */
let skipShown = false;
function navPill(id, x, y, w, h, label, back, cb) {
  UI.button(id, x, y, w, h, () => {
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.3)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 3; rr(ctx, x, y, w, h, h / 2); fillP(ctx, 'rgba(30,22,24,.82)'); ctx.restore();
    rr(ctx, x + 1.5, y + 1.5, w - 3, h - 3, h / 2 - 1.5); strokeP(ctx, 'rgba(255,255,255,.6)', 3);
    text(ctx, label, x + w / 2 + (back ? 10 : -10), y + h / 2 + 1, { size: 22, color: '#fff', weight: 700 });
    const ax = back ? x + 26 : x + w - 26, ay = y + h / 2, d = back ? -1 : 1;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(ax - d * 4, ay - 7); ctx.lineTo(ax + d * 3, ay); ctx.lineTo(ax - d * 4, ay + 7); strokeP(ctx, '#fff', 4);
  }, cb);
}
function skipBtn(cb) { skipShown = true; navPill('skip', W - 250, 34, 132, 50, 'Skip', false, cb); }

/* ---- the nav bar on every screen: Home, Pause, Jump (left) · Back, Skip, Sound (right) ---- */
function skipHere() {
  paused = false;
  if (sceneName === 'home' || sceneName === 'levels') { storyResume(); return; }
  if (sceneName === 'card') { go('home'); return; }
  if (sceneName === 'splash') { save.seenIntro = true; persist(); }
  if (GAMES[sceneName]) { onWithStory(); return; }
  storyNext();
}
function glyphGrid(x, y) { for (const dx of [-7, 7]) for (const dy of [-7, 7]) { rr(ctx, x + dx - 5.5, y + dy - 5.5, 11, 11, 3); fillP(ctx, UIC.ink); } }
function drawHUD() {
  const C = UIC.pill;
  if (scene.home !== false) {
    iconBtn('hud-home', 54, 56, 32, (x, y) => { ctx.save(); ctx.translate(x, y); ctx.scale(1.05, 1.05); glyphHouse(0, 0); ctx.restore(); }, () => { paused = false; go('home'); }, C);
    iconBtn('hud-pause', 130, 56, 32, (x, y) => glyphBars(x, y), () => { if (!paused) { paused = true; audio.sfx('click'); } }, C);
    if (sceneName !== 'levels') iconBtn('hud-jump', 206, 56, 32, (x, y) => glyphGrid(x, y), () => { paused = false; go('levels'); }, C);
  }
  if (!skipShown && !scene.res && sceneName !== 'home') skipBtn(skipHere);
  skipShown = false;
  if (sceneName !== 'home') navPill('back', W - 396, 34, 132, 50, 'Back', true, storyBack);
  iconBtn('hud-music', W - 54, 56, 32, (x, y) => glyphSound(x, y), () => audio.toggle(), C);
}

/* ---- level / game complete card ---- */
function doneCard(t, title, sub, nextLab, onNext, onReplay, res, btns) {
  const k = E.back(t / .55), jg = jiggle(t, 1.1);
  ctx.fillStyle = 'rgba(20,12,10,' + (.6 * clamp(t / .4, 0, 1)) + ')'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-.02 + jg.rot * .5); ctx.scale((.6 + .4 * k) * jg.sx, (.6 + .4 * k) * jg.sy); ctx.globalAlpha = clamp(t / .25, 0, 1); ctx.translate(-W / 2, -H / 2);
  const stack = PORT && btns, top = stack ? H / 2 - 370 : res ? H / 2 - 290 : H / 2 - 240, hasPts = res && res.pts != null;
  panel(W / 2 - 380, top, 760, stack ? 800 : hasPts ? 610 : res ? 490 : 500);
  if (res) for (let i = 0; i < 3; i++) {
    const st = t - .5 - i * .35, on = i < res.stars && st > 0, sk = on ? E.back(Math.min(1, st / .35)) : 1;
    if (on && !res['s' + i]) { res['s' + i] = 1; audio.sfx('star', 1 + i * .12); spawn('sparkle', W / 2 + (i - 1) * 110, top - 6, 12); }
    ctx.save(); ctx.translate(W / 2 + (i - 1) * 110, top + (i === 1 ? -14 : 6)); ctx.scale(sk, sk); ctx.rotate(on ? (1 - Math.min(1, st / .35)) * .8 : 0);
    drawStarShape(ctx, 0, 0, i === 1 ? 52 : 42, on ? '#ffd34d' : '#5a4b46', 4); if (on) drawStarShape(ctx, -8, -8, (i === 1 ? 52 : 42) * .3, 'rgba(255,255,255,.55)', .01);
    ctx.restore();
  }
  const ty = res ? top + 118 : H / 2 - 150;
  capsTitle(btns ? 'Game over' : res ? 'Level complete' : 'All done', W / 2, ty - 62);
  xTitle(title, W / 2, ty, 64, { maxW: 660, seed: title.length });
  para(ctx, sub, W / 2, ty + 58, 640, { size: 24, color: UIC.dim, weight: 600 });
  if (hasPts && t > 1.4) {
    const shown = Math.round(res.pts * Math.min(1, (t - 1.4) / .8));
    rr(ctx, W / 2 - 200, H / 2 - 22, 400, 62, 31); fillP(ctx, 'rgba(255,255,255,.07)');
    text(ctx, 'Score  ' + shown.toLocaleString(), W / 2, H / 2 + 10, { size: 32, color: '#fff3c4', weight: 700 });
    const bd = breakdownText(); if (bd && t > 2) text(ctx, bd, W / 2, H / 2 + 62, { size: 17, color: UIC.gold, weight: 600 });
    if (res.newBest && t > 2.2) { ctx.save(); ctx.translate(W / 2 + 210, H / 2 - 18); ctx.rotate(-.12); rr(ctx, -66, -18, 132, 36, 18); fillP(ctx, '#e2443b'); text(ctx, 'NEW BEST!', 0, 1, { size: 18, color: '#fff', weight: 700 }); ctx.restore(); }
  }
  if (res && res.tip && t > 1.4) text(ctx, res.tip, W / 2, H / 2 + (hasPts ? 90 : -48), { size: 19, color: 'rgba(255,250,240,.55)', weight: 600 });
  ctx.restore();
  if (t > .4) {
    const by = hasPts ? H / 2 + 128 : res ? H / 2 - 8 : H / 2 + 60;
    if (stack) { btns.forEach((b, i) => btn('done-b' + i, W / 2 - 280, H / 2 + 112 + i * 100, 560, 88, b[0], b[1], { color: b[2], size: 34, glyph: b[3] })); return; }
    if (btns) {
      btns.forEach((b, i) => btn('done-b' + i, W / 2 - 350 + i * 236, by + 20, 222, 74, b[0], b[1], { color: b[2], size: 22, glyph: b[3] }));
      return;
    }
    btn('done-next', W / 2 - 250, by, 500, 76, nextLab, onNext, { color: UIC.green, size: 30, glyph: 'play' });
    if (onReplay) btn('done-replay', W / 2 - 250, by + 90, 242, 62, res && res.stars < 3 ? 'Try for 3★' : 'Play again', onReplay, { color: '#d9821c', size: 22, glyph: 'again' });
    btn('done-home', W / 2 + (onReplay ? 8 : -121), by + 90, 242, 62, 'Home', () => go('home'), { color: '#8a6a5a', size: 22, glyph: 'home' });
  }
}

/* ---- "how to steer" card shown beside the arcade games (replaces the old arrow buttons) ---- */
function controlsCard(x, y, t, rows, classic) {
  const w = 214, h = 92 + rows.length * 74;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6; rr(ctx, x, y, w, h, 26); fillP(ctx, classic ? 'rgba(0,0,0,.82)' : 'rgba(45,37,35,.94)'); ctx.restore();
  capsTitle('How to steer', x + w / 2, y + 30, { size: 17 });
  rows.forEach((r, i) => {
    const ry = y + 58 + i * 74, cx = x + 40, cy = ry + 26;
    circ(ctx, cx, cy, 24); fillP(ctx, UIC.pill);
    ctx.save(); ctx.translate(cx, cy);
    if (r[0] === 'swipe') { const k = (t * .9 + i * .3) % 1, o = (E.inOut(Math.min(1, k / .7)) - .5) * 20; ctx.globalAlpha = k < .8 ? 1 : 1 - (k - .8) / .2; line(ctx, -12, 8, 12, 8, 'rgba(59,47,42,.3)', 3); drawHand(ctx, o, -8, .32, 0); }
    else if (r[0] === 'pad') { rr(ctx, -15, -11, 30, 22, 5); strokeP(ctx, UIC.ink, 2.4); const o = Math.sin(t * 3) * 5; circ(ctx, -4, o, 3); fillP(ctx, UIC.ink); circ(ctx, 4, o, 3); fillP(ctx, UIC.ink); }
    else if (r[0] === 'keys') { for (const [a, b] of [[0, -7], [-9, 5], [0, 5], [9, 5]]) { rr(ctx, a - 4, b - 4, 8, 8, 2); fillP(ctx, UIC.ink); } }
    else if (r[0] === 'tap') { const p = Math.max(0, Math.sin(t * 5)); drawHand(ctx, 0, -10 + (1 - p) * 4, .32, 0, p > .9); }
    ctx.restore();
    const ls = wrapLines(ctx, r[1], 140, 17, 700); ls.forEach((l, j) => text(ctx, l, x + 74, cy + (j - (ls.length - 1) / 2) * 20, { size: 17, color: UIC.cream, weight: 700, align: 'left' }));
  });
}
