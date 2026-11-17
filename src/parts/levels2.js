/* ---- v7.2: the Sections page, redesigned for reading ----
   A calm cranberry page with one quiet strip of Christmas tiles at the top and a few big faint snowflakes.
   Every choice is a flat offset button: cream face, dark ink edge and a solid block shadow down-right;
   pressing pushes the face into its shadow. One column per section, big type, clear status. */
const LV = { bg: '#8e1f2c', bgD: '#6f1722', ink: '#3a0d14', face: '#fff7ec', text: '#3a1a1f', sub: '#8a5a5f', gold: '#f2c14e', green: '#3f9a4f', red: '#d8353f', mute: '#c9b7b0' };
function offsetBtn(id, x, y, w, h, k, face, draw, onTap) {
  const a = clamp(k, 0, 1), dy = (1 - E.out(a)) * 24;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(0, dy);
  UI.button(id, x, y, w + 8, h + 8, () => {
    const down = UI.pressed === id, o = down ? 7 : 0;
    rr(ctx, x + 7, y + 8, w, h, 16); ctx.fillStyle = LV.ink; ctx.fill();
    rr(ctx, x + o, y + o * 1.14, w, h, 16); ctx.fillStyle = face; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = LV.ink; ctx.stroke();
    ctx.save(); ctx.translate(o, o * 1.14); draw(); ctx.restore();
  }, onTap);
  ctx.restore();
}
function lvSection(label, x, y) { text(ctx, label.toUpperCase(), x, y, { size: 24, color: '#ffe9d6', weight: 900, align: 'left' }); ctx.fillStyle = 'rgba(255,233,214,.35)'; ctx.fillRect(x, y + 20, VPW - 2 * x, 3); }
SCENES.levels.drawP = function () {
  const t = this.t;
  // calm backdrop
  ctx.save(); ctx.setTransform(K, 0, 0, K, 0, 0); ctx.fillStyle = LV.bg; ctx.fillRect(0, 0, PW, PH); ctx.restore();
  ctx.save(); ctx.globalAlpha = .07; [[110, 380, 70], [650, 600, 90], [140, 980, 80], [640, 1230, 70]].forEach(([x, y, r], i) => { ctx.save(); ctx.translate(x, y); ctx.rotate(t * .05 * (i % 2 ? 1 : -1)); cxFlake(ctx, 0, 0, r, '#fff'); ctx.restore(); }); ctx.restore();
  // header
  text(ctx, 'SECTIONS', VPW / 2, 192, { size: 60, color: '#fff7ec', display: true }); xIcon('tree', VPW / 2 - 175, 190, 74, LV.bg); xIcon('holly', VPW / 2 + 175, 190, 74, LV.bg);
  text(ctx, 'Tap any part of the story, or an arcade game', VPW / 2, 236, { size: 22, color: '#ffd9cf', weight: 700 });
  const X0 = 34, CW = 330, GAP = 28, RH = 70, RG = 16;
  // the story
  lvSection('The story', X0, 276);
  JUMP_STORY.forEach((S, i) => {
    const c = i % 2, r = Math.floor(i / 2), x = X0 + c * (CW + GAP), y = 310 + r * (RH + RG), k = (t - i * .035) / .35;
    const done = save.story > S.at || (save.finished && S.at < 9), here = save.story === S.at && !save.finished;
    offsetBtn('js-' + i, x, y, CW, RH, k, here ? '#fff1c4' : LV.face, () => {
      rr(ctx, x + 11, y + 10, 50, 50, 12); ctx.fillStyle = done ? LV.green : here ? LV.red : LV.mute; ctx.fill();
      if (done) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x + 26, y + 38); ctx.lineTo(x + 34, y + 46); ctx.lineTo(x + 49, y + 29); ctx.stroke(); }
      else text(ctx, String(i + 1), x + 37, y + 36, { size: 26, color: '#fff', weight: 900 });
      const nm = S.name, fs = nm.length > 17 ? 21 : nm.length > 13 ? 23 : 26;
      text(ctx, nm, x + 76, y + (here ? 30 : 38), { size: fs, color: LV.text, weight: 900, align: 'left' });
      if (here) text(ctx, 'YOU ARE HERE', x + 76, y + 56, { size: 14, color: LV.red, weight: 900, align: 'left' });
    }, () => storyGo(S.at));
  });
  // the arcade
  const ay = 310 + 5 * (RH + RG) + 18;
  lvSection("Mona's arcade", X0, ay);
  GAME_IDS.forEach((id, i) => {
    const c = i % 2, r = Math.floor(i / 2), x = X0 + c * (CW + GAP), y = ay + 38 + r * (RH + RG), k = (t - .25 - i * .035) / .35, g = GAMES[id];
    offsetBtn('ja-' + id, x, y, CW, RH, k, LV.face, () => {
      rr(ctx, x + 12, y + 12, 50, 50, 12); ctx.fillStyle = g.col; ctx.fill(); drawStarShape(ctx, x + 37, y + 38, 15, '#fff', 0);
      text(ctx, gname(id), x + 76, y + (g.toggle ? 30 : 38), { size: gname(id).length > 13 ? 22 : 25, color: LV.text, weight: 900, align: 'left' });
      if (g.toggle) text(ctx, modeOf(id) === 'mona' ? 'Mona-fied' : 'Classic 1980s', x + 76, y + 56, { size: 15, color: LV.sub, weight: 800, align: 'left' });
    }, () => go(id));
  });
  // the two big actions
  const by = ay + 38 + 4 * (RH + RG) + 18, kb = (t - .5) / .35;
  offsetBtn('lv-cont', X0, by, VPW - 2 * X0 - 8, 86, kb, LV.green, () => { xIcon('gift', X0 + 50, by + 43, 54, LV.green); text(ctx, save.story > 0 ? 'Carry on the story' : 'Start the story', VPW / 2 + 20, by + 45, { size: 34, color: '#fff', display: true }); }, () => storyResume());
  offsetBtn('lv-arcade', X0, by + 104, VPW - 2 * X0 - 8, 70, kb - .15, LV.gold, () => { xIcon('star', X0 + 50, by + 139, 46, LV.gold); text(ctx, 'Arcade gallery', VPW / 2 + 20, by + 140, { size: 30, color: LV.ink, display: true }); }, () => go('arcade'));
};
