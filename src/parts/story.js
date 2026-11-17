/* ============ v3 story flow ============ */
const STORY = ['dress', 'splash', 'rave', 'arrive', 'pantry', 'arcade', 'remote', 'arcade', 'bed', 'card'];
const STORY_TITLES = { dress: 'Dress Mona', splash: 'How it works', rave: 'The Secret Cat Rave', arrive: 'Welcome Home', pantry: 'The Pantry', arcade: 'Arcade Break', remote: 'The TV Remote', bed: 'Bedtime', card: 'The Christmas Card' };
const GAMES = {
  pong: { mona: 'Paw Pong', classic: 'Classic Pong', blurb: 'Samantha vs Mona. First to 5!', col: '#f08aa8', toggle: true },
  pac: { mona: 'Mona-Man', classic: 'Mona-Man 1982', blurb: 'Eat kibble. Dodge the vacuum!', col: '#ffd34d', toggle: true },
  tetris: { mona: 'Present Stack', blurb: 'Stack the presents. Clear 8 rows.', col: '#8fd0f5' },
  plat: { mona: 'Super Mona Hop', blurb: 'Run, jump and grab every treat.', col: '#7ee08a' },
  run: { mona: '3am Zoomies', blurb: "Mona's midnight dash through the house.", col: '#7fb2ff' },
  fight: { mona: 'Street Feline', blurb: 'Mona vs the garbage truck. Round 1!', col: '#ff7a5a' },
  kart: { mona: 'Roomba Rally', blurb: 'Cats racing Roombas round the house.', col: '#c58cff' }
};
for (const k in GAMES) if (!GAMES[k].classic) GAMES[k].classic = GAMES[k].mona;
const GAME_IDS = Object.keys(GAMES);
function inStory() { return !!(sceneParams && sceneParams.story); }
function storyGo(i) { save.story = clamp(i, 0, STORY.length - 1); if (i === 0) save.played = {}; persist(); go(STORY[save.story], { story: true }); }
function storyNext() {
  if (!inStory()) { go(GAMES[sceneName] ? 'arcade' : 'levels'); return; }
  if (save.story + 1 >= STORY.length) { save.story = -1; persist(); go('home'); return; }
  storyGo(save.story + 1);
}
/* one step back through the story (or out of a game to the arcade) */
function storyBack() {
  paused = false;
  if (GAMES[sceneName]) { go('arcade', { story: inStory() }); return; }
  if (inStory() && save.story > 0) { storyGo(save.story - 1 === 1 ? 0 : save.story - 1); return; }
  if (sceneName === 'arcade' && inStory()) { storyGo(Math.max(0, save.story - 1)); return; }
  go('home');
}
function storyResume() { storyGo(save.story > 0 && save.story < STORY.length ? save.story : 0); }
/* "On with the story": from any game, carry on where the story left off */
function onWithStory() {
  if (inStory()) { storyNext(); return; }
  const i = save.story; if (i >= 0 && STORY[i] === 'arcade') storyGo(i + 1); else storyResume();
}
function nextLabel() {
  if (!inStory()) return GAMES[sceneName] ? 'Pick another game  ›' : 'Back to sections  ›';
  const n = STORY[save.story + 1]; return 'Next: ' + (STORY_TITLES[n] || 'carry on') + '  ›';
}
function modeOf(id) { return GAMES[id] && GAMES[id].toggle ? ((save.modes && save.modes[id]) || 'mona') : 'mona'; }
function setMode(id, m) { save.modes = Object.assign({ pong: 'mona', pac: 'mona' }, save.modes || {}); save.modes[id] = m; persist(); }
function gname(id) { return GAMES[id] ? GAMES[id][modeOf(id)] : (STORY_TITLES[id] || id); }
/* the little Mona-fied / Classic switch */
function modeToggle(idp, x, y, w, id, cb) {
  const m = modeOf(id), h = 42;
  UI.button(idp, x, y, w, h, () => {
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.3)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3; rr(ctx, x, y, w, h, h / 2); fillP(ctx, 'rgba(30,20,40,.88)'); ctx.restore();
    const k = m === 'mona' ? 0 : 1, kx = x + 4 + k * (w / 2 - 4);
    rr(ctx, kx, y + 4, w / 2 - 4, h - 8, (h - 8) / 2); fillP(ctx, m === 'mona' ? '#e2443b' : '#4a7cf0');
    text(ctx, 'Mona-fied', x + w / 4 + 2, y + h / 2 + 1, { size: 15, color: m === 'mona' ? '#fff' : 'rgba(255,255,255,.55)', weight: 700 });
    text(ctx, '1980s', x + w * 3 / 4, y + h / 2 + 1, { size: 15, color: m === 'classic' ? '#fff' : 'rgba(255,255,255,.55)', weight: 700 });
  }, () => { setMode(id, m === 'mona' ? 'classic' : 'mona'); audio.sfx('pop'); if (cb) cb(); });
}
/* a little jiggle every few seconds: cards and buttons never sit perfectly still */
function jiggle(t, seed) {
  const per = 3.2 + (seed % 1.4), u = (t + seed * 1.7) % per;
  if (u > .7) return { rot: 0, sx: 1, sy: 1 };
  const d = Math.exp(-5 * u) * Math.sin(u * 26);
  return { rot: d * .045, sx: 1 + d * .035, sy: 1 - d * .035 };
}
function tiltOf(id) { let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0; const r = ((h >>> 0) % 1000) / 1000; return { rot: (r - .5) * .07, dx: ((((h >>> 10) % 1000) / 1000) - .5) * 12, seed: r * 7 }; }

/* ============ One-line explainer card: jiggles in at every scene change, tap or swipe it away ============ */
const HOWTO = {
  rave: { line: 'Party\'s over! Tap every cat to shoo her out, and tap the mess to hide it before Samantha gets home.', icon: 'paw' },
  arrive: { line: 'Samantha\'s home! Give Mona one tap for a cuddle.', icon: 'heart' },
  pantry: { line: 'Drag each new item to its glowing shelf. Tap anything Mona knocks off to catch it!', icon: 'bag' },
  remote: { line: 'Tap the cat bed to keep Mona off the remote. If she gets there, press the lit buttons to switch back!', icon: 'bed' },
  bed: { line: 'Swipe the eye mask back up, then stroke Mona slowly, head to tail. Too fast and she bounces off!', icon: 'mask' },
  pong: { line: 'Drag to move your candy cane. Bat the bell past Mona\'s paw. First to 5!', icon: 'paddle' },
  pac: { line: 'Swipe to steer Mona. Eat all the kibble, grab a heart to chase the baddies.', icon: 'arrows' },
  tetris: { line: 'Drag to slide, tap to spin, flick down to drop. Clear 8 rows!', icon: 'gift' },
  plat: { line: 'Hold left or right of Mona to run. Tap or swipe up to jump. Stomp the vacuums!', icon: 'arrows' },
  run: { line: 'Tap to jump (twice for a double jump). Swipe down to slide under things.', icon: 'down' },
  fight: { line: 'Tap Scratch and Pounce to attack. Hold Block when the truck charges!', icon: 'paw' },
  kart: { line: 'Drag left and right to steer your Roomba. Three laps, beat the other cats!', icon: 'arrows' }
};
let howCard = null;
const REDUCE_MOTION = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
function showHow(id) { if (HOWTO[id]) howCard = { id, t: 0, dx: 0, vx: 0, drag: null, out: null }; }
function howClose(dir) { if (!howCard || howCard.out) return; howCard.out = { t: 0, dir: dir || 1, x0: howCard.dx }; audio.sfx('whoosh'); }
function howDown(x, y) { if (!howCard || howCard.out) return; howCard.drag = { x0: x, last: x, lt: performance.now(), v: 0, t0: performance.now() }; }
function howMove(x, y) { const H0 = howCard; if (!H0 || !H0.drag) return; const now = performance.now(), d = H0.drag; d.v = (x - d.last) / Math.max(1, now - d.lt) * 1000; d.last = x; d.lt = now; H0.dx = x - d.x0; }
function howUp(x, y) { const H0 = howCard; if (!H0 || !H0.drag) return; const d = H0.drag; H0.drag = null; if (Math.abs(H0.dx) < 14 || Math.abs(H0.dx) > 120 || Math.abs(d.v) > 800) howClose(Math.sign(H0.dx || d.v) || 1); else H0.vx = d.v; }
function howIcon(k, x, y, t) {
  ctx.save(); ctx.translate(x, y);
  circ(ctx, 0, 0, 30); fillP(ctx, '#e6d5c2');
  const finger = (ax, ay) => { const o = Math.sin(t * 4) * 7; ctx.translate(ax * o, ay * o); drawHand(ctx, 0, -14, .42, 0); if (0) line(ctx, -16 * ax, -16 * ay, 16 * ax, 16 * ay, 'rgba(61,42,34,.5)', 3); };
  if (k === 'paw') drawPaw(ctx, 0, 2, 1.2, '#8a5a3a');
  else if (k === 'heart') drawHeart(ctx, 0, 3, 2, '#e2443b');
  else if (k === 'heartp') { const p = 1 + .15 * Math.sin(t * 6); ctx.scale(p, p); drawHeart(ctx, 0, 3, 1.9, '#ff5a7a'); }
  else if (k === 'kibble') { for (const [a, b] of [[-7, -3], [6, -5], [0, 6]]) { ell(ctx, a, b, 5.5, 4.5, a * .1); ink(ctx, '#b7773a', 1.6); } }
  else if (k === 'gift') { rr(ctx, -15, -12, 30, 26, 3); ink(ctx, '#2f9a5e', 2.2); ctx.fillStyle = '#ffd34d'; ctx.fillRect(-3, -11, 6, 24); ctx.fillRect(-14, -2, 28, 6); }
  else if (k === 'mona') drawMonaHead(ctx, 0, 6, .55, { t, outfit: curOutfit() });
  else if (k === 'mask') { rr(ctx, -18, -7, 36, 14, 7); ink(ctx, '#9a7ad8', 2); ctx.translate(0, Math.sin(t * 4) * 3); line(ctx, 22, 10, 22, -10, OUT, 2.4); ctx.beginPath(); ctx.moveTo(16, -4); ctx.lineTo(22, -12); ctx.lineTo(28, -4); strokeP(ctx, OUT, 2.4); }
  else if (k === 'bag') drawGroceryBag(ctx, 0, 18, .22, [], t);
  else if (k === 'fridge') { rr(ctx, -12, -20, 24, 40, 4); ink(ctx, '#d9dde3', 2); line(ctx, -12, -4, 12, -4, OUT, 2); line(ctx, 8, -16, 8, -8, OUT, 2.4); line(ctx, 8, 0, 8, 12, OUT, 2.4); }
  else if (k === 'bed') { ctx.scale(.3, .3); drawCatBed(ctx, 0, 30, 1, false); drawCatBed(ctx, 0, 30, 1, true); }
  else if (k === 'fast') { for (let i = 0; i < 3; i++) line(ctx, -18 + i * 4, -8 + i * 8, 14 + i * 4, -8 + i * 8, i === 1 ? '#e2443b' : 'rgba(61,42,34,.5)', 3); }
  else if (k === 'paddle' || k === 'down') finger(0, 1);
  else finger(1, 0); // arrows / drag
  ctx.restore();
}function drawHow() {
  const H0 = howCard, h = HOWTO[H0.id], t = gameTime;
  const now = performance.now(), dt = Math.min(.05, (now - (H0.last || now)) / 1000); H0.last = now; H0.t += dt;
  const tt = H0.t, rm = REDUCE_MOTION;
  if (!H0.drag && !H0.out) { const k = 260, c = 26; H0.vx += (-k * H0.dx - c * H0.vx) * dt; H0.dx += H0.vx * dt; }
  let outK = 0; if (H0.out) { H0.out.t += dt; outK = E.inOut(H0.out.t / .34); if (H0.out.t >= .34) { howCard = null; audio.sfx('pop'); return; } }
  ctx.fillStyle = 'rgba(30,15,10,' + (.5 * Math.min(1, tt / .3) * (1 - outK)) + ')'; ctx.fillRect(0, 0, W, H);
  // jiggle in: an underdamped spring on scale + a wobble that settles, then the odd idle jiggle
  const sc = rm ? 1 : 1 - .45 * Math.exp(-6.5 * tt) * Math.cos(17 * tt), wob = rm ? 0 : -.08 * Math.exp(-4.2 * tt) * Math.sin(15 * tt), jg = jiggle(tt, 2.1);
  const offX = H0.dx + (H0.out ? (H0.out.x0 + H0.out.dir * 1400 * outK) - H0.dx : 0);
  const w = 800, hh = 300, x = W / 2 - w / 2, y = H / 2 - hh / 2 - 20;
  ctx.save(); ctx.translate(W / 2 + offX, H / 2); ctx.rotate(-.03 + wob + jg.rot + offX / 3000); ctx.scale(sc * jg.sx, sc * jg.sy); ctx.translate(-W / 2, -H / 2);
  giftTagCard(x, y, w, hh);
  capsTitle(GAMES[H0.id] ? gname(H0.id) : (STORY_TITLES[H0.id] || ''), W / 2 + 40, y + 52, { size: 22 });
  ctx.save(); ctx.translate(x + 100, y + 150); ctx.scale(1.35, 1.35); howIcon(h.icon, 0, 0, t); ctx.restore();
  const lines = wrapLines(ctx, h.line, 560, 31, 700); lines.forEach((ln, j) => text(ctx, ln, x + 190, y + 150 + (j - (lines.length - 1) / 2) * 38, { size: 31, align: 'left', color: UIC.cream, weight: 700 }));
  const a = .55 + .45 * Math.sin(tt * 4); ctx.globalAlpha = a; text(ctx, 'Tap or swipe to start', W / 2 + 40, y + hh - 42, { size: 22, color: '#ffd38a', weight: 700 }); ctx.globalAlpha = 1;
  ctx.restore();
}
/* a dark gift-tag card: notched corners, a punched hole with a red string and a sprig of holly */
function giftTagCard(x, y, w, h) {
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 34; ctx.shadowOffsetY = 14;
  const n = 46; ctx.beginPath(); ctx.moveTo(x + n, y); ctx.lineTo(x + w - 26, y); ctx.quadraticCurveTo(x + w, y, x + w, y + 26); ctx.lineTo(x + w, y + h - 26); ctx.quadraticCurveTo(x + w, y + h, x + w - 26, y + h); ctx.lineTo(x + n, y + h); ctx.lineTo(x, y + h - n); ctx.lineTo(x, y + n); ctx.closePath();
  fillP(ctx, UIC.bg); ctx.restore();
  ctx.save(); ctx.clip(); ctx.globalAlpha = .06; for (let r = 0; r * 110 < h + 110; r++) for (let c = 0; c * 120 < w + 120; c++) { const px = x + 40 + c * 120 + (r % 2) * 60, py = y + 40 + r * 110; if ((r + c) % 2) drawPaw(ctx, px, py, 1.4, '#fff'); else snowflake(ctx, px, py, 18, '#fff'); } ctx.restore();
  strokeP(ctx, 'rgba(255,215,140,.35)', 3);
  circ(ctx, x + 34, y + h / 2, 12); fillP(ctx, '#1a1412'); strokeP(ctx, '#c9a46a', 3);
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + 34, y + h / 2); ctx.bezierCurveTo(x - 30, y + h / 2 - 40, x - 40, y + 30, x - 10, y - 20); strokeP(ctx, '#d8333b', 5); ctx.restore();
  drawHolly(ctx, x + w - 46, y + 40, 1.1, .5);
}

/* ============ Pause menu ============ */
let paused = false;
const PAUSABLE = ['home', 'levels', 'dress', 'splash', 'rave', 'arrive', 'pantry', 'arcade', 'remote', 'bed', 'card'].concat(GAME_IDS);
function drawPause() {
  ctx.fillStyle = 'rgba(20,12,10,.72)'; ctx.fillRect(0, 0, W, H);
  const gm = !!GAMES[sceneName], tg = gm && GAMES[sceneName].toggle, hw = !!HOWTO[sceneName], lv = gm || !!HOWTO[sceneName], ph = 372 + (tg ? 60 : 0) + (hw ? 74 : 0) + (lv ? 74 : 0), top = H / 2 - ph / 2, x = W / 2 - 320;
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-.015); ctx.translate(-W / 2, -H / 2);
  panel(x, top, 640, ph);
  capsTitle(gname(sceneName), W / 2, top + 48);
  text(ctx, 'Paused', W / 2, top + 96, { size: 50, color: UIC.cream, weight: 700 });
  if (lv) { const st = (save.stars || {})[sceneName] || 0; for (let i = 0; i < 3; i++) drawStarShape(ctx, W / 2 + (i - 1) * 44, top + 146, 17, i < st ? '#ffd34d' : '#5a4b46', 2.4); }
  ctx.restore();
  let yy = top + 184; const bw = 520, bx = W / 2 - bw / 2;
  btn('p-resume', bx, yy, bw, 70, 'Keep playing', () => { paused = false; }, { color: UIC.green, size: 28, glyph: 'play' }); yy += 84;
  if (tg) { modeToggle('p-mode', W / 2 - 150, yy, 300, sceneName, () => { paused = false; go(sceneName, sceneParams); }); yy += 60; }
  if (hw) { btn('p-how', bx, yy, bw, 62, 'How to play', () => { paused = false; showHow(sceneName); }, { color: '#4a8cf0', size: 24, glyph: 'how' }); yy += 74; }
  if (lv) { btn('p-restart', bx, yy, bw, 62, 'Start this part again', () => { paused = false; go(sceneName, sceneParams); }, { color: '#d9821c', size: 24, glyph: 'again' }); yy += 74; }
  btn('p-levels', bx, yy, bw / 2 - 6, 62, 'Sections', () => { paused = false; go('levels'); }, { color: UIC.red, size: 24, glyph: 'grid' });
  btn('p-home', bx + bw / 2 + 6, yy, bw / 2 - 6, 62, 'Exit to home', () => { paused = false; go('home'); }, { color: '#8a6a5a', size: 22, glyph: 'home' });
}
const LEVELS = GAME_IDS.map(id => ({ id, name: GAMES[id].mona }));

/* ============ Jump to any section ============ */
function jumpTick(x, y) { ctx.beginPath(); ctx.moveTo(x - 11, y); ctx.lineTo(x - 3, y + 9); ctx.lineTo(x + 12, y - 9); strokeP(ctx, '#3a8a55', 4.5); }
function jumpPill(idp, x, y, w, h, k, draw, onTap) {
  const tl = tiltOf(idp), jg = jiggle(gameTime, tl.seed);
  ctx.save(); ctx.translate(x + w / 2 + tl.dx * .5, y + h / 2); ctx.rotate(tl.rot * .6 + jg.rot * .6); ctx.scale(k * jg.sx, k * jg.sy); ctx.translate(-x - w / 2, -y - h / 2);
  UI.button(idp, x, y, w, h, () => {
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5; rr(ctx, x, y, w, h, 22); fillP(ctx, '#f4ece4'); ctx.restore();
    rr(ctx, x + 4, y + 4, w - 8, h - 8, 18); strokeP(ctx, 'rgba(201,164,106,.5)', 1.5);
    draw();
  }, onTap);
  ctx.restore();
}
const JUMP_STORY = [
  { name: 'Dress Mona', at: 0 }, { name: 'The Secret Cat Rave', at: 2 }, { name: 'Welcome Home', at: 3 }, { name: 'The Pantry', at: 4 },
  { name: 'Arcade Break', at: 5 }, { name: 'The TV Remote', at: 6 }, { name: 'Arcade Break 2', at: 7 }, { name: 'Bedtime', at: 8 }, { name: 'The Christmas Card', at: 9 }
];
function menuBackdrop(t) {
  ctx.fillStyle = '#2d2523'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = .07;
  for (let r = 0; r < 7; r++) for (let c = 0; c < 9; c++) { const x = 40 + c * 150 + (r % 2) * 75, y = 60 + r * 140 + Math.sin(t * .4 + c) * 6; if ((r + c) % 2) drawPaw(ctx, x, y, 1.6, '#fff'); else snowflake(ctx, x, y, 22, '#fff'); }
  ctx.restore();
  for (let i = 0; i < 26; i++) bulb(ctx, 20 + i * 48, 14 + Math.sin(i * 1.3) * 8, LIGHT_COLS[i % 5], .5 + .5 * Math.sin(t * 3 + i), .8);
  drawSnow(ctx, 0, 0, W, H, t, 30, .6);
}
SCENES.levels = {
  enter() { audio.music('home'); },
  draw() {
    const t = this.t; menuBackdrop(t);
    text(ctx, 'Jump to any section', W / 2, 120, { size: 50, color: '#fffaf0', weight: 700 });
    const X0 = 56, CW = 362, GAP = 20, PH = 72;
    capsTitle('The story', X0, 180, { align: 'left', size: 22 });
    JUMP_STORY.forEach((S, i) => {
      const c = i % 3, r = Math.floor(i / 3), x = X0 + c * (CW + GAP), y = 206 + r * (PH + 16), k = E.back((t - i * .04) / .45);
      if (k <= 0) return;
      const done = save.story > S.at || (save.finished && S.at < 9), here = save.story === S.at;
      jumpPill('js-' + i, x, y, CW, PH, k, () => {
        circ(ctx, x + 40, y + PH / 2, 22); fillP(ctx, '#c8453b');
        text(ctx, String(i + 1), x + 40, y + PH / 2 + 1, { size: 22, color: '#fff', weight: 700 });
        text(ctx, S.name, x + 76, y + PH / 2 + 1, { size: S.name.length > 17 ? 23 : 26, color: '#3b2f2a', weight: 700, align: 'left' });
        if (here) { rr(ctx, x + CW - 98, y + PH / 2 - 15, 82, 30, 15); fillP(ctx, '#2f9a5e'); text(ctx, 'Up to', x + CW - 57, y + PH / 2 + 1, { size: 16, color: '#fff', weight: 700 }); }
        else if (done) jumpTick(x + CW - 34, y + PH / 2);
      }, () => storyGo(S.at));
    });
    capsTitle("Mona's arcade", X0, 506, { align: 'left', size: 22 });
    const AW = 270, AG = 22;
    GAME_IDS.forEach((id, i) => {
      const c = i % 4, r = Math.floor(i / 4), x = X0 + c * (AW + AG) + (r ? (AW + AG) / 2 : 0), y = 532 + r * (PH + 16), k = E.back((t - .3 - i * .05) / .45), g = GAMES[id];
      if (k <= 0) return;
      jumpPill('ja-' + id, x, y, AW, PH, k, () => {
        circ(ctx, x + 38, y + PH / 2, 22); fillP(ctx, g.col); drawStarShape(ctx, x + 38, y + PH / 2 + 1, 11, '#fff', 0);
        text(ctx, gname(id), x + 70, y + PH / 2 - (g.toggle ? 9 : 0), { size: 22, color: '#3b2f2a', weight: 700, align: 'left' });
        if (g.toggle) text(ctx, modeOf(id) === 'mona' ? 'Mona-fied' : 'Classic 1980s', x + 70, y + PH / 2 + 17, { size: 15, color: '#9a7a6a', weight: 600, align: 'left' });
      }, () => go(id));
    });
    btn('lv-arcade', W / 2 - 330, 742, 300, 74, 'Arcade gallery', () => go('arcade'), { color: '#7b5aa8', size: 26, theme: 'arcade' });
    btn('lv-cont', W / 2 + 30, 742, 300, 74, save.story > 0 ? 'Carry on the story' : 'Start the story', () => storyResume(), { color: '#2f9a5e', size: 26 });
  }
};
/* ============ Dress Mona: every outfit, no unlocking ============ */
SCENES.dress = {
  enter() { audio.music('home'); this.pop = 9; this.celebrate = 0; },
  update(dt) { this.pop += dt; this.celebrate = Math.max(0, this.celebrate - dt); },
  tap(x, y) { if (dist(x, y, 330, 560) < 160) { this.celebrate = 1.6; audio.sfx('meow', 1.1); audio.sfx('bugle'); spawn('confetti', 330, 420, 30); } },
  draw() {
    const t = this.t;
    ctx.drawImage(cached('dress-bg', LIV.w, H, g => drawLiving(g, 'evening')), -160, 0, LIV.w, H);
    livingLive(ctx, t, 'evening');
    ctx.fillStyle = 'rgba(40,20,30,.5)'; ctx.fillRect(0, 0, W, H);
    glowAt(ctx, 330, 600, 330, '255,214,150', .35, .55);
    text(ctx, 'Dress Mona!', W / 2, 74, { size: 50, color: '#fffaf0', weight: 700, stroke: 'rgba(43,29,26,.45)', sw: 8 });
    text(ctx, 'Pick any outfit. She can change whenever she likes.', W / 2, 122, { size: 23, color: '#ffe9c8', weight: 600 });
    // big Mona on a rug
    ell(ctx, 330, 700, 210, 44); fillP(ctx, 'rgba(255,240,220,.18)');
    const k = 1 + .14 * Math.exp(-this.pop * 6) * Math.sin(this.pop * 32);
    ctx.save(); ctx.translate(330, 700); ctx.scale(k, 2 - k); drawMona(ctx, 0, 0, 2.5, { pose: this.celebrate > 0 ? 'celebrate' : 'sit', t, outfit: curOutfit(), eyes: this.pop < 1.2 ? 'happy' : undefined }); ctx.restore();
    const cur = OUTFITS.find(o => o.id === curOutfit());
    text(ctx, cur ? cur.name : '', 330, 770, { size: 32, color: '#fff3c4', weight: 700, stroke: 'rgba(43,29,26,.5)', sw: 7 });
    OUTFITS.forEach((o, i) => {
      const c = i % 3, r = Math.floor(i / 3), x = 640 + c * 186, y = 160 + r * 192, sel = curOutfit() === o.id, ki = E.back((t - i * .04) / .45);
      if (ki <= 0) return;
      ctx.save(); ctx.translate(x + 85, y + 85); ctx.scale(ki, ki); ctx.translate(-x - 85, -y - 85);
      UI.button('of-' + o.id, x, y, 170, 176, () => {
        ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.3)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6; rr(ctx, x, y, 170, 176, 24); fillP(ctx, sel ? '#fff3c4' : '#fffaf0'); ctx.restore();
        if (sel) { rr(ctx, x + 4, y + 4, 162, 168, 21); strokeP(ctx, '#d99a2a', 5); }
        drawMonaHead(ctx, x + 85, y + 82, .98, { t, outfit: o.id, eyes: sel ? 'happy' : undefined });
        text(ctx, o.name, x + 85, y + 152, { size: o.name.length > 14 ? 17 : 20, color: '#3b2f2a', weight: 600 });
      }, () => { save.outfit = o.id; persist(); this.pop = 0; audio.sfx('jingle'); audio.sfx('meow', .8); spawn('sparkle', 330, 460, 18); });
      ctx.restore();
    });
    if (inStory()) btn('dress-go', 760, 790, 360, 84, "Let's go!  ›", () => storyNext(), { color: '#2f9a5e', size: 38 });
    else btn('dress-done', 760, 790, 360, 84, 'Done', () => go('home'), { color: '#2f9a5e', size: 38 });
  }
};

/* ============ Game corner: pick a game, with arcade attract previews ============ */
function tri(u) { u = ((u % 1) + 1) % 1; return 1 - Math.abs(2 * u - 1); }
function drawPreview(id, mode, x, y, w, h, t) {
  const g = ctx, classic = mode === 'classic';
  g.save(); rr(g, x, y, w, h, 10); g.clip();
  if (id === 'pong') {
    g.fillStyle = classic ? '#000' : '#14213f'; g.fillRect(x, y, w, h);
    if (!classic) { g.globalAlpha = .5; drawSnow(g, x, y, w, h, t, 14, .5); g.globalAlpha = 1; }
    const bx = x + 16 + tri(t * .45) * (w - 32), by = y + 12 + tri(t * .31 + .2) * (h - 24), goingL = Math.cos(t * .45 * TAU * .5) > 0;
    const ly = clamp(by + Math.sin(t * 2) * 6, y + 18, y + h - 18), ry = clamp(by - Math.sin(t * 2.3) * 8, y + 18, y + h - 18), u = w / 300;
    if (classic) {
      g.fillStyle = 'rgba(255,255,255,.7)'; for (let yy = y + 4; yy < y + h; yy += 12 * u) g.fillRect(x + w / 2 - 2 * u, yy, 4 * u, 6 * u);
      g.fillStyle = '#fff'; g.fillRect(x + 10 * u, ly - 16 * u, 6 * u, 32 * u); g.fillRect(x + w - 16 * u, ry - 16 * u, 6 * u, 32 * u); g.fillRect(bx - 4 * u, by - 4 * u, 8 * u, 8 * u);
      const sv = Math.floor(t / 3) % 6; ctx.save(); pixNum(sv, x + w / 2 - 34 * u, y + 8 * u, 3.4 * u, '#fff'); pixNum((sv + 2) % 7, x + w / 2 + 22 * u, y + 8 * u, 3.4 * u, '#fff'); ctx.restore();
    } else {
      for (let i = 0; i < 8; i++) bulb(g, x + w / 2, y + 10 + i * (h - 20) / 7, LIGHT_COLS[i % 5], .5 + .5 * Math.sin(t * 3 + i), .7 * u);
      g.save(); g.lineCap = 'round'; for (const [c, wd] of [[OUT, 11 * u], ['#fff', 7 * u]]) { g.beginPath(); g.moveTo(x + 14 * u, ly + 18 * u); g.lineTo(x + 14 * u, ly - 14 * u); g.arc(x + 20 * u, ly - 14 * u, 6 * u, Math.PI, 0); strokeP(g, c, wd); } g.setLineDash([5 * u, 5 * u]); g.beginPath(); g.moveTo(x + 14 * u, ly + 18 * u); g.lineTo(x + 14 * u, ly - 14 * u); strokeP(g, '#e2443b', 7 * u); g.restore();
      drawRealPaw(g, x + w + 30 * u, ry + 6 * u, x + w - 30 * u, ry, { s: .42 * u, beans: true });
      circ(g, bx, by, 7 * u); ink(g, rad(g, bx, by, 7 * u, '#f2c23e'), 1.6); line(g, bx - 4 * u, by + 1, bx + 4 * u, by + 1, '#9a7414', 1.4);
    }
  } else if (id === 'pac') {
    g.fillStyle = classic ? '#000' : '#0b1020'; g.fillRect(x, y, w, h);
    const cy = y + h / 2, u = h / 112, cw = 30 * u;
    if (classic) { g.strokeStyle = '#2121de'; g.lineWidth = 2; for (const yy of [cy - cw, cy - cw + 5, cy + cw - 5, cy + cw]) { g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy); g.stroke(); } }
    else { rr(g, x - 10, cy - cw - 14 * u, w + 20, 14 * u, 6); fillP(g, '#2f7a4a'); rr(g, x - 10, cy + cw, w + 20, 14 * u, 6); fillP(g, '#2f7a4a'); }
    const per = 4.2, k = (t % per) / per, chase = Math.floor(t / per) % 2 === 1, px = x - 30 + k * (w + 60);
    for (let dx = 14; dx < w; dx += 20 * u) { const dxx = x + dx; if (!chase && dxx < px) continue; if (classic) { g.fillStyle = '#ffb8ae'; g.fillRect(dxx - 2 * u, cy - 2 * u, 4 * u, 4 * u); } else { ell(g, dxx, cy, 4 * u, 3 * u, .3); fillP(g, '#b7773a'); } }
    const ex = chase ? px + 60 * u : px - 70 * u, scared = chase;
    if (classic) { pixSprite(g, 'cat' + (Math.sin(t * 16) > 0 ? 'O' : ''), px, cy, 2.4 * u, chase ? -1 : 1); pixSprite(g, scared ? 'scared' : 'vac', ex, cy, 2.4 * u, chase ? -1 : 1, t); }
    else { drawMonaHead(g, px, cy, .42 * u, { t, mouth: Math.sin(t * 16) > 0 ? 'open' : 'smile', outfit: curOutfit() === 'none' ? 'none' : curOutfit() }); drawBaddie(g, 'vacuum', ex, cy, .7 * u, scared, t, chase ? 1 : -1); }
    if (chase) { if (classic) pixSprite(g, 'heart', x + 20, y + 14, 2 * u); else drawHeart(g, x + 22, y + 18, 1.2 * u, '#ff5a7a'); }
  } else if (drawPreview2(id, x, y, w, h, t)) {
  } else {
    g.fillStyle = classic ? '#000' : '#151a3a'; g.fillRect(x, y, w, h);
    if (!classic) { g.globalAlpha = .4; drawSnow(g, x, y, w, h, t, 12, .5); g.globalAlpha = 1; }
    const c = Math.floor(Math.min(w / 9, h / 10.5)), bx = x + (w - c * 6) / 2, byy = y + h - c * 10 - 2;
    g.fillStyle = classic ? '#222' : 'rgba(255,255,255,.06)'; g.fillRect(bx, byy, c * 6, c * 10);
    const seq = [['I', 1, 9, 0], ['O', 4, 8, 0], ['T', 0, 7, 0], ['L', 3, 7, 0], ['S', 1, 5, 0]], per = 7, ph = t % per, idx = Math.min(seq.length, Math.floor(ph / 1.2)), flash = ph > 6.1;
    const cell = (cx, cy, k) => { if (cy < 0) return; if (classic) blockClassic(g, bx + cx * c, byy + cy * c, c, k); else drawGift(g, bx + cx * c, byy + cy * c, c, k); };
    const shapeCells = (k) => k === 'I' ? [[0, 0], [1, 0], [2, 0], [3, 0]] : k === 'O' ? [[0, 0], [1, 0], [0, -1], [1, -1]] : k === 'T' ? [[0, 0], [1, 0], [2, 0], [1, -1]] : k === 'L' ? [[0, 0], [1, 0], [2, 0], [2, -1]] : [[0, 0], [1, 0], [1, -1], [2, -1]];
    for (let i = 0; i < idx; i++) { const [k, cx, cy] = seq[i]; if (flash && cy >= 9) continue; shapeCells(k).forEach(([a, b]) => cell(cx + a, cy + b, k)); }
    if (idx < seq.length) { const [k, cx, cy] = seq[idx], f = ((ph % 1.2) / 1.2), yy = Math.floor(lerp(-1, cy, E.out(f))); shapeCells(k).forEach(([a, b]) => cell(cx + a, yy + b, k)); }
    if (flash) { g.fillStyle = 'rgba(255,255,230,' + (.6 + .4 * Math.sin(t * 30)) + ')'; g.fillRect(bx, byy + 9 * c, c * 6, c); }
    if (!classic) drawMonaPeek(g, x + w - 26 * (h / 112), y + h - 4, .36 * (h / 112), { t, look: { x: -1, y: -.4 }, outfit: curOutfit(), paws: true });
  }
  // CRT glass: scanlines + sheen
  g.globalAlpha = .12; g.fillStyle = '#000'; for (let yy = y; yy < y + h; yy += 3) g.fillRect(x, yy, w, 1); g.globalAlpha = 1;
  const sh = g.createLinearGradient(x, y, x + w * .6, y + h); sh.addColorStop(0, 'rgba(255,255,255,.12)'); sh.addColorStop(.5, 'rgba(255,255,255,0)'); g.fillStyle = sh; g.fillRect(x, y, w, h);
  g.restore();
}/* ============ Mona's arcade gallery: seven cabinets with attract-mode previews ============ */
SCENES.arcade = {
  enter(p) { audio.music('retro2'); this.flash = p && p.fromZoom ? 1 : 0; save.played = save.played || {}; },
  update(dt) { this.flash = Math.max(0, this.flash - dt * 1.6); },
  draw() {
    const t = this.t, story = inStory();
    const gr = ctx.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#2a1846'); gr.addColorStop(.6, '#162a52'); gr.addColorStop(1, '#0d1a33'); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 16; i++) glowAt(ctx, (i * 211) % W, 60 + (i * 131) % 800, 60 + (i % 4) * 26, ['255,90,80', '255,210,90', '90,220,140', '110,160,255', '255,130,210'][i % 5], .12 + .06 * Math.sin(t * 1.3 + i));
    for (let i = 0; i < 26; i++) bulb(ctx, 20 + i * 48, 12 + Math.sin(i * 1.3) * 7, LIGHT_COLS[i % 5], .5 + .5 * Math.sin(t * 3 + i), .8);
    drawSnow(ctx, 0, 0, W, H, t, 40, 1);
    const ttl = story ? 'Arcade break! Pick a game' : "Mona's Arcade";
    ctx.font = '700 52px ' + FONT; const tw = ctx.measureText(ttl).width; let xx = W / 2 - tw / 2;
    for (let i = 0; i < ttl.length; i++) { const ch = ttl[i], cw = ctx.measureText(ch).width; if (ch !== ' ') { const b = Math.sin(t * 4 - i * .5) * 4, kk = E.back((t - i * .02) / .4); ctx.save(); ctx.translate(xx + cw / 2, 110 + b); ctx.scale(kk, kk); text(ctx, ch, 0, 0, { size: 52, color: ['#ff6a5e', '#ffd34d', '#6ee39a', '#7fb2ff'][i % 4], weight: 700, stroke: '#1a1030', sw: 9 }); ctx.restore(); } xx += cw; }
    text(ctx, story ? 'Samantha deserves a break. Every game stars Mona.' : 'Every game stars Mona. Tap a cabinet to play.', W / 2, 156, { size: 21, color: '#d8d0ff', weight: 600 });
    const CW = 268, CH = 310, GAP = 22;
    GAME_IDS.forEach((id, i) => {
      const r = i < 4 ? 0 : 1, c = r ? i - 4 : i, n = r ? 3 : 4, x0 = W / 2 - (n * CW + (n - 1) * GAP) / 2, x = x0 + c * (CW + GAP), y = 180 + r * (CH + 14);
      const k = E.back((t - .1 - i * .07) / .5), G = GAMES[id], m = modeOf(id), tl = tiltOf('cab' + id), jg = jiggle(t, tl.seed);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x + CW / 2, y + CH / 2); ctx.rotate(tl.rot * .5 + jg.rot * .7); ctx.scale(k * jg.sx, k * jg.sy); ctx.translate(-x - CW / 2, -y - CH / 2);
      UI.button('cab-' + id, x, y, CW, CH, () => {
        ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 12; rr(ctx, x, y, CW, CH, 22); fillP(ctx, '#2a2236'); ctx.restore();
        const cg = ctx.createLinearGradient(x, y, x + CW, y + CH); cg.addColorStop(0, m === 'mona' ? '#c8261f' : '#2a3fa8'); cg.addColorStop(1, m === 'mona' ? '#6a1a2a' : '#151f5a'); rr(ctx, x + 5, y + 5, CW - 10, CH - 10, 19); ctx.fillStyle = cg; ctx.fill();
        // candy-cane trim along the top
        ctx.save(); rr(ctx, x + 5, y + 5, CW - 10, 12, 6); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(x, y, CW, 20); ctx.fillStyle = '#e0283c'; for (let s = -20; s < CW; s += 16) { ctx.beginPath(); ctx.moveTo(x + s, y + 20); ctx.lineTo(x + s + 8, y + 20); ctx.lineTo(x + s + 20, y); ctx.lineTo(x + s + 12, y); ctx.fill(); } ctx.restore();
        rr(ctx, x + 16, y + 24, CW - 32, 50, 12); fillP(ctx, '#140c1e');
        glowAt(ctx, x + CW / 2, y + 49, 120, m === 'mona' ? '255,200,120' : '120,170,255', .22, .35);
        text(ctx, G[m], x + CW / 2, y + 50, { size: G[m].length > 13 ? 22 : 25, color: m === 'mona' ? '#ffe08a' : '#9fd0ff', weight: 700, stroke: '#140c1e', sw: 4 });
        rr(ctx, x + 16, y + 84, CW - 32, 142, 10); fillP(ctx, '#05040a');
        drawPreview(id, m, x + 22, y + 90, CW - 44, 130, t + i * 1.7);
        para(ctx, G.blurb, x + CW / 2, y + (G.toggle ? 244 : 256), CW - 24, { size: 17, color: '#fff3e0', weight: 600, lh: 21 });
        if (save.played[id]) { ctx.save(); ctx.translate(x + CW - 26, y + 28); ctx.rotate(.25); rr(ctx, -40, -13, 80, 26, 13); fillP(ctx, '#ffd34d'); text(ctx, 'Played ✓', 0, 1, { size: 13, color: '#5a3a10', weight: 700 }); ctx.restore(); }
      }, () => { save.played[id] = true; persist(); go(id, { story }); });
      if (G.toggle) modeToggle('cab-mode-' + id, x + 34, y + 262, CW - 68, id);
      ctx.restore();
    });
    if (story) btn('arc-on', W / 2 - 200, 832, 400, 58, 'On with the story', () => storyNext(), { color: '#2f9a5e', size: 26 });
    else btn('arc-back', W / 2 - 160, 832, 320, 58, save.story > 0 ? 'On with the story' : 'Start the story', () => onWithStory(), { color: '#2f9a5e', size: 24 });
    if (this.flash > 0) { ctx.fillStyle = 'rgba(255,255,255,' + E.inOut(this.flash) + ')'; ctx.fillRect(0, 0, W, H); }
  },
  vignette: false
};
/* the end of every game: Play again, Pick another game, On with the story */
function gameDone(scn, overT, title, sub, res) {
  if (overT <= 1.4) return;
  if (!scn.markedPlayed) { scn.markedPlayed = true; save.played = save.played || {}; save.played[sceneName] = true; persist(); }
  doneCard(overT - 1.4, title, sub, null, null, null, res, [
    ['Play again', () => go(sceneName, sceneParams), '#d9821c', 'again'],
    ['Pick another game', () => go('arcade', { story: inStory() }), '#7b5aa8', 'grid'],
    ['On with the story', () => onWithStory(), '#2f9a5e', 'play']
  ]);
}
