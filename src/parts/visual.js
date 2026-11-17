/* ============ v2 visuals: light maps, glow, grain ============ */
let GRAIN = null;
function grainPattern() {
  if (GRAIN) return GRAIN;
  const c = document.createElement('canvas'); c.width = c.height = 180; const g = c.getContext('2d');
  const im = g.createImageData(180, 180), r = mulberry(99);
  for (let i = 0; i < im.data.length; i += 4) { const v = 100 + r() * 155; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  g.putImageData(im, 0, 0); GRAIN = ctx.createPattern(c, 'repeat'); return GRAIN;
}
function drawGrain(a) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a || .045; ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = grainPattern(); ctx.fillRect(0, 0, cv.width, cv.height); ctx.restore();
}
/* soft coloured glow, added on top (col = 'r,g,b') */
function glowAt(g, x, y, r, col, a, sy) {
  if (a <= 0 || r <= 0) return;
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, 'rgba(' + col + ',' + a + ')'); gr.addColorStop(.3, 'rgba(' + col + ',' + a * .5 + ')'); gr.addColorStop(1, 'rgba(' + col + ',0)');
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = gr;
  if (sy) { g.translate(x, y); g.scale(1, sy); g.translate(-x, -y); }
  g.fillRect(x - r, y - r, r * 2, r * 2); g.restore();
}
/* a soft blurred shadow on the floor */
function contactShadow(g, x, y, rx, ry, a) {
  const gr = g.createRadialGradient(x, y, 0, x, y, rx);
  gr.addColorStop(0, 'rgba(25,10,4,' + (a || .38) + ')'); gr.addColorStop(.6, 'rgba(25,10,4,' + (a || .38) * .4 + ')'); gr.addColorStop(1, 'rgba(25,10,4,0)');
  g.save(); g.translate(x, y); g.scale(1, ry / rx); g.translate(-x, -y); g.fillStyle = gr; g.fillRect(x - rx, y - rx, rx * 2, rx * 2); g.restore();
}
/* darkness with real holes cut out where the lights are. lights: [{x,y,r,a,sy,col,ca,cr}] in screen space */
const LM = { c: null, g: null };
function lightMap(ambient, lights) {
  if (!LM.c) { LM.c = document.createElement('canvas'); LM.c.width = W / 2; LM.c.height = H / 2; LM.g = LM.c.getContext('2d'); }
  const g = LM.g; g.setTransform(.5, 0, 0, .5, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H);
  g.fillStyle = 'rgba(' + ambient + ')'; g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = 'destination-out';
  for (const L of lights) {
    if (!(L.a > 0)) continue;
    const gr = g.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.r);
    gr.addColorStop(0, 'rgba(0,0,0,' + L.a + ')'); gr.addColorStop(L.k || .45, 'rgba(0,0,0,' + L.a * .62 + ')'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.save(); g.fillStyle = gr; if (L.sy) { g.translate(L.x, L.y); g.scale(1, L.sy); g.translate(-L.x, -L.y); } g.fillRect(L.x - L.r, L.y - L.r, L.r * 2, L.r * 2); g.restore();
  }
  ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.drawImage(LM.c, 0, 0, W, H); ctx.restore();
  for (const L of lights) if (L.col) glowAt(ctx, L.x, L.y, L.r * (L.cr || .75), L.col, (L.ca == null ? .16 : L.ca) * (L.a || 1), L.sy);
}
/* warm, glowing fairy bulb (screen space, already lit) */
function bulb(g, x, y, col, on, s) {
  s = s || 1;
  if (on > 0) { g.save(); g.globalAlpha = .45 * on; circ(g, x, y, 11 * s); g.fillStyle = col; g.fill(); g.restore(); }
  ell(g, x, y, 4 * s, 5.5 * s); g.fillStyle = on > .2 ? col : 'rgba(70,50,45,.6)'; g.fill();
  circ(g, x - 1.2 * s, y - 1.6 * s, 1.3 * s); g.fillStyle = 'rgba(255,255,255,.85)'; g.fill();
}

/* ============ Mona's real paw: soft, furry, striped, with toe beans ============ */
function drawRealPaw(g, x0, y0, x1, y1, o) {
  o = o || {}; const s = o.s || 1;
  const dx = x1 - x0, dy = y1 - y0, L = Math.max(10, Math.hypot(dx, dy)), a = Math.atan2(dy, dx);
  g.save(); g.translate(x0, y0); g.rotate(a); if (Math.cos(a) < 0) g.scale(1, -1);
  const w0 = (o.w0 || 50) * s, w1 = (o.w1 || 34) * s, end = L - 16 * s;
  // furry arm silhouette (tufted edges)
  const furry = (grow) => {
    g.beginPath(); const n = Math.max(8, Math.round(end / (9 * s)));
    for (let i = 0; i <= n; i++) { const u = i / n, x = u * end, hw = lerp(w0, w1, u) / 2 + grow, tf = (i % 2 ? 3.2 : -.6) * s; i ? g.lineTo(x, -hw - tf) : g.moveTo(x - 30 * s, -hw - tf); }
    for (let i = n; i >= 0; i--) { const u = i / n, x = u * end, hw = lerp(w0, w1, u) / 2 + grow, tf = (i % 2 ? -.6 : 3.2) * s; g.lineTo(i ? x : x - 30 * s, hw + tf); }
    g.closePath();
  };
  furry(2.2 * s); g.fillStyle = OUT; g.fill();
  furry(0); const ag = g.createLinearGradient(0, -w0 / 2, 0, w0 / 2); ag.addColorStop(0, shade(MC.fur, .32)); ag.addColorStop(.45, MC.fur); ag.addColorStop(1, shade(MC.fur, -.22)); g.fillStyle = ag; g.fill();
  // tabby stripes + fur strokes, clipped to the arm
  g.save(); furry(0); g.clip();
  for (let x = end - 26 * s; x > -30 * s; x -= 30 * s) { g.beginPath(); g.moveTo(x, -w0); g.quadraticCurveTo(x - 9 * s, 0, x + 2 * s, w0); g.strokeStyle = 'rgba(74,60,51,.78)'; g.lineWidth = 8 * s; g.lineCap = 'round'; g.stroke(); }
  const r = mulberry(7); g.lineWidth = 1.3 * s;
  for (let i = 0; i < 70; i++) { const x = r() * (end + 20 * s) - 25 * s, y = (r() - .5) * w0, l = (5 + r() * 7) * s; g.strokeStyle = r() < .5 ? 'rgba(255,255,255,.28)' : 'rgba(60,45,38,.25)'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y + (r() - .5) * 3 * s); g.stroke(); }
  // soft belly-light underside
  g.fillStyle = 'rgba(246,239,228,.35)'; g.fillRect(-40 * s, w1 * .18, end + 40 * s, w0);
  g.restore();
  // the paw itself: a round mitten with four toes
  g.save(); g.translate(end + 4 * s, 0);
  const pw = 30 * s, ph = 27 * s;
  ell(g, 0, 0, pw + 2.2 * s, ph + 2.2 * s); g.fillStyle = OUT; g.fill();
  for (const [tx, ty] of [[22, -17], [27, -5], [27, 7], [21, 18]]) { circ(g, tx * s, ty * s, 10.5 * s); g.fillStyle = OUT; g.fill(); }
  const pg = g.createRadialGradient(-6 * s, -10 * s, 2, 0, 0, pw * 1.3); pg.addColorStop(0, '#ffffff'); pg.addColorStop(.6, MC.paw); pg.addColorStop(1, '#ddd2c3');
  ell(g, 0, 0, pw, ph); g.fillStyle = pg; g.fill();
  for (const [tx, ty] of [[22, -17], [27, -5], [27, 7], [21, 18]]) { circ(g, tx * s, ty * s, 8.6 * s); g.fillStyle = pg; g.fill(); }
  // fluffy fur between the toes
  g.strokeStyle = 'rgba(200,188,172,.9)'; g.lineWidth = 1.4 * s; for (const ty of [-11, 1, 13]) { g.beginPath(); g.moveTo(20 * s, ty * s); g.lineTo(31 * s, ty * s + 1); g.stroke(); }
  if (o.beans !== false) { // pink toe beans
    const bean = '#f4a3a8';
    g.beginPath(); g.moveTo(-6 * s, -9 * s); g.bezierCurveTo(6 * s, -12 * s, 13 * s, -4 * s, 12 * s, 2 * s); g.bezierCurveTo(13 * s, 9 * s, 4 * s, 13 * s, -6 * s, 9 * s); g.bezierCurveTo(-12 * s, 6 * s, -12 * s, -6 * s, -6 * s, -9 * s); g.closePath(); g.fillStyle = bean; g.fill();
    for (const [tx, ty] of [[21, -16], [25, -5], [25, 6], [20, 16]]) { ell(g, tx * s, ty * s, 4.6 * s, 4 * s); g.fillStyle = bean; g.fill(); circ(g, tx * s - 1.2 * s, ty * s - 1.2 * s, 1.3 * s); g.fillStyle = 'rgba(255,255,255,.6)'; g.fill(); }
    circ(g, -2 * s, -4 * s, 2.2 * s); g.fillStyle = 'rgba(255,255,255,.55)'; g.fill();
  }
  if (o.claws) { g.strokeStyle = '#fbf6ea'; g.lineWidth = 2.4 * s; g.lineCap = 'round'; for (const ty of [-17, -5, 7, 18]) { g.beginPath(); g.moveTo(30 * s, ty * s); g.quadraticCurveTo(38 * s, ty * s, 36 * s, ty * s + 5 * s); g.stroke(); } }
  g.restore();
  g.restore();
}

/* ============ Groceries + shelf items (drawn standing on (x,y), scale s) ============ */
const ITEM_H = { milk: 118, eggnog: 112, cereal: 128, cranberry: 64, treats: 84, oj: 112, ketchup: 92, mustard: 88, jam: 58, butter: 34, leftovers: 52, leftovers2: 52, cheese: 44, yogurt: 44, eggs: 40, pickles: 74, cake: 50, soda: 104, water: 110, flour: 100, rice: 92, cookies: 56, oats: 96, pasta: 90, crackers: 84, peanut: 62, spices: 56, soup: 66, soup2: 66, soup3: 66, beans: 62, beans2: 62, tomatoes: 66, wine: 120 };
const ITEM_W = { milk: 2, eggs: 2, cake: 2 };
const ITEM_NAME = { milk: 'Milk', eggnog: 'Eggnog', cereal: 'Cereal', cranberry: 'Cranberry sauce', treats: "Mona's treats", leftovers: 'Leftovers', leftovers2: 'Leftovers', cheese: 'Cheese', beans2: 'Beans' };
function labelText(g, s, x, y, size, col, w) { text(g, s, x, y, { size, color: col, weight: w || 700 }); }
function drawGroceryItem(g, k, x, y, s, t) {
  s = s || 1; g.save(); g.translate(x, y); g.scale(s, s); g.lineJoin = 'round';
  const box = (w, h, col, r) => { rr(g, -w / 2, -h, w, h, r == null ? 6 : r); ink(g, rad(g, 0, -h / 2, Math.max(w, h) * .6, col), 2.4); };
  const shine = (x0, y0, h) => { g.save(); g.globalAlpha = .35; rr(g, x0, y0, 6, h, 3); g.fillStyle = '#fff'; g.fill(); g.restore(); };
  const can = (col, lab, labCol) => { rr(g, -27, -64, 54, 64, 6); ink(g, rad(g, 0, -32, 40, '#c9ccd2')); rr(g, -27, -52, 54, 40, 2); ink(g, rad(g, 0, -32, 34, col), 2); labelText(g, lab, 0, -32, 11, labCol || '#fff'); ell(g, 0, -64, 27, 5); ink(g, '#dfe2e7', 2); shine(-20, -50, 34); };
  switch (k) {
    case 'milk':
      for (const ox of [-36, 36]) {
        g.save(); g.translate(ox, 0);
        g.beginPath(); g.moveTo(-30, 0); g.lineTo(-30, -78); g.quadraticCurveTo(-30, -92, -16, -98); g.lineTo(-10, -106); g.lineTo(10, -106); g.lineTo(16, -98); g.quadraticCurveTo(30, -92, 30, -78); g.lineTo(30, 0); g.closePath(); ink(g, rad(g, 0, -50, 50, '#fbfdff'));
        rr(g, -10, -118, 20, 13, 3); ink(g, '#3f74c9', 2.2);
        g.beginPath(); g.moveTo(14, -92); g.quadraticCurveTo(34, -84, 26, -64); strokeP(g, OUT, 7); g.beginPath(); g.moveTo(14, -92); g.quadraticCurveTo(34, -84, 26, -64); strokeP(g, '#eef3f8', 4);
        rr(g, -24, -62, 48, 34, 5); ink(g, '#3f74c9', 2); labelText(g, 'MILK', 0, -45, 13, '#fff'); shine(-24, -86, 70);
        g.restore();
      } break;
    case 'eggnog':
      g.beginPath(); g.moveTo(-28, 0); g.lineTo(-28, -84); g.lineTo(0, -108); g.lineTo(28, -84); g.lineTo(28, 0); g.closePath(); ink(g, rad(g, 0, -50, 50, '#fff3d0'));
      rr(g, -6, -118, 12, 12, 2); ink(g, '#e0473e', 2); g.beginPath(); g.moveTo(-28, -84); g.lineTo(28, -84); strokeP(g, OUT, 2);
      rr(g, -22, -70, 44, 26, 5); ink(g, '#2f9a52', 2); labelText(g, 'EGGNOG', 0, -57, 10, '#fff');
      drawHolly(g, 0, -30, .55, 0); shine(-22, -80, 70); break;
    case 'cereal':
      box(64, 128, '#f2c23e', 5); rr(g, -26, -118, 52, 30, 4); ink(g, '#e2443b', 2); labelText(g, 'CRUNCHY', 0, -103, 10, '#fff');
      ell(g, 0, -55, 22, 16); ink(g, '#fff', 2); for (const [a, b] of [[-8, -58], [4, -60], [-2, -50], [9, -52], [-12, -50]]) { circ(g, a, b, 4); fillP(g, '#e8a23a'); }
      drawStar(g, 18, -24, 9, '#e2443b'); shine(-28, -120, 100); break;
    case 'cranberry': can('#b8233a', 'CRANBERRY', '#ffe7ec'); for (const [a, b] of [[-14, -18], [12, -16]]) { circ(g, a, b, 3.4); fillP(g, '#e2443b'); } break;
    case 'treats':
      g.beginPath(); g.moveTo(-34, 0); g.lineTo(-30, -76); g.quadraticCurveTo(0, -86, 30, -76); g.lineTo(34, 0); g.closePath(); ink(g, rad(g, 0, -40, 50, '#8a5fd0'));
      for (let i = -26; i < 28; i += 6) line(g, i, -79 + Math.abs(i) * .1, i + 2, -86 + Math.abs(i) * .1, '#c8b0f0', 2);
      iconFish(g, 0, -46, 1.2, '#f2a03c'); labelText(g, "MONA'S", 0, -24, 11, '#fff'); labelText(g, 'TREATS', 0, -12, 10, '#ffe08a');
      shine(-26, -70, 56); break;
    case 'oj': g.beginPath(); g.moveTo(-26, 0); g.lineTo(-26, -86); g.lineTo(0, -106); g.lineTo(26, -86); g.lineTo(26, 0); g.closePath(); ink(g, rad(g, 0, -50, 50, '#ffb13c')); circ(g, 0, -46, 14); ink(g, '#ff8a1c', 2); line(g, 0, -60, 6, -66, '#2f9a52', 3); labelText(g, 'O.J.', 0, -18, 12, '#fff'); shine(-20, -82, 70); break;
    case 'ketchup': g.beginPath(); g.moveTo(-20, 0); g.lineTo(-22, -70); g.quadraticCurveTo(-20, -80, -8, -82); g.lineTo(8, -82); g.quadraticCurveTo(20, -80, 22, -70); g.lineTo(20, 0); g.closePath(); ink(g, rad(g, 0, -40, 36, '#e0352e')); rr(g, -8, -94, 16, 14, 3); ink(g, '#fbfbfb', 2); rr(g, -14, -52, 28, 22, 4); ink(g, '#fff6ea', 1.8); shine(-16, -70, 56); break;
    case 'mustard': g.beginPath(); g.moveTo(-18, 0); g.lineTo(-20, -66); g.quadraticCurveTo(-18, -76, -6, -78); g.lineTo(6, -78); g.quadraticCurveTo(18, -76, 20, -66); g.lineTo(18, 0); g.closePath(); ink(g, rad(g, 0, -40, 34, '#f5cf34')); g.beginPath(); g.moveTo(-4, -78); g.lineTo(0, -92); g.lineTo(4, -78); ink(g, '#e2443b', 2); shine(-14, -66, 52); break;
    case 'jam': rr(g, -22, -50, 44, 50, 8); ink(g, rad(g, 0, -25, 30, '#b5243f')); rr(g, -24, -60, 48, 12, 4); ink(g, '#f2e6cf', 2); g.save(); g.beginPath(); g.rect(-24, -60, 48, 12); g.clip(); for (let i = -24; i < 24; i += 8) { g.fillStyle = i % 16 ? '#e2443b' : '#f8f2e6'; g.fillRect(i, -60, 4, 12); } g.restore(); rr(g, -14, -38, 28, 18, 3); ink(g, '#fff8ec', 1.6); shine(-17, -44, 36); break;
    case 'butter': box(78, 34, '#f8e08c', 4); labelText(g, 'BUTTER', 0, -17, 11, '#a8701a'); break;
    case 'leftovers': case 'leftovers2':
      rr(g, -40, -46, 80, 46, 8); ink(g, 'rgba(225,238,248,.85)'); rr(g, -36, -32, 72, 30, 6); fillP(g, k === 'leftovers' ? '#e8853c' : '#7bbf5a');
      for (let i = 0; i < 6; i++) { circ(g, -26 + i * 10, -20 + (i % 2) * 6, 4); fillP(g, k === 'leftovers' ? '#c9562a' : '#4f9a40'); }
      rr(g, -44, -54, 88, 12, 5); ink(g, k === 'leftovers' ? '#3f74c9' : '#e2443b', 2.2); shine(-34, -42, 32); break;
    case 'cheese': g.beginPath(); g.moveTo(-40, 0); g.lineTo(40, 0); g.lineTo(40, -26); g.lineTo(-40, -44); g.closePath(); ink(g, rad(g, 0, -20, 40, '#ffd14d')); for (const [a, b, c] of [[-20, -16, 6], [8, -10, 5], [24, -18, 4]]) { circ(g, a, b, c); fillP(g, '#e8a92a'); } break;
    case 'yogurt': for (const ox of [-22, 22]) { g.beginPath(); g.moveTo(ox - 18, -44); g.lineTo(ox + 18, -44); g.lineTo(ox + 14, 0); g.lineTo(ox - 14, 0); g.closePath(); ink(g, rad(g, ox, -22, 26, '#ffffff')); rr(g, ox - 19, -48, 38, 6, 2); ink(g, ox < 0 ? '#e86a9a' : '#9a6ae0', 1.8); circ(g, ox, -22, 7); fillP(g, ox < 0 ? '#ff9ec0' : '#c9a8f5'); } break;
    case 'eggs': rr(g, -88, -40, 176, 40, 8); ink(g, rad(g, 0, -20, 90, '#d9c8ae')); for (let i = 0; i < 6; i++) { ell(g, -70 + i * 28, -40, 11, 13); ink(g, '#fff6e8', 2); } line(g, -88, -22, 88, -22, 'rgba(61,42,34,.3)', 2); break;
    case 'pickles': rr(g, -24, -66, 48, 66, 10); ink(g, 'rgba(200,230,180,.9)'); for (let i = 0; i < 3; i++) { ell(g, -10 + i * 10, -32, 5, 22, (i - 1) * .15); fillP(g, '#5a9a3a'); } rr(g, -26, -74, 52, 12, 4); ink(g, '#3a7d55', 2); shine(-18, -60, 50); break;
    case 'cake': // a yule log
      rr(g, -86, -46, 172, 8, 4); ink(g, '#f6f2ea', 2); rr(g, -76, -46, 152, 40, 20); ink(g, rad(g, 0, -26, 80, '#6b3d22'));
      for (let i = -60; i < 60; i += 14) line(g, i, -40, i + 10, -12, 'rgba(40,20,10,.45)', 2); ell(g, 76, -26, 12, 20); ink(g, '#c9915a', 2); ell(g, 76, -26, 6, 10); strokeP(g, '#6b3d22', 2);
      drawHolly(g, -10, -46, .5, 0); g.fillStyle = '#fff'; for (let i = -60; i < 60; i += 18) { circ(g, i, -46, 4); g.fill(); } break;
    case 'soda': rr(g, -20, -104, 40, 104, 12); ink(g, rad(g, 0, -52, 40, '#3aa25c')); rr(g, -8, -112, 16, 10, 3); ink(g, '#e2443b', 2); rr(g, -20, -70, 40, 26, 2); ink(g, '#f8f2e6', 1.6); labelText(g, 'FIZZ', 0, -57, 10, '#2f9a52'); shine(-15, -96, 84); break;
    case 'water': rr(g, -20, -100, 40, 100, 12); ink(g, rad(g, 0, -50, 40, '#bfe4ff')); rr(g, -8, -110, 16, 12, 3); ink(g, '#4a8cf0', 2); for (let y = -84; y < -10; y += 16) line(g, -20, y, 20, y, 'rgba(255,255,255,.6)', 2); break;
    case 'wine': rr(g, -16, -88, 32, 88, 10); ink(g, rad(g, 0, -44, 34, '#7a1d3a')); rr(g, -6, -120, 12, 36, 4); ink(g, '#7a1d3a', 2); rr(g, -13, -54, 26, 28, 3); ink(g, '#f6eedc', 1.6); shine(-12, -82, 70); break;
    case 'flour': g.beginPath(); g.moveTo(-34, 0); g.lineTo(-30, -90); g.lineTo(30, -90); g.lineTo(34, 0); g.closePath(); ink(g, rad(g, 0, -45, 50, '#f6f1e6')); g.beginPath(); g.moveTo(-30, -90); g.lineTo(-24, -100); g.lineTo(24, -100); g.lineTo(30, -90); ink(g, '#e8e0cf', 2); labelText(g, 'FLOUR', 0, -50, 12, '#c88a3a'); break;
    case 'rice': g.beginPath(); g.moveTo(-32, 0); g.quadraticCurveTo(-36, -50, -28, -88); g.lineTo(28, -88); g.quadraticCurveTo(36, -50, 32, 0); g.closePath(); ink(g, rad(g, 0, -44, 50, '#f0e3c4')); rr(g, -22, -66, 44, 28, 5); ink(g, '#e2443b', 2); labelText(g, 'RICE', 0, -52, 11, '#fff'); break;
    case 'cookies': rr(g, -36, -50, 72, 50, 12); ink(g, rad(g, 0, -25, 44, '#c8261f')); rr(g, -38, -56, 76, 12, 6); ink(g, '#2f9a52', 2); for (let i = -24; i < 30; i += 16) drawStar(g, i, -26, 6, '#ffe08a'); break;
    case 'oats': rr(g, -30, -96, 60, 96, 10); ink(g, rad(g, 0, -48, 50, '#e8c48a')); ell(g, 0, -96, 30, 7); ink(g, '#c8261f', 2); rr(g, -26, -64, 52, 30, 4); ink(g, '#fff8ec', 1.6); labelText(g, 'OATS', 0, -49, 11, '#8a5a2a'); break;
    case 'pasta': box(58, 90, '#3f74c9', 5); rr(g, -20, -66, 40, 34, 6); ink(g, 'rgba(255,255,255,.8)', 1.6); for (let i = -14; i < 16; i += 7) line(g, i, -62, i + 4, -38, '#e8c470', 3); labelText(g, 'PASTA', 0, -16, 10, '#fff'); break;
    case 'crackers': box(70, 84, '#e2443b', 5); for (let i = 0; i < 4; i++) { rr(g, -26 + (i % 2) * 28, -70 + Math.floor(i / 2) * 26, 24, 22, 3); ink(g, '#f2c26a', 1.6); } break;
    case 'peanut': rr(g, -26, -54, 52, 54, 10); ink(g, rad(g, 0, -27, 34, '#c88a4a')); rr(g, -28, -64, 56, 14, 5); ink(g, '#e2443b', 2); rr(g, -18, -42, 36, 22, 4); ink(g, '#fff6ea', 1.6); break;
    case 'spices': for (const [ox, c] of [[-26, '#c8261f'], [0, '#e8a23a'], [26, '#5a9a3a']]) { rr(g, ox - 11, -46, 22, 46, 5); ink(g, rad(g, ox, -23, 18, c), 2); rr(g, ox - 12, -54, 24, 10, 3); ink(g, '#fbfbfb', 1.8); } break;
    case 'soup': case 'soup2': case 'soup3': can(k === 'soup2' ? '#2f9a52' : k === 'soup3' ? '#e8a23a' : '#e2443b', 'SOUP'); break;
    case 'beans': case 'beans2': can('#3f74c9', 'BEANS'); break;
    case 'tomatoes': can('#c8261f', 'TOMATO'); break;
    default: box(50, 60, '#cccccc');
  }
  g.restore();
}
/* the paper shopping bag, standing on (x,y) */
function drawGroceryBag(g, x, y, s, items, t) {
  g.save(); g.translate(x, y); g.scale(s, s);
  // things poking out of the top
  const peek = { eggnog: [-30, -10, -.12], cereal: [-6, -20, .05], milk: [28, -6, .1], cranberry: [8, 6, 0], treats: [-20, 4, -.2] };
  (items || []).forEach(k => { const p = peek[k]; if (!p) return; g.save(); g.translate(p[0], -150 + p[1]); g.rotate(p[2]); drawGroceryItem(g, k, 0, 40, .62, t); g.restore(); });
  if (!items || items.length) { g.save(); g.translate(32, -150); g.rotate(.3); line(g, 0, 10, 4, -50, '#5aa04a', 7); for (let i = 0; i < 4; i++) { ell(g, 4 + (i - 1.5) * 7, -56, 7, 12, (i - 1.5) * .3); ink(g, '#7cc46a', 1.6); } g.restore(); }
  g.beginPath(); g.moveTo(-60, -150); g.lineTo(60, -150); g.lineTo(64, 0); g.lineTo(-64, 0); g.closePath(); ink(g, rad(g, -10, -90, 120, '#d2a86e'), 2.8);
  g.beginPath(); for (let i = 0; i <= 12; i++) g.lineTo(-60 + i * 10, -150 + (i % 2 ? 6 : 0)); strokeP(g, '#b9894f', 2);
  line(g, -40, -140, -44, -4, 'rgba(120,80,40,.25)', 2); line(g, 40, -140, 44, -4, 'rgba(120,80,40,.25)', 2);
  text(g, 'Grocery', 0, -92, { size: 21, color: '#b2392e', weight: 700 }); text(g, 'Outlet', 0, -70, { size: 21, color: '#b2392e', weight: 700 });
  line(g, -36, -56, 36, -56, '#b2392e', 2.5); text(g, 'bargain market', 0, -42, { size: 10, color: '#7a5a3a', weight: 600 });
  g.restore();
}

/* ============ The beige SUV (side view, facing right; origin = ground centre) ============ */
const CAR = { body: '#cdb99c', hi: '#f2e7d4', lo: '#9d8a6e' };
function drawSUV(g, x, y, s, o) {
  o = o || {}; const t = o.t || 0;
  g.save(); g.translate(x, y); g.scale(s * (o.flip ? -1 : 1), s);
  contactShadow(g, 0, 0, 240, 22, .45);
  // body shell
  const shell = () => { g.beginPath(); g.moveTo(-206, -40); g.quadraticCurveTo(-212, -92, -196, -104); g.lineTo(-158, -150); g.quadraticCurveTo(-150, -158, -132, -158); g.lineTo(52, -158); g.quadraticCurveTo(70, -156, 84, -142); g.lineTo(118, -108); g.quadraticCurveTo(196, -104, 210, -90); g.quadraticCurveTo(220, -60, 214, -34); g.quadraticCurveTo(212, -22, 196, -22); g.lineTo(-196, -22); g.quadraticCurveTo(-208, -24, -206, -40); g.closePath(); };
  shell(); g.fillStyle = OUT; g.lineWidth = 6; g.strokeStyle = OUT; g.stroke();
  shell(); const bg = g.createLinearGradient(0, -158, 0, -22); bg.addColorStop(0, CAR.hi); bg.addColorStop(.42, CAR.body); bg.addColorStop(.62, shade(CAR.body, .1)); bg.addColorStop(1, CAR.lo); g.fillStyle = bg; g.fill();
  // glasshouse
  const glass = () => { g.beginPath(); g.moveTo(-150, -110); g.lineTo(-138, -146); g.quadraticCurveTo(-132, -150, -122, -150); g.lineTo(48, -150); g.quadraticCurveTo(62, -148, 74, -136); g.lineTo(100, -110); g.closePath(); };
  glass(); const gg = g.createLinearGradient(0, -150, 0, -110); gg.addColorStop(0, '#3b4552'); gg.addColorStop(1, '#5f6c7a'); g.fillStyle = gg; g.fill();
  if (o.inside) { g.save(); glass(); g.clip(); o.inside(g); g.restore(); }
  // reflections on the glass
  g.save(); glass(); g.clip(); g.globalAlpha = .28; g.fillStyle = '#fff'; g.beginPath(); g.moveTo(-60, -150); g.lineTo(-30, -150); g.lineTo(-70, -110); g.lineTo(-100, -110); g.closePath(); g.fill(); g.beginPath(); g.moveTo(60, -150); g.lineTo(72, -150); g.lineTo(40, -110); g.lineTo(28, -110); g.closePath(); g.fill(); g.restore();
  glass(); strokeP(g, '#d8dde3', 4); glass(); strokeP(g, OUT, 1.6);
  // pillars
  for (const [a, b] of [[-14, -18], [-102, -108]]) { g.beginPath(); g.moveTo(a, -150); g.lineTo(b, -110); strokeP(g, '#2a2d33', 9); }
  // chrome beltline + rocker
  line(g, -152, -106, 104, -106, '#e9edf2', 4); line(g, -152, -106, 104, -106, 'rgba(61,42,34,.4)', 1);
  rr(g, -170, -36, 340, 7, 3); fillP(g, '#e6eaef');
  // door shut lines + handles
  for (const dx of [-12, -104]) { g.beginPath(); g.moveTo(dx, -104); g.quadraticCurveTo(dx - 4, -70, dx - 2, -30); strokeP(g, 'rgba(61,42,34,.45)', 2); }
  for (const hx of [-48, -136]) { rr(g, hx, -96, 20, 5, 2.5); fillP(g, '#e6eaef'); }
  // character line + body reflection
  g.beginPath(); g.moveTo(-200, -78); g.quadraticCurveTo(0, -84, 206, -72); strokeP(g, 'rgba(255,255,255,.45)', 2.5);
  g.save(); shell(); g.clip(); g.globalAlpha = .18; g.fillStyle = '#fff'; g.beginPath(); g.ellipse(-20, -96, 190, 9, -.02, 0, TAU); g.fill(); g.restore();
  // mirror
  g.beginPath(); g.moveTo(92, -114); g.quadraticCurveTo(110, -118, 112, -104); g.lineTo(96, -100); g.closePath(); ink(g, CAR.body, 2);
  // lights: wraparound taillight + slim headlight + chrome grille
  g.beginPath(); g.moveTo(-205, -96); g.lineTo(-186, -102); g.lineTo(-186, -90); g.lineTo(-206, -86); g.closePath(); fillP(g, '#c8261f'); glowAt(g, -198, -94, 26, '255,60,40', o.brake ? .5 : .15);
  g.beginPath(); g.moveTo(190, -90); g.quadraticCurveTo(208, -92, 214, -84); g.lineTo(196, -80); g.closePath(); fillP(g, '#fff6d8'); glowAt(g, 212, -86, 40, '255,240,200', o.lights ? .55 : .2);
  rr(g, 206, -78, 10, 26, 3); fillP(g, '#d9dee5'); for (let i = 0; i < 4; i++) line(g, 207, -74 + i * 6, 215, -74 + i * 6, '#8a9099', 1.4);
  // wheels: dark tyres + bright multi-spoke rims
  const rot = o.wheelRot || 0;
  for (const wx of [-128, 132]) {
    circ(g, wx, -24, 46); fillP(g, '#2a2724');
    circ(g, wx, -24, 38); fillP(g, '#1c1b1a');
    g.save(); g.translate(wx, -24); g.rotate(rot);
    circ(g, 0, 0, 27); fillP(g, '#c9ced6');
    for (let i = 0; i < 10; i++) { g.save(); g.rotate(i * TAU / 10); g.beginPath(); g.moveTo(-3, -6); g.lineTo(3, -6); g.lineTo(5, -25); g.lineTo(-5, -25); g.closePath(); g.fillStyle = i % 2 ? '#eef1f5' : '#a7adb6'; g.fill(); g.restore(); }
    circ(g, 0, 0, 7); fillP(g, '#8d939c'); g.restore();
    g.beginPath(); g.arc(wx, -24, 50, Math.PI * 1.08, Math.PI * 1.92); strokeP(g, shade(CAR.body, -.35), 5);
  }
  g.restore();
}

/* ============ Cosy cat bed (red with a fluffy white rim) ============ */
function drawCatBed(g, x, y, s, front) {
  g.save(); g.translate(x, y); g.scale(s, s);
  if (!front) {
    contactShadow(g, 0, 6, 92, 14, .4);
    ell(g, 0, -6, 84, 30); ink(g, rad(g, 0, -10, 84, '#c8261f'), 2.6);
    ell(g, 0, -10, 62, 18); fillP(g, '#8e1d18'); ell(g, 0, -8, 56, 14); fillP(g, '#f3e7d6');
  } else {
    g.beginPath(); g.ellipse(0, -6, 84, 30, 0, 0, Math.PI); g.lineTo(-84, -6); g.closePath(); g.save(); g.clip(); ell(g, 0, -6, 84, 30); fillP(g, '#d63a2f'); g.restore();
    g.beginPath(); g.ellipse(0, -16, 80, 26, 0, .05, Math.PI - .05); strokeP(g, '#fffaf2', 12); g.beginPath(); g.ellipse(0, -16, 80, 26, 0, .05, Math.PI - .05); strokeP(g, 'rgba(200,190,175,.6)', 2);
    for (let i = 0; i < 9; i++) { const a = .3 + i * .32; circ(g, Math.cos(a) * 80, -16 + Math.sin(a) * 26, 5); fillP(g, '#fffaf2'); }
  }
  g.restore();
}

/* ============ TV picture: a little Christmas film ============ */
function drawTVPicture(g, x, y, w, h, t) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  const sk = g.createLinearGradient(0, y, 0, y + h); sk.addColorStop(0, '#1b2b5e'); sk.addColorStop(1, '#5d6fb0'); g.fillStyle = sk; g.fillRect(x, y, w, h);
  circ(g, x + w * .8, y + h * .25, 16); fillP(g, '#fff6c8');
  g.fillStyle = '#e9eefc'; g.beginPath(); g.moveTo(x, y + h * .78); g.quadraticCurveTo(x + w * .4, y + h * .66, x + w, y + h * .8); g.lineTo(x + w, y + h); g.lineTo(x, y + h); g.fill();
  // little village with lit windows
  for (let i = 0; i < 4; i++) { const hx = x + 20 + i * 76, hy = y + h * .72 - (i % 2) * 6; rr(g, hx, hy - 30, 46, 32, 2); g.fillStyle = '#3a2a3a'; g.fill(); g.beginPath(); g.moveTo(hx - 6, hy - 30); g.lineTo(hx + 23, hy - 52); g.lineTo(hx + 52, hy - 30); g.fillStyle = '#f4f6ff'; g.fill(); g.fillStyle = '#ffd36b'; g.fillRect(hx + 8, hy - 22, 10, 9); g.fillRect(hx + 28, hy - 22, 10, 9); }
  // sleigh across the moon
  const k = (t * .08) % 1; drawSleigh(g, x - 60 + k * (w + 120), y + h * .3 + Math.sin(t) * 6, .4, t);
  drawSnow(g, x, y, w, h, t, 20, .6);
  g.restore();
}

/* hidden paw prints placed in the diorama rooms */
function pawPos(p, cam) { return p.s ? proj(p.x, p.s, 0, cam) : proj(p.x, VW.f, p.h, cam); }
function drawPawsD(list, cam, t) { list.forEach(p => { if (save.paws[p.id]) return; const q = pawPos(p, cam); ctx.save(); ctx.translate(q.x, q.y); ctx.scale(q.s / .8, q.s / .8 * (p.s ? .7 : 1)); drawHiddenPaw(ctx, 0, 0, t, false); ctx.restore(); }); }
function tapPawD(list, X, Y, cam) { for (const p of list) { if (save.paws[p.id]) continue; const q = pawPos(p, cam); if (dist(X, Y, q.x, q.y) < 44) { collectPaw(p.id, X, Y); return true; } } return false; }
