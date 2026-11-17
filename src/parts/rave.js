/* ============ v3 opener: THE SECRET CAT RAVE ============
   Lights down, disco ball, a nightclub video on the TV, Mona DJing and her girlfriends everywhere.
   An iPhone jiggles in: Find My shows Samantha nearly home. Shoo every cat out and hide the evidence
   before the car pulls up. Then the TV switches itself off and Mona sits in the window, all innocence. */
const COATS = {
  ginger: { fur: '#e39a4f', furD: '#c0772f', stripe: '#a85a1e', light: '#fbe3c4', eye: '#7dc24a', eyeD: '#4f8a24' },
  black: { fur: '#3a3434', furD: '#262222', stripe: '#2c2727', light: '#4d4646', eye: '#f2c23e', eyeD: '#b58a12', inner: '#c98a8a', paw: '#4d4646' },
  white: { fur: '#f4f1ec', furD: '#d9d4cc', stripe: '#e8e3dc', light: '#ffffff', eye: '#6aa8e8', eyeD: '#3a6ab0' },
  grey: { fur: '#8a96a6', furD: '#6d7888', stripe: '#7a8696', light: '#c8d0da', eye: '#e8a23a', eyeD: '#a8661a' },
  siamese: { fur: '#efe1cc', furD: '#d5c2a5', stripe: '#7a5a46', light: '#fff6ea', eye: '#5aa0ff', eyeD: '#2a5ab0' },
  tortie: { fur: '#5a3a2a', furD: '#3e281c', stripe: '#c8732f', light: '#7a5240', eye: '#e8c23a', eyeD: '#a8821a' },
  tuxedo: { fur: '#2e2a2a', furD: '#1e1a1a', stripe: '#2a2626', light: '#ffffff', eye: '#9ad04a', eyeD: '#5a8a20', paw: '#ffffff' },
  calico: { fur: '#f3ead8', furD: '#d8ccb4', stripe: '#d27a35', light: '#ffffff', eye: '#88c04a', eyeD: '#4f8a24' }
};
function drawCat(g, x, y, s, o, coat) {
  if (!coat) { drawMona(g, x, y, s, o); return; }
  const keep = Object.assign({}, MC); Object.assign(MC, coat);
  try { drawMona(g, x, y, s, o); } finally { Object.assign(MC, keep); }
}
/* ---- an iPhone, tilted, popping up from the bottom of the screen with a jiggle (as in Gabie's game) ---- */
function iphoneFrame(px, py, pw, ph, t, screen, o) {
  o = o || {};
  const k = o.noPop ? 1 : E.back(clamp(t * 3, 0, 1)), jg = jiggle(t, 1.3), buzz = o.buzz ? Math.sin(t * 46) * .02 * Math.max(0, Math.sin(t * 3.2)) : 0;
  const cx = px + pw / 2, cy = py + ph / 2;
  ctx.save(); ctx.translate(cx, cy + (1 - k) * (H - py)); ctx.rotate((o.tilt != null ? o.tilt : .06) + buzz + jg.rot); ctx.scale((o.s || 1) * jg.sx, (o.s || 1) * jg.sy); ctx.translate(-cx, -cy);
  const r = pw * .16;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10; rr(ctx, px - 9, py - 9, pw + 18, ph + 18, r + 8); fillP(ctx, '#1d1a20'); ctx.restore();
  rr(ctx, px - 9, py - 9, pw + 18, ph + 18, r + 8); strokeP(ctx, '#5a5560', 2.5);
  rr(ctx, px - 12, py + ph * .2, 3, ph * .08, 2); fillP(ctx, '#3a3640'); rr(ctx, px + pw + 9, py + ph * .25, 3, ph * .12, 2); fillP(ctx, '#3a3640');
  ctx.save(); rr(ctx, px, py, pw, ph, r); ctx.clip(); screen(px, py, pw, ph); ctx.restore();
  rr(ctx, cx - pw * .15, py + 9, pw * .3, 22, 11); fillP(ctx, '#000');
  text(ctx, '9:41', px + 32, py + 21, { size: 13, color: o.darkStatus ? '#1d1a20' : '#fff', weight: 700 });
  rr(ctx, cx - pw * .2, py + ph - 12, pw * .4, 5, 3); fillP(ctx, o.darkStatus ? 'rgba(0,0,0,.5)' : 'rgba(255,255,255,.7)');
  ctx.restore();
}
/* ---- Find My: a little street map, the route home and Samantha's face sliding along it ---- */
const FM_ROUTE = [[.12, .2], [.12, .48], [.42, .48], [.42, .7], [.72, .7], [.72, .86]];
function routeAt(k) {
  const P = FM_ROUTE; let tot = 0; const seg = []; for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); seg.push(d); tot += d; }
  let d = clamp(k, 0, 1) * tot; for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const u = d / seg[i]; return [lerp(P[i][0], P[i + 1][0], u), lerp(P[i][1], P[i + 1][1], u)]; } d -= seg[i]; }
  return P[P.length - 1];
}
function findMyScreen(x, y, w, h, k, t, mini) {
  ctx.fillStyle = '#efeadf'; ctx.fillRect(x, y, w, h);
  const mh = mini ? h : h * .68;
  // blocks, a park, a creek and white roads
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, mh); ctx.clip();
  for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) { rr(ctx, x + 6 + c * w / 5, y + 6 + r * mh / 7, w / 5 - 12, mh / 7 - 12, 4); fillP(ctx, (r * 3 + c) % 7 === 2 ? '#cfe6c2' : '#e4ded1'); }
  ctx.beginPath(); ctx.moveTo(x + w * .86, y); ctx.bezierCurveTo(x + w * .7, y + mh * .3, x + w * .98, y + mh * .6, x + w * .84, y + mh); strokeP(ctx, '#a9cdf0', w * .05);
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = w * .035; for (let c = 0; c <= 5; c++) { ctx.beginPath(); ctx.moveTo(x + c * w / 5, y); ctx.lineTo(x + c * w / 5, y + mh); ctx.stroke(); } for (let r = 0; r <= 7; r++) { ctx.beginPath(); ctx.moveTo(x, y + r * mh / 7); ctx.lineTo(x + w, y + r * mh / 7); ctx.stroke(); }
  // the route so far (grey) and to go (blue)
  const P = FM_ROUTE.map(p => [x + p[0] * w, y + p[1] * mh]), cur = routeAt(k), cx = x + cur[0] * w, cy = y + cur[1] * mh;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); strokeP(ctx, '#2f7cf6', w * .03);
  // home
  const hm = P[P.length - 1]; circ(ctx, hm[0], hm[1], w * .07); fillP(ctx, '#ff9f0a'); ctx.save(); ctx.translate(hm[0], hm[1]); ctx.scale(w / 300, w / 300); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(10, 0); ctx.lineTo(7, 0); ctx.lineTo(7, 9); ctx.lineTo(-7, 9); ctx.lineTo(-7, 0); ctx.lineTo(-10, 0); ctx.closePath(); ctx.fill(); ctx.restore();
  // Samantha's face in a white ring, pulsing
  const pr = w * .085, pu = (t * 1.2) % 1; ctx.globalAlpha = .45 * (1 - pu); circ(ctx, cx, cy, pr + pu * pr * 1.4); fillP(ctx, '#2f7cf6'); ctx.globalAlpha = 1;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.3)'; ctx.shadowBlur = 6; circ(ctx, cx, cy, pr + 3); fillP(ctx, '#fff'); ctx.restore();
  ctx.save(); circ(ctx, cx, cy, pr); ctx.clip(); fillP(ctx, '#bcd6f0'); drawSamHead(ctx, cx, cy + pr * .55, pr / 38, { t, expr: 'smile' }); ctx.restore();
  ctx.restore();
  if (mini) return;
  // the bottom sheet
  rr(ctx, x, y + mh - 14, w, h - mh + 14, 16); fillP(ctx, '#ffffff'); rr(ctx, x + w / 2 - 18, y + mh - 6, 36, 4, 2); fillP(ctx, '#d0d0d4');
  text(ctx, 'Samantha', x + 20, y + mh + 26, { size: w * .085, color: '#111', weight: 700, align: 'left' });
  const mins = Math.max(1, Math.ceil((1 - k) * 3));
  text(ctx, 'Grocery Outlet → Home', x + 20, y + mh + 54, { size: w * .05, color: '#8a8a90', weight: 600, align: 'left' });
  rr(ctx, x + 20, y + mh + 72, w - 40, 40, 12); fillP(ctx, '#ff3b30'); text(ctx, 'Arriving in ' + mins + ' min!', x + w / 2, y + mh + 93, { size: w * .06, color: '#fff', weight: 700 });
}
/* ---- party props (also used for the card's CCTV stills) ---- */
function drawDiscoBall(g, x, y, r, t) {
  line(g, x, 0, x, y - r, '#c9c9d4', 2);
  g.save(); g.translate(x, y); circ(g, 0, 0, r); g.save(); g.clip();
  for (let yy = -r; yy < r; yy += r / 5) for (let xx = -r; xx < r; xx += r / 5) { const s = Math.sin(t * 3 + xx * .3 + yy * .2 + (xx * yy) * .01); g.fillStyle = s > .6 ? '#ffffff' : s > 0 ? '#c9cbd8' : '#7a7d90'; g.fillRect(xx + 1, yy + 1, r / 5 - 2, r / 5 - 2); }
  g.restore(); circ(g, 0, 0, r); strokeP(g, '#4a4c5a', 2); circ(g, -r * .35, -r * .35, r * .25); fillP(g, 'rgba(255,255,255,.35)'); g.restore();
}
function drawDecks(g, x, y, t, s) {
  g.save(); g.translate(x, y); g.scale(s || 1, s || 1);
  rr(g, -150, -30, 300, 70, 10); ink(g, '#26222c', 3); rr(g, -150, -30, 300, 14, 8); fillP(g, '#3a3440');
  for (const sd of [-1, 1]) { ell(g, sd * 88, 2, 50, 18); ink(g, '#121014', 2); ell(g, sd * 88, 2, 34, 12); fillP(g, '#2a2830'); g.save(); g.translate(sd * 88, 2); g.rotate(t * 6 * sd); line(g, 0, 0, 30, 0, 'rgba(255,255,255,.35)', 2); g.restore(); circ(g, sd * 88, 2, 5); fillP(g, '#e2443b'); }
  rr(g, -28, -18, 56, 36, 6); fillP(g, '#16141a'); for (let i = 0; i < 4; i++) { rr(g, -20 + i * 11, -12, 5, 24, 2); fillP(g, '#555'); rr(g, -21 + i * 11, -6 + Math.sin(t * 5 + i) * 6, 7, 6, 2); fillP(g, ['#ff4fd8', '#4fe6ff', '#ffd000', '#6ee39a'][i]); }
  g.fillStyle = '#121014'; g.fillRect(-140, 40, 14, 60); g.fillRect(126, 40, 14, 60);
  g.restore();
}
function drawSpeaker(g, x, y, s, t) {
  g.save(); g.translate(x, y); g.scale(s, s); const p = 1 + .06 * Math.max(0, Math.sin(t * 13.4));
  rr(g, -60, -200, 120, 200, 10); ink(g, '#1e1c22', 3);
  circ(g, 0, -140, 28 * p); ink(g, '#33303a', 2); circ(g, 0, -140, 10); fillP(g, '#111');
  circ(g, 0, -60, 42 * p); ink(g, '#33303a', 2); circ(g, 0, -60, 15); fillP(g, '#111');
  g.restore();
}
function drawPizzaBox(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  rr(g, -70, -14, 140, 22, 4); ink(g, '#d9b98a', 2.5); rr(g, -66, -10, 132, 14, 3); fillP(g, '#e8a04a');
  for (const [a, b] of [[-36, -4], [-6, -2], [26, -5], [44, 0]]) { circ(g, a, b, 6); fillP(g, '#c8302a'); }
  g.save(); g.translate(-70, -14); g.rotate(-1.9); rr(g, 0, -3, 140, 12, 3); ink(g, '#d9b98a', 2.5); g.restore();
  text(g, 'PIZZA', 10, -40, { size: 14, color: '#c8302a', weight: 700 });
  g.restore();
}
function drawCups(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); for (const [a, r] of [[-30, -.3], [0, 0], [26, .9]]) { g.save(); g.translate(a, 0); g.rotate(r); g.beginPath(); g.moveTo(-14, -34); g.lineTo(14, -34); g.lineTo(10, 0); g.lineTo(-10, 0); g.closePath(); ink(g, '#d8333b', 2); g.fillStyle = '#fff'; g.fillRect(-13, -32, 26, 4); g.restore(); } g.restore(); }
function drawGlowsticks(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); ['#ff4fd8', '#4fe6ff', '#b6ff4f', '#ffd000'].forEach((c, i) => { g.save(); g.rotate(-.6 + i * .4); g.shadowColor = c; g.shadowBlur = 14; rr(g, -4, -40, 8, 46, 4); fillP(g, c); g.restore(); }); g.restore(); }
function drawStreamers(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); ['#ff4fd8', '#4fe6ff', '#ffd000', '#6ee39a'].forEach((c, i) => { g.beginPath(); g.moveTo(-90 + i * 50, 0); for (let k = 0; k < 8; k++) g.lineTo(-90 + i * 50 + Math.sin(k + t * 2 + i) * 10, k * 12); strokeP(g, c, 5); }); g.restore(); }
function drawHeadphones(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.beginPath(); g.arc(0, 0, 34, Math.PI * 1.05, Math.PI * 1.95); strokeP(g, '#1e1c22', 7); for (const sd of [-1, 1]) { ell(g, sd * 34, 6, 10, 15); ink(g, '#ff4fd8', 2.4); } g.restore(); }
/* the nightclub video on the TV: a dance floor, a strobing crowd, neon CLUB MEOW */
function clubTV(g, x, y, w, h, t) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.fillStyle = '#12061e'; g.fillRect(x, y, w, h);
  for (let i = 0; i < 5; i++) { const a = Math.sin(t * 2 + i * 1.3) * .5; g.save(); g.translate(x + w * (.15 + i * .18), y); g.rotate(a); const gr = g.createLinearGradient(0, 0, 0, h); const c = ['255,79,216', '79,230,255', '255,208,0', '110,227,154', '255,90,80'][i]; gr.addColorStop(0, 'rgba(' + c + ',.6)'); gr.addColorStop(1, 'rgba(' + c + ',0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(-6, 0); g.lineTo(-50, h); g.lineTo(50, h); g.lineTo(6, 0); g.fill(); g.restore(); }
  for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) { g.fillStyle = (r + c + Math.floor(t * 4)) % 3 ? 'rgba(255,79,216,.35)' : 'rgba(79,230,255,.35)'; g.fillRect(x + c * w / 8, y + h * .72 + r * h * .07, w / 8 - 2, h * .07 - 2); }
  for (let i = 0; i < 9; i++) { const bx = x + 14 + i * (w - 28) / 8, by = y + h * .74 - Math.abs(Math.sin(t * 8.5 + i)) * 10; g.fillStyle = '#05020a'; circ(g, bx, by - 22, 7); g.fill(); rr(g, bx - 8, by - 15, 16, 24, 6); g.fill(); line(g, bx - 6, by - 10, bx - 14, by - 26 - Math.sin(t * 8 + i) * 6, '#05020a', 4); }
  g.save(); g.shadowColor = '#ff4fd8'; g.shadowBlur = 12; text(g, 'CLUB MEOW', x + w / 2, y + h * .2, { size: h * .17, color: '#ffd1f4', weight: 700 }); g.restore();
  if (Math.sin(t * 17) > .7) { g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x, y, w, h); }
  g.globalAlpha = .12; g.fillStyle = '#000'; for (let yy = y; yy < y + h; yy += 3) g.fillRect(x, yy, w, 1); g.globalAlpha = 1;
  g.restore();
}
/* Mona's eight party girlfriends: each has her own coat, outfit and dance move, and her own spot on the floor,
   spaced so no two cats (or cats and party mess) overlap. s = size. */
const RAVE_CATS = [
  { name: 'Ginger', coat: 'ginger', x: 555, y: 600, out: 'santa', dance: 'paws' }, { name: 'Midnight', coat: 'black', x: 865, y: 600, out: 'antlers', dance: 'hop' },
  { name: 'Snowy', coat: 'white', x: 1080, y: 548, out: 'scarf', dance: 'wave' }, { name: 'Suki', coat: 'siamese', x: 205, y: 765, out: 'angel', dance: 'shimmy' },
  { name: 'Toffee', coat: 'tortie', x: 960, y: 430, out: 'collar', dance: 'shimmy' }, { name: 'Smokey', coat: 'grey', x: 740, y: 420, out: 'elf', dance: 'bop' },
  { name: 'Tux', coat: 'tuxedo', x: 400, y: 730, out: 'jumper', dance: 'spin' }, { name: 'Patches', coat: 'calico', x: 1235, y: 765, out: 'gingerbread', dance: 'bop' }
];
// on a phone the party squeezes into the middle of the room so every cat and every bit of evidence is on screen
const RAVE_CATS_P = [
  { name: 'Ginger', coat: 'ginger', x: 965, y: 420, out: 'santa', dance: 'paws', s: .7 }, { name: 'Midnight', coat: 'black', x: 965, y: 870, out: 'antlers', dance: 'hop', s: .7 },
  { name: 'Snowy', coat: 'white', x: 970, y: 600, out: 'scarf', dance: 'wave', s: .7 }, { name: 'Suki', coat: 'siamese', x: 560, y: 540, out: 'angel', dance: 'shimmy', s: .7 },
  { name: 'Toffee', coat: 'tortie', x: 850, y: 540, out: 'collar', dance: 'shimmy', s: .7 }, { name: 'Smokey', coat: 'grey', x: 740, y: 420, out: 'elf', dance: 'bop', s: .7 },
  { name: 'Tux', coat: 'tuxedo', x: 450, y: 760, out: 'jumper', dance: 'spin', s: .7 }, { name: 'Patches', coat: 'calico', x: 700, y: 888, out: 'gingerbread', dance: 'bop', s: .62 }
];
const RAVE_MESS_P = [
  { id: 'pizza', x: 470, y: 872, r: 80, name: 'Pizza box' }, { id: 'cups', x: 598, y: 868, r: 60, name: 'Party cups' }, { id: 'glow', x: 850, y: 860, r: 60, name: 'Glow sticks' },
  { id: 'streamers', x: 640, y: 190, r: 110, name: 'Streamers' }, { id: 'disco', x: 760, y: 110, r: 60, name: 'Disco ball' }, { id: 'speaker', x: 440, y: 560, r: 70, name: 'Speaker' }, { id: 'decks', x: 700, y: 690, r: 120, name: 'DJ decks' }
];
const RAVE_MESS = [
  { id: 'pizza', x: 330, y: 772, r: 80, name: 'Pizza box' }, { id: 'cups', x: 1160, y: 655, r: 60, name: 'Party cups' }, { id: 'glow', x: 1075, y: 742, r: 60, name: 'Glow sticks' },
  { id: 'streamers', x: 600, y: 240, r: 120, name: 'Streamers' }, { id: 'disco', x: 700, y: 120, r: 60, name: 'Disco ball' }, { id: 'speaker', x: 220, y: 600, r: 70, name: 'Speaker' }, { id: 'decks', x: 700, y: 650, r: 120, name: 'DJ decks' }
];
/* a cat's dance on the 128 bpm beat: squash on the downbeat, stretch on the way up (no swinging from anything) */
function raveMove(c, beat) {
  const b = beat + c.ph, fr = b - Math.floor(b), hit = Math.exp(-fr * 7), o = { pose: 'sit', face: c.x > 700 ? -1 : 1, lift: 0, rot: 0, sx: 1 + .07 * hit, sy: 1 - .09 * hit, dx: 0, swatK: 0 };
  if (c.dance === 'bop') { o.lift = Math.sin(fr * Math.PI) * 10; o.pose = Math.floor(b) % 4 === 3 ? 'celebrate' : 'sit'; }
  else if (c.dance === 'paws') { o.pose = 'celebrate'; o.lift = Math.abs(Math.sin(b * Math.PI)) * 14; }
  else if (c.dance === 'hop') { const u = (b % 2) / 2, j = u < .5 ? Math.sin(u * 2 * Math.PI) : 0; o.lift = j * 46; o.pose = j > .15 ? 'celebrate' : 'sit'; if (j > .15) { o.sx = .95; o.sy = 1.06; } }
  else if (c.dance === 'spin') { const u = (b % 2) / 2; o.face = u < .5 ? 1 : -1; o.sx *= Math.max(.2, Math.abs(Math.cos(u * 2 * Math.PI))); o.lift = Math.sin(fr * Math.PI) * 6; o.pose = 'celebrate'; }
  else if (c.dance === 'shimmy') { o.rot = Math.sin(b * Math.PI) * .12; o.dx = Math.sin(b * Math.PI) * 6; }
  else if (c.dance === 'wave') { o.pose = 'swat'; o.swatK = Math.abs(Math.sin(b * Math.PI)); o.face = Math.floor(b / 2) % 2 ? 1 : -1; }
  return o;
}

const RAVE_BYE = ['Party pooper!', 'Byeee!', 'Same time next week?', 'Laters, Mona!', 'Mrrrow!', 'Ugh, FINE.', 'Text me!', 'Best. Party. Ever.'];
SCENES.rave = {
  enter() {
    this._pan = 0; this._pd = null;
    this.ph = 'party'; this.phT = 0; this.timeLimit = 40; this.left = false; this.res = null; this.says = []; this.done = 0; this.tvOff = 0; this.shake = 0;
    this.cats = (PORT ? RAVE_CATS_P : RAVE_CATS).map((c, i) => Object.assign({}, c, { st: 'dance', i, bx: c.x, by: c.y, vx: 0, ph: i * .7 }));
    this.mess = (PORT ? RAVE_MESS_P : RAVE_MESS).map(m => Object.assign({}, m, { gone: 0, hidden: false }));
    this.m = { x: 700, y: PORT ? 650 : 610, st: 'dj', pose: 'sit', face: 1 };
    this.cam = { z: 1, x: 700, y: 450 };
    audio.music('rave');
  },
  say(who, msg, x, y, dur) { this.says.push({ who, msg, x, y, t0: this.t, dur: dur || 1.8 }); },
  update(dt) {
    this.phT += dt; this.shake = Math.max(0, this.shake - dt * 3);
    // camera: wide on the party, push in on Mona when the phone buzzes, close-up on the window at the end
    const tc = this.ph === 'phone' ? { z: 1.35, x: 700, y: 560 } : this.ph === 'quiet' && this.phT > 1 ? (PORT ? { z: 1.5, x: 1180, y: 400 } : { z: 1.5, x: 984, y: 400 }) : { z: 1, x: 700, y: 450 }, ck = Math.min(1, dt * 2.2);
    this.cam.z = lerp(this.cam.z, tc.z, ck); this.cam.x = lerp(this.cam.x, tc.x, ck); this.cam.y = lerp(this.cam.y, tc.y, ck);
    const beat = this.t * 128 / 60;
    if (this.ph === 'party' && this.phT > 1.6) { this.ph = 'phone'; this.phT = 0; audio.sfx('ding'); audio.sfx('meow', 1.3); }
    if (this.ph === 'phone' && this.phT > 3.8) this.startClean();
    if (this.ph === 'clean') {
      this.left2 = Math.max(0, this.timeLimit - this.phT);
      if (this.left2 <= 0) this.finish(false);
    }
    for (const c of this.cats) {
      if (c.st === 'leave') { c.x += c.vx * dt; c.y += (c.ty - c.y) * Math.min(1, dt * 3); if (c.x < -140 || c.x > 1540) c.st = 'gone'; }
    }
    if (this.ph === 'quiet') {
      const m = this.m;
      if (this.phT < 1.2) { m.x = lerp(m.x, 1290, dt * 2.5); m.y = lerp(m.y, 432, dt * 2.5); m.st = 'hop'; }
      else { m.x = 1290; m.y = 432; m.st = 'window'; }
      this.tvOff = Math.min(1, this.tvOff + dt * 1.6);
      if (this.phT > 5.2 && !this.left) { this.left = true; if (inStory()) storyNext(); else go('levels'); }
    }
    if (Math.floor(beat) !== this.lastBeat) { this.lastBeat = Math.floor(beat); if (this.ph !== 'quiet' && this.lastBeat % 4 === 0) this.shake = Math.max(this.shake, .25); }
  },
  startClean() { if (this.ph === 'clean') return; this.ph = 'clean'; this.phT = 0; this.say('mona', 'Uh oh. She\'s nearly home!', 700, 470, 2.2); showHow('rave'); },
  finish(clean) {
    if (this.ph === 'quiet') return;
    const left = this.left2 || 0; this.ph = 'quiet'; this.phT = 0; audio.stopMusic(); audio.sfx('blip2');
    for (const c of this.cats) if (c.st === 'dance') { c.st = 'leave'; c.vx = -900; c.ty = 760; }
    for (const m of this.mess) if (!m.hidden) { m.hidden = true; m.gone = this.t; }
    const stars = !clean ? 1 : left > 18 ? 3 : left > 8 ? 2 : 1;
    this.res = finishLevel('rave', stars, GAME.pts); markDone('rave');
    setTimeout(() => { if (sceneName === 'rave') audio.music('evening'); }, 3200);
  },
  wp(x, y) { const c = this.cam, sh = this.shake * 6; return { x: W / 2 + (x - c.x) * c.z + Math.sin(this.t * 60) * sh, y: H / 2 + (y - c.y) * c.z }; },
  sw(X, Y) { const c = this.cam; return { x: (X - W / 2) / c.z + c.x, y: (Y - H / 2) / c.z + c.y }; },
  down() { if (PORT && PVIEW.pan) this._pd = screenPt().x; },
  move() { if (this._pd != null) { const sx = screenPt().x; this._pan = (this._pan || 0) - (sx - this._pd) / PVIEW.s; this._pd = sx; } },
  up() { this._pd = null; },
  tap(X, Y) {
    if (this.ph === 'party' || this.ph === 'phone') { this.startClean(); return; }
    if (this.ph !== 'clean') return;
    const w = this.sw(X, Y);
    for (const c of this.cats) {
      if (c.st !== 'dance') continue;
      const p = this.catPos(c); if (dist(w.x, w.y, p.x, p.y - 40) < 78) {
        c.st = 'leave'; c.vx = c.x > 760 ? 760 : -760; c.ty = Math.max(c.y, 700); c.face = c.vx > 0 ? 1 : -1;
        audio.sfx('meow', rand(.8, 1.4)); audio.sfx('whoosh'); addPts(100, X, Y - 60, 'Shoo!');
        this.say('cat', RAVE_BYE[(this.done++) % RAVE_BYE.length], p.x, p.y - 140, 1.5); this.check(); return;
      }
    }
    for (const m of this.mess) {
      if (m.hidden) continue;
      if (dist(w.x, w.y, m.x, m.y) < m.r) {
        if (m.id === 'decks') { this.m.st = 'dance'; this.m.x = 600; this.m.y = 760; }
        m.hidden = true; m.gone = this.t; audio.sfx('pop'); spawn('sparkle', X, Y, 16); addPts(80, X, Y - 50, 'Hidden!'); this.check(); return;
      }
    }
    spawn('sparkle', X, Y, 4);
  },
  check() { if (this.cats.every(c => c.st !== 'dance') && this.mess.every(m => m.hidden)) this.finish(true); },
  catPos(c) {
        const o = raveMove(c, this.t * 128 / 60); return { x: c.x + o.dx, y: c.y - o.lift };
  },
  draw() {
    const t = this.t, beat = t * 128 / 60, quiet = this.ph === 'quiet', qk = quiet ? clamp(this.phT / 1.4, 0, 1) : 0;
    ctx.fillStyle = '#0c0814'; ctx.fillRect(0, 0, W, H);
    ctx.save(); const sh = this.shake * 6; ctx.translate(W / 2 + Math.sin(t * 60) * sh, H / 2); ctx.scale(this.cam.z, this.cam.z); ctx.translate(-this.cam.x, -this.cam.y);
    ctx.drawImage(cached('liv-rave', LIV.w, H, g => drawLiving(g, 'night')), 0, 0, LIV.w, H);
    livingLive(ctx, t, 'night');
    // the TV: nightclub video, then it switches itself off (picture collapses to a line, then a dot)
    if (this.tvOff < 1) {
      const k = this.tvOff, hh = 180 * (k < .5 ? 1 - k * 1.96 : .02), ww = 324 * (k < .5 ? 1 : 1 - (k - .5) * 2);
      ctx.save(); ctx.translate(98 + 162, 188 + 90); clubTV(ctx, -ww / 2, -hh / 2, ww, Math.max(2, hh), t); if (k > 0) { ctx.globalAlpha = k; ctx.fillStyle = '#fff'; ctx.fillRect(-ww / 2, -Math.max(2, hh) / 2, ww, Math.max(2, hh)); } ctx.restore();
    } else { ctx.fillStyle = '#0a0a0c'; ctx.fillRect(98, 188, 324, 180); }
    // props
    for (const m of this.mess) {
      const a = m.hidden ? 1 - clamp((t - m.gone) / .35, 0, 1) : 1; if (a <= 0) continue;
      const s = m.hidden ? a : 1;
      ctx.save(); ctx.globalAlpha = a; ctx.translate(m.x, m.y); ctx.scale(s, s); ctx.translate(-m.x, -m.y);
      if (m.id === 'pizza') drawPizzaBox(ctx, m.x, m.y, 1);
      else if (m.id === 'cups') drawCups(ctx, m.x, m.y, 1);
      else if (m.id === 'glow') drawGlowsticks(ctx, m.x, m.y, 1, t);
      else if (m.id === 'streamers') drawStreamers(ctx, m.x, m.y, 1.2, t);
      else if (m.id === 'disco') drawDiscoBall(ctx, m.x, m.y, 42, t);
      else if (m.id === 'speaker') drawSpeaker(ctx, m.x, m.y + 40, .8, t);
      else if (m.id === 'decks') drawDecks(ctx, m.x, m.y, t, 1);
      ctx.restore();
    }
    // cats
    const cats = this.cats.filter(c => c.st !== 'gone').sort((a, b) => a.y - b.y);
    for (const c of cats) {
      const sc = c.s || .78;
      if (c.st === 'leave') { drawCat(ctx, c.x, c.y, sc, { pose: 'run', face: c.face, t, gait: t * 9, outfit: c.out, eyes: 'wide' }, COATS[c.coat]); continue; }
      const o = raveMove(c, beat);
      // a pool of coloured light on the floor under each dancer, pulsing on the beat
      const pc = ['255,79,216', '79,230,255', '255,208,0', '110,227,154'][c.i % 4]; ctx.save(); ctx.globalAlpha = (.25 + .2 * Math.exp(-((beat + c.ph) % 1) * 5)) * (1 - qk); ell(ctx, c.x, c.y + 2, 62 * sc, 14 * sc); fillP(ctx, 'rgb(' + pc + ')'); ctx.restore();
      contactShadow(ctx, c.x + o.dx, c.y, 44 * sc, 8 * sc, .35 * (1 - Math.min(.7, o.lift / 60)));
      ctx.save(); ctx.translate(c.x + o.dx, c.y - o.lift); ctx.rotate(o.rot); ctx.scale(o.sx, o.sy);
      drawCat(ctx, 0, 0, sc, { pose: o.pose, face: o.face, t, outfit: c.out, eyes: 'happy', swatK: o.swatK, noShadow: true }, COATS[c.coat]);
      ctx.restore();
    }
    // Mona: DJ with headphones, then a dancer, then the picture of innocence in the window
    const m = this.m;
    if (m.st === 'window') { drawMona(ctx, m.x, m.y, .78, { pose: 'sit', face: -1, t, outfit: curOutfit(), eyes: Math.sin(t * 1.3) > .9 ? 'happy' : 'open' }); if (this.phT > 2) { const k2 = clamp((this.phT - 2) / .4, 0, 1); ctx.globalAlpha = k2; ell(ctx, m.x - 6, m.y - 150, 30, 8); strokeP(ctx, '#ffe9a0', 4); ctx.globalAlpha = 1; } }
    else if (m.st === 'dj') { drawMona(ctx, m.x, m.y, .82, { pose: Math.floor(beat) % 2 ? 'swat' : 'sit', swatK: Math.abs(Math.sin(beat * Math.PI)), face: 1, t, outfit: curOutfit(), eyes: 'happy' }); drawHeadphones(ctx, m.x + 8, m.y - 128, .82); }
    else drawMona(ctx, m.x, m.y - Math.abs(Math.sin(beat * Math.PI)) * 20, .82, { pose: quiet ? 'run' : 'celebrate', face: 1, t, gait: t * 9, outfit: curOutfit(), eyes: 'happy' });
    ctx.restore();
    // disco lighting: dark room, sweeping coloured spots; the lights come up as the house goes quiet
    const L = (x, y) => this.wp(x, y), cols = ['255,79,216', '79,230,255', '255,208,0', '110,227,154', '255,90,80'];
    const lights = [];
    if (!quiet || qk < 1) {
      for (let i = 0; i < 5; i++) { const a = t * (1.1 + i * .23) + i * 1.7, p = L(700 + Math.cos(a) * 520, 600 + Math.sin(a * 1.3) * 230), on = Math.floor(beat + i) % 2; lights.push({ x: p.x, y: p.y, r: 230, a: (.75 + .25 * on) * (1 - qk), col: cols[(i + Math.floor(beat)) % 5], ca: .32 * (1 - qk), k: .25 }); }
      const tv = L(260, 280); lights.push({ x: tv.x, y: tv.y, r: 300, a: .8 * (1 - this.tvOff), col: '255,120,230', ca: .3, k: .3 });
    }
    const lamp = L(1000, 240), fire = L(710, 430); lights.push({ x: lamp.x, y: lamp.y, r: 520, a: .9 * qk, col: '255,214,150', ca: .18 }, { x: fire.x, y: fire.y + 40, r: 380, a: .5 + .45 * qk, col: '255,150,70', ca: .18 });
    lightMap('8,4,24,' + lerp(.9, .42, qk), lights);
    // disco-ball reflections sweeping the walls
    if (!this.mess.find(x => x.id === 'disco').hidden) for (let i = 0; i < 40; i++) { const a = i * 2.4 + t * .9, p = L(700 + Math.cos(a) * (200 + (i % 7) * 90), 120 + Math.abs(Math.sin(a * 1.7)) * 560); ctx.globalAlpha = .5 + .5 * Math.sin(t * 5 + i); circ(ctx, p.x, p.y, 3 + (i % 3)); fillP(ctx, '#ffffff'); ctx.globalAlpha = 1; }
    drawGrain(.05);
    // speech
    this.says = this.says.filter(s => t - s.t0 < s.dur);
    for (const s of this.says) { const p = this.wp(s.x, s.y); speech(ctx, s.msg, clamp(p.x, 220, W - 220), clamp(p.y, 200, H - 120), s.t0, t, 300); }
    // the iPhone: Find My, then it tucks itself into the corner as a mini map with the countdown
    const k = this.ph === 'clean' ? clamp(1 - this.left2 / this.timeLimit, 0, 1) * .85 + .1 : this.ph === 'quiet' ? 1 : .1;
    if (this.ph === 'phone') iphoneFrame(W / 2 - 130, 150, 260, 540, this.phT, (x, y, w, h) => findMyScreen(x, y + 34, w, h - 34, k, t, false), { tilt: .05, buzz: true });
    if (this.ph === 'clean' || (this.ph === 'quiet' && this.phT < 1)) {
      const a = this.ph === 'quiet' ? 1 - this.phT : 1;
      const mini = () => { ctx.globalAlpha = a; iphoneFrame(W - 210, 112, 170, 250, this.phT + 5, (x, y, w, h) => { findMyScreen(x, y + 30, w, h - 76, k, t, true); ctx.fillStyle = '#fff'; ctx.fillRect(x, y + h - 46, w, 46); const s = Math.ceil(this.left2 || 0); text(ctx, s + 's', x + w / 2, y + h - 22, { size: 24, color: s <= 10 ? '#ff3b30' : '#111', weight: 700 }); }, { tilt: .07, noPop: true, s: 1 }); ctx.globalAlpha = 1; };
      if (!PORT) mini();
    }
    // HUD
    if (this.ph === 'clean') {
      const cl = this.cats.filter(c => c.st !== 'dance').length, ms = this.mess.filter(x => x.hidden).length;
      if (PORT) {
        dockStat('Cats shooed', cl + ' / 8'); dockStat('Evidence hidden', ms + ' / 7');
        // Samantha's Find My map, live, in its own card under the scene: she gets closer as the clock runs down
        const left = Math.ceil(this.left2 || 0), kk = clamp(1 - (this.left2 || 0) / this.timeLimit, 0, 1) * .85 + .1;
        dockItem(150, y => {
          const x = 20, w = PW - 40, h = 150;
          ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5; rr(ctx, x, y, w, h, 26); fillP(ctx, '#1d1a20'); ctx.restore();
          ctx.save(); rr(ctx, x + 8, y + 8, w * .58, h - 16, 20); ctx.clip(); findMyScreen(x + 8, y + 8, w * .58, h - 16, kk, t, true); ctx.restore();
          const tx = x + w * .58 + 30;
          text(ctx, 'Find My', tx, y + 30, { size: 17, align: 'left', color: '#9a9aa6', weight: 700 });
          text(ctx, 'Samantha', tx, y + 62, { size: 27, align: 'left', color: '#fff', weight: 700 });
          rr(ctx, tx, y + 88, w * .42 - 50, 44, 14); fillP(ctx, left <= 10 ? '#ff3b30' : '#2f7cf6');
          text(ctx, 'Home in ' + left + 's', tx + (w * .42 - 50) / 2, y + 111, { size: 22, color: '#fff', weight: 700 });
        });
      } else {
      hudCard(250, 96, 330, 64);
      text(ctx, 'Cats shooed', 270, 116, { size: 15, align: 'left', color: '#8a6a5a', weight: 600 }); text(ctx, cl + ' / 8', 270, 142, { size: 24, align: 'left', color: '#3b2f2a', weight: 700 });
      text(ctx, 'Evidence hidden', 420, 116, { size: 15, align: 'left', color: '#8a6a5a', weight: 600 }); text(ctx, ms + ' / 7', 420, 142, { size: 24, align: 'left', color: '#3b2f2a', weight: 700 }); }
      showGoal({ msg: 'Samantha\'s nearly home! Shoo the cats and hide the party.', sub: PORT ? 'Tap every cat and every bit of party mess.' : 'Tap every cat, and tap the pizza, cups, glow sticks, streamers, disco ball, speaker and decks.', col: '#c8453b' }, t, true);
    } else if (this.ph === 'quiet') showGoal({ msg: this.res && this.res.stars > 1 ? 'Phew! Not a whisker out of place.' : 'Close call! Mostly tidy...', sub: 'Mona sits in the window, looking completely innocent.', col: '#2f9a5e' }, t, true);
    else if (this.ph === 'party') { const p = 1 + .05 * Math.sin(beat * Math.PI); ctx.save(); ctx.translate(W / 2, 200); ctx.scale(p, p); ctx.rotate(-.04); xTitle('Meanwhile...', 0, 0, 80, { seed: 6, wobble: true, t }); text(ctx, "Mona's secret Christmas party", 0, 56, { size: 28, color: '#fff', weight: 700, stroke: '#2a0a3a', sw: 7 }); ctx.restore(); }
    if (this.ph === 'quiet' && this.res && this.phT > .6) { const kk = E.back((this.phT - .6) / .5); ctx.save(); ctx.translate(W / 2, 250); ctx.scale(kk, kk); ctx.rotate(-.03); rr(ctx, -200, -50, 400, 100, 50); fillP(ctx, 'rgba(255,250,240,.95)'); starRow(0, -6, this.res.stars, 24, 64); text(ctx, 'Party hidden!', 0, 34, { size: 22, color: '#c8453b', weight: 700 }); ctx.restore(); }
  },
  vignette: true, lateHow: true
};
