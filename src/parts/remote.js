/* ============ v3 Level: THE TV REMOTE ============
   Evening. Samantha is watching her soap ("EastEnders", an original East End-style pastiche).
   Mona strolls along the sofa and steps on the remote: CATWATCH (cats running on a beach in slow motion).
   An Apple TV-style remote jiggles on: tap the lit buttons to switch back, and tap the cat bed to settle
   Mona before she gets to the remote again. Three rounds, then Mona falls asleep on the remote. */
const RM = { remote: [918, 468], bed: SOFA.bed, back: SOFA.back, perch: [1160, SOFA.back] };
const RM_SEQ = [['back'], ['tv', 'select'], ['back', 'tv', 'select']];
const RM_BTN_NAME = { back: 'Back', tv: 'TV', select: 'the clickpad', play: 'Play/Pause', mute: 'Mute', vol: 'Volume' };
const SOAP_LINES = [['SHAZ', 'Not at Christmas, Del. NOT at Christmas.'], ['DEL', 'Get outta my pub!'], ['SHAZ', 'I know what you did...'], ['DEL', '...with the turkey.'], ['NAN', 'Who wants a sherry?']];
/* ---- the soap: a London pub at Christmas, two people having a row, a nan with a sherry ---- */
function soapTV(g, x, y, w, h, t, sting) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  const bg = g.createLinearGradient(0, y, 0, y + h); bg.addColorStop(0, '#5a2a22'); bg.addColorStop(1, '#2a1410'); g.fillStyle = bg; g.fillRect(x, y, w, h);
  // pub back bar: bottles, warm lamps, tinsel
  g.fillStyle = '#3a1c14'; g.fillRect(x, y + h * .18, w, h * .34);
  for (let i = 0; i < 14; i++) { const bx = x + 10 + i * (w - 20) / 13; rr(g, bx - 4, y + h * .24 + (i % 3) * 2, 8, 22, 2); g.fillStyle = ['#2f7a4a', '#a8522a', '#e8c36a', '#6a2a5a'][i % 4]; g.fill(); }
  for (let i = 0; i < 3; i++) { const lx = x + w * (.2 + i * .3); glowAt(g, lx, y + h * .12, 50, '255,200,120', .5); circ(g, lx, y + h * .12, 6); fillP(g, '#ffe3a0'); }
  g.beginPath(); for (let i = 0; i <= 20; i++) g.lineTo(x + i * w / 20, y + h * .08 + Math.abs(Math.sin(i * .9)) * 8); strokeP(g, '#e8c040', 3);
  g.fillStyle = '#6a3a22'; g.fillRect(x, y + h * .62, w, h * .38); g.fillStyle = '#8a5030'; g.fillRect(x, y + h * .62, w, 6);
  // the row: Shaz (left) and Del (right), leaning in on the beat; nan in the corner
  const lean = Math.sin(t * 2.2) * 3;
  const person = (px, hair, top, flip, talk) => { g.save(); g.translate(px, y + h * .64); g.scale(flip, 1); rr(g, -18, -50, 36, 54, 12); fillP(g, top); circ(g, 0, -64 + lean * .3, 15); fillP(g, '#e8b48a'); g.beginPath(); g.arc(0, -68, 16, Math.PI, 0); fillP(g, hair); if (talk) { ell(g, 7, -59, 4, 2 + Math.abs(Math.sin(t * 14)) * 2.5); fillP(g, '#5a1a1a'); } line(g, 18, -36, 30 + lean, -50, top, 9); g.restore(); };
  const who = Math.floor(t / 2.6) % SOAP_LINES.length, sp = SOAP_LINES[who][0];
  person(x + w * .36 + lean, '#c8402a', '#7a2a6a', 1, sp === 'SHAZ'); person(x + w * .64 - lean, '#2a1a12', '#2a3a5a', -1, sp === 'DEL');
  g.save(); g.translate(x + w * .9, y + h * .66); circ(g, 0, -40, 11); fillP(g, '#e8b48a'); circ(g, 0, -46, 12); fillP(g, '#d8d8e0'); rr(g, -14, -30, 28, 34, 8); fillP(g, '#5a7a5a'); rr(g, 10, -26, 6, 10, 2); fillP(g, '#c86a2a'); g.restore();
  // subtitle
  rr(g, x + 10, y + h - 30, w - 20, 22, 4); g.fillStyle = 'rgba(0,0,0,.6)'; g.fill(); text(g, SOAP_LINES[who][1], x + w / 2, y + h - 18, { size: 12, color: '#fff', weight: 700 });
  // the show's own title bug, top left
  rr(g, x + 6, y + 6, 92, 16, 3); g.fillStyle = 'rgba(0,0,0,.45)'; g.fill(); text(g, 'EASTENDERS', x + 52, y + 14.5, { size: 8.5, color: '#ffe3a0', weight: 700 });
  // the end-of-episode cliffhanger freeze: a red-tinted zoom on Shaz's face
  if (sting) { g.fillStyle = 'rgba(160,20,20,' + (.35 * sting) + ')'; g.fillRect(x, y, w, h); }
  g.globalAlpha = .08; g.fillStyle = '#000'; for (let yy = y; yy < y + h; yy += 3) g.fillRect(x, yy, w, 1); g.globalAlpha = 1;
  g.restore();
}
/* ---- CATWATCH: a sunset beach, the surf, and cats running towards us in slow motion ---- */
function catwatchTV(g, x, y, w, h, t) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  const sk = g.createLinearGradient(0, y, 0, y + h * .55); sk.addColorStop(0, '#ff8a5a'); sk.addColorStop(1, '#ffd38a'); g.fillStyle = sk; g.fillRect(x, y, w, h);
  circ(g, x + w * .72, y + h * .42, 26); fillP(g, '#fff0b0');
  const sea = g.createLinearGradient(0, y + h * .45, 0, y + h * .66); sea.addColorStop(0, '#3a8ac0'); sea.addColorStop(1, '#6ac0d8'); g.fillStyle = sea; g.fillRect(x, y + h * .45, w, h * .21);
  for (let i = 0; i < 3; i++) { g.beginPath(); for (let k = 0; k <= 30; k++) g.lineTo(x + k * w / 30, y + h * (.5 + i * .05) + Math.sin(k * .8 + t * (1 + i * .3)) * 2); strokeP(g, 'rgba(255,255,255,.55)', 2); }
  g.fillStyle = '#f2d39a'; g.fillRect(x, y + h * .64, w, h * .36); g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.moveTo(x, y + h * .64); for (let k = 0; k <= 20; k++) g.lineTo(x + k * w / 20, y + h * .64 + Math.sin(k + t) * 3); g.lineTo(x + w, y + h * .66); g.lineTo(x, y + h * .66); g.fill();
  // lifeguard tower
  g.save(); g.translate(x + w * .1, y + h * .66); g.fillStyle = '#c8402a'; g.fillRect(-18, -52, 36, 22); line(g, -14, -30, -20, 0, '#fff', 3); line(g, 14, -30, 20, 0, '#fff', 3); g.restore();
  // cats in slow motion (gait at a quarter speed, fur and ears bouncing)
  const coats = [COATS.ginger, null, COATS.white];
  coats.forEach((c, i) => { const cx = x + w * (.3 + i * .22), cy = y + h * (.86 + (i % 2) * .05) - Math.abs(Math.sin(t * 1.6 + i)) * 6; drawCat(g, cx, cy, .28, { pose: 'run', face: i % 2 ? -1 : 1, t, gait: t * 2.2 + i, eyes: 'happy', noShadow: true, outfit: i === 1 ? curOutfit() : 'none' }, c); });
  g.save(); g.translate(x + w / 2, y + h * .16); g.rotate(-.04); text(g, 'CATWATCH', 0, 0, { size: 30, color: '#d8261f', weight: 700, stroke: '#fff', sw: 5 }); g.restore();
  g.globalAlpha = .08; g.fillStyle = '#000'; for (let yy = y; yy < y + h; yy += 3) g.fillRect(x, yy, w, 1); g.globalAlpha = 1;
  g.restore();
}
function tvStatic(g, x, y, w, h, a) { g.save(); g.globalAlpha = a; for (let i = 0; i < 260; i++) { g.fillStyle = Math.random() > .5 ? '#fff' : '#333'; g.fillRect(x + Math.random() * w, y + Math.random() * h, 4, 2); } g.restore(); }
/* ---- an Apple TV-style remote: brushed silver, a clickpad on top, round buttons below ---- */
const ATV_BTNS = { select: [0, -170, 44], up: [0, -216, 22], back: [-38, -60, 27], tv: [38, -60, 27], play: [-38, 12, 27], mute: [-38, 84, 27], vol: [38, 48, 27] };
function drawATVRemote(g, t, next, press, gr) {
  // body
  g.save(); g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 30; g.shadowOffsetY = 14; rr(g, -78, -270, 156, 540, 44); fillP(g, '#bfc3c9'); g.restore();
  const bg = g.createLinearGradient(-78, 0, 78, 0); bg.addColorStop(0, '#9ea3aa'); bg.addColorStop(.15, '#d9dce0'); bg.addColorStop(.5, '#eef0f2'); bg.addColorStop(.85, '#d4d7db'); bg.addColorStop(1, '#a3a8af');
  rr(g, -78, -270, 156, 540, 44); g.fillStyle = bg; g.fill(); g.strokeStyle = '#7a7f86'; g.lineWidth = 2; g.stroke();
  g.globalAlpha = .06; for (let i = -70; i < 70; i += 3) line(g, i, -262, i, 262, '#000', 1); g.globalAlpha = 1;
  // power button
  circ(g, 50, -246, 9); fillP(g, '#26272b'); g.beginPath(); g.arc(50, -246, 4.5, -1.1, 4.2); strokeP(g, '#8a8d92', 1.6); line(g, 50, -252, 50, -246, '#8a8d92', 1.6);
  // clickpad ring + centre
  circ(g, 0, -170, 66); fillP(g, '#1c1d21'); circ(g, 0, -170, 64); strokeP(g, '#3a3b40', 2);
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 - Math.PI / 2; circ(g, Math.cos(a) * 52, -170 + Math.sin(a) * 52, 2.5); fillP(g, '#55575c'); }
  circ(g, 0, -170, 40); fillP(g, '#232428'); circ(g, 0, -170, 40); strokeP(g, '#3c3d42', 1.5);
  const btn = (id, draw) => { const [bx, by, r] = ATV_BTNS[id], pr = press && press.id === id && press.t < .18; g.save(); g.translate(bx, by); if (gr) g.rotate(gr); if (pr) g.scale(.92, .92); if (id !== 'select' && id !== 'vol') { circ(g, 0, 0, r); fillP(g, '#26272b'); circ(g, 0, 0, r); strokeP(g, '#45464b', 1.5); } draw(); g.restore(); };
  btn('back', () => { g.beginPath(); g.moveTo(5, -9); g.lineTo(-5, 0); g.lineTo(5, 9); strokeP(g, '#e8e9eb', 3.2); });
  btn('tv', () => { rr(g, -11, -8, 22, 15, 3); strokeP(g, '#e8e9eb', 2.4); line(g, -5, 11, 5, 11, '#e8e9eb', 2.4); });
  btn('play', () => { g.fillStyle = '#e8e9eb'; g.beginPath(); g.moveTo(-10, -7); g.lineTo(-1, 0); g.lineTo(-10, 7); g.fill(); g.fillRect(2, -7, 3, 14); g.fillRect(7, -7, 3, 14); });
  btn('mute', () => { g.fillStyle = '#e8e9eb'; g.beginPath(); g.moveTo(-10, -4); g.lineTo(-5, -4); g.lineTo(1, -9); g.lineTo(1, 9); g.lineTo(-5, 4); g.lineTo(-10, 4); g.fill(); line(g, 4, -6, 11, 6, '#e8e9eb', 2.2); });
  // volume rocker pill
  g.save(); const [vx, vy] = ATV_BTNS.vol; rr(g, vx - 27, vy - 64, 54, 128, 27); fillP(g, '#26272b'); g.save(); g.translate(vx, vy - 34); if (gr) g.rotate(gr); text(g, '+', 0, 0, { size: 30, color: '#e8e9eb', weight: 700 }); g.restore(); g.save(); g.translate(vx, vy + 36); if (gr) g.rotate(gr); line(g, -9, 0, 9, 0, '#e8e9eb', 3.4); g.restore(); g.restore();
  // the next button to press: a pulsing gold ring and a finger
  if (next) {
    const [bx, by, r] = ATV_BTNS[next], p = .5 + .5 * Math.sin(t * 7);
    g.save(); g.shadowColor = '#ffd84d'; g.shadowBlur = 20; circ(g, bx, by, r + 8 + p * 5); strokeP(g, '#ffd84d', 5); g.restore();
    g.save(); g.translate(bx + r * .7 + 14, by + r * .7 + 18 + p * 8); g.rotate(-.5); rr(g, -9, -4, 18, 46, 9); ink(g, '#f6c8a8', 2.4); ell(g, 0, 42, 20, 14); ink(g, '#f6c8a8', 2.4); g.restore();
  }
}
SCENES.remote = {
  enter() {
    this.cam = { z: 1, x: PORT ? 720 : 740, y: 450 }; this.says = []; this.res = null; this.finished = false; this.left = false;
    this.tv = 'soap'; this.flipT = -9; this.flips = 0; this.round = 0; this.roundOpen = false; this.seqI = 0; this.seq = null; this.press = null; this.saves = 0; this.patT = 0; this.ending = false; this.closeT = -9;
    this.m = { x: RM.bed[0], y: RM.bed[1] - 6, pose: 'loaf', face: -1, st: 'bed', bedT: 2.4, path: null, layer: 'front', gait: 0 };
    this.rem = { k: 0 };
    audio.music('evening');
  },
  say(who, msg, dur) { this.says = this.says.filter(s => s.who !== who); this.says.push({ who, msg, t0: this.t, dur: dur || 2.4 }); },
  walkPath(segs, then) { const m = this.m; m.path = { segs: segs.map(s => ({ x: s[0], y: s[1], mode: s[2], dur: s[3] })), i: 0, k: 0, fx: m.x, fy: m.y, then }; },
  approach() {
    const m = this.m; m.st = 'approach'; this.roundOpen = true; audio.sfx('meow', 1.2);
    const slow = this.ending ? 1.6 : 1, fromBed = Math.abs(m.x - RM.bed[0]) < 30;
    const segs = []; if (fromBed) segs.push([RM.perch[0], RM.back, 'hop', .55]);
    segs.push([970, RM.back, 'walk', (this.round === 0 ? 2.6 : 3.2 - this.round * .3) * slow], [RM.remote[0], RM.remote[1] - 4, 'hop', .5]);
    this.walkPath(segs, () => this.onRemote());
    if (this.ending) this.say('mona', 'Yawwwn...', 1.6);
  },
  onRemote() {
    const m = this.m; m.pose = 'stand'; m.face = -1;
    if (this.ending) { m.st = 'sleep'; m.pose = 'sleep'; this.flipTo('cat'); audio.purrStart(); this.say('sam', 'Fine. Catwatch it is.', 2.6); this.finishT = this.t; setTimeout(() => audio.purrStop(), 3500); this.finish(); return; }
    m.st = 'smug'; this.flipTo('cat'); this.flips++;
    this.say('sam', ['MONA! I was watching that!', 'Not AGAIN!', 'Oh, come ON, Mona!'][Math.min(2, this.flips - 1)], 2);
    setTimeout(() => { if (this.m.st === 'smug') { this.say('mona', pick(['Mrrp!', 'Prrrp.', 'Mrrrow?']), 1.2); audio.sfx('meow', .9); this.m.st = 'wander'; this.walkPath([[RM.perch[0], RM.back, 'hop', .6]], () => { this.m.st = 'wait'; this.m.waitT = 1.4 - this.round * .2; this.m.pose = 'sit'; this.m.face = -1; }); } }, 1100);
  },
  flipTo(ch) {
    if (this.tv === ch) return; this.tv = ch; this.flipT = this.t; audio.sfx('blip'); audio.sfx('scratch');
    if (ch === 'cat') { this.seq = RM_SEQ[Math.min(RM_SEQ.length - 1, this.round)]; this.seqI = 0; this.closeT = this.t; }
    else { this.rem.on = false; this.closeT = -9; }
  },
  toBed() {
    const m = this.m; if (m.st === 'bed' || m.st === 'tobed' || m.st === 'sleep') return;
    m.st = 'tobed'; audio.sfx('whoosh'); const onBack = Math.abs(m.y - RM.back) < 10;
    this.walkPath([[RM.bed[0], RM.bed[1] - 6, 'hop', onBack ? .7 : .9]], () => {
      m.st = 'bed'; m.pose = 'loaf'; m.face = -1; m.bedT = 2.8; audio.sfx('heart'); const q = this.wp(m.x, m.y - 40); spawn('heart', q.x, q.y, 6);
      if (this.tv === 'soap') { this.saves++; addPts(150, q.x, q.y - 50, 'Saved the remote!'); } else addPts(100, q.x, q.y - 50, 'Settled!');
      this.say('sam', pick(['Good girl. Stay!', 'Bed. Stay there.', 'Thank you, Mona.']), 1.6);
    });
  },
  pressBtn(id) {
    if (!this.seq || this.tv !== 'cat') return; this.press = { id, t: 0 };
    if (id === this.seq[this.seqI]) { audio.sfx('tick'); this.seqI++; if (this.seqI >= this.seq.length) { this.flipTo('soap'); audio.sfx('chime'); addPts(100, W / 2, 300, 'Back to the soap!'); this.say('sam', pick(['Phew. What did I miss?', 'Back to EastEnders.', 'Right. Where was I?']), 2); } }
    else { audio.sfx('blip2'); shake(.25); }
  },
  finish() {
    if (this.finished) return; this.finished = true; const stars = this.flips <= 1 ? 3 : this.flips <= 3 ? 2 : 1;
    this.res = finishLevel('remote', stars, GAME.pts); markDone('remote');
    setTimeout(() => { if (sceneName === 'remote' && this.finished) { if (inStory()) storyNext(); else go('levels'); } }, 5200);
  },
  wp(x, y) { const c = this.cam; return { x: W / 2 + (x - c.x) * c.z, y: H / 2 + (y - c.y) * c.z }; },
  sw(X, Y) { const c = this.cam; return { x: (X - W / 2) / c.z + c.x, y: (Y - H / 2) / c.z + c.y }; },
  update(dt) {
    const m = this.m; this.patT = Math.max(0, this.patT - dt); if (this.press) this.press.t += dt;
    if (this.tv === 'cat' && !this.ending && this.t - this.flipT > 1.2) this.rem.on = true;
    this.rem.k = clamp(this.rem.k + (this.rem.on || (PORT && !this.ending && !this.finished) ? dt * 3 : -dt * 4), 0, 1);
    // camera: a quick close-up on the TV each time it flips to Catwatch; on Mona when she falls asleep
    const close = !PORT && this.t - this.flipT < 1.3 && this.tv === 'cat' && !this.ending, tc = close ? { z: 2.1, x: 300, y: 300 } : this.finished && !PORT ? { z: 1.6, x: 980, y: 440 } : { z: 1, x: PORT ? 720 : 740, y: 450 }, ck = Math.min(1, dt * (close ? 5 : 2.4));
    for (const k of ['z', 'x', 'y']) this.cam[k] = lerp(this.cam[k], tc[k], ck);
    if (m.path) {
      const P = m.path, sg = P.segs[P.i]; P.k += dt / sg.dur; const k = Math.min(1, P.k);
      if (sg.mode === 'walk') { m.x = lerp(P.fx, sg.x, k); m.y = lerp(P.fy, sg.y, k); m.pose = 'walk'; m.gait += Math.abs(sg.x - P.fx) / sg.dur * dt * .042; }
      else { const e = E.inOut(k); m.x = lerp(P.fx, sg.x, e); m.y = lerp(P.fy, sg.y, e) - Math.sin(k * Math.PI) * 70; m.pose = 'pounce'; }
      if (Math.abs(sg.x - P.fx) > 4) m.face = Math.sign(sg.x - P.fx);
      m.layer = (m.y < RM.back + 12 && m.x < 1180) ? 'back' : 'front';
      if (k >= 1) { P.i++; P.k = 0; P.fx = m.x; P.fy = m.y; if (P.i >= P.segs.length) { m.path = null; if (P.then) P.then(); } }
    }
    if (m.st === 'wait') { m.waitT -= dt; if (m.waitT <= 0) this.approach(); }
    if (m.st === 'bed') {
      if (this.roundOpen && this.tv === 'soap') { this.roundOpen = false; this.round++; if (this.round >= 3) { this.ending = true; m.bedT = 2.2; this.say('sam', 'Three times! Right, I\'m keeping hold of this remote...', 2.6); } }
      if (this.tv === 'soap') { m.bedT -= dt; if (m.bedT <= 0) this.approach(); }
      if (Math.random() < dt * .8) { const q = this.wp(m.x + 30, m.y - 60); spawn('zzz', q.x, q.y); }
    }
    if (m.st === 'sleep' && Math.random() < dt * 1.2) { const q = this.wp(m.x + 20, m.y - 60); spawn('zzz', q.x, q.y); }
    this.says = this.says.filter(s => this.t - s.t0 < s.dur);
  },
  remoteXY() { return { x: 600, y: 490 + (1 - E.back(this.rem.k)) * 700 }; },
  down(X, Y) {
    if (this.finished) return;
    // the remote overlay first
    if (this.rem.k > .7 && this.remXf) {
      const P0 = PORT ? screenPt() : { x: X, y: Y }, r = this.remXf, rot = r.rot, dx = P0.x - r.x, dy = P0.y - r.y, lx = (dx * Math.cos(-rot) - dy * Math.sin(-rot)) / r.s, ly = (dx * Math.sin(-rot) + dy * Math.cos(-rot)) / r.s;
      if (Math.abs(lx) < 90 && Math.abs(ly) < 290) {
        let best = null; for (const id in ATV_BTNS) { const [bx, by, r0] = ATV_BTNS[id]; const d = dist(lx, ly, bx, by); if (d < r0 + 12 && (!best || d < best.d)) best = { id, d }; }
        if (best) this.pressBtn(best.id === 'up' ? 'select' : best.id); return;
      }
    }
    const w = this.sw(X, Y), m = this.m;
    if (dist(w.x, w.y, RM.bed[0], RM.bed[1] - 10) < 90) {
      this.patT = .9; audio.sfx('thud');
      if (m.st === 'approach' || m.st === 'wait' || m.st === 'wander' || m.st === 'smug') { if (this.ending) { this.say('sam', 'She\'s too sleepy to listen...', 1.4); return; } this.say('sam', pick(['Mona! Bed!', 'In your bed, missy!', 'Look, your cosy bed!']), 1.4); setTimeout(() => this.toBed(), 350); }
      return;
    }
    if (dist(w.x, w.y, m.x, m.y - 50) < 80) { spawn('heart', X, Y - 30, 4); audio.sfx('meow', 1); }
  },
  tap() { },
  draw() {
    const t = this.t, m = this.m, c = this.cam;
    ctx.fillStyle = '#120c18'; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y);
    ctx.drawImage(cached('liv-sofa-night', LIV.w, H, g => drawLiving(g, 'night')), 0, 0, LIV.w, H);
    livingLive(ctx, t, 'night');
    // the TV
    const [tx, ty, tw, th] = [98, 188, 324, 180], since = t - this.flipT;
    if (this.tv === 'soap') soapTV(ctx, tx, ty, tw, th, t, 0); else catwatchTV(ctx, tx, ty, tw, th, t);
    if (since < .35) tvStatic(ctx, tx, ty, tw, th, 1 - since / .35);
    if (since < 1.4 && this.tv === 'cat') { ctx.save(); ctx.translate(tx + tw - 50, ty + 22); rr(ctx, -40, -12, 80, 24, 4); fillP(ctx, 'rgba(0,0,0,.55)'); text(ctx, 'CH 9', 0, 1, { size: 14, color: '#6ef09a', weight: 700 }); ctx.restore(); }
    drawCatBed(ctx, RM.bed[0], RM.bed[1] + 8, .66, false);
    const monaO = () => drawMona(ctx, m.x, m.y, .82, { pose: m.pose, face: m.face, t, gait: m.gait, outfit: curOutfit(), eyes: m.st === 'sleep' ? 'sleep' : m.st === 'bed' ? 'half' : m.st === 'smug' ? 'happy' : this.ending ? 'half' : undefined, noShadow: m.layer === 'back' || m.pose === 'pounce' });
    if (m.layer === 'back') monaO();
    // the remote on the sofa arm
    if (m.st !== 'sleep') { ctx.save(); ctx.translate(RM.remote[0], RM.remote[1]); ctx.rotate(-.5); rr(ctx, -9, -26, 18, 52, 7); ink(ctx, '#c9ccd1', 2); circ(ctx, 0, -14, 6); fillP(ctx, '#222'); ctx.restore(); }
    const tvMood = this.tv === 'cat' ? (this.ending ? 'happy' : 'grump') : 'smile';
    drawSamSofa(ctx, SOFA.samX, SOFA.samY, 1, { t, outfit: 'sweater', expr: this.finished ? 'laugh' : tvMood, noIpad: true });
    drawCatBed(ctx, RM.bed[0], RM.bed[1] + 8, .66, true);
    if (m.st === 'bed') drawMona(ctx, m.x, m.y, .82, { pose: 'loaf', face: -1, t, outfit: curOutfit(), eyes: 'half', noShadow: true });
    else if (m.layer === 'front') monaO();
    if (this.patT > 0) { const pk = Math.sin((1 - this.patT / .9) * Math.PI * 3); samArm(ctx, 1030, 486, RM.bed[0] - 20, RM.bed[1] - 20 - Math.abs(pk) * 14, 'sweater', 0); }
    // glowing tap target on the bed while Mona is up to something
    if (!this.finished && !this.ending && (m.st === 'approach' || m.st === 'wait' || m.st === 'wander' || m.st === 'smug')) { ctx.save(); ctx.globalAlpha = .5 + .5 * Math.sin(t * 5); ell(ctx, RM.bed[0], RM.bed[1] - 4, 64, 26); strokeP(ctx, '#fff3b0', 4); ctx.restore(); }
    ctx.restore();
    // lighting: dark cosy room, the TV throwing its colour
    const L = (x, y) => this.wp(x, y), fire = L(710, 430), tv = L(260, 290), face = L(962, 430), gar = L(710, 100), z = c.z, fl = .85 + .15 * Math.sin(t * 7) * Math.sin(t * 3.3);
    const tvCol = this.tv === 'cat' ? '255,170,90' : '255,150,110', tvf = .75 + .25 * Math.sin(t * 2.1) * Math.sin(t * 5.7);
    lightMap('10,6,26,.8', [{ x: fire.x, y: fire.y + 30, r: 380 * z, a: .95 * fl, col: '255,140,60', ca: .22, k: .3 }, { x: tv.x, y: tv.y, r: 360 * z, a: .8 * tvf, col: tvCol, ca: .3, k: .3 }, { x: face.x, y: face.y, r: 160 * z, a: .7, col: tvCol, ca: .2 }, { x: gar.x, y: gar.y, r: 230 * z, a: .35, col: '255,210,140', ca: .12, sy: .45 }, { x: L(1200, 520).x, y: L(1200, 520).y, r: 300 * z, a: .45, k: .2 }]);
    drawGrain(.05);
    // speech
    for (const s of this.says) { const p = s.who === 'sam' ? this.wp(960, 300) : this.wp(m.x, m.y - 120); speech(ctx, s.msg, clamp(p.x, 220, W - 220), clamp(p.y, 200, H - 140), s.t0, t, 320); }
    // the Apple TV remote, jiggling on (on a phone it pops up in the dock, right under her thumb)
    if (this.rem.k > 0) {
      const drawRem = () => {
        // on a phone the remote lies on its side across the bottom of the screen: big buttons, right under her thumbs
        let r; if (PORT) { const y0 = DOCK ? DOCK.y : PH - 300, s2 = Math.max(.7, Math.min(1.3, (PW - 60) / 540, (PH - SAFE_B - y0 - 66) / 162)); r = { x: PW / 2, y: y0 + 46 + 80 * s2 + (1 - E.back(this.rem.k)) * 600, s: s2, rot: PI2 }; } else r = Object.assign(this.remoteXY(), { s: .9, rot: -.08 });
        this.remXf = r; const jg = jiggle(t, 5.5); ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(r.rot + jg.rot * (PORT ? .3 : 1)); ctx.scale(r.s * jg.sx, r.s * jg.sy);
        drawATVRemote(ctx, t, this.seq && this.seqI < this.seq.length ? this.seq[this.seqI] : null, this.press, PORT ? -r.rot : 0); ctx.restore();
        if (this.seq && this.rem.k > .8) { const nx = this.seq[this.seqI]; ctx.save(); if (PORT) ctx.translate(PW / 2, r.y - 80 * r.s - 40); else ctx.translate(r.x + 250, r.y - 190); ctx.rotate(-.05); if (PORT) ctx.scale(.8, .8); rr(ctx, -150, -26, 300, 52, 26); fillP(ctx, 'rgba(255,250,240,.96)'); text(ctx, nx ? 'Press ' + RM_BTN_NAME[nx] + '  (' + (this.seqI + 1) + '/' + this.seq.length + ')' : 'Done!', 0, 1, { size: 22, color: '#c8453b', weight: 700 }); ctx.restore(); }
      };
      if (PDEFER) deferLate(drawRem); else drawRem();
    }
    // HUD: rounds as little remotes
    if (!this.finished) {
      if (PORT) { } else { ctx.save(); ctx.translate(250, 96); hudCard(0, 0, 250, 64); text(ctx, 'Rounds', 20, 20, { size: 15, align: 'left', color: '#8a6a5a', weight: 600 });
      for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(30 + i * 40, 44); ctx.globalAlpha = i < this.round ? 1 : .3; rr(ctx, -6, -12, 12, 24, 5); fillP(ctx, '#c9ccd1'); circ(ctx, 0, -5, 3.5); fillP(ctx, '#222'); ctx.restore(); }
      text(ctx, 'Catwatch: ' + this.flips, 150, 44, { size: 18, align: 'left', color: '#3b2f2a', weight: 700 }); ctx.restore(); }
      const msg = this.tv === 'cat' && !this.ending ? ['Catwatch! Switch it back with the remote.', m.st === 'bed' ? 'Press the lit buttons on the remote.' : 'And tap the cat bed to send Mona back to bed!', '#c8453b'] : this.ending ? ['Mona is getting very sleepy...', 'Watch where she curls up.', '#7b5aa8'] : m.st === 'bed' || m.st === 'tobed' ? ['EastEnders is on. Lovely.', 'Keep an eye on Mona.', '#2f9a5e'] : ['Mona\'s heading for the remote!', 'Tap the cat bed so Samantha can call her back.', '#c8453b'];
      if (PORT && !this.ending) msg[0] = 'Round ' + Math.min(3, this.round + 1) + ' of 3: ' + msg[0];
      showGoal({ msg: msg[0], sub: msg[1], col: msg[2] }, t, true);
    }
    if (this.finished && this.res && t - this.finishT > 1.4) { const kk = E.back(clamp((t - this.finishT - 1.4) / .5, 0, 1)); ctx.save(); ctx.translate(W / 2, 220); ctx.scale(kk, kk); ctx.rotate(-.03); rr(ctx, -230, -50, 460, 100, 50); fillP(ctx, 'rgba(255,250,240,.96)'); starRow(0, -6, this.res.stars, 24, 64); text(ctx, 'Asleep on the remote!', 0, 34, { size: 22, color: '#7b5aa8', weight: 700 }); ctx.restore(); }
  }
};
