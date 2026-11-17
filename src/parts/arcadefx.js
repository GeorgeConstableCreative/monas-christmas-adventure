/* ---- v7.5: crisper arcade graphics and touch buttons ----
   Presents in Present Stack are proper little gifts: a lid, a ribbon cross, a bow and a shine.
   The thumb buttons under every arcade game become flat offset buttons (cream face, ink edge,
   block shadow) with clear icons and a one-word label. */
const GIFT_COLS = { I: ['#5cc8e8', '#ffffff'], O: ['#f2c14e', '#d8353f'], T: ['#8f62d6', '#f2c14e'], S: ['#3f9a4f', '#d8353f'], Z: ['#d8353f', '#f2c14e'], J: ['#3f6fe0', '#ffffff'], L: ['#f0883a', '#3f9a4f'] };
drawGift = function (g, x, y, c, kind, alpha) {
  const [base, rib] = GIFT_COLS[kind] || ['#d8353f', '#f2c14e'], m = c * .06, w = c - 2 * m, r = c * .16;
  g.save(); g.globalAlpha = alpha == null ? 1 : alpha;
  // box
  g.beginPath(); g.roundRect(x + m, y + m + c * .06, w, w - c * .06, r); g.fillStyle = shade(base, -.12); g.fill();
  // lid
  g.beginPath(); g.roundRect(x + m - c * .02, y + m + c * .06, w + c * .04, c * .3, r * .8); g.fillStyle = base; g.fill();
  // ribbon cross
  g.fillStyle = rib; g.fillRect(x + c / 2 - c * .09, y + m + c * .06, c * .18, w - c * .06); g.fillRect(x + m, y + m + c * .3, w, c * .09);
  // bow: two loops and a knot
  g.beginPath(); g.ellipse(x + c / 2 - c * .14, y + m + c * .06, c * .14, c * .09, -.4, 0, TAU); g.ellipse(x + c / 2 + c * .14, y + m + c * .06, c * .14, c * .09, .4, 0, TAU); g.fillStyle = rib; g.fill();
  g.beginPath(); g.arc(x + c / 2, y + m + c * .07, c * .07, 0, TAU); g.fillStyle = shade(rib === '#ffffff' ? '#d9e4ea' : rib, -.15); g.fill();
  // ink edge and a shine
  g.beginPath(); g.roundRect(x + m, y + m + c * .06, w, w - c * .06, r); g.lineWidth = Math.max(1.5, c * .05); g.strokeStyle = 'rgba(29,26,28,.85)'; g.stroke();
  g.globalAlpha *= .45; g.beginPath(); g.roundRect(x + m + c * .12, y + m + c * .44, c * .12, c * .3, c * .06); g.fillStyle = '#fff'; g.fill();
  g.restore();
};
/* the thumb-pad buttons */
const PAD_LABEL = { left: 'Move', right: 'Move', rotate: 'Turn', drop: 'Drop', up: 'Up', down: 'Down', jump: 'Jump', slide: 'Slide' };
padGlyph = function (g, x, y, s, col) {
  ctx.save(); ctx.translate(x, y - 10 * s); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 10 * s; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const chev = a => { ctx.save(); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(-10 * s, -20 * s); ctx.lineTo(10 * s, 0); ctx.lineTo(-10 * s, 20 * s); ctx.stroke(); ctx.restore(); };
  if (g === 'right') chev(0); else if (g === 'left') chev(Math.PI); else if (g === 'up' || g === 'jump') chev(-PI2); else if (g === 'down' || g === 'slide') chev(PI2);
  else if (g === 'rotate') {
    ctx.beginPath(); ctx.arc(0, 0, 19 * s, -Math.PI * .85, Math.PI * .55); ctx.stroke();
    const a = -Math.PI * .85, ex = Math.cos(a) * 19 * s, ey = Math.sin(a) * 19 * s; ctx.beginPath(); ctx.moveTo(ex - 13 * s, ey - 3 * s); ctx.lineTo(ex + 1 * s, ey - 1 * s); ctx.lineTo(ex + 2 * s, ey - 15 * s); ctx.stroke();
  } else if (g === 'drop') { ctx.beginPath(); ctx.moveTo(0, -22 * s); ctx.lineTo(0, 10 * s); ctx.moveTo(-14 * s, -2 * s); ctx.lineTo(0, 12 * s); ctx.lineTo(14 * s, -2 * s); ctx.stroke(); ctx.beginPath(); ctx.roundRect(-20 * s, 20 * s, 40 * s, 7 * s, 3.5 * s); ctx.fill(); }
  ctx.restore();
};
drawPad = function () {
  PAD_BTNS = [];
  if (!PORT || !DOCK || !GAMES[sceneName] || sceneName === 'fight' || scene.res || scene.over || howCard || paused) return false;
  const y0 = DOCK.y + 4, A = { x: 24, y: y0, w: PW - 56, h: PH - SAFE_B - 24 - y0 }; if (A.h < 100) return false;
  const L = padLayout(sceneName, A); if (!L) return false;
  PAD_BTNS = L;
  for (const b of L) {
    const on = [...PAD_HELD.values()].includes(b), col = b.col || '#c8303c', h = b.h - 12, o = on ? 7 : 0;
    rr(ctx, b.x + 7, b.y + 8, b.w, h, 18); ctx.fillStyle = '#3a0d14'; ctx.fill();
    rr(ctx, b.x + o, b.y + o * 1.14, b.w, h, 18); ctx.fillStyle = on ? '#ffe9c4' : '#fff7ec'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#3a0d14'; ctx.stroke();
    const s = Math.min(1.5, Math.min(b.w, h) / 100), cx = b.x + o + b.w / 2, cy = b.y + o * 1.14 + h / 2;
    padGlyph(b.g, cx, cy, s, col);
    text(ctx, (sceneName === 'kart' && (b.g === 'left' || b.g === 'right') ? 'Steer' : PAD_LABEL[b.g] || '').toUpperCase(), cx, cy + 34 * s, { size: Math.max(13, 15 * s), color: '#3a1a1f', weight: 900 });
  }
  return true;
};
