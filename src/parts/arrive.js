/* ============ Level 1: Welcome Home - the beige SUV pulls up, Mona's bugle celebration ============ */
function drawHouseFront(g) {
  INK = true;
  try {
    // sky at golden hour
    const sk = g.createLinearGradient(0, 0, 0, 580); sk.addColorStop(0, '#7c9fd0'); sk.addColorStop(.45, '#e8b9a4'); sk.addColorStop(.8, '#fbd8a8'); sk.addColorStop(1, '#fde7c4'); g.fillStyle = sk; g.fillRect(0, 0, W, 600);
    INK = false;
    // soft clouds
    for (const [cx, cy, s] of [[210, 120, 1], [760, 80, .8], [1080, 170, 1.1]]) { g.fillStyle = 'rgba(255,236,226,.55)'; for (let i = 0; i < 5; i++) { ell(g, cx + (i - 2) * 38 * s, cy + Math.abs(i - 2) * 6, 46 * s, 20 * s); g.fill(); } }
    // distant hills
    g.fillStyle = '#9a8fb4'; g.beginPath(); g.moveTo(0, 520); for (let x = 0; x <= W; x += 40) g.lineTo(x, 470 + Math.sin(x / 170) * 26 + Math.sin(x / 61) * 8); g.lineTo(W, 600); g.lineTo(0, 600); g.fill();
    g.fillStyle = '#7f8aa8'; g.beginPath(); g.moveTo(0, 560); for (let x = 0; x <= W; x += 40) g.lineTo(x, 520 + Math.sin(x / 120 + 1) * 18); g.lineTo(W, 600); g.lineTo(0, 600); g.fill();
    INK = true;
    // lawn
    const lg = g.createLinearGradient(0, 580, 0, 770); lg.addColorStop(0, '#6f9a52'); lg.addColorStop(1, '#5a8a44'); g.fillStyle = lg; g.fillRect(0, 580, W, 190);
    const r = mulberry(31); g.globalAlpha = .25; for (let i = 0; i < 260; i++) { const x = r() * W, y = 590 + r() * 170; line(g, x, y, x + (r() - .5) * 4, y - 6, '#3f6a2e', 2); } g.globalAlpha = 1;
    // a dusting of frost on the grass
    g.fillStyle = 'rgba(255,255,255,.22)'; for (let i = 0; i < 70; i++) { ell(g, r() * W, 600 + r() * 160, 14 + r() * 26, 4); g.fill(); }
    // house: stucco walls
    rr(g, 120, 300, 620, 304, 4); fillP(g, '#f1e4cd');
    rr(g, 740, 330, 380, 274, 4); fillP(g, '#ecdcc2');
    g.fillStyle = 'rgba(120,80,40,.07)'; for (let i = 0; i < 400; i++) g.fillRect(120 + r() * 1000, 300 + r() * 300, 2, 2);
    // roofs (dark shingles, low hip) with a snowy edge
    const roof = (x0, x1, ye, yr, inset) => { g.beginPath(); g.moveTo(x0 - 26, ye); g.lineTo(x0 + inset, yr); g.lineTo(x1 - inset, yr); g.lineTo(x1 + 26, ye); g.closePath(); };
    roof(120, 740, 304, 200, 150); { const rg = g.createLinearGradient(0, 200, 0, 304); rg.addColorStop(0, '#6a6460'); rg.addColorStop(1, '#4a4440'); g.fillStyle = rg; g.fill(); g.strokeStyle = OUT; g.lineWidth = 2.4; g.stroke(); }
    roof(740, 1120, 334, 248, 110); { const rg = g.createLinearGradient(0, 248, 0, 334); rg.addColorStop(0, '#635d59'); rg.addColorStop(1, '#46403c'); g.fillStyle = rg; g.fill(); g.stroke(); }
    g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1.4; for (let y = 214; y < 300; y += 12) { g.beginPath(); g.moveTo(140 - (y - 200) * .2, y); g.lineTo(720 + (y - 200) * .2, y); g.stroke(); }
    for (let y = 260; y < 330; y += 12) { g.beginPath(); g.moveTo(800 - (y - 248) * .6, y); g.lineTo(1060 + (y - 248) * .6, y); g.stroke(); }
    g.fillStyle = '#fbfdff'; rr(g, 270, 194, 320, 12, 6); g.fill(); rr(g, 850, 242, 160, 10, 5); g.fill();
    // fascia
    g.fillStyle = '#e8dcc6'; g.fillRect(94, 300, 672, 10); g.fillRect(714, 330, 432, 10);
    // picture window (Mona's window): warm room behind
    rr(g, 176, 346, 308, 208, 6); fillP(g, '#fbf6ec');
    // front door + wreath
    rr(g, 548, 368, 116, 236, 4); fillP(g, '#f6efe2'); rr(g, 560, 380, 92, 224, 3); fillP(g, '#a9443a');
    rr(g, 572, 470, 68, 50, 3); strokeP(g, 'rgba(0,0,0,.18)', 2.4); rr(g, 572, 532, 68, 56, 3); strokeP(g, 'rgba(0,0,0,.18)', 2.4); circ(g, 642, 500, 4); fillP(g, '#e3c25a');
    for (let i = 0; i < 26; i++) { const a = i / 26 * TAU; circ(g, 606 + Math.cos(a) * 24, 428 + Math.sin(a) * 24, 7); fillP(g, ['#2f6b47', '#3c7d55', '#24573a'][i % 3]); }
    for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + .3; circ(g, 606 + Math.cos(a) * 24, 428 + Math.sin(a) * 24, 3.4); fillP(g, '#e2443b'); }
    g.beginPath(); g.moveTo(594, 454); g.lineTo(606, 448); g.lineTo(618, 454); strokeP(g, '#e2443b', 5);
    // porch lamp
    rr(g, 674, 420, 16, 24, 4); fillP(g, '#3d3a38'); rr(g, 677, 424, 10, 16, 3); fillP(g, '#ffe7a8');
    // garage door
    rr(g, 772, 382, 316, 222, 4); fillP(g, '#f6f0e4');
    for (let i = 0; i < 4; i++) { g.fillStyle = 'rgba(0,0,0,.07)'; g.fillRect(780, 392 + i * 54, 300, 4); for (let j = 0; j < 4; j++) { rr(g, 788 + j * 74, 400 + i * 54, 64, 38, 3); strokeP(g, 'rgba(0,0,0,.1)', 2); } }
    for (let j = 0; j < 4; j++) { rr(g, 788 + j * 74, 400, 64, 22, 3); fillP(g, '#c9d9e6'); }
    // little side window
    rr(g, 690, 356, 36, 70, 4); fillP(g, '#ffe3b0');
    // walkway + driveway
    g.beginPath(); g.moveTo(560, 604); g.lineTo(650, 604); g.lineTo(700, 762); g.lineTo(560, 762); g.closePath(); fillP(g, '#dcd3c4');
    g.beginPath(); g.moveTo(760, 604); g.lineTo(1104, 604); g.lineTo(1190, 762); g.lineTo(700, 762); g.closePath(); fillP(g, '#cdc5b6');
    g.strokeStyle = 'rgba(0,0,0,.1)'; g.lineWidth = 2; for (const y of [650, 700]) { g.beginPath(); g.moveTo(740 - (y - 604) * .35, y); g.lineTo(1104 + (y - 604) * .55, y); g.stroke(); }
    // shrubs along the front
    for (const [x, rx] of [[150, 48], [230, 40], [470, 44], [520, 30], [700, 34], [1150, 56]]) { ell(g, x, 600, rx, 34); ink(g, rad(g, x, 590, rx, '#3b6e3c')); }
    // sidewalk, curb, street
    g.fillStyle = '#d9d3c8'; g.fillRect(0, 762, W, 30); g.fillStyle = '#b9b2a6'; g.fillRect(0, 790, W, 8);
    g.fillStyle = '#5c5d62'; g.fillRect(0, 798, W, 110); g.fillStyle = 'rgba(255,255,255,.05)'; for (let i = 0; i < 300; i++) g.fillRect(r() * W, 800 + r() * 100, 3, 2);
    g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1.5; for (let x = 0; x < W; x += 90) { g.beginPath(); g.moveTo(x, 762); g.lineTo(x - 6, 790); g.stroke(); }
    // mailbox
    rr(g, 96, 700, 10, 66, 3); fillP(g, '#5a4636'); rr(g, 76, 676, 50, 30, 12); fillP(g, '#3f4652'); rr(g, 118, 668, 6, 20, 2); fillP(g, '#e2443b');
    // a little lemon tree
    rr(g, 1196, 520, 14, 90, 4); fillP(g, '#6b4a30'); circ(g, 1203, 500, 60); fillP(g, '#3f7a3c'); for (let i = 0; i < 9; i++) { circ(g, 1170 + r() * 66, 470 + r() * 60, 6); fillP(g, '#f2d23e'); }
  } finally { INK = false; }
}
/* glowing bits: roof lights, light-up reindeer, porch light, window glow */
function houseLights(g, t, dim) {
  const pts = []; for (let x = 100; x <= 760; x += 26) pts.push([x, 312]); for (let x = 720; x <= 1140; x += 26) pts.push([x, 342]);
  pts.forEach(([x, y], i) => { line(g, x, y - 6, x, y - 2, '#2a3a2a', 2); bulb(g, x, y + 3, LIGHT_COLS[i % 5], .55 + .45 * Math.sin(t * 2.4 + i * 1.3), 1); });
  for (const [x, rx] of [[150, 48], [230, 40], [470, 44], [700, 34], [1150, 56]]) for (let i = 0; i < 7; i++) { const a = i * 2.1 + x; bulb(g, x + Math.cos(a) * rx * .7, 596 + Math.sin(a) * 18, LIGHT_COLS[(i + x) % 5], .5 + .5 * Math.sin(t * 3 + i), .8); }
  // light-up wire reindeer on the lawn
  g.save(); g.translate(330, 700); const nod = Math.sin(t * 1.2) * .06;
  g.strokeStyle = 'rgba(255,248,220,.95)'; g.lineWidth = 3; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.ellipse(0, -46, 46, 22, 0, 0, TAU); g.stroke();
  for (const lx of [-30, -18, 22, 34]) { g.beginPath(); g.moveTo(lx, -30); g.lineTo(lx + (lx < 0 ? -2 : 2), 0); g.stroke(); }
  g.save(); g.translate(40, -60); g.rotate(nod); g.beginPath(); g.moveTo(0, 0); g.lineTo(14, -40); g.stroke(); g.beginPath(); g.ellipse(22, -48, 16, 10, -.4, 0, TAU); g.stroke();
  g.beginPath(); g.moveTo(18, -56); g.lineTo(12, -80); g.lineTo(2, -88); g.moveTo(12, -80); g.lineTo(22, -92); g.moveTo(26, -56); g.lineTo(34, -78); g.lineTo(44, -86); g.stroke(); g.restore();
  g.restore();
  glowAt(g, 340, 660, 90, '255,240,200', .22 * dim);
  glowAt(g, 682, 432, 90, '255,220,140', .5 * dim); glowAt(g, 708, 390, 50, '255,210,140', .25 * dim);
}
function drawPictureWindow(g, t, mona) {
  const x = 186, y = 356, w = 288, h = 188;
  g.save(); rr(g, x, y, w, h, 3); g.clip();
  const ig = g.createLinearGradient(0, y, 0, y + h); ig.addColorStop(0, '#d98a52'); ig.addColorStop(1, '#ffd29a'); g.fillStyle = ig; g.fillRect(x, y, w, h);
  // the room inside: lamp glow, a picture, the tree twinkling
  glowAt(g, x + 230, y + 40, 120, '255,230,170', .6);
  rr(g, x + 40, y + 26, 54, 64, 3); fillP(g, '#f4f1ea'); rr(g, x + 47, y + 33, 40, 50, 2); fillP(g, '#2b2b2e');
  drawTreeStatic(g, x + 236, y + h + 6, .36); drawTreeLive(g, x + 236, y + h + 6, .36, t, 1);
  // blinds pulled up
  for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? 'rgba(250,246,238,.95)' : 'rgba(228,222,212,.95)'; g.fillRect(x, y + i * 7, w, 7); }
  if (mona) mona(g);
  // glass reflection
  g.globalAlpha = .22; g.fillStyle = '#fff'; g.beginPath(); g.moveTo(x + 60, y); g.lineTo(x + 110, y); g.lineTo(x + 40, y + h); g.lineTo(x - 10, y + h); g.closePath(); g.fill(); g.globalAlpha = 1;
  g.restore();
  // frame + mullion + sill
  rr(g, x, y, w, h, 3); strokeP(g, OUT, 2.4); line(g, x + w / 2, y, x + w / 2, y + h, '#fbf6ec', 7); line(g, x + w / 2, y, x + w / 2, y + h, 'rgba(61,42,34,.4)', 1.5);
  rr(g, x - 16, y + h + 2, w + 32, 12, 4); ink(g, '#fbf6ec', 2.2);
}
function hallDoor(g, k, t) { // the front door swinging open, seen from inside
  if (k <= 0) return;
  const [dx, dy, dw, dh] = HALL.door, e = E.out(k);
  const sg = g.createLinearGradient(0, dy, 0, dy + dh); sg.addColorStop(0, '#f2b98a'); sg.addColorStop(1, '#fbe2c0'); g.fillStyle = sg; g.fillRect(dx, dy, dw, dh);
  g.save(); g.beginPath(); g.rect(dx, dy, dw, dh); g.clip(); g.fillStyle = '#6f9a52'; g.fillRect(dx, dy + dh - 90, dw, 90); drawSUV(g, dx + 110, dy + dh - 40, .4, { t }); drawSnow(g, dx, dy, dw, dh, t, 10, .7); g.restore();
  const pw = dw * (1 - .82 * e);
  g.beginPath(); g.moveTo(dx, dy); g.lineTo(dx + pw, dy + 18 * e); g.lineTo(dx + pw, dy + dh - 10 * e); g.lineTo(dx, dy + dh); g.closePath(); ink(g, '#b8463a');
}
function welcomeBunting(g, k, t) {
  if (k <= 0) return; const kk = E.back(k);
  g.save(); g.translate(560, 110); g.scale(kk, kk);
  g.beginPath(); g.moveTo(-250, -10); g.quadraticCurveTo(0, 40, 250, -10); strokeP(g, '#8a6a5a', 3);
  'WELCOME HOME!'.split('').forEach((ch, i, a) => { const u = i / (a.length - 1), x = lerp(-240, 240, u), y = -10 + Math.sin(u * Math.PI) * 25 + 4; if (ch === ' ') return; g.save(); g.translate(x, y); g.rotate(Math.sin(t * 3 + i) * .08); g.beginPath(); g.moveTo(-18, 0); g.lineTo(18, 0); g.lineTo(0, 46); g.closePath(); ink(g, ['#e2443b', '#2f9a5e', '#f2b83a'][i % 3], 2.4); text(g, ch, 0, 14, { size: 19, color: '#fff', weight: 700 }); g.restore(); });
  g.restore();
}
const ARR_W = 2300;
SCENES.arrive = {
  enter() {
    audio.music('day');
    this.done = false; this.sim = null; this.phase = 'out'; this.it = 0; this.flags = {}; this.says = [];
    this.cam = { z: 1, x: 620, y: 450 }; this.camT = { z: 1, x: 620, y: 450 };
    this.car = { x: -300, y: 862, s: .98, rot: 0, wave: 0 }; this.m = { st: 'watch', k: 0 };
    this.door = 0; this.bunting = 0; this.fadeK = 0; this.cuddled = false; this.wait = 0;
  },
  initInside() {
    const self = this;
    this.phase = 'in'; this.it = 0; this.fadeK = 1;
    spawnXf = (x, y) => self.sim ? self.sim.toScreen(x, y) : { x, y };
    this.sim = new Sim({
      RW: ARR_W, cam: 1150,
      sam: { x: 150, s: .68, visible: false, carry: true },
      mona: { x: 2210, s: VW.f + .004, h: 158, pose: 'sit', st: 'intro', face: 1, sc: 1.1 },
      samIdle: dt => true, monaAI: dt => true,
      overlay: () => { }
    });
    this.segs = [
      { key: 'd-hall-evening', x0: 0, w: HALL.w, draw: g => drawHall(g, 'evening'), live: g => { hallLive(g, this.t, 'evening'); hallDoor(g, this.door, this.t); welcomeBunting(g, this.bunting, this.t); } },
      { key: 'd-liv-evening', x0: 900, w: LIV.w, draw: g => drawLiving(g, 'evening'), live: g => livingLive(g, this.t, 'evening') }
    ];
  },
  sayS(msg, x, y, dur) { this.says = [{ msg, x, y, t0: this.t, dur: dur || 2.6 }]; },
  finish() { if (this.done) return; this.done = true; markDone('arrive'); if (inStory()) storyNext(); else go('groc'); },
  update(dt) {
    // v3: a quick ~15 second interlude. Story time runs fast, then holds for one tap: the cuddle.
    const spd = this.phase === 'out' ? 2.1 : 1.8, rdt = dt; dt *= spd;
    if (this.phase === 'in' && this.it > 9.4 && !this.cuddled) { this.wait = (this.wait || 0) + rdt; if (this.wait > 5) this.cuddle(); dt = 0; }
    this.it += dt; const it = this.it, once = (k, fn) => { if (!this.flags[k]) { this.flags[k] = 1; fn(); } };
    if (this.phase === 'out') {
      const C = this.camT, car = this.car;
      if (it < 3) Object.assign(C, { z: 1.32, x: 800, y: 460 });
      else if (it < 7.6) Object.assign(C, { z: 1.04, x: clamp(car.x + 120, 560, 700), y: 520 });
      else if (it < 11) Object.assign(C, { z: 2.7, x: car.x + 24 * car.s, y: car.y - 128 * car.s });
      else if (it < 14.4) Object.assign(C, { z: 2.5, x: 812, y: 445 });
      const ek = 1 - Math.exp(-dt * (it > 7.6 && it < 8.4 ? 3.2 : 2.2)); for (const k of ['z', 'x', 'y']) this.cam[k] = lerp(this.cam[k], C[k], ek);
      { const hw = W / 2 / this.cam.z, hh = H / 2 / this.cam.z; this.cam.x = clamp(this.cam.x, hw, W - hw); this.cam.y = clamp(this.cam.y, hh, H - hh); }
      if (it > 2.6) once('car', () => audio.sfx('car'));
      if (it > 2.8 && it < 6.4) { const k = E.out((it - 2.8) / 3.6); car.x = lerp(-300, 1030, k); car.rot -= dt * 9 * (1 - k + .1); }
      if (it >= 6.4 && it < 7.8) { const k = E.inOut((it - 6.4) / 1.4); car.x = lerp(1030, 1070, k); car.y = lerp(862, 716, k); car.s = lerp(.98, .8, k); car.rot -= dt * 2 * (1 - k); }
      if (it > 7.8) once('brake', () => { car.brake = true; audio.sfx('door'); });
      if (it > 8.4) { car.wave = 1; once('hi', () => { this.sayS('Hi Mona! I\'m home!', 0, 0, 2.6); audio.sfx('heart'); }); }
      if (it > 11.2) once('perk', () => { this.m.st = 'perk'; audio.sfx('meow', 1); spawn('pop', W / 2, 300, 1, { label: '!', vx: 0, vy: -40, col: '#e2443b', size: 90, max: 1.2 }); });
      if (it > 12.2) once('mrrow', () => { this.m.st = 'swat'; audio.sfx('meow', 1.6); this.sayS('MRROW!! She\'s HOME!', 0, 0, 2); });
      if (it > 13.5) once('leap', () => { this.m.st = 'leap'; this.m.k = 0; audio.sfx('whoosh'); });
      if (this.m.st === 'leap') this.m.k += dt / .6;
      if (it > 14.3) this.fadeK = Math.min(1, (it - 14.3) / .35);
      if (it > 14.65) this.initInside();
      return;
    }
    // inside
    this.fadeK = Math.max(0, this.fadeK - dt * 2.5);
    const sim = this.sim, M = sim.M, S = sim.S;
    if (it > .5) once('turn', () => { M.face = -1; M.pose = 'alert'; audio.sfx('meow', 1.2); });
    if (it > 1.1) once('jump', () => { sim.jumpMona(2040, .84, 0, 'introRun', .6); });
    if (it > 1.75 && it < 5) { M.st = 'introRun'; sim.moveM(430, .8, 640, dt); if (Math.random() < dt * 20) { const p = sim.monaP(); spawn('dust', p.x + 30, p.y - 6, 1); } }
    if (it >= 5 && it < 8.4) { M.face = -1; M.pose = 'celebrate'; once('bugle', () => { audio.sfx('bugle'); const p = sim.monaP(); sim.zoomTo(1.55, p.x + 60, p.y - 120, 99); sim.z.hold = 99; spawn('confetti', p.x, p.y - 170, 70); sim.say('mona', 'TOOT TOOT!', 1.4); }); this.bunting = Math.min(1, this.bunting + dt * 2.4); if (Math.random() < dt * 3) { const p = sim.monaP(); spawn('note', p.x - 30, p.y - 130); } }
    if (it > 7.2) { once('door', () => audio.sfx('door')); this.door = Math.min(1, this.door + dt * 2); }
    if (it > 7.6) { S.visible = true; S.carry = true; if (it < 8.6) { S.x = 165 + (it - 7.6) * 140; S.s = lerp(.68, .8, (it - 7.6)); S.pose = 'carry'; S.face = 1; } else { S.pose = 'carry'; S.face = 1; } }
    if (it > 8.4 && it < 12.6) { M.st = 'rub'; const ph = (it - 8.4) * 2.6; M.x = S.x + 70 + Math.sin(ph) * 70; M.s = S.s + .02 + Math.cos(ph) * .05; M.face = Math.cos(ph) > 0 ? -1 : 1; M.pose = 'rub'; }
    if (it > 8.8) once('hi', () => { const q = sim.samP(); sim.z.hold = 0; sim.zoomTo(1.6, q.x + 70, q.y - 150, 99); sim.z.hold = 99; sim.say('sam', 'Hi Mona! Did you miss me?', 2.2); S.expr = 'love'; const sp = sim.samP(); spawn('heart', sp.x, sp.y - 250 * S.s, 6); audio.purrStart(); });

    if (it > 11.8) once('shop', () => { sim.say('sam', 'Right. Let\'s put this shopping away!', 2); S.expr = 'laugh'; audio.purrStop(); });
    if (it > 12.6) { M.pose = 'sit'; M.face = -1; }
    if (it > 13.4) this.finish();
    const target = it < 1.75 ? 1150 : it < 5 ? M.x - 520 : 0;
    sim.cam = lerp(sim.cam, clamp(target, 0, ARR_W - W), 1 - Math.exp(-dt * 3));
    sim.update(dt || rdt * .25);
  },
  cuddle() { if (this.cuddled || !this.sim) return; this.cuddled = true; const sim = this.sim, q = sim.samP(); spawn('heart', q.x + 40, q.y - 200 * sim.S.s, 14); audio.sfx('heart'); audio.sfx('meow', 1.5); sim.say('mona', 'Purrrrrr...', 1.6); addPts(100, q.x + 40, q.y - 260 * sim.S.s, 'Cuddle!'); },
  tap(x, y) {
    if (this.phase === 'out') { spawn('heart', x, y - 20, 3); audio.sfx('heart'); return; }
    if (this.it > 8.6 && !this.cuddled) { this.cuddle(); return; }
    const sim = this.sim, p = sim.inv(x, y); if (sim.onMona(p.x, p.y)) { spawn('heart', x, y - 40, 5); audio.sfx('meow', 1); }
  },
  draw() {
    const t = this.t;
    if (this.phase === 'out') {
      const C = this.cam;
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(C.z, C.z); ctx.translate(-C.x, -C.y);
      ctx.drawImage(cached('house-front', W, H, g => drawHouseFront(g)), 0, 0, W, H);
      glowAt(ctx, 1080, 430, 340, '255,200,140', .35);
      drawPictureWindow(ctx, t, g => {
        const m = this.m; let mx = 772, my = 512, pose = 'sit', eyes, face = 1, look = { x: .6, y: .2 };
        if (m.st === 'watch') { look = { x: Math.sin(t * .7) * .8, y: .3 }; if (Math.sin(t * 1.7) > .97) eyes = 'closed'; }
        if (m.st === 'perk') { pose = 'alert'; eyes = 'wide'; look = { x: 1, y: .5 }; }
        if (m.st === 'swat') { pose = 'swat'; eyes = 'wide'; look = { x: 1, y: .4 }; }
        if (m.st === 'leap') { const k = Math.min(1, m.k); pose = 'pounce'; face = -1; mx = lerp(772, 730, k); my = lerp(512, 600, k) - Math.sin(k * Math.PI) * 40; }
        drawMona(g, mx, my, .58, { pose, face, t, eyes, look, outfit: curOutfit(), earsUp: m.st !== 'watch', mouth: m.st === 'swat' ? 'meow' : undefined, swatK: Math.abs(Math.sin(t * 7)), noShadow: true });
      });
      houseLights(ctx, t, 1);
      const car = this.car;
      drawSUV(ctx, car.x, car.y, car.s, { t, wheelRot: car.rot, brake: car.brake, lights: true, inside: g => {
        drawSamHead(g, 26, -122, .36, { t, expr: car.wave ? 'laugh' : 'smile', look: .6 });
        if (car.wave) { const wv = Math.sin(t * 10) * 8; handO(g, 60 + wv * .3, -138 + Math.abs(wv) * .2, 7); }
      } });
      drawSnow(ctx, 0, 0, W, H, t, 40, 1);
      ctx.restore();
      // a warm golden-hour grade
      ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(255,170,90,.35)'; ctx.fillRect(0, 0, W, H); ctx.restore();
      this.says = this.says.filter(s => t - s.t0 < s.dur);
      for (const s of this.says) speech(ctx, s.msg, W / 2 + 120, 300, s.t0, t, 360);
      const cap = this.it < 2.8 ? 'Not a whisker out of place. Mona keeps watch...' : this.it < 8 ? 'Here she comes!' : null;
      if (cap) hintPill(cap, 862);
      skipBtn(() => this.finish());
      if (this.fadeK > 0) { ctx.fillStyle = 'rgba(43,29,26,' + this.fadeK + ')'; ctx.fillRect(0, 0, W, H); }
      return;
    }
    const sim = this.sim, cam = sim.cam;
    sim.draw(() => {
      drawDiorama(ctx, this.segs, cam, ARR_W, { floor: '#c56f40', wallL: '#c0c8f3', wallR: '#f3e5d2', ceil: '#fbf3e6', tod: 'evening' });
      drawMat(ctx, 165, .7, 190, 'WELCOME', '#7d6247', cam);
      drawRug(ctx, 900 + 710, .8, cam);
    }, [], t);
    // golden evening light pass
    const Z = (x, y) => sim.toScreen(x, y);
    const win = Z(backPt(900 + 1300, 260, cam).x, backPt(900 + 1300, 260, cam).y), fire = Z(backPt(900 + 710, 420, cam).x, backPt(900 + 710, 420, cam).y), dr = Z(backPt(165, 400, cam).x, backPt(165, 400, cam).y);
    lightMap('34,16,46,.42', [{ x: win.x, y: win.y + 80, r: 520, a: .9, col: '255,190,120', ca: .2 }, { x: fire.x, y: fire.y, r: 360, a: .8, col: '255,160,80', ca: .18 }, { x: dr.x, y: dr.y + 60, r: 120 + 380 * this.door, a: this.door, col: '255,220,170', ca: .25 }, { x: W * .35, y: H * .62, r: 520, a: .45 }]);
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(255,170,100,.28)'; ctx.fillRect(0, 0, W, H); ctx.restore();
    drawGrain(.04);
    if (this.it > 9.4 && !this.cuddled) { const k = .5 + .5 * Math.sin(t * 6); ctx.save(); ctx.translate(W / 2, H - 120); ctx.rotate(-.03); ctx.scale(1 + k * .04, 1 + k * .04); rr(ctx, -200, -36, 400, 72, 36); fillP(ctx, 'rgba(255,250,240,.96)'); drawHeart(ctx, -160, 2, 1.3, '#e2443b'); text(ctx, 'Tap for a cuddle!', 14, 1, { size: 28, color: '#c8453b', weight: 700 }); ctx.restore(); }
    skipBtn(() => this.finish());
    if (this.fadeK > 0) { ctx.fillStyle = 'rgba(43,29,26,' + this.fadeK + ')'; ctx.fillRect(0, 0, W, H); }
  },
  toastHow: true
};
