/* ---- v8.1: the title, no banner ----
   "CHRISTMAS" hangs letter by letter from a twine washing line with little wooden pegs, each letter
   swinging gently on its own. "Mona's" is written above in a looping script, "ADVENTURE" is set in
   widely spaced capitals between two stars, and "starring Samantha & Mona" sits underneath in script.
   The letters drop onto the line one after another when the home screen opens. */
const F_SCRIPT = '"Lobster", "Pacifico", "Brush Script MT", cursive';
function scriptText(s, x, y, size, fill, edge, rot) {
  ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.font = size + 'px ' + F_SCRIPT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round'; ctx.fillStyle = 'rgba(40,12,16,.45)'; ctx.fillText(s, 3, size * .08);
  ctx.lineWidth = size * .16; ctx.strokeStyle = edge; ctx.strokeText(s, 0, 0); ctx.fillStyle = fill; ctx.fillText(s, 0, 0);
  ctx.restore();
}
SCENES.home.drawSign = function (t) {
  const T0 = this.t, tk = E.back(Math.min(1, T0 / .7)), sk = PORT ? .7 : .56;
  ctx.save(); ctx.translate(W / 2, PORT ? 184 : 140); ctx.scale(sk, sk);
  // a soft shadowy glow behind the words so they read over the room (not a banner)
  const gl = ctx.createRadialGradient(0, 20, 60, 0, 20, 520); gl.addColorStop(0, 'rgba(40,16,14,.62)'); gl.addColorStop(.6, 'rgba(40,16,14,.35)'); gl.addColorStop(1, 'rgba(40,16,14,0)'); ctx.save(); ctx.scale(1, .55); ctx.fillStyle = gl; ctx.fillRect(-560, -460, 1120, 960); ctx.restore();
  // "Mona's" in script
  ctx.save(); ctx.globalAlpha = clamp(T0 / .4, 0, 1); scriptText("Mona's", -250, -168 - (1 - tk) * 20, 92, '#fff4e2', '#b3262f', -.08); ctx.restore();
  // the washing line and the hanging letters
  const word = 'CHRISTMAS', size = 128; ctx.font = '400 ' + Math.round(size * 1.08) + 'px ' + F_LETTER;
  const ws = [...word].map(c => ctx.measureText(c).width), gap = 14, tot = ws.reduce((a, b) => a + b, 0) + gap * (word.length - 1);
  const lineY = x => -112 + 46 * (1 - (2 * x / 960) ** 2);
  ctx.beginPath(); ctx.moveTo(-500, lineY(-500)); ctx.quadraticCurveTo(0, -112 + 92, 500, lineY(500)); ctx.lineWidth = 4; ctx.strokeStyle = '#e9d6b4'; ctx.stroke(); ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(80,50,30,.6)'; ctx.stroke();
  let x = -tot / 2;
  [...word].forEach((ch, i) => {
    const cx = x + ws[i] / 2, py = lineY(cx), k = clamp((T0 - .15 - i * .07) / .55, 0, 1), drop = 1 - E.back(k);
    x += ws[i] + gap; if (k <= 0) return;
    const sw = REDUCE_MOTION ? 0 : Math.sin(t * 1.5 + i * .8) * .05 + drop * .4 * (i % 2 ? 1 : -1);
    ctx.save(); ctx.translate(cx, py); ctx.rotate(sw); ctx.translate(0, -drop * 90);
    xTitle(ch, 0, 16 + size * .5, size, { seed: i * 5 + 1 });
    // the peg
    ctx.save(); ctx.rotate(-sw * .5); rr(ctx, -7, -16, 14, 34, 4); ctx.fillStyle = '#d9a86a'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = '#5a3a22'; ctx.stroke(); ctx.fillStyle = '#9a6a3a'; ctx.fillRect(-7, 2, 14, 3); ctx.restore();
    ctx.restore();
  });
  // ADVENTURE, spaced out between two stars
  const ak = clamp((T0 - .8) / .5, 0, 1);
  if (ak > 0) {
    ctx.save(); ctx.globalAlpha = ak; ctx.translate(0, 150 + (1 - E.out(ak)) * 16);
    const A = 'ADVENTURE', as = 54, sp = 18; ctx.font = '400 ' + Math.round(as * 1.08) + 'px ' + F_LETTER; const aw = [...A].map(c => ctx.measureText(c).width), at = aw.reduce((a, b) => a + b, 0) + sp * (A.length - 1);
    let ax = -at / 2; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.lineJoin = 'round';
    [...A].forEach((c, i) => { ctx.lineWidth = 9; ctx.strokeStyle = '#2f7d3b'; ctx.strokeText(c, ax, 0); ctx.fillStyle = '#fff4e2'; ctx.fillText(c, ax, 0); ax += aw[i] + sp; });
    for (const sd of [-1, 1]) { ctx.save(); ctx.translate(sd * (at / 2 + 44), -2); ctx.rotate(t * .6 * sd); drawStarShape(ctx, 0, 0, 22, '#f2c14e', 3); ctx.restore(); }
    ctx.restore();
  }
  // starring line in script
  const sk2 = clamp((T0 - 1.1) / .5, 0, 1);
  if (sk2 > 0) { ctx.save(); ctx.globalAlpha = sk2; scriptText('starring Samantha & Mona', 0, 222, 44, '#fff4e2', '#2f3a2f', 0); ctx.restore(); }
  ctx.restore();
};
