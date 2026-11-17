/* ============ Level 4: Bedtime - the eye mask, the head-sit, and the Mona pin ============ */
const B_PAWS = [{ id: 'b1', x: 130, y: 770 }, { id: 'b2', x: 1110, y: 720 }, { id: 'b3', x: 1090, y: 525 }, { id: 'b4', x: 300, y: 300 }];
const BED_HEAD = [620, 470], BED_ROLL = [600, 486];
SCENES.bed = {
  enter() {
    audio.music('night');
    this.res = null; this.resT0 = null; this.stroke = null; this.swipe = null; this.handAt = null;
    this.ph = 'intro'; this.phT = 0; this.mask = 0; this.maskV = 0; this.roll = 0; this.comfort = 0; this.cheeky = 0; this.cheekyT = 0; this.says = []; this.flags = {}; this.masks = 0; this.lamp = 1; this.handT = 0; this.strokes = 0; this.cur = 0; this.zk = 0; this.tip = null; this.trail = [];
    this.m = { x: 160, y: 830, pose: 'walk', face: 1, eyes: undefined, path: null, gait: 0 };
    this.go2([[560, 690, 'hop', .7]], () => { this.m.pose = 'sit'; this.setPh('settle'); });
  },
  setPh(p) { this.ph = p; this.phT = 0; },
  say(who, msg, dur) { this.says = this.says.filter(s => s.who !== who); this.says.push({ who, msg, t0: this.t, dur: Math.max(2.6, (dur || 2) * 1.6) }); },
  go2(segs, then) { const m = this.m; m.path = { segs: segs.map(s => ({ x: s[0], y: s[1], mode: s[2], dur: s[3] })), i: 0, k: 0, fx: m.x, fy: m.y, then }; },
  head() { return this.roll > .5 ? BED_ROLL : BED_HEAD; },
  // the camera leans in for the fiddly bits so the strokes and swipes are big and obvious
  Z() { return 1.22 + .9 * E.inOut(this.zk); }, F() { return [616, 444]; }, Cz() { const f = this.F(), k = E.inOut(this.zk); return [lerp(f[0], W / 2, k), lerp(f[1], H / 2 - 10, k)]; },
  toW(x, y) { const z = this.Z(), f = this.F(), c = this.Cz(); return { x: (x - c[0]) / z + f[0], y: (y - c[1]) / z + f[1] }; },
  toS(x, y) { const z = this.Z(), f = this.F(), c = this.Cz(); return { x: (x - f[0]) * z + c[0], y: (y - f[1]) * z + c[1] }; },
  // Mona's back, head to tail (she's facing right, so the stroke runs right to left)
  path() { if (this._path) return this._path; const m = { x: 612, y: 450 }, a = [m.x + 50, m.y - 56], c = [m.x - 4, m.y - 78], b = [m.x - 70, m.y - 40], P = []; for (let i = 0; i < 22; i++) { const u = i / 21; P.push([(1 - u) * (1 - u) * a[0] + 2 * u * (1 - u) * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * u * (1 - u) * c[1] + u * u * b[1]]); } return (this._path = P); },
  near(x, y) { let bi = 0, bd = 1e9; this.path().forEach((p, i) => { const d = dist(x, y, p[0], p[1]); if (d < bd) { bd = d; bi = i; } }); return { i: bi, d: bd }; },
  tipMsg(msg) { if (this.tip && this.tip.msg === msg && this.t - this.tip.t0 < 1.5) return; this.tip = { msg, t0: this.t }; },
  strokeDone() {
    this.strokes++; this.stroke = null; this.cur = 0; this.comfort = this.strokes / 4 * 100;
    const p = this.path()[10]; spawn('heart', p[0], p[1] - 20, 10); audio.sfx('heart'); addPts(50, p[0], p[1] - 70, 'So comfy!');
    this.say('mona', ['Prrrr...', 'Prrrrrrr ♥', 'Mrrrp... prrrr', 'zzz... prrr'][Math.min(3, this.strokes - 1)], 1.3);
    if (this.strokes === 2) this.say('sam', 'That\'s it... nice and slow.', 1.6);
  },
  update(dt) {
    const m = this.m; this.phT += dt; this.handT = Math.max(0, this.handT - dt); this.cheekyT = Math.max(0, this.cheekyT - dt);
    this.maskV = lerp(this.maskV, this.mask, 1 - Math.exp(-dt * 9));
    if (m.path) {
      const P = m.path, sg = P.segs[P.i]; P.k += dt / sg.dur; const k = Math.min(1, P.k);
      if (sg.mode === 'walk') { m.x = lerp(P.fx, sg.x, k); m.y = lerp(P.fy, sg.y, k); m.pose = 'walk'; m.gait += Math.hypot(sg.x - P.fx, sg.y - P.fy) / sg.dur * dt * .042; }
      else { const e = E.inOut(k); m.x = lerp(P.fx, sg.x, e); m.y = lerp(P.fy, sg.y, e) - Math.sin(k * Math.PI) * 80; m.pose = 'pounce'; }
      if (Math.abs(sg.x - P.fx) > 4) m.face = Math.sign(sg.x - P.fx);
      if (k >= 1) { P.i++; P.k = 0; P.fx = m.x; P.fy = m.y; if (P.i >= P.segs.length) { m.path = null; if (P.then) P.then(); } }
    }
    const ztg = this.ph === 'coax' ? 1 : this.ph === 'masked' ? .45 : 0; this.zk += (ztg - this.zk) * Math.min(1, dt * 2.6);
    const once = (k, fn) => { if (!this.flags[k]) { this.flags[k] = 1; fn(); } };
    if (this.ph === 'settle') {
      once('nn', () => this.say('sam', 'Night night, Mona.', 1.6));
      if (this.phT > 2.4) { this.setPh('toMask'); this.go2([[700, 590, 'walk', 1.1]], () => { m.pose = 'swat'; m.face = -1; this.setPh('paw'); }); }
    }
    if (this.ph === 'paw') {
      m.swatK = Math.abs(Math.sin(this.phT * 9));
      if (this.phT > .7 && this.mask < .5) { this.mask = 1; this.masks++; audio.sfx('swat'); audio.sfx('meow', 1.3); this.say('sam', this.masks === 1 ? 'Mona! I\'m trying to sleep!' : 'Monaaa... it\'s bedtime.', 2); setTimeout(() => this.say('mona', this.masks === 1 ? 'Mrrp! (play with me)' : 'Mrrrow?', 1.4), 1100); }
      if (this.phT > 1.3) { m.pose = 'sit'; m.eyes = 'wide'; this.setPh('masked'); }
    }
    if (this.ph === 'masked' && this.mask < .5) { // she fixed it
      m.eyes = undefined;
      if (this.masks < 2) { this.setPh('wander'); this.say('sam', 'Oof! Mona, that\'s my tummy...', 2); this.go2([[640, 560, 'hop', .5], [700, 470, 'walk', 1], [560, 420, 'walk', 1.2], [470, 520, 'walk', .9], [470, 680, 'hop', .6]], () => { m.pose = 'sit'; m.face = 1; }); }
      else { this.setPh('roll'); }
    }
    if (this.ph === 'wander' && this.phT > 2 && !m.path) { this.go2([[700, 590, 'walk', 1.3]], () => { m.pose = 'swat'; m.face = -1; this.setPh('paw'); }); this.setPh('toMask'); }
    if (this.ph === 'roll') {
      once('roll', () => { this.say('sam', 'Right. I\'m rolling over.', 1.6); audio.sfx('paper'); });
      this.roll = Math.min(1, this.roll + dt * 1.1);
      if (this.phT > 1.5) once('hop', () => { this.go2([[612, 450, 'hop', .6]], () => { m.pose = 'pin'; m.face = 1; m.eyes = 'open'; audio.sfx('thud'); audio.sfx('meow', 1); this.say('sam', 'Mona! You\'re sitting on my HEAD!', 2.2); setTimeout(() => this.say('mona', 'Prrrp.', 1), 1300); this.setPh('coax'); }); });
    }
    if (this.ph === 'coax') {
      const bk = this.cheekyT > 0 ? 1 - this.cheekyT / 1.3 : 0, bo = Math.sin(bk * Math.PI);
      m.x = 612 + bo * 170; m.y = 450 - bo * 120; m.pose = this.cheekyT > 0 ? 'pounce' : 'pin'; m.face = this.cheekyT > 0 && bk < .5 ? -1 : 1;
      m.eyes = this.cheekyT > 0 ? 'wide' : this.stroke && !this.stroke.fast ? 'happy' : ['open', undefined, 'half', 'half'][Math.min(3, this.strokes)]; m.swatK = Math.abs(Math.sin(this.t * 10));
      if (this.stroke && performance.now() - this.stroke.last > 500) audio.purrStop();
      if (this.strokes >= 4 && this.ph === 'coax') { this.setPh('down'); audio.sfx('yawn'); this.say('sam', 'Good girl... down you go.', 1.8); spawn('heart', 640, 380, 10); addPts(200, 640, 340, 'So comfy!'); this.go2([[640, 640, 'hop', .7], [520, 744, 'walk', 1.3], [640, 760, 'walk', .9]], () => { m.pose = 'sleep'; m.face = 1; this.setPh('sleep'); audio.purrStart(); setTimeout(() => audio.purrStop(), 3200); }); }
    }
    if (this.ph === 'sleep') {
      if (this.phT > 1.5) once('zz', () => this.say('sam', 'Goodnight, my little pin.', 2));
      if (this.phT > 3.5) { this.lamp = Math.max(0, this.lamp - dt * .8); once('click', () => audio.sfx('tick')); }
      if (!this.res && Math.random() < dt * 1.1) spawn('zzz', 690, 720);
      if (!this.res && this.phT > 4.6 && Math.random() < dt * 1) spawn('zzz', 560, 420);
      if (this.phT > 9 && !this.res) { this.res = finishLevel('bed', this.cheeky === 0 ? 3 : this.cheeky <= 2 ? 2 : 1, GAME.pts); markDone('bed'); if (this.res.stars < 3) this.res.tip = 'Stroke slowly and Mona will never get cheeky.'; this.resT0 = this.t; particles.length = 0; }
    }
  },
  down(sx, sy) {
    const w = this.toW(sx, sy), x = w.x, y = w.y;
    if (this.ph === 'masked') { const h = this.head(); if (dist(x, y, h[0], h[1]) < 120) this.swipe = { x, y, t: this.t }; }
    if (this.ph === 'coax' && this.cheekyT <= 0) {
      const n = this.near(x, y);
      if (n.d < 60) { this.stroke = { i0: n.i, max: n.i, sx, sy, last: performance.now(), sp: 0, fast: false }; this.trail = []; if (n.i > 8) this.tipMsg('Start at her head (the glowing paw)'); }
      else if (dist(x, y, 612, 420) < 150) this.tipMsg('Put your finger on the glowing paw by her head');
    }
  },
  move(sx, sy) {
    const w = this.toW(sx, sy), x = w.x, y = w.y;
    if (this.swipe && this.swipe.y - y > 30) { this.fixMask(); this.swipe = null; }
    const s = this.stroke; if (!s) return;
    const now = performance.now(), d = dist(s.sx, s.sy, sx, sy), dtm = Math.max(1, now - s.last); s.sx = sx; s.sy = sy; s.last = now;
    if (d < .5) return;
    s.sp = lerp(s.sp, d / dtm * 1000, .35); this.handT = .2; this.handAt = [x, y]; this.trail.push([x, y, this.t]); if (this.trail.length > 30) this.trail.shift();
    const n = this.near(x, y);
    if (n.d > 90) { this.stroke = null; audio.purrStop(); this.tipMsg('Oops, you slid off. Stay on her back!'); return; }
    if (s.sp > 1800) { // a real swipe, not a stroke: cheeky Mona!
      this.stroke = null; this.cheekyT = 1.3; this.cheeky++; shake(.35); audio.purrStop(); audio.sfx('swat'); audio.sfx('meow', 1.5); spawn('pop', sx, sy - 50, 1, { label: 'Too fast! BOING!', vx: 0, vy: -30, col: '#ff8a8a', size: 30 }); this.say('mona', 'MRAOW!', 1); comboBreak(); return;
    }
    s.fast = s.sp > 900;
    if (s.fast) { this.tipMsg('Slower... gently does it'); return; }
    if (n.i > s.max) { if (Math.random() < .35) spawn('heart', x, y - 24, 1); GAME.pts += (n.i - s.max) * 2; s.max = n.i; audio.purrStart(.3 + .3 * this.strokes + .3 * this.cur); }
    else if (n.i < s.max - 5) this.tipMsg('Wrong way! Head to tail, like cats like it');
    this.cur = clamp((s.max - s.i0) / 21, 0, 1);
    if (s.max >= 20 && s.max - s.i0 >= 12) this.strokeDone();
  },
  up() {
    if (this.stroke) { if (this.cur > .15) this.tipMsg('Nearly! Keep going all the way to her tail'); this.stroke = null; this.cur = 0; setTimeout(() => audio.purrStop(), 300); }
    this.swipe = null;
  },
  fixMask() { if (this.mask < .5) return; this.mask = 0; audio.sfx('heart'); const h = this.head(); spawn('heart', h[0], h[1] - 40, 4); addPts(50, h[0], h[1] - 90, 'Mask back on!'); this.say('sam', pick(['Thank you.', 'Ahh, better.', 'Much better.']), 1.2); },
  tap(sx, sy) {
    const w = this.toW(sx, sy), x = w.x, y = w.y;
    for (const p of B_PAWS) if (!save.paws[p.id] && dist(x, y, p.x, p.y) < 40) { collectPaw(p.id, x, y); return; }
    if (this.ph === 'masked') { const h = this.head(); if (dist(x, y, h[0], h[1]) < 110) this.fixMask(); }
  },
  draw() {
    const t = this.t, m = this.m, mv = this.maskV, Z = this.Z(), F = this.F(), C = this.Cz();
    ctx.save(); ctx.translate(C[0], C[1]); ctx.scale(Z, Z); ctx.translate(-F[0], -F[1]);
    spawnXf = (px, py) => this.toS(px, py);
    ctx.drawImage(cached('bedback', W, H, g => drawBedBack(g, 'night')), 0, 0, W, H);
    bedLive(ctx, t, 'night');
    B_PAWS.forEach(p => drawHiddenPaw(ctx, p.x, p.y, t, save.paws[p.id]));
    const hx = lerp(BED_HEAD[0], BED_ROLL[0], E.inOut(this.roll)), hy = lerp(BED_HEAD[1], BED_ROLL[1], E.inOut(this.roll));
    const asleep = this.ph === 'sleep' && this.phT > 4;
    drawSamHead(ctx, hx, hy, 1, { t, mask: mv, expr: mv > .5 ? 'grump' : asleep ? 'sleepy' : 'sleepy', tilt: -1.2 * E.inOut(this.roll) });
    const onHead = this.ph === 'coax' || (this.ph === 'roll' && !m.path && false);
    if (onHead || (m.path && m.y < 520)) drawMona(ctx, m.x, m.y, .9, { pose: m.pose, face: m.face, t, outfit: curOutfit(), eyes: m.eyes, swatK: m.swatK, noShadow: true, earsBack: this.cheekyT > 0 });
    ctx.drawImage(cached('bedfront', W, H, g => drawBedFront(g)), 0, 0, W, H);
    if (this.roll > .3) { ctx.save(); ctx.globalAlpha = Math.min(1, (this.roll - .3) * 2); ctx.beginPath(); ctx.ellipse(700, 560, 150, 50, -.08, Math.PI, 0); ctx.fillStyle = '#f6f4ef'; ctx.fill(); ctx.strokeStyle = 'rgba(61,42,34,.5)'; ctx.lineWidth = 2.4; ctx.stroke(); ctx.restore(); }
    if (!(onHead || (m.path && m.y < 520))) drawMona(ctx, m.x, m.y, .9, { pose: m.pose, face: m.face, t, gait: m.gait, outfit: curOutfit(), eyes: m.pose === 'sleep' ? 'sleep' : m.eyes, swatK: m.swatK, noShadow: m.pose === 'pounce' });
    if (this.handT > 0 && this.handAt) samArm(ctx, 760, 600, clamp(this.handAt[0], 520, 860), clamp(this.handAt[1], 380, 640), 'pj', 0);
    // night light: moonlight, sconces, candle, headboard lights
    const lmp = this.lamp, fl = .9 + .1 * Math.sin(t * 9);
    lightMap('8,10,34,' + (.7 + (1 - lmp) * .18), [
      { x: 345, y: 300, r: 300, a: .85 * lmp, col: '255,200,130', ca: .25 }, { x: 895, y: 300, r: 300, a: .85 * lmp, col: '255,200,130', ca: .25 },
      { x: 334, y: 430, r: 150, a: .9 * fl, col: '255,170,80', ca: .3 }, { x: 620, y: 290, r: 340, a: .55, col: '255,210,150', ca: .12, sy: .5 },
      { x: 175, y: 300, r: 260, a: .55, col: '120,150,255', ca: .2 }, { x: 1065, y: 300, r: 260, a: .55, col: '120,150,255', ca: .2 },
      { x: hx, y: hy, r: 210, a: .4 + .3 * lmp }, { x: m.x, y: m.y - 30, r: 180, a: .35 }
    ]);
    circ(ctx, 334, 432 + Math.sin(t * 9) * .8, 3.5); fillP(ctx, '#ffe08a'); glowAt(ctx, 334, 428, 30, '255,190,90', .5);
    drawLights(ctx, garlandLights(398, 842, 262, 16), t, 1);
    // the stroke guide: a glowing path along Mona's back, a paw to start on, an arrow at the tail
    if (this.ph === 'coax' && this.cheekyT <= 0) {
      const P = this.path(), s = this.stroke, upto = s ? s.max : -1, pulse = .5 + .5 * Math.sin(t * 4);
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); strokeP(ctx, 'rgba(255,240,170,' + (.18 + .1 * pulse) + ')', 34);
      ctx.setLineDash([2, 13]); ctx.lineDashOffset = t * 30; ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); strokeP(ctx, '#fff3b0', 6); ctx.setLineDash([]);
      if (s && upto > s.i0) { ctx.beginPath(); for (let i = s.i0; i <= upto; i++) i === s.i0 ? ctx.moveTo(P[i][0], P[i][1]) : ctx.lineTo(P[i][0], P[i][1]); strokeP(ctx, s.fast ? '#ff7a7a' : '#ffd34d', 12); }
      const e = P[21], e2 = P[18], an = Math.atan2(e[1] - e2[1], e[0] - e2[0]); ctx.save(); ctx.translate(e[0], e[1]); ctx.rotate(an); ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-8, -12); ctx.lineTo(-8, 12); ctx.closePath(); fillP(ctx, '#fff3b0'); ctx.restore();
      if (!s) { const a = P[0]; circ(ctx, a[0], a[1], 20 + 4 * pulse); fillP(ctx, 'rgba(255,243,176,.35)'); circ(ctx, a[0], a[1], 16); fillP(ctx, '#fff3b0'); drawPaw(ctx, a[0], a[1] + 1, .85, '#c8453b');
        // a ghost finger shows the pace: about one and a half seconds, head to tail
        const k = (t % 2.4) / 1.6; if (k < 1) { const f = P[Math.min(21, Math.floor(E.inOut(k) * 21))]; ctx.globalAlpha = Math.sin(k * Math.PI) * .9; drawHand(ctx, f[0], f[1] - 4, .6, -.3); ctx.globalAlpha = 1; } }
      ctx.restore();
    }
    // snow falling past both windows
    for (const wn of [BED.win1, BED.win2]) { ctx.save(); ctx.globalAlpha = .4 + .5 * (this.ph === 'sleep' ? Math.min(1, this.phT / 3) : .4); drawSnow(ctx, wn[0] + 8, wn[1] + 8, wn[2] - 16, wn[3] - 16, t, 18, .8); ctx.restore(); }
    // Mona dreams of the rave
    if (this.ph === 'sleep' && this.phT > 4.2) bedDream(m.x + 30, m.y - 150, clamp((this.phT - 4.2) / .8, 0, 1), t);
    ctx.restore(); spawnXf = null;
    drawGrain(.05);
    // tap/swipe guides
    if (this.ph === 'masked') { const hw = this.head(), hs = this.toS(hw[0], hw[1]), h = [hs.x, hs.y], b = Math.sin(t * 5) * 10; ctx.save(); ctx.globalAlpha = .55 + .45 * Math.sin(t * 6); circ(ctx, h[0], h[1], 66); strokeP(ctx, '#fff3b0', 4); ctx.restore(); ctx.save(); ctx.translate(h[0] + 110, h[1] - 10 - b * 2); line(ctx, 0, 40, 0, -20, '#fff3b0', 6); ctx.beginPath(); ctx.moveTo(-14, -6); ctx.lineTo(0, -26); ctx.lineTo(14, -6); strokeP(ctx, '#fff3b0', 6); ctx.restore(); }
    if (this.tip && t - this.tip.t0 < 2.2) { const a = Math.min(1, (t - this.tip.t0) / .2) * Math.min(1, (2.2 - (t - this.tip.t0)) / .3); ctx.save(); ctx.globalAlpha = a; ctx.font = '700 26px ' + FONT; const tw = ctx.measureText(this.tip.msg).width + 50; rr(ctx, W / 2 - tw / 2, 700, tw, 52, 26); fillP(ctx, 'rgba(45,37,35,.92)'); text(ctx, this.tip.msg, W / 2, 727, { size: 26, color: '#fff3b0', weight: 700 }); ctx.restore(); }
    this.says = this.says.filter(s => t - s.t0 < s.dur);
    for (const s of this.says) { if (s.who === 'sam') speech(ctx, s.msg, 420, 340, s.t0, t, 300); else { const ms = this.toS(m.x + 40, m.y - 150); speech(ctx, s.msg, clamp(ms.x, 200, W - 200), Math.max(230, ms.y), s.t0, t, 260); } }
    // HUD
    if (this.ph === 'coax' || this.ph === 'down') {
      const st = this.cheekyT > 0 ? ['Cheeky!', '#d8322c'] : this.strokes >= 3 ? ['Sleepy...', '#2f9a5e'] : this.strokes >= 1 ? ['Purring', '#7b5aa8'] : ['Wide awake', '#d9821c'];
      if (PORT) { dockStat('Mona is', st[0]); dockStat('Strokes', this.strokes + ' / 4'); } else {
      ctx.save(); ctx.translate(76, 80); hudCard(180, 18, 420, 72);
      text(ctx, "Mona's comfort:", 200, 38, { size: 15, align: 'left', color: '#8a6a5a', weight: 600 }); text(ctx, st[0], 326, 38, { size: 16, align: 'left', color: st[1], weight: 700 });
      for (let i = 0; i < 4; i++) { const hx2 = 218 + i * 52, hy2 = 66, full = i < this.strokes, part = i === this.strokes ? this.cur : 0; drawHeart(ctx, hx2, hy2, 1.9, '#eadfd2'); if (full || part > 0) { ctx.save(); ctx.beginPath(); ctx.rect(hx2 - 20, hy2 - 20, 40 * (full ? 1 : part), 40); ctx.clip(); drawHeart(ctx, hx2, hy2, 1.9, '#e2443b'); ctx.restore(); } }
      text(ctx, this.strokes + ' of 4 strokes', 510, 66, { size: 18, color: '#3b2f2a', weight: 700 }); ctx.restore(); }
    }
    scoreCard(950, 100, t, 'Mona never gets cheeky');
    const goals = { intro: ['Bedtime.', 'Mona is hopping up for the night...', '#7b5aa8'], settle: ['Bedtime.', 'Samantha has her eye mask on...', '#7b5aa8'], toMask: ['Uh oh. Mona wants to play.', 'Here she comes...', '#7b5aa8'], paw: ['Uh oh...', 'Mona is pawing at the mask!', '#d8322c'], masked: ['Mona pulled the eye mask down!', 'Swipe up on Samantha\'s face to put it back.', '#d8322c'], wander: ['Ahh, peace and quiet...', 'For now.', '#7b5aa8'], roll: ['Samantha rolls over...', 'What is Mona up to?', '#7b5aa8'], coax: ['Mona is sitting on her head! Stroke her to calm her down.', 'Start on the glowing paw and slowly trace her back, head to tail.', '#d8322c'], down: ['She\'s coming down...', 'Off to the end of the bed.', '#2f9a5e'], sleep: ['Goodnight, Samantha. Goodnight, Mona.', 'Sweet dreams.', '#2f9a5e'] };
    const gl = goals[this.ph]; if (gl && !this.res) showGoal({ msg: gl[0], sub: gl[1], col: gl[2] }, t, true);
    
    if (this.res) doneCard(this.t - this.resT0, 'Goodnight!', 'Mona is curled up at the end of the bed and everyone is cosy.' + (this.cheeky ? '' : ' Not one cheeky moment!'), nextLabel(), () => storyNext(), () => go('bed', sceneParams), this.res);
  }
};

/* a thought bubble over sleeping Mona: the secret rave, replayed in her dreams */
function bedDream(x, y, k, t) {
  if (k <= 0) return; const e = E.back(k);
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.5);
  [[0, 0, 7], [26, -34, 12], [60, -74, 18]].forEach(([dx, dy, r], i) => { if (k > i * .2) { circ(ctx, x + dx, y + dy, r * e); fillP(ctx, 'rgba(255,255,255,.92)'); } });
  const cx = x + 150, cy = y - 200, R2 = 120 * e;
  ctx.save(); ctx.beginPath(); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.arc(cx + Math.cos(a) * R2 * 1.05, cy + Math.sin(a) * R2 * .72, R2 * .3, a - 1.2, a + 1.2); } ctx.closePath(); fillP(ctx, 'rgba(255,255,255,.95)'); ctx.restore();
  ctx.save(); ell(ctx, cx, cy, R2 * .98, R2 * .66); ctx.clip();
  ctx.fillStyle = '#1a0a28'; ctx.fillRect(cx - R2, cy - R2, R2 * 2, R2 * 2);
  for (let i = 0; i < 4; i++) { const a = Math.sin(t * 1.6 + i * 1.5) * .6; ctx.save(); ctx.translate(cx - 80 + i * 54, cy - 80); ctx.rotate(a); ctx.fillStyle = ['rgba(255,79,216,.45)', 'rgba(79,230,255,.45)', 'rgba(255,208,0,.45)', 'rgba(110,227,154,.45)'][i]; ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(-30, 170); ctx.lineTo(30, 170); ctx.lineTo(3, 0); ctx.fill(); ctx.restore(); }
  drawDiscoBall(ctx, cx, cy - 52, 16, t);
  const beat = t * 128 / 60;
  [['ginger', -62], [null, 0], ['black', 62]].forEach(([c, dx], i) => { const b = Math.abs(Math.sin((beat + i * .5) * Math.PI)); drawCat(ctx, cx + dx, cy + 62 - b * 10, .34, { pose: Math.floor(beat + i) % 2 ? 'celebrate' : 'sit', face: dx > 0 ? -1 : 1, t, eyes: 'happy', noShadow: true, outfit: c ? 'none' : curOutfit() }, c ? COATS[c] : null); });
  ctx.restore();
  ell(ctx, cx, cy, R2 * .98, R2 * .66); strokeP(ctx, 'rgba(200,190,230,.8)', 3);
  ctx.restore();
}
