/* ============ v3 FINALE: the present, the card, and the secret footage ============
   A wrapped present drops in and wriggles; the lid flies off; we look down into the box; the card rises out.
   The card is plain and simple. Inside: CCTV stills of the secret rave, and the message. */
const CARD_MSG = ["Here's to another year.", 'Love you lots,', 'George and Mona'];
/* ---- the four CCTV stills (drawn once, cached) ---- */
function cctvFrame(g, w, h, cam, stamp, scene) {
  g.fillStyle = '#0c0a12'; g.fillRect(0, 0, w, h);
  g.save(); scene(g, w, h); g.restore();
  // grade it like an old security camera: drained colour, green cast, scanlines, grain, vignette
  g.save(); g.globalCompositeOperation = 'saturation'; g.fillStyle = 'rgba(128,128,128,.75)'; g.fillRect(0, 0, w, h); g.restore();
  g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = '#b8d8b0'; g.fillRect(0, 0, w, h); g.restore();
  g.fillStyle = 'rgba(0,0,0,.18)'; for (let y = 0; y < h; y += 3) g.fillRect(0, y, w, 1);
  for (let i = 0; i < 700; i++) { g.fillStyle = Math.random() > .5 ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.1)'; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
  const vg = g.createRadialGradient(w / 2, h / 2, h * .3, w / 2, h / 2, w * .7); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); g.fillStyle = vg; g.fillRect(0, 0, w, h);
  const mono = (s, x, y, al) => { g.font = '700 15px "Courier New", monospace'; g.textAlign = al || 'left'; g.textBaseline = 'middle'; g.fillStyle = 'rgba(0,0,0,.6)'; g.fillText(s, x + 1, y + 1); g.fillStyle = '#f2f6ee'; g.fillText(s, x, y); };
  mono(cam, 12, 18); mono(stamp, w - 12, h - 16, 'right');
  circ(g, w - 52, 18, 6); fillP(g, '#ff3030'); mono('REC', w - 12, 18, 'right');
  g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 2; for (const [x, y, dx, dy] of [[8, 34, 1, 1], [w - 8, 34, -1, 1], [8, h - 30, 1, -1], [w - 8, h - 30, -1, -1]]) { g.beginPath(); g.moveTo(x, y + dy * 16); g.lineTo(x, y); g.lineTo(x + dx * 16, y); g.stroke(); }
}
const CCTV_STILLS = [
  { cam: 'CAM 1  LOUNGE', stamp: '24-12  23:14:07', draw: (g, w, h) => {
    g.fillStyle = '#1a1030'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 4; i++) { g.save(); g.translate(60 + i * 95, 0); g.rotate(-.3 + i * .2); const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(-5, 0); g.lineTo(-60, h); g.lineTo(60, h); g.lineTo(5, 0); g.fill(); g.restore(); }
    for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) { g.fillStyle = (r + c) % 2 ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.12)'; g.fillRect(c * w / 8, h * .72 + r * 26, w / 8 - 2, 24); }
    drawDiscoBall(g, w / 2, 46, 22, 1.7);
    [['ginger', 90, 'santa'], ['white', 200, 'scarf'], ['black', 310, 'antlers']].forEach(([c, x, o], i) => drawCat(g, x, h - 30 - (i % 2) * 14, .5, { pose: i === 1 ? 'celebrate' : 'sit', face: i === 2 ? -1 : 1, t: 1.3 + i, outfit: o, eyes: 'happy', noShadow: true }, COATS[c]));
  } },
  { cam: 'CAM 1  SOFA', stamp: '24-12  23:31:52', draw: (g, w, h) => {
    g.fillStyle = '#2a2038'; g.fillRect(0, 0, w, h);
    rr(g, 40, 110, 320, 90, 26); fillP(g, '#4a4f5c'); rr(g, 30, 160, 340, 90, 22); fillP(g, '#5a606e'); rr(g, 20, 150, 50, 110, 20); fillP(g, '#4a4f5c'); rr(g, 330, 150, 50, 110, 20); fillP(g, '#4a4f5c');
    [['white', 120, 'wave', 'scarf'], ['tortie', 200, 'paws', 'collar'], ['grey', 280, 'wave', 'elf']].forEach(([c, x, d, o], i) => drawCat(g, x, 175, .5, { pose: d === 'wave' ? 'swat' : 'celebrate', swatK: 1, face: i === 2 ? -1 : 1, t: 1 + i, outfit: o, eyes: 'happy', noShadow: true }, COATS[c]));
    text(g, 'NO CATS ON THE SOFA?', w / 2, 50, { size: 20, color: '#fff', weight: 700 });
  } },
  { cam: 'CAM 3  KITCHEN', stamp: '24-12  23:48:19', draw: (g, w, h) => {
    g.fillStyle = '#e9e3d8'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 34) for (let y = h * .6; y < h; y += 34) if (((x + y) / 34 | 0) % 2) { g.fillStyle = 'rgba(60,70,90,.18)'; g.fillRect(x, y, 34, 34); }
    rr(g, 0, 20, w, 90, 4); fillP(g, '#c8b89a'); for (let i = 0; i < 5; i++) { rr(g, 10 + i * 80, 30, 70, 70, 4); strokeP(g, 'rgba(0,0,0,.2)', 2); }
    rr(g, 0, 130, w, 30, 3); fillP(g, '#8a7a6a');
    ['siamese', 'calico', null, 'tuxedo', 'ginger'].forEach((c, i) => drawCat(g, 40 + i * 78, h - 26 - (i % 2) * 8, .44, { pose: 'walk', face: 1, t: .2 + i * .35, gait: i * 1.6, outfit: c ? ['angel', 'gingerbread', '', 'jumper', 'santa'][i] : curOutfit(), eyes: 'happy', noShadow: true }, c ? COATS[c] : null));
    text(g, 'CONGA!', w / 2, 190, { size: 26, color: '#c8453b', weight: 700 });
  } },
  { cam: 'CAM 2  DJ BOOTH', stamp: '25-12  00:02:44', draw: (g, w, h) => {
    g.fillStyle = '#140a24'; g.fillRect(0, 0, w, h); for (let i = 0; i < 5; i++) { g.fillStyle = ['rgba(255,79,216,.25)', 'rgba(79,230,255,.25)', 'rgba(255,208,0,.2)', 'rgba(110,227,154,.2)', 'rgba(255,90,80,.2)'][i]; circ(g, 40 + i * 85, 60 + (i % 2) * 40, 70); g.fill(); }
    drawSpeaker(g, 50, h - 10, .8, 1); drawSpeaker(g, w - 50, h - 10, .8, 1.2);
    drawMona(g, w / 2 - 6, h - 72, .62, { pose: 'swat', swatK: 1, face: 1, t: 1.1, outfit: curOutfit(), eyes: 'happy', noShadow: true }); drawHeadphones(g, w / 2, h - 158, .62);
    drawDecks(g, w / 2, h - 46, 1, .7);
    text(g, 'DJ MONA', w / 2, 34, { size: 24, color: '#ffd1f4', weight: 700 });
  } }
];
function cctvStill(i) { const S = CCTV_STILLS[i]; return cached('cctv-' + i + '-' + curOutfit(), 400, 280, g => cctvFrame(g, 400, 280, S.cam, S.stamp, S.draw)); }
/* ---- the present ---- */
function drawPresentBox(g, bw, bh, t, lidK, lidOn) {
  g.save(); rr(g, -bw / 2, -bh, bw, bh, 10); g.clip();
  g.fillStyle = '#c8261f'; g.fillRect(-bw / 2, -bh, bw, bh); g.fillStyle = 'rgba(255,255,255,.14)'; for (let i = -10; i < 10; i++) { g.beginPath(); g.moveTo(-bw / 2 + i * 40, -bh); g.lineTo(-bw / 2 + i * 40 + bh, 0); g.lineTo(-bw / 2 + i * 40 + bh + 16, 0); g.lineTo(-bw / 2 + i * 40 + 16, -bh); g.fill(); }
  const sh = g.createLinearGradient(-bw / 2, 0, bw / 2, 0); sh.addColorStop(0, 'rgba(0,0,0,.18)'); sh.addColorStop(.4, 'rgba(255,255,255,.08)'); sh.addColorStop(1, 'rgba(0,0,0,.25)'); g.fillStyle = sh; g.fillRect(-bw / 2, -bh, bw, bh);
  g.restore(); rr(g, -bw / 2, -bh, bw, bh, 10); strokeP(g, OUT, 3);
  g.fillStyle = '#f2c23e'; g.fillRect(-bw * .07, -bh, bw * .14, bh); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(-bw * .07, -bh, bw * .03, bh);
}
function drawPresentLid(g, bw, bh, t) {
  const lw = bw * 1.08, lh = bh * .24; rr(g, -lw / 2, -lh, lw, lh, 10); ink(g, rad(g, 0, -lh / 2, lw * .6, '#d8322c'), 3);
  g.fillStyle = '#f2c23e'; g.fillRect(-bw * .07, -lh, bw * .14, lh);
  const wob = Math.sin(t * 6) * .06; g.save(); g.translate(0, -lh); g.rotate(wob);
  for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(sd * bw * .4, -bw * .32, sd * bw * .48, bw * .06, 0, 0); ink(g, sd < 0 ? '#f2c23e' : '#e8b030', 3); }
  for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(0, 0); g.lineTo(sd * bw * .16, bw * .2); g.lineTo(sd * bw * .09, bw * .16); g.lineTo(sd * bw * .04, bw * .22); g.closePath(); ink(g, '#e8b030', 2.4); }
  circ(g, 0, 0, bw * .05); ink(g, '#f6d060', 2.4); g.restore();
  // the gift tag
  g.save(); g.translate(lw * .32, -lh * .2); g.rotate(.25); line(g, 0, -10, -14, -24, '#8a6a4a', 2); rr(g, -4, -10, 70, 38, 6); ink(g, '#fff6e6', 2); text(g, 'Samantha', 31, 9, { size: 14, color: '#c8453b', weight: 700 }); g.restore();
}
/* ---- the plain card ---- */
function cardFront(g, w, h, t) {
  rr(g, 0, 0, w, h, 8); ink(g, '#fbf7ef', 2.4);
  rr(g, 18, 18, w - 36, h - 36, 4); strokeP(g, 'rgba(200,69,59,.55)', 2);
  text(g, 'Merry Christmas', w / 2, h * .42, { size: 44, color: '#c8453b', weight: 700 });
  text(g, 'Samantha', w / 2, h * .52, { size: 30, color: '#3b2f2a', weight: 600 });
  drawPaw(g, w / 2, h * .66, 1.1, '#3b2f2a');
}
function cardInsideLeft(g, w, h, t) {
  rr(g, 0, 0, w, h, 8); ink(g, '#f8f3ea', 2.4);
  text(g, 'SECRET FOOTAGE', w / 2, 42, { size: 22, color: '#3b2f2a', weight: 700 });
  text(g, 'Recovered from the living room, 24 December', w / 2, 68, { size: 14, color: '#8a6a5a', weight: 600 });
  const pw = (w - 66) / 2, ph = pw * .7;
  for (let i = 0; i < 4; i++) {
    const x = 22 + (i % 2) * (pw + 22), y = 92 + Math.floor(i / 2) * (ph + 40), rot = [-.03, .025, .02, -.025][i];
    g.save(); g.translate(x + pw / 2, y + ph / 2); g.rotate(rot); g.shadowColor = 'rgba(0,0,0,.25)'; g.shadowBlur = 8; g.shadowOffsetY = 3; g.fillStyle = '#fff'; g.fillRect(-pw / 2 - 6, -ph / 2 - 6, pw + 12, ph + 26); g.shadowColor = 'transparent';
    g.drawImage(cctvStill(i), -pw / 2, -ph / 2, pw, ph);
    text(g, ['Exhibit A: the dance floor', 'Exhibit B: the sofa', 'Exhibit C: the conga', 'Exhibit D: the DJ'][i], 0, ph / 2 + 10, { size: 11, color: '#5a4a42', weight: 600 });
    g.restore();
  }
}
function cardInsideRight(g, w, h, t, k) {
  rr(g, 0, 0, w, h, 8); ink(g, '#fbf7ef', 2.4);
  CARD_MSG.forEach((ln, i) => { const a = clamp((k - i * .35) / .4, 0, 1); g.globalAlpha = a; text(g, ln, w / 2, h * .32 + i * 62 + (1 - a) * 12, { size: i === 0 ? 34 : 32, color: i === 2 ? '#c8453b' : '#3b2f2a', weight: 700 }); });
  const pa = clamp((k - 1.2) / .4, 0, 1); g.globalAlpha = pa;
  g.save(); g.translate(w / 2 + 70, h * .32 + 3 * 62 + 10); g.rotate(-.2); g.scale(.6 + .4 * E.back(pa), .6 + .4 * E.back(pa)); drawPaw(g, 0, 0, 2.2, '#3b2f2a'); g.restore();
  g.globalAlpha = 1;
}
SCENES.card = {
  enter() {
    audio.music('card'); this.ph = 'drop'; this.phT = 0; this.openK = 0; this.msgK = 0; this.opened = false;
    if (inStory()) { save.finished = true; persist(); }
    markDone('card');
  },
  update(dt) {
    this.phT += dt;
    if (this.ph === 'drop' && this.phT > .45 && !this.landed) { this.landed = true; audio.sfx('thud'); shake(.3); }
    if (this.ph === 'drop' && this.phT > 2.4) this.pop();
    if (this.ph === 'pop' && this.phT > 1.1) { this.ph = 'look'; this.phT = 0; }
    if (this.ph === 'look' && this.phT > 1.1) { this.ph = 'rise'; this.phT = 0; audio.sfx('whoosh'); }
    if (this.ph === 'rise' && this.phT > 1.3) { this.ph = 'front'; this.phT = 0; }
    if (this.opened) { this.openK = Math.min(1, this.openK + dt / .9); if (this.openK >= 1) this.msgK += dt; }
  },
  pop() { if (this.ph !== 'drop') return; this.ph = 'pop'; this.phT = 0; audio.sfx('pop'); audio.sfx('jingle'); for (let i = 0; i < 50; i++) spawn('confetti', W / 2, H * .58 - 200, 1, { vx: rand(-420, 420), vy: rand(-700, -260) }); },
  tap(x, y) {
    if (this.ph === 'drop' && this.phT > .6) { this.pop(); return; }
    if (this.ph === 'front' && !this.opened) { this.opened = true; audio.sfx('paper'); audio.sfx('chime'); }
  },
  draw() {
    const t = this.t, ph = this.ph, k = this.phT;
    // over-the-top Christmas everywhere except the card: a snowy night, lights, a glow
    if (!this._skipSky) {
    const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#1a1f4a'); bg.addColorStop(1, '#3a2a5a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    glowAt(ctx, W / 2, H * .5, 520, '255,210,150', .35);
    drawLights(ctx, garlandLights(0, W, 120, 40), t, 1);
    ctx.globalAlpha = .7; drawSnow(ctx, 0, 0, W, H, t, 70, 1); ctx.globalAlpha = 1;
    }
    ctx.fillStyle = '#fbfaf7'; ctx.beginPath(); ctx.moveTo(0, H * .78); ctx.quadraticCurveTo(W / 2, H * .72, W, H * .8); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
    const BX = W / 2, BY = H * .78, bw = 320, bh = 250;
    if (ph === 'drop' || ph === 'pop' || ph === 'look') {
      // the camera leans over the box as we look in
      const lk = ph === 'look' ? E.inOut(k / 1.1) : 0;
      ctx.save(); ctx.translate(BX, BY - bh * lk * .9); ctx.scale(1 + lk * 1.6, 1 + lk * 1.6); ctx.translate(-BX, -BY);
      const drop = ph === 'drop' ? 1 - E.out(clamp(k / .45, 0, 1)) : 0, land = ph === 'drop' && k > .45 && k < .75 ? Math.sin((k - .45) / .3 * Math.PI) : 0;
      const wig = ph === 'drop' && k > .8 ? clamp((k - .8) / 1.4, 0, 1) : 0, shakeR = Math.sin(t * 40) * .06 * wig, hop = Math.abs(Math.sin(t * 13)) * 12 * wig;
      ell(ctx, BX, BY + 6, bw * .62 * (1 - drop * .6), 16); fillP(ctx, 'rgba(0,0,30,.3)');
      if (ph !== 'drop') { const bk = clamp(k / .6, 0, 1); ctx.save(); ctx.translate(BX, BY - bh); ctx.rotate(t * .6); ctx.globalAlpha = ph === 'pop' ? 1 - bk * .3 : .7; for (let i = 0; i < 12; i++) { ctx.rotate(TAU / 12); const g = ctx.createLinearGradient(0, 0, 0, -500); g.addColorStop(0, 'rgba(255,230,150,.7)'); g.addColorStop(1, 'rgba(255,230,150,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-50, -500); ctx.lineTo(50, -500); ctx.lineTo(10, 0); ctx.fill(); } ctx.restore(); }
      ctx.save(); ctx.translate(BX, BY - drop * H * .8 - hop); ctx.rotate(shakeR); ctx.scale(1 + land * .08, 1 - land * .08);
      // when the lid is off we can see in: the box's dark inside, tissue paper, the card waiting
      if (ph !== 'drop') { ctx.save(); ctx.beginPath(); ctx.ellipse(0, -bh, bw / 2 - 6, 36, 0, 0, TAU); ctx.fillStyle = '#5a1410'; ctx.fill(); ctx.clip(); for (let i = 0; i < 6; i++) { ell(ctx, -120 + i * 48, -bh + 14, 34, 18, i); fillP(ctx, i % 2 ? '#f2e6d8' : '#e8d8c4'); } rr(ctx, -70, -bh - 26, 140, 40, 4); fillP(ctx, '#fbf7ef'); ctx.restore(); }
      drawPresentBox(ctx, bw, bh, t);
      if (ph === 'drop') { ctx.save(); ctx.translate(0, -bh); drawPresentLid(ctx, bw, bh, t); ctx.restore(); }
      else { const lk2 = Math.min(1.4, k + (ph === 'look' ? 1.1 : 0)); ctx.save(); ctx.translate(lk2 * 340, -bh - lk2 * 700 + lk2 * lk2 * 420); ctx.rotate(lk2 * 3); drawPresentLid(ctx, bw, bh, t); ctx.restore(); }
      ctx.restore(); ctx.restore();
      if (ph === 'drop' && k > 1) { const p = .5 + .5 * Math.sin(t * 5); ctx.save(); ctx.translate(W / 2, 250); ctx.scale(1 + p * .03, 1 + p * .03); rr(ctx, -170, -36, 340, 72, 8); fillP(ctx, '#fbfaf7'); geoText(ctx, 'TAP TO OPEN', 0, 1, 30, { color: '#cc2b3f', weight: 600, track: .14 }); ctx.restore(); }
      if (ph === 'look') { ctx.fillStyle = 'rgba(26,12,10,' + E.inOut(clamp((k - .85) / .25, 0, 1)) + ')'; ctx.fillRect(0, 0, W, H); }
      return;
    }
    // looking down into the box: tissue paper all round, the card rising up to meet us
    const cw = 420, ch = 580;
    if (this.cardBg) this.cardBg(); else { ctx.fillStyle = '#3a0e0a'; ctx.fillRect(0, 0, W, H); }
    const inK = ph === 'rise' ? clamp(1 - k / 1.3, 0, 1) : 0;
    ctx.save(); ctx.globalAlpha = ph === 'rise' ? 1 : Math.max(0, 1 - k / .8);
    ctx.fillStyle = '#6a1a14'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W * .78, H * .2); ctx.lineTo(W * .22, H * .2); ctx.fill(); ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(W, H); ctx.lineTo(W * .78, H * .8); ctx.lineTo(W * .22, H * .8); ctx.fill();
    ctx.fillStyle = '#521410'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W * .22, H * .2); ctx.lineTo(W * .22, H * .8); ctx.lineTo(0, H); ctx.fill(); ctx.beginPath(); ctx.moveTo(W, 0); ctx.lineTo(W * .78, H * .2); ctx.lineTo(W * .78, H * .8); ctx.lineTo(W, H); ctx.fill();
    for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, r = 300 + (i % 3) * 30; ctx.save(); ctx.translate(W / 2 + Math.cos(a) * r * 1.25, H / 2 + Math.sin(a) * r * .8); ctx.rotate(a + Math.sin(t * 2 + i) * .1); ell(ctx, 0, 0, 120, 60); fillP(ctx, i % 2 ? '#f2e6d8' : '#e6d4bf'); ctx.restore(); }
    ctx.restore();
    // the card
    const rise = ph === 'rise' ? E.out(clamp(k / 1.3, 0, 1)) : 1, sc = lerp(.45, 1, rise), rot = lerp(.25, -.03, rise);
    const ok = E.inOut(this.openK), spineX = lerp(W / 2 - cw / 2, W / 2, ok);
    ctx.save(); ctx.translate(W / 2, H / 2 + 10); ctx.rotate(rot * (1 - ok) + (ph === 'front' && !this.opened ? Math.sin(t * 1.4) * .012 : 0)); ctx.scale(sc, sc); ctx.translate(-W / 2, -(H / 2 + 10));
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 40 * sc; ctx.shadowOffsetY = 18 * sc; ctx.fillStyle = '#000'; rr(ctx, spineX - (ok > .5 ? cw : 0) * Math.min(1, (ok - .5) * 2), H / 2 - ch / 2 + 10, cw + (ok > .5 ? cw * Math.min(1, (ok - .5) * 2) : 0), ch, 8); ctx.fill(); ctx.restore();
    // right-hand inside page (always there under the cover)
    ctx.save(); ctx.translate(spineX, H / 2 - ch / 2 + 10); cardInsideRight(ctx, cw, ch, t, this.msgK); ctx.restore();
    // the cover swings open around the spine: front face first, then the inside-left page
    const sx = Math.cos(ok * Math.PI);
    ctx.save(); ctx.translate(spineX, H / 2 - ch / 2 + 10); ctx.scale(sx, 1);
    if (sx > 0) cardFront(ctx, cw, ch, t); else { ctx.scale(-1, 1); ctx.translate(-cw, 0); cardInsideLeft(ctx, cw, ch, t); }
    if (Math.abs(sx) < .98) { ctx.fillStyle = 'rgba(0,0,0,' + (.25 * (1 - Math.abs(sx))) + ')'; ctx.fillRect(sx > 0 ? 0 : 0, 0, cw, ch); }
    ctx.restore();
    ctx.restore();
    if (ph === 'rise' && k < .4) { ctx.fillStyle = 'rgba(26,12,10,' + (1 - k / .4) + ')'; ctx.fillRect(0, 0, W, H); }
    if (ph === 'front' && !this.opened && k > .4) { const p = .5 + .5 * Math.sin(t * 5); ctx.save(); ctx.translate(W / 2, H - 70); ctx.rotate(-.03); ctx.scale(1 + p * .02, 1 + p * .02); rr(ctx, -190, -32, 380, 64, 8); fillP(ctx, '#fbfaf7'); geoText(ctx, 'TAP TO OPEN THE CARD', 0, 1, 22, { color: '#cc2b3f', weight: 600, track: .12 }); ctx.restore(); }
    // the end: two ways out
    if (this.msgK > 2) {
      if (PDEFER) deferLate(() => { const y = DOCK.y0 + 50; btn('c-arcade', 40, y, 330, 84, 'Arcade', () => go('arcade', { story: false }), { color: '#7b5aa8', size: 32 }); btn('c-again', PW - 370, y, 330, 84, 'Start over', () => storyGo(0), { color: '#c8453b', size: 32 }); });
      else {
      btn('c-arcade', W / 2 - 330, H - 104, 300, 76, 'Arcade', () => go('arcade', { story: false }), { color: '#7b5aa8', size: 30 });
      btn('c-again', W / 2 + 30, H - 104, 300, 76, 'Start over', () => storyGo(0), { color: '#c8453b', size: 30 });
      }
    }
  },
  vignette: true
};
