/* ============ v6.4 THE TV REMOTE, reworked ============
   Goal: get Samantha to the end of her episode of EastEnders.
   - The episode bar only fills while the soap is on.
   - Mona keeps creeping along the back of the sofa towards the remote. Tap her bed (or Mona) to call her
     back. The later you leave it, the more it's worth (Nice 50, Good 100, Close call! 200), and blocks
     in a row build a combo multiplier.
   - If she gets there she sits on the remote: CATWATCH. Zap it back by pressing the buttons shown, in
     order, against the clock. Fast and clean earns a speed bonus and a Perfect.
   - Stars come from how much Catwatch Samantha had to sit through.
   On a phone the TV sits at the top, the sofa in the middle, and the remote is held at the bottom,
   swinging round to point at the TV; every correct press fires an infrared beam at the screen. */
const RM2 = { perch: 1160, reach: 968, EP_LEN: 38, BTNS: ['back', 'tv', 'select', 'play'] };
function rmGlyph(g, id, r, col) {
  g.save(); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 3.2; g.lineCap = 'round'; g.lineJoin = 'round'; const k = r / 22; g.scale(k, k);
  if (id === 'back') { g.beginPath(); g.moveTo(4, -9); g.lineTo(-5, 0); g.lineTo(4, 9); g.stroke(); }
  else if (id === 'tv') { g.beginPath(); g.roundRect(-11, -8, 22, 15, 3); g.stroke(); g.beginPath(); g.moveTo(-5, 11); g.lineTo(5, 11); g.stroke(); }
  else if (id === 'play') { g.beginPath(); g.moveTo(-10, -7); g.lineTo(-1, 0); g.lineTo(-10, 7); g.fill(); g.fillRect(2, -7, 3, 14); g.fillRect(7, -7, 3, 14); }
  else if (id === 'mute') { g.beginPath(); g.moveTo(-10, -4); g.lineTo(-5, -4); g.lineTo(1, -9); g.lineTo(1, 9); g.lineTo(-5, 4); g.lineTo(-10, 4); g.fill(); g.beginPath(); g.moveTo(5, -6); g.lineTo(12, 6); g.moveTo(12, -6); g.lineTo(5, 6); g.stroke(); }
  else if (id === 'select') { g.beginPath(); g.arc(0, 0, 10, 0, TAU); g.stroke(); g.beginPath(); g.arc(0, 0, 3.5, 0, TAU); g.fill(); }
  g.restore();
}
const RM_LABEL = { back: 'Back', tv: 'TV', select: 'Click', play: 'Play' };
SCENES.remote = Object.assign(Object.create(SCENES.remote), {
  enter() {
    this.cam = { z: 1, x: PORT ? 720 : 740, y: 450 }; this.says = []; this.res = null; this.finished = false; this._pm = [];
    this.tv = 'soap'; this.flipT = -9; this.flips = 0; this.press = null; this.ending = false;
    this.ep = 0; this.catT = 0; this.blocks = 0; this.zaps = 0; this.perfects = 0; this.attempt = 0;
    this.seq = null; this.seqI = 0; this.zapT = 0; this.miss = 0; this.beam = null; this.flash = null;
    this.m = { x: SOFA.bed[0], y: SOFA.bed[1] - 6, pose: 'loaf', face: -1, st: 'bed', bedT: 2.6, prog: 0, path: null, layer: 'front', gait: 0 };
    this.rem = { k: 0 }; scoreReset();
    audio.music('evening');
    this.say('sam', 'Ooh, EastEnders! Mona, stay in your bed...', 2.6);
  },
  /* ---- Mona's plan ---- */
  hopTo(x, y, dur, then) { const m = this.m; m.path = { fx: m.x, fy: m.y, x, y, dur, k: 0, then }; },
  creep() {
    const m = this.m; if (this.finished) return; this.attempt++;
    m.st = 'hop'; audio.sfx('meow', 1.2); m.prog = 0;
    // she gets bolder (and quicker) as the episode goes on, and sometimes fakes a pause before a dash
    m.speed = 1 / lerp(3.6, 1.9, this.ep) * (this.ending ? .6 : 1);
    m.feint = !this.ending && this.attempt > 1 && Math.random() < .45 ? rand(.3, .6) : -1; m.feintT = 0;
    this.hopTo(RM2.perch, SOFA.back, .55, () => { m.st = 'creep'; });
  },
  block() {
    const m = this.m, p = m.prog; this.blocks++;
    const [pts, lab] = p > .72 ? [200, 'Close call!'] : p > .4 ? [100, 'Good!'] : [50, 'Nice'];
    const q = this.wp(m.x, m.y - 120); addPts(pts * Math.min(4, 1 + Math.floor(GAME.combo / 2)), q.x, q.y, lab);
    if (GAME.combo >= 2) spawn('pop', q.x, q.y - 60, 1, { label: 'Combo ×' + Math.min(4, 1 + Math.floor(GAME.combo / 2)), vx: 0, vy: -30, col: '#d8353f', size: 30 });
    this.say('sam', p > .72 ? pick(['Ooh, that was close!', 'Not today, missy!', 'Got you!']) : pick(['Bed, Mona!', 'In your bed!', 'Stay!']), 1.4);
    this.toBed();
  },
  toBed() {
    const m = this.m; m.st = 'tobed'; m.prog = 0; audio.sfx('whoosh');
    this.hopTo(SOFA.bed[0], SOFA.bed[1] - 6, .75, () => { m.st = 'bed'; m.pose = 'loaf'; m.face = -1; m.bedT = lerp(2.8, 1.3, this.ep) + rand(-.4, .5); audio.sfx('heart'); const q = this.wp(m.x, m.y - 40); spawn('heart', q.x, q.y, 5); });
  },
  onRemote() {
    const m = this.m; m.st = 'smug'; m.pose = 'sit'; m.face = -1;
    if (this.ending) { m.st = 'sleep'; m.pose = 'sleep'; this.flipTo('cat'); audio.purrStart(); setTimeout(() => audio.purrStop(), 3500); this.say('sam', 'Oh, go on then. Catwatch it is.', 2.6); this.finish(); return; }
    this.flips++; comboBreak(); this.flipTo('cat');
    this.say('sam', ['MONA! I was watching that!', 'Not AGAIN!', 'Oh, come ON, Mona!', 'Every time!'][Math.min(3, this.flips - 1)], 2);
    setTimeout(() => { if (this.m.st === 'smug' && !this.finished) { this.say('mona', pick(['Mrrp!', 'Prrrp.', 'Mrrrow?']), 1.2); audio.sfx('meow', .9); this.m.st = 'hop'; this.hopTo(RM2.perch, SOFA.back, .6, () => { this.m.st = 'watch'; this.m.pose = 'sit'; this.m.face = -1; }); } }, 1100);
  },
  flipTo(ch) {
    if (this.tv === ch) return; this.tv = ch; this.flipT = this.t; audio.sfx('blip'); audio.sfx('scratch');
    if (ch === 'cat' && !this.ending) { const n = Math.min(4, 2 + Math.floor(this.zaps / 2)), s = []; for (let i = 0; i < n; i++) { let b; do b = pick(RM2.BTNS); while (s.length && b === s[s.length - 1]); s.push(b); } this.seq = s; this.seqI = 0; this.zapT = 0; this.miss = 0; }
    else this.seq = null;
  },
  pressBtn(id) {
    this.press = { id, t: 0 };
    if (!this.seq || this.tv !== 'cat') { audio.sfx('tick'); return; }
    if (id === this.seq[this.seqI]) {
      audio.sfx('tick'); this.seqI++; this.beam = { t: 0, ok: true };
      if (this.seqI >= this.seq.length) {
        this.zaps++; const fast = Math.max(0, 5 - this.zapT), perfect = this.miss === 0;
        this.flipTo('soap'); audio.sfx('chime'); this.flash = { t: 0 };
        const q = this.wp(980, 330); addPts(150 + Math.round(fast * 40), q.x, q.y, fast > 2.5 ? 'Lightning zap!' : 'Zapped!', true);
        if (perfect) { this.perfects++; addPts(100, q.x, q.y - 70, 'Perfect', true); }
        this.say('sam', pick(['Phew. What did I miss?', 'Back to EastEnders.', 'Right. Where was I?']), 2);
        if (this.m.st === 'watch') { this.m.st = 'wait'; this.m.bedT = .9; }
      }
    } else { audio.sfx('blip2'); shake(.25); this.miss++; this.seqI = 0; this.beam = { t: 0, ok: false }; this.say('sam', pick(['Wrong button!', 'Which one is it?!', 'Oh, these remotes!']), 1.2); }
  },
  finish() {
    if (this.finished) return; this.finished = true; this.finishT = this.t;
    const stars = this.catT < 6 ? 3 : this.catT < 14 ? 2 : 1;
    this.res = finishLevel('remote', stars, GAME.pts); markDone('remote');
    setTimeout(() => { if (sceneName === 'remote' && this.finished) { if (inStory()) storyNext(); else go('levels'); } }, 6000);
  },
  update(dt) {
    const m = this.m; if (this.press) this.press.t += dt; if (this.beam) { this.beam.t += dt; if (this.beam.t > .35) this.beam = null; } if (this.flash) { this.flash.t += dt; if (this.flash.t > .5) this.flash = null; }
    this.rem.k = clamp(this.rem.k + (!this.finished ? dt * 2.2 : -dt * 3), 0, 1);
    // the episode only plays while the soap is on
    if (!this.finished) { if (this.tv === 'soap' && !this.ending && !this.ppause && !this.tvOff) this.ep = Math.min(1, this.ep + dt / RM2.EP_LEN); if (this.tv !== 'soap') { this.catT += dt; this.zapT += dt; } }
    if (this.ep >= 1 && !this.ending) { this.ending = true; this.say('sam', 'Ooh, what a cliffhanger! The End.', 2.8); if (m.st === 'creep' || m.st === 'hop') this.toBed(); m.bedT = 2.2; }
    // camera stays put
    this.cam.x = lerp(this.cam.x, PORT ? 720 : 740, dt * 3); this.cam.z = 1; this.cam.y = 450;
    // hops
    if (m.path) {
      const P = m.path; P.k += dt / P.dur; const k = Math.min(1, P.k), e = E.inOut(k);
      m.x = lerp(P.fx, P.x, e); m.y = lerp(P.fy, P.y, e) - Math.sin(k * Math.PI) * 70; m.pose = 'pounce'; if (Math.abs(P.x - P.fx) > 4) m.face = Math.sign(P.x - P.fx);
      if (k >= 1) { m.path = null; if (P.then) P.then(); }
    }
    m.layer = (m.y < SOFA.back + 12 && m.x < 1180) ? 'back' : 'front';
    // creeping along the sofa back: 0 at the perch, 1 at the remote
    if (m.st === 'creep') {
      if (m.feint > 0 && m.prog >= m.feint && m.feintT < .9) { m.feintT += dt; m.pose = 'sit'; if (m.feintT >= .9) { m.feint = -1; m.speed *= 1.5; } }
      else { m.prog = Math.min(1, m.prog + m.speed * dt); m.x = lerp(RM2.perch, RM2.reach, m.prog); m.y = SOFA.back; m.pose = 'walk'; m.face = -1; m.gait += m.speed * (RM2.perch - RM2.reach) * dt * .042; }
      if (m.prog >= 1) { m.st = 'hop'; this.hopTo(RM.remote[0], RM.remote[1] - 4, .45, () => this.onRemote()); }
    }
    if (m.st === 'bed') { if (this.tv === 'soap') { m.bedT -= dt; if (m.bedT <= 0) this.creep(); } if (Math.random() < dt * .7) { const q = this.wp(m.x + 30, m.y - 60); spawn('zzz', q.x, q.y); } }
    if (m.st === 'wait') { m.bedT -= dt; if (m.bedT <= 0) { m.st = 'creep'; m.prog = 0; m.speed = 1 / lerp(3.4, 1.8, this.ep); m.feint = -1; } }
    if (m.st === 'sleep' && Math.random() < dt * 1.2) { const q = this.wp(m.x + 20, m.y - 60); spawn('zzz', q.x, q.y); }
    this.says = this.says.filter(s => this.t - s.t0 < s.dur);
  },
  down(X, Y) {
    if (this.finished) return;
    if (this.rem.k > .7 && this.remXf) {
      const P0 = PORT ? screenPt() : { x: X, y: Y }, r = this.remXf, rot = r.rot, dx = P0.x - r.x, dy = P0.y - r.y, lx = (dx * Math.cos(-rot) - dy * Math.sin(-rot)) / r.s, ly = (dx * Math.sin(-rot) + dy * Math.cos(-rot)) / r.s;
      if (Math.abs(lx) < 95 && Math.abs(ly) < 290) {
        let best = null; for (const id in ATV_BTNS) { const [bx, by, r0] = ATV_BTNS[id]; const d = dist(lx, ly, bx, by); if (d < r0 + 16 && (!best || d < best.d)) best = { id, d }; }
        if (best) this.pressBtn(best.id === 'up' ? 'select' : best.id); return;
      }
    }
    const w = this.sw(X, Y), m = this.m;
    const onBed = dist(w.x, w.y, SOFA.bed[0], SOFA.bed[1] - 10) < 100, onMona = dist(w.x, w.y, m.x, m.y - 50) < 90;
    if ((onBed || onMona) && (m.st === 'creep' || (m.st === 'hop' && m.path && m.path.x === RM2.perch))) { if (this.ending) { this.say('sam', 'She\'s too sleepy to listen...', 1.4); return; } m.path = null; this.block(); return; }
    if (onBed && m.st === 'watch') { this.say('sam', 'Fix the telly first!', 1.2); return; }
    if (onMona) { spawn('heart', X, Y - 30, 4); audio.sfx('meow', 1); }
  },
  /* ---- drawing ---- */
  draw() {
    const t = this.t, m = this.m, c = this.cam;
    ctx.fillStyle = '#120c18'; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y);
    ctx.drawImage(cached('liv-sofa-night', LIV.w, H, g => drawLiving(g, 'night')), 0, 0, LIV.w, H);
    livingLive(ctx, t, 'night');
    const [tx, ty, tw, th] = [98, 188, 324, 180], since = t - this.flipT;
    this.drawTV(ctx, tx, ty, tw, th, t);
    if (since < .35) tvStatic(ctx, tx, ty, tw, th, 1 - since / .35);
    if (this.flash) { ctx.fillStyle = 'rgba(255,255,255,' + (.6 * (1 - this.flash.t / .5)) + ')'; ctx.fillRect(tx, ty, tw, th); }
    // Mona's route along the sofa back: paw prints that turn red as she gets closer
    if (!this.finished && !this.ending) for (let i = 0; i < 7; i++) {
      const k = (i + .5) / 7, px = lerp(RM2.perch, RM2.reach, k), on = m.st === 'creep' && m.prog >= k;
      ctx.save(); ctx.globalAlpha = on ? .95 : .28; drawPaw(ctx, px, SOFA.back + 26 + (i % 2) * 8, .55, on ? (k > .72 ? '#ff4d4d' : '#ffb04d') : '#ffffff'); ctx.restore();
    }
    drawCatBed(ctx, SOFA.bed[0], SOFA.bed[1] + 8, .66, false);
    const monaO = () => drawMona(ctx, m.x, m.y, .82, { pose: m.pose, face: m.face, t, gait: m.gait, outfit: curOutfit(), eyes: m.st === 'sleep' ? 'sleep' : m.st === 'smug' ? 'happy' : this.ending ? 'half' : undefined, noShadow: m.layer === 'back' || m.pose === 'pounce' });
    if (m.layer === 'back') monaO();
    if (m.st !== 'sleep') { ctx.save(); ctx.translate(RM.remote[0], RM.remote[1]); ctx.rotate(-.5); rr(ctx, -9, -26, 18, 52, 7); ink(ctx, '#c9ccd1', 2); circ(ctx, 0, -14, 6); fillP(ctx, '#222'); ctx.restore(); }
    drawSamSofa(ctx, SOFA.samX, SOFA.samY, 1, { t, outfit: 'sweater', expr: this.finished ? 'laugh' : this.tv === 'cat' ? 'grump' : 'smile', noIpad: true });
    drawCatBed(ctx, SOFA.bed[0], SOFA.bed[1] + 8, .66, true);
    if (m.st === 'bed') drawMona(ctx, m.x, m.y, .82, { pose: 'loaf', face: -1, t, outfit: curOutfit(), eyes: 'half', noShadow: true });
    else if (m.layer === 'front') monaO();
    // the bed glows when tapping it would work
    if (!this.finished && !this.ending && (m.st === 'creep' || m.st === 'hop' && m.path && m.path.x === RM2.perch)) { const p = .5 + .5 * Math.sin(t * 8); ctx.save(); ctx.globalAlpha = .55 + .45 * p; ell(ctx, SOFA.bed[0], SOFA.bed[1] - 4, 70 + p * 6, 28 + p * 3); strokeP(ctx, m.prog > .72 ? '#ff6b6b' : '#fff3b0', 5); ctx.restore(); }
    ctx.restore();
    const L = (x, y) => this.wp(x, y), fire = L(710, 430), tv = L(260, 290), face = L(962, 430), fl = .85 + .15 * Math.sin(t * 7) * Math.sin(t * 3.3);
    const tvCol = this.tv === 'cat' ? '255,170,90' : '255,150,110';
    lightMap('10,6,26,.62', [{ x: fire.x, y: fire.y + 30, r: 400, a: .95 * fl, col: '255,140,60', ca: .2, k: .3 }, { x: tv.x, y: tv.y, r: 380, a: .9, col: tvCol, ca: .25, k: .3 }, { x: face.x, y: face.y, r: 260, a: .8, col: tvCol, ca: .15 }, { x: L(1200, 520).x, y: L(1200, 520).y, r: 320, a: .6 }]);
    if (!PORT || DOCK) for (const s of this.says) { const p = s.who === 'sam' ? this.wp(960, 300) : this.wp(m.x, m.y - 120); speech(ctx, s.msg, clamp(p.x, 220, W - 220), clamp(PORT ? Math.max(p.y, this.wp(0, 380).y) : p.y, 200, H - 140), s.t0, t, 320); }
    if (PDEFER) deferLate(() => this.hudP()); else this.hudL();
    if (this.finished && this.res && t - this.finishT > 1.4) {
      const kk = E.back(clamp((t - this.finishT - 1.4) / .5, 0, 1)), q = PORT ? this.wp(980, 360) : { x: W / 2, y: 220 };
      ctx.save(); ctx.translate(q.x, q.y); ctx.scale(kk, kk); ctx.rotate(-.03); rr(ctx, -250, -60, 500, 120, 30); fillP(ctx, '#fff'); starRow(0, -16, this.res.stars, 24, 64); text(ctx, 'The End! ' + GAME.pts + ' points', 0, 30, { size: 24, color: TP.crim, weight: 800 }); ctx.restore();
    }
  },
  /* the remote, aimed at the TV. (cx,cy) = where it's held; aim = screen point of the TV; s = size */
  drawRemoteAt(cx, cy, s, aim) {
    const t = this.t, k = this.rem.k, tipY = -270 * s;
    const ang = clamp(Math.atan2(aim.x - cx, cy + tipY - aim.y), -.3, .3), a = REDUCE_MOTION ? ang : lerp(-Math.PI / 2, ang, E.back(k)); // swings round from lying flat
    const r = { x: cx, y: cy + (1 - E.out(k)) * 400, s, rot: a }; this.remXf = r;
    const next = this.seq && this.seqI < this.seq.length && this.rem.k > .9 ? this.seq[this.seqI] : null;
    // infrared beam on each correct press
    if (this.beam && this.beam.ok) { const tip = { x: r.x + Math.sin(a) * -tipY, y: r.y - Math.cos(a) * -tipY }, bk = 1 - this.beam.t / .35; ctx.save(); ctx.globalAlpha = bk; ctx.strokeStyle = '#ff5a6a'; ctx.lineWidth = 10 * bk + 2; ctx.setLineDash([16, 12]); ctx.lineDashOffset = -this.beam.t * 200; ctx.beginPath(); ctx.moveTo(tip.x, tip.y); ctx.lineTo(aim.x, aim.y); ctx.stroke(); ctx.restore(); circ(ctx, aim.x, aim.y, 26 * bk + 6); ctx.fillStyle = 'rgba(255,90,106,' + bk * .5 + ')'; ctx.fill(); }
    ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(a); ctx.scale(s, s); drawATVRemote(ctx, t, next, this.press, 0); ctx.restore();
    return r;
  },
  seqChips(x, y, w) {
    if (!this.seq) return 0;
    const n = this.seq.length, R = 30, gap = Math.min(86, (w - 2 * R) / Math.max(1, n - 1)), x0 = x + w / 2 - (n - 1) * gap / 2;
    for (let i = 0; i < n; i++) {
      const done = i < this.seqI, cur = i === this.seqI, px = x0 + i * gap, p = cur ? 1 + .08 * Math.sin(this.t * 9) : 1;
      if (i < n - 1) { ctx.fillStyle = done ? TP.green : 'rgba(255,255,255,.35)'; ctx.fillRect(px + R, y - 3, gap - 2 * R, 6); }
      ctx.save(); ctx.translate(px, y); ctx.scale(p, p); circ(ctx, 0, 0, R); ctx.fillStyle = done ? TP.green : cur ? '#26272b' : 'rgba(38,39,43,.55)'; ctx.fill();
      if (cur) { ctx.lineWidth = 5; ctx.strokeStyle = '#ffd84d'; ctx.stroke(); }
      if (done) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-11, 1); ctx.lineTo(-3, 9); ctx.lineTo(12, -8); ctx.stroke(); } else rmGlyph(ctx, this.seq[i], 20, '#fff');
      ctx.restore();
    }
    return 1;
  },
  statusText() {
    const m = this.m;
    if (this.finished) return ['That\'s the episode!', 'Mona fell asleep on the remote.'];
    if (this.tv === 'cat' && !this.ending) return ['CATWATCH! Zap it back', 'Press the buttons in order, fast!'];
    if (this.ending) return ['The End!', 'Mona is getting very sleepy...'];
    if (m.st === 'creep' || m.st === 'hop' && m.path && m.path.x === RM2.perch) return [m.prog > .72 ? 'NOW! Tap her bed!' : 'Mona\'s on the move!', 'Wait for it... later taps score more.'];
    if (m.st === 'tobed') return ['Back to bed, Mona', 'Keep the episode playing.'];
    return ['EastEnders is on', 'Watch Mona. Tap her bed to call her back.'];
  },
  /* phone HUD: episode bar across the bottom of the TV; status, sequence and score on the left; the remote on the right */
  hudP() {
    const A = this._pm[0], B = this._pm[1]; if (!A || !DOCK) return;
    const tvC = A.M.transformPoint(new DOMPoint(this.wp(260, 278).x, this.wp(260, 278).y));
    // episode bar along the top of the TV panel
    const bx = 28, bw = PW - 56, by = A.y + 12;
    rr(ctx, bx, by, bw, 30, 15); ctx.fillStyle = 'rgba(20,10,14,.78)'; ctx.fill();
    rr(ctx, bx + 4, by + 4, Math.max(22, (bw - 8) * this.ep), 22, 11); ctx.fillStyle = this.tv === 'cat' ? '#8a8a8a' : '#f2c14e'; ctx.fill();
    text(ctx, (this.tv === 'cat' ? 'EPISODE PAUSED  ' : 'EPISODE  ') + Math.round(this.ep * 100) + '%', bx + bw / 2, by + 16, { size: 17, color: '#fff', weight: 800 });
    // status card across the top of the dock
    const sy = DOCK.y0 + 30, [h1, h2] = this.statusText(), hot = this.tv === 'cat' || (this.m.prog > .72 && this.m.st === 'creep');
    rr(ctx, 20, sy, PW - 40, 100, 20); ctx.fillStyle = hot ? TP.red : TP.pink; ctx.fill();
    text(ctx, h1, 42, sy + 36, { size: 34, align: 'left', color: hot ? '#fff' : TP.crim, weight: 900 });
    text(ctx, h2, 42, sy + 74, { size: 21, align: 'left', color: hot ? '#ffe3e3' : '#7a4a4f', weight: 700 });
    // the remote, held at the bottom right and pointing up at the TV
    const y0 = sy + 116, avH = PH - SAFE_B - y0, s = clamp((avH - 12) / 318, .5, 1.05), rx = PW - 30 - 80 * s;
    this.drawRemoteAt(rx, y0 + 270 * s + 6, s, tvC);
    const cw = rx - 112 * s - 30, cx = 20;
    // sequence chips, or Mona's danger meter
    let yy = y0;
    if (this.seq && this.tv === 'cat') {
      rr(ctx, cx, yy, cw, 110, 20); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fill(); this.seqChips(cx + 10, yy + 46, cw - 20);
      const tl = clamp(1 - this.zapT / 5, 0, 1); rr(ctx, cx + 24, yy + 88, cw - 48, 10, 5); ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fill(); if (tl > 0) { rr(ctx, cx + 24, yy + 88, (cw - 48) * tl, 10, 5); ctx.fillStyle = '#ffd84d'; ctx.fill(); }
    } else {
      rr(ctx, cx, yy, cw, 110, 20); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fill();
      text(ctx, 'MONA → REMOTE', cx + cw / 2, yy + 28, { size: 18, color: '#fff', weight: 800 });
      const mp = this.m.st === 'creep' ? this.m.prog : 0, mw = cw - 60;
      rr(ctx, cx + 30, yy + 56, mw, 26, 13); ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fill();
      ctx.fillStyle = TP.green; ctx.fillRect(cx + 30 + mw * .4, yy + 56, 3, 26); ctx.fillStyle = '#ffd84d'; ctx.fillRect(cx + 30 + mw * .72, yy + 56, 3, 26);
      if (mp > 0) { rr(ctx, cx + 30, yy + 56, Math.max(26, mw * mp), 26, 13); ctx.fillStyle = mp > .72 ? '#ff5a5a' : mp > .4 ? '#ffb04d' : '#8cc152'; ctx.fill(); }
      drawPaw(ctx, cx + 30 + Math.max(13, mw * mp - 13), yy + 69, .5, '#fff');
      text(ctx, '50', cx + 30 + mw * .2, yy + 98, { size: 14, color: 'rgba(255,255,255,.7)', weight: 800 }); text(ctx, '100', cx + 30 + mw * .56, yy + 98, { size: 14, color: 'rgba(255,255,255,.7)', weight: 800 }); text(ctx, '200', cx + 30 + mw * .86, yy + 98, { size: 14, color: '#ffd84d', weight: 800 });
    }
    yy += 128;
    // score row
    if (yy + 84 < PH - SAFE_B) {
      const half = (cw - 12) / 2, mult = Math.min(4, 1 + Math.floor(GAME.combo / 2));
      [['SCORE', String(GAME.pts)], ['COMBO', '×' + mult]].forEach(([lab, val], i) => { const x = cx + i * (half + 12); rr(ctx, x, yy, half, 84, 18); ctx.fillStyle = TP.pink; ctx.fill(); text(ctx, lab, x + half / 2, yy + 22, { size: 15, color: TP.crim, weight: 800 }); text(ctx, val, x + half / 2, yy + 56, { size: 38, color: TP.crim, display: true }); });
    }
  },
  /* tablet/landscape HUD */
  hudL() {
    const tvC = this.wp(260, 278), r = this.drawRemoteAt(1130, 640, .74, tvC);
    const [h1, h2] = this.statusText(), hot = this.tv === 'cat' || (this.m.prog > .72 && this.m.st === 'creep');
    rr(ctx, 470, 96, 520, 96, 20); ctx.fillStyle = hot ? TP.red : TP.pink; ctx.fill();
    text(ctx, h1, 490, 130, { size: 30, align: 'left', color: hot ? '#fff' : TP.crim, weight: 900 }); text(ctx, h2, 490, 166, { size: 19, align: 'left', color: hot ? '#ffe3e3' : '#7a4a4f', weight: 700 });
    const tl = this.wp(98, 380); rr(ctx, tl.x, tl.y + 8, 324, 24, 12); ctx.fillStyle = 'rgba(20,10,14,.72)'; ctx.fill(); rr(ctx, tl.x + 3, tl.y + 11, Math.max(18, 318 * this.ep), 18, 9); ctx.fillStyle = this.tv === 'cat' ? '#8a8a8a' : '#f2c14e'; ctx.fill(); text(ctx, 'EPISODE ' + Math.round(this.ep * 100) + '%', tl.x + 162, tl.y + 20, { size: 14, color: '#fff', weight: 800 });
    if (this.seq && this.tv === 'cat') { rr(ctx, 470, 206, 520, 84, 20); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fill(); this.seqChips(480, 248, 500); }
    rr(ctx, 1010, 96, 200, 96, 20); ctx.fillStyle = TP.pink; ctx.fill(); text(ctx, 'SCORE', 1110, 120, { size: 15, color: TP.crim, weight: 800 }); text(ctx, String(GAME.pts), 1110, 158, { size: 36, color: TP.crim, display: true });
  }
});
HOWTO.remote = { icon: 'bed', line: 'Get Samantha to the end of her episode! Tap Mona\'s bed to call her back (later = more points). If she flips the channel, press the remote buttons in order to zap it back.' };
