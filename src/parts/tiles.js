/* ---- v6.2: decorative graphics in the flat Christmas-tile style ----
   Blush pink, cranberry, bright green and white. Simple flat icons with no outlines, one per tile,
   tiles separated by white gutters. Fewer, larger pieces of decoration. */
const TP = { pink: '#f4c9cb', crim: '#9c2330', red: '#d8353f', coral: '#e8705f', green: '#5fae55', dgreen: '#2f7d3b', lgreen: '#8cc152', white: '#ffffff', cream: '#f6edc8', black: '#231a1a' };
// the new palette for bars, panels and buttons
Object.assign(XC, { cream: TP.pink, pine: TP.crim, fir: TP.dgreen, red: TP.red, snow: TP.white, gold: '#f2c14e' });
Object.assign(XBTN.gift, { face: TP.dgreen, base: '#1f5a2a', ink: TP.white, chip: TP.pink, icon: 'gift' });
Object.assign(XBTN.candy, { face: TP.red, base: '#a5222c', ink: TP.white, chip: TP.pink, icon: 'tree' });
Object.assign(XBTN.arcade, { face: TP.crim, base: '#6e1621', ink: TP.white, chip: TP.green, icon: 'snowman' });
Object.assign(XBTN.gold, { face: TP.pink, base: '#d99da2', ink: TP.crim, chip: TP.crim, icon: 'stocking' });
Object.assign(XBTN.tag, { face: TP.pink, base: '#d99da2', ink: TP.crim, chip: TP.green, icon: 'peppermint' });

/* one flat icon centred at (x,y), about s across. Old icon names map onto the new set. */
const XI_MAP = { gift: 'gift', tree: 'tree', snowflake: 'sparkle', starburst: 'sparkle', sparkles: 'sparkle', bell: 'bauble', ornament: 'bauble', wreath: 'holly', wreathStripe: 'holly', poinsettia: 'holly', candy: 'cane', stripes: 'sweet', triangles: 'tree', dots: 'peppermint', santa: 'santa', star: 'star' };
xIcon = function (kind, x, y, s, bg, G) {
  const g = G || ctx, k = XI_MAP[kind] || kind, u = s / 100;
  g.save(); g.translate(x, y); g.scale(u, u); g.lineCap = 'butt'; g.lineJoin = 'miter';
  const C = (cx, cy, r, c) => { g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fillStyle = c; g.fill(); };
  const onDark = bg === TP.crim || bg === TP.red || bg === TP.dgreen || bg === TP.green;
  if (k === 'gift') {
    g.fillStyle = TP.white; g.beginPath(); g.roundRect(-24, -12, 48, 40, 5); g.fill();
    g.fillStyle = TP.dgreen; g.fillRect(-4, -12, 8, 40); g.fillRect(-24, 4, 48, 6);
    g.strokeStyle = TP.lgreen; g.lineWidth = 4; g.beginPath(); g.ellipse(-9, -19, 9, 6, -.2, 0, TAU); g.moveTo(18, -19); g.ellipse(9, -19, 9, 6, .2, 0, TAU); g.stroke();
  } else if (k === 'tree') {
    g.fillStyle = onDark && bg !== TP.crim ? TP.white : TP.dgreen;
    g.beginPath(); g.moveTo(0, -34); g.lineTo(16, -10); g.lineTo(9, -10); g.lineTo(24, 10); g.lineTo(15, 10); g.lineTo(32, 32); g.lineTo(-32, 32); g.lineTo(-15, 10); g.lineTo(-24, 10); g.lineTo(-9, -10); g.lineTo(-16, -10); g.closePath(); g.fill();
    g.strokeStyle = TP.red; g.lineWidth = 2.5; for (let i = 0; i < 4; i++) { g.beginPath(); const a = i * Math.PI / 4; g.moveTo(Math.cos(a) * 7, -38 + Math.sin(a) * 7); g.lineTo(-Math.cos(a) * 7, -38 - Math.sin(a) * 7); g.stroke(); }
  } else if (k === 'sparkle') {
    g.strokeStyle = onDark ? TP.white : TP.red; g.lineWidth = 4;
    for (let i = 0; i < 4; i++) { g.beginPath(); const a = i * Math.PI / 4, r = i % 2 ? 22 : 32; g.moveTo(Math.cos(a) * r, Math.sin(a) * r); g.lineTo(-Math.cos(a) * r, -Math.sin(a) * r); g.stroke(); }
  } else if (k === 'bauble') {
    g.fillStyle = TP.black; g.fillRect(-1.5, -40, 3, 14); g.fillRect(-6, -28, 12, 8);
    C(0, 2, 24, TP.dgreen); g.save(); g.beginPath(); g.arc(0, 2, 24, 0, TAU); g.clip(); g.fillStyle = TP.lgreen; g.fillRect(-30, 8, 60, 7); g.restore();
    g.fillStyle = TP.white; [-12, -4, 4, 12].forEach(xx => { g.beginPath(); g.ellipse(xx, -6, 2.6, 4, 0, 0, TAU); g.fill(); });
  } else if (k === 'holly') {
    g.fillStyle = TP.lgreen;
    for (const sd of [-1, 1]) { g.save(); g.scale(sd, 1); g.rotate(.5); g.beginPath(); g.moveTo(0, 0); g.lineTo(-6, -10); g.lineTo(-2, -14); g.lineTo(-8, -24); g.lineTo(-2, -28); g.lineTo(-4, -38); g.lineTo(8, -30); g.lineTo(10, -20); g.lineTo(14, -14); g.lineTo(8, -6); g.closePath(); g.fill(); g.restore(); }
    C(-6, 10, 9, onDark ? TP.white : TP.red); C(9, 6, 6.5, onDark ? TP.white : TP.red);
  } else if (k === 'cane') {
    g.save(); g.lineWidth = 11; g.strokeStyle = TP.white; g.beginPath(); g.moveTo(10, 34); g.lineTo(10, -14); g.arc(-4, -14, 14, 0, Math.PI, true); g.lineTo(-18, -6); g.stroke();
    g.setLineDash([6, 7]); g.strokeStyle = TP.dgreen; g.stroke(); g.restore();
  } else if (k === 'peppermint') {
    for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 28, i * Math.PI / 4, (i + 1) * Math.PI / 4); g.closePath(); g.fillStyle = i % 2 ? TP.white : TP.red; g.fill(); }
  } else if (k === 'sweet') {
    g.save(); g.beginPath(); g.arc(0, 0, 16, 0, TAU); g.moveTo(-14, 0); g.lineTo(-36, -14); g.lineTo(-36, 14); g.closePath(); g.moveTo(14, 0); g.lineTo(36, -14); g.lineTo(36, 14); g.closePath(); g.clip();
    g.fillStyle = TP.white; g.fillRect(-40, -20, 80, 40); g.fillStyle = TP.red; g.rotate(-.7); for (let i = -6; i < 6; i++) g.fillRect(i * 9, -50, 4.5, 100); g.restore();
  } else if (k === 'santa') {
    g.fillStyle = TP.red; g.beginPath(); g.moveTo(-15, -14); g.lineTo(0, -40); g.lineTo(15, -14); g.fill(); C(0, -42, 5, TP.white);
    g.fillStyle = TP.cream; g.beginPath(); g.ellipse(0, -4, 14, 12, 0, 0, TAU); g.fill();
    g.fillStyle = TP.white; g.fillRect(-18, -16, 36, 7);
    g.beginPath(); g.moveTo(-16, 0); g.quadraticCurveTo(-18, 26, 0, 36); g.quadraticCurveTo(18, 26, 16, 0); g.closePath(); g.fill(); C(0, -2, 5, TP.red);
  } else if (k === 'snowman') {
    C(0, 12, 22, TP.white); C(0, -20, 13, TP.white); C(0, 6, 3, TP.black); C(0, 18, 3, TP.black);
    g.strokeStyle = TP.black; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-18, 0); g.lineTo(-34, -12); g.moveTo(-28, -8); g.lineTo(-30, -16); g.moveTo(18, 0); g.lineTo(34, -12); g.moveTo(28, -8); g.lineTo(30, -16); g.stroke();
  } else if (k === 'stocking') {
    g.fillStyle = TP.red; g.fillRect(-14, -36, 28, 9);
    g.fillStyle = TP.white; g.beginPath(); g.moveTo(-12, -27); g.lineTo(12, -27); g.lineTo(12, 14); g.quadraticCurveTo(12, 32, -6, 32); g.lineTo(-22, 32); g.quadraticCurveTo(-34, 32, -34, 22); g.quadraticCurveTo(-34, 10, -12, 8); g.closePath(); g.fill();
    g.fillStyle = TP.coral; g.beginPath(); g.moveTo(-22, 32); g.quadraticCurveTo(-34, 32, -34, 22); g.quadraticCurveTo(-34, 14, -26, 11); g.quadraticCurveTo(-30, 24, -22, 32); g.fill();
  } else if (k === 'hat') {
    g.fillStyle = TP.red; g.beginPath(); g.moveTo(-22, 18); g.lineTo(0, -28); g.lineTo(22, 18); g.fill(); C(0, -30, 7, TP.white); g.fillStyle = TP.white; g.beginPath(); g.roundRect(-28, 16, 56, 11, 5.5); g.fill();
  } else if (k === 'star') {
    drawStarShape(g, 0, 0, 30, XC.gold, 0);
  }
  g.restore();
};
/* tiles: pink, cranberry and green squares with white gutters, one big icon each */
const XT_SEQ = [['santa', TP.pink], ['stocking', TP.crim], ['snowman', TP.green], ['peppermint', TP.pink], ['cane', TP.pink], ['bauble', TP.pink], ['holly', TP.crim], ['tree', TP.pink], ['hat', TP.crim], ['sweet', TP.pink], ['gift', TP.pink]];
xQuilt = function (x, y, w, h, cell, seed, alpha, G) {
  const g = G || ctx, gut = Math.max(3, cell * .05);
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); if (alpha != null) g.globalAlpha = alpha;
  g.fillStyle = TP.white; g.fillRect(x, y, w, h);
  const cols = Math.ceil(w / cell) + 1, rows = Math.ceil(h / cell) + 1;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const [kind, bg] = XT_SEQ[(r * 4 + c * 3 + (seed || 0)) % XT_SEQ.length], tx = x + c * cell, ty = y + r * cell;
    g.fillStyle = bg; g.fillRect(tx + gut / 2, ty + gut / 2, cell - gut, cell - gut);
    xIcon(kind, tx + cell / 2, ty + cell / 2, cell * .66, bg, g);
  }
  g.restore();
};
/* the thin festive edge: a few long flat blocks with white gaps, no tiny icons */
xStrip = function (x, y, w, cell, seed) {
  const cols = [TP.crim, TP.pink, TP.green, TP.pink], bw = cell * 6, gap = Math.max(3, cell * .2), hh = Math.max(6, cell * .45), yy = y + (cell - hh) / 2;
  ctx.save(); ctx.fillStyle = TP.white; ctx.fillRect(x, yy - gap / 2, w, hh + gap);
  for (let i = 0, px = x - ((seed || 0) % 4) * bw * .25; px < x + w; i++, px += bw) { ctx.fillStyle = cols[(i + (seed || 0)) % 4]; ctx.fillRect(px + gap / 2, yy, bw - gap, hh); }
  ctx.restore();
};
/* the bottom panel: cranberry, with the simple strip along the top */
dockBg = function (y0) { ctx.fillStyle = TP.crim; ctx.fillRect(0, y0, PW, PH - y0); xStrip(0, y0, PW, 22, 1); if (DOCK) DOCK.y = Math.max(DOCK.y, y0 + 34); };
/* panels: cranberry card, thin pink inset line, one icon tile in the corner */
panel = function (x, y, w, h) {
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 10; rr(ctx, x, y, w, h, 24); fillP(ctx, TP.crim); ctx.restore();
  rr(ctx, x + 12, y + 12, w - 24, h - 24, 16); strokeP(ctx, 'rgba(244,201,203,.5)', 2.5);
  ctx.save(); rr(ctx, x, y, w, h, 24); ctx.clip(); ctx.fillStyle = TP.green; ctx.fillRect(x + w - 74, y, 74, 74); xIcon('holly', x + w - 37, y + 37, 56, TP.green); ctx.restore();
};
/* menu backdrops: the tile quilt, not darkened, with no falling snow on top */
vpBackdrop = function (t) { ctx.save(); ctx.setTransform(K, 0, 0, K, 0, 0); ctx.drawImage(xQuiltCached(PW, Math.ceil(PH), 190, 0), 0, 0, PW, Math.ceil(PH)); ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(0, 0, PW, PH); ctx.restore(); };
menuBackdrop = function (t) { ctx.drawImage(xQuiltCached(W, H, 190, 0), 0, 0, W, H); ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(0, 0, W, H); };
/* small section labels sit on a cranberry tag so they read on any background */
capsTitle = function (s, x, y, o) {
  o = Object.assign({ size: 20, weight: 700 }, o || {}); const S = s.toUpperCase();
  ctx.save(); ctx.font = fontFor(o.size, o.weight); const w = ctx.measureText(S).width + o.size * 1.2, h = o.size * 1.7;
  const lx = o.align === 'left' ? x - o.size * .6 : x - w / 2;
  rr(ctx, lx, y - h / 2, w, h, h / 2); ctx.fillStyle = TP.crim; ctx.fill(); ctx.restore();
  text(ctx, S, o.align === 'left' ? x : x, y + 1, Object.assign({}, o, { color: TP.white }));
};
/* menu titles sit on a white band so the coloured letters read over the tiles */
{
  const _xb = xBanner;
  xBanner = function (msg, x, y, w) { ctx.save(); rr(ctx, x - w / 2 - 50, y - 44, w + 100, 96, 18); ctx.fillStyle = TP.white; ctx.fill(); ctx.restore(); _xb(msg, x, y, w); };
}
