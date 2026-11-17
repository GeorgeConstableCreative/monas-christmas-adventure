/* ============ Level 3: Sofa Time - Mona parks in front of the iPad (and the morning version) ============ */
const SOFA = { samX: 1000, samY: 592, bed: [1268, 548], back: 428, arm: [914, 472], lap: [1086, 558], ipad: [1080.4, 492], ipadR: { x: 30, y: -142, w: 80, h: 104 } };
const S_PAWS = [{ id: 's1', x: 150, y: 690 }, { id: 's2', x: 640, y: 150 }, { id: 's3', x: 1372, y: 520 }, { id: 's4', x: 480, y: 470 }];
function wordGameScreen(g, w, h, t) {
  g.fillStyle = '#1f6b4a'; g.fillRect(0, 0, w, h);
  for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) { g.fillStyle = (r + c) % 3 ? 'rgba(255,255,255,.08)' : 'rgba(255,200,120,.18)'; g.fillRect(6 + c * 14, 14 + r * 12, 12, 10); }
  'MERRY'.split('').forEach((ch, i) => { const x = 6 + i * 14, y = 14 + 3 * 12; rr(g, x, y, 12, 10, 2); g.fillStyle = '#f6e3b4'; g.fill(); text(g, ch, x + 6, y + 5.5, { size: 8, color: '#5a3a20', weight: 700 }); });
  text(g, 'WORDS', w / 2, 7, { size: 7, color: '#fff', weight: 700 });
}
function cardScreen(g, w, h, t) { g.fillStyle = '#fbe9d6'; g.fillRect(0, 0, w, h); rr(g, 12, 26, w - 24, h - 50, 5); fillP(g, '#c8453b'); g.beginPath(); g.moveTo(12, 26); g.lineTo(w / 2, h / 2 + 4); g.lineTo(w - 12, 26); strokeP(g, '#fbe9d6', 2.5); drawHeart(g, w / 2, h / 2 + 16, 1.4 + .1 * Math.sin(t * 6), '#fff'); text(g, 'For Samantha', w / 2, 14, { size: 9, color: '#c8453b', weight: 700 }); }
function choiceScreen(g, w, h, t) { // the game corner, laid out sideways so it is upright after the camera turns
  g.save(); g.translate(w / 2, h / 2); g.rotate(Math.PI / 2);
  const W2 = h, H2 = w; const gr = g.createLinearGradient(-W2 / 2, -H2 / 2, W2 / 2, H2 / 2); gr.addColorStop(0, '#2a1846'); gr.addColorStop(1, '#0d1a33'); g.fillStyle = gr; g.fillRect(-W2 / 2, -H2 / 2, W2, H2);
  text(g, 'Game time!', 0, -H2 / 2 + 10, { size: 9, color: '#ffd34d', weight: 700 });
  [-1, 0, 1].forEach((i, n) => { const cx = i * 33; rr(g, cx - 14, -H2 / 2 + 18, 28, 46, 3); g.fillStyle = ['#c8261f', '#7b5aa8', '#2a3fa8'][n]; g.fill(); rr(g, cx - 11, -H2 / 2 + 24, 22, 16, 2); g.fillStyle = '#05040a'; g.fill(); });
  g.restore();
}
SCENES.sofa = {
  enter(p) {
    this.morning = !!(p && p.morning); this.left = false; this.res = null; this.blockT0 = null; this.finishT = 0; this.zooming = false;
    audio.music(this.morning ? 'morning' : 'evening');
    this.cam = { z: 1.22, x: 880, y: 470, rot: 0 }; this.zoomK = 0; this.zooming = false; this.settles = 0; this.scratchT = 0; this.patT = 0; this.says = []; this.flags = {}; this.it = 0; this.scr = 0;
    this.m = { x: 1440, y: SOFA.back, pose: 'walk', face: -1, st: 'enter', layer: 'back', path: null, eyes: undefined, gait: 0 };
    if (this.morning) { Object.assign(this.m, { x: SOFA.bed[0], y: SOFA.bed[1], pose: 'sleep', face: 1, st: 'inbed', layer: 'front', forever: true }); }
    else this.walkPath([[960, SOFA.back, 'walk', 2.6]], () => this.toLap());
  },
  say(who, msg, dur) { this.says = this.says.filter(s => s.who !== who); this.says.push({ who, msg, t0: this.t, dur: Math.max(2.6, (dur || 2) * 1.6) }); },
  walkPath(segs, then) { const m = this.m; m.path = { segs: segs.map(s => ({ x: s[0], y: s[1], mode: s[2], dur: s[3] })), i: 0, k: 0, fx: m.x, fy: m.y, then }; },
  toLap() { const m = this.m; m.st = 'move'; this.walkPath([[SOFA.arm[0], SOFA.arm[1], 'hop', .5], [SOFA.lap[0], SOFA.lap[1], 'hop', .6]], () => this.block()); },
  block() {
    const m = this.m; m.st = 'block'; m.pose = 'sit'; m.face = 1; m.layer = 'front'; audio.sfx('thud'); audio.sfx('meow', 1);
    const n = this.settles; this.say('sam', ['Mona! I can\'t see the screen!', 'Again? Really, Mona?', 'Mona, you are NOT an iPad stand!'][n] || 'Mona!', 2);
    setTimeout(() => { if (this.m.st === 'block') { this.say('mona', ['Mrrp!', 'Mrrrow?', 'Prrrp.'][n] || 'Mrrp!', 1.2); audio.sfx('meow', .9); } }, 1200);
    if (this.blockT0 == null) this.blockT0 = this.t;
  },
  toBed() {
    const m = this.m; m.st = 'move'; m.eyes = undefined; audio.sfx('whoosh');
    this.walkPath([[SOFA.bed[0], SOFA.bed[1] - 6, 'hop', .7]], () => {
      m.st = 'inbed'; m.pose = 'loaf'; m.face = -1; this.settles++; audio.sfx('heart'); spawn('heart', this.wp(m.x, m.y - 40).x, this.wp(m.x, m.y - 40).y, 6);
      addPts(100, this.wp(m.x, m.y - 90).x, this.wp(m.x, m.y - 90).y, 'Settled!');
      this.say('sam', ['Good girl. Stay!', 'Stay there this time!', 'Finally... sweet dreams, Mona.'][this.settles - 1], 2);
      m.bedT = this.settles >= 3 ? 999 : (this.settles === 1 ? 3.4 : 3.8);
      if (this.settles >= 3) { m.pose = 'sleep'; this.finishT = this.t; const tt = this.t - (this.blockT0 || 0); this.res = finishLevel('sofa', tt < 45 ? 3 : tt < 80 ? 2 : 1, GAME.pts); markDone('sofa'); audio.purrStart(); setTimeout(() => audio.purrStop(), 2500); }
    });
  },
  wp(x, y) { const c = this.cam, dx = (x - c.x) * c.z, dy = (y - c.y) * c.z, cs = Math.cos(c.rot), sn = Math.sin(c.rot); return { x: W / 2 + dx * cs - dy * sn, y: H / 2 + dx * sn + dy * cs }; },
  sw(X, Y) { const c = this.cam, dx = X - W / 2, dy = Y - H / 2, cs = Math.cos(-c.rot), sn = Math.sin(-c.rot); return { x: (dx * cs - dy * sn) / c.z + c.x, y: (dx * sn + dy * cs) / c.z + c.y }; },
  startZoom() { if (this.zooming) return; this.zooming = true; this.zoomK = 0; audio.sfx('whoosh'); },
  update(dt) {
    const m = this.m; this.it += dt; this.scratchT = Math.max(0, this.scratchT - dt); this.patT = Math.max(0, this.patT - dt);
    if (m.path) {
      const P = m.path, sgm = P.segs[P.i]; P.k += dt / sgm.dur; const k = Math.min(1, P.k);
      if (sgm.mode === 'walk') { m.x = lerp(P.fx, sgm.x, k); m.y = lerp(P.fy, sgm.y, k); m.pose = 'walk'; m.gait += Math.abs(sgm.x - P.fx) / sgm.dur * dt * .042; }
      else { const e = E.inOut(k); m.x = lerp(P.fx, sgm.x, e); m.y = lerp(P.fy, sgm.y, e) - Math.sin(k * Math.PI) * 70; m.pose = 'pounce'; }
      if (Math.abs(sgm.x - P.fx) > 4) m.face = Math.sign(sgm.x - P.fx);
      if (sgm.y > SOFA.back + 60 || sgm.x > 1180) m.layer = 'front'; else if (k > .5) m.layer = sgm.y <= SOFA.back + 10 || sgm.x < 960 ? 'back' : 'front';
      if (k >= 1) { P.i++; P.k = 0; P.fx = m.x; P.fy = m.y; if (P.i >= P.segs.length) { m.path = null; if (P.then) P.then(); } }
    }
    if (m.st === 'inbed' && !m.forever) { m.bedT -= dt; if (m.bedT <= 0) { m.st = 'move'; audio.sfx('meow', 1.1); this.say('mona', 'Mrrp!', 1); this.walkPath([[1300, SOFA.back, 'hop', .6], [960, SOFA.back, 'walk', 2.2]], () => this.toLap()); } }
    if (m.st === 'inbed' && Math.random() < dt * .9) { const q = this.wp(m.x + 30, m.y - 60); spawn('zzz', q.x, q.y); }
    if (this.res && !this.zooming && this.t - this.finishT > 3.2) { this.say('sam', 'Right. Game time!', 1.4); this.startZoom(); }
    if (this.morning && !this.zooming && this.it > 7) this.startZoom();
    if (this.zooming) {
      this.zoomK = Math.min(1, this.zoomK + dt / 1.5); const k = E.inOut(this.zoomK);
      this.cam.z = 1.22 * Math.pow(12.4 / 1.22, k); this.cam.x = lerp(880, SOFA.ipad[0], E.out(Math.min(1, this.zoomK * 1.4))); this.cam.y = lerp(470, SOFA.ipad[1], E.out(Math.min(1, this.zoomK * 1.4))); this.cam.rot = lerp(0, -(Math.PI / 2 - .22), k);
      if (this.zoomK >= 1 && !this.left) { this.left = true; const st = inStory(); if (st) { save.story = Math.min(STORY.length - 1, save.story + 1); persist(); } if (this.morning) setScene('words', { story: st, fromZoom: true }); else setScene('choice', { story: st, fromZoom: true }); }
    }
  },
  tap(x, y) {
    if (this.zooming) return;
    const w = this.sw(x, y), m = this.m;
    for (const p of S_PAWS) if (!save.paws[p.id] && dist(w.x, w.y, p.x, p.y) < 40) { collectPaw(p.id, x, y); return; }
    if (this.morning) { if (dist(w.x, w.y, SOFA.ipad[0], SOFA.ipad[1]) < 90) this.startZoom(); else if (dist(w.x, w.y, m.x, m.y - 30) < 80) { spawn('heart', x, y - 30, 4); audio.sfx('meow', .7); } return; }
    if (dist(w.x, w.y, SOFA.bed[0], SOFA.bed[1] - 10) < 80) {
      this.patT = .9; audio.sfx('thud');
      if (m.st === 'block') { this.say('sam', pick(['In your bed, Mona!', 'Bed! Go on!', 'Look, your cosy bed!']), 1.6); setTimeout(() => { if (this.m.st === 'block') this.toBed(); }, 500); }
      else if (m.st !== 'inbed') this.say('sam', 'Your bed\'s right here, Mona...', 1.4);
      return;
    }
    if (dist(w.x, w.y, m.x, m.y - 50) < 80) {
      if (m.st === 'block') { this.scratchT = .8; spawn('heart', x, y - 30, 5); audio.sfx('heart'); audio.purrStart(); setTimeout(() => audio.purrStop(), 900); m.eyes = 'happy'; setTimeout(() => { if (this.m.st === 'block') this.m.eyes = undefined; }, 700); if (this.scr < 5) { this.scr++; addPts(20, x, y - 60, 'Scratch!'); } if (!this.flags.scr) { this.flags.scr = 1; this.say('sam', 'Okay, ONE scratch. Now bed!', 1.6); } }
      else { spawn('heart', x, y - 30, 3); audio.sfx('meow', .8); }
    }
  },
  draw() {
    const t = this.t, m = this.m, tod = this.morning ? 'morning' : 'night', k = this.zoomK, zk = E.inOut(k);
    ctx.fillStyle = '#120c18'; ctx.fillRect(0, 0, W, H);
    ctx.save(); const c = this.cam; ctx.translate(W / 2, H / 2); ctx.rotate(c.rot); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y);
    ctx.drawImage(cached('liv-sofa-' + tod, LIV.w, H, g => drawLiving(g, tod)), 0, 0, LIV.w, H);
    livingLive(ctx, t, tod);
    if (!this.morning) { drawTVPicture(ctx, 98, 188, 324, 180, t); }
    S_PAWS.forEach(p => drawHiddenPaw(ctx, p.x, p.y, t, save.paws[p.id]));
    drawCatBed(ctx, SOFA.bed[0], SOFA.bed[1] + 8, .66, false);
    const monaO = () => drawMona(ctx, m.x, m.y, .82, { pose: m.pose, face: m.face, t, gait: m.gait, outfit: curOutfit(), eyes: m.eyes || (m.st === 'inbed' ? (m.pose === 'sleep' ? 'sleep' : 'half') : undefined), noShadow: m.layer === 'back' || m.pose === 'pounce' || m.st === 'inbed', earsUp: m.st === 'block' });
    if (m.layer === 'back') monaO();
    const ipad = SOFA.ipadR, scrFn = (g, w, h) => (k > .2 ? (this.morning ? cardScreen : choiceScreen) : (this.morning ? cardScreen : wordGameScreen))(g, w, h, t);
    drawSamSofa(ctx, SOFA.samX, SOFA.samY, 1, { t, outfit: this.morning ? 'pj' : 'sweater', expr: m.st === 'block' ? (this.scratchT > 0 ? 'laugh' : 'grump') : m.st === 'inbed' ? 'happy' : 'smile', ipad, screen: scrFn });
    if (m.st === 'inbed') { drawMona(ctx, m.x, m.y, .82, { pose: m.pose, face: m.face, t, outfit: curOutfit(), eyes: m.pose === 'sleep' ? 'sleep' : 'half', noShadow: true }); }
    drawCatBed(ctx, SOFA.bed[0], SOFA.bed[1] + 8, .66, true);
    if (m.layer === 'front' && m.st !== 'inbed') monaO();
    if (this.scratchT > 0) samArm(ctx, 1004, 483, m.x + 2, m.y - 96, this.morning ? 'pj' : 'sweater', this.scratchT);
    if (this.patT > 0) { const pk = Math.sin((1 - this.patT / .9) * Math.PI * 3); samArm(ctx, 1030, 486, SOFA.bed[0] - 20, SOFA.bed[1] - 20 - Math.abs(pk) * 14, this.morning ? 'pj' : 'sweater', 0); }
    // the iPad screen pops back over her hands as we dive in
    if (k > .35) { ctx.save(); ctx.globalAlpha = clamp((k - .35) / .3, 0, 1); ctx.translate(SOFA.samX + ipad.x, SOFA.samY + ipad.y); ctx.rotate(-.22); rr(ctx, -6, -6, ipad.w + 12, ipad.h + 12, 14); fillP(ctx, '#2a2c33'); ctx.save(); rr(ctx, 0, 0, ipad.w, ipad.h, 8); ctx.clip(); scrFn(ctx, ipad.w, ipad.h); ctx.restore(); ctx.restore(); }
    // glowing tap targets
    if (!this.zooming && !this.morning && m.st === 'block') { ctx.save(); ctx.globalAlpha = .5 + .5 * Math.sin(t * 5); ell(ctx, SOFA.bed[0], SOFA.bed[1] - 4, 64, 26); strokeP(ctx, '#fff3b0', 4); ctx.restore(); }
    if (this.morning && !this.zooming) { ctx.save(); ctx.translate(SOFA.samX + ipad.x, SOFA.samY + ipad.y); ctx.rotate(-.22); ctx.globalAlpha = .5 + .5 * Math.sin(t * 5); rr(ctx, -10, -10, ipad.w + 20, ipad.h + 20, 16); strokeP(ctx, '#fff3b0', 5); ctx.restore(); }
    ctx.restore();
    // lighting: a dark cosy room lit by the fire, candles, TV and the iPad on her face
    const L = (x, y) => this.wp(x, y), fire = L(710, 430), cand = L(715, 400), tv = L(260, 280), ip = L(SOFA.ipad[0], SOFA.ipad[1]), face = L(962, 430), gar = L(710, 100), win = L(1300, 280);
    const fl = .85 + .15 * Math.sin(t * 7) * Math.sin(t * 3.3), tvf = .7 + .3 * Math.sin(t * 2.1) * Math.sin(t * 5.7), fade = 1 - clamp((k - .5) / .4, 0, 1), z = this.cam.z;
    if (this.morning) {
      lightMap('70,40,30,' + (.18 * fade), [{ x: win.x, y: win.y, r: 600 * z / 1.22, a: .9, col: '255,220,170', ca: .25 }, { x: fire.x, y: fire.y, r: 400 * z / 1.22, a: .7 }]);
    } else {
      lightMap('10,6,26,' + (.84 * fade), [
        { x: fire.x, y: fire.y + 30, r: 380 * z / 1.22, a: .95 * fl, col: '255,140,60', ca: .22, k: .3 }, { x: cand.x, y: cand.y, r: 170 * z / 1.22, a: .95, col: '255,190,100', ca: .3 },
        { x: tv.x, y: tv.y, r: 290 * z / 1.22, a: .62 * tvf, col: '120,160,255', ca: .3, k: .3 }, { x: ip.x, y: ip.y, r: 170 * z / 1.22, a: .9, col: '160,210,255', ca: .3, k: .3 },
        { x: face.x, y: face.y, r: 105 * z / 1.22, a: .8, col: '180,220,255', ca: .3 }, { x: gar.x, y: gar.y, r: 230 * z / 1.22, a: .35, col: '255,210,140', ca: .12, sy: .45 },
        { x: win.x, y: win.y, r: 170 * z / 1.22, a: .3, col: '120,150,255', ca: .12 }, { x: (fire.x + ip.x) / 2, y: fire.y + 120, r: 420 * z / 1.22, a: .35, k: .2 }
      ]);
      // bright bits stay bright
      ctx.save(); const cc = this.cam; ctx.translate(W / 2, H / 2); ctx.rotate(cc.rot); ctx.scale(cc.z, cc.z); ctx.translate(-cc.x, -cc.y);
      const [fx0, fy0, fw0, fh0] = LIV.fire;
      LIV_CANDLES.forEach(([cx0, ch0], i) => { const ty = fy0 + fh0 - 50 - ch0, f = Math.sin(t * 9 + i * 2) * 1.5; ctx.beginPath(); ctx.moveTo(cx0, ty - 22 - f); ctx.quadraticCurveTo(cx0 + 6, ty - 8, cx0, ty - 2); ctx.quadraticCurveTo(cx0 - 6, ty - 8, cx0, ty - 22 - f); fillP(ctx, '#ffd36b'); glowAt(ctx, cx0, ty - 10, 26, '255,190,90', .45); });
      drawLights(ctx, garlandLights(500, 920, 66, 26), t, 1);
      ctx.restore();
    }
    drawGrain(.05 * fade);
    // speech
    this.says = this.says.filter(s => t - s.t0 < s.dur);
    if (!this.zooming) for (const s of this.says) { const p = s.who === 'sam' ? this.wp(940, 300) : this.wp(m.x, m.y - 120); speech(ctx, s.msg, clamp(p.x, 220, W - 220), Math.max(200, p.y), s.t0, t, 320); }
    if (this.zooming) { if (k > .82) { ctx.fillStyle = 'rgba(255,255,255,' + (k - .82) / .18 + ')'; ctx.fillRect(0, 0, W, H); } return; }
    if (this.morning) { showGoal({ msg: 'Christmas morning! Something is waiting on the iPad...', sub: 'Tap the iPad to see.', col: '#c8453b' }, t, true); skipBtn(() => this.startZoom()); return; }
    // HUD
    ctx.save(); ctx.translate(76, 0);
    hudCard(104, 18, 330, 64);
    text(ctx, 'Mona settled in bed', 124, 38, { size: 15, align: 'left', color: '#8a6a5a', weight: 600 });
    for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(160 + i * 64, 62); ctx.globalAlpha = i < this.settles ? 1 : .3; ctx.scale(.36, .36); drawCatBed(ctx, 0, 10, 1, false); if (i < this.settles) drawMona(ctx, 0, 4, .6, { pose: 'sleep', t, outfit: curOutfit() }); drawCatBed(ctx, 0, 10, 1, true); ctx.restore(); }
    ctx.restore();
    scoreCard(950, 100, t, 'Under 45 seconds');
    const msg = m.st === 'block' ? ['Mona is blocking the iPad!', 'Tap her cat bed so Samantha can pat it.  Or tap Mona for a scratch.', '#d8322c'] : m.st === 'inbed' ? (this.res ? ['Mona is fast asleep.', 'Time for a game...', '#2f9a5e'] : ['She\'s in her bed... for now.', 'Watch out, she\'ll be back!', '#7b5aa8']) : ['Here comes Mona...', 'She walks along the back of the sofa.', '#7b5aa8'];
    showGoal({ msg: msg[0], sub: msg[1], col: msg[2] }, t, true);
    if (m.st === 'block') { const q = this.wp(SOFA.bed[0], SOFA.bed[1] - 10); targetArrow(q.x, q.y, t, { dir: 'down', r: 70 }); }
    if (this.res && this.t - this.finishT > .5) { const kk = E.back((this.t - this.finishT - .5) / .5); ctx.save(); ctx.translate(W / 2, 250); ctx.scale(kk, kk); rr(ctx, -200, -50, 400, 100, 50); fillP(ctx, 'rgba(255,250,240,.95)'); starRow(0, -6, this.res.stars, 24, 64); text(ctx, 'Settled!', 0, 34, { size: 22, color: '#7b5aa8', weight: 700 }); ctx.restore(); }
  }
};
SCENES.morning = { enter(p) { SCENES.sofa.enter.call(this, Object.assign({}, p, { morning: true })); } };
Object.setPrototypeOf(SCENES.morning, SCENES.sofa);
