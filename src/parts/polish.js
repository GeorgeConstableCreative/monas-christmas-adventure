/* ============ v3 polish: shared bits that load last ============ */
/* A non-blocking explainer for the short story interludes: one line on an angled gift tag that jiggles in
   under the top bar, holds for a moment, and slides away by itself. */
let howToast = null;
function showToast(id) { if (HOWTO[id]) howToast = { id, t: 0 }; }
function drawToast() {
  if (!howToast) return; const T = howToast; T.t += 1 / 60; const h = HOWTO[T.id];
  const life = 3.4; if (T.t > life) { howToast = null; return; }
  const kin = E.back(clamp(T.t / .45, 0, 1)), kout = E.inOut(clamp((T.t - life + .4) / .4, 0, 1)), jg = jiggle(T.t, 2.1);
  ctx.save(); ctx.translate(W / 2, 128 - 160 * kout); ctx.rotate(-.025 + jg.rot); ctx.scale(kin * jg.sx, kin * jg.sy); ctx.globalAlpha = 1 - kout;
  ctx.font = '700 24px ' + FONT; const tw = Math.min(760, ctx.measureText(h.line).width + 120);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6; rr(ctx, -tw / 2, -34, tw, 68, 18); fillP(ctx, '#2b221f'); ctx.restore();
  rr(ctx, -tw / 2 + 5, -29, tw - 10, 58, 14); strokeP(ctx, 'rgba(242,184,58,.55)', 2);
  ctx.save(); ctx.translate(-tw / 2 + 38, 0); ctx.scale(.7, .7); howIcon(h.icon, 0, 0, T.t); ctx.restore();
  text(ctx, h.line, 22, 2, { size: 22, color: '#fff', weight: 700 });
  drawHolly(ctx, tw / 2 - 18, -30, .6);
  ctx.restore();
}
/* arcade juice: a global screen shake (decays fast; drawn around the scene only, never the HUD) */
let shakeK = 0;
function shake(k) { shakeK = Math.max(shakeK, k || .4); }
function shakeIn(dt) { shakeK = Math.max(0, shakeK - dt * 2.4); if (shakeK <= 0) return false; const a = shakeK * shakeK * 18; ctx.save(); ctx.translate(rand(-a, a), rand(-a, a)); return true; }
/* ---- Mona is a 7-year-old coon-type tabby: a big soft ruff, lynx tips on her ears, and a proper plume of a tail ---- */
const MONA_FUR = MC.fur;
const _drawMonaHead = drawMonaHead;
drawMonaHead = function (g, x, y, s, o) {
  o = o || {};
  if (MC.fur === MONA_FUR) {
    const t = o.t || 0, eu = o.earsUp ? 1.18 : 1, et = Math.sin(t * 1.3) * .04, eb = o.earsBack ? .55 : 0;
    g.save(); g.translate(x, y); g.scale(s, s); if (o.tilt) g.rotate(o.tilt);
    // ruff: a fluffy collar of fur round the cheeks and chest, behind the face
    g.beginPath(); const N = 26;
    for (let i = 0; i <= N; i++) { const a = Math.PI * (.12 + i / N * .76), r = (i % 2 ? 31 : 36) + Math.sin(i * 1.7) * 1.5; g.lineTo(Math.cos(a) * r * 1.02, 6 + Math.sin(a) * r * .78); }
    g.closePath(); ink(g, rad(g, 0, 22, 40, MC.light), 2);
    // lynx tips: little dark wisps off the top of each ear
    for (const sd of [-1, 1]) { g.save(); g.scale(sd, 1); g.rotate((sd === 1 ? et : -et) - eb); g.lineCap = 'round'; for (const [dx, dy, len] of [[0, 0, 14], [3, 1, 10], [-3, 2, 9]]) { g.beginPath(); g.moveTo(-25 + dx, -35 * eu + dy); g.quadraticCurveTo(-27 + dx, -42 * eu, -24 + dx * 1.6, -35 * eu - len); strokeP(g, MC.stripe, 2.6); } g.restore(); }
    g.restore();
  }
  _drawMonaHead(g, x, y, s, o);
};
monaTail = function (g, pts, t, wag) {
  g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
  const w = Math.sin(t * (wag || 2.2)) * 10, coon = MC.fur === MONA_FUR, th = coon ? .95 : .9;
  const P = [pts[0], pts[1], pts[2], pts[3], pts[4] + w, pts[5], pts[6] + w * 1.4, pts[7]];
  const bz = u => { const v = 1 - u; return [v * v * v * P[0] + 3 * v * v * u * P[2] + 3 * v * u * u * P[4] + u * u * u * P[6], v * v * v * P[1] + 3 * v * v * u * P[3] + 3 * v * u * u * P[5] + u * u * u * P[7]]; };
  const path = () => { g.beginPath(); g.moveTo(P[0], P[1]); g.bezierCurveTo(P[2], P[3], P[4], P[5], P[6], P[7]); };
  path(); strokeP(g, OUT, 19 * th); path(); strokeP(g, MC.fur, 13 * th);
  if (coon) { // a scalloped, fluffy edge: round-capped dashes either side of the plume
    path(); g.setLineDash([1, 9]); strokeP(g, OUT, 16); path(); strokeP(g, MC.fur, 12); g.setLineDash([]);
    path(); strokeP(g, MC.fur, 11);
  }
  path(); g.setLineDash([6, 10]); strokeP(g, MC.stripe, 13 * th * (coon ? .85 : 1)); g.setLineDash([]);
  const tp = bz(1); circ(g, tp[0], tp[1], 5.5); fillP(g, MC.stripe);
  g.restore();
};
