/* ---- v6.3: the how-to tags, redrawn as cute die-cut Christmas gift tags ----
   A white sticker tag with a soft grey outline and a character peeking over the top
   (snowman, Santa, reindeer, tree, cottage or gingerbread), a coloured title ribbon with two
   tiny trees, the instruction in dark text and a quiet "tap to start". */
const TG = { line: '#8d7f80', dark: '#3b2f2a', skin: '#f8dccb', cheek: '#f4a7a3', brown: '#b9773f', brownD: '#8a5530', red: '#d8353f', redD: '#b32630', white: '#ffffff', black: '#2a2224', green: '#3f9a4f', greenD: '#2c7a3b', orange: '#ef8a2c', brick: '#c0443a', sky: '#9fd3e6' };
const TAG_KINDS = ['snowman', 'santa', 'reindeer', 'tree', 'house', 'ginger'];
const TAG_COL = { snowman: '#f0a32a', santa: '#d8353f', reindeer: '#4f8fc8', tree: '#3f9a4f', house: '#35ab9e', ginger: '#e07a4f' };
function tagKind(id) { let h = 0; for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return TAG_KINDS[h % TAG_KINDS.length]; }
const tC = (g, x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, TAU); };
const tE = (g, x, y, rx, ry, a) => { g.beginPath(); g.ellipse(x, y, rx, ry, a || 0, 0, TAU); };
function tFill(g, col, lw) { g.fillStyle = col; g.fill(); if (lw !== 0) { g.strokeStyle = TG.line; g.lineWidth = lw || 3; g.stroke(); } }
/* silhouettes: the outer shape of each topper, used for the white die-cut border */
const sC = (g, x, y, r) => { g.moveTo(x + r, y); g.arc(x, y, r, 0, TAU); };
const sE = (g, x, y, rx, ry, a) => { g.moveTo(x + rx * Math.cos(a || 0), y + rx * Math.sin(a || 0)); g.ellipse(x, y, rx, ry, a || 0, 0, TAU); };
const TAG_SIL = {
  snowman: g => { sC(g, 0, -60, 74); g.rect(-62, -178, 124, 30); g.rect(-38, -246, 76, 80); },
  santa: g => { sC(g, 0, -60, 78); g.moveTo(-86, -92); g.quadraticCurveTo(-10, -260, 96, -150); g.lineTo(86, -92); g.closePath(); sC(g, 112, -150, 24); },
  reindeer: g => { sE(g, 0, -64, 76, 66); for (const sd of [-1, 1]) [[26, -116], [37, -140], [49, -165], [60, -190], [72, -214], [72, -176], [84, -181], [96, -186], [53, -211], [46, -230]].forEach(([x, y]) => sC(g, sd * x, y, 16)); sE(g, -88, -96, 34, 18, -.4); sE(g, 88, -96, 34, 18, .4); },
  tree: g => { g.moveTo(0, -250); g.lineTo(70, -150); g.lineTo(46, -150); g.lineTo(110, -50); g.lineTo(-110, -50); g.lineTo(-46, -150); g.lineTo(-70, -150); g.closePath(); },
  house: g => { g.moveTo(-170, -20); g.lineTo(0, -190); g.lineTo(170, -20); g.closePath(); g.rect(80, -210, 46, 120); },
  ginger: g => { sC(g, 0, -64, 66); g.moveTo(-66, -88); g.quadraticCurveTo(0, -250, 80, -130); g.lineTo(66, -88); g.closePath(); sC(g, 92, -136, 22); sE(g, -360, 10, 60, 36, -.5); sE(g, 360, 10, 60, 36, .5); }
};
/* the drawings themselves */
const TAG_ART = {
  snowman: (g, t) => {
    tC(g, 0, -60, 66); tFill(g, TG.white);
    tC(g, -34, -46, 11); g.fillStyle = TG.cheek; g.fill(); tC(g, 34, -46, 11); g.fill();
    g.strokeStyle = TG.dark; g.lineWidth = 4; g.lineCap = 'round';
    for (const sd of [-1, 1]) { g.beginPath(); g.arc(sd * 22, -66, 8, 1.1 * Math.PI, 1.9 * Math.PI); g.stroke(); }
    g.beginPath(); g.moveTo(-4, -52); g.lineTo(26, -46); g.lineTo(-4, -42); g.closePath(); g.fillStyle = TG.orange; g.fill();
    g.beginPath(); g.arc(0, -40, 12, .2 * Math.PI, .8 * Math.PI); g.stroke();
    g.beginPath(); g.rect(-60, -130, 120, 16); tFill(g, TG.black); g.beginPath(); g.rect(-36, -200, 72, 74); tFill(g, TG.black);
    g.fillStyle = TG.red; g.fillRect(-36, -146, 72, 14);
    tC(g, -18, -152, 6); g.fillStyle = TG.red; g.fill(); tE(g, -28, -158, 10, 5, -.5); g.fillStyle = TG.green; g.fill(); tE(g, -6, -160, 10, 5, .5); g.fill();
    g.beginPath(); g.moveTo(-58, -10); g.quadraticCurveTo(0, 10, 58, -10); g.lineTo(58, 8); g.quadraticCurveTo(0, 28, -58, 8); g.closePath(); tFill(g, TG.red);
    g.beginPath(); g.rect(24, 4, 22, 54); tFill(g, TG.redD);
  },
  santa: (g, t) => {
    tC(g, 0, -40, 72); tFill(g, TG.white);                         // beard
    tE(g, 0, -70, 54, 46); tFill(g, TG.skin);
    for (const sd of [-1, 1]) { tC(g, sd * 22, -76, 9); g.fillStyle = TG.black; g.fill(); tC(g, sd * 22 + 3, -79, 3); g.fillStyle = '#fff'; g.fill(); tE(g, sd * 24, -96, 16, 8); tFill(g, TG.white, 2); }
    tE(g, -18, -48, 22, 11, .2); tFill(g, TG.white, 2); tE(g, 18, -48, 22, 11, -.2); tFill(g, TG.white, 2);
    tC(g, 0, -56, 10); tFill(g, TG.cheek, 2);
    g.beginPath(); g.moveTo(-10, -32); g.quadraticCurveTo(0, -20, 10, -32); g.closePath(); g.fillStyle = '#f08a9a'; g.fill();
    g.beginPath(); g.moveTo(-70, -108); g.quadraticCurveTo(-10, -240, 100, -150); g.lineTo(60, -112); g.closePath(); tFill(g, TG.red);
    g.beginPath(); g.roundRect(-78, -124, 156, 30, 15); tFill(g, TG.white);
    tC(g, 108, -150, 20); tFill(g, TG.white);
  },
  reindeer: (g, t) => {
    g.strokeStyle = TG.brownD; g.lineWidth = 11; g.lineCap = 'round';
    for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(sd * 26, -116); g.lineTo(sd * 72, -214); g.moveTo(sd * 48, -166); g.lineTo(sd * 96, -186); g.moveTo(sd * 60, -192); g.lineTo(sd * 46, -230); g.stroke(); }
    for (const sd of [-1, 1]) { tE(g, sd * 84, -96, 30, 14, sd * .4); tFill(g, TG.brown); }
    tE(g, 0, -64, 68, 58); tFill(g, TG.brown);
    tE(g, 0, -34, 40, 26); tFill(g, '#e6b98a', 0);
    for (const sd of [-1, 1]) { tC(g, sd * 24, -74, 10); g.fillStyle = TG.black; g.fill(); tC(g, sd * 24 + 3, -77, 3.5); g.fillStyle = '#fff'; g.fill(); }
    tE(g, 0, -42, 16, 12); tFill(g, TG.red, 2); tC(g, -5, -46, 4); g.fillStyle = 'rgba(255,255,255,.7)'; g.fill();
    for (const sd of [-1, 1]) { tE(g, sd * 120, 4, 20, 14); tFill(g, TG.red); }   // mittens on the edge
  },
  tree: (g, t) => {
    g.beginPath(); g.moveTo(0, -238); g.lineTo(62, -152); g.lineTo(40, -152); g.lineTo(100, -60); g.lineTo(-100, -60); g.lineTo(-40, -152); g.lineTo(-62, -152); g.closePath(); tFill(g, TG.green);
    [[-30, -90, '#f2c14e'], [24, -116, TG.red], [-6, -160, '#f2c14e'], [50, -76, '#f2c14e'], [-50, -120, TG.red]].forEach(([x, y, c]) => drawStarShape(g, x, y, 9, c, 0));
    drawStarShape(g, 0, -244, 16, '#f2c14e', 0);
  },
  house: (g, t) => {
    g.beginPath(); g.rect(84, -200, 38, 100); tFill(g, TG.brick); g.beginPath(); g.roundRect(78, -214, 50, 18, 9); tFill(g, TG.white, 2);
    g.beginPath(); g.moveTo(-160, -24); g.lineTo(0, -180); g.lineTo(160, -24); g.closePath(); tFill(g, TG.brick);
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2; for (let r = 0; r < 5; r++) { g.beginPath(); g.moveTo(-130 + r * 26, -50 - r * 26); g.lineTo(130 - r * 26, -50 - r * 26); g.stroke(); }
    g.beginPath(); g.moveTo(-176, -14); g.lineTo(0, -196); g.lineTo(176, -14); for (let i = 0; i <= 6; i++) { const k = i / 6; g.lineTo(176 - k * 176 - 6, -14 - k * 160 + 20 + (i % 2) * 14); } g.closePath(); tFill(g, TG.white, 2);
    tC(g, 0, -86, 26); tFill(g, TG.sky); g.strokeStyle = TG.white; g.lineWidth = 4; g.beginPath(); g.moveTo(0, -112); g.lineTo(0, -60); g.moveTo(-26, -86); g.lineTo(26, -86); g.stroke();
  },
  ginger: (g, t) => {
    for (const sd of [-1, 1]) { tE(g, sd * 360, 10, 52, 30, sd * .5); tFill(g, TG.brown); g.save(); g.translate(sd * 370, 8); g.rotate(sd * .5); g.strokeStyle = '#fff'; g.lineWidth = 4; g.beginPath(); g.moveTo(-12, -10); g.lineTo(-4, 8); g.lineTo(4, -10); g.lineTo(12, 8); g.stroke(); g.restore(); }
    tC(g, 0, -60, 60); tFill(g, TG.brown);
    for (const sd of [-1, 1]) { tC(g, sd * 20, -66, 7); g.fillStyle = TG.black; g.fill(); }
    g.strokeStyle = TG.black; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.arc(0, -50, 20, .2 * Math.PI, .8 * Math.PI); g.stroke();
    g.beginPath(); g.moveTo(-58, -92); g.quadraticCurveTo(0, -230, 78, -134); g.lineTo(52, -100); g.closePath(); tFill(g, TG.red);
    g.beginPath(); g.roundRect(-68, -112, 136, 26, 13); tFill(g, TG.white); tC(g, 88, -134, 18); tFill(g, TG.white);
    g.beginPath(); g.moveTo(0, -4); g.lineTo(-22, -16); g.lineTo(-22, 8); g.closePath(); g.moveTo(0, -4); g.lineTo(22, -16); g.lineTo(22, 8); g.closePath(); g.fillStyle = TG.red; g.fill();
  }
};
function tinyTree(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = TG.greenD; g.beginPath(); g.moveTo(0, -14); g.lineTo(8, -2); g.lineTo(4, -2); g.lineTo(10, 8); g.lineTo(-10, 8); g.lineTo(-4, -2); g.lineTo(-8, -2); g.closePath(); g.fill(); g.fillStyle = TG.brownD; g.fillRect(-2, 8, 4, 4); g.restore(); }
/* the tag: body 760 x 350, centred; the topper sits on its top edge */
function drawGiftTag(kind, title, icon, msg, t, tt) {
  const g = ctx, bw = 760, top = -170, bh = 350, sil = TAG_SIL[kind];
  const body = () => { g.beginPath(); g.roundRect(-bw / 2, top, bw, bh, 130); };
  // die-cut border: grey edge, then the white sticker margin, then the white face
  g.save(); g.lineJoin = 'round';
  g.shadowColor = 'rgba(0,0,0,.28)'; g.shadowBlur = 24; g.shadowOffsetY = 10;
  body(); g.save(); g.translate(0, top + 40); sil(g); g.restore();
  g.lineWidth = 34; g.strokeStyle = TG.line; g.stroke(); g.fillStyle = TG.line; g.fill();
  g.shadowColor = 'transparent';
  g.lineWidth = 28; g.strokeStyle = TG.white; g.stroke(); g.fillStyle = TG.white; g.fill();
  g.restore();
  // the character, standing on the top edge (a gentle bob)
  g.save(); g.translate(0, top + 40 + (REDUCE_MOTION ? 0 : Math.sin(tt * 2.2) * 2)); TAG_ART[kind](g, t); g.restore();
  // title ribbon with a tiny tree each side
  const col = TAG_COL[kind]; g.save(); g.font = fontFor(26, 800); const tw = g.measureText(title.toUpperCase()).width + 48; g.restore();
  const ty = top + 92; g.beginPath(); g.roundRect(-tw / 2, ty - 24, tw, 48, 24); g.fillStyle = col; g.fill();
  text(g, title.toUpperCase(), 0, ty + 1, { size: 26, color: '#fff', weight: 800 });
  tinyTree(g, -tw / 2 - 22, ty, 1.4); tinyTree(g, tw / 2 + 22, ty, 1.4);
  // icon and instruction
  g.save(); g.translate(-268, 36); g.scale(1.25, 1.25); howIcon(icon, 0, 0, t); g.restore();
  const lines = wrapLines(g, msg, 470, 30, 800);
  lines.forEach((ln, j) => text(g, ln, -190, 36 + (j - (lines.length - 1) / 2) * 38, { size: 30, align: 'left', color: TG.dark, weight: 800 }));
  const a = .6 + .4 * Math.sin(tt * 4); g.globalAlpha = a; text(g, 'Tap or swipe to start', 0, top + bh - 34, { size: 22, color: TG.line, weight: 700 }); g.globalAlpha = 1;
}
drawHow = function () {
  const H0 = howCard, h = HOWTO[H0.id], t = gameTime;
  const now = performance.now(), dt = Math.min(.05, (now - (H0.last || now)) / 1000); H0.last = now; H0.t += dt;
  const tt = H0.t, rm = REDUCE_MOTION;
  if (!H0.drag && !H0.out) { const k = 260, c = 26; H0.vx += (-k * H0.dx - c * H0.vx) * dt; H0.dx += H0.vx * dt; }
  let outK = 0; if (H0.out) { H0.out.t += dt; outK = E.inOut(H0.out.t / .34); if (H0.out.t >= .34) { howCard = null; audio.sfx('pop'); return; } }
  ctx.fillStyle = 'rgba(40,20,22,' + (.42 * Math.min(1, tt / .3) * (1 - outK)) + ')'; ctx.fillRect(-W, -H, W * 3, H * 3);
  const sc = rm ? 1 : 1 - .3 * Math.exp(-6.5 * tt) * Math.cos(15 * tt), wob = rm ? 0 : -.06 * Math.exp(-4.2 * tt) * Math.sin(13 * tt);
  const offX = H0.dx + (H0.out ? (H0.out.x0 + H0.out.dir * 1400 * outK) - H0.dx : 0);
  ctx.save(); ctx.translate(W / 2 + offX, H / 2 + 40); ctx.rotate(-.02 + wob + offX / 3000); ctx.scale(sc, sc);
  drawGiftTag(tagKind(H0.id), GAMES[H0.id] ? gname(H0.id) : (STORY_TITLES[H0.id] || ''), h.icon, h.line, t, tt);
  ctx.restore();
};
