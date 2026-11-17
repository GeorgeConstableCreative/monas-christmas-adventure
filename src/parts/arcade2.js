/* ============ v3 ARCADE: four new games, all starring Mona ============
   Super Mona Hop (platformer), 3am Zoomies (runner), Street Feline (fighter), Roomba Rally (kart). */
const AS = { x: 74, y: 94, w: 892, h: 712 };          // the game screen inside the iPad frame
function arcOpen(t, top, bot) {
  gameBackdrop(t, 'evening', 'mona'); ipadFrame(40, 60, 960, 780, t);
  ctx.save(); rr(ctx, AS.x, AS.y, AS.w, AS.h, 18); ctx.clip();
  const gr = ctx.createLinearGradient(0, AS.y, 0, AS.y + AS.h); gr.addColorStop(0, top); gr.addColorStop(1, bot); ctx.fillStyle = gr; ctx.fillRect(AS.x, AS.y, AS.w, AS.h);
}
function arcSide(id, t, rows, stats, mood) {
  const px = 1006;
  retroText(GAMES[id].mona.toUpperCase(), px + 107, 128, 22, '#ffd34d');
  ctx.save(); ctx.translate(px, 150); hudCard(0, 0, 214, 40 + stats.length * 44);
  stats.forEach(([l, v], i) => { text(ctx, l, 18, 30 + i * 44, { size: 16, align: 'left', color: '#8a6a5a', weight: 600 }); text(ctx, String(v), 196, 30 + i * 44, { size: 24, align: 'right', color: '#3b2f2a', weight: 700 }); });
  ctx.restore();
  controlsCard(px, 548, t, rows, false);
  if (mood !== false) drawMonaPeek(ctx, 1100, 500 - (mood === 'happy' ? Math.abs(Math.sin(t * 10)) * 12 : 0), .9, { t, look: { x: -1, y: .3 }, outfit: curOutfit(), paws: true, eyes: mood === 'happy' ? 'happy' : mood === 'wide' ? 'wide' : undefined, mouth: mood ? 'open' : undefined });
}
function comboPop(x, y, n, col) { if (n < 2) return; spawn('pop', x, y, 1, { label: n + 'x COMBO!', vx: 0, vy: -70, col: col || '#ffd34d', size: 30 + Math.min(20, n * 3), max: 1 }); if (n % 3 === 0) audio.sfx('combo'); }
function bigText(msg, x, y, size, col, k) { ctx.save(); ctx.translate(x, y); const s = E.back(clamp(k, 0, 1)); ctx.scale(s, s); ctx.rotate(-.04); text(ctx, msg, 0, 0, { size, color: col, weight: 700, stroke: '#1a0a28', sw: size * .16 }); ctx.restore(); }
function drawTreat(g, x, y, s, t) { // a little fish-shaped cat treat with a glint
  g.save(); g.translate(x, y + Math.sin(t * 4 + x * .05) * 4); g.scale(s, s); glowAt(g, 0, 0, 22, '255,220,120', .35);
  g.beginPath(); g.ellipse(-2, 0, 11, 7, 0, 0, TAU); g.moveTo(8, 0); g.lineTo(16, -7); g.lineTo(16, 7); g.closePath(); ink(g, '#d9893a', 2); circ(g, -7, -1.5, 1.8); fillP(g, '#3b2f2a'); line(g, -3, -6, 3, -1, 'rgba(255,255,255,.7)', 2); g.restore();
}

/* ======================= SUPER MONA HOP ======================= */
const PT2 = 48, PR2 = 14;
function hopMap() {
  const C = 124, m = Array.from({ length: PR2 }, () => Array(C).fill(' '));
  const ground = (a, b, top) => { for (let x = a; x <= b; x++) for (let y = top || 12; y < PR2; y++) m[y][x] = '#'; };
  const blocks = (a, b, row) => { for (let x = a; x <= b; x++) m[row][x] = 'B'; };
  ground(0, 17); ground(20, 34); ground(35, 38, 10); ground(39, 50); ground(54, 70); ground(71, 74, 9); ground(75, 88); ground(92, 123);
  blocks(8, 10, 8); blocks(26, 28, 8); blocks(44, 46, 8); blocks(60, 62, 8); blocks(64, 66, 5); blocks(80, 82, 8); blocks(96, 98, 8); blocks(101, 103, 5);
  const treats = [[9, 7], [10, 7], [8, 7], [18, 9], [19, 9], [27, 7], [26, 7], [28, 7], [36, 8], [37, 8], [45, 7], [52, 8], [53, 8], [61, 7], [65, 4], [66, 4], [64, 4], [72, 7], [73, 7], [81, 7], [90, 8], [91, 8], [97, 7], [102, 4], [103, 4], [108, 10], [110, 10], [112, 10]];
  treats.forEach(([x, y]) => m[y][x] = 't');
  [14, 30, 47, 58, 68, 84, 100, 106].forEach(x => m[11][x] = 'v');
  m[11][116] = 'F';
  return m;
}
SCENES.plat = {
  enter() {
    this.res = null; this.over = null; this.overT = 0; audio.music('arcade');
    const m = hopMap(); this.map = m; this.cols = m[0].length; this.treats = []; this.vacs = []; this.flag = null;
    m.forEach((row, y) => row.forEach((c, x) => { if (c === 't') { this.treats.push({ x: x * PT2 + 24, y: y * PT2 + 24, got: false }); row[x] = ' '; } if (c === 'v') { this.vacs.push({ x: x * PT2 + 24, y: (y + 1) * PT2, vx: -70, dead: 0 }); row[x] = ' '; } if (c === 'F') { this.flag = { x: x * PT2 + 24, y: (y + 1) * PT2 }; row[x] = ' '; } }));
    this.p = { x: 120, y: 12 * PT2, vx: 0, vy: 0, on: true, face: 1, gait: 0, coyote: 0, buf: 0, inv: 0 }; this.check = { x: 120, y: 12 * PT2 };
    this.cam = 0; this.lives = 3; this.deaths = 0; this.score = 0; this.got = 0; this.chain = 0; this.hold = { l: false, r: false }; this.ptr = null; this.wheelT = 0; this.wheelDir = 0;
  },
  solid(tx, ty) { if (tx < 0 || tx >= this.cols) return true; if (ty < 0 || ty >= PR2) return false; const c = this.map[ty][tx]; return c === '#' || c === 'B'; },
  jump() { this.p.buf = .14; },
  hurt() { const p = this.p; if (p.inv > 0) return; this.lives--; this.deaths++; p.inv = 1.6; p.vy = -600; p.vx = -p.face * 260; audio.sfx('meow', 1.6); audio.sfx('lose'); shake(.5); this.chain = 0; comboBreak(); if (this.lives <= 0) this.end(false); },
  end(win) {
    if (this.over) return; this.over = win ? 'win' : 'lose'; this.overT = 0; markDone('plat');
    if (win) { const ratio = this.got / this.treats.length; this.score += 1000 + this.lives * 300; this.res = finishLevel('plat', ratio > .8 && this.deaths === 0 ? 3 : ratio > .5 ? 2 : 1, this.score); audio.sfx('win'); spawn('confetti', W / 2, 300, 70); }
  },
  update(dt) {
    if (this.over) { this.overT += dt; return; }
    const p = this.p, hold = (this.hold.r || (this.ptrDir > 0) || (this.wheelT > 0 && this.wheelDir > 0) ? 1 : 0) - (this.hold.l || (this.ptrDir < 0) || (this.wheelT > 0 && this.wheelDir < 0) ? 1 : 0);
    this.wheelT -= dt; p.inv = Math.max(0, p.inv - dt); p.buf -= dt; p.coyote -= dt;
    const acc = p.on ? 2600 : 1600, max = 340;
    if (hold) { p.vx += hold * acc * dt; p.face = hold; } else { const f = (p.on ? 2400 : 600) * dt; p.vx = Math.abs(p.vx) < f ? 0 : p.vx - Math.sign(p.vx) * f; }
    p.vx = clamp(p.vx, -max, max);
    if (p.buf > 0 && (p.on || p.coyote > 0)) { p.vy = -940; p.on = false; p.buf = 0; p.coyote = 0; audio.sfx('blip'); spawn('dust', this.sx(p.x), this.sy(p.y), 5); }
    if (!this.jumpHeld && p.vy < -420 && !this.ptr) p.vy = Math.max(p.vy, -420 - 0);
    p.vy = Math.min(1300, p.vy + 2300 * dt);
    // move x, then y, resolving against tiles (box 40 wide, 44 tall, feet at p.y)
    const hw = 20, hh = 44;
    p.x += p.vx * dt;
    for (const sx of [-1, 1]) { const ex = p.x + sx * hw; const tx = Math.floor(ex / PT2); for (let ty = Math.floor((p.y - hh + 2) / PT2); ty <= Math.floor((p.y - 2) / PT2); ty++) if (this.solid(tx, ty) && Math.sign(p.vx) === sx) { p.x = sx > 0 ? tx * PT2 - hw - .01 : (tx + 1) * PT2 + hw + .01; p.vx = 0; } }
    const wasOn = p.on; p.on = false; p.y += p.vy * dt;
    if (p.vy >= 0) { const ty = Math.floor(p.y / PT2); for (let tx = Math.floor((p.x - hw + 2) / PT2); tx <= Math.floor((p.x + hw - 2) / PT2); tx++) if (this.solid(tx, ty) && p.y - p.vy * dt <= ty * PT2 + 1) { p.y = ty * PT2; p.vy = 0; p.on = true; } }
    else { const ty = Math.floor((p.y - hh) / PT2); for (let tx = Math.floor((p.x - hw + 2) / PT2); tx <= Math.floor((p.x + hw - 2) / PT2); tx++) if (this.solid(tx, ty)) { p.y = (ty + 1) * PT2 + hh; p.vy = 0; if (this.map[ty][tx] === 'B') { audio.sfx('thud'); spawn('sparkle', this.sx(tx * PT2 + 24), this.sy(ty * PT2 + 40), 6); } } }
    if (wasOn && !p.on && p.vy >= 0) p.coyote = .1;
    if (p.on && !wasOn) { this.chain = 0; }
    if (p.on) { p.gait += Math.abs(p.vx) * dt * .045; if (p.x > this.check.x + 300 && this.solid(Math.floor(p.x / PT2), Math.floor(p.y / PT2))) this.check = { x: p.x, y: p.y }; }
    // fell in a pit
    if (p.y > PR2 * PT2 + 120) { this.lives--; this.deaths++; audio.sfx('lose'); shake(.4); comboBreak(); if (this.lives <= 0) { this.end(false); return; } Object.assign(p, { x: this.check.x, y: this.check.y, vx: 0, vy: 0, inv: 1.4 }); }
    // treats
    for (const tr of this.treats) if (!tr.got && Math.abs(tr.x - p.x) < 34 && Math.abs(tr.y - (p.y - 22)) < 40) { tr.got = true; this.got++; this.score += 50; audio.sfx('coin'); spawn('sparkle', this.sx(tr.x), this.sy(tr.y), 8); addPts(50, this.sx(tr.x), this.sy(tr.y) - 30, null, true); }
    // vacuums: patrol, turn at walls and ledges; stomp from above
    for (const v of this.vacs) {
      if (v.dead) { v.dead += dt; continue; }
      if (Math.abs(v.x - p.x) > 1100) continue;
      v.x += v.vx * dt; const ahead = Math.floor((v.x + Math.sign(v.vx) * 26) / PT2), row = Math.floor((v.y - 10) / PT2);
      if (this.solid(ahead, row) || !this.solid(ahead, row + 1)) v.vx *= -1;
      if (Math.abs(v.x - p.x) < 44 && p.y > v.y - 64 && p.y - hh < v.y) {
        if (p.vy > 60 && p.y < v.y - 26) { v.dead = .001; p.vy = -640; this.chain++; const pts = 200 * this.chain; this.score += pts; audio.sfx('chomp'); shake(.3); addPts(pts, this.sx(v.x), this.sy(v.y) - 70, 'STOMP!', true); comboPop(this.sx(v.x), this.sy(v.y) - 120, this.chain); spawn('dust', this.sx(v.x), this.sy(v.y), 10); }
        else this.hurt();
      }
    }
    if (this.flag && Math.abs(p.x - this.flag.x) < 40) this.end(true);
    this.cam = lerp(this.cam, clamp(p.x - AS.w * .4, 0, this.cols * PT2 - AS.w), Math.min(1, dt * 6));
  },
  sx(x) { return AS.x + x - this.cam; }, sy(y) { return AS.y + 20 + y; },
  key(k) { if (k === 'left') this.hold.l = true; if (k === 'right') this.hold.r = true; if (k === 'up' || k === 'space') { if (!this.jumpHeld) this.jump(); this.jumpHeld = true; } },
  keyUp(k) { if (k === 'left') this.hold.l = false; if (k === 'right') this.hold.r = false; if (k === 'up' || k === 'space') this.jumpHeld = false; },
  down(x, y) { if (this.over) return; this.ptr = { x0: x, y0: y, t0: this.t, jumped: false }; this.ptrDir = Math.sign(x - this.sx(this.p.x)) * (Math.abs(x - this.sx(this.p.x)) > 30 ? 1 : 0); },
  move(x, y) { const P = this.ptr; if (!P) return; this.ptrDir = Math.abs(x - this.sx(this.p.x)) > 30 ? Math.sign(x - this.sx(this.p.x)) : 0; if (!P.jumped && P.y0 - y > 46) { P.jumped = true; this.jumpHeld = true; this.jump(); } },
  up(x, y) { const P = this.ptr; if (P && !P.jumped && this.t - P.t0 < .22 && dist(x, y, P.x0, P.y0) < 20) { this.jumpHeld = true; this.jump(); setTimeout(() => this.jumpHeld = false, 200); } else this.jumpHeld = false; this.ptr = null; this.ptrDir = 0; },
  wheel(dx, dy, acc) { if (Math.abs(dx) > 2) { this.wheelDir = Math.sign(dx); this.wheelT = .12; } if (dy < -12 && !acc.jumped) { acc.jumped = true; this.jumpHeld = true; this.jump(); setTimeout(() => this.jumpHeld = false, 220); } if (acc.fresh) acc.jumped = false; },
  draw() {
    const t = this.t, cam = this.cam;
    arcOpen(t, '#1d3b31', '#2b5e47');
    // parallax: moon, far hills, houses with lights, near hills
    circ(ctx, AS.x + 700 - cam * .03, AS.y + 110, 44); fillP(ctx, '#fff6d0'); glowAt(ctx, AS.x + 700 - cam * .03, AS.y + 110, 140, '255,240,200', .25);
    ctx.globalAlpha = .55; drawSnow(ctx, AS.x, AS.y, AS.w, AS.h, t, 40, .8); ctx.globalAlpha = 1;
    ctx.fillStyle = '#24503d'; ctx.beginPath(); ctx.moveTo(AS.x, AS.y + 520); for (let x = 0; x <= AS.w; x += 20) ctx.lineTo(AS.x + x, AS.y + 430 + Math.sin((x + cam * .2) * .008) * 50); ctx.lineTo(AS.x + AS.w, AS.y + AS.h); ctx.lineTo(AS.x, AS.y + AS.h); ctx.fill();
    for (let i = -1; i < 6; i++) { const hx = AS.x + ((i * 220 - cam * .35) % 1320 + 1320) % 1320 - 200, hy = AS.y + 470; rr(ctx, hx, hy - 90, 130, 90, 4); fillP(ctx, '#b23a3a'); ctx.beginPath(); ctx.moveTo(hx - 10, hy - 90); ctx.lineTo(hx + 65, hy - 140); ctx.lineTo(hx + 140, hy - 90); ctx.fill(); for (let w = 0; w < 3; w++) { rr(ctx, hx + 14 + w * 40, hy - 70, 24, 22, 3); fillP(ctx, '#ffd98a'); } for (let b = 0; b < 8; b++) bulb(ctx, hx - 6 + b * 20, hy - 92 + Math.abs(Math.sin(b)) * 5, LIGHT_COLS[b % 5], .5 + .5 * Math.sin(t * 3 + b + i), .6); }
    // tiles
    const c0 = Math.max(0, Math.floor(cam / PT2) - 1), c1 = Math.min(this.cols - 1, c0 + Math.ceil(AS.w / PT2) + 2);
    for (let ty = 0; ty < PR2; ty++) for (let tx = c0; tx <= c1; tx++) {
      const c = this.map[ty][tx], x = this.sx(tx * PT2), y = this.sy(ty * PT2); if (c === ' ') continue;
      if (c === '#') { const top = !this.solid(tx, ty - 1) || ty === 0; ctx.fillStyle = (tx + ty) % 2 ? '#7a4a2e' : '#83512f'; ctx.fillRect(x, y, PT2, PT2); ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fillRect(x, y + PT2 - 4, PT2, 4); if (top) { rr(ctx, x - 2, y - 6, PT2 + 4, 18, 8); fillP(ctx, '#f4f8ff'); ctx.fillStyle = '#d6e2f6'; ctx.fillRect(x, y + 8, PT2, 4); } }
      else if (c === 'B') drawGift(ctx, x, y, PT2, ['T', 'Z', 'J', 'O', 'S'][(tx + ty) % 5]);
    }
    // treats, flag, vacuums
    for (const tr of this.treats) if (!tr.got) drawTreat(ctx, this.sx(tr.x), this.sy(tr.y), 1.2, t);
    if (this.flag) { const fx = this.sx(this.flag.x), fy = this.sy(this.flag.y); rr(ctx, fx - 8, fy - 220, 16, 220, 6); ink(ctx, '#c9a77a', 2); for (let i = 0; i < 3; i++) { ell(ctx, fx, fy - 70 - i * 70, 46 - i * 6, 14); ink(ctx, '#e8ddd0', 2); } drawStar(ctx, fx, fy - 238, 22, '#ffd34d'); text(ctx, 'GOAL', fx, fy - 274, { size: 24, color: '#ffd34d', weight: 700, stroke: '#1a0a28', sw: 5 }); }
    for (const v of this.vacs) { const vx = this.sx(v.x), vy = this.sy(v.y); if (vx < AS.x - 60 || vx > AS.x + AS.w + 60) continue; if (v.dead) { if (v.dead < .6) { ctx.save(); ctx.globalAlpha = 1 - v.dead / .6; ctx.translate(vx, vy); ctx.scale(1.4, .35); drawBaddie(ctx, 'vacuum', 0, -12, 1, false, t, 1); ctx.restore(); } continue; } drawBaddie(ctx, 'vacuum', vx, vy - 26, 1.5, false, t, v.vx > 0 ? -1 : 1); }
    // Mona
    const p = this.p, mx = this.sx(p.x), my = this.sy(p.y);
    if (!(p.inv > 0 && Math.floor(t * 14) % 2)) { contactShadow(ctx, mx, my, 26, 6, p.on ? .3 : .12); drawMona(ctx, mx, my, .42, { pose: !p.on ? 'pounce' : Math.abs(p.vx) > 40 ? 'run' : 'sit', face: p.face, t, gait: p.gait, outfit: curOutfit(), eyes: p.inv > 0 ? 'wide' : undefined, noShadow: true }); }
    if (this.over) { ctx.fillStyle = 'rgba(11,16,32,.5)'; ctx.fillRect(AS.x, AS.y, AS.w, AS.h); bigText(this.over === 'win' ? 'GOAL!' : 'OUT OF LIVES', AS.x + AS.w / 2, AS.y + AS.h / 2 - 40, 70, '#ffd34d', this.overT * 2); }
    else if (this.t < 2) bigText('GO, MONA, GO!', AS.x + AS.w / 2, AS.y + 200, 54, '#ffd34d', this.t * 2.5);
    ctx.restore();
    arcSide('plat', t, [['tap', 'Tap or flick up to jump'], ['swipe', 'Hold left or right of Mona'], ['keys', 'Arrows and space']], [['Treats', this.got + ' / ' + this.treats.length], ['Lives', '♥'.repeat(Math.max(0, this.lives))], ['Score', this.score]], this.chain > 1 ? 'happy' : this.p.inv > 0 ? 'wide' : undefined);
    if (this.over) gameDone(this, this.overT, this.over === 'win' ? 'Super Mona!' : 'Bonked by the vacuums', this.over === 'win' ? 'Mona made it to the cat tree with ' + this.got + ' treats.' : 'The vacuums win this time. Stomp them from above!', this.res);
  }
};

/* ======================= 3AM ZOOMIES (runner) ======================= */
const ZM_GROUND = AS.y + 560, ZM_X = AS.x + 210, ZM_GOAL = 5200;
const ZM_OBS = { slipper: { w: 60, h: 34, low: true }, mug: { w: 40, h: 46, low: true }, mouse: { w: 54, h: 30, low: true }, basket: { w: 92, h: 96, low: true }, garland: { w: 120, h: 0, gapTop: 64 }, stool: { w: 110, h: 0, gapTop: 60 } };
SCENES.run = {
  enter() {
    this.res = null; this.over = null; this.overT = 0; audio.music('arcade');
    this.d = 0; this.v = 430; this.p = { y: 0, vy: 0, jumps: 0, slide: 0, spin: 0, gait: 0 }; this.obs = []; this.treats = []; this.nextObs = 700; this.nextTr = 400; this.hits = 0; this.inv = 0; this.score = 0; this.chain = 0; this.got = 0; this.stir = 0; this.lines = [];
  },
  jump() { const p = this.p; if (this.over) return; if (p.y === 0 && p.slide <= 0) { p.vy = -1020; p.jumps = 1; audio.sfx('blip'); } else if (p.jumps === 1) { p.vy = -900; p.jumps = 2; p.spin = 1; audio.sfx('blip2'); spawn('sparkle', ZM_X, ZM_GROUND - 60 + p.y, 8); } },
  slide() { const p = this.p; if (this.over) return; if (p.y < 0) { p.vy = Math.max(p.vy, 1200); } p.slide = .62; audio.sfx('whoosh'); },
  spawnObs() {
    const pool = this.d < 1200 ? ['slipper', 'mug', 'mouse'] : ['slipper', 'mug', 'mouse', 'basket', 'garland', 'stool', 'garland'];
    const k = pick(pool); this.obs.push({ k, x: W + 60, hit: false });
    this.nextObs = this.d + rand(520, 820) * (this.v / 430) * (this.d > 3000 ? .85 : 1);
  },
  update(dt) {
    if (this.over) { this.overT += dt; return; }
    const p = this.p; this.v = Math.min(980, this.v + dt * 11); this.inv = Math.max(0, this.inv - dt); this.stir = Math.max(0, this.stir - dt * .05);
    const dx = this.v * dt; this.d += dx;
    if (this.d > this.nextObs) this.spawnObs();
    if (this.d > this.nextTr) { const arc = Math.random() < .4, n = arc ? 5 : 4, base = arc ? -150 : -40; for (let i = 0; i < n; i++) this.treats.push({ x: W + 60 + i * 56, y: base - (arc ? Math.sin(i / (n - 1) * Math.PI) * 120 : 0), got: false }); this.nextTr = this.d + rand(500, 900); }
    for (const o of this.obs) o.x -= dx; for (const tr of this.treats) tr.x -= dx;
    this.obs = this.obs.filter(o => o.x > -200); this.treats = this.treats.filter(tr => tr.x > -100 && !tr.gone);
    // Mona
    p.vy += 3000 * dt; p.y = Math.min(0, p.y + p.vy * dt); if (p.y === 0) { p.vy = 0; p.jumps = 0; }
    p.slide = Math.max(0, p.slide - dt); p.spin = Math.max(0, p.spin - dt * 2.2); p.gait += this.v * dt * .05;
    const mh = p.slide > 0 ? 30 : 62, top = ZM_GROUND + p.y - mh, bot = ZM_GROUND + p.y;
    for (const o of this.obs) {
      if (o.hit || this.inv > 0) continue; const O = ZM_OBS[o.k]; if (Math.abs(o.x - ZM_X) > O.w / 2 + 20) continue;
      const crash = O.low ? bot > ZM_GROUND - O.h + 6 : top < ZM_GROUND - O.gapTop;
      if (crash) { o.hit = true; this.hits++; this.inv = 1.2; this.chain = 0; comboBreak(); shake(.55); audio.sfx('thud'); audio.sfx('meow', 1.6); this.v = Math.max(430, this.v * .75); spawn('pop', ZM_X, ZM_GROUND - 140, 1, { label: pick(['OOF!', 'CRASH!', 'BONK!']), vx: 0, vy: -60, col: '#ff7a5a', size: 40 }); this.stir = this.hits / 3; if (this.hits >= 3) this.end(false); }
      else if (!o.passed && o.x < ZM_X - O.w / 2) { o.passed = true; this.score += 30; }
    }
    for (const tr of this.treats) { if (tr.got) continue; const ty = ZM_GROUND - 40 + tr.y; if (Math.abs(tr.x - ZM_X) < 34 && ty > top - 30 && ty < bot + 10) { tr.got = true; tr.gone = true; this.got++; this.chain++; const pts = 20 * Math.min(5, this.chain); this.score += pts; audio.sfx('coin'); spawn('sparkle', tr.x, ty, 6); if (this.chain % 5 === 0) comboPop(tr.x, ty - 50, this.chain); } }
    if (this.d >= ZM_GOAL) this.end(true);
    // speed lines
    if (Math.random() < dt * this.v / 40) this.lines.push({ x: AS.x + AS.w + 20, y: AS.y + rand(80, 520), l: rand(60, 160) });
    for (const l of this.lines) l.x -= this.v * 2.2 * dt; this.lines = this.lines.filter(l => l.x + l.l > AS.x);
  },
  end(win) {
    if (this.over) return; this.over = win ? 'win' : 'lose'; this.overT = 0; markDone('run');
    this.score += Math.floor(this.d / 10);
    if (win) { this.res = finishLevel('run', this.hits === 0 ? 3 : this.hits === 1 ? 2 : 1, this.score); audio.sfx('win'); spawn('confetti', W / 2, 300, 60); } else audio.sfx('lose');
  },
  key(k) { if (k === 'up' || k === 'space') this.jump(); if (k === 'down') this.slide(); },
  down(x, y) { this.sw = { x, y, t0: this.t, done: false }; },
  move(x, y) { const s = this.sw; if (!s || s.done) return; if (y - s.y > 46) { s.done = true; this.slide(); } else if (s.y - y > 46) { s.done = true; this.jump(); } },
  up(x, y) { const s = this.sw; if (s && !s.done) this.jump(); this.sw = null; },
  wheel(dx, dy, acc) { if (acc.fresh) acc.did = false; if (acc.did) return; if (dy > 20) { acc.did = true; this.slide(); } else if (dy < -20) { acc.did = true; this.jump(); } },
  draw() {
    const t = this.t, sc = this.d;
    arcOpen(t, '#3a1416', '#5a2224');
    // the hallway at 3am: moonlit window light pools, picture frames, doors, a Christmas garland along the top
    const par = (k, sp, fn) => { const off = (sc * k) % sp; for (let x = -off - sp; x < AS.w + sp; x += sp) fn(AS.x + x); };
    ctx.fillStyle = '#232a4a'; ctx.fillRect(AS.x, AS.y, AS.w, ZM_GROUND - AS.y); ctx.fillStyle = '#1b2140'; ctx.fillRect(AS.x, ZM_GROUND - 30, AS.w, 30);
    par(.3, 420, x => { rr(ctx, x + 40, AS.y + 150, 110, 280, 6); fillP(ctx, '#2f3a5e'); circ(ctx, x + 136, AS.y + 300, 5); fillP(ctx, '#c9a24a'); rr(ctx, x + 230, AS.y + 170, 120, 90, 4); ink(ctx, '#3a3060', 3); rr(ctx, x + 240, AS.y + 180, 100, 70, 2); fillP(ctx, '#46508a'); });
    par(.3, 840, x => { const g2 = ctx.createLinearGradient(x + 520, AS.y + 120, x + 600, ZM_GROUND); g2.addColorStop(0, 'rgba(170,200,255,.25)'); g2.addColorStop(1, 'rgba(170,200,255,0)'); ctx.fillStyle = g2; ctx.beginPath(); ctx.moveTo(x + 540, AS.y + 120); ctx.lineTo(x + 640, AS.y + 120); ctx.lineTo(x + 760, ZM_GROUND); ctx.lineTo(x + 560, ZM_GROUND); ctx.fill(); rr(ctx, x + 540, AS.y + 110, 100, 130, 4); ink(ctx, '#9fb4ff', 3); });
    par(.6, 60, x => bulb(ctx, x, AS.y + 60 + Math.abs(Math.sin((x + sc * .6) * .02)) * 12, LIGHT_COLS[Math.abs(Math.floor((x + sc * .6) / 60)) % 5], .5 + .5 * Math.sin(t * 4 + x), .8));
    // floor: wooden boards rushing past
    ctx.fillStyle = '#3a2a24'; ctx.fillRect(AS.x, ZM_GROUND, AS.w, AS.y + AS.h - ZM_GROUND); par(1, 140, x => line(ctx, x, ZM_GROUND, x - 40, AS.y + AS.h, 'rgba(0,0,0,.3)', 3)); ctx.fillStyle = '#4a352c'; ctx.fillRect(AS.x, ZM_GROUND, AS.w, 6);
    // plug-in night lights along the skirting (their glow comes later, over the darkness)
    par(1, 520, x => { rr(ctx, x - 13, ZM_GROUND - 54, 26, 34, 5); fillP(ctx, '#9a948a'); });
    for (const l of this.lines) line(ctx, l.x, l.y, l.x + l.l, l.y, 'rgba(255,255,255,' + (.08 + this.v / 4000) + ')', 3);
    // treats & obstacles
    for (const tr of this.treats) if (!tr.got) drawTreat(ctx, tr.x, ZM_GROUND - 40 + tr.y, 1.2, t);
    for (const o of this.obs) {
      const x = o.x, gy = ZM_GROUND; ctx.save(); if (o.hit) { ctx.globalAlpha = .5; }
      if (o.k === 'slipper') { ell(ctx, x, gy - 14, 32, 15); ink(ctx, '#f29ac0', 2.4); ell(ctx, x - 6, gy - 22, 18, 9); fillP(ctx, '#ffd0e4'); for (let i = 0; i < 6; i++) circ(ctx, x - 22 + i * 9, gy - 26 + Math.sin(i) * 3, 5); fillP(ctx, '#fff'); }
      else if (o.k === 'mug') { rr(ctx, x - 20, gy - 46, 40, 46, 6); ink(ctx, '#e2443b', 2.4); g2Ring(x + 24, gy - 26); text(ctx, '♥', x, gy - 22, { size: 18, color: '#fff', weight: 700 }); }
      else if (o.k === 'mouse') { ell(ctx, x, gy - 14, 26, 14); ink(ctx, '#9a9aa6', 2.2); circ(ctx, x - 22, gy - 24, 7); ink(ctx, '#f2b0c0', 2); g2Tail(x + 24, gy - 10, t); }
      else if (o.k === 'basket') { rr(ctx, x - 46, gy - 96, 92, 96, 10); ink(ctx, '#c9a06a', 2.4); for (let i = 0; i < 5; i++) line(ctx, x - 40, gy - 80 + i * 18, x + 40, gy - 80 + i * 18, 'rgba(120,80,40,.45)', 3); ell(ctx, x - 10, gy - 100, 30, 12); fillP(ctx, '#e2443b'); ell(ctx, x + 18, gy - 104, 22, 10); fillP(ctx, '#4a7cf0'); }
      else if (o.k === 'garland') { const top = AS.y, bot = gy - ZM_OBS.garland.gapTop; ctx.beginPath(); ctx.moveTo(x - 60, top); ctx.quadraticCurveTo(x, bot + 40, x + 60, top); strokeP(ctx, '#2f7a4a', 14); for (let i = 0; i < 5; i++) { const u = i / 4, sx = lerp(x - 50, x + 50, u), sy = top + (bot - top) * Math.sin(u * Math.PI) * .95; ctx.save(); ctx.translate(sx, sy); rr(ctx, -12, -6, 24, 32, 6); ink(ctx, i % 2 ? '#e2443b' : '#fff', 2); rr(ctx, -12, -6, 24, 9, 4); fillP(ctx, '#fff'); ctx.restore(); } }
      else if (o.k === 'stool') { const topY = gy - ZM_OBS.stool.gapTop - 22; rr(ctx, x - 60, topY, 120, 22, 8); ink(ctx, '#8a5a3a', 2.4); line(ctx, x - 50, topY + 20, x - 56, gy, '#6a4024', 8); line(ctx, x + 50, topY + 20, x + 56, gy, '#6a4024', 8); drawGift(ctx, x - 30, topY - 52, 52, 'Z'); }
      ctx.restore();
    }
    // Mona: running, double-jump spin, or sliding flat
    const p = this.p, my = ZM_GROUND + p.y;
    if (!(this.inv > 0 && Math.floor(t * 14) % 2)) {
      contactShadow(ctx, ZM_X, ZM_GROUND, 34, 7, .35 - Math.min(.25, -p.y / 800));
      ctx.save(); ctx.translate(ZM_X, my); if (p.spin > 0) { ctx.translate(0, -30); ctx.rotate((1 - p.spin) * TAU); ctx.translate(0, 30); } if (p.slide > 0) ctx.scale(1.25, .55);
      drawMona(ctx, 0, 0, .5, { pose: p.y < 0 ? 'pounce' : 'run', face: 1, t, gait: p.gait, outfit: curOutfit(), eyes: this.inv > 0 ? 'wide' : 'open', noShadow: true });
      ctx.restore();
      if (p.y === 0 && p.slide <= 0 && Math.random() < .3) spawn('dust', ZM_X - 30, ZM_GROUND - 4, 1);
    }
    // 3am darkness: the hallway is dark except for the night lights, the moonlight and a little glow around Mona
    {
      const L = zmDark.c || (zmDark.c = document.createElement('canvas')), w2 = AS.w / 2, h2 = AS.h / 2; if (L.width !== w2) { L.width = w2; L.height = h2; } const g = L.getContext('2d');
      g.setTransform(.5, 0, 0, .5, -AS.x * .5, -AS.y * .5); g.globalCompositeOperation = 'source-over'; g.clearRect(AS.x, AS.y, AS.w, AS.h); g.fillStyle = 'rgba(6,8,24,.7)'; g.fillRect(AS.x, AS.y, AS.w, AS.h);
      g.globalCompositeOperation = 'destination-out';
      const hole = (x, y, r, a, sy) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(0,0,0,' + a + ')'); gr.addColorStop(.55, 'rgba(0,0,0,' + a * .6 + ')'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.save(); g.fillStyle = gr; g.translate(x, y); g.scale(1, sy || 1); g.translate(-x, -y); g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
      par(1, 520, x => hole(x, ZM_GROUND - 30, 230, .95, .8));
      par(.3, 840, x => { g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.moveTo(x + 540, AS.y + 110); g.lineTo(x + 640, AS.y + 110); g.lineTo(x + 780, ZM_GROUND + 60); g.lineTo(x + 540, ZM_GROUND + 60); g.fill(); });
      hole(ZM_X + 90, ZM_GROUND + this.p.y - 50, 260, .8, .9);
      ctx.drawImage(L, AS.x, AS.y, AS.w, AS.h);
      par(1, 520, x => {
        glowAt(ctx, x, ZM_GROUND + 6, 150, '255,180,90', .45, .3); glowAt(ctx, x, ZM_GROUND - 40, 70, '255,210,130', .5);
        // the night light itself: a little glowing crescent moon on a plug
        ctx.save(); ctx.translate(x, ZM_GROUND - 40); ctx.beginPath(); ctx.arc(0, 0, 11, 0, TAU); ctx.fillStyle = '#ffe2a0'; ctx.fill(); ctx.beginPath(); ctx.arc(5, -3, 9, 0, TAU); ctx.fillStyle = '#8a8478'; ctx.fill(); ctx.restore();
      });
      // Mona's eyes shine in the dark
      if (!(this.inv > 0 && Math.floor(t * 14) % 2) && this.p.slide <= 0) { glowAt(ctx, ZM_X + 22, ZM_GROUND + this.p.y - 52, 26, '200,255,120', .5); }
    }
    // the "Samantha stirs" meter: three crashes and she wakes up
    ctx.save(); ctx.translate(AS.x + AS.w - 210, AS.y + 74); rr(ctx, -10, -24, 200, 48, 24); fillP(ctx, 'rgba(0,0,0,.45)'); drawSamHead(ctx, 16, 14, .34, { t, expr: this.hits ? 'grump' : 'sleepy', mask: 1 }); for (let i = 0; i < 3; i++) { circ(ctx, 70 + i * 36, 0, 12); fillP(ctx, i < this.hits ? '#ff5a5a' : 'rgba(255,255,255,.18)'); text(ctx, 'z', 70 + i * 36, 1, { size: 15, color: '#fff', weight: 700 }); } ctx.restore();
    // progress to the bedroom
    rr(ctx, AS.x + 40, AS.y + AS.h - 46, AS.w - 80, 14, 7); fillP(ctx, 'rgba(255,255,255,.15)'); rr(ctx, AS.x + 40, AS.y + AS.h - 46, Math.max(14, (AS.w - 80) * Math.min(1, this.d / ZM_GOAL)), 14, 7); fillP(ctx, '#7fb2ff'); drawPaw(ctx, AS.x + 40 + (AS.w - 80) * Math.min(1, this.d / ZM_GOAL), AS.y + AS.h - 39, .6, '#fff'); text(ctx, 'BED', AS.x + AS.w - 30, AS.y + AS.h - 39, { size: 14, color: '#fff', weight: 700 });
    if (this.over) { ctx.fillStyle = 'rgba(11,16,32,.55)'; ctx.fillRect(AS.x, AS.y, AS.w, AS.h); bigText(this.over === 'win' ? 'MADE IT TO BED!' : 'SAMANTHA WOKE UP!', AS.x + AS.w / 2, AS.y + AS.h / 2 - 40, 58, '#ffd34d', this.overT * 2); }
    else if (t < 2.2) bigText('3AM. ZOOMIES.', AS.x + AS.w / 2, AS.y + 220, 60, '#7fb2ff', t * 2.5);
    ctx.restore();
    arcSide('run', t, [['tap', 'Tap to jump, tap again to double'], ['swipe', 'Flick down to slide'], ['keys', 'Up/space jump, down slide']], [['Speed', Math.round(this.v / 10) + ' mph'], ['Treats', this.got], ['Score', this.score + Math.floor(this.d / 10)]], this.chain >= 5 ? 'happy' : this.inv > 0 ? 'wide' : undefined);
    if (this.over) gameDone(this, this.overT, this.over === 'win' ? 'Zoom zoom!' : 'Busted!', this.over === 'win' ? 'Mona tore through the house and made it to bed with ' + this.hits + ' crash' + (this.hits === 1 ? '' : 'es') + '.' : 'Three crashes and Samantha woke up. Mona is pretending she was asleep all along.', this.res);
  }
};
function zmDark() {}
function g2Ring(x, y) { ctx.beginPath(); ctx.arc(x, y, 10, -Math.PI / 2, Math.PI / 2); strokeP(ctx, '#e2443b', 5); }
function g2Tail(x, y, t) { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 20, y - 18 + Math.sin(t * 8) * 6, x + 34, y - 4); strokeP(ctx, '#9a9aa6', 3); }

/* ======================= STREET FELINE (fighter) ======================= */
const SF = { ground: AS.y + 560, mx: AS.x + 250, tx: AS.x + 660 };
const SF_BTNS = [{ id: 'block', x: AS.x + 110, y: AS.y + 615, r: 46, col: '#4a8cf0', lab: 'BLOCK' }, { id: 'scratch', x: AS.x + AS.w - 250, y: AS.y + 615, r: 50, col: '#e2443b', lab: 'SCRATCH' }, { id: 'pounce', x: AS.x + AS.w - 110, y: AS.y + 608, r: 52, col: '#f2b83a', lab: 'POUNCE' }];
function drawTruck(g, x, y, s, t, o) {
  o = o || {}; g.save(); g.translate(x, y); g.scale(s, s); const rum = o.ko ? 0 : Math.sin(t * 30) * 1.5; g.translate(0, rum);
  if (o.flash) { g.filter = 'brightness(2.2)'; }
  // hopper (back) and the cab (front, facing left)
  rr(g, -40, -200, 230, 170, 16); ink(g, rad(g, 60, -120, 160, '#2f9a52'), 3); for (let i = 0; i < 5; i++) line(g, -20 + i * 44, -190, -20 + i * 44, -40, 'rgba(0,0,0,.22)', 4);
  g.beginPath(); g.moveTo(190, -200); g.lineTo(230, -150); g.lineTo(230, -30); g.lineTo(190, -30); g.closePath(); ink(g, '#267a42', 3);
  rr(g, -170, -170, 140, 140, 18); ink(g, rad(g, -100, -110, 110, '#3fae6c'), 3);
  rr(g, -150, -156, 70, 52, 8); fillP(g, '#bfe4ff'); line(g, -150, -120, -80, -156, 'rgba(255,255,255,.6)', 4);
  // the angry face: headlight eyes with brows, a toothy grille
  const ey = -78; for (const ex of [-160, -110]) { circ(g, ex, ey, 14); fillP(g, o.tell ? '#fff6a0' : '#fffbe8'); if (o.tell) glowAt(g, ex, ey, 40, '255,240,140', .8); circ(g, ex - 3, ey + 2, 6); fillP(g, '#1a1a20'); }
  g.save(); g.lineCap = 'round'; line(g, -176, ey - 22, -146, ey - 14, '#14301e', 6); line(g, -96, ey - 22, -124, ey - 14, '#14301e', 6); g.restore();
  rr(g, -176, -56, 70, 26, 6); fillP(g, '#d9dde2'); for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(-172 + i * 11, -56); g.lineTo(-166 + i * 11, -44); g.lineTo(-160 + i * 11, -56); fillP(g, '#fff'); }
  // wheels, bumper, beacon
  rr(g, -180, -34, 410, 18, 6); fillP(g, '#3a3a40');
  for (const wx of [-110, 60, 160]) { g.save(); g.translate(wx, -12); g.rotate(o.roll || 0); circ(g, 0, 0, 30); ink(g, '#1e1e22', 3); circ(g, 0, 0, 12); fillP(g, '#9a9aa6'); line(g, -10, 0, 10, 0, '#55555e', 3); g.restore(); }
  circ(g, -100, -178, 10); fillP(g, Math.sin(t * 10) > 0 ? '#ffb020' : '#a86a10');
  g.filter = 'none';
  if (o.ko) { for (let i = 0; i < 4; i++) { const k = (t * .6 + i * .25) % 1; circ(g, 40 + Math.sin(i * 2 + t) * 20, -210 - k * 160, 20 + k * 30); fillP(g, 'rgba(120,120,130,' + (.5 * (1 - k)) + ')'); } }
  g.restore();
}
function sfBtns() {
  if (!PORT) return SF_BTNS; const y = Math.max((DOCK ? DOCK.y0 : PH - 400) + 230, PH - SAFE_B - 150);
  return [{ id: 'block', x: 130, y, r: 80, col: '#4a8cf0', lab: 'BLOCK' }, { id: 'scratch', x: PW - 300, y: y + 10, r: 76, col: '#e2443b', lab: 'SCRATCH' }, { id: 'pounce', x: PW - 120, y: y - 40, r: 76, col: '#f2b83a', lab: 'POUNCE' }];
}
SCENES.fight = {
  dockP() { },
  enter() {
    this.res = null; this.over = null; this.overT = 0; audio.music('rave');
    this.m = { hp: 100, act: null, actT: 0, block: false, blockT0: -9, stun: 0, x: SF.mx, dx: 0, cd: 0 };
    this.k = { hp: 160, st: 'intro', t: 0, x: SF.tx, move: null, flash: 0, roll: 0, bags: [] };
    this.combo = 0; this.lastHit = -9; this.score = 0; this.hitsTaken = 0; this.fx = []; this.held = {};
  },
  btnAt(x, y) { const P0 = PORT ? screenPt() : { x, y }; return sfBtns().find(b => dist(P0.x, P0.y, b.x, b.y) < b.r + 14); },
  act(id) {
    const m = this.m; if (this.over || this.k.st === 'intro' || m.stun > 0) return;
    if (id === 'block') { if (!m.block) { m.block = true; m.blockT0 = this.t; } return; }
    if (m.act) return;
    if (id === 'scratch') { m.act = 'scratch'; m.actT = 0; audio.sfx('swat'); }
    if (id === 'pounce') { if (m.cd > 0) { audio.sfx('blip2'); return; } m.act = 'pounce'; m.actT = 0; m.cd = 2.4; audio.sfx('whoosh'); audio.sfx('meow', 1.4); }
  },
  unblock() { this.m.block = false; },
  hitTruck(dmg, x, y, label) {
    const k = this.k; if (k.st === 'ko') return;
    const combo = this.t - this.lastHit < .8 ? ++this.combo : (this.combo = 1); this.lastHit = this.t;
    const d = dmg + (combo > 2 ? 2 : 0); k.hp = Math.max(0, k.hp - d); k.flash = .12; this.score += d * 10 * Math.min(4, combo);
    this.fx.push({ kind: 'slash', x, y, t: 0 }); shake(dmg > 10 ? .55 : .25); audio.sfx(dmg > 10 ? 'thud' : 'scratch');
    spawn('pop', x, y - 40, 1, { label: label || pick(['SWIPE!', 'SCRATCH!', 'HISS!']), vx: rand(-30, 30), vy: -90, col: '#fff', size: 30 }); comboPop(x, y - 100, combo, '#ffd34d');
    if (k.st === 'tell' && dmg > 10) { k.st = 'stagger'; k.t = 0; spawn('pop', x, y - 150, 1, { label: 'COUNTER!', vx: 0, vy: -60, col: '#7fd0ff', size: 40 }); this.score += 300; }
    if (k.hp <= 0) { k.st = 'ko'; k.t = 0; this.end(true); }
  },
  hitMona(dmg, label) {
    const m = this.m; if (this.over) return;
    const perfect = m.block && this.t - m.blockT0 < .3;
    if (perfect) { spawn('pop', m.x, SF.ground - 200, 1, { label: 'PERFECT BLOCK!', vx: 0, vy: -60, col: '#7fd0ff', size: 34 }); this.score += 200; audio.sfx('ding'); this.k.st = 'stagger'; this.k.t = 0; return; }
    const d = m.block ? Math.round(dmg * .15) : dmg; m.hp = Math.max(0, m.hp - d); this.hitsTaken++;
    if (!m.block) { m.stun = .45; m.act = null; this.combo = 0; shake(.6); audio.sfx('meow', 1.7); spawn('pop', m.x, SF.ground - 170, 1, { label: label || 'OUCH!', vx: 0, vy: -60, col: '#ff7a5a', size: 34 }); }
    else { audio.sfx('thud'); spawn('pop', m.x, SF.ground - 170, 1, { label: 'BLOCKED', vx: 0, vy: -60, col: '#cfe0ff', size: 26 }); }
    if (m.hp <= 0) this.end(false);
  },
  end(win) {
    if (this.over) return; this.over = win ? 'win' : 'lose'; this.overT = 0; markDone('fight');
    if (win) { this.score += this.m.hp * 20; this.res = finishLevel('fight', this.m.hp > 66 ? 3 : this.m.hp > 33 ? 2 : 1, this.score); audio.sfx('win'); setTimeout(() => spawn('confetti', W / 2, 300, 60), 600); } else audio.sfx('lose');
  },
  update(dt) {
    const m = this.m, k = this.k; k.flash = Math.max(0, k.flash - dt); m.stun = Math.max(0, m.stun - dt); m.cd = Math.max(0, m.cd - dt);
    for (const f of this.fx) f.t += dt; this.fx = this.fx.filter(f => f.t < .4);
    if (this.over) { this.overT += dt; k.t += dt; return; }
    k.t += dt;
    if (k.st === 'intro' && k.t > 2.2) { k.st = 'idle'; k.t = 0; k.wait = 1.4; audio.sfx('bugle'); }
    // Mona's moves
    if (m.act) {
      m.actT += dt;
      if (m.act === 'scratch') { m.dx = Math.sin(Math.min(1, m.actT / .26) * Math.PI) * 120; if (m.actT > .12 && !m.hit) { m.hit = true; this.hitTruck(6, k.x - 150, SF.ground - 110 + rand(-30, 30)); } if (m.actT > .26) { m.act = null; m.hit = false; m.dx = 0; } }
      if (m.act === 'pounce') { const u = Math.min(1, m.actT / .62); m.dx = Math.sin(u * Math.PI) * 260; m.dy = -Math.sin(u * Math.PI) * 170; if (m.actT > .3 && !m.hit) { m.hit = true; this.hitTruck(18, k.x - 140, SF.ground - 160, 'POUNCE!'); } if (u >= 1) { m.act = null; m.hit = false; m.dx = 0; m.dy = 0; } }
    }
    // the truck: idle, telegraph, attack
    if (k.st === 'idle') { k.x = lerp(k.x, SF.tx, dt * 3); if (k.t > k.wait) { k.st = 'tell'; k.t = 0; k.move = pick(['honk', 'charge', 'toss', 'charge']); audio.sfx('car'); } }
    else if (k.st === 'tell') { if (k.t > .85) { k.st = 'atk'; k.t = 0; if (k.move === 'honk') audio.sfx('bugle'); if (k.move === 'toss') k.bags = [0, .35, .7].map(d => ({ d, t: -d, done: false })); } }
    else if (k.st === 'atk') {
      if (k.move === 'honk') { if (k.t > .35 && !k.hitDone) { k.hitDone = true; this.hitMona(10, 'HONNNK!'); } if (k.t > .8) this.toIdle(); }
      if (k.move === 'charge') { const u = k.t / .5; if (u < 1) { k.x = lerp(SF.tx, m.x + 220, u * u * u); k.roll -= dt * 20; } else if (!k.hitDone) { k.hitDone = true; this.hitMona(18, 'VROOM!'); } if (k.t > .5) { k.x = lerp(k.x, SF.tx, dt * 4); k.roll += dt * 8; } if (k.t > 1.3) this.toIdle(); }
      if (k.move === 'toss') { for (const b of k.bags) { b.t += dt; if (b.t >= .6 && !b.done) { b.done = true; this.hitMona(6, 'SPLAT!'); } } if (k.bags.every(b => b.done) && k.t > 1.6) this.toIdle(); }
    } else if (k.st === 'stagger') { k.x = lerp(k.x, SF.tx + 60, dt * 6); if (k.t > 1) this.toIdle(); }
    // keep held keys/fingers honest
    if (m.block && !this.held.block && !this.held.key) m.block = false;
  },
  toIdle() { const k = this.k; k.st = 'idle'; k.t = 0; k.wait = rand(.9, 1.7) * (k.hp < 60 ? .7 : 1); k.hitDone = false; k.bags = []; },
  key(kk) { if (kk === 'left' || kk === 'down') { this.held.key = true; this.act('block'); } if (kk === 'right' || kk === 'space') this.act('scratch'); if (kk === 'up') this.act('pounce'); },
  keyUp(kk) { if (kk === 'left' || kk === 'down') { this.held.key = false; this.unblock(); } },
  down(x, y) { const b = this.btnAt(x, y); this.sw = { x, y, b: b && b.id }; if (b) { if (b.id === 'block') this.held.block = true; this.act(b.id); } },
  move(x, y) { const s = this.sw; if (!s || s.b || s.done) return; if (s.y - y > 50) { s.done = true; this.act('pounce'); } },
  up(x, y) { const s = this.sw; if (s && !s.b && !s.done) this.act(x < AS.x + AS.w / 2 ? 'scratch' : 'scratch'); this.held.block = false; this.unblock(); this.sw = null; },
  wheel(dx, dy, acc) { if (acc.fresh) acc.did = false; if (!acc.did && dy < -24) { acc.did = true; this.act('pounce'); } else if (!acc.did && Math.abs(dx) > 24) { acc.did = true; this.act('scratch'); } },
  draw() {
    const t = this.t, m = this.m, k = this.k;
    arcOpen(t, '#1d3b31', '#122a22');
    // the street at night: houses with lights, a lamppost, snow
    for (let i = 0; i < 4; i++) { const hx = AS.x + 20 + i * 230, hy = SF.ground - 120; rr(ctx, hx, hy - 160, 200, 160, 6); fillP(ctx, ['#b23a3a', '#ecdfca', '#2b5e47', '#b23a3a'][i]); ctx.beginPath(); ctx.moveTo(hx - 12, hy - 160); ctx.lineTo(hx + 100, hy - 230); ctx.lineTo(hx + 212, hy - 160); fillP(ctx, '#1c1438'); for (let w = 0; w < 2; w++) { rr(ctx, hx + 30 + w * 100, hy - 120, 44, 40, 4); fillP(ctx, '#ffd98a'); } for (let b = 0; b < 10; b++) bulb(ctx, hx + b * 22, hy - 162 + Math.abs(Math.sin(b)) * 6, LIGHT_COLS[(b + i) % 5], .5 + .5 * Math.sin(t * 4 + b + i), .7); }
    line(ctx, AS.x + 470, SF.ground, AS.x + 470, SF.ground - 330, '#15102a', 8); circ(ctx, AS.x + 470, SF.ground - 340, 14); fillP(ctx, '#ffe9a0'); glowAt(ctx, AS.x + 470, SF.ground - 300, 220, '255,230,160', .35);
    ctx.fillStyle = '#3a3a40'; ctx.fillRect(AS.x, SF.ground, AS.w, AS.h); ctx.fillStyle = '#f4f8ff'; ctx.fillRect(AS.x, SF.ground - 6, AS.w, 10); for (let x = 0; x < AS.w; x += 80) { ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(AS.x + x, SF.ground + 60, 40, 6); }
    ctx.globalAlpha = .5; drawSnow(ctx, AS.x, AS.y, AS.w, AS.h, t, 40, .8); ctx.globalAlpha = 1;
    // telegraph
    if (k.st === 'tell') { const lab = { honk: 'HONK!', charge: 'CHARGE!', toss: 'TRASH TOSS!' }[k.move]; const p = .5 + .5 * Math.sin(t * 20); text(ctx, '!', k.x - 110, SF.ground - 290 - p * 10, { size: 60, color: '#ff5a5a', weight: 700, stroke: '#fff', sw: 6 }); bigText(lab, k.x - 30, SF.ground - 330, 34, '#ff9a5a', k.t * 4); }
    if (k.st === 'atk' && k.move === 'honk') for (let i = 0; i < 3; i++) { const r = 40 + ((k.t * 500 + i * 60) % 260); ctx.globalAlpha = Math.max(0, 1 - r / 300); ctx.beginPath(); ctx.arc(k.x - 190, SF.ground - 80, r, Math.PI * .75, Math.PI * 1.25); strokeP(ctx, '#ffd34d', 8); ctx.globalAlpha = 1; }
    // the truck and its flying rubbish
    contactShadow(ctx, k.x + 20, SF.ground + 4, 220, 18, .4);
    drawTruck(ctx, k.x, SF.ground, 1, t, { tell: k.st === 'tell', flash: k.flash > 0, roll: k.roll, ko: k.st === 'ko' });
    for (const b of k.bags) { if (b.t < 0 || b.done) continue; const u = b.t / .6, bx = lerp(k.x - 60, m.x + 20, u), by = lerp(SF.ground - 200, SF.ground - 70, u) - Math.sin(u * Math.PI) * 220; ctx.save(); ctx.translate(bx, by); ctx.rotate(u * 8); ell(ctx, 0, 0, 26, 30); ink(ctx, '#2a2a30', 2.4); line(ctx, -6, -28, 6, -36, '#2a2a30', 4); ctx.restore(); }
    // Mona
    const mx = m.x + m.dx, my = SF.ground + (m.dy || 0);
    contactShadow(ctx, m.x + m.dx, SF.ground + 4, 70, 12, .35);
    drawMona(ctx, mx, my, 1.05, { pose: m.stun > 0 ? 'alert' : m.act === 'pounce' ? 'pounce' : m.act === 'scratch' ? 'swat' : m.block ? 'loaf' : this.over === 'win' ? 'celebrate' : 'sit', swatK: 1, face: 1, t, outfit: curOutfit(), eyes: m.stun > 0 ? 'wide' : this.over === 'win' ? 'happy' : undefined, earsBack: m.block, noShadow: true });
    if (m.block) { ctx.save(); ctx.globalAlpha = .55 + .2 * Math.sin(t * 12); ctx.beginPath(); ctx.arc(mx + 30, my - 70, 110, -1.1, 1.1); strokeP(ctx, '#7fd0ff', 10); ctx.restore(); }
    for (const f of this.fx) { ctx.save(); ctx.globalAlpha = 1 - f.t / .4; for (let i = 0; i < 3; i++) line(ctx, f.x - 40 + i * 18, f.y - 50, f.x + 10 + i * 18, f.y + 40, '#ffffff', 7 - f.t * 12); ctx.restore(); }
    // health bars
    const bar = (x, w, hp, max, name, right) => { rr(ctx, x, AS.y + 30, w, 30, 8); fillP(ctx, '#2a1020'); const f = hp / max; rr(ctx, right ? x + w * (1 - f) : x, AS.y + 30, Math.max(8, w * f), 30, 8); fillP(ctx, f > .5 ? '#ffd34d' : f > .25 ? '#ff9a3a' : '#ff4a4a'); rr(ctx, x, AS.y + 30, w, 30, 8); strokeP(ctx, '#fff', 3); text(ctx, name, right ? x + w : x, AS.y + 80, { size: 22, align: right ? 'right' : 'left', color: '#fff', weight: 700, stroke: '#1a0a28', sw: 5 }); };
    bar(AS.x + 30, 360, m.hp, 100, 'MONA', false); bar(AS.x + AS.w - 390, 360, k.hp, 160, 'GARBAGE TRUCK', true);
    text(ctx, 'VS', AS.x + AS.w / 2, AS.y + 46, { size: 30, color: '#ffd34d', weight: 700, stroke: '#1a0a28', sw: 6 });
    // buttons (on a phone they sit in the dock, big, under her thumbs)
    const drawBtns = () => { const BS = sfBtns(); for (const b of BS) { const on = (b.id === 'block' && m.block) || m.act === b.id, cd = b.id === 'pounce' && m.cd > 0, dy = on ? 6 : 0, col = cd ? '#6a6a70' : b.id === 'block' ? XC.fir : b.id === 'scratch' ? XC.red : XC.gold; ctx.save(); ctx.translate(b.x, b.y);
      circ(ctx, 0, 8, b.r); fillP(ctx, shade(col, -.3)); circ(ctx, 0, dy, b.r); fillP(ctx, col); circ(ctx, 0, dy, b.r * .62); fillP(ctx, 'rgba(255,255,255,.14)');
      xIcon(b.id === 'block' ? 'wreath' : b.id === 'scratch' ? 'starburst' : 'star', 0, dy - b.r * .12, b.r * 1.1, col);
      if (cd) { ctx.beginPath(); ctx.moveTo(0, dy); ctx.arc(0, dy, b.r, -Math.PI / 2, -Math.PI / 2 + TAU * (m.cd / 2.4)); ctx.closePath(); fillP(ctx, 'rgba(0,0,0,.35)'); }
      text(ctx, b.lab, 0, b.r + 30, { size: PORT ? 26 : 18, color: XC.snow, display: true }); ctx.restore(); } };
    if (PDEFER) deferLate(drawBtns); else drawBtns();
    if (k.st === 'intro') { bigText(k.t < 1.2 ? 'ROUND 1' : 'FIGHT!', AS.x + AS.w / 2, AS.y + 260, 90, k.t < 1.2 ? '#fff' : '#ffd34d', (k.t % 1.2) * 3); }
    if (this.over) { ctx.fillStyle = 'rgba(11,16,32,.35)'; ctx.fillRect(AS.x, AS.y, AS.w, AS.h); bigText(this.over === 'win' ? 'K.O.!' : 'MONA LOSES', AS.x + AS.w / 2, AS.y + 250, 110, '#ff5a3a', this.overT * 2.5); }
    ctx.restore();
    arcSide('fight', t, [['tap', 'Tap SCRATCH, flick up to POUNCE'], ['tap', 'Hold BLOCK when it charges'], ['keys', 'Right hit, up pounce, left block']], [['Combo', this.combo], ['Score', this.score]], false);
    if (this.over) gameDone(this, this.overT, this.over === 'win' ? 'Mona wins!' : 'The truck wins...', this.over === 'win' ? 'The garbage truck has been well and truly scratched.' : 'Block when it flashes its lights, then pounce while it winds up!', this.res);
  }
};

/* ======================= ROOMBA RALLY (kart) ======================= */
const RR_PTS = [[420, 1250], [380, 760], [520, 420], [900, 300], [1350, 340], [1700, 520], [1820, 860], [2120, 980], [2160, 1320], [1860, 1520], [1300, 1480], [1000, 1240], [720, 1440]];
const RR_TW = 210, RR_LAPS = 3;
function rrTrack() {
  if (rrTrack.c) return rrTrack.c; const P = RR_PTS, n = P.length, out = [];
  for (let i = 0; i < n; i++) { const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n]; for (let k = 0; k < 24; k++) { const u = k / 24, u2 = u * u, u3 = u2 * u; out.push([0, 1].map(j => .5 * (2 * p1[j] + (-p0[j] + p2[j]) * u + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * u2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * u3))); } }
  return (rrTrack.c = out);
}
function rrNear(x, y, hint) { const T = rrTrack(), n = T.length; let bi = 0, bd = 1e12; const scan = hint == null ? [0, n] : [hint - 20, hint + 40]; for (let j = scan[0]; j < scan[1]; j++) { const i = ((j % n) + n) % n, d = (T[i][0] - x) ** 2 + (T[i][1] - y) ** 2; if (d < bd) { bd = d; bi = i; } } return { i: bi, d: Math.sqrt(bd) }; }
function drawRRWorld(g) {
  g.fillStyle = '#c99a6a'; g.fillRect(0, 0, 2600, 1900); // hallway wood
  for (let x = 0; x < 2600; x += 70) { g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(x, 0, 3, 1900); }
  g.fillStyle = '#e9e3d8'; g.fillRect(1180, 0, 1420, 760); for (let x = 1180; x < 2600; x += 60) for (let y = 0; y < 760; y += 60) if ((x + y) / 60 % 2) { g.fillStyle = 'rgba(80,90,110,.12)'; g.fillRect(x, y, 60, 60); } // kitchen tiles
  g.fillStyle = '#8a3a3a'; g.fillRect(0, 0, 1180, 900); g.fillStyle = 'rgba(255,255,255,.05)'; for (let i = 0; i < 40; i++) g.fillRect(0, i * 22, 1180, 4); // living room carpet
  g.fillStyle = '#5e7a9a'; g.fillRect(1500, 1100, 1100, 800); // bedroom
  // furniture (decor)
  rr(g, 60, 40, 380, 130, 30); ink(g, '#4a4f5c', 4); rr(g, 1300, 30, 520, 90, 10); ink(g, '#d0d4da', 4); rr(g, 2250, 30, 160, 260, 10); ink(g, '#e8ecf0', 4); rr(g, 2120, 1560, 420, 300, 30); ink(g, '#f4f0ea', 4);
  // the infield: a big Christmas tree and presents
  g.save(); g.translate(1200, 900); for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(0, 0, 220 - i * 50, 0, TAU); g.fillStyle = ['#1f5a36', '#2a7044', '#348a52', '#41a060'][i]; g.fill(); } for (let i = 0; i < 18; i++) { const a = i * 2.4, r = 40 + (i * 53 % 170); bulb(g, Math.cos(a) * r, Math.sin(a) * r, LIGHT_COLS[i % 5], 1, 1.2); } drawStar(g, 0, 0, 40, '#ffd34d'); g.restore();
  [[920, 980, 'O'], [1460, 820, 'T'], [1300, 1120, 'Z'], [1060, 700, 'J']].forEach(([x, y, k]) => drawGift(g, x, y, 80, k));
  // the track: tarmac-grey runner rug with candy-cane kerbs
  const T = rrTrack(); g.lineJoin = 'round'; g.lineCap = 'round';
  const path = () => { g.beginPath(); T.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); };
  path(); g.lineWidth = RR_TW + 34; g.strokeStyle = '#fff'; g.stroke(); g.setLineDash([34, 34]); g.strokeStyle = '#e2443b'; g.stroke(); g.setLineDash([]);
  path(); g.lineWidth = RR_TW; g.strokeStyle = '#6a6a74'; g.stroke();
  path(); g.lineWidth = 4; g.setLineDash([30, 30]); g.strokeStyle = 'rgba(255,255,255,.6)'; g.stroke(); g.setLineDash([]);
  // start/finish line
  const a = T[0], b = T[3], an = Math.atan2(b[1] - a[1], b[0] - a[0]); g.save(); g.translate(a[0], a[1]); g.rotate(an + Math.PI / 2); for (let i = -6; i < 6; i++) for (let j = 0; j < 2; j++) { g.fillStyle = (i + j) % 2 ? '#111' : '#fff'; g.fillRect(i * 17.5, j * 17.5 - 17, 17.5, 17.5); } g.restore();
}
const RR_BOOST = [70, 170, 250];
function drawRoomba(g, x, y, a, s, col, cat, t, upAngle) {
  g.save(); g.translate(x, y); g.rotate(a); g.scale(s, s);
  circ(g, 0, 4, 36); fillP(g, 'rgba(0,0,0,.25)'); circ(g, 0, 0, 34); ink(g, rad(g, -8, -8, 40, '#3a3d44'), 2.4); circ(g, 0, 0, 22); strokeP(g, 'rgba(255,255,255,.18)', 3); g.beginPath(); g.arc(0, 0, 34, -.9, .9); strokeP(g, col, 6); circ(g, 26, 0, 4); fillP(g, '#6ef09a');
  g.restore();
  // the cat sits upright on top whatever way the roomba is pointing
  g.save(); g.translate(x, y); g.rotate(upAngle); drawCat(g, 0, 14, .44 * s, { pose: 'sit', face: 1, t, outfit: cat ? 'none' : curOutfit(), eyes: 'happy', noShadow: true }, cat); g.restore();
}
SCENES.kart = {
  enter() {
    this.res = null; this.over = null; this.overT = 0; audio.music('arcade');
    const T = rrTrack(), n = T.length, st = (i, off) => { const p = T[(i + n) % n], q = T[(i + 3 + n) % n], a = Math.atan2(q[1] - p[1], q[0] - p[0]); return { x: p[0] - Math.sin(a) * off, y: p[1] + Math.cos(a) * off, a }; };
    const mk = (i, off, coat, col, me) => Object.assign(st(i, off), { v: 0, coat, col, me, prog: (i + n) % n - n, idx: (i + n) % n, lap: 0, boost: 0, skill: me ? 1 : rand(.86, .96), done: false, place: 0 });
    this.karts = [mk(-6, -50, null, '#ffd34d', true), mk(-6, 50, COATS.ginger, '#ff8a3a'), mk(-12, -50, COATS.black, '#c58cff'), mk(-12, 50, COATS.white, '#7fd0ff')];
    this.me = this.karts[0]; this.count = 3.6; this.steer = 0; this.hold = { l: 0, r: 0 }; this.ptr = null; this.wheelS = 0; this.finishOrder = [];
  },
  update(dt) {
    if (this.over) { this.overT += dt; }
    const T = rrTrack(), n = T.length;
    if (this.count > 0) { const c0 = Math.ceil(this.count); this.count -= dt; const c1 = Math.ceil(this.count); if (c1 !== c0) audio.sfx(c1 <= 0 ? 'ding' : 'tick'); return; }
    const me = this.me; this.wheelS *= Math.exp(-dt * 6);
    const input = clamp((this.hold.r - this.hold.l) + (this.ptr ? clamp((this.ptr.x - this.ptr.x0) / 110, -1, 1) : 0) + this.wheelS, -1, 1);
    for (const k of this.karts) {
      if (k.done && !k.me) { k.v *= Math.exp(-dt * 2); }
      const nr = rrNear(k.x, k.y, k.idx), off = nr.d > RR_TW / 2;
      let steer;
      if (k.me && !k.done) {
        // assisted driving: the roomba follows the track by itself; left/right moves it across the track
        k.lane = clamp((k.lane || 0) + input * 1.9 * dt, -1, 1);
        const ti = (nr.i + 8) % n, tq = T[(ti + 1) % n], tp = T[ti], ta = Math.atan2(tq[1] - tp[1], tq[0] - tp[0]), off2 = k.lane * RR_TW * .36;
        const want = Math.atan2(tp[1] + Math.cos(ta) * off2 - k.y, tp[0] - Math.sin(ta) * off2 - k.x); let d = want - k.a; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU;
        steer = clamp(d * 3.2, -1, 1);
      }
      else { const tg = T[(nr.i + 9) % n], want = Math.atan2(tg[1] - k.y, tg[0] - k.x); let d = want - k.a; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; steer = clamp(d * 2.4, -1, 1); }
      const vmax = (off ? 230 : 470) * (k.me ? 1 : k.skill * (1 + clamp((me.prog - k.prog) / n * .6, -.08, .12))) + (k.boost > 0 ? 260 : 0);
      k.v += ((k.done && !k.me ? 0 : vmax) - k.v) * Math.min(1, dt * (k.v < vmax ? 1.6 : 3));
      k.a += steer * (k.me ? 3.6 : 2.7) * dt * clamp(k.v / 300, .3, 1.2);
      if (k.me) { const n2 = rrNear(k.x, k.y, k.idx), lim = RR_TW / 2 - 26; if (n2.d > lim) { const c = T[n2.i], f = lim / n2.d; k.x = c[0] + (k.x - c[0]) * f; k.y = c[1] + (k.y - c[1]) * f; } } // the kerb keeps you on the track
      k.x += Math.cos(k.a) * k.v * dt; k.y += Math.sin(k.a) * k.v * dt; k.boost = Math.max(0, k.boost - dt);
      // progress & laps
      let di = nr.i - k.idx; if (di < -n / 2) di += n; if (di > n / 2) di -= n; k.prog += di; k.idx = nr.i;
      const lap = Math.floor(k.prog / n); if (lap > k.lap) { k.lap = lap; if (k.me && lap < RR_LAPS) { audio.sfx('chime'); spawn('pop', W / 2 - 200, 260, 1, { label: lap === RR_LAPS - 1 ? 'FINAL LAP!' : 'LAP ' + (lap + 1), vx: 0, vy: -40, col: '#ffd34d', size: 48 }); } }
      if (k.lap >= RR_LAPS && !k.done) { k.done = true; this.finishOrder.push(k); k.place = this.finishOrder.length; if (k.me) this.end(); }
      for (const b of RR_BOOST) { const p = T[b]; if (dist(k.x, k.y, p[0], p[1]) < 70 && k.boost <= 0) { k.boost = 1.1; if (k.me) { audio.sfx('power'); shake(.25); spawn('pop', W / 2 - 200, 300, 1, { label: 'BOOST!', vx: 0, vy: -60, col: '#ff5a8a', size: 40 }); } } }
      if (k.me && off && Math.random() < dt * 8) spawn('dust', W / 2 - 200 + rand(-20, 20), AS.y + AS.h * .7 + 30, 1);
    }
    // bump apart
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) { const A = this.karts[i], B = this.karts[j], d = dist(A.x, A.y, B.x, B.y); if (d < 66 && d > 0) { const ux = (B.x - A.x) / d, uy = (B.y - A.y) / d, push = (66 - d) / 2, wa = A.me ? 0 : B.me ? 2 : 1, wb = B.me ? 0 : A.me ? 2 : 1; A.x -= ux * push * wa; A.y -= uy * push * wa; B.x += ux * push * wb; B.y += uy * push * wb; if ((A.me || B.me) && d < 60) { audio.sfx('thud'); } } }
  },
  place() { const sorted = this.karts.slice().sort((a, b) => (b.done ? 1e6 - b.place * 1000 : b.prog) - (a.done ? 1e6 - a.place * 1000 : a.prog)); return sorted.indexOf(this.me) + 1; },
  end() { if (this.over) return; const pl = this.me.place; this.over = pl; this.overT = 0; markDone('kart'); this.score = [0, 3000, 2000, 1200, 600][pl]; this.res = finishLevel('kart', pl === 1 ? 3 : pl === 2 ? 2 : 1, this.score); audio.sfx(pl === 1 ? 'win' : 'chime'); if (pl === 1) spawn('confetti', W / 2, 300, 70); },
  key(k) { if (k === 'left') this.hold.l = 1; if (k === 'right') this.hold.r = 1; },
  keyUp(k) { if (k === 'left') this.hold.l = 0; if (k === 'right') this.hold.r = 0; },
  down(x, y) { this.ptr = { x0: x, x }; }, move(x, y) { if (this.ptr) this.ptr.x = x; }, up() { this.ptr = null; },
  wheel(dx) { this.wheelS = clamp(this.wheelS + dx / 80, -1, 1); },
  draw() {
    const t = this.t, me = this.me, T = rrTrack();
    arcOpen(t, '#b88a5a', '#a87a4a');
    // chase camera: the player's roomba stays low in the middle, pointing up the screen
    // the camera turns smoothly (not snapping with every wiggle) and on a phone pulls back so you can see the bends coming
    if (this.camA == null) this.camA = me.a; { let d = me.a - this.camA; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; this.camA += d * Math.min(1, (this._lastT != null ? t - this._lastT : 0) * 3.5); } this._lastT = t;
    const up = -this.camA - Math.PI / 2, cx = AS.x + AS.w / 2, cy = AS.y + AS.h * (PORT ? .76 : .7), z = PORT ? .74 : 1.05;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(up); ctx.scale(z, z); ctx.translate(-me.x, -me.y);
    ctx.drawImage(cached('rr-world', 2600, 1900, g => drawRRWorld(g)), 0, 0);
    for (const b of RR_BOOST) { const p = T[b], q = T[b + 2], an = Math.atan2(q[1] - p[1], q[0] - p[0]); ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(an); for (let i = 0; i < 3; i++) { const k = (t * 2 + i / 3) % 1; ctx.globalAlpha = .4 + .6 * (1 - k); ctx.beginPath(); ctx.moveTo(-30 + i * 22, -40); ctx.lineTo(-8 + i * 22, 0); ctx.lineTo(-30 + i * 22, 40); strokeP(ctx, i % 2 ? '#fff' : '#e2443b', 10); } ctx.globalAlpha = 1; ctx.restore(); }
    const sorted = this.karts.slice().sort((a, b) => a.y - b.y);
    for (const k of sorted) { if (k.boost > 0) for (let i = 0; i < 3; i++) { circ(ctx, k.x - Math.cos(k.a) * (40 + i * 16), k.y - Math.sin(k.a) * (40 + i * 16), 10 - i * 3); fillP(ctx, 'rgba(255,120,160,' + (.6 - i * .2) + ')'); } drawRoomba(ctx, k.x, k.y, k.a, k.me ? 1.15 : 1, k.col, k.coat, t, -up); }
    ctx.restore();
    // HUD: place, lap, minimap
    const pl = this.over || this.place(), lap = Math.min(RR_LAPS, me.lap + 1);
    if (!PORT) text(ctx, ['', '1st', '2nd', '3rd', '4th'][pl], AS.x + 30, AS.y + 70, { size: 64, align: 'left', color: pl === 1 ? '#ffd34d' : '#fff', weight: 700, stroke: '#1a0a28', sw: 9 });
    if (!PORT) text(ctx, 'LAP ' + lap + '/' + RR_LAPS, AS.x + AS.w - 30, AS.y + 60, { size: 34, align: 'right', color: '#fff', weight: 700, stroke: '#1a0a28', sw: 7 });
    ctx.save(); ctx.translate(PORT ? 620 : AS.x + AS.w - 190, PORT ? AS.y + 30 : AS.y + AS.h - 150); rr(ctx, -10, -10, 180, 140, 14); fillP(ctx, 'rgba(0,0,0,.45)'); ctx.scale(.068, .068); ctx.beginPath(); T.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); strokeP(ctx, '#fff', 60); for (const k of this.karts) { circ(ctx, k.x, k.y, k.me ? 90 : 70); fillP(ctx, k.col); } ctx.restore();
    if (this.count > 0) { const c = Math.ceil(this.count); bigText(c > 3 ? 'READY?' : c > 0 ? String(c) : 'GO!', AS.x + AS.w / 2, AS.y + 260, 110, c > 0 ? '#fff' : '#6ef09a', 1 - (this.count % 1) + .3); }
    if (this.over) { ctx.fillStyle = 'rgba(11,16,32,.35)'; ctx.fillRect(AS.x, AS.y, AS.w, AS.h); bigText(['', '1ST PLACE!', '2ND PLACE', '3RD PLACE', '4TH PLACE'][this.over], AS.x + AS.w / 2, AS.y + 250, 90, '#ffd34d', this.overT * 2.5); }
    ctx.restore();
    arcSide('kart', t, [['swipe', 'Drag left or right to steer'], ['pad', 'Trackpad sideways steers too'], ['keys', 'Left and right arrows']], [['Place', ['', '1st', '2nd', '3rd', '4th'][pl]], ['Lap', lap + ' / ' + RR_LAPS], ['Speed', Math.round(me.v / 5) + ' mph']], pl === 1 ? 'happy' : undefined);
    if (this.over) gameDone(this, this.overT, this.over === 1 ? 'Roomba champion!' : 'Finished ' + ['', '1st', '2nd', '3rd', '4th'][this.over], this.over === 1 ? 'Mona hoovered up the competition.' : 'Hit the candy-cane boost pads and cut the corners close!', this.res);
  }
};

/* ---- little looping previews for the arcade cabinets and the Sections screen ---- */
function drawPreview2(id, x, y, w, h, t) {
  const g = ctx, u = h / 112;
  if (id === 'plat') {
    g.fillStyle = '#1f2a66'; g.fillRect(x, y, w, h); const gy = y + h * .78; g.fillStyle = '#7a4a2e'; g.fillRect(x, gy, w, h); g.fillStyle = '#f4f8ff'; g.fillRect(x, gy - 4 * u, w, 7 * u);
    drawGift(g, x + w * .55, y + h * .36, 22 * u, 'T'); drawGift(g, x + w * .55 + 22 * u, y + h * .36, 22 * u, 'Z');
    const k = (t * .35) % 1, mx = x + 10 + k * (w - 20), my = gy - Math.abs(Math.sin(k * Math.PI * 3)) * 40 * u;
    drawTreat(g, x + w * .6, y + h * .26, .7 * u, t); drawBaddie(g, 'vacuum', x + w * .8 - Math.sin(t) * 20, gy - 14 * u, .8 * u, false, t, 1);
    drawMona(g, mx, my, .2 * u, { pose: my < gy - 2 ? 'pounce' : 'run', face: 1, t, gait: t * 9, outfit: curOutfit(), noShadow: true });
    return true;
  }
  if (id === 'run') {
    g.fillStyle = '#20264e'; g.fillRect(x, y, w, h); const gy = y + h * .8; g.fillStyle = '#5a3a26'; g.fillRect(x, gy, w, h);
    for (let i = 0; i < 6; i++) { const lx = x + ((i * 70 - t * 300) % (w + 70) + w + 70) % (w + 70) - 35; line(g, lx, y + 20 + i * 12, lx + 40, y + 20 + i * 12, 'rgba(255,255,255,.2)', 2); }
    const ox = x + ((w + 60) - (t * 160) % (w + 120)); ell(g, ox, gy - 6 * u, 14 * u, 7 * u); ink(g, '#f29ac0', 1.6);
    const jy = Math.max(0, Math.sin(((ox - x - 40) / 80) * Math.PI)) * (ox > x + 30 && ox < x + 140 ? 30 * u : 0);
    drawMona(g, x + 70, gy - jy, .22 * u, { pose: jy > 2 ? 'pounce' : 'run', face: 1, t, gait: t * 14, outfit: curOutfit(), noShadow: true });
    return true;
  }
  if (id === 'fight') {
    g.fillStyle = '#2a1840'; g.fillRect(x, y, w, h); const gy = y + h * .82; g.fillStyle = '#2a2236'; g.fillRect(x, gy, w, h);
    drawTruck(g, x + w * .74, gy, .32 * u, t, { tell: Math.sin(t * 2) > .5 });
    const hit = Math.sin(t * 5) > .3; drawMona(g, x + w * .25 + (hit ? 18 : 0), gy, .36 * u, { pose: hit ? 'swat' : 'sit', swatK: 1, face: 1, t, outfit: curOutfit(), noShadow: true });
    rr(g, x + 8, y + 8, w * .38, 8 * u, 3); fillP(g, '#ffd34d'); rr(g, x + w * .58, y + 8, w * .36 * (.5 + .4 * Math.sin(t * .7)), 8 * u, 3); fillP(g, '#ff9a3a');
    return true;
  }
  if (id === 'kart') {
    g.fillStyle = '#c99a6a'; g.fillRect(x, y, w, h); g.save(); g.translate(x + w / 2, y + h / 2); g.scale(w / 220, h / 130); g.beginPath(); g.ellipse(0, 0, 90, 44, 0, 0, TAU); g.lineWidth = 30; g.strokeStyle = '#fff'; g.stroke(); g.lineWidth = 24; g.strokeStyle = '#6a6a74'; g.stroke(); g.restore();
    [['#ffd34d', null, 0], ['#ff8a3a', COATS.ginger, .7], ['#7fd0ff', COATS.white, 1.5]].forEach(([c, coat, o]) => { const a = t * .9 + o; drawRoomba(g, x + w / 2 + Math.cos(a) * w * .41, y + h / 2 + Math.sin(a) * h * .34, a + Math.PI / 2, .45 * u, c, coat, t, 0); });
    return true;
  }
  return false;
}
