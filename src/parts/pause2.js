/* ============ Pause menu, re-laid out: one clear column of offset buttons, nothing overlapping ============ */
drawPause = function () {
  ctx.fillStyle = 'rgba(20,12,10,.72)'; fullFill();
  const gm = !!GAMES[sceneName], tg = gm && GAMES[sceneName].toggle, hw = !!HOWTO[sceneName], lv = gm || !!HOWTO[sceneName];
  const BH = 72, GAP = 26, pw = 600, bw = 500;
  const rows = 2 + (hw ? 1 : 0) + (lv ? 1 : 0);
  const head = lv ? 196 : 158, ph = head + rows * (BH + GAP) + (tg ? 72 : 0) + 34, top = H / 2 - ph / 2, px = W / 2 - pw / 2, bx = W / 2 - bw / 2;
  // card
  rr(ctx, px + 8, top + 10, pw, ph, 30); ctx.fillStyle = '#3a0d14'; ctx.fill();
  rr(ctx, px, top, pw, ph, 30); ctx.fillStyle = '#9b2433'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#3a0d14'; ctx.stroke();
  rr(ctx, px + 14, top + 14, pw - 28, ph - 28, 20); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,230,220,.45)'; ctx.stroke();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '600 22px ' + F_GEO2; ctx.fillStyle = '#ffd34d'; ctx.fillText(gname(sceneName).toUpperCase(), W / 2, top + 54);
  ctx.font = '700 56px ' + F_GEO2; ctx.fillStyle = '#fff7ec'; ctx.fillText('PAUSED', W / 2, top + 104);
  if (lv) { const st = (save.stars || {})[sceneName] || 0; for (let i = 0; i < 3; i++) drawStarShape(ctx, W / 2 + (i - 1) * 44, top + 152, 16, i < st ? '#ffd34d' : '#5a2a30', 2.4); }
  let y = top + head;
  const label = (s, x, w, dark, sz) => { ctx.font = '700 ' + (sz || 28) + 'px ' + F_GEO2; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = dark ? '#3a0d14' : '#fff'; ctx.fillText(s, x + w / 2 + 22, y + BH / 2 + 1); };
  const badge = (x, fill) => { ctx.beginPath(); ctx.arc(x + 44, y + BH / 2, 24, 0, TAU); ctx.fillStyle = fill; ctx.fill(); };
  // Keep playing
  let yy = y; offsetFace('p-resume', bx, yy, bw, BH, '#2f8a45', () => { y = yy; badge(bx, '#fff'); ctx.beginPath(); ctx.moveTo(bx + 38, y + BH / 2 - 11); ctx.lineTo(bx + 54, y + BH / 2); ctx.lineTo(bx + 38, y + BH / 2 + 11); ctx.closePath(); ctx.fillStyle = '#2f8a45'; ctx.fill(); label('KEEP PLAYING', bx, bw, false, 30); }, () => { paused = false; });
  y += BH + GAP;
  if (tg) { modeToggle('p-mode', W / 2 - 150, y, 300, sceneName, () => { paused = false; go(sceneName, sceneParams); }); y += 72; }
  if (hw) { const y1 = y; offsetFace('p-how', bx, y1, bw, BH, '#2f7fd8', () => { y = y1; badge(bx, '#fff'); ctx.font = '700 30px ' + F_GEO2; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#2f7fd8'; ctx.fillText('?', bx + 44, y + BH / 2 + 1); label('HOW TO PLAY', bx, bw); }, () => { paused = false; showHow(sceneName); }); y = y1 + BH + GAP; }
  if (lv) { const y1 = y; offsetFace('p-restart', bx, y1, bw, BH, '#f4b12a', () => { y = y1; badge(bx, '#fff'); ctx.beginPath(); ctx.arc(bx + 44, y + BH / 2, 11, -2.4, 2.2); ctx.lineWidth = 4.5; ctx.strokeStyle = '#c47a00'; ctx.lineCap = 'round'; ctx.stroke(); ctx.beginPath(); const ax = bx + 44 + 11 * Math.cos(-2.4), ay = y + BH / 2 + 11 * Math.sin(-2.4); ctx.moveTo(ax - 7, ay - 2); ctx.lineTo(ax + 1, ay + 1); ctx.lineTo(ax - 1, ay - 8); ctx.stroke(); label('START THIS PART AGAIN', bx, bw, true, 24); }, () => { paused = false; go(sceneName, sceneParams); }); y = y1 + BH + GAP; }
  // Sections + Home side by side, with a clear gap
  const hw2 = (bw - 24) / 2, y2 = y;
  offsetFace('p-levels', bx, y2, hw2, BH, '#1f6b33', () => { y = y2; xIcon('gift', bx + 40, y + BH / 2 + 2, 62, '#1f6b33'); label('SECTIONS', bx + 10, hw2, false, 24); }, () => { paused = false; go('levels'); });
  offsetFace('p-home', bx + hw2 + 24, y2, hw2, BH, '#fff7ec', () => {
    y = y2; const hx = bx + hw2 + 24 + 40, hy = y + BH / 2 + 2;
    ctx.beginPath(); ctx.moveTo(hx - 17, hy - 2); ctx.lineTo(hx, hy - 18); ctx.lineTo(hx + 17, hy - 2); ctx.closePath(); ctx.fillStyle = '#d8312b'; ctx.fill();
    ctx.fillStyle = '#d8312b'; ctx.fillRect(hx - 12, hy - 3, 24, 19); ctx.fillStyle = '#fff7ec'; ctx.fillRect(hx - 4, hy + 5, 8, 11);
    label('HOME', bx + hw2 + 24 + 10, hw2, true, 24);
  }, () => { paused = false; go('home'); });
};
