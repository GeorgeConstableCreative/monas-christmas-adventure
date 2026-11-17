/* ============ v7.1: every remote button works like the real thing ============
   Power      - TV off / on
   TV         - Home screen (from anywhere)
   Back       - from an app back to Home
   Play/Pause - pauses whatever is on (the episode stops while paused)
   Mute       - mutes the sound (speaker icon on screen)
   Volume +/- - the volume bar
   Clickpad   - tap the ring (or swipe across the pad) for up/down/left/right, tap the middle to click.
                While a show is playing: left/right skips back/forward 10 seconds, down shows the info banner.
   The remote stands upright, fully in view, with every button big enough to tap. */
Object.assign(ATV_BTNS, { power: [50, -246, 12], volup: [38, 12, 26], voldown: [38, 86, 26] });
SCENES.remote._enter3 = SCENES.remote.enter;
{
  const R = SCENES.remote, baseEnter = Object.getOwnPropertyDescriptor(R, '_enter3').value;
  R.enter = function () { baseEnter.call(this); this.ppause = false; this.muted = false; this.vol = 6; this.osd = null; this.tvOff = false; this.cp = null; };
  delete R._enter3;
  const baseDrawTV = R.drawTV;
  R.drawTV = function (g, x, y, w, h, t) {
    if (this.tvOff) { g.fillStyle = '#0b0b0d'; g.fillRect(x, y, w, h); g.fillStyle = 'rgba(255,255,255,.06)'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + w * .4, y); g.lineTo(x, y + h * .6); g.fill(); return; }
    baseDrawTV.call(this, g, x, y, w, h, this.ppause ? this.pauseT : t);
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    if (this.ppause && this.tv !== 'home') { g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x, y, w, h); g.fillStyle = '#fff'; g.fillRect(x + w / 2 - 16, y + h / 2 - 22, 11, 44); g.fillRect(x + w / 2 + 5, y + h / 2 - 22, 11, 44);
      g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(x + 20, y + h - 22, w - 40, 5); g.fillStyle = '#fff'; g.fillRect(x + 20, y + h - 22, (w - 40) * (this.tv === 'soap' ? this.ep : .4), 5); }
    if (this.muted) { g.save(); g.translate(x + w - 26, y + 24); g.fillStyle = 'rgba(0,0,0,.55)'; g.beginPath(); g.arc(0, 0, 15, 0, TAU); g.fill(); rmGlyph(g, 'mute', 13, '#fff'); g.restore(); }
    const o = this.osd, ot = o ? this.t - o.t0 : 9;
    if (o && ot < 1.4) {
      g.globalAlpha = ot > 1.1 ? (1.4 - ot) / .3 : 1;
      if (o.kind === 'vol') { g.fillStyle = 'rgba(0,0,0,.6)'; g.beginPath(); g.roundRect(x + w - 34, y + 30, 20, h - 60, 10); g.fill(); g.fillStyle = '#fff'; const fh = (h - 68) * this.vol / 10; g.beginPath(); g.roundRect(x + w - 30, y + h - 34 - fh, 12, fh, 6); g.fill(); }
      else if (o.kind === 'skip') { g.fillStyle = 'rgba(0,0,0,.5)'; g.beginPath(); g.arc(x + w / 2 + o.dir * w * .28, y + h / 2, 30, 0, TAU); g.fill(); text(g, (o.dir > 0 ? '+' : '−') + '10s', x + w / 2 + o.dir * w * .28, y + h / 2 + 1, { size: 16, color: '#fff', weight: 800 }); }
      else if (o.kind === 'info') { g.fillStyle = 'rgba(15,15,25,.82)'; g.beginPath(); g.roundRect(x + 10, y + 10, w - 20, 52, 8); g.fill(); text(g, this.tv === 'soap' ? 'EastEnders' : 'Catwatch', x + 22, y + 28, { size: 14, color: '#fff', weight: 800, align: 'left' }); text(g, this.tv === 'soap' ? 'Christmas Special · Episode ' + (12 + this.zaps) : 'Slow-motion beach cats, all day', x + 22, y + 48, { size: 11, color: 'rgba(255,255,255,.75)', weight: 700, align: 'left' }); }
      g.globalAlpha = 1;
    }
    g.restore();
  };
  const baseNext = R.nextBtn;
  R.nextBtn = function () {
    if (this.finished || this.ending) return null;
    if (this.tvOff) return 'power';
    if (this.tv === 'soap' && this.ppause) return 'play';
    return baseNext.call(this);
  };
  const basePress = R.pressBtn;
  R.pressBtn = function (id) {
    if (this.finished) return;
    const beam = () => { this.beam = { t: 0, ok: true }; };
    if (id === 'power') { this.press = { id, t: 0 }; beam(); audio.sfx('blip'); this.tvOff = !this.tvOff; if (this.tvOff) this.say('sam', 'Why is it OFF?', 1.4); return; }
    if (this.tvOff) { this.press = { id, t: 0 }; audio.sfx('tick'); this.say('sam', 'The telly is off! Power button.', 1.4); return; }
    if (id === 'volup' || id === 'voldown') { this.press = { id: 'vol', t: 0 }; beam(); audio.sfx('tick'); this.vol = clamp(this.vol + (id === 'volup' ? 1 : -1), 0, 10); this.osd = { kind: 'vol', t0: this.t }; return; }
    if (id === 'mute') { this.press = { id, t: 0 }; beam(); audio.sfx('tick'); this.muted = !this.muted; return; }
    if (id === 'play') { this.press = { id, t: 0 }; beam(); audio.sfx('tick'); if (this.tv !== 'home') { this.ppause = !this.ppause; this.pauseT = this.t; if (this.ppause && this.tv === 'soap') this.say('sam', 'Kettle on, then...', 1.2); } return; }
    if (this.tv === 'soap' || this.tv === 'cat') {
      if (this.tv === 'soap' || id === 'left' || id === 'right' || id === 'down' || id === 'up' || (id === 'select' && this.tv === 'cat')) {
        if (id === 'left' || id === 'right') { this.press = { id, t: 0 }; beam(); audio.sfx('tick'); this.osd = { kind: 'skip', dir: id === 'right' ? 1 : -1, t0: this.t }; if (this.tv === 'soap' && !this.ppause) this.ep = clamp(this.ep + (id === 'right' ? .01 : -.01), 0, .99); return; }
        if (id === 'down' || id === 'up') { this.press = { id, t: 0 }; beam(); audio.sfx('tick'); this.osd = { kind: 'info', t0: this.t }; return; }
        if (id === 'select') { this.press = { id, t: 0 }; beam(); audio.sfx('tick'); this.osd = { kind: 'info', t0: this.t }; if (this.ppause) this.ppause = false; return; }
      }
    }
    if (id === 'tv' && this.tv === 'soap') { this.press = { id, t: 0 }; beam(); this.focus = 0; this.flipTo('home'); this.seq = true; this.zapT = 0; this.miss = 0; this.say('sam', 'Oops, wrong button.', 1.2); return; }
    if (id === 'back' && this.tv === 'soap') { this.press = { id, t: 0 }; beam(); audio.sfx('tick'); return; }
    this.ppause = false;
    basePress.call(this, id);
  };
  /* touch: buttons press on touch-down; the clickpad waits to see whether it's a tap or a swipe */
  const local = (r, P0) => { const dx = P0.x - r.x, dy = P0.y - r.y; return { x: (dx * Math.cos(-r.rot) - dy * Math.sin(-r.rot)) / r.s, y: (dx * Math.sin(-r.rot) + dy * Math.cos(-r.rot)) / r.s }; };
  const baseDown = R.down;
  R.down = function (X, Y) {
    if (this.finished) return;
    if (this.rem.k > .7 && this.remXf) {
      const L = local(this.remXf, PORT ? screenPt() : { x: X, y: Y });
      if (Math.abs(L.x) < 100 && L.y > -300 && L.y < 150) {
        if (dist(L.x, L.y, 0, -170) < 80) { this.cp = { x0: L.x, y0: L.y, x: L.x, y: L.y }; return; }
        let best = null; for (const id of ['power', 'back', 'tv', 'play', 'mute', 'volup', 'voldown']) { const [bx, by, r0] = ATV_BTNS[id]; const d = dist(L.x, L.y, bx, by); if (d < r0 + 18 && (!best || d < best.d)) best = { id, d }; }
        if (best) this.pressBtn(best.id); return;
      }
    }
    baseDown.call(this, X, Y);
  };
  R.move = function (X, Y) { if (!this.cp || !this.remXf) return; const L = local(this.remXf, PORT ? screenPt() : { x: X, y: Y }); this.cp.x = L.x; this.cp.y = L.y; };
  R.up = function (X, Y) {
    const c = this.cp; if (!c) return; this.cp = null;
    const dx = c.x - c.x0, dy = c.y - c.y0;
    if (Math.hypot(dx, dy) > 28) { this.pressBtn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up')); return; }
    const cd = dist(c.x0, c.y0, 0, -170);
    if (cd < 36) this.pressBtn('select'); else { const a = Math.atan2(c.y0 + 170, c.x0); this.pressBtn(Math.abs(a) < Math.PI / 4 ? 'right' : Math.abs(a) > Math.PI * .75 ? 'left' : a > 0 ? 'down' : 'up'); }
  };
  /* the remote stands upright and fully in view */
  const baseRem = R.drawRemoteAt;
  R.drawRemoteAt = function (cx, cy, s, aim) {
    const t = this.t, k = this.rem.k, a = REDUCE_MOTION ? 0 : lerp(-Math.PI / 2, clamp(Math.atan2(aim.x - cx, cy - 270 * s - aim.y), -.07, .07), E.back(k));
    const r = { x: cx, y: cy + (1 - E.out(k)) * 400, s, rot: a }; this.remXf = r;
    const next = this.rem.k > .9 ? this.nextBtn() : null, tipY = -270 * s;
    if (this.beam && this.beam.ok) { const tip = { x: r.x + Math.sin(a) * -tipY, y: r.y - Math.cos(a) * -tipY }, bk = 1 - this.beam.t / .35; ctx.save(); ctx.globalAlpha = bk; ctx.strokeStyle = '#ff5a6a'; ctx.lineWidth = 10 * bk + 2; ctx.setLineDash([16, 12]); ctx.lineDashOffset = -this.beam.t * 200; ctx.beginPath(); ctx.moveTo(tip.x, tip.y); ctx.lineTo(aim.x, aim.y); ctx.stroke(); ctx.restore(); }
    ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(a); ctx.scale(s, s);
    const pr = this.press && ['left', 'right', 'up', 'down'].includes(this.press.id) ? null : this.press;
    drawATVRemote(ctx, t, null, pr, 0);
    for (const [id, ax, ay, rot] of [['left', -50, -170, Math.PI], ['right', 50, -170, 0], ['up', 0, -218, -Math.PI / 2], ['down', 0, -122, Math.PI / 2]]) {
      const lit = this.press && this.press.id === id && this.press.t < .2; ctx.save(); ctx.translate(ax, ay); ctx.rotate(rot); ctx.beginPath(); ctx.moveTo(-4, -8); ctx.lineTo(5, 0); ctx.lineTo(-4, 8); ctx.strokeStyle = lit ? '#ffd84d' : 'rgba(255,255,255,.6)'; ctx.lineWidth = 3.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
    }
    if (this.cp) { circ(ctx, this.cp.x, this.cp.y, 14); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fill(); }
    if (next) {
      const [bx, by, br] = ATV_BTNS[next], p = .5 + .5 * Math.sin(t * 7), tap = Math.max(0, Math.sin(t * 5));
      ctx.save(); ctx.shadowColor = '#ffd84d'; ctx.shadowBlur = 22; circ(ctx, bx, by, (next === 'select' ? 36 : br) + 8 + p * 5); strokeP(ctx, '#ffd84d', 6); ctx.restore();
      drawHand(ctx, bx + 4, by + 6 + (1 - tap) * 22, 1, -.35, tap > .9);
    }
    ctx.restore();
    return r;
  };
  // size: show the remote from its top down to below the volume rocker
  const baseHud = R.hudP;
  R.hudP = function () {
    const A = this._pm[0]; if (!A || !DOCK) return;
    const keep = this.drawRemoteAt, me = this;
    this.drawRemoteAt = function (cx, cy, s, aim) { const y0 = DOCK.y0 + 30 + 112, avH = PH - SAFE_B - y0, s2 = clamp((avH - 8) / 400, .7, 1.5), rx = PW - 40 - 80 * s2; return keep.call(me, rx, y0 + 272 * s2, s2, aim); };
    try { baseHud.call(this); } finally { this.drawRemoteAt = keep; }
  };
  const baseStatus = R.statusText;
  R.statusText = function () {
    if (!this.finished && !this.ending) {
      if (this.tvOff) return ['The TV is off!', 'Press the power button, top right.'];
      if (this.tv === 'soap' && this.ppause) return ['Paused', 'Press Play/Pause to carry on.'];
    }
    return baseStatus.call(this);
  };
}
