/* ============ v5.1 LETTERING: tall hand-cut capitals, each letter its own colour, with a chunky 3D block shadow ============
   Inspired by the "CHRISTMAS" poster: condensed capitals (Anton), red, olive, pink, cream, coral and mint,
   each pushed out with a solid extruded shadow in a partner colour, every letter at a slightly different angle. */
const XL_PAIRS = [['#c0322b', '#ec7ea8'], ['#a99e52', '#2b6a4c'], ['#ec7ea8', '#f4eee6'], ['#f4eee6', '#74b8a5'], ['#e5675f', '#c0322b'], ['#74b8a5', '#1d3b31'], ['#f4eee6', '#c0322b']];
const F_LETTER = '"Anton", "Lilita One", "Arial Narrow", sans-serif';
function xTitle(msg, x, y, size, o) {
  o = o || {}; const g = o.g || ctx, s = String(msg).toUpperCase(), seed = o.seed || 0;
  g.save(); g.font = '400 ' + size + 'px ' + F_LETTER; g.textBaseline = 'middle'; g.textAlign = 'center';
  const track = size * .04, ws = [...s].map(ch => g.measureText(ch).width + (ch === ' ' ? size * .1 : track));
  let tw = ws.reduce((a, b) => a + b, 0) - track; const k = o.maxW && tw > o.maxW ? o.maxW / tw : 1;
  g.translate(x, y); g.scale(k, k); if (o.rot) g.rotate(o.rot);
  let cx = -tw / 2; const depth = Math.max(2, Math.round(size * .075)), t = o.t || 0;
  [...s].forEach((ch, i) => {
    const w = ws[i]; if (ch !== ' ') {
      const P = o.mono ? o.mono : XL_PAIRS[(i * 3 + seed) % XL_PAIRS.length], h = Math.sin(i * 12.9898 + seed * 3.1) * 43758.5453 % 1;
      const rot = (h - .5) * .09 + (o.wobble ? Math.sin(t * 3 - i * .6) * .04 : 0), dy = (h - .5) * size * .05 + (o.wobble ? Math.sin(t * 4 - i * .45) * size * .05 : 0);
      g.save(); g.translate(cx + w / 2 - track / 2, dy); g.rotate(rot);
      g.fillStyle = P[1]; for (let d = depth; d >= 1; d--) g.fillText(ch, d * .9, d);
      g.fillStyle = P[0]; g.fillText(ch, 0, 0);
      g.restore();
    }
    cx += w;
  });
  g.restore();
}
/* display text everywhere (buttons, big numbers, headings) becomes the tall condensed capitals */
fontFor = function (size, weight, o) {
  if (o && o.pixel) return '400 ' + size + 'px ' + F_PIXEL;
  if ((o && o.display) || (size >= 34 && (weight || 600) >= 700)) return '400 ' + Math.round(size * 1.08) + 'px ' + F_LETTER;
  return bodyW(weight) + ' ' + size + 'px ' + F_BODY;
};
{ const _text = text; text = function (g, s, x, y, o) { o = o || {}; const disp = !o.pixel && (o.display || ((o.size || 28) >= 34 && (o.weight || 600) >= 700)); _text(g, disp ? String(s).toUpperCase() : s, x, y, o); }; }
/* headline moments use the full multi-colour lettering */
xBanner = function (msg, x, y, w) { xTitle(msg, x, y + 4, 66, { maxW: w + 120, seed: 1 }); };
bigText = function (msg, x, y, size, col, k) { ctx.save(); ctx.translate(x, y); const s = E.back(clamp(k, 0, 1)); ctx.scale(s, s); xTitle(msg, 0, 0, size * 1.15, { rot: -.03, seed: msg.length, maxW: AS.w - 60 }); ctx.restore(); };
/* the home sign: a pine-green board with a tile strip, "MONA'S" over a big multi-colour "CHRISTMAS", then "ADVENTURE" */
SCENES.home.drawSign = function (t) {
  const tk = E.back(Math.min(1, this.t / .9)), sw = Math.sin(t * 1.3) * .015;
  ctx.save(); ctx.translate(W / 2, PORT ? 150 : 128); ctx.rotate(sw); const sk = PORT ? .7 : .56; ctx.scale(tk * sk, tk * sk);
  ctx.save(); ctx.shadowColor = 'rgba(20,10,5,.45)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 12; rr(ctx, -470, -150, 940, 320, 40); fillP(ctx, '#253a33'); ctx.restore();
  ctx.save(); rr(ctx, -470, -150, 940, 320, 40); ctx.clip(); xStrip(-470, -150, 940, 26, 2); xStrip(-470, 144, 940, 26, 7); ctx.restore();
  xTitle("Mona's", 0, -86, 58, { seed: 4, rot: -.03, wobble: true, t });
  xTitle('Christmas', 0, 6, 116, { seed: 0, wobble: true, t, maxW: 820 });
  xTitle('Adventure', 0, 100, 62, { seed: 2, rot: .02, wobble: true, t });
  ctx.restore();
  text(ctx, 'starring Samantha & Mona', W / 2, PORT ? 292 : 236, { size: 24, color: '#fff8ec', weight: 700, stroke: 'rgba(30,50,40,.7)', sw: 7 });
};
