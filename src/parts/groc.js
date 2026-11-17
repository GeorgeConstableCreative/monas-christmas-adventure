/* ============ Level 2: The Shopping - put it away, with Mona underfoot ============ */
const GR_W = 1660, GR_CAM = 210, GR_KX = 360;           // pantry wall 0..360, kitchen 360..1660
const GR_SPOT = { counter: [880, .72, 1], fridge: [1112, .74, 1], pantry: [262, .76, -1], bowls: [1430, .78, 1] };
const GR_ITEMS = [
  { k: 'eggnog', dest: 'fridge', target: ['D2', 1], ev: { bx: 1040, react: 'look', line: 'Mona, I need to get in the fridge!' } },
  { k: 'cereal', dest: 'pantry', target: ['P2', 4], ev: { bx: 560, react: 'louder', line: 'Mona! Get out from underneath my feet!' } },
  { k: 'milk', dest: 'fridge', target: ['B', 3], ev: { bx: 1010, react: 'flop', line: 'What are you doing?' } },
  { k: 'cranberry', dest: 'pantry', target: ['P3', 2], ev: { bx: 600, react: 'sulk', line: "I'll give you cuddles in a minute!" } },
  { k: 'treats', dest: 'pantry', target: ['P1', 5], ev: { bx: 520, react: 'beg', line: "Yes, they're YOUR treats. Patience, Mona!" } }
];
const FRIDGE_SH = { A: { x: 296, y: 318, n: 6, sw: 98 }, B: { x: 296, y: 500, n: 6, sw: 98 }, C: { x: 296, y: 668, n: 6, sw: 98 }, D1: { x: 990, y: 330, n: 2, sw: 84 }, D2: { x: 990, y: 520, n: 2, sw: 84 }, D3: { x: 990, y: 712, n: 2, sw: 84 } };
const FRIDGE_START = [['jam', 'A', 0], ['butter', 'A', 1], ['yogurt', 'A', 3], ['pickles', 'A', 5], ['eggs', 'B', 0], ['leftovers', 'B', 3], ['cheese', 'B', 4], ['cake', 'C', 0], ['leftovers2', 'C', 4], ['ketchup', 'D1', 0], ['mustard', 'D1', 1], ['oj', 'D2', 0], ['water', 'D3', 0], ['soda', 'D3', 1]];
const PANTRY_SH = { P1: { x: 300, y: 300, n: 6, sw: 104 }, P2: { x: 300, y: 505, n: 6, sw: 104 }, P3: { x: 300, y: 708, n: 6, sw: 104 } };
const PANTRY_START = [['flour', 'P1', 0], ['rice', 'P1', 1], ['cookies', 'P1', 3], ['oats', 'P1', 4], ['pasta', 'P2', 0], ['crackers', 'P2', 1], ['peanut', 'P2', 2], ['spices', 'P2', 5], ['soup', 'P3', 0], ['beans', 'P3', 1], ['beans2', 'P3', 2], ['tomatoes', 'P3', 3], ['soup3', 'P3', 5]];
const G_PAWS = [{ id: 'g1', x: 300, h: 470 }, { id: 'g2', x: 1560, s: .98 }, { id: 'g3', x: 700, h: 120 }, { id: 'g4', x: 1300, h: 420 }];
const GROC_SAY = { eggnog: 'Eggnog! That goes in the fridge.', cereal: 'Cereal. That lives in the pantry.', milk: 'Two big milks... fridge!', cranberry: 'Cranberry sauce for Christmas. Pantry!', treats: "And Mona's treats. Up high in the pantry!" };

function drawPantryWall(g, tod) {
  INK = true;
  try {
    wall(g, 0, 360, '#d3e3c6');
    const x = 50, y = 110, w = 250, h = 490;
    rr(g, x - 12, y - 12, w + 24, h + 12, 4); fillP(g, '#f3efe6');
    for (const dx of [0, w / 2]) { rr(g, x + dx + 3, y, w / 2 - 6, h, 3); fillP(g, '#f8f5ee'); rr(g, x + dx + 18, y + 20, w / 2 - 36, h * .42, 3); strokeP(g, 'rgba(0,0,0,.1)', 2); rr(g, x + dx + 18, y + h * .5, w / 2 - 36, h * .44, 3); strokeP(g, 'rgba(0,0,0,.1)', 2); }
    circ(g, x + w / 2 - 14, y + h * .48, 6); fillP(g, '#c9a24a'); circ(g, x + w / 2 + 14, y + h * .48, 6); fillP(g, '#c9a24a');
    rr(g, x + w / 2 - 46, y + 30, 92, 34, 6); fillP(g, '#3d4a3a'); text(g, 'PANTRY', x + w / 2, y + 48, { size: 18, color: '#fffaf0', weight: 700 });
    // calendar for December
    rr(g, 312, 180, 40, 54, 3); fillP(g, '#fffaf0'); g.fillStyle = '#e2443b'; g.fillRect(312, 180, 40, 12); text(g, 'DEC', 332, 186, { size: 9, color: '#fff', weight: 700 });
    for (let i = 0; i < 20; i++) { g.fillStyle = i === 17 ? '#e2443b' : 'rgba(0,0,0,.25)'; g.fillRect(316 + (i % 5) * 7, 198 + Math.floor(i / 5) * 8, 4, 4); }
    baseboard(g, 0, 360); woodFloor(g, 0, 360, FLOOR, '#bb6a3e', 13);
  } finally { INK = false; }
}
function pantryOpen(g, k) { // doors swing open, warm bulb inside
  if (k <= 0) return; const x = 50, y = 110, w = 250, h = 490, e = E.out(k);
  g.fillStyle = '#4a3020'; g.fillRect(x, y, w, h);
  const lg = g.createLinearGradient(0, y, 0, y + h); lg.addColorStop(0, 'rgba(255,214,150,.5)'); lg.addColorStop(1, 'rgba(255,214,150,.1)'); g.fillStyle = lg; g.fillRect(x, y, w, h);
  for (let i = 0; i < 4; i++) { g.fillStyle = '#b8864f'; g.fillRect(x, y + 90 + i * 110, w, 10); for (let j = 0; j < 6; j++) { g.fillStyle = ['#e2443b', '#f2c23e', '#3f74c9', '#2f9a52', '#e8a23a'][(i + j) % 5]; g.fillRect(x + 12 + j * 39, y + 50 + i * 110, 26, 40); } }
  const dw = (w / 2) * (1 - .78 * e);
  g.fillStyle = '#f8f5ee'; g.strokeStyle = OUT; g.lineWidth = 2;
  g.beginPath(); g.moveTo(x, y); g.lineTo(x - dw * .25, y - 6 * e); g.lineTo(x - dw * .25, y + h + 6 * e); g.lineTo(x, y + h); g.closePath(); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(x + w, y); g.lineTo(x + w + dw * .25, y - 6 * e); g.lineTo(x + w + dw * .25, y + h + 6 * e); g.lineTo(x + w, y + h); g.closePath(); g.fill(); g.stroke();
}
function fridgeOpen(g, k) { // kitchen-art coordinates
  if (k <= 0) return; const e = E.out(k);
  rr(g, 786, 136, 138, 444, 6); const ig = g.createLinearGradient(0, 136, 0, 580); ig.addColorStop(0, '#f4fbff'); ig.addColorStop(1, '#cfe2ee'); g.fillStyle = ig; g.fill();
  for (const y of [250, 340, 430]) { g.fillStyle = 'rgba(160,200,220,.7)'; g.fillRect(790, y, 130, 4); }
  for (let i = 0; i < 9; i++) { g.fillStyle = ['#e2443b', '#3f74c9', '#f2c23e', '#2f9a52', '#fff'][i % 5]; g.fillRect(800 + (i % 3) * 40, 216 + Math.floor(i / 3) * 90, 26, 34); }
  const dw = 150 * (1 - .7 * e);
  g.beginPath(); g.moveTo(930, 130); g.lineTo(930 + (150 - dw) * .55, 120); g.lineTo(930 + (150 - dw) * .55, 596); g.lineTo(930, 586); g.closePath(); g.fillStyle = '#c9cdd3'; g.fill(); g.strokeStyle = OUT; g.lineWidth = 2; g.stroke();
}
/* ---------- close-ups: first-person shelves ---------- */
function shelfItems(start) { return start.map(([k, sh, sl]) => ({ k, sh, sl, w: ITEM_W[k] || 1, x: 0, y: 0, wig: 0 })); }
function itemHome(shelves, it) { const S = shelves[it.sh]; return { x: S.x + (it.sl + it.w / 2) * S.sw, y: S.y }; }
function drawFridgeBody(g, t, light) {
  const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#3a2a40'); bg.addColorStop(1, '#22182a'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  // cabinet
  rr(g, 228, 64, 728, 830, 26); ink(g, '#b9bfc8', 3);
  rr(g, 256, 92, 672, 790, 16); const ig = g.createLinearGradient(0, 92, 0, 880); ig.addColorStop(0, '#f6fbff'); ig.addColorStop(1, '#d6e6f1'); g.fillStyle = ig; g.fill();
  // inner side walls for depth
  g.fillStyle = 'rgba(120,160,190,.18)'; g.beginPath(); g.moveTo(256, 92); g.lineTo(300, 130); g.lineTo(300, 846); g.lineTo(256, 882); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(928, 92); g.lineTo(884, 130); g.lineTo(884, 846); g.lineTo(928, 882); g.closePath(); g.fill();
  // crisper drawers
  for (const [x0, x1] of [[300, 586], [598, 884]]) { rr(g, x0, 700, x1 - x0, 150, 12); g.fillStyle = 'rgba(200,230,245,.6)'; g.fill(); g.strokeStyle = 'rgba(80,120,150,.5)'; g.lineWidth = 2; g.stroke(); }
  for (let i = 0; i < 6; i++) { circ(g, 340 + i * 44, 790 - (i % 2) * 14, 20); fillP(g, i % 2 ? '#e2443b' : '#7cc46a'); }
  for (let i = 0; i < 5; i++) { ell(g, 640 + i * 50, 792, 22, 14, .4); fillP(g, i % 2 ? '#f2a03c' : '#5aa04a'); }
  // the open door, swung towards us on the right
  g.beginPath(); g.moveTo(950, 70); g.lineTo(1216, 24); g.lineTo(1216, 930); g.lineTo(950, 888); g.closePath(); g.fillStyle = '#c4cad2'; g.fill(); g.strokeStyle = OUT; g.lineWidth = 3; g.stroke();
  g.beginPath(); g.moveTo(968, 96); g.lineTo(1196, 62); g.lineTo(1196, 890); g.lineTo(968, 862); g.closePath(); const dg = g.createLinearGradient(968, 0, 1196, 0); dg.addColorStop(0, '#eef6fb'); dg.addColorStop(1, '#d2e1ec'); g.fillStyle = dg; g.fill();
  // magnets on the outside edge
  g.fillStyle = '#e2443b'; circ(g, 1210, 200, 6); g.fill();
}
function drawFridgeFront(g, t) { // glass shelf edges + door-bin lips drawn over the items
  for (const k of ['A', 'B', 'C']) { const S = FRIDGE_SH[k], y = S.y; g.fillStyle = 'rgba(190,225,240,.45)'; g.fillRect(286, y, 610, 12); g.fillStyle = 'rgba(255,255,255,.8)'; g.fillRect(286, y, 610, 3); g.fillStyle = 'rgba(60,100,130,.35)'; g.fillRect(286, y + 12, 610, 3); }
  for (const k of ['D1', 'D2', 'D3']) { const S = FRIDGE_SH[k]; rr(g, S.x - 14, S.y - 34, S.sw * S.n + 28, 44, 8); g.fillStyle = 'rgba(200,232,248,.55)'; g.fill(); g.strokeStyle = 'rgba(70,110,140,.55)'; g.lineWidth = 2; g.stroke(); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(S.x - 10, S.y - 30, S.sw * S.n + 20, 3); }
  // LED strip + cool light
  rr(g, 380, 98, 430, 10, 5); fillP(g, '#ffffff'); glowAt(g, 595, 110, 420, '220,240,255', .5, .6);
}
function drawPantryBody(g, t) {
  const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#3a2a22'); bg.addColorStop(1, '#22160f'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  rr(g, 240, 70, 760, 830, 14); ink(g, '#f3efe6', 3);
  rr(g, 266, 96, 708, 800, 8); const wg = g.createLinearGradient(0, 96, 0, 896); wg.addColorStop(0, '#f2e2c4'); wg.addColorStop(1, '#d8c29c'); g.fillStyle = wg; g.fill();
  g.strokeStyle = 'rgba(140,100,60,.18)'; g.lineWidth = 2; for (let x = 286; x < 970; x += 28) { g.beginPath(); g.moveTo(x, 96); g.lineTo(x, 896); g.stroke(); }
  // the open doors either side
  for (const sd of [-1, 1]) { const x0 = sd < 0 ? 240 : 1000; g.beginPath(); g.moveTo(x0, 70); g.lineTo(x0 + sd * 200, 30); g.lineTo(x0 + sd * 200, 940); g.lineTo(x0, 900); g.closePath(); g.fillStyle = '#f8f5ee'; g.fill(); g.strokeStyle = OUT; g.lineWidth = 3; g.stroke(); rr(g, x0 + sd * 60 - (sd < 0 ? 80 : 0), 150, 80, 300, 4); g.strokeStyle = 'rgba(0,0,0,.08)'; g.stroke(); }
  // bulb
  line(g, 620, 96, 620, 120, '#5a4a3a', 3); circ(g, 620, 132, 14); fillP(g, '#fff4c8'); glowAt(g, 620, 132, 420, '255,220,150', .55, .7);
}
function drawPantryFront(g) {
  for (const k of ['P1', 'P2', 'P3']) { const S = PANTRY_SH[k], y = S.y; rr(g, 270, y, 700, 18, 3); g.fillStyle = '#b8864f'; g.fill(); g.strokeStyle = OUT; g.lineWidth = 2; g.stroke(); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(272, y + 2, 696, 3); }
}
function samHand(g, x, y, t) { // Samantha's hand at the bottom of the screen
  g.save(); g.translate(x, y);
  capO(g, -40, 120, -14, 24, 50, SC.sweater, 3);
  ell(g, 0, 8, 40, 26); ink(g, rad(g, 0, 4, 40, SC.skin), 3);
  for (let i = 0; i < 4; i++) { ell(g, -22 + i * 15, -6, 9, 15); ink(g, SC.skin, 2.4); }
  g.restore();
}

SCENES.groc = {
  enter() {
    audio.music('day');
    const self = this; spawnXf = (x, y) => self.sim ? self.sim.toScreen(x, y) : { x, y };
    GR_ITEMS.forEach(i => { i.evDone = false; }); this.res = null; this.resT0 = null; this.close = null; this.dest = null;
    this.idx = 0; this.st = 'enter'; this.stT = 0; this.trips = 0; this.cuddles = 0; this.bagOn = false; this.ov = 0; this.zk = 0;
    this.fridge = shelfItems(FRIDGE_START); this.pantry = shelfItems(PANTRY_START); this.fOpen = 0; this.pOpen = 0;
    for (const it of this.fridge) Object.assign(it, itemHome(FRIDGE_SH, it)); for (const it of this.pantry) Object.assign(it, itemHome(PANTRY_SH, it));
    this.sim = new Sim({
      RW: GR_W, cam: GR_CAM,
      sam: { x: 540, s: .84, face: 1, outfit: 'sweater', carry: true },
      mona: { x: 400, s: .95, face: 1, pose: 'walk', st: 'follow' },
      samIdle: dt => self.samIdle(dt), monaAI: dt => self.monaAI(dt), overlay: () => self.overlay()
    });
    this.sim.baseZ = 1.2; this.sim.baseF = { x: 640, y: 420 }; Object.assign(this.sim.z, { z: 1.2, target: 1.2, fx: 640, fy: 420, cx: 640, cy: 420, tfx: 640, tfy: 420, tcx: 640, tcy: 420 });
    this.sim.walkTo(GR_SPOT.counter[0], GR_SPOT.counter[1], () => { this.setSt('bagdown'); });
    this.segs = [
      { key: 'd-pantry', x0: 0, w: 360, draw: g => drawPantryWall(g, 'evening'), live: g => pantryOpen(g, this.pOpen) },
      { key: 'd-kit-evening', x0: GR_KX, w: KIT.w, draw: g => drawKitchen(g, 'evening'), live: g => { kitchenLive(g, this.t, 'evening'); drawKitchenXmas(g, this.t); fridgeOpen(g, this.fOpen); } }
    ];
  },
  setSt(s) { this.st = s; this.stT = 0; },
  item() { return GR_ITEMS[this.idx]; },
  samIdle(dt) { const S = this.sim.S; S.pose = S.carry ? 'carry' : 'stand'; return true; },
  monaAI(dt) {
    const sim = this.sim, M = sim.M, S = sim.S, R = M.react;
    if (M.st === 'goblock') { if (sim.moveM(M.bx, M.bs, 560, dt)) { M.st = 'block'; M.pose = 'sit'; M.face = S.x < M.x ? -1 : 1; } return true; }
    if (M.st === 'block') {
      M.face = S.x < M.x ? -1 : 1;
      if (R && R.on) {
        if (R.type === 'flop') { M.pose = 'belly'; M.eyes = 'happy'; }
        else if (R.type === 'sulk') { M.pose = 'loaf'; M.face = -M.face; M.eyes = 'judgy'; }
        else if (R.type === 'beg') { M.pose = 'beg'; M.eyes = 'wide'; M.mouth = Math.sin(this.t * 8) > 0 ? 'meow' : undefined; }
        else if (R.type === 'look') { M.pose = 'sit'; M.eyes = 'judgy'; M.tilt = .25; }
        else { M.pose = 'sit'; M.earsUp = true; M.mouth = Math.sin(this.t * 7) > 0 ? 'meow' : undefined; }
      } else M.pose = 'sit';
      return true;
    }
    if (M.st === 'aside') { if (sim.moveM(M.ax, M.as, 380, dt)) { M.pose = 'sit'; M.face = S.x < M.x ? -1 : 1; } M.asideT -= dt; if (M.asideT <= 0) M.st = 'follow'; return true; }
    if (M.st === 'eat' || M.st === 'treat') return false;
    if (M.st === 'bowls') { if (sim.moveM(GR_SPOT.bowls[0] + 60, GR_SPOT.bowls[1] + .03, 300, dt)) { M.pose = 'beg'; M.face = -1; } return true; }
    if (M.st === 'follow' && this.item() && this.item().k === 'treats' && S.carryItem === 'treats') { M.st = 'follow'; if (sim.moveM(S.x - S.face * 120, S.s + .04, 360, dt)) { M.pose = 'beg'; M.face = S.face; if (Math.random() < dt * 1.2) audio.sfx('meow', 1.3); } return true; }
    return false;
  },
  clearReact() { const M = this.sim.M; M.react = null; M.eyes = undefined; M.mouth = undefined; M.earsUp = false; M.tilt = 0; },
  startWalk(dest) {
    const sim = this.sim, it = this.item(), sp = GR_SPOT[dest];
    if (dest === 'counter' && (sim.M.st === 'goblock' || sim.M.st === 'block')) { this.clearReact(); sim.M.st = 'follow'; }
    this.dest = dest; this.setSt('walk');
    const go2 = () => sim.walkTo(sp[0], sp[1], () => { sim.S.face = sp[2]; this.arrive(dest); });
    this.resume = go2; go2();
  },
  monaDash() { const sim = this.sim, it = this.item(); if (!it.ev || it.evDone) return; it.evDone = true; const M = sim.M; this.clearReact(); M.st = 'goblock'; M.bx = it.ev.bx; M.bs = .76; audio.sfx('meow', 1.2); },
  arrive(dest) {
    const M0 = this.sim.M; if (M0.st === 'goblock' || M0.st === 'block') { this.clearReact(); M0.st = 'follow'; }
    if (dest === 'counter') { this.takeItem(); return; }
    const sim = this.sim, f = dest === 'fridge';
    const q = f ? backPt(GR_KX + 855, 330, sim.cam) : backPt(175, 340, sim.cam);
    sim.z.hold = 0; sim.zoomTo(2.3, q.x, q.y, 99); sim.z.hold = 99;
    this.setSt('zoomin'); audio.sfx(f ? 'door' : 'door');
    this.close = { kind: dest, t: 0, done: false, drag: null, items: f ? this.fridge : this.pantry, SH: f ? FRIDGE_SH : PANTRY_SH, knocks: 0, paw: null, nextPaw: 2.4, said: {} };
    const it = this.item(); this.close.newItem = { k: it.k, isNew: true, w: ITEM_W[it.k] || 1, x: 640, y: 1100, hx: 640, hy: 880, wig: 0 };
  },
  takeItem() {
    const sim = this.sim, it = this.item();
    sim.S.carry = true; sim.S.carryItem = it.k; audio.sfx('paper'); sim.say('sam', GROC_SAY[it.k], 2);
    const sp = sim.samP(); spawn('sparkle', sp.x + 40, sp.y - 140, 8);
    this.setSt('carry'); setTimeout(() => { if (this.st === 'carry' || this.st === 'walk') this.monaDash(); }, 700);
  },
  tryCuddle() {
    const sim = this.sim, M = sim.M, S = sim.S; if (this.st !== 'blocked') return false;
    this.clearReact(); S.face = M.x > S.x ? 1 : -1; this.cuddles++;
    S.act = null; sim.startAct('scoop', 2.1, { after: 'aside', then: () => { M.ax = clamp(S.x - S.face * 170, 80, GR_W - 80); M.as = clamp(S.s + .12, .7, 1.1); M.asideT = 4; this.setSt('walk'); this.resume(); } });
    sim.S.act.t = .35;
    const p = sim.monaP(); addPts(50, p.x, p.y - 170, 'Cuddle!'); sim.say('sam', pick(['Okay, okay. A quick cuddle!', 'Come here, you!', 'Who\'s my girl?']), 1.6);
    setTimeout(() => { if (sim.M.held) { sim.say('mona', 'Prrrrrrr...', 1.2); } }, 600);
    return true;
  },
  update(dt) {
    const sim = this.sim, S = sim.S, M = sim.M; this.stT += dt;
    sim.update(dt);
    this.fOpen = clamp(this.fOpen + dt * 3 * ((this.st === 'zoomin' || this.st === 'close' || this.st === 'closeDone') && this.dest === 'fridge' ? 1 : -1), 0, 1);
    this.pOpen = clamp(this.pOpen + dt * 3 * ((this.st === 'zoomin' || this.st === 'close' || this.st === 'closeDone') && this.dest === 'pantry' ? 1 : -1), 0, 1);
    if (this.st === 'bagdown' && this.stT > .1 && !this.bagOn) { this.bagOn = true; S.carry = false; audio.sfx('paper'); sim.say('sam', "Right! Let's get this lot put away.", 2.2); setTimeout(() => { sim.say('mona', 'Mrrp!', 1); audio.sfx('meow', .9); }, 1300); }
    if (this.st === 'bagdown' && this.stT > 1.5) this.setSt('pick');
    if (this.st === 'walk' && (M.st === 'goblock' || M.st === 'block')) {
      const dir = Math.sign((S.goal ? S.goal.x : S.x) - S.x), gap = (M.x - S.x) * dir;
      if (gap > 0 && gap < 135 && Math.abs(M.s - S.s) < .14) {
        S.goal = null; S.pose = S.carry ? 'carry' : 'stand'; S.face = dir; this.setSt('blocked'); M.st = 'block';
        const ev = this.item().ev; sim.say('sam', ev.line, 2.2); S.expr = 'grump'; comboBreak();
        const mp = sim.monaP(); sim.zoomTo(1.25, (mp.x + sim.samP().x) / 2, mp.y - 120, 99); sim.z.hold = 99;
        setTimeout(() => { if (this.st !== 'blocked') return; M.react = { type: ev.react, on: true }; const lines = { look: '...Mrrp?', louder: 'MRROWWW!!', flop: 'Prrrp~', sulk: 'Hmph.', beg: 'Treats? TREATS?!' }; sim.say('mona', lines[ev.react], 1.6); audio.sfx('meow', ev.react === 'louder' || ev.react === 'beg' ? 1.7 : .9); if (ev.react === 'louder') sim.shake = 5; }, 1000);
      }
    }
    if (this.st === 'blocked') {
      S.pose = S.carry ? 'carry' : 'stand';
      if (this.stT > 7.5 && !sim.busy()) { // she gives up waiting and squeezes past
        this.trips++; this.clearReact(); sim.startAct('trip', 1.3); sim.shake = 8; sim.say('sam', 'Whoa! Mona!', 1.2); audio.sfx('meow', 1.5);
        M.st = 'aside'; M.ax = clamp(M.x + 200, 80, GR_W - 80); M.as = clamp(M.s + .14, .7, 1.1); M.asideT = 3; this.setSt('trip');
      }
    }
    if (this.st === 'trip' && !sim.busy()) { sim.z.hold = .01; S.expr = 'smile'; this.setSt('walk'); this.resume(); }
    if (this.st === 'walk' && sim.z.hold > 50) sim.z.hold = .01;
    if (this.st === 'zoomin') { this.ov = Math.min(1, this.ov + dt * 2.6 * (this.stT > .45 ? 1 : 0)); if (this.ov >= 1) this.setSt('close'); }
    if (this.st === 'close' || this.st === 'closeDone') this.updClose(dt);
    if (this.st === 'closeDone' && this.stT > 1.1) { this.setSt('zoomout'); sim.z.hold = .01; audio.sfx('door'); }
    if (this.st === 'zoomout') {
      this.ov = Math.max(0, this.ov - dt * 2.8);
      if (this.ov <= 0) { this.idx++; this.close = null; resetGoal(); S.carry = false; S.carryItem = null; S.expr = 'smile'; if (this.idx >= GR_ITEMS.length) this.finish(); else { this.setSt('pick'); } }
    }
    if (this.st === 'finish') {
      if (this.stT > 3.4 && !this.res) { const st = this.trips === 0 ? 3 : this.trips === 1 ? 2 : 1; this.res = finishLevel('groc', st, GAME.pts); markDone('groc'); if (st < 3) this.res.tip = 'Tap Mona quickly when she blocks the way.'; }
    }
    if (M.st === 'follow' && this.st === 'pick' && Math.random() < dt * .08) { sim.say('mona', pick(MONA_CHAT), 1); audio.sfx('meow', .8); }
  },
  finish() {
    const sim = this.sim, S = sim.S, M = sim.M; this.setSt('finish'); audio.sfx('win');
    sim.say('sam', 'All done! And a treat for my helper.', 2.4); M.st = 'bowls';
    sim.walkTo(GR_SPOT.bowls[0] - 60, GR_SPOT.bowls[1], () => { S.face = 1; sim.startAct('pour', 1.4, { then: () => { sim.treats.push({ x: GR_SPOT.bowls[0] + 40, s: GR_SPOT.bowls[1] }); M.st = 'follow'; } }); });
  },
  /* ---------- close-up puzzle ---------- */
  free(SH, items, sh, sl, w, ignore) { const S = SH[sh]; if (sl < 0 || sl + w > S.n) return false; for (const o of items) { if (o === ignore || o.sh !== sh) continue; if (sl < o.sl + o.w && o.sl < sl + w) return false; } return true; },
  blockers() { const C = this.close, it = this.item(), [sh, sl] = it.target, w = ITEM_W[it.k] || 1; return C.items.filter(o => o.sh === sh && sl < o.sl + o.w && o.sl < sl + w); },
  updClose(dt) {
    const C = this.close; C.t += dt;
    const all = C.items.concat(C.done ? [] : [C.newItem]);
    for (const o of all) {
      if (C.drag && C.drag.o === o) continue;
      const hm = o.isNew ? { x: o.hx, y: o.hy } : itemHome(C.SH, o);
      o.vx = (o.vx || 0) + ((hm.x - o.x) * 180 - (o.vx || 0) * 22) * dt; o.vy = (o.vy || 0) + ((hm.y - o.y) * 180 - (o.vy || 0) * 22) * dt;
      o.x += o.vx * dt; o.y += o.vy * dt; o.wig = Math.max(0, o.wig - dt);
    }
    // Mona's paw tries for her treats
    if (!C.done && this.item().k === 'treats' && C.knocks < 2) {
      if (!C.paw) { C.nextPaw -= dt; if (C.nextPaw <= 0) { C.paw = { t: 0, tx: clamp(C.newItem.x, 300, 900), ty: clamp(C.newItem.y - 50, 560, 860) }; audio.sfx('meow', 1.4); } }
      else {
        const P = C.paw; P.t += dt; const k = P.t < .45 ? E.out(P.t / .45) : 1 - E.inOut((P.t - .45) / .5);
        P.x = lerp(140, P.tx, k); P.y = lerp(1000, P.ty, k);
        if (!P.hit && P.t > .4 && P.t < .55 && !P.booped && dist(P.x, P.y, C.newItem.x, C.newItem.y - 40) < 90) { P.hit = true; C.knocks++; if (C.drag && C.drag.o === C.newItem) C.drag = null; C.newItem.vy = -400; audio.sfx('swat'); spawn('pop', P.x, P.y - 60, 1, { label: 'SWIPE!', vx: 0, vy: -50, col: '#f2c14e', size: 34 }); C.sayT = { msg: C.knocks === 1 ? 'Mona! Those are for LATER!' : 'Nice try, missy!', t0: this.t }; }
        if (P.t > .95) { C.paw = null; C.nextPaw = rand(2.2, 3.4); }
      }
    }
  },
  closeDown(x, y) {
    const C = this.close; if (!C || C.done || this.st !== 'close') return;
    const cand = [C.newItem].concat(C.items.slice().reverse());
    for (const o of cand) { const S = o.isNew ? null : C.SH[o.sh], wpx = (o.w || 1) * (S ? S.sw : 98) * .46, h = ITEM_H[o.k] || 80; if (x > o.x - wpx && x < o.x + wpx && y > o.y - h - 10 && y < o.y + 14) { C.drag = { o, ox: x - o.x, oy: y - o.y }; o.vx = o.vy = 0; audio.sfx('tick'); return; } }
    if (C.paw && dist(x, y, C.paw.x, C.paw.y) < 90) { C.paw.booped = true; C.paw.t = Math.max(C.paw.t, .5); spawn('heart', x, y - 30, 5); audio.sfx('heart'); C.sayT = { msg: 'Boop! Paws off!', t0: this.t }; return; }
    if (dist(x, y, 150, 830) < 100) { spawn('heart', x, y - 40, 4); audio.sfx('meow', 1); C.sayT = { msg: pick(['Not for you, Mona!', 'Nosy girl!', 'Shoo, you!']), t0: this.t }; return; }
  },
  closeMove(x, y) { const C = this.close; if (!C || !C.drag) return; const o = C.drag.o; o.x = x - C.drag.ox; o.y = y - C.drag.oy; },
  closeUp(x, y) {
    const C = this.close; if (!C || !C.drag) return; const o = C.drag.o; C.drag = null;
    const it = this.item(), w = o.w || 1; let best = null;
    for (const key in C.SH) { const S = C.SH[key]; if (o.x < S.x - 30 || o.x > S.x + S.n * S.sw + 30) continue; const dy = Math.abs(o.y - S.y), raw = (o.x - S.x) / S.sw - w / 2; if (dy < 110 && (!best || dy < best.dy)) best = { key, dy, raw, sl: Math.round(raw) }; }
    if (!best) { if (o.isNew) audio.sfx('blip2'); return; }
    const sl = clamp(best.sl, 0, C.SH[best.key].n - w);
    if (o.isNew) {
      if (best.key === it.target[0] && Math.abs(best.raw - it.target[1]) < .95) {
        if (this.free(C.SH, C.items, best.key, it.target[1], w)) {
          const placed = { k: o.k, sh: best.key, sl: it.target[1], w, x: o.x, y: o.y, wig: 0 }; C.items.push(placed); C.done = true; this.setSt('closeDone');
          audio.sfx('chime'); const hm = itemHome(C.SH, placed); spawn('sparkle', hm.x, hm.y - 60, 18); addPts(100, hm.x, hm.y - 140, 'Put away!');
          C.sayT = { msg: pick(['Perfect!', 'Lovely. Next!', 'Tidy!']), t0: this.t };
        } else { this.blockers().forEach(b => b.wig = 1.2); audio.sfx('blip2'); C.sayT = { msg: 'No room! Move things out of the way first.', t0: this.t }; }
      } else { audio.sfx('blip2'); C.hint = 1.5; C.sayT = { msg: 'Not there... the glowing spot!', t0: this.t }; }
      return;
    }
    if (this.free(C.SH, C.items, best.key, sl, w, o)) { o.sh = best.key; o.sl = sl; audio.sfx('thud'); const tgt = it.target; if (this.blockers().length === 0 && !C.said.clear) { C.said.clear = 1; C.sayT = { msg: 'That\'s made room!', t0: this.t }; } }
    else audio.sfx('blip2');
  },
  drawClose() {
    const C = this.close, t = this.t, it = this.item(), f = C.kind === 'fridge', k = this.ov, e = E.out(k);
    ctx.save(); ctx.globalAlpha = k; ctx.translate(W / 2, H / 2); ctx.scale(.92 + .08 * e, .92 + .08 * e); ctx.translate(-W / 2, -H / 2);
    f ? drawFridgeBody(ctx, t) : drawPantryBody(ctx, t);
    // target spot
    if (!C.done) {
      const S = C.SH[it.target[0]], w = ITEM_W[it.k] || 1, x0 = S.x + it.target[1] * S.sw + 6, ww = w * S.sw - 12, hh = Math.min(150, (ITEM_H[it.k] || 100) + 16), pulse = .5 + .5 * Math.sin(t * 5);
      ctx.save(); glowAt(ctx, x0 + ww / 2, S.y - hh / 2, ww, '255,230,120', .25 + .2 * pulse); ctx.setLineDash([12, 8]); ctx.lineDashOffset = -t * 30; rr(ctx, x0, S.y - hh, ww, hh, 12); strokeP(ctx, '#ffcf3a', 5); ctx.restore();
    }
    // items, sorted by shelf so lips overlap them
    const items = C.items.slice().sort((a, b) => a.y - b.y);
    for (const o of items) { if (C.drag && C.drag.o === o) continue; contactShadow(ctx, o.x, o.y, (o.w || 1) * 40, 8, .3); ctx.save(); const wg = o.wig > 0 ? Math.sin(t * 40) * 4 * o.wig : 0; drawGroceryItem(ctx, o.k, o.x + wg, o.y, 1, t); ctx.restore(); }
    f ? drawFridgeFront(ctx, t) : drawPantryFront(ctx);
    // "move me" flags on whatever is in the way
    if (!C.done) { const bl = this.blockers(); bl.forEach((b, i) => { if (C.drag && C.drag.o === b) return; const bob = Math.sin(t * 6 + i) * 5; ctx.save(); ctx.translate(b.x, b.y - (ITEM_H[b.k] || 80) - 30 - i * 34 + bob); rr(ctx, -56, -18, 112, 36, 18); fillP(ctx, '#e2443b'); text(ctx, 'Move me', 0, 1, { size: 18, color: '#fff', weight: 700 }); ctx.restore(); }); }
    // Mona peeking in
    if (!C.done || true) drawMonaPeek(ctx, 150, 880, 1.15, { t, look: { x: .8, y: -.6 }, outfit: curOutfit(), paws: true, eyes: C.paw ? 'wide' : undefined, earsUp: !!C.paw });
    if (C.paw) drawRealPaw(ctx, 60, 1060, C.paw.x, C.paw.y, { s: 1.15, claws: !C.paw.booped, beans: true });
    // the new item in Samantha's hand, or being dragged
    if (!C.done) {
      const o = C.newItem, dragging = C.drag && C.drag.o === o;
      if (!dragging && dist(o.x, o.y, o.hx, o.hy) < 40) samHand(ctx, o.x, o.y + 6, t);
      ctx.save(); if (dragging) { ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 18; } drawGroceryItem(ctx, o.k, o.x, o.y, dragging ? 1.06 : 1, t); ctx.restore();
    }
    for (const o of items) if (C.drag && C.drag.o === o) { ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 18; drawGroceryItem(ctx, o.k, o.x, o.y, 1.06, t); ctx.restore(); }
    ctx.restore();
    if (k < .6) return;
    // instructions
    const name = it.k === 'treats' ? "Mona's treats" : (ITEM_NAME[it.k] || it.k).toLowerCase(), bl = C.done ? [] : this.blockers();
    const msg = C.done ? ['Lovely!', 'All put away.'] : bl.length ? ['Make room for the ' + name + '!', 'Drag ' + (bl.length > 1 ? 'those things' : 'that') + ' to an empty space, then put the ' + name + ' in.'] : [(it.k === 'treats' ? 'Put ' : 'Drag the ') + name + (it.k === 'treats' ? ' up in the glowing spot.' : ' into the glowing spot.'), it.k === 'treats' ? 'Up high, away from Mona! Tap her paw to boop it.' : 'Use your finger to slide it onto the shelf.'];
    ctx.save(); ctx.translate(0, -770); showGoal({ msg: msg[0], sub: msg[1], col: bl.length ? '#e2443b' : '#2f9a5e' }, t, false); ctx.restore();
    if (C.sayT && this.t - C.sayT.t0 < 2.4) speech(ctx, C.sayT.msg, 640, 700, C.sayT.t0, this.t, 420);
  },
  /* ---------- input ---------- */
  down(x, y) { if (this.st === 'close') { this.closeDown(x, y); return; } },
  move(x, y) { if (this.st === 'close') this.closeMove(x, y); },
  up(x, y) { if (this.st === 'close') this.closeUp(x, y); },
  tap(x, y) {
    if (this.st === 'close' || this.st === 'closeDone' || this.st === 'zoomin' || this.st === 'zoomout') return;
    const sim = this.sim, p = sim.inv(x, y);
    if (tapPawD(G_PAWS, p.x, p.y, sim.cam)) return;
    if (sim.onMona(p.x, p.y)) { if (this.tryCuddle()) return; spawn('heart', x, y - 40, 4); audio.sfx('meow', 1); if (this.st === 'finish') return; sim.say('mona', pick(MONA_CHAT), 1); return; }
    const bag = backPt(880, 380, sim.cam), fr = backPt(GR_KX + 855, 340, sim.cam), pa = backPt(175, 340, sim.cam);
    const near = (q, rx, ry) => Math.abs(p.x - q.x) < rx && Math.abs(p.y - q.y) < ry;
    if (this.st === 'pick') {
      if (near(bag, 120, 150) || near({ x: sim.samP().x, y: sim.samP().y - 120 }, 90, 160)) { if (Math.abs(sim.S.x - GR_SPOT.counter[0]) > 20) this.startWalk('counter'); else this.takeItem(); }
      else this.hintT = this.t;
      return;
    }
    if (this.st === 'carry') {
      const it = this.item(), hitF = near(fr, 120, 230), hitP = near(pa, 120, 230);
      if ((it.dest === 'fridge' && hitF) || (it.dest === 'pantry' && hitP)) this.startWalk(it.dest);
      else if (hitF || hitP) { sim.say('sam', hitF ? 'Not in the fridge, silly me!' : 'Hmm, not the pantry...', 1.6); sim.shake = 3; audio.sfx('blip2'); }
      else this.hintT = this.t;
    }
  },
  /* ---------- drawing ---------- */
  overlay() {
    const sim = this.sim, t = this.t, cam = sim.cam;
    if (this.bagOn) { const q = backPt(880, 428, cam), left = GR_ITEMS.slice(this.idx + (sim.S.carryItem ? 1 : 0)).map(i => i.k); drawGroceryBag(ctx, q.x, q.y, .5, left, t); }
    // where it goes
    if (this.st === 'carry') {
      const it = this.item(), q = it.dest === 'fridge' ? backPt(GR_KX + 855, 250, cam) : backPt(175, 250, cam), bob = Math.sin(t * 4) * 8;
      ctx.save(); ctx.translate(q.x, q.y - 40 + bob); bubble(ctx, 0, 0, 120, 92, 0, 1); drawGroceryItem(ctx, it.k, 0, 34, .55, t); ctx.restore();
      const hit = it.dest === 'fridge' ? backPt(GR_KX + 855, 340, cam) : backPt(175, 360, cam); targetArrow(hit.x, hit.y, t, { dir: 'right', r: 60 });
    }
    if (this.st === 'pick') { const q = backPt(880, 380, cam); targetArrow(q.x, q.y - 20, t, { dir: 'up', r: 60 }); }
    if (this.st === 'blocked') { const p = sim.monaP(); targetArrow(p.x, p.y - 50 * sim.M.s, t, { dir: 'down', r: 60 }); }
  },
  draw() {
    const sim = this.sim, t = this.t, cam = sim.cam;
    if (this.ov < 1) {
      sim.draw(() => {
        drawDiorama(ctx, this.segs, cam, GR_W, { floor: '#c56f40', wallL: '#d3e3c6', wallR: '#d3e3c6', ceil: '#fbf3e6', tod: 'evening' });
        drawXmasRug(ctx, 880, .9, 300, cam, t);
        drawBowls(ctx, GR_SPOT.bowls[0], GR_SPOT.bowls[1] + .02, cam);
        drawPawsD(G_PAWS, cam, t);
      }, [], t);
      // golden-hour kitchen light
      const Z = (x, y) => { const q = backPt(x, y, cam); return sim.toScreen(q.x, q.y); };
      const pend1 = Z(GR_KX + 560, 160), pend2 = Z(GR_KX + 1050, 160), win = Z(GR_KX + 1050, 280), tree = Z(GR_KX + 1190, 480), fr = Z(GR_KX + 855, 330), pa = Z(175, 330), ctr = Z(GR_KX + 400, 440);
      lightMap('30,14,48,.5', [
        { x: pend1.x, y: pend1.y + 160, r: 380, a: .85, col: '255,200,130', ca: .1, sy: .8 }, { x: pend2.x, y: pend2.y + 160, r: 360, a: .8, col: '255,200,130', ca: .1, sy: .8 },
        { x: win.x, y: win.y + 60, r: 300, a: .75, col: '255,170,110', ca: .1 }, { x: tree.x, y: tree.y, r: 260, a: .7 + .1 * Math.sin(t * 3), col: '255,150,90', ca: .12 },
        { x: ctr.x, y: ctr.y, r: 420, a: .55, col: '170,110,255', ca: .08, sy: .4 },
        { x: fr.x, y: fr.y, r: 320, a: this.fOpen * .9, col: '210,235,255', ca: .3 }, { x: pa.x, y: pa.y, r: 300, a: this.pOpen * .9, col: '255,220,150', ca: .3 },
        { x: W / 2, y: H * .55, r: 560, a: .4 }
      ]);
      ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(255,160,90,.32)'; ctx.fillRect(0, 0, W, H); ctx.restore();
    }
    if (this.ov > 0) this.drawClose();
    if (this.ov >= 1) { drawGrain(.035); return; }
    drawGrain(.04);
    // HUD: shopping list
    ctx.save(); ctx.translate(76, 0);
    hudCard(104, 18, 530, 64);
    text(ctx, 'Shopping put away', 124, 38, { size: 15, align: 'left', color: '#8a6a5a', weight: 600 });
    GR_ITEMS.forEach((g2, i) => { const x = 140 + i * 96, y = 62, done = i < this.idx || (i === this.idx && this.close && this.close.done); ctx.save(); ctx.globalAlpha = done ? 1 : i === this.idx ? .9 : .35; drawGroceryItem(ctx, g2.k, x + 40, y + 12, .26, t); ctx.restore(); if (done) { circ(ctx, x + 62, y - 2, 10); fillP(ctx, '#2f9a5e'); ctx.beginPath(); ctx.moveTo(x + 57, y - 2); ctx.lineTo(x + 61, y + 2); ctx.lineTo(x + 67, y - 6); strokeP(ctx, '#fff', 3); } });
    ctx.restore();
    scoreCard(950, 100, t, 'No trips');
    if (this.st === 'pick') showGoal({ msg: this.idx === 0 ? 'Tap the shopping bag to start.' : 'Next item! Tap the bag.', sub: (GR_ITEMS.length - this.idx) + ' left to put away.', col: '#2f9a5e' }, t);
    else if (this.st === 'carry') { const it = this.item(); showGoal({ msg: (it.k === 'treats' ? "Mona's treats go" : 'The ' + (ITEM_NAME[it.k] || it.k).toLowerCase() + (it.k === 'milk' ? ' goes' : ' goes')) + ' in the ' + it.dest + '.', sub: 'Tap the ' + it.dest + '!', col: '#2f9a5e' }, t); }
    else if (this.st === 'blocked') showGoal({ msg: "Mona's in the way! Tap her.", sub: 'Give her a quick cuddle.   +50 points', col: '#d8322c' }, t);
    else if (this.st === 'finish') showGoal({ msg: 'All put away!', sub: 'A treat for Mona.', col: '#2f9a5e' }, t);
    if (this.res) { if (this.resT0 == null) this.resT0 = this.t; doneCard(this.t - this.resT0, 'Shopping sorted!', 'Everything is put away' + (this.trips ? ', with ' + this.trips + ' little trip' + (this.trips > 1 ? 's' : '') + ' over Mona.' : ' and Samantha never tripped once!'), nextLabel(), () => storyNext(), () => go('groc', sceneParams), this.res); }
  }
};
