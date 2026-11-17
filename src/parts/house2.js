/* ---- v8.2: Samantha and George's house, redrawn from the photo ----
   A light grey board-and-batten home with crisp white trim and low gables: a side wing on the left with a
   little arched vent, the front porch with white railings and steps down to the path, the white front
   door with its small window, the big bay window on the right (Mona's window), the carport on the right,
   tall dark planters, bird-of-paradise plants and the 591 plaque. */
function drawHouseFront(g) {
  INK = true;
  try {
    const r = mulberry(31), GREY = '#cfcdc6', GREYD = '#c2c0b8', TRIM = '#f5f3ee', SKIRT = '#b9b6ae';
    // sky, clouds, hills, lawn (golden hour)
    const sk = g.createLinearGradient(0, 0, 0, 580); sk.addColorStop(0, '#7c9fd0'); sk.addColorStop(.45, '#e8b9a4'); sk.addColorStop(.8, '#fbd8a8'); sk.addColorStop(1, '#fde7c4'); g.fillStyle = sk; g.fillRect(0, 0, W, 600);
    INK = false;
    for (const [cx, cy, s] of [[210, 110, 1], [760, 70, .8], [1080, 150, 1.1]]) { g.fillStyle = 'rgba(255,236,226,.55)'; for (let i = 0; i < 5; i++) { ell(g, cx + (i - 2) * 38 * s, cy + Math.abs(i - 2) * 6, 46 * s, 20 * s); g.fill(); } }
    g.fillStyle = '#9a8fb4'; g.beginPath(); g.moveTo(0, 520); for (let x = 0; x <= W; x += 40) g.lineTo(x, 470 + Math.sin(x / 170) * 26 + Math.sin(x / 61) * 8); g.lineTo(W, 600); g.lineTo(0, 600); g.fill();
    INK = true;
    g.fillStyle = '#6f9a52'; g.fillRect(0, 590, W, 180);
    g.globalAlpha = .25; for (let i = 0; i < 200; i++) { const x = r() * W, y = 600 + r() * 160; line(g, x, y, x + (r() - .5) * 4, y - 6, '#3f6a2e', 2); } g.globalAlpha = 1;
    // the neighbour's place, glimpsed behind the carport
    rr(g, 1020, 400, 240, 204, 2); fillP(g, '#ece4d2'); g.fillStyle = '#9a6a4a'; g.fillRect(1010, 392, 250, 10); rr(g, 1110, 440, 90, 70, 3); fillP(g, '#c8d6e0');
    // board-and-batten walls (vertical battens) with horizontal lap siding low down
    const walls = (x, y, w, h, lapY) => {
      rr(g, x, y, w, h, 2); fillP(g, GREY);
      g.strokeStyle = 'rgba(80,78,72,.22)'; g.lineWidth = 2; for (let bx = x + 22; bx < x + w - 4; bx += 26) { g.beginPath(); g.moveTo(bx, y + 4); g.lineTo(bx, (lapY || y + h) - 2); g.stroke(); }
      if (lapY) { g.fillStyle = GREYD; g.fillRect(x, lapY, w, y + h - lapY); g.strokeStyle = 'rgba(80,78,72,.22)'; for (let ly = lapY + 13; ly < y + h; ly += 13) { g.beginPath(); g.moveTo(x, ly); g.lineTo(x + w, ly); g.stroke(); } g.fillStyle = TRIM; g.fillRect(x, lapY - 4, w, 6); }
    };
    // gable: a shallow roof with a white fascia and a battened gable face
    const gable = (x0, x1, ye, peakY, roofCol) => {
      const px = (x0 + x1) / 2;
      g.beginPath(); g.moveTo(x0 + 18, ye); g.lineTo(px, peakY + 8); g.lineTo(x1 - 18, ye); g.closePath(); fillP(g, GREY);
      g.save(); g.clip(); g.strokeStyle = 'rgba(80,78,72,.22)'; g.lineWidth = 2; for (let bx = x0 + 30; bx < x1; bx += 26) { g.beginPath(); g.moveTo(bx, peakY); g.lineTo(bx, ye); g.stroke(); } g.restore();
      g.beginPath(); g.moveTo(x0 - 10, ye + 4); g.lineTo(px, peakY - 10); g.lineTo(x1 + 10, ye + 4); g.lineTo(x1 + 10, ye + 14); g.lineTo(px, peakY + 2); g.lineTo(x0 - 10, ye + 14); g.closePath(); fillP(g, TRIM);
      g.strokeStyle = roofCol || '#8e8c88'; g.lineWidth = 4; g.beginPath(); g.moveTo(x0 - 10, ye + 2); g.lineTo(px, peakY - 12); g.lineTo(x1 + 10, ye + 2); g.stroke();
    };
    const win = (x, y, w, h, cols, rows) => {
      rr(g, x - 7, y - 7, w + 14, h + 14, 2); fillP(g, TRIM);
      rr(g, x, y, w, h, 1); fillP(g, '#5d6670');
      g.fillStyle = 'rgba(235,238,240,.85)'; g.fillRect(x, y, w, h * .3); // blinds pulled part way
      g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1; for (let by = y + 5; by < y + h * .3; by += 5) { g.beginPath(); g.moveTo(x, by); g.lineTo(x + w, by); g.stroke(); }
      g.strokeStyle = TRIM; g.lineWidth = 6; for (let c = 1; c < cols; c++) { g.beginPath(); g.moveTo(x + w * c / cols, y); g.lineTo(x + w * c / cols, y + h); g.stroke(); } for (let q = 1; q < rows; q++) { g.beginPath(); g.moveTo(x, y + h * q / rows); g.lineTo(x + w, y + h * q / rows); g.stroke(); }
      g.globalAlpha = .18; g.fillStyle = '#fff'; g.beginPath(); g.moveTo(x + w * .2, y); g.lineTo(x + w * .45, y); g.lineTo(x + w * .2, y + h); g.lineTo(x - w * .05, y + h); g.closePath(); g.fill(); g.globalAlpha = 1;
    };
    // skirting all along the bottom (the house sits up off the ground)
    rr(g, 96, 528, 860, 76, 2); fillP(g, SKIRT); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(96, 528, 860, 6);
    for (const vx of [150, 300, 840]) { rr(g, vx, 560, 26, 18, 2); fillP(g, '#8e8b84'); }
    // left wing
    walls(110, 330, 330, 200, 462); gable(90, 460, 332, 252);
    g.beginPath(); g.arc(275, 300, 13, Math.PI, 0); g.lineTo(288, 312); g.lineTo(262, 312); g.closePath(); fillP(g, TRIM);
    win(146, 360, 56, 92, 1, 2); win(244, 352, 162, 94, 3, 1);
    // porch: recessed wall, door, side window, posts, roof
    walls(440, 300, 250, 230); g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(440, 300, 250, 230);
    gable(418, 712, 300, 196);
    rr(g, 512, 392, 76, 138, 2); fillP(g, TRIM); rr(g, 520, 400, 60, 130, 1); fillP(g, '#fbfaf6');
    rr(g, 528, 408, 44, 22, 1); fillP(g, '#5d6670'); g.strokeStyle = TRIM; g.lineWidth = 3; for (const lx of [542.6, 557.3]) { g.beginPath(); g.moveTo(lx, 408); g.lineTo(lx, 430); g.stroke(); } g.beginPath(); g.moveTo(528, 419); g.lineTo(572, 419); g.stroke();
    circ(g, 574, 470, 4); fillP(g, '#c9c3b6');
    win(612, 352, 52, 150, 1, 2);
    rr(g, 592, 362, 14, 18, 3); fillP(g, '#3b3d42'); // the little solar light by the door
    for (const px of [440, 672]) { rr(g, px, 300, 20, 230, 1); fillP(g, TRIM); }
    // bay window wing (Mona's window)
    walls(690, 330, 250, 200, 520); gable(674, 956, 332, 262);
    rr(g, 694, 330, 18, 200, 1); fillP(g, TRIM); rr(g, 918, 330, 18, 200, 1); fillP(g, TRIM);
    win(718, 356, 190, 158, 3, 2);
    // carport: flat aluminium awning on slim posts
    g.beginPath(); g.moveTo(936, 344); g.lineTo(1250, 362); g.lineTo(1250, 376); g.lineTo(936, 358); g.closePath(); fillP(g, '#e7e5e0');
    g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 1.5; for (let x = 960; x < 1250; x += 22) { g.beginPath(); g.moveTo(x, 345 + (x - 936) * .057); g.lineTo(x, 359 + (x - 936) * .057); g.stroke(); }
    for (const px of [1000, 1214]) { rr(g, px, 360 + (px - 936) * .057, 9, 604 - 360 - (px - 936) * .057, 2); fillP(g, '#d6d4ce'); }
    // porch deck, white railings and the steps down to the path
    rr(g, 430, 522, 280, 12, 2); fillP(g, '#8f8c86');
    const rail = (x0, x1, y) => { rr(g, x0, y - 6, x1 - x0, 9, 2); fillP(g, TRIM); for (let bx = x0 + 8; bx < x1 - 4; bx += 16) { rr(g, bx, y + 2, 8, 522 - y - 2, 1); fillP(g, TRIM); } };
    rail(460, 672, 470); rail(690, 700, 470);
    for (let i = 0; i < 4; i++) { const sy = 534 + i * 18, sx = 432 - i * 24; rr(g, sx - 62, sy, 70, 18, 2); fillP(g, i % 2 ? '#8f8c86' : '#9b9892'); }
    g.strokeStyle = TRIM; g.lineCap = 'round'; g.lineWidth = 9; g.beginPath(); g.moveTo(440, 470); g.lineTo(350, 560); g.stroke(); g.lineWidth = 6; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(432 - i * 24, 478 + i * 24); g.lineTo(432 - i * 24, 534 + i * 18); g.stroke(); } rr(g, 344, 556, 12, 50, 2); fillP(g, TRIM);
    // the house number
    rr(g, 618, 540, 62, 28, 3); fillP(g, '#2c2e33'); text(g, '591', 649, 555, { size: 19, color: '#f4f2ec', weight: 800 });
    // path and the carport driveway
    g.beginPath(); g.moveTo(280, 604); g.lineTo(370, 604); g.lineTo(400, 762); g.lineTo(240, 762); g.closePath(); fillP(g, '#dcd3c4');
    g.beginPath(); g.moveTo(950, 604); g.lineTo(1250, 604); g.lineTo(1250, 762); g.lineTo(860, 762); g.closePath(); fillP(g, '#cdc5b6');
    // tall dark planters
    const pot = (x, h, plant) => {
      g.beginPath(); g.moveTo(x - 26, 604 - h); g.lineTo(x + 26, 604 - h); g.lineTo(x + 20, 606); g.lineTo(x - 20, 606); g.closePath(); fillP(g, '#3a3d44');
      g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(x - 22, 604 - h + 4, 8, h - 10);
      g.lineCap = 'round';
      for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * .22, L = 26 + (i % 3) * 8; g.strokeStyle = plant; g.lineWidth = 4; g.beginPath(); g.moveTo(x, 604 - h); g.lineTo(x + Math.cos(a) * L, 604 - h + Math.sin(a) * L); g.stroke(); }
    };
    pot(668, 104, '#8fae7a'); pot(790, 116, '#b46a5a'); pot(900, 106, '#9aa59a');
    // bird-of-paradise clumps: big paddle leaves on long stems
    const bop = (cx, h, wdt, n, seed) => {
      const rnd = mulberry(seed);
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (rnd() - .5) * 1.7, L = h * (.55 + rnd() * .45), sx = cx + (rnd() - .5) * wdt * .3, ex = sx + Math.cos(a) * L * .55, ey = 604 + Math.sin(a) * L * .55;
        g.strokeStyle = '#5c7a3a'; g.lineWidth = 4; g.beginPath(); g.moveTo(sx, 604); g.lineTo(ex, ey); g.stroke();
        g.save(); g.translate(ex + Math.cos(a) * L * .25, ey + Math.sin(a) * L * .25); g.rotate(a);
        ell(g, 0, 0, L * .3, L * .085); g.fillStyle = i % 3 ? '#3f7a3c' : '#4a8a44'; g.fill(); g.strokeStyle = '#1d1a1c'; g.lineWidth = 1.6; g.stroke();
        g.strokeStyle = 'rgba(220,240,200,.5)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(-L * .28, 0); g.lineTo(L * .28, 0); g.stroke();
        g.restore();
      }
    };
    bop(500, 250, 200, 26, 5); bop(960, 200, 170, 20, 9); bop(120, 110, 80, 8, 3);
    // sidewalk, curb, street, mailbox
    g.fillStyle = '#d9d3c8'; g.fillRect(0, 762, W, 30); g.fillStyle = '#b9b2a6'; g.fillRect(0, 790, W, 8);
    g.fillStyle = '#5c5d62'; g.fillRect(0, 798, W, 110); g.fillStyle = 'rgba(255,255,255,.05)'; for (let i = 0; i < 300; i++) g.fillRect(r() * W, 800 + r() * 100, 3, 2);
    g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1.5; for (let x = 0; x < W; x += 90) { g.beginPath(); g.moveTo(x, 762); g.lineTo(x - 6, 790); g.stroke(); }
    rr(g, 52, 650, 10, 116, 3); fillP(g, '#5a5a5e'); rr(g, 30, 628, 58, 32, 8); fillP(g, '#2c2e33');
  } finally { INK = false; }
}
/* the warm lights: little bulbs along the gutters, a glow by the door */
function houseLights(g, t, dim) {
  const pts = [];
  for (let x = 96; x <= 450; x += 26) pts.push([x, 346]); for (let x = 430; x <= 700; x += 26) pts.push([x, 314]); for (let x = 682; x <= 950; x += 26) pts.push([x, 346]);
  pts.forEach(([x, y], i) => { line(g, x, y - 6, x, y - 2, '#2a3a2a', 2); bulb(g, x, y + 3, LIGHT_COLS[i % 5], .55 + .45 * Math.sin(t * 2.4 + i * 1.3), 1); });
  g.save(); g.translate(250, 700); const nod = Math.sin(t * 1.2) * .06;
  g.strokeStyle = 'rgba(255,248,220,.95)'; g.lineWidth = 3; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.ellipse(0, -46, 46, 22, 0, 0, TAU); g.stroke();
  for (const lx of [-30, -18, 22, 34]) { g.beginPath(); g.moveTo(lx, -30); g.lineTo(lx + (lx < 0 ? -2 : 2), 0); g.stroke(); }
  g.save(); g.translate(40, -60); g.rotate(nod); g.beginPath(); g.moveTo(0, 0); g.lineTo(14, -40); g.stroke(); g.beginPath(); g.ellipse(22, -48, 16, 10, -.4, 0, TAU); g.stroke();
  g.beginPath(); g.moveTo(18, -56); g.lineTo(12, -80); g.lineTo(2, -88); g.moveTo(12, -80); g.lineTo(22, -92); g.moveTo(26, -56); g.lineTo(34, -78); g.lineTo(44, -86); g.stroke(); g.restore();
  g.restore();
  glowAt(g, 260, 660, 90, '255,240,200', .22 * dim);
  glowAt(g, 599, 372, 80, '255,220,140', .5 * dim);
}
/* Mona's window is the big bay window: warm room behind, a 3 x 2 grid of panes */
function drawPictureWindow(g, t, mona) {
  const x = 718, y = 356, w = 190, h = 158;
  g.save(); rr(g, x, y, w, h, 1); g.clip();
  const ig = g.createLinearGradient(0, y, 0, y + h); ig.addColorStop(0, '#d98a52'); ig.addColorStop(1, '#ffd29a'); g.fillStyle = ig; g.fillRect(x, y, w, h);
  glowAt(g, x + 150, y + 40, 100, '255,230,170', .6);
  drawTreeStatic(g, x + 158, y + h + 6, .3); drawTreeLive(g, x + 158, y + h + 6, .3, t, 1);
  for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? 'rgba(250,246,238,.95)' : 'rgba(228,222,212,.95)'; g.fillRect(x, y + i * 6, w, 6); }
  if (mona) mona(g);
  g.globalAlpha = .2; g.fillStyle = '#fff'; g.beginPath(); g.moveTo(x + 40, y); g.lineTo(x + 80, y); g.lineTo(x + 30, y + h); g.lineTo(x - 10, y + h); g.closePath(); g.fill(); g.globalAlpha = 1;
  g.restore();
  g.strokeStyle = '#f5f3ee'; g.lineWidth = 6; for (const c of [1, 2]) { g.beginPath(); g.moveTo(x + w * c / 3, y); g.lineTo(x + w * c / 3, y + h); g.stroke(); } g.beginPath(); g.moveTo(x, y + h * .5); g.lineTo(x + w, y + h * .5); g.stroke();
  rr(g, x - 7, y - 7, w + 14, h + 14, 2); g.lineWidth = 6; g.strokeStyle = '#f5f3ee'; g.stroke(); g.lineWidth = 1.6; g.strokeStyle = 'rgba(29,26,28,.6)'; g.stroke();
}
