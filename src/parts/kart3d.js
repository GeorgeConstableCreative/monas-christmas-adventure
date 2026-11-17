/* ============ v7.8 ROOMBA RALLY at eye level ============
   A behind-the-roomba racing view: the hallway runner rolls towards you, bends sweep left and right,
   the other cats' roombas shrink into the distance. Each kart lives on the track as (z = how far round,
   x = side to side, -1 left kerb .. +1 right kerb).
   - Your roomba drives itself; Steer left/right (buttons, drag, keys) moves you across the track.
   - Bends push you towards the outside: steer into them to hold your line.
   - Touching the kerb slows you a little but never throws you off the track.
   - Pink chevron pads give a boost; bumping another roomba slows you. */
const RR3 = { segL: 200, roadW: 640, camH: 500, camBack: 1280, N: 120, vMax: 24, vBoost: 34 };
function rrCurve() {
  if (rrCurve.c) return rrCurve.c; const T = rrTrack(), n = T.length, hd = [], c = [];
  for (let i = 0; i < n; i++) { const p = T[i], q = T[(i + 1) % n]; hd.push(Math.atan2(q[1] - p[1], q[0] - p[0])); }
  for (let i = 0; i < n; i++) { let d = hd[(i + 1) % n] - hd[i]; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; c.push(d); }
  // smooth it so bends ease in and out
  const s = c.map((_, i) => { let a = 0; for (let k = -3; k <= 3; k++) a += c[(i + k + n) % n]; return a / 7; });
  return (rrCurve.c = s);
}
Object.assign(SCENES.kart, {
  enter() {
    this.res = null; this.over = null; this.overT = 0; audio.music('arcade');
    const n = rrTrack().length;
    const mk = (z, x, coat, col, me) => ({ z, x, v: 0, coat, col, me, lap: 0, boost: 0, skill: me ? 1 : rand(.84, .93), tx: x, done: false, place: 0, bump: 0 });
    this.karts = [mk(-2, -.35, null, '#ffd34d', true), mk(-2, .35, COATS.ginger, '#ff8a3a'), mk(2, -.35, COATS.black, '#c58cff'), mk(2, .35, COATS.white, '#7fd0ff')];
    this.me = this.karts[0]; this.count = 3.6; this.hold = { l: 0, r: 0 }; this.ptr = null; this.wheelS = 0; this.finishOrder = []; this.bgx = 0; this.n = n;
  },
  update(dt) {
    if (this.over) this.overT += dt;
    if (this.count > 0) { const c0 = Math.ceil(this.count); this.count -= dt; const c1 = Math.ceil(this.count); if (c1 !== c0) audio.sfx(c1 <= 0 ? 'ding' : 'tick'); return; }
    const C = rrCurve(), n = this.n, me = this.me; this.wheelS *= Math.exp(-dt * 6);
    const input = clamp((this.hold.r - this.hold.l) + (this.ptr ? clamp((this.ptr.x - this.ptr.x0) / 90, -1, 1) : 0) + this.wheelS, -1, 1);
    for (const k of this.karts) {
      const si = ((Math.floor(k.z) % n) + n) % n, cv = C[si];
      const vmax = (k.done && !k.me ? 0 : RR3.vMax * (k.me ? 1 : k.skill * (1 + clamp((me.z - k.z) / n * .5, -.06, .1)))) + (k.boost > 0 ? RR3.vBoost - RR3.vMax : 0);
      let target = vmax; if (Math.abs(k.x) > .92) target *= .72; if (k.bump > 0) target *= .6;
      k.v += (target - k.v) * Math.min(1, dt * (k.v < target ? 1.3 : 3));
      if (k.me && !k.done) {
        k.x += input * 2.1 * dt;                                // steering
        k.x -= cv * k.v * dt * .32;                            // bends push you to the outside
      } else {
        if (Math.random() < dt * .6) k.tx = clamp(-cv * 18 + rand(-.4, .4), -.75, .75);   // AI picks a line on the inside of bends
        k.x += clamp(k.tx - k.x, -1, 1) * dt * 1.6;
      }
      k.x = clamp(k.x, -1, 1);
      k.z += k.v * dt; k.boost = Math.max(0, k.boost - dt); k.bump = Math.max(0, k.bump - dt);
      const lap = Math.floor(k.z / n); if (lap > k.lap) { k.lap = lap; if (k.me && lap < RR_LAPS) { audio.sfx('chime'); spawn('pop', AS.x + AS.w / 2, AS.y + 200, 1, { label: lap === RR_LAPS - 1 ? 'FINAL LAP!' : 'LAP ' + (lap + 1), vx: 0, vy: -40, col: '#ffd34d', size: 48 }); } }
      if (k.lap >= RR_LAPS && !k.done) { k.done = true; this.finishOrder.push(k); k.place = this.finishOrder.length; if (k.me) this.end(); }
      for (const b of RR_BOOST) { const d = ((k.z - b) % n + n) % n; if (d < 1.2 && Math.abs(k.x) < .55 && k.boost <= 0) { k.boost = 1.2; if (k.me) { audio.sfx('power'); shake(.2); spawn('pop', AS.x + AS.w / 2, AS.y + 260, 1, { label: 'BOOST!', vx: 0, vy: -60, col: '#ff5a8a', size: 44 }); } } }
    }
    // bumps: only when nose to tail and side by side; the one behind slows and slides away
    for (const o of this.karts) if (o !== me) { let dz = o.z - me.z; dz = ((dz % n) + n * 1.5) % n - n / 2; if (Math.abs(dz) < .9 && Math.abs(o.x - me.x) < .32 && me.bump <= 0) { const behind = dz > 0 ? me : o; behind.bump = .5; const sd = Math.sign(me.x - o.x) || 1; me.x = clamp(me.x + sd * .18, -1, 1); o.x = clamp(o.x - sd * .18, -1, 1); audio.sfx('thud'); if (behind === me) shake(.15); } }
    this.bgx += C[((Math.floor(me.z) % n) + n) % n] * me.v * dt * 260;
  },
  place() { const s = this.karts.slice().sort((a, b) => (b.done ? 1e6 - b.place * 1000 : b.z) - (a.done ? 1e6 - a.place * 1000 : a.z)); return s.indexOf(this.me) + 1; },
  down(x, y) { this.ptr = { x0: x, x }; }, move(x, y) { if (this.ptr) this.ptr.x = x; }, up() { this.ptr = null; },
  draw() {
    const t = this.t, me = this.me, n = this.n, C = rrCurve(), T = rrTrack();
    arcOpen(t, '#efe0cb', '#c99a6a');
    const X0 = AS.x, Y0 = AS.y, Wd = AS.w, Hd = AS.h, cx = X0 + Wd / 2, hor = Y0 + Hd * .42, F = Wd * .9, R = RR3;
    // the far wall of the hallway: cream wall, skirting, a window and a tree that slide as the track bends
    ctx.fillStyle = '#f1e2cc'; ctx.fillRect(X0, Y0, Wd, hor - Y0); ctx.fillStyle = '#e4cfb2'; ctx.fillRect(X0, hor - 26, Wd, 26);
    const bx = ((-this.bgx % 1400) + 1400) % 1400;
    for (let k = -1; k < 2; k++) {
      const ox = X0 + bx + k * 1400;
      rr(ctx, ox + 120, Y0 + 40, 220, 160, 8); fillP(ctx, '#bcd8ec'); ctx.fillStyle = '#fff'; ctx.fillRect(ox + 226, Y0 + 40, 8, 160); ctx.fillRect(ox + 120, Y0 + 116, 220, 8);
      ctx.save(); ctx.translate(ox + 700, hor - 22); for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(0, -200 + i * 44); ctx.lineTo(70 + i * 16, -110 + i * 44); ctx.lineTo(-70 - i * 16, -110 + i * 44); ctx.closePath(); fillP(ctx, ['#2f7d3b', '#3a8f47', '#46a254', '#3f9a4f'][i]); } drawStarShape(ctx, 0, -205, 16, '#ffd34d', 2); ctx.fillStyle = '#7a4a2a'; ctx.fillRect(-12, 20, 24, 0); ctx.restore();
      [[1000, '#d8353f'], [1120, '#3f9a4f'], [1230, '#f2c14e']].forEach(([gx, c]) => { rr(ctx, ox + gx, hor - 80, 70, 58, 6); fillP(ctx, c); ctx.fillStyle = '#fff'; ctx.fillRect(ox + gx + 31, hor - 80, 8, 58); });
      ctx.save(); ctx.strokeStyle = '#2f7d3b'; ctx.lineWidth = 5; ctx.beginPath(); for (let x = 0; x <= 1400; x += 20) ctx.lineTo(ox + x, Y0 + 14 + Math.abs(Math.sin(x / 140)) * 22); ctx.stroke(); ctx.restore();
    }
    ctx.fillStyle = '#c99a6a'; ctx.fillRect(X0, hor, Wd, Y0 + Hd - hor);
    // project the track ahead
    const base = Math.floor(me.z), frac = me.z - base, camX = me.x * R.roadW * .78, P = [];
    let xo = 0, dxo = 0;
    for (let i = 0; i <= R.N; i++) {
      const si = (((base + i) % n) + n) % n, zz = (i - frac) * R.segL + R.camBack;
      if (i > 0) { dxo += C[si] * R.segL * .55; xo += dxo; }
      const sc = F / zz; P.push({ x: cx + (xo - camX) * sc, y: hor + R.camH * sc, w: R.roadW * sc, si, zz, xo });
    }
    const quad = (a, b, wa, wb, col) => { ctx.beginPath(); ctx.moveTo(a.x - wa, a.y); ctx.lineTo(a.x + wa, a.y); ctx.lineTo(b.x + wb, b.y); ctx.lineTo(b.x - wb, b.y); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); };
    let maxY = Y0 + Hd + 40;
    for (let i = R.N; i > 0; i--) {
      const a = P[i], b = P[i - 1]; if (b.y < a.y - .5) continue; const by = Math.min(b.y, maxY), bb = b.y > maxY ? Object.assign({}, b, { y: maxY }) : b;
      const band = Math.floor((base + i) / 3) % 2, si = a.si;
      ctx.fillStyle = band ? '#c99a6a' : '#bd8f60'; ctx.fillRect(X0, a.y, Wd, by - a.y + 1);
      quad(a, bb, a.w * 1.16, b.w * 1.16, Math.floor((base + i) / 2) % 2 ? '#ffffff' : '#d8353f');
      quad(a, bb, a.w, b.w, band ? '#73737d' : '#6c6c76');
      if (Math.floor((base + i) / 2) % 2) quad(a, bb, a.w * .025, b.w * .025, 'rgba(255,255,255,.8)');
      if (si < 2 || si > n - 1) for (let q = -4; q < 4; q++) { const x1 = a.x + a.w * q / 4, x2 = b.x + b.w * q / 4; ctx.beginPath(); ctx.moveTo(x1, a.y); ctx.lineTo(x1 + a.w / 4, a.y); ctx.lineTo(x2 + b.w / 4, by); ctx.lineTo(x2, by); ctx.fillStyle = (q + base + i) % 2 ? '#111' : '#fff'; ctx.fill(); }
      if (RR_BOOST.some(bp => si >= bp && si < bp + 3)) { const w = a.w * .5, y = (a.y + by) / 2; ctx.save(); ctx.globalAlpha = .9; ctx.strokeStyle = (si % 2) ? '#ff5a8a' : '#fff'; ctx.lineWidth = Math.max(2, (by - a.y) * .5); ctx.beginPath(); ctx.moveTo(a.x - w, by); ctx.lineTo(a.x, a.y); ctx.lineTo(a.x + w, by); ctx.stroke(); ctx.restore(); }
    }
    // the other roombas, far ones first
    const spr = [];
    for (const k of this.karts) if (k !== me) { let dz = k.z - me.z; dz = ((dz % n) + n * 1.5) % n - n / 2; if (dz > -.5 && dz < R.N - 2) spr.push({ k, dz }); }
    spr.sort((a, b) => b.dz - a.dz);
    for (const { k, dz } of spr) {
      const i0 = Math.max(0, Math.floor(dz + frac)), f = dz + frac - i0, A = P[Math.min(R.N, i0)], B = P[Math.min(R.N, i0 + 1)], zz = dz * R.segL + R.camBack, sc = F / zz;
      const sx = lerp(A.x, B.x, f) + (k.x * R.roadW * .78) * sc, sy = lerp(A.y, B.y, f); if (sy < hor) continue;
      this.roombaBack(sx, sy, sc * 2.1, k, t);
    }
    // Mona, just ahead of the camera
    const msc = F / R.camBack * 2.1, my = hor + R.camH * F / R.camBack, wob = Math.sin(t * 18) * (Math.abs(me.x) > .92 ? 3 : .6);
    this.roombaBack(cx + wob, my, msc, me, t, (this.hold.r - this.hold.l) + (this.ptr ? clamp((this.ptr.x - this.ptr.x0) / 90, -1, 1) : 0));
    if (Math.abs(me.x) > .92 && Math.random() < .5) spawn('dust', cx + Math.sign(me.x) * 70, my, 1);
    ctx.restore();
    // HUD
    const pl = this.over || this.place(), lap = Math.min(RR_LAPS, me.lap + 1);
    if (!PORT) { text(ctx, ['', '1st', '2nd', '3rd', '4th'][pl], AS.x + 30, AS.y + 70, { size: 64, align: 'left', color: pl === 1 ? '#ffd34d' : '#fff', weight: 700, stroke: '#1a0a28', sw: 9 }); text(ctx, 'LAP ' + lap + '/' + RR_LAPS, AS.x + AS.w - 30, AS.y + 60, { size: 34, align: 'right', color: '#fff', weight: 700, stroke: '#1a0a28', sw: 7 }); }
    // minimap
    ctx.save(); ctx.translate(PORT ? 640 : AS.x + AS.w - 190, PORT ? AS.y + 20 : AS.y + 20); rr(ctx, -10, -10, 160, 124, 14); fillP(ctx, 'rgba(0,0,0,.4)'); ctx.scale(.06, .06); ctx.beginPath(); T.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); strokeP(ctx, '#fff', 60);
    for (const k of this.karts) { const p = T[((Math.floor(k.z) % n) + n) % n]; circ(ctx, p[0], p[1], k.me ? 100 : 75); fillP(ctx, k.col); } ctx.restore();
    if (this.count > 0) { const c = Math.ceil(this.count); bigText(c > 3 ? 'READY?' : c > 0 ? String(c) : 'GO!', AS.x + AS.w / 2, AS.y + 220, 110, c > 0 ? '#fff' : '#6ef09a', 1 - (this.count % 1) + .3); }
    if (this.over) { ctx.fillStyle = 'rgba(11,16,32,.35)'; ctx.fillRect(AS.x, AS.y, AS.w, AS.h); bigText(['', '1ST PLACE!', '2ND PLACE', '3RD PLACE', '4TH PLACE'][this.over], AS.x + AS.w / 2, AS.y + 250, 90, '#ffd34d', this.overT * 2.5); }
    arcSide('kart', t, [['swipe', 'Drag left or right to steer'], ['pad', 'Steer into the bends'], ['keys', 'Left and right arrows']], [['Place', ['', '1st', '2nd', '3rd', '4th'][pl]], ['Lap', lap + ' / ' + RR_LAPS], ['Speed', Math.round(me.v * 4) + ' mph']], pl === 1 ? 'happy' : undefined);
    if (this.over) gameDone(this, this.overT, this.over === 1 ? 'Skate champion!' : 'Finished ' + ['', '1st', '2nd', '3rd', '4th'][this.over], this.over === 1 ? 'Mona skated rings round the competition.' : 'Steer into the bends and hit the pink boost pads!', this.res);
  },
  /* a roomba seen from behind with its cat on top. (x, y) = where it touches the floor; s = size */
  roombaBack(x, y, s, k, t, lean) {
    // a skateboard seen from behind, carving as it steers, with its cat standing on the deck
    if (s < .05) return;
    const ln = (lean || 0) * .12 + Math.sin(t * 3 + k.col.length) * .015;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(ln);
    ell(ctx, 0, 2, 70, 12); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fill();
    // wheels and the rear truck
    for (const sd of [-1, 1]) { ell(ctx, sd * 46, -9, 12, 11); ctx.fillStyle = '#f4efe4'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#1d1a1c'; ctx.stroke(); }
    rr(ctx, -40, -18, 80, 8, 4); ctx.fillStyle = '#9aa0a8'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = '#1d1a1c'; ctx.stroke();
    // the deck: grip tape on top, the coloured ply edge underneath, a kicked-up tail
    ctx.beginPath(); ctx.moveTo(-66, -26); ctx.quadraticCurveTo(-72, -40, -60, -42); ctx.lineTo(60, -42); ctx.quadraticCurveTo(72, -40, 66, -26); ctx.closePath(); ctx.fillStyle = k.col; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#1d1a1c'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-60, -42); ctx.lineTo(60, -42); ctx.lineTo(56, -48); ctx.lineTo(-56, -48); ctx.closePath(); ctx.fillStyle = '#2a2a30'; ctx.fill(); ctx.stroke();
    if (k.boost > 0) for (let i = 0; i < 4; i++) { circ(ctx, rand(-40, 40), 6 + i * 8, 8 - i * 1.5); ctx.fillStyle = 'rgba(255,120,160,.6)'; ctx.fill(); }
    ctx.restore();
    ctx.save(); ctx.translate(x, y - 44 * s); ctx.rotate(ln * 1.4); drawCat(ctx, 0, 0, .6 * s, { pose: 'stand', face: 1, t, outfit: k.coat ? 'none' : curOutfit(), eyes: 'happy', noShadow: true }, k.coat); ctx.restore();
  }
});
HOWTO.kart = { icon: 'drag', line: 'Your skateboard rolls by itself! Steer left and right to stay on the track: steer into the bends, dodge the other cats and hit the pink boost pads.' };
