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
    // play badge and words, centred together on the button
    const pulse = REDUCE_MOTION ? 1 : 1 + .05 * Math.sin(t * 3);
    let up = resume ? 'Up to: ' + (STORY_TITLES[STORY[save.story]] || '') : '';
    ctx.font = '700 ' + (resume ? 52 : 60) + 'px ' + F_GEO2; const w1 = ctx.measureText(resume ? 'CONTINUE' : 'PLAY').width;
    ctx.font = '500 25px ' + F_GEO2; while (up && ctx.measureText(up).width > bw - 190 && up.length > 10) up = up.slice(0, -2) + '…';
    const tw = Math.max(w1, up ? ctx.measureText(up).width : 0), gw = 88 + 26 + tw, gx = bx + bw / 2 - gw / 2, cy = by + bh / 2 - 6;
    ctx.save(); ctx.translate(gx + 44, cy); ctx.scale(pulse, pulse); ctx.beginPath(); ctx.arc(0, 0, 44, 0, TAU); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(-12, -20); ctx.lineTo(22, 0); ctx.lineTo(-12, 20); ctx.closePath(); ctx.fillStyle = '#d8312b'; ctx.fill(); ctx.restore();
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; const tx = gx + 88 + 26;
    if (resume) { ctx.font = '700 52px ' + F_GEO2; ctx.fillStyle = '#fff'; ctx.fillText('CONTINUE', tx, cy - 18); ctx.font = '500 25px ' + F_GEO2; ctx.fillStyle = '#ffe0dc'; ctx.fillText(up, tx + 2, cy + 26); }
    else { ctx.font = '700 60px ' + F_GEO2; ctx.fillStyle = '#fff'; ctx.fillText('PLAY', tx, cy + 2); }
  }, () => storyGo(resume ? save.story : 0));
  // Sections / Dress Mona
  const rw = (VPW - 100) / 2, ry = by + bh + 26;
  offsetFace('levels', 40, ry, rw, 76, '#1f6b33', () => { xIcon('gift', 40 + 46, ry + 40, 76, '#1f6b33'); text(ctx, 'Sections', 40 + rw / 2 + 24, ry + 39, { size: 30, color: '#fff', display: true }); }, () => go('levels'));
  offsetFace('wardrobe', 60 + rw, ry, rw, 76, '#fff7ec', () => { drawMonaHead(ctx, 60 + rw + 46, ry + 44, .5, { t, outfit: 'santa', eyes: 'happy', mouth: 'smile' }); text(ctx, 'Dress Mona', 60 + rw + rw / 2 + 24, ry + 39, { size: 30, color: '#3a0d14', display: true }); }, () => go('dress'));
  // bottom line: Add to Home Screen, and Start again when resuming
  const ay = ry + 100;
  const a2 = (x) => offsetFace('a2hs', x, ay, rw, 76, '#f4d4d6', () => {
    ctx.save(); ctx.translate(x + 44, ay + 38); ctx.strokeStyle = '#0a7aff'; ctx.lineWidth = 3.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(0, 6); ctx.lineTo(0, -15); ctx.moveTo(-7, -8); ctx.lineTo(0, -15); ctx.lineTo(7, -8); ctx.moveTo(-5, -2); ctx.lineTo(-11, -2); ctx.lineTo(-11, 15); ctx.lineTo(11, 15); ctx.lineTo(11, -2); ctx.lineTo(5, -2); ctx.stroke(); ctx.restore();
    ctx.font = '600 23px ' + F_GEO2; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#3a0d14'; ctx.fillText('Add to Home', x + rw / 2 + 24, ay + 28); ctx.fillText('Screen', x + rw / 2 + 24, ay + 52);
  }, () => a2Show());
  const again = (x) => offsetFace('startover', x, ay, rw, 76, '#fff7ec', () => { ctx.font = '600 26px ' + F_GEO2; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#6b4a4f'; ctx.fillText('Start again', x + rw / 2, ay + 39); }, () => storyGo(0));
  if (!A2.standalone) { if (resume) { a2(40); again(60 + rw); } else a2(VPW / 2 - rw / 2); }
  else if (resume) again(40);
  ctx.restore();
}
// on a phone the Add to Home Screen button now lives at the bottom, not under the title
{
  const _sign = SCENES.home.drawSign, base = Object.getPrototypeOf ? null : null;
  SCENES.home.drawSign = function (t) { const sa = A2.standalone; if (PORT) A2.standalone = true; try { _sign.call(this, t); } finally { A2.standalone = sa; } };
}
