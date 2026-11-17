/* ============ v3 Level: THE PANTRY ============
   Samantha puts away 7 new things. Each one shows where it goes (a glowing spot and a gift tag).
   Mona sits on the shelves and, now and then, knocks an older thing off. Catch it for a bonus;
   miss and it's a funny mess (a flour cloud, a rolling can, a burst bag of treats she dives into). */
const PN_SH = { P1: { x: 300, y: 300, n: 6, sw: 104, name: 'Top shelf' }, P2: { x: 300, y: 505, n: 6, sw: 104, name: 'Middle shelf' }, P3: { x: 300, y: 708, n: 6, sw: 104, name: 'Bottom shelf' } };
const PN_OLD = [['rice', 'P1', 0], ['oats', 'P1', 1], ['flour', 'P1', 4], ['beans', 'P2', 0], ['spices', 'P2', 2], ['soup', 'P2', 4], ['tomatoes', 'P3', 1], ['beans2', 'P3', 3]];
const PN_NEW = [
  { k: 'cereal', to: ['P1', 2], say: 'Cereal. Top shelf, next to the oats.' },
  { k: 'cranberry', to: ['P2', 1], say: 'Cranberry sauce for Christmas dinner!' },
  { k: 'pasta', to: ['P3', 0], say: 'Pasta. Bottom left.' },
  { k: 'cookies', to: ['P1', 3], say: 'Christmas cookies. Hands off, George.' },
  { k: 'peanut', to: ['P2', 3], say: 'Peanut butter... middle shelf.' },
  { k: 'treats', to: ['P3', 4], say: "Mona's treats. Bottom shelf." },
  { k: 'crackers', to: ['P3', 2], say: 'And crackers. Last one!' }
];
// after putting away item i, Mona has a go at the thing on her shelf (3 times in the whole level)
const PN_KNOCK = { 1: { sh: 'P1', k: 'flour' }, 3: { sh: 'P2', k: 'soup' }, 5: { sh: 'P3', k: 'treats' } };
const PN_HAND_L = { x: 1112, y: 640 }, PN_HAND_P = { x: 860, y: 770 };
const PN_BAG = () => PORT ? { x: 880, y: 905, s: .8 } : { x: 1120, y: 890, s: 1.15 };
function pnHome(o) { const S = PN_SH[o.sh]; return { x: S.x + (o.sl + .5) * S.sw, y: S.y }; }
function pnPerch(sh) { const S = PN_SH[sh]; return { x: S.x + 5.5 * S.sw, y: S.y }; }
SCENES.pantry = {
  enter() {
    this.items = PN_OLD.map(([k, sh, sl]) => ({ k, sh, sl, x: 0, y: 0, wig: 0 })); for (const o of this.items) Object.assign(o, pnHome(o));
    this.idx = 0; this.cur = null; this.drag = null; this.fall = null; this.mess = []; this.catches = 0; this.misses = 0; this.says = []; this.flourK = 0; this.finished = false; this.res = null;
    this.m = { sh: 'P1', x: pnPerch('P1').x, y: pnPerch('P1').y, st: 'sit', hop: null, stT: 0 };
    this.knock = null; this.nextItem(.6);
    audio.music('day');
  },
  say(who, msg, dur) { this.says = [{ who, msg, t0: this.t, dur: dur || 2.4 }]; },
  nextItem(delay) {
    if (this.idx >= PN_NEW.length) { this.cur = null; return; }
    const d = PN_NEW[this.idx]; const B = PN_BAG(), PN_HAND = PORT ? PN_HAND_P : PN_HAND_L; this.cur = { k: d.k, to: d.to, x: B.x, y: B.y - 10, tx: PN_HAND.x, ty: PN_HAND.y, delay: delay || 0, rise: 0, placed: false };
    this.say('sam', d.say);
  },
  slotOf(sh, sl) { return this.items.find(o => o.sh === sh && o.sl === sl && !o.gone); },
  update(dt) {
    const t = this.t, c = this.cur;
    this.flourK = Math.max(0, this.flourK - dt * .45);
    // the new item rises out of the bag into Samantha's hand
    if (c && !c.placed) {
      if (c.delay > 0) c.delay -= dt; else { c.rise = Math.min(1, c.rise + dt * 2.4); if (!this.drag && !c.fly) { const k = E.out(c.rise); const B = PN_BAG(); c.x = lerp(B.x, c.tx, k); c.y = lerp(B.y - 10, c.ty, k); } }
      if (c.fly) { c.fly.t += dt; const k = E.inOut(Math.min(1, c.fly.t / .45)), h = pnHome({ sh: c.to[0], sl: c.to[1] }); c.x = lerp(c.fly.x0, h.x, k); c.y = lerp(c.fly.y0, h.y, k) - Math.sin(k * Math.PI) * 120; if (c.fly.t >= .45) this.place(); }
    }
    // settle items with a little spring
    for (const o of this.items) { if (o.gone || o === (this.fall && this.fall.o)) continue; const h = pnHome(o); o.x += (h.x - o.x) * Math.min(1, dt * 12); o.y += (h.y - o.y) * Math.min(1, dt * 12); o.wig = Math.max(0, o.wig - dt); }
    // Mona
    const m = this.m; m.stT += dt;
    if (m.hop) { m.hop.t += dt; const k = Math.min(1, m.hop.t / m.hop.d), e = E.inOut(k); m.x = lerp(m.hop.x0, m.hop.x1, e); m.y = lerp(m.hop.y0, m.hop.y1, e) - Math.sin(k * Math.PI) * m.hop.h; if (k >= 1) { const after = m.hop.after; m.hop = null; if (after) after(); } }
    const K = this.knock;
    if (K) {
      K.t += dt;
      if (K.st === 'eye' && K.t > 1.3) { K.st = 'swat'; K.t = 0; m.st = 'swat'; audio.sfx('swat'); const o = K.o; this.fall = { o, vx: -90, vy: -60, rot: 0, vr: -3, t: 0 }; o.wig = 0; }
      if (K.st === 'swat' && K.t > .5) { m.st = 'sit'; K.st = 'watch'; }
    }
    // the falling thing
    const F = this.fall;
    if (F) {
      F.t += dt; F.vy += 1300 * dt; F.o.x += F.vx * dt; F.o.y += F.vy * dt; F.rot += F.vr * dt;
      if (F.caught) { F.caught.t += dt; const h = pnHome(F.o), k = E.inOut(Math.min(1, F.caught.t / .4)); F.o.x = lerp(F.caught.x, h.x, k); F.o.y = lerp(F.caught.y, h.y, k); F.rot = lerp(F.caught.r, 0, k); if (k >= 1) { this.fall = null; this.knock = null; } }
      else if (F.o.y > 880) this.splat();
    }
    // mess animations
    for (const ms of this.mess) {
      ms.t += dt;
      if (ms.kind === 'can') { ms.x += ms.vx * dt; ms.vx *= (1 - .25 * dt); ms.rot += ms.vx * dt / 30; if (ms.t > .2 && Math.floor(ms.t * 3) !== ms.lb) { ms.lb = Math.floor(ms.t * 3); if (ms.t < 2) audio.sfx('thud'); } }
    }
    if (m.st === 'eat' && m.stT > 3.2) { const p = pnPerch(m.sh); m.st = 'sit'; m.hop = { t: 0, d: .6, x0: m.x, y0: m.y, x1: p.x, y1: p.y, h: 160 }; this.knock = null; }
    // finished: all 7 away, nothing in the air
    if (m.st === 'swat' && (!K || K.st !== 'swat')) m.st = 'sit';
    if (!this.cur && !this.fall && !this.finished && (!this.knock || this.knock.st === 'watch' || this.knock.st === 'done')) this.finish();
    this.says = this.says.filter(s => t - s.t0 < s.dur);
  },
  place() {
    const c = this.cur; c.placed = true; const [sh, sl] = c.to;
    const o = { k: c.k, sh, sl, x: c.x, y: c.y, wig: 0 }; this.items.push(o);
    audio.sfx('chime'); const h = pnHome(o); spawn('sparkle', h.x, h.y - 60, 18); addPts(100, h.x, h.y - 150, 'Put away!');
    const i = this.idx; this.idx++;
    const kn = PN_KNOCK[i];
    if (kn) this.startKnock(kn);
    this.nextItem(kn ? 2.6 : .5);
    if (!kn && this.idx < PN_NEW.length && Math.random() < .5) this.say('sam', pick(['Lovely.', 'Next!', 'Tidy!', 'Perfect.']), 1.2);
  },
  startKnock(kn) {
    const m = this.m, o = this.items.find(x => x.k === kn.k && x.sh === kn.sh && !x.gone); if (!o) return;
    const go = () => { this.knock = { o, st: 'eye', t: 0 }; o.wig = 1.3; audio.sfx('meow', 1.3); this.say('sam', pick(['Mona... don\'t you dare.', 'Mona. MONA. No.', 'I can see you, missy.']), 1.6); };
    if (m.sh === kn.sh) go(); else { const p = pnPerch(kn.sh); m.sh = kn.sh; m.hop = { t: 0, d: .55, x0: m.x, y0: m.y, x1: p.x, y1: p.y, h: 90, after: go }; audio.sfx('whoosh'); }
  },
  splat() {
    const F = this.fall, o = F.o; this.fall = null; this.misses++; o.gone = true; shake(.5);
    if (o.k === 'flour') { this.flourK = 1; this.mess.push({ kind: 'flour', x: o.x, y: 890, t: 0 }); for (let i = 0; i < 60; i++) spawn('dust', o.x + rand(-80, 80), 880 - rand(0, 120), 1, { col: 'rgba(255,255,255,.95)', vx: rand(-260, 260), vy: rand(-380, -60), max: rand(1, 2.2), s: rand(1.5, 3) }); audio.sfx('thud'); this.say('sam', 'FLOUR?! Mona, it\'s everywhere!', 2.2); }
    else if (o.k === 'treats') {
      this.mess.push({ kind: 'treats', x: o.x, y: 890, t: 0 }); audio.sfx('pop'); for (let i = 0; i < 40; i++) spawn('confetti', o.x, 860, 1, { col: pick(['#b7773a', '#8a5a2a', '#d49a5a']), vx: rand(-360, 360), vy: rand(-500, -200), g: 1200, max: 1.4 });
      const m = this.m; m.hop = { t: 0, d: .6, x0: m.x, y0: m.y, x1: o.x + 40, y1: 900, h: 80, after: () => { m.st = 'eat'; m.stT = 0; audio.sfx('chomp'); } }; this.knock.st = 'done';
      this.say('sam', 'Treat explosion! Well... she\'s happy.', 2.4);
    } else { this.mess.push({ kind: 'can', k: o.k, x: o.x, y: 880, vx: -320, rot: 0, t: 0 }); audio.sfx('thud'); this.say('sam', 'Clang! There it goes... under the fridge.', 2.2); }
  },
  finish() {
    this.finished = true; const stars = this.catches >= 2 ? 3 : this.catches === 1 ? 2 : 1;
    this.res = finishLevel('pantry', stars, GAME.pts); markDone('pantry'); audio.sfx('win'); this.endT = this.t;
    this.say('sam', this.catches >= 2 ? 'All away, and hardly a mess!' : 'All away! I\'ll sweep up later...', 2.6);
    setTimeout(() => { if (sceneName === 'pantry' && this.finished) { if (inStory()) storyNext(); else go('levels'); } }, 3200);
  },
  hitItem(x, y, c) { const h = ITEM_H[c.k] || 90; return x > c.x - 60 && x < c.x + 60 && y > c.y - h - 20 && y < c.y + 20; },
  down(x, y) {
    if (this.finished) return;
    const F = this.fall;
    if (F && !F.caught && dist(x, y, F.o.x, F.o.y - 40) < 110) { F.caught = { t: 0, x: F.o.x, y: F.o.y, r: F.rot }; F.vx = F.vy = 0; this.catches++; audio.sfx('star'); spawn('sparkle', x, y, 20); addPts(150, x, y - 70, 'Caught!'); this.say('sam', pick(['Nice catch!', 'Got it! Nice try, Mona.', 'Saved!']), 1.6); this.knock.st = 'done'; return; }
    const c = this.cur; if (!c || c.placed || c.fly || c.rise < .6) return;
    if (this.hitItem(x, y, c)) { this.drag = { ox: x - c.x, oy: y - c.y }; audio.sfx('tick'); return; }
    // or just tap the glowing spot
    const h = pnHome({ sh: c.to[0], sl: c.to[1] }); if (Math.abs(x - h.x) < 60 && y > h.y - 150 && y < h.y + 20) { c.fly = { t: 0, x0: c.x, y0: c.y }; audio.sfx('whoosh'); return; }
    if (dist(x, y, this.m.x, this.m.y - 60) < 80) { spawn('heart', x, y - 30, 5); audio.sfx('meow', 1.1); }
  },
  move(x, y) { if (!this.drag || !this.cur) return; this.cur.x = x - this.drag.ox; this.cur.y = y - this.drag.oy; },
  up(x, y) {
    if (!this.drag) return; this.drag = null; const c = this.cur, h = pnHome({ sh: c.to[0], sl: c.to[1] });
    if (Math.abs(c.x - h.x) < 80 && Math.abs(c.y - h.y) < 90) { c.fly = { t: .3, x0: c.x, y0: c.y }; }
    else {
      // dropped somewhere else: back to the hand, with a nudge to the glowing spot
      let shelf = null; for (const k in PN_SH) if (Math.abs(c.y - PN_SH[k].y) < 90 && c.x > 260 && c.x < 980) shelf = k;
      audio.sfx('blip2'); this.say('sam', shelf && shelf !== c.to[0] ? 'Not that shelf... the ' + PN_SH[c.to[0]].name.toLowerCase() + '!' : 'Over there, where it\'s glowing.', 1.6);
      const PN_HAND = PORT ? PN_HAND_P : PN_HAND_L; c.rise = .6; c.tx = PN_HAND.x; c.ty = PN_HAND.y; c.x = lerp(c.x, PN_HAND.x, .2); c.y = lerp(c.y, PN_HAND.y, .2); c.rise = 1;
    }
  },
  tap() { },
  draw() {
    const t = this.t, c = this.cur;
    ctx.drawImage(cached('pantry-close', W, H, g => drawPantryBody(g, 0)), 0, 0, W, H);
    // the destination: glowing spot + a gift tag naming the shelf, and a dotted arc from the item to it
    if (c && !c.placed && c.rise > .5) {
      const S = PN_SH[c.to[0]], h = pnHome({ sh: c.to[0], sl: c.to[1] }), hh = Math.min(150, (ITEM_H[c.k] || 90) + 20), pulse = .5 + .5 * Math.sin(t * 5);
      glowAt(ctx, h.x, h.y - hh / 2, 130, '255,230,120', .3 + .25 * pulse);
      ctx.save(); ctx.setLineDash([12, 8]); ctx.lineDashOffset = -t * 30; rr(ctx, h.x - 46, h.y - hh, 92, hh, 12); strokeP(ctx, '#ffcf3a', 5); ctx.restore();
      if (!this.drag && !c.fly) { ctx.save(); ctx.setLineDash([4, 12]); ctx.lineCap = 'round'; ctx.lineDashOffset = t * 40; ctx.beginPath(); ctx.moveTo(c.x - 40, c.y - 60); ctx.quadraticCurveTo((c.x + h.x) / 2, Math.min(c.y, h.y) - 160, h.x + 20, h.y - hh - 10); strokeP(ctx, 'rgba(255,214,90,.85)', 6); ctx.restore(); }
      // the tag
      const jg = jiggle(t, 4.2); ctx.save(); ctx.translate(h.x, h.y - hh - 44); ctx.rotate(-.06 + jg.rot); ctx.scale(jg.sx, jg.sy);
      rr(ctx, -78, -22, 156, 44, 10); ink(ctx, '#fff6e6', 2.4); circ(ctx, -62, 0, 5); strokeP(ctx, '#c8453b', 2); text(ctx, S.name, 8, 1, { size: 19, color: '#c8453b', weight: 700 }); ctx.restore();
    }
    // shelves' stock
    const order = this.items.filter(o => !o.gone && o !== (this.fall && this.fall.o)).sort((a, b) => a.y - b.y);
    for (const o of order) { contactShadow(ctx, o.x, o.y, 40, 8, .3); const wg = o.wig > 0 ? Math.sin(t * 40) * 5 * o.wig : 0; ctx.save(); ctx.translate(o.x + wg, o.y); ctx.rotate(wg * .01); drawGroceryItem(ctx, o.k, 0, 0, 1, t); ctx.restore(); }
    drawPantryFront(ctx);
    // the mess on the floor
    for (const ms of this.mess) {
      if (ms.kind === 'flour') { ctx.save(); ctx.globalAlpha = .9; for (let i = 0; i < 9; i++) { ell(ctx, ms.x - 120 + i * 30, ms.y - 4 + Math.sin(i * 2.1) * 6, 46, 14); fillP(ctx, '#fbfaf6'); } ctx.restore(); ctx.save(); ctx.translate(ms.x, ms.y - 30); ctx.rotate(.7); drawGroceryItem(ctx, 'flour', 0, 30, .9, t); ctx.restore(); }
      if (ms.kind === 'can') { ctx.save(); ctx.translate(ms.x, ms.y - 30); ctx.rotate(ms.rot); drawGroceryItem(ctx, ms.k, 0, 33, 1, t); ctx.restore(); }
      if (ms.kind === 'treats') { for (let i = 0; i < 26; i++) { const a = i * 2.39, r = 20 + (i * 37 % 110); ell(ctx, ms.x + Math.cos(a) * r, ms.y + Math.sin(a) * r * .18, 7, 5, a); ink(ctx, i % 2 ? '#b7773a' : '#8a5a2a', 1.4); } ctx.save(); ctx.translate(ms.x - 30, ms.y - 10); ctx.rotate(-1.2); drawGroceryItem(ctx, 'treats', 0, 30, .9, t); ctx.restore(); }
    }
    // Mona on her perch (or down in the treats)
    const m = this.m, K = this.knock, eyeing = K && K.st === 'eye';
    const look = eyeing ? { x: -1, y: .3 } : this.fall ? { x: -.4, y: 1 } : { x: Math.sin(t * .6) * .7, y: .2 };
    drawMona(ctx, m.x, m.y, .62, { pose: m.hop ? 'pounce' : m.st === 'eat' ? 'eat' : m.st === 'swat' ? 'swat' : 'sit', face: m.st === 'eat' ? 1 : -1, t, outfit: curOutfit(), look, eyes: eyeing ? 'wide' : m.st === 'eat' ? 'happy' : undefined, earsUp: eyeing, swatK: m.st === 'swat' ? 1 : 0 });
    if (eyeing) { const p = .5 + .5 * Math.sin(t * 9); text(ctx, '!', m.x - 6, m.y - 150 - p * 8, { size: 54, color: '#e2443b', weight: 700, stroke: '#fff', sw: 6 }); }
    if (m.st === 'eat' && Math.random() < .2) spawn('pop', m.x + 30, m.y - 80, 1, { label: pick(['nom', 'crunch', 'NOM']), vx: rand(-20, 20), vy: -60, col: '#8a5a2a', size: 24, max: .8 });
    // the falling thing
    if (this.fall) { const F = this.fall; ctx.save(); ctx.translate(F.o.x, F.o.y - 40); ctx.rotate(F.rot); drawGroceryItem(ctx, F.o.k, 0, 40, 1, t); ctx.restore(); if (!F.caught) { const p = .5 + .5 * Math.sin(t * 14); ctx.save(); ctx.globalAlpha = .6 + .4 * p; circ(ctx, F.o.x, F.o.y - 40, 70 + p * 10); strokeP(ctx, '#ffcf3a', 5); ctx.restore(); text(ctx, 'TAP TO CATCH!', F.o.x, F.o.y - 140, { size: 26, color: '#fff', weight: 700, stroke: '#c8453b', sw: 7 }); } }
    // Grocery Outlet bag and Samantha's hand holding the new thing
    const left = PN_NEW.slice(this.idx + (c && !c.placed ? 1 : 0)).map(d => d.k);
    { const B = PN_BAG(); drawGroceryBag(ctx, B.x, B.y, B.s, left, t); }
    if (c && !c.placed && c.delay <= 0) {
      const dragging = !!this.drag;
      if (!dragging && !c.fly && c.rise > .9) samHand(ctx, c.x, c.y + 6, t);
      ctx.save(); if (dragging || c.fly) { ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 18; } drawGroceryItem(ctx, c.k, c.x, c.y, dragging ? 1.08 : 1, t); ctx.restore();
    }
    // flour haze over everything
    if (this.flourK > 0) { ctx.fillStyle = 'rgba(255,255,255,' + (this.flourK * .7) + ')'; ctx.fillRect(0, 0, W, H); }
    lightMap('40,24,16,.18', [{ x: 620, y: 132, r: 700, a: .9, col: '255,220,150', ca: .12 }]);
    drawGrain(.04);
    // HUD
    if (PORT) { dockStat('Put away', this.idx + ' / 7'); dockStat('Catches', this.catches); } else {
    ctx.save(); ctx.translate(122, 250); ctx.rotate(-.04); hudCard(-96, -70, 192, 140);
    text(ctx, 'Put away', 0, -46, { size: 16, color: '#8a6a5a', weight: 600 }); text(ctx, this.idx + ' / 7', 0, -16, { size: 30, color: '#3b2f2a', weight: 700 });
    text(ctx, 'Catches', 0, 18, { size: 16, color: '#8a6a5a', weight: 600 }); text(ctx, String(this.catches), 0, 46, { size: 30, color: '#3b2f2a', weight: 700 }); ctx.restore(); }
    for (const s of this.says) speech(ctx, s.msg, s.who === 'sam' ? 1010 : m.x, s.who === 'sam' ? 470 : m.y - 160, s.t0, t, 330);
    if (this.finished && this.res) { const kk = E.back(clamp((t - this.endT) / .5, 0, 1)); ctx.save(); ctx.translate(W / 2, 250); ctx.scale(kk, kk); ctx.rotate(-.03); rr(ctx, -210, -50, 420, 100, 50); fillP(ctx, 'rgba(255,250,240,.96)'); starRow(0, -6, this.res.stars, 24, 64); text(ctx, 'Pantry sorted!', 0, 34, { size: 22, color: '#2f9a5e', weight: 700 }); ctx.restore(); }
  }
};
