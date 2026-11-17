/* ============ shared game art: baddies, pixel sprites, classic blocks ============ */
const PIX_SPR = {
  cat: ['..x.....x..', '.xxx...xxx.', '.xxxxxxxxx.', 'xxxxxxxxxxx', 'xxgxxxxxgxx', 'xxgxxxxxgxx', 'xxxxxpxxxxx', 'xxxxxxxxxxx', '.xxxxxxxxx.', '..xxxxxxx..', '...xxxxx...'],
  catO: ['..x.....x..', '.xxx...xxx.', '.xxxxxxxxx.', 'xxxxxxxxxxx', 'xxgxxxxxgxx', 'xxgxxxxxgxx', 'xxxxxpxxxxx', 'xxxx...xxxx', '.xx.....xx.', '..x.....x..', '...........'],
  vac: ['...xxxxx...', '.xxxxxxxxx.', 'xxxrrrrrxxx', 'xxwbxxxwbxx', 'xxwbxxxwbxx', 'xxxxxxxxxxx', 'xxxxxxxxxxx', '.xxxxxxxxx.', '...xxxxx...', '..y.....y..', '...........'],
  carrier: ['...xxxxx...', '...x...x...', 'xxxxxxxxxxx', 'x.x.x.x.x.x', 'x.x.x.x.x.x', 'xxxxxxxxxxx', 'xxwbxxxwbxx', 'xxxxxxxxxxx', 'xxxxxxxxxxx', '.xxxxxxxxx.', '...........'],
  spray: ['.xxxxxx....', '.xx...x....', '..xx.......', '.xxxx......', 'xxxxxx.....', 'xxxxxxx....', 'xwbxwbx....', 'xxxxxxx....', 'xxxxxxx....', 'xxxxxxx....', '.xxxxx.....'],
  truck: ['...........', 'xxxxxxx....', 'xxxxxxx.xx.', 'xxxxxxx.xxx', 'xxxxxxxxxxx', 'xwbxxxxwbxx', 'xxxxxxxxxxx', 'xxxxxxxxxxx', '.oo....oo..', '.oo....oo..', '...........'],
  scared: ['...xxxxx...', '.xxxxxxxxx.', 'xxxxxxxxxxx', 'xxwwxxxwwxx', 'xxwwxxxwwxx', 'xxxxxxxxxxx', 'xwxwxwxwxwx', 'xxxxxxxxxxx', '.xxxxxxxxx.', '...xxxxx...', '...........'],
  heart: ['.xx.xx.', 'xxxxxxx', 'xxxxxxx', '.xxxxx.', '..xxx..', '...x...']
};
const PIX_COL = { cat: '#c9c1b6', catO: '#c9c1b6', vac: '#ff4040', carrier: '#ffb847', spray: '#40d8ff', truck: '#3ccf5a', scared: '#2a3cff', heart: '#ff5a8a' };
function pixSprite(g, name, cx, cy, px, dir, t, col) {
  const spr = PIX_SPR[name]; if (!spr) return; const h = spr.length, w = spr[0].length, base = col || PIX_COL[name];
  g.save(); g.translate(cx, cy); if (dir === -1 && name !== 'cat' && name !== 'catO') g.scale(-1, 1);
  for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
    const ch = spr[r][c]; if (ch === '.') continue;
    g.fillStyle = ch === 'x' ? base : ch === 'g' ? '#9cff3a' : ch === 'p' ? '#ff8aa0' : ch === 'w' ? '#ffffff' : ch === 'b' ? '#1a1aff' : ch === 'r' ? '#ffffff' : ch === 'y' ? '#ffd23a' : ch === 'o' ? '#444' : base;
    if (name === 'cat' || name === 'catO') { if (ch === 'x' && (r === 3 || r === 8) && c % 3 === 1) g.fillStyle = '#6a5e52'; }
    g.fillRect(Math.round((c - w / 2) * px), Math.round((r - h / 2) * px), Math.ceil(px), Math.ceil(px));
  }
  g.restore();
}
function blockClassic(g, x, y, c, k) {
  const cols = { I: '#2ee6ff', O: '#ffe23a', T: '#b04aff', S: '#3ae65a', Z: '#ff3a3a', J: '#3a6aff', L: '#ff9a2a' }, col = cols[k] || '#ccc';
  g.fillStyle = col; g.fillRect(x + 1, y + 1, c - 2, c - 2);
  g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(x + 1, y + 1, c - 2, 3); g.fillRect(x + 1, y + 1, 3, c - 2);
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x + 1, y + c - 4, c - 2, 3); g.fillRect(x + c - 4, y + 1, 3, c - 2);
}
/* Mona's nemeses: the vacuum, the vet carrier, the spray bottle and the garbage truck */
function drawBaddie(g, kind, x, y, s, scared, t, dir, blink) {
  g.save(); g.translate(x, y); g.scale(s * (dir === -1 ? -1 : 1), s);
  const wob = scared ? Math.sin(t * 14) * 2 : 0; g.translate(wob, Math.sin(t * 9 + x) * 1.2);
  const tint = c => scared ? (blink ? '#ffffff' : '#7aa2e8') : c;
  const eyes = (ex, ey, sp) => { if (scared) { text(g, '!', ex + sp / 2, ey, { size: 18, color: '#1d2a4a', weight: 700 }); return; } for (const sd of [0, sp]) { circ(g, ex + sd, ey, 5); fillP(g, '#fff'); circ(g, ex + sd + 1.5, ey + 1, 2.4); fillP(g, '#111'); } line(g, ex - 5, ey - 7, ex + 3, ey - 4, OUT, 2.4); line(g, ex + sp + 5, ey - 7, ex + sp - 3, ey - 4, OUT, 2.4); };
  if (kind === 'vacuum') {
    g.beginPath(); g.moveTo(10, -6); g.quadraticCurveTo(26, -30, 6, -30); strokeP(g, OUT, 7); g.beginPath(); g.moveTo(10, -6); g.quadraticCurveTo(26, -30, 6, -30); strokeP(g, tint('#8a8f99'), 4);
    rr(g, -18, -20, 32, 34, 12); ink(g, rad(g, -2, -6, 26, tint('#e2443b')), 2.2); rr(g, -14, -26, 24, 9, 4); ink(g, tint('#5a5f6a'), 2);
    circ(g, -12, 15, 5); ink(g, '#333', 1.6); circ(g, 8, 15, 5); ink(g, '#333', 1.6); eyes(-8, -4, 12);
  } else if (kind === 'carrier') {
    rr(g, -20, -18, 40, 32, 6); ink(g, rad(g, 0, -4, 28, tint('#d9cbb0')), 2.2); g.beginPath(); g.moveTo(-8, -18); g.quadraticCurveTo(0, -30, 8, -18); strokeP(g, OUT, 3);
    rr(g, -14, -12, 28, 22, 4); fillP(g, tint('#3a3f48')); for (let i = -10; i <= 10; i += 5) line(g, i, -12, i, 10, tint('#9aa0aa'), 1.6); eyes(-7, -2, 14);
  } else if (kind === 'spray') {
    rr(g, -12, -8, 24, 26, 6); ink(g, rad(g, 0, 4, 20, tint('#5ab0ff')), 2.2); rr(g, -7, -20, 14, 13, 3); ink(g, tint('#f6f6f6'), 2); g.beginPath(); g.moveTo(-7, -19); g.lineTo(-20, -18); g.lineTo(-20, -12); g.lineTo(-7, -12); ink(g, tint('#f6f6f6'), 2);
    line(g, 4, -10, 10, 2, tint('#e2443b'), 3); eyes(-6, 5, 12);
    if (!scared && Math.sin(t * 5) > .7) for (let i = 0; i < 4; i++) { circ(g, -26 - i * 5, -15 + (i - 1.5) * 3, 1.6); fillP(g, 'rgba(160,210,255,.9)'); }
  } else {
    rr(g, -22, -18, 30, 26, 4); ink(g, rad(g, -7, -5, 24, tint('#2f9a52')), 2.2); rr(g, 6, -10, 16, 18, 4); ink(g, tint('#3fae6c'), 2); rr(g, 10, -7, 9, 7, 2); fillP(g, tint('#bfe4ff'));
    for (let i = -18; i < 6; i += 6) line(g, i, -16, i, 6, 'rgba(0,0,0,.25)', 1.4);
    circ(g, -14, 11, 5.5); ink(g, '#333', 1.6); circ(g, 13, 11, 5.5); ink(g, '#333', 1.6); eyes(-15, -6, 12);
  }
  g.restore();
}
function gameBackdrop(t, tod, mode) { cosyBackdrop(t, tod); if (mode === 'classic') { ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(0, 0, W, H); } }

/* ============ Pong: Mona's real paw is her paddle (or a classic 1972 table) ============ */
SCENES.pong = {
  enter() {
    this.res = null; this.mode = modeOf('pong'); audio.music(this.mode === 'classic' ? 'retro' : 'retro2');
    this.scr = { x: 114, y: 84, w: 1012, h: 712 };
    const s = this.scr; this.pl = { y: s.y + s.h / 2, ty: s.y + s.h / 2 }; this.ai = { y: s.y + s.h / 2 }; this.score = [0, 0];
    this.ball = { x: s.x + s.w / 2, y: s.y + s.h / 2, vx: 0, vy: 0 }; this.wait = 1.4; this.serveDir = 1; this.err = 0; this.swat = null; this.nextSwat = rand(5, 8); this.over = null; this.overT = 0; this.rally = 0; this.trail = [];
  },
  serve() { const s = this.scr, b = this.ball; b.x = s.x + s.w / 2; b.y = s.y + s.h / 2; b.vx = 430 * this.serveDir; b.vy = rand(-220, 220); this.rally = 0; this.err = rand(-50, 50); },
  update(dt) {
    const s = this.scr, b = this.ball, P = this.mode === 'classic' ? 110 : 120, mona = this.mode === 'mona';
    this.samCheer = (this.samCheer || 0) - dt; this.monaCheer = (this.monaCheer || 0) - dt;
    if (this.over) { this.overT += dt; return; }
    if (this.kd) { if (this.kd.up) this.pl.ty = this.pl.y - 70; if (this.kd.down) this.pl.ty = this.pl.y + 70; }
    this.pl.ty = clamp(this.pl.ty, s.y, s.y + s.h);
    const d = this.pl.ty - this.pl.y; this.pl.y += Math.sign(d) * Math.min(Math.abs(d), 1900 * dt); this.pl.y = clamp(this.pl.y, s.y + P / 2, s.y + s.h - P / 2);
    const target = b.vx > 0 ? b.y + this.err : s.y + s.h / 2, ad = target - this.ai.y;
    this.ai.y += Math.sign(ad) * Math.min(Math.abs(ad), (290 + this.rally * 14) * dt); this.ai.y = clamp(this.ai.y, s.y + P / 2, s.y + s.h - P / 2);
    if (this.wait > 0) { this.wait -= dt; if (this.wait <= 0) this.serve(); return; }
    b.x += b.vx * dt; b.y += b.vy * dt;
    this.trail.unshift({ x: b.x, y: b.y }); if (this.trail.length > 8) this.trail.pop();
    if (b.y < s.y + 12) { b.y = s.y + 12; b.vy = Math.abs(b.vy); audio.sfx('blip2'); }
    if (b.y > s.y + s.h - 12) { b.y = s.y + s.h - 12; b.vy = -Math.abs(b.vy); audio.sfx('blip2'); }
    const lx = s.x + 44, rx = s.x + s.w - 44;
    if (b.vx < 0 && b.x - 10 < lx + 8 && b.x > lx - 20 && Math.abs(b.y - this.pl.y) < P / 2 + 12) { b.x = lx + 19; b.vx = Math.min(950, Math.abs(b.vx) * 1.06); b.vy += (b.y - this.pl.y) * 5; this.rally++; audio.sfx(mona ? 'jingle' : 'blip'); this.err = rand(-60, 60) * (this.rally > 4 ? 1.4 : 1); }
    if (b.vx > 0 && b.x + 10 > rx - 8 && b.x < rx + 20 && Math.abs(b.y - this.ai.y) < P / 2 + 12) { b.x = rx - 19; b.vx = -Math.min(950, Math.abs(b.vx) * 1.06); b.vy += (b.y - this.ai.y) * 5; this.rally++; audio.sfx(mona ? 'swat' : 'blip'); }
    b.vy = clamp(b.vy, -620, 620);
    if (b.x < s.x - 20) { this.score[1]++; this.point(-1); }
    if (b.x > s.x + s.w + 20) { this.score[0]++; this.point(1); }
    // Mona's big lunge: the paw shoots out to swat the bell back
    if (mona) {
      this.nextSwat -= dt;
      if (!this.swat && this.nextSwat <= 0 && b.vx > 0 && b.x > s.x + s.w * .45 && b.x < s.x + s.w * .7) { this.swat = { t: 0, hit: false, tx: b.x + b.vx * .3, ty: clamp(b.y + b.vy * .3, s.y + 40, s.y + s.h - 40) }; audio.sfx('meow', 1.3); }
      if (this.swat) {
        const w = this.swat; w.t += dt;
        if (!w.hit && w.t > .28) { w.hit = true; if (dist(b.x, b.y, w.tx, w.ty) < 170) { b.vx = -Math.max(520, Math.abs(b.vx) * .95); b.vy = rand(-1, 1) * 420; audio.sfx('swat'); spawn('pop', b.x, b.y - 40, 1, { label: 'SWAT!', vx: 0, vy: -50, col: '#f2c14e', size: 44 }); this.monaCheer = 1; this.mcT0 = this.t; } }
        if (w.t > .75) { this.swat = null; this.nextSwat = rand(7, 11); }
      }
    }
  },
  point(dir) {
    audio.sfx('score'); if (dir === 1) { this.samCheer = 1.4; this.cheerT0 = this.t; this.cheerN = (this.cheerN || 0) + 1; } else { this.monaCheer = 1.4; this.mcT0 = this.t; } this.serveDir = dir; this.wait = 1;
    const b = this.ball; b.vx = 0; b.vy = 0; b.x = -100; this.trail = [];
    if (this.score[0] >= 5 || this.score[1] >= 5) { this.over = this.score[0] >= 5 ? 'sam' : 'mona'; this.overT = 0; markDone('pong'); audio.sfx(this.over === 'sam' ? 'win' : 'meow', 1.4); if (this.over === 'sam') spawn('confetti', W / 2, 300, 60); const d = this.score[0] - this.score[1]; this.res = finishLevel('pong', this.over === 'sam' ? (d >= 3 ? 3 : 2) : 1, null); if (this.res.stars < 3) this.res.tip = this.over === 'sam' ? 'Win by 3 or more points for 3 stars.' : 'Beat Mona to earn more stars.'; }
    else if (dir === -1) spawn('pop', W / 2, 300, 1, { label: 'Point to Mona!', vx: 0, vy: -30, col: '#f2c14e', size: 36 });
  },
  down(x, y) { this.pl.ty = y; }, move(x, y) { this.pl.ty = y; }, hover(x, y) { this.pl.ty = y; },
  wheel(dx, dy) { this.pl.ty += dy * 1.6; },
  key(k) { this.kd = this.kd || {}; if (k === 'up' || k === 'down') this.kd[k] = true; }, keyUp(k) { if (this.kd) this.kd[k] = false; },
  draw() {
    const t = this.t, s = this.scr, b = this.ball, mona = this.mode === 'mona', P = mona ? 120 : 110;
    gameBackdrop(t, 'day', this.mode);
    ipadFrame(80, 50, 1080, 780, t);
    ctx.save(); rr(ctx, s.x, s.y, s.w, s.h, 18); ctx.clip();
    const lx = s.x + 44, rx = s.x + s.w - 44;
    if (mona) {
      const bg = ctx.createLinearGradient(0, s.y, 0, s.y + s.h); bg.addColorStop(0, '#1b2a5a'); bg.addColorStop(1, '#0e1530'); ctx.fillStyle = bg; ctx.fillRect(s.x, s.y, s.w, s.h);
      glowAt(ctx, s.x + s.w / 2, s.y + s.h / 2, 520, '120,150,255', .12);
      ctx.globalAlpha = .5; drawSnow(ctx, s.x, s.y, s.w, s.h, t, 34, .9); ctx.globalAlpha = 1;
      for (let i = 0; i < 18; i++) bulb(ctx, s.x + s.w / 2 + Math.sin(i * 1.3) * 3, s.y + 16 + i * (s.h - 32) / 17, LIGHT_COLS[i % 5], .5 + .5 * Math.sin(t * 3 + i), 1.1);
      if (PORT) { dockStat('Samantha', this.score[0]); dockStat('Mona', this.score[1]); } else {
      text(ctx, String(this.score[0]), s.x + s.w / 2 - 100, s.y + 64, { size: 78, color: '#fff3c4', weight: 700, stroke: '#7a120e', sw: 6 }); text(ctx, String(this.score[1]), s.x + s.w / 2 + 100, s.y + 64, { size: 78, color: '#fff3c4', weight: 700, stroke: '#7a120e', sw: 6 });
      text(ctx, 'SAMANTHA', s.x + s.w / 2 - 100, s.y + 120, { size: 18, color: 'rgba(255,255,255,.65)', weight: 700 }); text(ctx, 'MONA', s.x + s.w / 2 + 100, s.y + 120, { size: 18, color: 'rgba(255,255,255,.65)', weight: 700 }); }
      // Samantha's candy-cane paddle
      const py = this.pl.y; ctx.save(); ctx.lineCap = 'round';
      for (const [c, w] of [[OUT, 24], ['#fffaf2', 18]]) { ctx.beginPath(); ctx.moveTo(lx - 8, py + P / 2); ctx.lineTo(lx - 8, py - P / 2 + 14); ctx.arc(lx + 8, py - P / 2 + 14, 16, Math.PI, 0); strokeP(ctx, c, w); }
      ctx.setLineDash([9, 13]); ctx.beginPath(); ctx.moveTo(lx - 8, py + P / 2); ctx.lineTo(lx - 8, py - P / 2 + 14); ctx.arc(lx + 8, py - P / 2 + 14, 16, Math.PI, 0); strokeP(ctx, '#e2332e', 18); ctx.restore();
      // the jingle bell with a sparkly trail
      if (b.x > 0) { this.trail.forEach((p, i) => { ctx.globalAlpha = .35 * (1 - i / 8); drawStar(ctx, p.x, p.y, 9 - i, '#ffe08a', 4); }); ctx.globalAlpha = 1; circ(ctx, b.x, b.y, 15); ink(ctx, rad(ctx, b.x, b.y, 15, '#f2c23e'), 2.4); line(ctx, b.x - 9, b.y + 2, b.x + 9, b.y + 2, '#9a7414', 2.4); circ(ctx, b.x, b.y + 7, 3); fillP(ctx, '#9a7414'); circ(ctx, b.x - 5, b.y - 6, 4); fillP(ctx, '#fff6c8'); glowAt(ctx, b.x, b.y, 50, '255,220,120', .25); }
    } else {
      ctx.fillStyle = '#000'; ctx.fillRect(s.x, s.y, s.w, s.h);
      ctx.fillStyle = 'rgba(255,255,255,.85)'; for (let y = s.y + 10; y < s.y + s.h; y += 36) ctx.fillRect(s.x + s.w / 2 - 5, y, 10, 20);
      pixNum(this.score[0], s.x + s.w / 2 - 130, s.y + 30, 14, '#fff'); pixNum(this.score[1], s.x + s.w / 2 + 86, s.y + 30, 14, '#fff');
      ctx.fillStyle = '#fff'; ctx.fillRect(lx - 8, this.pl.y - P / 2, 18, P); ctx.fillRect(rx - 10, this.ai.y - P / 2, 18, P);
      if (b.x > 0) ctx.fillRect(Math.round(b.x - 10), Math.round(b.y - 10), 20, 20);
      ctx.globalAlpha = .1; ctx.fillStyle = '#fff'; for (let y = s.y; y < s.y + s.h; y += 4) ctx.fillRect(s.x, y, s.w, 1); ctx.globalAlpha = 1;
    }
    if (this.wait > 0 && !this.over && this.score[0] + this.score[1] === 0) retroText('FIRST TO 5 WINS', s.x + s.w / 2, s.y + s.h / 2 + 90, 32, mona ? '#fff3c4' : '#fff');
    if (this.over) { ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(s.x, s.y, s.w, s.h); retroText(this.over === 'sam' ? 'SAMANTHA WINS!' : 'MONA WINS!', s.x + s.w / 2, s.y + s.h / 2, 64, '#f2c14e'); }
    ctx.restore();
    if (mona) {
      // Mona's real paw reaches onto the iPad from the right: it IS her paddle (and it lunges when she swats)
      let px = rx + 22, ppy = this.ai.y;
      if (this.swat) { const w = this.swat, k = w.t < .28 ? E.out(w.t / .28) : 1 - E.inOut((w.t - .28) / .47); px = lerp(rx + 22, w.tx + 22, k); ppy = lerp(this.ai.y, w.ty, k); }
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8;
      drawRealPaw(ctx, W + 70, ppy + 60 + (this.swat ? 40 : 0), px, ppy, { s: 1.2, claws: !!this.swat, beans: true });
      ctx.restore();
      const lk = { x: clamp((b.x - 1060) / 400, -1, 1), y: clamp((b.y - 820) / 400, -1, 1) };
      drawMonaPeek(ctx, 1100, 884, 1.2, { t, look: lk, outfit: curOutfit(), paws: true, earsUp: !!this.swat, mouth: this.swat ? 'meow' : undefined });
      const cheer = this.samCheer > 0;
      ctx.save(); ctx.translate(0, cheer ? -Math.abs(Math.sin(t * 10)) * 14 : 0);
      drawSamHead(ctx, 150, 872, 1.25, { t, expr: cheer ? 'laugh' : this.monaCheer > 0 ? 'grump' : 'smile', look: clamp((b.x - 150) / 600, -1, 1) });
      handO(ctx, 98, 842, 13); handO(ctx, 204, 840, 13);
      ctx.restore();
      if (cheer) speech(ctx, pick2(['Yes!', 'Take that, Mona!', 'Woo!', 'Ha HA!'], this.cheerN), 270, 720, this.cheerT0, t, 220);
      if (this.monaCheer > 0) speech(ctx, 'Mrrp! (smug)', 990, 730, this.mcT0, t, 200);
    }
    if (this.t < 7) hintPill('Drag your finger, slide on the trackpad, or use the arrow keys', 862);
    else modeToggle('pg-mode', 290, 840, 300, 'pong', () => go('pong', sceneParams));
    if (this.over) gameDone(this, this.overT, this.over === 'sam' ? 'You beat Mona!' : 'Mona wins!', 'Final score ' + this.score[0] + ' to ' + this.score[1] + (this.over === 'sam' ? '. She\'ll want a rematch.' : '. She is extremely smug about it.'), this.res);
  }
};

/* ============ Mona-Man: kibble, Samantha hearts, and four nemeses (or an 8-bit 1982 version) ============ */
const PMAZE = ['###################', '#........#........#', '#o##.###.#.###.##o#', '#.................#', '#.##.#.#####.#.##.#', '#....#...#...#....#', '####.###.#.###.####', '####.#       #.####', '####.# ##-## #.####', '    .  #GGG#  .    ', '####.# ##### #.####', '####.#   M   #.####', '#o...#...#...#...o#', '#.##.....#.....##.#', '###################'];
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const BADDIES = [{ kind: 'vacuum', name: 'Vacuum', pix: 'vac', delay: .6, aim: 'chase' }, { kind: 'carrier', name: 'Vet carrier', pix: 'carrier', delay: 4, aim: 'ahead' }, { kind: 'spray', name: 'Spray bottle', pix: 'spray', delay: 8, aim: 'wander' }, { kind: 'truck', name: 'Garbage truck', pix: 'truck', delay: 12, aim: 'shy' }];
SCENES.pac = {
  enter() {
    this.res = null; this.mode = modeOf('pac'); audio.music(this.mode === 'classic' ? 'retro' : 'retro2');
    this.T = 43; this.scr = { x: 74, y: 94, w: 892, h: 712 }; this.ox = 74 + (892 - 19 * 43) / 2; this.oy = 94 + 58;
    this.food = PMAZE.map(r => r.split('').map(ch => ch === '.' ? 1 : ch === 'o' ? 2 : 0));
    this.left = this.food.flat().filter(v => v).length;
    this.lives = 3; this.deaths = 0; this.score = 0; this.over = null; this.overT = 0; this.scared = 0; this.ask = false; this.chain = 0;
    this.reset(); this.wait = 1.8;
  },
  reset() {
    this.mona = { cx: 9, cy: 11, dir: [0, 0], want: [-1, 0], prog: 0, sp: 5.6, face: -1 };
    this.bad = BADDIES.map((b, i) => Object.assign({ cx: 9, cy: 7, dir: [i % 2 ? 1 : -1, 0], prog: 0, state: 'home', wait: b.delay, home: [8 + (i % 3), 9] }, b));
    this.wait = 1.2;
  },
  open(cx, cy) { if (cy === 9 && (cx < 0 || cx > 18)) return true; const ch = PMAZE[cy] && PMAZE[cy][cx]; return !!ch && ch !== '#' && ch !== '-' && ch !== 'G'; },
  wrap(e) { if (e.cx < 0) e.cx = 18; if (e.cx > 18) e.cx = 0; },
  pos(e) { return { x: e.cx + e.dir[0] * e.prog, y: e.cy + e.dir[1] * e.prog }; },
  update(dt) {
    if (this.over) { this.overT += dt; return; }
    if (this.ask) return;
    if (this.scared > 0) { this.scared -= dt; if (this.scared <= 0) this.chain = 0; }
    if (this.wait > 0) { this.wait -= dt; return; }
    const M = this.mona;
    if (M.dir[0] === -M.want[0] && M.dir[1] === -M.want[1] && (M.dir[0] || M.dir[1])) { M.cx += M.dir[0]; M.cy += M.dir[1]; this.wrap(M); M.dir = M.want; M.prog = 1 - M.prog; }
    if (!M.dir[0] && !M.dir[1] && this.open(M.cx + M.want[0], M.cy + M.want[1])) { M.dir = M.want; M.prog = 0; }
    if (M.dir[0] || M.dir[1]) {
      M.prog += M.sp * dt;
      while (M.prog >= 1) {
        M.cx += M.dir[0]; M.cy += M.dir[1]; this.wrap(M); M.prog -= 1; this.eat(M.cx, M.cy);
        if (this.over) return;
        if (this.open(M.cx + M.want[0], M.cy + M.want[1])) M.dir = M.want;
        else if (!this.open(M.cx + M.dir[0], M.cy + M.dir[1])) { M.dir = [0, 0]; M.prog = 0; break; }
      }
      if (M.dir[0]) M.face = M.dir[0];
    }
    const mp = this.pos(M);
    for (const v of this.bad) {
      if (v.state === 'home' || v.state === 'gone') { v.wait -= dt; if (v.wait <= 0) { v.state = 'out'; v.cx = 9; v.cy = 7; v.prog = 0; v.dir = [Math.random() < .5 ? -1 : 1, 0]; audio.sfx('tick'); } continue; }
      const sp = this.scared > 0 ? 2.4 : 3.4 + Math.min(1, (99 - this.left) / 99) * .8;
      v.prog += sp * dt;
      while (v.prog >= 1) {
        v.cx += v.dir[0]; v.cy += v.dir[1]; this.wrap(v); v.prog -= 1;
        const opts = Object.values(DIRS).filter(d => this.open(v.cx + d[0], v.cy + d[1]) && !(d[0] === -v.dir[0] && d[1] === -v.dir[1]));
        const all = opts.length ? opts : [[-v.dir[0], -v.dir[1]]];
        let tx = mp.x, ty = mp.y;
        if (v.aim === 'ahead') { tx += M.dir[0] * 4; ty += M.dir[1] * 4; }
        if (v.aim === 'shy' && dist(v.cx, v.cy, mp.x, mp.y) < 5) { tx = 1; ty = 13; }
        let choice;
        if (Math.random() < (v.aim === 'wander' ? .5 : .22)) choice = pick(all);
        else { const sc = d => dist(v.cx + d[0], v.cy + d[1], tx, ty) * (this.scared > 0 ? -1 : 1); choice = all.slice().sort((a, b) => sc(a) - sc(b))[0]; }
        v.dir = choice;
      }
      const vp = this.pos(v);
      if (dist(vp.x, vp.y, mp.x, mp.y) < .62) {
        if (this.scared > 0) { v.state = 'gone'; v.wait = 3; this.chain++; const pts = 200 * this.chain; this.score += pts; audio.sfx('chomp'); spawn('pop', this.ox + vp.x * this.T + 21, this.oy + vp.y * this.T, 1, { label: '+' + pts, vx: 0, vy: -50, col: '#f2c14e', size: 26 }); spawn('sparkle', this.ox + vp.x * this.T + 21, this.oy + vp.y * this.T + 21, 10); }
        else { this.lives--; this.deaths++; audio.sfx('lose'); spawn('dust', this.ox + mp.x * this.T + 21, this.oy + mp.y * this.T + 21, 12); this.caughtBy = v.name; if (this.lives <= 0) this.ask = true; else this.reset(); return; }
      }
    }
  },
  eat(cx, cy) {
    if (cx < 0 || cx > 18) return; const f = this.food[cy][cx]; if (!f) return;
    this.food[cy][cx] = 0; this.left--; this.score += f === 2 ? 50 : 10;
    if (f === 2) { this.scared = 7; this.chain = 0; audio.sfx(this.mode === 'mona' ? 'bugle' : 'power'); this.bugleT = this.t; this.bad.forEach(v => { if (v.state === 'out') v.dir = [-v.dir[0], -v.dir[1]]; }); if (this.mode === 'mona') spawn('pop', this.ox + cx * this.T + 21, this.oy + cy * this.T, 1, { label: 'TOOT TOOT!', vx: 0, vy: -40, col: '#ff8aa8', size: 30 }); }
    else audio.sfx('waka', (cx + cy) % 2);
    if (this.left <= 0) { this.over = 'win'; this.overT = 0; markDone('pac'); audio.sfx('win'); spawn('confetti', 520, 300, 60); const dd = this.deaths; this.res = finishLevel('pac', dd === 0 ? 3 : dd <= 2 ? 2 : 1, this.score); if (this.res.stars < 3) this.res.tip = 'Clear the maze without getting caught for 3 stars.'; }
  },
  setDir(n) { this.mona.want = DIRS[n]; },
  down(x, y) { if (this.ask || this.over) return; this.sw = { x, y }; },
  wheel(dx, dy, acc) { if (this.ask || this.over) return; acc.x += dx; acc.y += dy; if (Math.hypot(acc.x, acc.y) > 22) { this.setDir(Math.abs(acc.x) > Math.abs(acc.y) ? (acc.x > 0 ? 'right' : 'left') : (acc.y > 0 ? 'down' : 'up')); acc.x = 0; acc.y = 0; } },
  key(k) { if (DIRS[k] && !this.ask && !this.over) this.setDir(k); },
  move(x, y) { if (!this.sw) return; const dx = x - this.sw.x, dy = y - this.sw.y; if (Math.hypot(dx, dy) > 24) { this.setDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up')); this.sw = { x, y }; } },
  up() { this.sw = null; },
  drawWallsClassic() {
    const T = this.T, ox = this.ox, oy = this.oy, wall = (c, r) => PMAZE[r] && PMAZE[r][c] === '#';
    ctx.strokeStyle = '#2121de'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (let r = 0; r < 15; r++) for (let c = 0; c < 19; c++) {
      if (!wall(c, r)) continue; const x = ox + c * T, y = oy + r * T, i = 7;
      ctx.beginPath();
      if (!wall(c, r - 1) && r > 0) { ctx.moveTo(x, y + i); ctx.lineTo(x + T, y + i); }
      if (!wall(c, r + 1) && r < 14) { ctx.moveTo(x, y + T - i); ctx.lineTo(x + T, y + T - i); }
      if (!wall(c - 1, r) && c > 0) { ctx.moveTo(x + i, y); ctx.lineTo(x + i, y + T); }
      if (!wall(c + 1, r) && c < 18) { ctx.moveTo(x + T - i, y); ctx.lineTo(x + T - i, y + T); }
      ctx.stroke();
    }
    ctx.strokeStyle = '#ffb8ff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ox + 9 * T + 4, oy + 8 * T + T / 2); ctx.lineTo(ox + 10 * T - 4, oy + 8 * T + T / 2); ctx.stroke();
  },
  drawWallsMona(t) {
    const T = this.T, ox = this.ox, oy = this.oy;
    for (let r = 0; r < 15; r++) for (let c = 0; c < 19; c++) {
      const ch = PMAZE[r][c]; if (ch !== '#') { if (ch === '-') { rr(ctx, ox + c * T + 2, oy + r * T + T / 2 - 4, T - 4, 8, 4); fillP(ctx, '#f2c23e'); } continue; }
      const x = ox + c * T, y = oy + r * T;
      rr(ctx, x + 2, y + 2, T - 4, T - 4, 10); fillP(ctx, '#1f5c3a');
      if (PMAZE[r][c + 1] === '#') { ctx.fillStyle = '#1f5c3a'; ctx.fillRect(x + T - 8, y + 2, 16, T - 4); }
      if (PMAZE[r + 1] && PMAZE[r + 1][c] === '#') { ctx.fillStyle = '#1f5c3a'; ctx.fillRect(x + 2, y + T - 8, T - 4, 16); }
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(x + 4, y + 3, T - 8, 3);
    }
    for (let r = 0; r < 15; r += 2) for (let c = 0; c < 19; c += 3) if (PMAZE[r][c] === '#') bulb(ctx, this.ox + c * T + T / 2, this.oy + r * T + T / 2, LIGHT_COLS[(r + c) % 5], .5 + .5 * Math.sin(t * 3 + r + c), .8);
  },
  draw() {
    const t = this.t, s = this.scr, T = this.T, ox = this.ox, oy = this.oy, mona = this.mode === 'mona';
    gameBackdrop(t, 'evening', this.mode);
    ipadFrame(40, 60, 960, 780, t);
    ctx.save(); rr(ctx, s.x, s.y, s.w, s.h, 18); ctx.clip();
    ctx.fillStyle = mona ? '#0b1020' : '#000'; ctx.fillRect(s.x, s.y, s.w, s.h);
    if (mona) { ctx.globalAlpha = .3; drawSnow(ctx, s.x, s.y, s.w, s.h, t, 30, .7); ctx.globalAlpha = 1; this.drawWallsMona(t); } else this.drawWallsClassic();
    for (let r = 0; r < 15; r++) for (let c = 0; c < 19; c++) {
      const f = this.food[r][c], x = ox + c * T + T / 2, y = oy + r * T + T / 2; if (!f) continue;
      if (mona) { if (f === 1) { ell(ctx, x, y, 5.5, 4.2, (c * 7 + r) % 3 - 1); ink(ctx, '#b7773a', 1.4); } else { const p = 1 + .18 * Math.sin(t * 6); ctx.save(); ctx.translate(x, y); ctx.scale(p, p); drawHeart(ctx, 0, 4, 1.5, '#ff5a7a'); glowAt(ctx, 0, 0, 26, '255,90,130', .3); ctx.restore(); } }
      else { if (f === 1) { ctx.fillStyle = '#ffb8ae'; ctx.fillRect(x - 3, y - 3, 6, 6); } else if (Math.sin(t * 8) > -.3) { ctx.fillStyle = '#ffb8ae'; circ(ctx, x, y, 9); ctx.fill(); } }
    }
    for (const v of this.bad) {
      const vp = v.state === 'out' ? this.pos(v) : { x: v.home[0], y: v.home[1] }; if (v.state === 'gone') continue;
      const x = ox + vp.x * T + T / 2, y = oy + vp.y * T + T / 2, sc = this.scared > 0 && v.state === 'out', blink = sc && this.scared < 2 && Math.sin(t * 20) > 0;
      if (mona) drawBaddie(ctx, v.kind, x, y, .95, sc, t, v.dir[0] || 1, blink);
      else pixSprite(ctx, sc ? 'scared' : v.pix, x, y, 3.6, v.dir[0] || 1, t, sc && blink ? '#ffffff' : undefined);
    }
    const M = this.mona, mp = this.pos(M), mx = ox + mp.x * T + T / 2, my = oy + mp.y * T + T / 2, moving = M.dir[0] || M.dir[1];
    if (mona) {
      drawMonaHead(ctx, mx, my + 2, .6, { t, mouth: moving && Math.sin(t * 22) > 0 ? 'open' : 'smile', outfit: curOutfit(), look: { x: M.dir[0], y: M.dir[1] }, eyes: this.scared > 0 ? 'happy' : undefined });
      if (this.scared > 0) { ctx.save(); ctx.translate(mx + 16, my - 10); ctx.rotate(-.6); rr(ctx, 0, -2.5, 22, 5, 2.5); ink(ctx, '#f2c23e', 1.6); ctx.beginPath(); ctx.moveTo(21, -2); ctx.lineTo(32, -9); ctx.lineTo(32, 9); ctx.lineTo(21, 2); ctx.closePath(); ink(ctx, '#ffd75a', 1.6); ctx.restore(); }
    } else pixSprite(ctx, moving && Math.sin(t * 22) > 0 ? 'catO' : 'cat', mx, my, 3.6, M.face);
    // top bar
    if (mona) { retroText('SCORE ' + this.score, s.x + s.w - 150, s.y + 30, 24, '#fff'); for (let i = 0; i < this.lives; i++) drawMonaHead(ctx, s.x + 40 + i * 42, s.y + 31, .46, { t, outfit: curOutfit() }); retroText('MONA-MAN', s.x + s.w / 2, s.y + 30, 28, '#f2c14e'); }
    else { retroText('1UP', s.x + 70, s.y + 18, 18, '#fff'); pixNum(this.score, s.x + 40, s.y + 32, 4, '#fff'); retroText('HIGH SCORE', s.x + s.w / 2, s.y + 18, 18, '#fff'); pixNum(Math.max(this.score, (save.best || {}).pac || 0), s.x + s.w / 2 - 20, s.y + 32, 4, '#fff'); for (let i = 0; i < this.lives; i++) pixSprite(ctx, 'cat', s.x + s.w - 50 - i * 40, s.y + 30, 2.6, 1); }
    if (this.wait > 0 && !this.over) retroText('READY!', ox + 9.5 * T, oy + 7.5 * T, 30, mona ? '#f2c14e' : '#ffff00');
    if (this.ask) { ctx.fillStyle = 'rgba(11,16,32,.78)'; ctx.fillRect(s.x, s.y, s.w, s.h); retroText(mona ? ('THE ' + (this.caughtBy || 'VACUUM').toUpperCase() + ' GOT YOU!') : 'GAME OVER', s.x + s.w / 2, s.y + s.h / 2 - 70, mona ? 38 : 56, '#f2c14e'); }
    if (this.over) { ctx.fillStyle = 'rgba(11,16,32,.55)'; ctx.fillRect(s.x, s.y, s.w, s.h); retroText(mona ? 'ALL THE KIBBLE!' : 'BOARD CLEAR!', s.x + s.w / 2, s.y + s.h / 2, 56, '#f2c14e'); }
    if (!mona) { ctx.globalAlpha = .1; ctx.fillStyle = '#fff'; for (let y = s.y; y < s.y + s.h; y += 4) ctx.fillRect(s.x, y, s.w, 1); ctx.globalAlpha = 1; }
    ctx.restore();
    if (this.ask) { btn('keep', s.x + s.w / 2 - 190, s.y + s.h / 2, 380, 84, 'Keep playing', () => { this.ask = false; this.lives = 3; this.reset(); }, { color: '#3a8a55', size: 34 }); btn('skip4', s.x + s.w / 2 - 150, s.y + s.h / 2 + 100, 300, 60, 'Skip this game', () => storyNext(), { color: '#8a6a5a', size: 24 }); }
    if (mona) drawMonaPeek(ctx, 1110, 330, 1.15, { t, look: { x: -1, y: .3 }, outfit: curOutfit(), paws: true, eyes: this.scared > 0 ? 'happy' : undefined });
    else { ctx.save(); ctx.globalAlpha = .5 + .5 * Math.sin(t * 4); retroText('INSERT', 1112, 300, 30, '#ffff00'); retroText('COIN', 1112, 340, 30, '#ffff00'); ctx.restore(); }
    controlsCard(1006, 470, t, [['swipe', 'Swipe anywhere to turn'], ['pad', 'Or two-finger scroll on a trackpad'], ['keys', 'Or the arrow keys']], !mona);
    if (this.t < 7) hintPill(mona ? 'Eat all the kibble! Samantha hearts make the baddies run.' : 'Clear the board. Big dots turn the tables!', 870);
    else modeToggle('pc-mode', 300, 846, 300, 'pac', () => go('pac', sceneParams));
    if (this.over) gameDone(this, this.overT, mona ? 'Kibble: all gone!' : 'Board clear!', mona ? 'Mona ate every last bit and outwitted the vacuum, the vet carrier, the spray bottle AND the garbage truck. Score: ' + this.score + '.' : 'Pure 1982 arcade glory. Score: ' + this.score + '.', this.res);
  }
};

/* ============ Present Stack / Block Stack ============ */
function tetCell(g, x, y, c, k, classic, a) { if (classic) { g.globalAlpha = a == null ? 1 : a; blockClassic(g, x, y, c, k); g.globalAlpha = 1; } else drawGift(g, x, y, c, k, a); }
SCENES.tetris = {
  enter() {
    this.res = null; this.mode = modeOf('tetris'); audio.music(this.mode === 'classic' ? 'retro2' : 'retro');
    this.scr = { x: 74, y: 94, w: 892, h: 712 }; this.C = 32; this.cols = 10; this.rows = 20;
    this.bx = 74 + 892 / 2 - 5 * this.C - 60; this.by = 94 + 32;
    this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
    this.bag = []; this.next = this.draw1(); this.spawn(); this.lines = 0; this.score = 0; this.over = null; this.overT = 0; this.ask = false;
    this.fall = 0; this.lock = 0; this.clearing = null; this.monaCheer = 0; this.sw = null; this.bat = null; this.nextBat = rand(10, 14);
  },
  draw1() { if (!this.bag.length) { this.bag = Object.keys(TET_SHAPES); for (let i = this.bag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]]; } } return this.bag.pop(); },
  spawn() { const k = this.next; this.next = this.draw1(); this.p = { k, cells: TET_SHAPES[k].map(c => c.slice()), x: 3, y: -1 }; if (!this.fits(this.p.cells, this.p.x, this.p.y)) { this.ask = true; audio.sfx('lose'); } },
  fits(cells, ox, oy) { return cells.every(([cx, cy]) => { const x = cx + ox, y = cy + oy; return x >= 0 && x < this.cols && y < this.rows && (y < 0 || !this.board[y][x]); }); },
  rotate() { const p = this.p; if (p.k === 'O') return; const n = p.k === 'I' ? 4 : 3, rc = p.cells.map(([x, y]) => [n - 1 - y, x]); for (const kick of [0, -1, 1, -2, 2]) if (this.fits(rc, p.x + kick, p.y)) { p.cells = rc; p.x += kick; audio.sfx('tick'); this.lock = 0; return; } },
  shift(d) { if (this.fits(this.p.cells, this.p.x + d, this.p.y)) { this.p.x += d; audio.sfx('blip2'); this.lock = 0; return true; } return false; },
  drop() { let n = 0; while (this.fits(this.p.cells, this.p.x, this.p.y + 1)) { this.p.y++; n++; } this.score += n * 2; this.place(); audio.sfx('thud'); },
  place() {
    const p = this.p; for (const [cx, cy] of p.cells) { const y = cy + p.y; if (y < 0) { this.ask = true; return; } this.board[y][cx + p.x] = p.k; }
    const full = []; for (let r = 0; r < this.rows; r++) if (this.board[r].every(v => v)) full.push(r);
    if (full.length) { this.clearing = { rows: full, t: 0 }; audio.sfx(full.length > 1 ? 'win' : 'chime'); this.monaCheer = 1.4; this.score += [0, 100, 300, 500, 800][full.length]; full.forEach(r => spawn('sparkle', this.bx + this.cols * this.C / 2, this.by + r * this.C + 16, 12)); }
    else this.spawn();
  },
  update(dt) {
    this.monaCheer -= dt;
    if (this.over) { this.overT += dt; return; }
    if (this.ask) return;
    if (this.clearing) { this.clearing.t += dt; if (this.clearing.t > .35) { const rows = this.clearing.rows; this.board = this.board.filter((_, r) => !rows.includes(r)); while (this.board.length < this.rows) this.board.unshift(Array(this.cols).fill(null)); this.lines += rows.length; this.clearing = null; if (this.lines >= TET_GOAL) { this.over = 'win'; this.overT = 0; markDone('tetris'); audio.sfx('win'); spawn('confetti', 520, 300, 70); this.res = finishLevel('tetris', this.t < 180 ? 3 : this.t < 300 ? 2 : 1, this.score); if (this.res.stars < 3) this.res.tip = 'Clear ' + TET_GOAL + ' rows in under 3 minutes for 3 stars.'; return; } this.spawn(); } return; }
    // Mona bats the falling present now and then
    if (this.mode === 'mona') {
      if (!this.bat) { this.nextBat -= dt; if (this.nextBat <= 0 && this.p.y > 2 && this.p.y < 12) { this.bat = { t: 0, hit: false, dir: Math.random() < .5 ? -1 : 1 }; audio.sfx('meow', 1.2); } }
      else { this.bat.t += dt; if (!this.bat.hit && this.bat.t > .35) { this.bat.hit = true; if (this.shift(this.bat.dir)) { audio.sfx('swat'); const px = this.bx + (this.p.x + 1.5) * this.C, py = this.by + (this.p.y + 1) * this.C; spawn('pop', px, py - 30, 1, { label: 'BAT!', vx: 0, vy: -50, col: '#f2c14e', size: 34 }); } } if (this.bat.t > .8) { this.bat = null; this.nextBat = rand(11, 16); } }
    }
    const speed = Math.max(.12, .7 - this.lines * .05) * (this.soft ? .12 : 1);
    this.fall += dt;
    if (this.fits(this.p.cells, this.p.x, this.p.y + 1)) { this.lock = 0; if (this.fall >= speed) { this.fall = 0; this.p.y++; if (this.soft) this.score++; } }
    else { this.lock += dt; if (this.lock > .45) { this.lock = 0; this.fall = 0; this.place(); } }
  },
  down(x, y) { if (this.ask || this.over) return; this.sw = { x, y, sx: x, sy: y, t0: this.t, moved: false }; },
  stepDown() { if (this.p && this.fits(this.p.cells, this.p.x, this.p.y + 1)) { this.p.y++; this.score++; this.fall = 0; } },
  wheel(dx, dy, acc) {
    if (this.ask || this.over || this.clearing || !this.p) return; if (acc.fresh) acc.rot = false;
    acc.x += dx; acc.y += dy;
    while (acc.x > 44) { this.shift(1); acc.x -= 44; } while (acc.x < -44) { this.shift(-1); acc.x += 44; }
    while (acc.y > 36) { this.stepDown(); acc.y -= 36; }
    if (acc.y < -60 && !acc.rot) { acc.rot = true; this.rotate(); acc.y = 0; }
  },
  key(k) { if (this.ask || this.over || this.clearing || !this.p) return; if (k === 'left') this.shift(-1); else if (k === 'right') this.shift(1); else if (k === 'up') this.rotate(); else if (k === 'down') this.stepDown(); else if (k === 'space') this.drop(); },
  move(x, y) { const s = this.sw; if (!s) return; while (x - s.x > 34) { this.shift(1); s.x += 34; s.moved = true; } while (s.x - x > 34) { this.shift(-1); s.x -= 34; s.moved = true; } if (y - s.sy > 90 && !s.dropped && this.t - s.t0 < .35) { s.dropped = true; s.moved = true; this.drop(); } else if (y - s.y > 34) { this.soft = true; s.y = y; s.moved = true; } },
  up(x, y) { const s = this.sw; if (s && !s.moved) this.rotate(); this.sw = null; this.soft = false; },
  draw() {
    const t = this.t, s = this.scr, C = this.C, bx = this.bx, by = this.by, cl = this.mode === 'classic';
    gameBackdrop(t, 'evening', this.mode);
    ipadFrame(40, 60, 960, 780, t);
    ctx.save(); rr(ctx, s.x, s.y, s.w, s.h, 18); ctx.clip();
    if (cl) { ctx.fillStyle = '#000'; ctx.fillRect(s.x, s.y, s.w, s.h); }
    else { const gr = ctx.createLinearGradient(0, s.y, 0, s.y + s.h); gr.addColorStop(0, '#1b2350'); gr.addColorStop(1, '#0d1128'); ctx.fillStyle = gr; ctx.fillRect(s.x, s.y, s.w, s.h); ctx.globalAlpha = .5; drawSnow(ctx, s.x, s.y, s.w, s.h, t, 40, .9); ctx.globalAlpha = 1; }
    if (cl) { ctx.fillStyle = '#7a7a7a'; ctx.fillRect(bx - 10, by - 10, this.cols * C + 20, this.rows * C + 20); ctx.fillStyle = '#000'; ctx.fillRect(bx, by, this.cols * C, this.rows * C); }
    else { rr(ctx, bx - 8, by - 8, this.cols * C + 16, this.rows * C + 16, 12); ink(ctx, 'rgba(255,255,255,.06)', 3); for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) { ctx.fillStyle = (r + c) % 2 ? 'rgba(255,255,255,.025)' : 'rgba(255,255,255,.05)'; ctx.fillRect(bx + c * C, by + r * C, C, C); } }
    for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) { const k = this.board[r][c]; if (!k) continue; const fl = this.clearing && this.clearing.rows.includes(r); if (fl) { ctx.globalAlpha = 1 - this.clearing.t / .35; rr(ctx, bx + c * C, by + r * C, C, C, cl ? 0 : 6); fillP(ctx, '#fff6c0'); ctx.globalAlpha = 1; } else tetCell(ctx, bx + c * C, by + r * C, C, k, cl); }
    if (!this.clearing && !this.ask && !this.over) {
      const p = this.p; let gy = p.y; while (this.fits(p.cells, p.x, gy + 1)) gy++;
      for (const [cx, cy] of p.cells) if (cy + gy >= 0) { rr(ctx, bx + (cx + p.x) * C + 3, by + (cy + gy) * C + 3, C - 6, C - 6, cl ? 0 : 7); if (!cl) { ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fill(); ctx.save(); ctx.setLineDash([5, 4]); strokeP(ctx, 'rgba(255,255,255,.55)', 2); ctx.restore(); } else strokeP(ctx, 'rgba(255,255,255,.35)', 2); }
      for (const [cx, cy] of p.cells) if (cy + p.y >= 0) tetCell(ctx, bx + (cx + p.x) * C, by + (cy + p.y) * C, C, p.k, cl);
    }
    // Mona's paw comes in from the side for a bat
    if (this.bat && !cl) { const k = this.bat.t < .35 ? E.out(this.bat.t / .35) : 1 - E.inOut((this.bat.t - .35) / .45), d = this.bat.dir, py = by + (this.p.y + 1) * C, edge = d < 0 ? bx + (this.p.x + 3.4) * C : bx + (this.p.x - .4) * C; const sx = d < 0 ? bx + this.cols * C + 220 : bx - 220; drawRealPaw(ctx, sx, py + 30, lerp(sx, edge + (d < 0 ? 24 : -24), k), py, { s: .8, beans: true }); }
    const px = bx + this.cols * C + 40;
    retroText(GAMES.tetris[this.mode].toUpperCase(), px + 120, s.y + 44, 30, cl ? '#fff' : '#ffd34d');
    rr(ctx, px, s.y + 90, 240, 150, cl ? 0 : 16); ink(ctx, cl ? '#111' : 'rgba(255,255,255,.08)', 2); retroText('NEXT', px + 120, s.y + 112, 20, '#cfd6ff');
    TET_SHAPES[this.next].forEach(([cx, cy]) => tetCell(ctx, px + 72 + cx * 26, s.y + 140 + cy * 26, 26, this.next, cl));
    if (!PORT) { retroText('LINES  ' + this.lines + ' / ' + TET_GOAL, px + 120, s.y + 290, 26, '#fff');
    retroText('SCORE  ' + this.score, px + 120, s.y + 330, 24, '#cfd6ff'); }
    rr(ctx, px + 20, s.y + 360, 200, 14, 7); fillP(ctx, 'rgba(255,255,255,.12)'); rr(ctx, px + 20, s.y + 360, Math.max(14, 200 * Math.min(1, this.lines / TET_GOAL)), 14, 7); fillP(ctx, cl ? '#3ae65a' : '#2f9a5e');
    if (this.ask) { ctx.fillStyle = 'rgba(11,16,32,.75)'; ctx.fillRect(s.x, s.y, s.w, s.h); retroText(cl ? 'GAME OVER' : 'THE PRESENTS TOPPLED!', s.x + s.w / 2, s.y + s.h / 2 - 60, 40, '#ffd34d'); }
    if (this.over) { ctx.fillStyle = 'rgba(11,16,32,.55)'; ctx.fillRect(s.x, s.y, s.w, s.h); retroText(cl ? 'WELL DONE!' : 'ALL WRAPPED!', s.x + s.w / 2, s.y + s.h / 2, 60, '#ffd34d'); }
    if (cl) { ctx.globalAlpha = .08; ctx.fillStyle = '#fff'; for (let y = s.y; y < s.y + s.h; y += 4) ctx.fillRect(s.x, y, s.w, 1); ctx.globalAlpha = 1; }
    ctx.restore();
    if (this.ask) { btn('keep', s.x + s.w / 2 - 190, s.y + s.h / 2, 380, 84, 'Keep playing', () => { this.ask = false; this.board = this.board.map(r => r.map(() => null)); this.spawn(); }, { color: '#2f9a5e', size: 34 }); btn('skip6', s.x + s.w / 2 - 150, s.y + s.h / 2 + 100, 300, 60, 'Skip this game', () => storyNext(), { color: '#8a6a5a', size: 24 }); }
    controlsCard(1006, 470, t, [['tap', 'Tap to spin, drag to slide'], ['swipe', 'Flick down to drop'], ['pad', 'Trackpad scroll or arrow keys']], cl);
    if (!cl) { const cheer = this.monaCheer > 0; drawMonaPeek(ctx, 1100, 330 - (cheer ? Math.abs(Math.sin(t * 10)) * 14 : 0), 1.15, { t, look: { x: -1, y: .3 }, outfit: curOutfit(), paws: true, eyes: cheer ? 'happy' : this.bat ? 'wide' : undefined, mouth: cheer || this.bat ? 'open' : undefined, earsUp: !!this.bat }); if (cheer) speech(ctx, 'Mrrp!', 1100, 210, 0, 1, 120); }
    if (this.t < 7) hintPill('Fill a whole row to clear it. Clear ' + TET_GOAL + ' rows to win.' + (cl ? '' : ' Mona may bat at your presents!'), 870);
    else modeToggle('tt-mode', 300, 846, 300, 'tetris', () => go('tetris', sceneParams));
    if (this.over) gameDone(this, this.overT, cl ? 'Lines cleared!' : 'All wrapped!', cl ? 'Classic block stacking, done. Score: ' + this.score + '.' : 'Every present stacked neatly under the tree. Score: ' + this.score + '.', this.res);
  }
};
