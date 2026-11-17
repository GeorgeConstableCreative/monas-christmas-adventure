/* ---- v9: flat vector science style ----
   The look of a science explainer: no outlines at all (shapes sit edge to edge as flat colour), bold
   saturated colour, cool blue-grey neutrals, and soft glowing light with a deep blue vignette.
   Faces keep their eyes, mouths and whiskers; only the outlines around shapes go. */
ink = function (g, fill) { g.fillStyle = fill; g.fill(); };
fillP = function (g, c) { g.fillStyle = c; g.fill(); };
capO = function (g, x1, y1, x2, y2, w, col) { capsule(g, x1, y1, x2, y2, w, col); };
// the story palette: inky darks stay, greys turn cool blue-grey, colours get bolder
palMap = function (c) {
  let v = PAL_CACHE.get(c); if (v !== undefined) return v;
  const p = palParse(c); if (!p) { PAL_CACHE.set(c, c); return c; }
  let [r, g, b, a] = p; r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0, l = (mx + mn) / 2;
  if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
  if (l < .14) v = c;
  else {
    if (s < .16) { h = 222 / 360; s = .06 + (1 - l) * .06; l = .16 + l * .8; }
    else { s = Math.min(1, s * 1.35 + .08); l = Math.min(.92, l * .96 + .02); }
    const q = l < .5 ? l * (1 + s) : l + s - l * s, pp = 2 * l - q, hue = t => { t = (t + 1) % 1; return t < 1 / 6 ? pp + (q - pp) * 6 * t : t < .5 ? q : t < 2 / 3 ? pp + (q - pp) * (2 / 3 - t) * 6 : pp; };
    v = 'rgba(' + Math.round(hue(h + 1 / 3) * 255) + ',' + Math.round(hue(h) * 255) + ',' + Math.round(hue(h - 1 / 3) * 255) + ',' + a + ')';
  }
  if (PAL_CACHE.size > 6000) PAL_CACHE.clear(); PAL_CACHE.set(c, v); return v;
};
PAL_CACHE.clear();
// soft glow from above and a deep blue vignette round the edges
vigDraw = function () {
  ctx.save();
  const gl = ctx.createRadialGradient(W * .5, H * .25, 40, W * .5, H * .25, W * .7); gl.addColorStop(0, 'rgba(255,240,220,.16)'); gl.addColorStop(1, 'rgba(255,240,220,0)');
  ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * .4, W / 2, H / 2, W * .78); vg.addColorStop(0, 'rgba(18,22,70,0)'); vg.addColorStop(1, 'rgba(18,22,70,.32)');
  ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  ctx.restore();
};
