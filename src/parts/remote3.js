/* ============ v7: THE TV REMOTE, realistic channel changing ============
   Like a real Apple TV: when Mona's paws open Catwatch, you
     1. press TV (or Back) to go to the Home screen,
     2. press the clickpad ring left / right to move the highlight to EastEnders,
     3. click the centre of the clickpad to open it.
   Clicking the wrong tile opens that app (Photos, Music, Films...) and you have to go Home again.
   On a phone the remote is big, upright and pointing at the TV, with the three steps beside it. */
const TV_APPS = [
  { id: 'soap', name: 'EastEnders', bg: '#7a1f2b' },
  { id: 'cat', name: 'Catwatch', bg: '#f08a3c' },
  { id: 'photos', name: 'Photos', bg: '#f4f1ea' },
  { id: 'music', name: 'Music', bg: '#e8455a' },
  { id: 'films', name: 'Films', bg: '#25262c' }
];
// clickpad ring zones (remote-local coordinates)
Object.assign(ATV_BTNS, { left: [-50, -170, 20], right: [50, -170, 20], down: [0, -122, 20], up: [0, -218, 20] });
function tvTileArt(g, id, w, h) {
  g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
  if (id === 'soap') { g.fillStyle = '#f2c14e'; g.beginPath(); g.moveTo(-w * .14, h * .14); g.quadraticCurveTo(-w * .14, -h * .3, 0, -h * .3); g.quadraticCurveTo(w * .14, -h * .3, w * .14, h * .14); g.closePath(); g.fill(); g.beginPath(); g.arc(0, h * .2, h * .08, 0, TAU); g.fill(); }
  else if (id === 'cat') { g.fillStyle = '#fff'; g.beginPath(); g.arc(0, h * .04, h * .24, 0, TAU); g.moveTo(-h * .22, -h * .06); g.lineTo(-h * .2, -h * .34); g.lineTo(-h * .04, -h * .18); g.moveTo(h * .22, -h * .06); g.lineTo(h * .2, -h * .34); g.lineTo(h * .04, -h * .18); g.fill(); }
  else if (id === 'photos') { ['#f2a33a', '#e8455a', '#9b5de5', '#3fa7d6', '#5fae55', '#f2d03a'].forEach((c, i) => { const a = i / 6 * TAU; g.globalAlpha = .85; g.beginPath(); g.ellipse(Math.cos(a) * h * .14, Math.sin(a) * h * .14, h * .14, h * .07, a, 0, TAU); g.fillStyle = c; g.fill(); }); g.globalAlpha = 1; }
  else if (id === 'music') { g.fillStyle = '#fff'; g.strokeStyle = '#fff'; g.lineWidth = h * .05; g.beginPath(); g.moveTo(-h * .06, h * .18); g.lineTo(-h * .06, -h * .26); g.lineTo(h * .2, -h * .3); g.lineTo(h * .2, h * .12); g.stroke(); g.beginPath(); g.arc(-h * .13, h * .18, h * .08, 0, TAU); g.arc(h * .13, h * .12, h * .08, 0, TAU); g.fill(); }
  else if (id === 'films') { g.fillStyle = '#fff'; g.fillRect(-w * .2, -h * .08, w * .4, h * .3); g.save(); g.translate(-w * .2, -h * .1); g.rotate(-.25); g.fillRect(0, -h * .1, w * .4, h * .1); g.restore(); g.fillStyle = '#25262c'; for (let i = 0; i < 4; i++) g.fillRect(-w * .16 + i * w * .1, -h * .02, w * .05, h * .1); }
  g.restore();
}
/* the tvOS-style Home screen: a row of app tiles, the focused one lifted with a white edge */
function tvHome(g, x, y, w, h, t, focus) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.fillStyle = '#1c2340'; g.fillRect(x, y, w, h); g.fillStyle = '#28305a'; g.fillRect(x, y, w, h * .45);
  text(g, 'Home', x + 14, y + 16, { size: 11, color: '#fff', weight: 800, align: 'left' }); text(g, '9:41', x + w - 14, y + 16, { size: 10, color: 'rgba(255,255,255,.75)', weight: 700, align: 'right' });
  const n = TV_APPS.length, tw = w * .155, th = tw * .62, gap = w * .03, x0 = x + (w - (n * tw + (n - 1) * gap)) / 2, ty = y + h * .5;
  TV_APPS.forEach((a, i) => {
    const f = i === focus, sc = f ? 1.18 + .02 * Math.sin(t * 4) : 1, cx = x0 + i * (tw + gap) + tw / 2;
    g.save(); g.translate(cx, ty - (f ? 4 : 0)); g.scale(sc, sc);
    if (f) { g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 10; g.shadowOffsetY = 5; }
    g.beginPath(); g.roundRect(-tw / 2, -th / 2, tw, th, 5); g.fillStyle = a.bg; g.fill(); g.shadowColor = 'transparent';
    tvTileArt(g, a.id, tw, th);
    if (f) { g.lineWidth = 2.5; g.strokeStyle = '#fff'; g.stroke(); }
    g.restore();
    if (f) text(g, a.name, cx, ty + th * .5 + 16, { size: 10.5, color: '#fff', weight: 800 });
  });
  text(g, 'Up Next', x + 14, y + h * .84, { size: 9, color: 'rgba(255,255,255,.55)', weight: 800, align: 'left' });
  for (let i = 0; i < 4; i++) { g.fillStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.roundRect(x + 14 + i * (w * .23), y + h * .88, w * .2, h * .2, 4); g.fill(); }
  g.restore();
}
/* the wrong apps, opened by mistake */
function tvApp(g, x, y, w, h, t, id) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  if (id === 'photos') {
    g.fillStyle = '#f4f1ea'; g.fillRect(x, y, w, h); text(g, 'Photos', x + 14, y + 16, { size: 12, color: '#222', weight: 800, align: 'left' });
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) { const px = x + 14 + c * (w - 28) / 4, py = y + 32 + r * (h - 42) / 2; g.fillStyle = ['#cfe3f2', '#f6d6c8', '#e2efd2', '#efe0f4'][(r + c) % 4]; g.fillRect(px + 2, py + 2, (w - 28) / 4 - 4, (h - 42) / 2 - 4); }
    drawMona(g, x + 14 + (w - 28) / 8, y + 32 + (h - 42) / 2 - 8, .26, { pose: 'sit', t, eyes: 'happy', noShadow: true, outfit: curOutfit() });
  } else if (id === 'music') {
    g.fillStyle = '#e8455a'; g.fillRect(x, y, w, h); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x, y + h * .6, w, h * .4);
    for (let i = 0; i < 18; i++) { const bh = (Math.sin(t * 6 + i * 1.3) * .5 + .6) * h * .35; g.fillStyle = '#fff'; g.fillRect(x + 20 + i * (w - 40) / 18, y + h * .55 - bh, (w - 40) / 18 - 4, bh); }
    text(g, 'Jingle Bell Meow', x + w / 2, y + h * .76, { size: 14, color: '#fff', weight: 800 });
  } else {
    g.fillStyle = '#111'; g.fillRect(x, y, w, h); g.strokeStyle = '#fff'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.arc(x + w / 2, y + h / 2 - 8, 16, t * 6, t * 6 + 4.5); g.stroke();
    text(g, 'Loading Films...', x + w / 2, y + h / 2 + 26, { size: 12, color: '#fff', weight: 700 });
  }
  g.globalAlpha = .07; g.fillStyle = '#000'; for (let yy = y; yy < y + h; yy += 3) g.fillRect(x, yy, w, 1); g.globalAlpha = 1;
  g.restore();
}
Object.assign(SCENES.remote, {
  drawTV(g, x, y, w, h, t) {
    if (this.tv === 'soap') soapTV(g, x, y, w, h, t, 0);
    else if (this.tv === 'cat') catwatchTV(g, x, y, w, h, t);
    else if (this.tv === 'home') tvHome(g, x, y, w, h, t, this.focus || 0);
    else tvApp(g, x, y, w, h, t, this.tv);
  },
  flipTo(ch) {
    if (this.tv === ch) return; const was = this.tv; this.tv = ch; this.flipT = this.t; audio.sfx('blip');
    if (ch === 'cat' && was === 'soap' && !this.ending) { audio.sfx('scratch'); this.zapT = 0; this.miss = 0; this.focus = 2 + Math.floor(Math.random() * 3); this.seq = true; }
    if (ch === 'soap') this.seq = null;
  },
  /* what the player should press next (for the glowing hint and the hand) */
  nextBtn() {
    if (this.tv === 'soap' || this.finished || this.ending) return null;
    if (this.tv !== 'home') return 'tv';
    return this.focus > 0 ? 'left' : 'select';
  },
  pressBtn(id) {
    this.press = { id, t: 0 }; audio.sfx('tick');
    if (this.tv === 'soap' || this.finished) return;
    const beam = () => { this.beam = { t: 0, ok: true }; };
    if (this.tv !== 'home') {
      if (id === 'tv' || id === 'back') { beam(); this.flipTo('home'); if (this.focus == null) this.focus = 1; return; }
      if (id === 'mute' || id === 'play') { beam(); this.say('sam', id === 'mute' ? 'Muting it won\'t help!' : 'Paused... still Catwatch.', 1.2); return; }
      this.miss++; this.say('sam', 'Go Home first: the TV button.', 1.4); audio.sfx('blip2'); return;
    }
    // on the Home screen
    if (id === 'left' || id === 'right') { beam(); const f0 = this.focus; this.focus = clamp(this.focus + (id === 'left' ? -1 : 1), 0, TV_APPS.length - 1); if (f0 === this.focus) shake(.12); return; }
    if (id === 'up' || id === 'down') { beam(); shake(.1); return; }
    if (id === 'back' || id === 'tv') { beam(); return; }
    if (id === 'select') {
      beam(); const app = TV_APPS[this.focus];
      if (app.id === 'soap') {
        this.zaps++; const fast = Math.max(0, 7 - this.zapT), perfect = this.miss === 0;
        this.flipTo('soap'); audio.sfx('chime'); this.flash = { t: 0 };
        const q = this.wp(980, 330); addPts(150 + Math.round(fast * 30), q.x, q.y, fast > 4 ? 'Lightning fast!' : 'Back on!', true);
        if (perfect) { this.perfects++; addPts(100, q.x, q.y - 70, 'Perfect', true); }
        this.say('sam', pick(['Phew. What did I miss?', 'Back to EastEnders.', 'Right. Where was I?']), 2);
        if (this.m.st === 'watch') { this.m.st = 'wait'; this.m.bedT = .9; }
      } else { this.miss++; this.flipTo(app.id); audio.sfx('blip2'); this.say('sam', app.id === 'cat' ? 'Not Catwatch again!' : 'Oops, that\'s ' + app.name + '!', 1.4); }
    }
  },
  /* tap handling: the clickpad has a centre click and a ring with four directions */
  down(X, Y) {
    if (this.finished) return;
    if (this.rem.k > .7 && this.remXf) {
      const P0 = PORT ? screenPt() : { x: X, y: Y }, r = this.remXf, rot = r.rot, dx = P0.x - r.x, dy = P0.y - r.y, lx = (dx * Math.cos(-rot) - dy * Math.sin(-rot)) / r.s, ly = (dx * Math.sin(-rot) + dy * Math.cos(-rot)) / r.s;
      if (Math.abs(lx) < 100 && ly > -300 && ly < 300) {
        const cd = dist(lx, ly, 0, -170);
        if (cd < 76) { if (cd < 36) this.pressBtn('select'); else { const a = Math.atan2(ly + 170, lx); this.pressBtn(Math.abs(a) < Math.PI / 4 ? 'right' : Math.abs(a) > Math.PI * .75 ? 'left' : a > 0 ? 'down' : 'up'); } return; }
        let best = null; for (const id of ['back', 'tv', 'play', 'mute']) { const [bx, by, r0] = ATV_BTNS[id]; const d = dist(lx, ly, bx, by); if (d < r0 + 18 && (!best || d < best.d)) best = { id, d }; }
        if (best) this.pressBtn(best.id); return;
      }
    }
    const w = this.sw(X, Y), m = this.m;
    const onBed = dist(w.x, w.y, SOFA.bed[0], SOFA.bed[1] - 10) < 100, onMona = dist(w.x, w.y, m.x, m.y - 50) < 90;
    if ((onBed || onMona) && (m.st === 'creep' || (m.st === 'hop' && m.path && m.path.x === RM2.perch))) { if (this.ending) { this.say('sam', 'She\'s too sleepy to listen...', 1.4); return; } m.path = null; this.block(); return; }
    if (onBed && m.st === 'watch') { this.say('sam', 'Fix the telly first!', 1.2); return; }
    if (onMona) { spawn('heart', X, Y - 30, 4); audio.sfx('meow', 1); }
  },
  drawRemoteAt(cx, cy, s, aim) {
    const t = this.t, k = this.rem.k, tipY = -270 * s;
    const ang = clamp(Math.atan2(aim.x - cx, cy + tipY - aim.y), -.22, .22), a = REDUCE_MOTION ? ang : lerp(-Math.PI / 2, ang, E.back(k));
    const r = { x: cx, y: cy + (1 - E.out(k)) * 400, s, rot: a }; this.remXf = r;
    const next = this.rem.k > .9 ? this.nextBtn() : null;
    if (this.beam && this.beam.ok) { const tip = { x: r.x + Math.sin(a) * -tipY, y: r.y - Math.cos(a) * -tipY }, bk = 1 - this.beam.t / .35; ctx.save(); ctx.globalAlpha = bk; ctx.strokeStyle = '#ff5a6a'; ctx.lineWidth = 10 * bk + 2; ctx.setLineDash([16, 12]); ctx.lineDashOffset = -this.beam.t * 200; ctx.beginPath(); ctx.moveTo(tip.x, tip.y); ctx.lineTo(aim.x, aim.y); ctx.stroke(); ctx.restore(); circ(ctx, aim.x, aim.y, 26 * bk + 6); ctx.fillStyle = 'rgba(255,90,106,' + bk * .5 + ')'; ctx.fill(); }
    ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(a); ctx.scale(s, s);
    drawATVRemote(ctx, t, null, this.press && ['left', 'right', 'up', 'down'].includes(this.press.id) ? { id: 'select', t: 1 } : this.press, 0);
    // ring direction arrows, so the left/right presses are obvious
    for (const [id, ax, ay, rot] of [['left', -50, -170, Math.PI], ['right', 50, -170, 0], ['up', 0, -218, -Math.PI / 2], ['down', 0, -122, Math.PI / 2]]) {
      const lit = this.press && this.press.id === id && this.press.t < .2; ctx.save(); ctx.translate(ax, ay); ctx.rotate(rot); ctx.beginPath(); ctx.moveTo(-4, -8); ctx.lineTo(5, 0); ctx.lineTo(-4, 8); ctx.strokeStyle = lit ? '#ffd84d' : 'rgba(255,255,255,.55)'; ctx.lineWidth = 3.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
    }
    if (next) {
      const [bx, by, br] = ATV_BTNS[next], p = .5 + .5 * Math.sin(t * 7), tap = Math.max(0, Math.sin(t * 5));
      ctx.save(); ctx.shadowColor = '#ffd84d'; ctx.shadowBlur = 22; circ(ctx, bx, by, (next === 'select' ? 36 : br) + 8 + p * 5); strokeP(ctx, '#ffd84d', 6); ctx.restore();
      drawHand(ctx, bx + 4, by + 6 + (1 - tap) * 22, 1, -.35, tap > .9);
    }
    ctx.restore();
    return r;
  },
  stepsList(x, y, w) {
    const steps = [['tv', 'Press TV', 'Go to the Home screen'], ['left', 'Press ◀ on the ring', 'Move to EastEnders'], ['select', 'Click the centre', 'Open the episode']];
    const cur = this.nextBtn(), ci = cur === 'tv' ? 0 : cur === 'left' ? 1 : cur === 'select' ? 2 : 3;
    steps.forEach(([g, h1, h2], i) => {
      const yy = y + i * 92, done = i < ci, on = i === ci;
      rr(ctx, x, yy, w, 82, 18); ctx.fillStyle = on ? '#fff' : done ? 'rgba(95,174,85,.35)' : 'rgba(0,0,0,.22)'; ctx.fill();
      if (on) { ctx.lineWidth = 4; ctx.strokeStyle = '#ffd84d'; ctx.stroke(); }
      circ(ctx, x + 42, yy + 41, 26); ctx.fillStyle = done ? TP.green : '#26272b'; ctx.fill();
      ctx.save(); ctx.translate(x + 42, yy + 41);
      if (done) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-10, 1); ctx.lineTo(-3, 8); ctx.lineTo(11, -7); ctx.stroke(); }
      else if (g === 'left') { ctx.strokeStyle = '#fff'; ctx.lineWidth = 4.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(5, -10); ctx.lineTo(-6, 0); ctx.lineTo(5, 10); ctx.stroke(); }
      else rmGlyph(ctx, g, 19, '#fff');
      ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(x + 76, yy, w - 84, 82); ctx.clip();
      text(ctx, h1, x + 80, yy + 30, { size: 25, align: 'left', color: on ? TP.crim : '#fff', weight: 900 });
      text(ctx, i === 1 && on ? 'Move to EastEnders (' + this.focus + ' more)' : h2, x + 80, yy + 58, { size: 18, align: 'left', color: on ? '#7a4a4f' : 'rgba(255,255,255,.8)', weight: 700 });
      ctx.restore();
    });
  },
  statusText() {
    const m = this.m;
    if (this.finished) return ['That\'s the episode!', 'Mona fell asleep on the remote.'];
    if (this.ending) return ['The End!', 'Mona is getting very sleepy...'];
    if (this.tv === 'cat') return ['Mona changed the channel!', 'Get back to EastEnders.'];
    if (this.tv === 'home') return ['Home screen', this.focus > 0 ? 'Move left to EastEnders.' : 'Click to open it!'];
    if (this.tv !== 'soap') return ['Oops, wrong app!', 'Press TV to go Home again.'];
    if (m.st === 'creep' || m.st === 'hop' && m.path && m.path.x === RM2.perch) return [m.prog > .72 ? 'NOW! Tap her bed!' : 'Mona\'s on the move!', 'Later taps score more.'];
    if (m.st === 'tobed') return ['Back to bed, Mona', 'Keep the episode playing.'];
    return ['EastEnders is on', 'Tap Mona\'s bed to call her back.'];
  },
  hudP() {
    const A = this._pm[0]; if (!A || !DOCK) return;
    const tvC = A.M.transformPoint(new DOMPoint(this.wp(260, 278).x, this.wp(260, 278).y));
    // episode bar along the top of the TV panel
    const bx = 28, bw = PW - 56, by = A.y + 12;
    rr(ctx, bx, by, bw, 30, 15); ctx.fillStyle = 'rgba(20,10,14,.78)'; ctx.fill();
    rr(ctx, bx + 4, by + 4, Math.max(22, (bw - 8) * this.ep), 22, 11); ctx.fillStyle = this.tv !== 'soap' ? '#8a8a8a' : '#f2c14e'; ctx.fill();
    text(ctx, (this.tv !== 'soap' ? 'EPISODE PAUSED  ' : 'EPISODE  ') + Math.round(this.ep * 100) + '%', bx + bw / 2, by + 16, { size: 17, color: '#fff', weight: 800 });
    // status bar with the score tucked on the right
    const sy = DOCK.y0 + 30, [h1, h2] = this.statusText(), hot = this.tv !== 'soap' || (this.m.prog > .72 && this.m.st === 'creep');
    rr(ctx, 20, sy, PW - 40, 96, 20); ctx.fillStyle = hot ? TP.red : TP.pink; ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.rect(20, sy, PW - 210, 96); ctx.clip();
    text(ctx, h1, 40, sy + 36, { size: 32, align: 'left', color: hot ? '#fff' : TP.crim, weight: 900 });
    text(ctx, h2, 40, sy + 72, { size: 20, align: 'left', color: hot ? '#ffe3e3' : '#7a4a4f', weight: 700 });
    ctx.restore();
    const mult = Math.min(4, 1 + Math.floor(GAME.combo / 2));
    rr(ctx, PW - 180, sy + 12, 146, 72, 16); ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fill();
    text(ctx, 'SCORE' + (mult > 1 ? '  ×' + mult : ''), PW - 107, sy + 30, { size: 14, color: TP.crim, weight: 800 }); text(ctx, String(GAME.pts), PW - 107, sy + 62, { size: 32, color: TP.crim, display: true });
    // the remote: big and upright, pointing at the TV
    const y0 = sy + 112, avH = PH - SAFE_B - y0, s = clamp((avH - 14) / 300, .7, 1.55), rx = PW - 36 - 80 * s;
    const cw = rx - 92 * s - 34, cx = 20;
    if (this.tv !== 'soap' && !this.ending && !this.finished) this.stepsList(cx, y0 + 6, cw);
    else {
      // Mona's progress towards the remote
      const yy = y0 + 6, mp = this.m.st === 'creep' ? this.m.prog : 0, mw = cw - 50;
      rr(ctx, cx, yy, cw, 150, 20); ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.fill();
      text(ctx, 'MONA → REMOTE', cx + cw / 2, yy + 32, { size: 19, color: '#fff', weight: 800 });
      rr(ctx, cx + 25, yy + 62, mw, 30, 15); ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fill();
      ctx.fillStyle = TP.green; ctx.fillRect(cx + 25 + mw * .4, yy + 62, 3, 30); ctx.fillStyle = '#ffd84d'; ctx.fillRect(cx + 25 + mw * .72, yy + 62, 3, 30);
      if (mp > 0) { rr(ctx, cx + 25, yy + 62, Math.max(30, mw * mp), 30, 15); ctx.fillStyle = mp > .72 ? '#ff5a5a' : mp > .4 ? '#ffb04d' : '#8cc152'; ctx.fill(); }
      drawPaw(ctx, cx + 25 + Math.max(15, mw * mp - 15), yy + 77, .55, '#fff');
      text(ctx, '50', cx + 25 + mw * .2, yy + 112, { size: 16, color: 'rgba(255,255,255,.75)', weight: 800 }); text(ctx, '100', cx + 25 + mw * .56, yy + 112, { size: 16, color: 'rgba(255,255,255,.75)', weight: 800 }); text(ctx, '200', cx + 25 + mw * .86, yy + 112, { size: 16, color: '#ffd84d', weight: 800 });
      text(ctx, 'Tap her bed late for more points', cx + cw / 2, yy + 138, { size: 15, color: 'rgba(255,255,255,.7)', weight: 700 });
    }
    this.drawRemoteAt(rx, y0 + 270 * s + 4, s, tvC);
  },
  hudL() {
    const tvC = this.wp(260, 278); this.drawRemoteAt(1120, 640, .8, tvC);
    const [h1, h2] = this.statusText(), hot = this.tv !== 'soap' || (this.m.prog > .72 && this.m.st === 'creep');
    rr(ctx, 470, 96, 520, 96, 20); ctx.fillStyle = hot ? TP.red : TP.pink; ctx.fill();
    text(ctx, h1, 490, 130, { size: 30, align: 'left', color: hot ? '#fff' : TP.crim, weight: 900 }); text(ctx, h2, 490, 166, { size: 19, align: 'left', color: hot ? '#ffe3e3' : '#7a4a4f', weight: 700 });
    const tl = this.wp(98, 380); rr(ctx, tl.x, tl.y + 8, 324, 24, 12); ctx.fillStyle = 'rgba(20,10,14,.72)'; ctx.fill(); rr(ctx, tl.x + 3, tl.y + 11, Math.max(18, 318 * this.ep), 18, 9); ctx.fillStyle = this.tv !== 'soap' ? '#8a8a8a' : '#f2c14e'; ctx.fill(); text(ctx, 'EPISODE ' + Math.round(this.ep * 100) + '%', tl.x + 162, tl.y + 20, { size: 14, color: '#fff', weight: 800 });
    if (this.tv !== 'soap' && !this.ending && !this.finished) this.stepsList(470, 210, 420);
    rr(ctx, 1010, 96, 200, 96, 20); ctx.fillStyle = TP.pink; ctx.fill(); text(ctx, 'SCORE', 1110, 120, { size: 15, color: TP.crim, weight: 800 }); text(ctx, String(GAME.pts), 1110, 158, { size: 36, color: TP.crim, display: true });
  }
});
HOWTO.remote = { icon: 'bed', line: 'Keep EastEnders on! Tap Mona\'s bed to call her back. If she changes the channel, use the remote: TV for Home, ◀ to EastEnders, click to watch.' };
