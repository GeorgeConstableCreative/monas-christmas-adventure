/* ---- v5.2: the Christmas card, redesigned after the geometric "Merry & Bright" snowflake card ----
   A white six-armed snowflake cuts through overlapping flat blocks of mint, teal, olive, coral,
   crimson, gold and blush. Gold geometric caps sit in the white centre. */
const CX = { white: '#fbfaf7', mint: '#b2e2d3', teal: '#4ea995', olive: '#86a93b', coral: '#ea6670', crimson: '#cc2b3f', wine: '#a61f3b', gold: '#cbae38', blush: '#f4d4cd', ink: '#3b2f2a' };
const F_GEO = '"Jost", "Futura", "Century Gothic", "Avenir Next", sans-serif';
// colours for the 12 half-wedges (clockwise from the top arm's right side): [near the centre, out by the edge]
const CX_WEDGE = [
  ['coral', 'crimson'], ['gold', 'crimson'], ['blush', 'gold'], ['coral', 'crimson'],
  ['olive', 'teal'], ['gold', 'mint'], ['blush', 'gold'], ['coral', 'crimson'],
  ['olive', 'coral'], ['gold', 'mint'], ['blush', 'mint'], ['olive', 'teal']
];
function geoText(g, s, x, y, size, o) {
  o = o || {}; const sp = (o.track || .08) * size, wt = o.weight || 500;
  g.save(); g.font = wt + ' ' + size + 'px ' + F_GEO; g.textBaseline = 'middle'; g.textAlign = 'left';
  const ws = [...s].map(c => g.measureText(c).width), tw = ws.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
  let cx = x - tw / 2;
  const draw = (fill, dx, dy) => { let px = cx; [...s].forEach((c, i) => { g.fillStyle = fill; g.fillText(c, px + dx, y + dy); px += ws[i] + sp; }); };
  if (o.gold) {
    draw('rgba(120,90,20,.35)', 0, size * .05);           // pressed-in shadow, like foil on card stock
    FLATG = false; const gr = g.createLinearGradient(x - tw / 2, y - size / 2, x + tw / 2, y + size / 2); FLATG = true;
    const sh = o.shine == null ? -1 : o.shine;              // a soft light sweep across the foil
    gr.addColorStop(0, '#b38c2e'); gr.addColorStop(clamp(sh - .12, 0, 1), '#c9a447'); gr.addColorStop(clamp(sh, 0, 1), '#f6e4a6'); gr.addColorStop(clamp(sh + .12, 0, 1), '#c9a447'); gr.addColorStop(1, '#a8812a');
    draw(gr, 0, 0);
  } else draw(o.color || CX.ink, 0, 0);
  g.restore(); return tw;
}
/* the snowflake field: w×h, centred at (cx,cy), arms of width aw; k scales everything */
function xSnowField(g, w, h, cx, cy, k, t) {
  const R = Math.hypot(w, h) * 1.2, r0 = 62 * k, R1 = 150 * k, aw = 15 * k, bw = 13 * k, gap = 30 * k;
  g.save(); g.beginPath(); g.rect(0, 0, w, h); g.clip();
  g.fillStyle = CX.white; g.fillRect(0, 0, w, h);
  const dir = a => [Math.cos(a), Math.sin(a)];
  for (let arm = 0; arm < 6; arm++) {
    const a0 = -Math.PI / 2 + arm * Math.PI / 3;
    for (const s of [1, -1]) {
      const idx = s > 0 ? arm * 2 : (arm * 2 + 11) % 12, [cn, cf] = CX_WEDGE[idx];
      const a1 = a0 + s * Math.PI / 6, [ux, uy] = dir(a0), [vx, vy] = dir(a1);
      // the half wedge between this arm and the bisector
      g.save(); g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + ux * R, cy + uy * R); g.lineTo(cx + vx * R, cy + vy * R); g.closePath(); g.clip();
      // near block, with chevron branches cut out of it
      g.fillStyle = CX[cn]; g.fillRect(0, 0, w, h);
      // far block: everything past R1 measured along the arm
      const nx = -uy, ny = ux;
      g.beginPath(); const px = cx + ux * R1, py = cy + uy * R1;
      g.moveTo(px + nx * R, py + ny * R); g.lineTo(px - nx * R, py - ny * R); g.lineTo(px - nx * R + ux * R, py - ny * R + uy * R); g.lineTo(px + nx * R + ux * R, py + ny * R + uy * R); g.closePath();
      g.fillStyle = CX[cf]; g.fill();
      // a translucent darker sheet laid over part of the far block, like overlapping card stock
      g.globalAlpha = .55; g.globalCompositeOperation = 'multiply';
      g.beginPath(); const qx = cx + ux * (R1 + 70 * k), qy = cy + uy * (R1 + 70 * k), [bx, by] = dir(a0 + s * Math.PI / 3);
      g.moveTo(qx, qy); g.lineTo(qx + bx * R, qy + by * R); g.lineTo(qx + bx * R + ux * R, qy + by * R + uy * R); g.lineTo(qx + ux * R, qy + uy * R); g.closePath();
      g.fillStyle = idx % 3 === 0 ? CX.wine : idx % 3 === 1 ? CX.teal : CX.gold; g.fill();
      g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
      // white branches: bars running out from the arm at 60 degrees, only through the near block
      const [ox, oy] = dir(a0 + s * Math.PI / 3);
      g.strokeStyle = CX.white; g.lineWidth = bw; g.lineCap = 'butt';
      for (let i = 0; i < 4; i++) { const d = r0 + 6 * k + i * gap; if (d > R1 - 6 * k) break; const sx = cx + ux * d, sy = cy + uy * d; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + ox * R * .5, sy + oy * R * .5); g.stroke(); }
      g.restore();
    }
  }
  // the arms, running edge to edge
  g.strokeStyle = CX.white; g.lineWidth = aw; g.lineCap = 'butt';
  for (let arm = 0; arm < 3; arm++) { const [ux, uy] = dir(-Math.PI / 2 + arm * Math.PI / 3); g.beginPath(); g.moveTo(cx - ux * R, cy - uy * R); g.lineTo(cx + ux * R, cy + uy * R); g.stroke(); }
  // white hexagon in the middle for the words
  g.beginPath(); for (let i = 0; i < 6; i++) { const [hx, hy] = dir(-Math.PI / 2 + Math.PI / 6 + i * Math.PI / 3); const rr6 = r0 * 1.9; i ? g.lineTo(cx + hx * rr6, cy + hy * rr6) : g.moveTo(cx + hx * rr6, cy + hy * rr6); }
  g.closePath(); g.fillStyle = CX.white; g.fill();
  g.restore();
}
cardFront = function (g, w, h, t) {
  g.save(); rr(g, 0, 0, w, h, 6); g.clip();
  xSnowField(g, w, h, w / 2, h / 2, w / 420, t);
  // a light sweep crosses the foil every few seconds (slow in, slow out)
  const cyc = (t % 4.5) / 1.6, sh = cyc <= 1 ? lerp(-.2, 1.2, E.inOut(cyc)) : -1;
  geoText(g, 'MERRY', w / 2, h / 2 - 36, 34, { gold: true, shine: sh });
  geoText(g, '&', w / 2, h / 2 + 2, 30, { gold: true, shine: sh });
  geoText(g, 'BRIGHT', w / 2, h / 2 + 40, 34, { gold: true, shine: sh });
  geoText(g, 'FOR SAMANTHA', w / 2, h / 2 + 84, 11, { color: CX.wine, weight: 600, track: .3 });
  g.restore();
  rr(g, 0, 0, w, h, 6); strokeP(g, 'rgba(60,40,30,.25)', 1.5);
};
// thin band of the snowflake's colour blocks, used along the top of the inside pages
function cxBand(g, x, y, w, hgt) {
  const seq = ['mint', 'teal', 'olive', 'coral', 'crimson', 'gold', 'blush'], step = 26;
  g.save(); g.beginPath(); g.rect(x, y, w, hgt); g.clip(); g.fillStyle = CX.white; g.fillRect(x, y, w, hgt);
  for (let i = -2; i * step < w + hgt; i++) { g.beginPath(); g.moveTo(x + i * step, y + hgt); g.lineTo(x + i * step + hgt * .58, y); g.lineTo(x + i * step + hgt * .58 + step - 6, y); g.lineTo(x + i * step + step - 6, y + hgt); g.closePath(); g.fillStyle = CX[seq[((i % 7) + 7) % 7]]; g.fill(); }
  g.restore();
}
function cxFlake(g, x, y, r, col) {
  g.save(); g.translate(x, y); g.strokeStyle = col; g.lineWidth = r * .16; g.lineCap = 'butt';
  for (let i = 0; i < 6; i++) { g.save(); g.rotate(i * Math.PI / 3); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -r); for (const d of [.45, .72]) { g.moveTo(0, -r * d); g.lineTo(r * .28, -r * (d + .22)); g.moveTo(0, -r * d); g.lineTo(-r * .28, -r * (d + .22)); } g.stroke(); g.restore(); }
  g.restore();
}
cardInsideLeft = function (g, w, h, t) {
  rr(g, 0, 0, w, h, 6); ink(g, CX.white, 1.5);
  g.save(); rr(g, 0, 0, w, h, 6); g.clip(); cxBand(g, 0, 0, w, 14); cxBand(g, 0, h - 14, w, 14); g.restore();
  geoText(g, 'SECRET FOOTAGE', w / 2, 44, 22, { color: CX.crimson, weight: 600, track: .14 });
  geoText(g, 'RECOVERED FROM THE LIVING ROOM, 24 DECEMBER', w / 2, 70, 9.5, { color: CX.teal, weight: 500, track: .16 });
  const pw = (w - 66) / 2, ph = pw * .7;
  const labels = ['A  THE DANCE FLOOR', 'B  THE SOFA', 'C  THE CONGA', 'D  THE DJ'], tabs = [CX.coral, CX.teal, CX.gold, CX.olive];
  for (let i = 0; i < 4; i++) {
    const x = 22 + (i % 2) * (pw + 22), y = 112 + Math.floor(i / 2) * (ph + 76), rot = [-.03, .025, .02, -.025][i];
    g.save(); g.translate(x + pw / 2, y + ph / 2); g.rotate(rot);
    g.shadowColor = 'rgba(0,0,0,.18)'; g.shadowBlur = 6; g.shadowOffsetY = 2; g.fillStyle = '#fff'; g.fillRect(-pw / 2 - 6, -ph / 2 - 6, pw + 12, ph + 32); g.shadowColor = 'transparent';
    g.drawImage(cctvStill(i), -pw / 2, -ph / 2, pw, ph);
    // geometric photo corner in a card colour
    g.fillStyle = tabs[i]; g.beginPath(); g.moveTo(-pw / 2 - 6, -ph / 2 - 6); g.lineTo(-pw / 2 + 24, -ph / 2 - 6); g.lineTo(-pw / 2 - 6, -ph / 2 + 24); g.fill();
    geoText(g, 'EXHIBIT ' + labels[i], 0, ph / 2 + 13, 9, { color: CX.ink, weight: 600, track: .12 });
    g.restore();
  }
};
cardInsideRight = function (g, w, h, t, k) {
  rr(g, 0, 0, w, h, 6); ink(g, CX.white, 1.5);
  g.save(); rr(g, 0, 0, w, h, 6); g.clip(); cxBand(g, 0, 0, w, 14); cxBand(g, 0, h - 14, w, 14); g.restore();
  // a small snowflake settles in first, then the lines rise in one after another
  const fa = clamp(k / .5, 0, 1); g.globalAlpha = fa;
  g.save(); g.translate(w / 2, h * .2); g.rotate((1 - E.out(fa)) * .6); cxFlake(g, 0, 0, 34, CX.gold); g.restore();
  const lines = [[CARD_MSG[0], 24, CX.ink, 500], [CARD_MSG[1], 24, CX.ink, 500], [CARD_MSG[2], 30, CX.crimson, 600]];
  lines.forEach(([ln, sz, col, wt], i) => { const a = clamp((k - .3 - i * .35) / .4, 0, 1); g.globalAlpha = a; geoText(g, ln, w / 2, h * .38 + i * 58 + (i === 2 ? 14 : 0) + (1 - E.out(a)) * 12, sz, { color: col, weight: wt, track: .04 }); });
  const pa = clamp((k - 1.5) / .4, 0, 1); g.globalAlpha = pa;
  g.save(); g.translate(w / 2, h * .38 + 3 * 58 + 40); g.scale(.7 + .3 * E.out(pa), .7 + .3 * E.out(pa)); drawPaw(g, 0, 0, 1.6, CX.teal); g.restore();
  g.globalAlpha = 1;
};
/* the present gets matching wrapping paper: flat diagonal blocks in the card colours, gold ribbon */
drawPresentBox = function (g, bw, bh, t) {
  g.save(); rr(g, -bw / 2, -bh, bw, bh, 8); g.clip();
  g.fillStyle = CX.crimson; g.fillRect(-bw / 2, -bh, bw, bh);
  const seq = ['crimson', 'coral', 'blush', 'mint', 'teal', 'olive', 'gold'], st = 46;
  for (let i = -8; i < 12; i++) { g.beginPath(); g.moveTo(-bw / 2 + i * st, 0); g.lineTo(-bw / 2 + i * st + bh * .58, -bh); g.lineTo(-bw / 2 + i * st + bh * .58 + st - 10, -bh); g.lineTo(-bw / 2 + i * st + st - 10, 0); g.closePath(); g.fillStyle = CX[seq[((i % 7) + 7) % 7]]; g.fill(); }
  g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(bw * .25, -bh, bw * .25, bh);
  g.restore();
  g.fillStyle = CX.white; g.fillRect(-bw * .08, -bh, bw * .16, bh);
  g.fillStyle = CX.gold; g.fillRect(-bw * .055, -bh, bw * .11, bh);
};
drawPresentLid = function (g, bw, bh, t) {
  const lw = bw * 1.08, lh = bh * .24;
  rr(g, -lw / 2, -lh, lw, lh, 8); fillP(g, CX.wine);
  g.fillStyle = CX.white; g.fillRect(-bw * .08, -lh, bw * .16, lh); g.fillStyle = CX.gold; g.fillRect(-bw * .055, -lh, bw * .11, lh);
  // a flat, folded geometric bow
  const wob = Math.sin(t * 6) * .04; g.save(); g.translate(0, -lh); g.rotate(wob);
  for (const sd of [-1, 1]) {
    g.beginPath(); g.moveTo(0, 0); g.lineTo(sd * bw * .34, -bw * .2); g.lineTo(sd * bw * .34, bw * .02); g.closePath(); g.fillStyle = sd < 0 ? CX.gold : '#b8992c'; g.fill();
    g.beginPath(); g.moveTo(0, 0); g.lineTo(sd * bw * .16, bw * .2); g.lineTo(sd * bw * .06, bw * .2); g.closePath(); g.fillStyle = '#b8992c'; g.fill();
  }
  g.fillStyle = CX.white; g.fillRect(-bw * .045, -bw * .045, bw * .09, bw * .09);
  g.restore();
  // the gift tag
  g.save(); g.translate(lw * .32, -lh * .2); g.rotate(.25); line(g, 0, -10, -14, -24, CX.ink, 2);
  rr(g, -4, -12, 84, 40, 4); fillP(g, CX.white); cxFlake(g, 8, 8, 7, CX.teal);
  geoText(g, 'SAMANTHA', 46, 8, 11, { color: CX.crimson, weight: 600, track: .1 }); g.restore();
};
/* the scene around the card: the snowflake field, softened, instead of a night sky */
{
  const _draw = SCENES.card.draw;
  SCENES.card.draw = function () {
    const ph = this.ph;
    if (ph === 'drop' || ph === 'pop' || ph === 'look') {
      // paint the backdrop, then let the original draw the present on top with its own sky switched off
      const sk = Math.min(W, H) / 900;
      xSnowField(ctx, W, H, W / 2, H * .36, sk * 2.2, this.t);
      ctx.fillStyle = 'rgba(251,250,247,.35)'; ctx.fillRect(0, 0, W, H);
      this._skipSky = true;
    } else this._skipSky = false;
    _draw.call(this);
  };
}

/* behind the open card: flat blush with one big white snowflake, so the card reads as the hero */
SCENES.card.cardBg = function () {
  ctx.fillStyle = CX.blush; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = .55; ctx.translate(W / 2, H / 2 + 10); ctx.rotate(this.t * .03); cxFlake(ctx, 0, 0, Math.max(W, H) * .62, CX.white); ctx.restore();
};
