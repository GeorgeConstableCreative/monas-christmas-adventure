/* ---- v9.1: "Let's go gifting" typography ----
   Round geometric capitals (Jost, a Futura-style face) in pink, mustard, leaf green, petrol blue, grey and red.
   Letters are set tight so they overlap, and each sits slightly see-through so the overlaps mix like ink.
   Lines stack with tight leading so they overlap too, and each letter is nudged up or down a touch. */
const GT_COLS = ['#ff2e93', '#ffc400', '#25b33f', '#0a8be0', '#8f62f0', '#ff3a1f'];
const F_GEO2 = '"Jost", "Futura", "Century Gothic", "Avenir Next", sans-serif';
function geoLetters(g, S, size, o) {
  // draws S centred on (0,0); returns its width
  o = o || {}; g.font = '600 ' + size + 'px ' + F_GEO2; g.textBaseline = 'middle'; g.textAlign = 'left';
  const ch = [...S], ws = ch.map(c => g.measureText(c).width), ov = size * .09, tw = ws.reduce((a, b) => a + b, 0) - ov * (ch.length - 1);
  let px = -tw / 2, ci = 0; const seed = o.seed || 0, t = o.t || gameTime;
  ch.forEach((c, i) => {
    if (c === ' ') { px += ws[i] - ov * .2; return; }
    const k = o.enter ? o.enter(i) : 1; if (k <= 0) { px += ws[i] - ov; ci++; return; }
    const col = o.mono || GT_COLS[(ci * 5 + seed) % GT_COLS.length]; ci++;
    const dy = (((i * 37 + seed * 11) % 7) - 3) * size * .03 + (o.wobble && !REDUCE_MOTION ? Math.sin(t * 1.6 + i * .9) * size * .015 : 0);
    g.save(); g.translate(px + ws[i] / 2, dy + (1 - E.out(k)) * size * .25); g.scale(.85 + .15 * E.out(k), .85 + .15 * E.out(k));
    g.globalAlpha = .95 * k; g.fillStyle = col; g.fillText(c, -ws[i] / 2, 0); g.restore();
    px += ws[i] - ov;
  });
  return tw;
}
xTitle = function (msg, x, y, size, o) {
  o = o || {}; const g = o.g || ctx, S = String(msg).toUpperCase();
  g.save(); g.translate(x, y); if (o.rot) g.rotate(o.rot * .5);
  g.font = '600 ' + size + 'px ' + F_GEO2; const est = [...S].reduce((a, c) => a + g.measureText(c).width, 0) - size * .09 * (S.length - 1);
  if (o.maxW && est > o.maxW) { const k = o.maxW / est; g.scale(k, k); }
  geoLetters(g, S, size, o);
  g.restore();
};
// button and heading text: the same round geometric face, a little smaller so it fits where the condensed face did
{ const _ff = fontFor; fontFor = function (size, weight, o) { const f = _ff(size, weight, o); return f.indexOf('Anton') >= 0 ? '600 ' + Math.round(size * .94) + 'px ' + F_GEO2 : f; }; }
/* the home title: three stacked, overlapping lines that build letter by letter */
SCENES.home.drawSign = function (t) {
  const T0 = this.t, sk = PORT ? .72 : .58;
  ctx.save(); ctx.translate(W / 2, PORT ? 196 : 150); ctx.scale(sk, sk);
  const gl = ctx.createRadialGradient(0, 0, 80, 0, 0, 560); gl.addColorStop(0, 'rgba(250,248,244,.9)'); gl.addColorStop(.55, 'rgba(250,248,244,.6)'); gl.addColorStop(1, 'rgba(250,248,244,0)');
  ctx.save(); ctx.scale(1, .62); ctx.fillStyle = gl; ctx.fillRect(-600, -560, 1200, 1120); ctx.restore();
  const enter = d => i => clamp((T0 - d - i * .05) / .4, 0, 1);
  ctx.save(); ctx.translate(-40, -108); geoLetters(ctx, "MONA'S", 120, { seed: 0, enter: enter(0), wobble: true, t }); ctx.restore();
  ctx.save(); ctx.translate(0, 0); geoLetters(ctx, 'CHRISTMAS', 150, { seed: 3, enter: enter(.3), wobble: true, t }); ctx.restore();
  ctx.save(); ctx.translate(30, 112); geoLetters(ctx, 'ADVENTURE', 104, { seed: 1, enter: enter(.75), wobble: true, t }); ctx.restore();
  const sa = clamp((T0 - 1.3) / .4, 0, 1);
  if (sa > 0) { ctx.globalAlpha = sa; ctx.font = '500 34px ' + F_GEO2; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#3a3d44'; ctx.fillText('starring Samantha & Mona', 0, 196 + (1 - E.out(sa)) * 10); ctx.globalAlpha = 1; }
  ctx.restore();
};
