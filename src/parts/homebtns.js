/* ---- v9.4: home buttons ----
   Play/Continue is a big flat offset button (red face, ink edge, solid block shadow) with a play badge,
   the geometric capitals and, when resuming, where you're up to. Sections and Dress Mona sit below,
   and "Add to Home Screen" is a quiet button along the very bottom. */
function offsetFace(id, x, y, w, h, face, draw, onTap) {
  UI.button(id, x, y, w + 8, h + 9, () => {
    const dn = UI.pressed === id, o = dn ? 7 : 0;
    rr(ctx, x + 7, y + 9, w, h, 22); ctx.fillStyle = '#3a0d14'; ctx.fill();
    rr(ctx, x + o, y + o * 1.2, w, h, 22); ctx.fillStyle = face; ctx.fill(); ctx.lineWidth = 3.5; ctx.strokeStyle = '#3a0d14'; ctx.stroke();
    ctx.save(); ctx.translate(o, o * 1.2); draw(); ctx.restore();
  }, onTap);
}
function homeButtonsP(sc, t) {
  const V = vpXf(); ctx.save(); ctx.translate(V.ox, PH - SAFE_B - 372 * V.u); ctx.scale(V.u, V.u);
  const k = clamp((sc.t - .3) / .45, 0, 1); if (k <= 0) { ctx.restore(); return; }
  const e = E.out(k); ctx.globalAlpha = k; ctx.translate(0, (1 - e) * 30);
  const resume = save.story > 0 && save.story < STORY.length - 1;
  // the big Play / Continue
  const bx = 40, by = 6, bw = VPW - 88, bh = 128;
  offsetFace('play', bx, by, bw, bh, '#d8312b', () => {
    // a ribbon band across the face, like a wrapped present
    ctx.save(); rr(ctx, bx, by, bw, bh, 22); ctx.clip(); ctx.fillStyle = 'rgba(0,0,0,.1)'; ctx.fillRect(bx, by + bh - 18, bw, 18); ctx.restore();
    // play badge
    const cx = bx + 74, cy = by + bh / 2, pulse = REDUCE_MOTION ? 1 : 1 + .05 * Math.sin(t * 3);
    ctx.save(); ctx.translate(cx, cy); ctx.scale(pulse, pulse); ctx.beginPath(); ctx.arc(0, 0, 44, 0, TAU); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(-12, -20); ctx.lineTo(22, 0); ctx.lineTo(-12, 20); ctx.closePath(); ctx.fillStyle = '#d8312b'; ctx.fill(); ctx.restore();
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff';
    if (resume) {
      ctx.font = '700 52px ' + F_GEO2; ctx.fillText('CONTINUE', bx + 140, by + 50);
      let up = 'Up to: ' + (STORY_TITLES[STORY[save.story]] || ''); ctx.font = '500 25px ' + F_GEO2; while (ctx.measureText(up).width > bw - 170 && up.length > 10) up = up.slice(0, -2) + '…';
      ctx.fillStyle = '#ffe0dc'; ctx.fillText(up, bx + 142, by + 94);
    } else { ctx.font = '700 60px ' + F_GEO2; ctx.fillText('PLAY', bx + 150, by + bh / 2 + 2); }
  }, () => storyGo(resume ? save.story : 0));
  // Sections / Dress Mona
  const rw = (VPW - 100) / 2, ry = by + bh + 26;
  offsetFace('levels', 40, ry, rw, 76, '#1f6b33', () => { xIcon('gift', 40 + 46, ry + 40, 76, '#1f6b33'); text(ctx, 'Sections', 40 + rw / 2 + 24, ry + 39, { size: 30, color: '#fff', display: true }); }, () => go('levels'));
  offsetFace('wardrobe', 60 + rw, ry, rw, 76, '#fff7ec', () => { xIcon('hat', 60 + rw + 46, ry + 38, 76, '#fff7ec'); text(ctx, 'Dress Mona', 60 + rw + rw / 2 + 24, ry + 39, { size: 30, color: '#3a0d14', display: true }); }, () => go('dress'));
  // bottom line: Add to Home Screen, and Start again when resuming
  const ay = ry + 106;
  if (!A2.standalone) {
    const aw = resume ? (VPW - 100) * .62 : VPW - 88;
    offsetFace('a2hs', 40, ay, aw, 60, '#f4d4d6', () => {
      ctx.save(); ctx.translate(40 + 36, ay + 30); ctx.strokeStyle = '#0a7aff'; ctx.lineWidth = 3.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(0, 6); ctx.lineTo(0, -14); ctx.moveTo(-7, -7); ctx.lineTo(0, -14); ctx.lineTo(7, -7); ctx.moveTo(-5, -2); ctx.lineTo(-10, -2); ctx.lineTo(-10, 14); ctx.lineTo(10, 14); ctx.lineTo(10, -2); ctx.lineTo(5, -2); ctx.stroke(); ctx.restore();
      ctx.font = '600 24px ' + F_GEO2; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#3a0d14'; ctx.fillText('Add to Home Screen', 40 + aw / 2 + 18, ay + 31);
    }, () => a2Show());
    if (resume) offsetFace('startover', 60 + aw, ay, VPW - 108 - aw, 60, '#fff7ec', () => { ctx.font = '600 22px ' + F_GEO2; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#6b4a4f'; ctx.fillText('Start again', 60 + aw + (VPW - 108 - aw) / 2, ay + 31); }, () => storyGo(0));
  } else if (resume) offsetFace('startover', VPW / 2 - 130, ay, 260, 60, '#fff7ec', () => { ctx.font = '600 22px ' + F_GEO2; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#6b4a4f'; ctx.fillText('Start again', VPW / 2, ay + 31); }, () => storyGo(0));
  ctx.restore();
}
// on a phone the Add to Home Screen button now lives at the bottom, not under the title
{
  const _sign = SCENES.home.drawSign, base = Object.getPrototypeOf ? null : null;
  SCENES.home.drawSign = function (t) { const sa = A2.standalone; if (PORT) A2.standalone = true; try { _sign.call(this, t); } finally { A2.standalone = sa; } };
}
