function drawMonaHead(g, x, y, s, o) {
  o = o || {};
  const t = o.t || 0, eyes = o.eyes || 'open', lx = (o.look && o.look.x) || 0, ly = (o.look && o.look.y) || 0;
  const out = o.outfit || 'none';
  g.save(); g.translate(x, y); g.scale(s, s); if (o.tilt) g.rotate(o.tilt);
  const eu = o.earsUp ? 1.18 : 1, et = Math.sin(t * 1.3) * .04, eb = o.earsBack ? .55 : 0;
  if (out === 'gingerbread') { // gingerbread hood behind the head, iced edge
    ell(g, 0, -1, 42, 38); ink(g, rad(g, 0, -8, 42, '#bb7438'));
    g.beginPath(); for (let i = 0; i <= 26; i++) { const a = Math.PI * (1.02 + i / 26 * .96), r2 = 36 + (i % 2) * 3.5; i ? g.lineTo(Math.cos(a) * r2, -1 + Math.sin(a) * r2) : g.moveTo(Math.cos(a) * r2, -1 + Math.sin(a) * r2); } strokeP(g, '#fffaf2', 3.4);
  }
  for (const sd of [-1, 1]) {
    g.save(); g.scale(sd, 1); g.rotate((sd === 1 ? et : -et) - eb);
    g.beginPath(); g.moveTo(-27, -4); g.quadraticCurveTo(-31, -30 * eu, -25, -37 * eu); g.quadraticCurveTo(-14, -31 * eu, -3, -21); g.closePath(); ink(g, MC.fur);
    g.beginPath(); g.moveTo(-22, -11); g.quadraticCurveTo(-25, -27 * eu, -22, -30 * eu); g.quadraticCurveTo(-15, -26 * eu, -9, -20); g.closePath(); fillP(g, MC.inner);
    g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1.2; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-18 + i * 2, -16); g.lineTo(-21 + i * 3, -26 * eu); g.stroke(); }
    g.restore();
  }
  // things round the neck
  if (out === 'scarf') {
    rr(g, -28, 13, 56, 17, 8); ink(g, rad(g, 0, 18, 32, '#4f9be0'));
    g.save(); rr(g, -28, 13, 56, 17, 8); g.clip(); for (let i = -22; i < 28; i += 13) snowflake(g, i, 21.5, 4.5, '#ffffff'); g.restore();
    g.save(); g.translate(13, 24); g.rotate(.25); rr(g, 0, 0, 15, 36, 6); ink(g, '#4f9be0'); snowflake(g, 7.5, 13, 4.2, '#fff'); for (let i = 0; i < 4; i++) line(g, 2.5 + i * 3.4, 36, 2.5 + i * 3.4, 42, '#fff', 2); g.restore();
  } else if (out === 'collar') {
    rr(g, -22, 15, 44, 10, 5); ink(g, '#e0473e', 2.4);
    for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(-1, 21); g.quadraticCurveTo(sd * 14, 10, sd * 15, 22); g.quadraticCurveTo(sd * 10, 28, -1, 21); g.closePath(); ink(g, '#c8261f', 2); }
    circ(g, 0, 33, 9); ink(g, rad(g, 0, 33, 9, '#f2c23e'), 2.4); circ(g, -3, 30, 2.8); fillP(g, '#fff6c8'); line(g, -5, 35, 5, 35, '#9a7414', 2);
  } else if (out === 'elf') {
    g.beginPath(); for (let i = 0; i <= 8; i++) { const xx = -28 + i * 7; g.lineTo(xx, 14); g.lineTo(xx + 3.5, 30); } g.lineTo(28, 14); g.closePath(); ink(g, '#2f9a52', 2);
    for (let i = 0; i < 8; i++) { circ(g, -24.5 + i * 7, 28, 2.4); fillP(g, i % 2 ? '#e2443b' : '#f2c23e'); }
  } else if (out === 'jumper') {
    rr(g, -25, 12, 50, 18, 8); ink(g, rad(g, 0, 18, 30, '#d8352e')); for (let i = -20; i <= 20; i += 5) line(g, i, 15, i, 27, 'rgba(120,20,15,.45)', 2);
  } else if (out === 'gingerbread') {
    for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(0, 22); g.lineTo(sd * 13, 15); g.lineTo(sd * 13, 29); g.closePath(); ink(g, '#e2443b', 2); } circ(g, 0, 22, 4); ink(g, '#2f9a52', 1.6);
  } else if (out === 'angel') {
    rr(g, -21, 15, 42, 8, 4); ink(g, '#fbf3d6', 2); circ(g, 0, 26, 4.4); ink(g, '#f2c94e', 2);
  } else { rr(g, -21, 15, 42, 8, 4); ink(g, MC.collar, 2.2); circ(g, 0, 26, 4.4); ink(g, '#f2c94e', 2); }
  // head
  ell(g, 0, 0, 30, 26); ink(g, rad(g, 0, 0, 30, MC.fur));
  g.save(); ell(g, 0, 0, 29, 25); g.clip(); g.fillStyle = 'rgba(255,255,255,.12)'; ell(g, -8, -14, 20, 10); g.fill(); g.fillStyle = 'rgba(40,25,15,.12)'; ell(g, 6, 22, 30, 10); g.fill(); g.restore();
  g.lineCap = 'round';
  line(g, -9, -22, -6, -12, MC.stripe, 3.6); line(g, 0, -25, 0, -13, MC.stripe, 3.8); line(g, 9, -22, 6, -12, MC.stripe, 3.6);
  line(g, -29, -2, -20, 1, MC.stripe, 3); line(g, -28, 6, -20, 6, MC.stripe, 2.6); line(g, 29, -2, 20, 1, MC.stripe, 3); line(g, 28, 6, 20, 6, MC.stripe, 2.6);
  ell(g, -6.5, 10, 10, 8); fillP(g, MC.light); ell(g, 6.5, 10, 10, 8); fillP(g, MC.light); ell(g, 0, 16, 7.5, 5.5); fillP(g, MC.light);
  ell(g, -19, 9, 6, 3.8); fillP(g, 'rgba(255,130,150,.38)'); ell(g, 19, 9, 6, 3.8); fillP(g, 'rgba(255,130,150,.38)');
  for (const sd of [-1, 1]) {
    const ex = sd * 12, ey = -3;
    if (eyes === 'closed' || eyes === 'sleep') { g.beginPath(); g.arc(ex, ey - 1, 6.5, .15 * Math.PI, .85 * Math.PI); strokeP(g, OUT, 3); }
    else if (eyes === 'happy') { g.beginPath(); g.arc(ex, ey + 3, 6.5, 1.15 * Math.PI, 1.85 * Math.PI); strokeP(g, OUT, 3.2); }
    else if (eyes === 'heart') { drawHeart(g, ex, ey + 2, 1.15, '#ff4d6d'); }
    else {
      const wide = eyes === 'wide', rx = wide ? 9.6 : 8.6, ry = wide ? 10.6 : 9.8;
      ell(g, ex, ey, rx + 1.6, ry + 1.6); fillP(g, OUT);
      const ig = g.createLinearGradient(0, ey - ry, 0, ey + ry); ig.addColorStop(0, MC.eyeD); ig.addColorStop(.55, MC.eye); ig.addColorStop(1, '#f1f59a');
      ell(g, ex, ey, rx, ry); g.fillStyle = ig; g.fill();
      ell(g, ex + lx * 2.6, ey + ly * 2.6, wide ? 5.4 : 3.2, wide ? 7.8 : 7.4); fillP(g, '#1a1410');
      circ(g, ex - 2.6 + lx, ey - 4, 2.9); fillP(g, '#fff'); circ(g, ex + 3 + lx, ey + 4, 1.4); fillP(g, 'rgba(255,255,255,.85)');
      if (eyes === 'half' || eyes === 'judgy') { g.save(); ell(g, ex, ey, rx + 1.8, ry + 1.8); g.clip(); g.fillStyle = MC.fur; g.fillRect(ex - 13, ey - 15, 26, eyes === 'judgy' ? 11 : 14); line(g, ex - 10, ey - (eyes === 'judgy' ? 4 : 1), ex + 10, ey - (eyes === 'judgy' ? 4 : 1), OUT, 2.8); g.restore(); }
    }
  }
  g.beginPath(); g.moveTo(-4.5, 4.5); g.lineTo(4.5, 4.5); g.lineTo(0, 10); g.closePath(); ink(g, out === 'antlers' ? '#ff3a2e' : MC.nose, 1.6);
  if (out === 'antlers') { circ(g, -1.5, 5.5, 1.6); fillP(g, 'rgba(255,255,255,.8)'); }
  const m = o.mouth || 'smile';
  if (m === 'open' || m === 'meow') { ell(g, 0, 15.5, 5, m === 'meow' ? 6.5 : 5); ink(g, '#7a2f35', 1.8); ell(g, 0, 18.5, 3.2, 2.2); fillP(g, '#ff8f9a'); }
  else if (m === 'flat') line(g, -5, 13, 5, 13, OUT, 2);
  else { g.beginPath(); g.moveTo(-6.5, 12); g.quadraticCurveTo(-3, 15, 0, 11); g.quadraticCurveTo(3, 15, 6.5, 12); strokeP(g, OUT, 2); }
  g.globalAlpha = .85;
  for (const sd of [-1, 1]) for (let i = -1; i <= 1; i++) line(g, sd * 14, 11 + i * 3, sd * 38, 7 + i * 6, '#ffffff', 1.4);
  g.globalAlpha = 1;
  // hats + headwear
  if (out === 'santa') {
    g.save(); g.rotate(.22);
    g.beginPath(); g.moveTo(-23, -20); g.quadraticCurveTo(-4, -64, 31, -56); g.quadraticCurveTo(14, -40, 23, -20); g.closePath(); ink(g, rad(g, 0, -40, 30, '#e8372e'));
    ell(g, 0, -20, 26, 7.5); ink(g, '#fffaf2'); circ(g, 32, -55, 8); ink(g, '#fffaf2');
    g.restore();
  } else if (out === 'antlers') {
    for (const sd of [-1, 1]) {
      for (const [w, c] of [[8, OUT], [4.5, '#b07a45']]) {
        g.beginPath(); g.moveTo(sd * 11, -20); g.quadraticCurveTo(sd * 16, -44, sd * 30, -58); strokeP(g, c, w + 1);
        g.beginPath(); g.moveTo(sd * 15, -36); g.lineTo(sd * 4, -48); strokeP(g, c, w);
        g.beginPath(); g.moveTo(sd * 22, -47); g.lineTo(sd * 34, -45); strokeP(g, c, w);
      }
    }
    g.beginPath(); g.arc(0, 2, 28, 1.2 * Math.PI, 1.8 * Math.PI); strokeP(g, '#3fb26a', 4.5);
  } else if (out === 'elf') {
    g.save(); g.rotate(-.12);
    const sw = Math.sin(t * 2.4) * 3;
    g.beginPath(); g.moveTo(-25, -18); g.quadraticCurveTo(-10, -44, 2, -68); g.quadraticCurveTo(20 + sw, -86, 44 + sw, -66); g.quadraticCurveTo(26, -64, 18, -50); g.quadraticCurveTo(14, -30, 25, -18); g.closePath(); ink(g, rad(g, 0, -40, 36, '#3aa860'));
    g.beginPath(); for (let i = 0; i <= 10; i++) { g.lineTo(-27 + i * 5.4, i % 2 ? -12 : -22); } g.lineTo(27, -20); g.lineTo(-27, -20); g.closePath(); ink(g, '#e2443b', 2);
    circ(g, 46 + sw, -64, 6.5); ink(g, rad(g, 46 + sw, -64, 7, '#f2c23e'), 2); line(g, 42 + sw, -63, 50 + sw, -63, '#9a7414', 1.4);
    g.restore();
  } else if (out === 'angel') {
    const hy = -48 + Math.sin(t * 2) * 2.5;
    glowAt(g, 0, hy, 46, '255,236,150', .35, .4);
    ell(g, 0, hy, 27, 7.5); strokeP(g, '#b8861c', 7); ell(g, 0, hy, 27, 7.5); strokeP(g, '#f6cf4a', 4.4); ell(g, -2, hy - 1.4, 24, 6); strokeP(g, 'rgba(255,250,210,.9)', 1.3);
  } else if (out === 'gingerbread') {
    for (const [a, b] of [[-14, -30], [14, -30]]) { circ(g, a, b, 3.6); fillP(g, '#e2443b'); }
    circ(g, 0, -36, 3.6); fillP(g, '#2f9a52');
  }
  g.restore();
}

function monaTail(g, pts, t, wag) {
  g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
  const w = Math.sin(t * (wag || 2.2)) * 10;
  g.beginPath(); g.moveTo(pts[0], pts[1]); g.bezierCurveTo(pts[2], pts[3], pts[4] + w, pts[5], pts[6] + w * 1.4, pts[7]);
  strokeP(g, OUT, 19); strokeP(g, MC.fur, 13);
  g.setLineDash([5, 9]); strokeP(g, MC.stripe, 13); g.setLineDash([]);
  circ(g, pts[6] + w * 1.4, pts[7], 6.5); fillP(g, MC.stripe);
  g.restore();
}
function monaLeg(g, x1, y1, x2, y2, far) {
  capO(g, x1, y1, x2, y2, 14, far ? MC.furD : MC.fur, 2.6);
  ell(g, x2 + 2, y2 - 1, 9, 6); ink(g, far ? '#ddd3c6' : MC.paw, 2.4);
}
function monaStripes(g, cx, cy) { ell(g, cx, cy, 16, 10.5); strokeP(g, MC.stripe, 6.5); ell(g, cx, cy, 5, 3.5); fillP(g, MC.stripe); }
/* clothes over Mona's body. shape() builds the clip path. box = [x0,y0,x1,y1] of the garment */
function monaGarment(g, out, shape, box, t, hemX) {
  if (out !== 'jumper' && out !== 'elf' && out !== 'gingerbread') return;
  const [x0, y0, x1, y1] = box, base = out === 'jumper' ? '#d8352e' : out === 'elf' ? '#2f9a52' : '#bb7438';
  g.save(); shape(); g.clip();
  g.fillStyle = base; g.fillRect(x0, y0, x1 - x0, y1 - y0);
  const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, 'rgba(255,255,255,.22)'); gr.addColorStop(1, 'rgba(0,0,0,.2)'); g.fillStyle = gr; g.fillRect(x0, y0, x1 - x0, y1 - y0);
  const my = (y0 + y1) / 2;
  if (out === 'jumper') {
    g.fillStyle = '#fbf3e4'; g.fillRect(x0, my - 9, x1 - x0, 18);
    for (let x = x0 + 8; x < x1; x += 15) snowflake(g, x, my, 5.5, '#d8352e');
    g.fillStyle = '#2f9a52'; for (let x = x0; x < x1; x += 10) { g.beginPath(); g.moveTo(x, my - 9); g.lineTo(x + 5, my - 15); g.lineTo(x + 10, my - 9); g.fill(); g.beginPath(); g.moveTo(x, my + 9); g.lineTo(x + 5, my + 15); g.lineTo(x + 10, my + 9); g.fill(); }
    g.strokeStyle = 'rgba(120,20,15,.22)'; g.lineWidth = 1.4; for (let x = x0; x < x1; x += 6) { g.beginPath(); g.moveTo(x, y0); g.lineTo(x + 3, y0 + 5); g.lineTo(x + 6, y0); g.stroke(); }
  } else if (out === 'elf') {
    g.fillStyle = '#4a2a18'; g.fillRect(x0, my - 5, x1 - x0, 10); rr(g, (x0 + x1) / 2 - 8, my - 7, 16, 14, 3); strokeP(g, '#f2c23e', 3);
    g.fillStyle = '#e2443b'; for (let x = x0; x < x1; x += 12) { g.beginPath(); g.moveTo(x, y1); g.lineTo(x + 6, y1 - 10); g.lineTo(x + 12, y1); g.fill(); }
  } else {
    g.strokeStyle = '#fffaf2'; g.lineWidth = 3; g.beginPath(); for (let x = x0; x <= x1; x += 8) g.lineTo(x, y0 + 7 + ((x - x0) / 8 % 2 ? 4 : 0)); g.stroke();
    g.beginPath(); for (let x = x0; x <= x1; x += 8) g.lineTo(x, y1 - 7 - ((x - x0) / 8 % 2 ? 4 : 0)); g.stroke();
    for (let i = 0; i < 3; i++) { const bx = (x0 + x1) / 2 + (i - 1) * 16, by = my + (i - 1) * 4; circ(g, bx, by, 4.4); ink(g, ['#e2443b', '#2f9a52', '#f2c23e'][i], 1.6); }
  }
  g.restore();
  if (hemX != null) { g.save(); shape(); g.clip(); g.fillStyle = shade(base, -.2); g.fillRect(hemX - 4, y0, 8, y1 - y0); g.restore(); }
}
function monaWings(g, x, y, t, s2) {
  const fl = Math.sin(t * 3.2) * .14;
  for (const [far, ox, rot] of [[1, 10, -.25], [0, 0, 0]]) {
    g.save(); g.translate(x + ox, y); g.rotate(rot - .2 - fl * (far ? .6 : 1)); g.scale(s2 || 1, s2 || 1);
    g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-8, -32, -40, -58, -66, -52); g.bezierCurveTo(-56, -42, -64, -32, -52, -24); g.bezierCurveTo(-56, -14, -44, -6, -32, -4); g.bezierCurveTo(-24, 6, -10, 6, 0, 0); g.closePath();
    ink(g, rad(g, -30, -28, 40, far ? '#e6ebf3' : '#ffffff'), 2.2);
    for (const [a, b, c, d] of [[-10, -6, -46, -34], [-8, -2, -36, -16], [-12, -14, -54, -46]]) { g.beginPath(); g.moveTo(a, b); g.quadraticCurveTo((a + c) / 2, (b + d) / 2 - 6, c, d); strokeP(g, 'rgba(170,185,210,.7)', 1.6); }
    g.restore();
  }
}

function drawMona(g, x, y, s, o) {
  o = o || {};
  const t = o.t || 0, pose = o.pose || 'sit', face = o.face || 1, out = o.outfit || 'none';
  g.save(); g.translate(x, y); g.scale(face * s, s);
  const upright = pose === 'sit' || pose === 'celebrate' || pose === 'swat' || pose === 'alert' || pose === 'beg' || pose === 'eat';
  if (!o.noShadow) contactShadow(g, 0, 0, upright ? 50 : 66, 10, .42);
  const hp = Object.assign({}, o, { t });
  if (pose === 'walk' || pose === 'stand' || pose === 'run' || pose === 'rub') {
    const run = pose === 'run', sp = run ? 16 : 10, amp = pose === 'stand' ? 0 : (run ? 13 : 8);
    const ph = o.gait != null && pose !== 'rub' ? o.gait : t * sp;
    const bob = pose === 'stand' ? 0 : Math.abs(Math.sin(ph)) * (run ? 5 : 2.5);
    g.translate(0, -bob);
    if (out === 'angel') monaWings(g, 10, -60, t);
    if (pose === 'rub') monaTail(g, [-44, -50, -52, -90, -48, -120, -40, -150], t, 3);
    else monaTail(g, [-44, -46, -66, -60, -74, -96, -58, -112], t, run ? 6 : 2.5);
    const sw = i => Math.sin(ph + i) * amp;
    monaLeg(g, -26, -36, -26 + sw(Math.PI), -3 + bob, true); monaLeg(g, 30, -36, 30 + sw(0), -3 + bob, true);
    const body = () => ell(g, 0, -40, 51, 25);
    body(); ink(g, rad(g, 0, -40, 51, MC.fur));
    g.save(); ell(g, 0, -40, 49, 23); g.clip();
    ell(g, 4, -19, 40, 12); fillP(g, MC.light);
    monaStripes(g, -12, -43);
    for (const sx of [14, 26, -34, -42]) line(g, sx, -66, sx - 4, -50, MC.stripe, 5);
    g.fillStyle = 'rgba(255,255,255,.16)'; ell(g, -6, -58, 36, 7); g.fill();
    g.restore();
    monaGarment(g, out, () => ell(g, 0, -40, 49.5, 23.5), [-26, -66, 52, -15], t, -24);
    monaLeg(g, -18, -34, -18 + sw(0), -3 + bob, false); monaLeg(g, 38, -34, 38 + sw(Math.PI), -3 + bob, false);
    ell(g, 37, -53, 17, 19); ink(g, rad(g, 37, -53, 18, MC.fur)); ell(g, 43, -46, 9, 12); fillP(g, MC.light);
    monaGarment(g, out, () => ell(g, 37, -53, 16, 18), [20, -72, 56, -34], t);
    drawMonaHead(g, 46, -78, 1, Object.assign(hp, pose === 'rub' ? { tilt: .2, eyes: o.eyes || 'happy' } : {}));
  } else if (upright) {
    if (out === 'angel') monaWings(g, -6, -74, t);
    monaTail(g, [-26, -10, 0, 6, 34, 4, 44, -14], t, o.wag || 1.6);
    ell(g, -12, -30, 32, 31); ink(g, rad(g, -12, -30, 32, MC.fur));
    g.save(); ell(g, -12, -30, 30, 29); g.clip(); monaStripes(g, -14, -32); line(g, -30, -58, -36, -42, MC.stripe, 5); g.restore();
    monaGarment(g, out, () => ell(g, -12, -30, 30.5, 29.5), [-44, -60, 20, -8], t);
    const lift = pose === 'beg' ? -10 : 0;
    ell(g, 8, -54 + lift, 26, 39, -.22); ink(g, rad(g, 8, -54 + lift, 30, MC.fur));
    ell(g, 18, -52 + lift, 13, 25, -.2); fillP(g, MC.light);
    monaGarment(g, out, () => ell(g, 8, -54 + lift, 25, 38, -.22), [-20, -92 + lift, 36, -16 + lift], t);
    if (pose === 'celebrate' || pose === 'beg') {
      const b = Math.sin(t * 9) * 3;
      if (pose === 'beg') { capO(g, 16, -66, 34, -82 + b, 12, MC.fur, 2.4); capO(g, 26, -64, 42, -78 - b, 12, MC.fur, 2.4); ell(g, 36, -84 + b, 7, 6); ink(g, MC.paw, 2); ell(g, 44, -80 - b, 7, 6); ink(g, MC.paw, 2); }
      else { capO(g, 14, -58, 36, -84 + b, 12, MC.fur, 2.4); capO(g, 24, -56, 44, -78 + b, 12, MC.fur, 2.4); }
    } else if (pose === 'swat') {
      const k = o.swatK != null ? o.swatK : (Math.sin(t * 6) * .5 + .5);
      monaLeg(g, 14, -40, 14, -4, true);
      capO(g, 26, -50, 40 + 22 * k, -52 - 26 * k, 12, MC.fur, 2.4); ell(g, 42 + 22 * k, -54 - 26 * k, 8.5, 7.5); ink(g, MC.paw, 2.4);
    } else { monaLeg(g, 14, -40, 14, -4, true); monaLeg(g, 26, -40, 27, -4, false); }
    let hx = 14, hy = pose === 'celebrate' ? -104 : pose === 'beg' ? -116 : -100, tilt = pose === 'celebrate' ? -.18 : (o.tilt || 0);
    if (pose === 'eat') { hx = 46; hy = -40; tilt = .35; }
    drawMonaHead(g, hx, hy, 1, Object.assign(hp, { earsUp: pose === 'alert' || o.earsUp, tilt, eyes: pose === 'eat' ? 'happy' : hp.eyes }));
    if (pose === 'celebrate' && !o.noBugle) {
      g.save(); g.translate(26, -96); g.rotate(-.75);
      rr(g, 0, -3.5, 40, 7, 3.5); ink(g, '#f2c23e', 2.2);
      g.beginPath(); g.moveTo(38, -3); g.lineTo(58, -14); g.lineTo(58, 14); g.lineTo(38, 3); g.closePath(); ink(g, rad(g, 50, 0, 14, '#ffd75a'), 2.2);
      ell(g, 58, 0, 4, 14); ink(g, '#c8902a', 2);
      g.fillStyle = '#e0473e'; g.fillRect(12, 4, 16, 12); g.fillStyle = '#ffd75a'; g.fillRect(12, 9, 16, 3);
      g.restore();
    }
  } else if (pose === 'sleep' || pose === 'loaf' || pose === 'pin') {
    const br = Math.sin(t * 2) * 1.5;
    if (out === 'angel') monaWings(g, -4, -46, t, .8);
    ell(g, 0, -27 - br / 2, 55, 28 + br); ink(g, rad(g, 0, -30, 55, MC.fur));
    g.save(); ell(g, 0, -27 - br / 2, 53, 26 + br); g.clip();
    monaStripes(g, -14, -32);
    for (const sx of [-40, -30, 10, 22]) line(g, sx, -56, sx - 3, -40, MC.stripe, 5);
    ell(g, 10, -3, 44, 9); fillP(g, MC.light);
    g.fillStyle = 'rgba(255,255,255,.14)'; ell(g, -8, -46, 34, 7); g.fill();
    g.restore();
    monaGarment(g, out, () => ell(g, 0, -27 - br / 2, 53.5, 26.5 + br), [-24, -58, 56, 2], t, -22);
    monaTail(g, [-50, -12, -30, 8, 10, 6, 30, 0], t, .8);
    ell(g, 44, -6, 9.5, 6); ink(g, MC.paw, 2.2); ell(g, 57, -5, 9.5, 6); ink(g, MC.paw, 2.2);
    drawMonaHead(g, 40, -32, .92, Object.assign(hp, { eyes: o.eyes || (pose === 'sleep' ? 'sleep' : pose === 'pin' ? 'half' : 'open'), tilt: pose === 'sleep' ? .25 : (o.tilt || 0) }));
  } else if (pose === 'belly' || pose === 'trap') {
    const k = pose === 'trap' ? Math.sin(t * 22) : Math.sin(t * 3) * .3;
    monaTail(g, [-48, -16, -70, -10, -84, -24, -92, -40], t, 2);
    capO(g, -30, -36, -40 + k * 10, -70 - Math.abs(k) * 8, 13, MC.fur, 2.4); capO(g, -14, -38, -12 - k * 10, -74 + Math.abs(k) * 8, 13, MC.fur, 2.4);
    ell(g, -40 + k * 10, -74 - Math.abs(k) * 8, 8, 6.5); ink(g, MC.paw, 2); ell(g, -12 - k * 10, -78 + Math.abs(k) * 8, 8, 6.5); ink(g, MC.paw, 2);
    ell(g, 0, -26, 54, 25); ink(g, rad(g, 0, -26, 54, MC.fur));
    g.save(); ell(g, 0, -26, 52, 23); g.clip(); ell(g, 2, -40, 42, 18); fillP(g, MC.light); for (let i = -30; i < 30; i += 12) { g.globalAlpha = .25; line(g, i, -52, i + 3, -42, '#d9cdbd', 3); g.globalAlpha = 1; } g.restore();
    if (pose === 'trap') { const p = o.trapPt || [44, -86]; capO(g, 20, -40, p[0] - 10, p[1] + 6, 13, MC.fur, 2.4); capO(g, 34, -36, p[0] + 10, p[1] + 10, 13, MC.fur, 2.4); ell(g, p[0] - 10, p[1] + 4, 8, 7); ink(g, MC.paw, 2); ell(g, p[0] + 10, p[1] + 8, 8, 7); ink(g, MC.paw, 2); }
    else { capO(g, 22, -40, 26 + k * 6, -72, 12, MC.fur, 2.4); capO(g, 34, -38, 42 - k * 6, -70, 12, MC.fur, 2.4); ell(g, 26 + k * 6, -74, 7.5, 6); ink(g, MC.paw, 2); ell(g, 42 - k * 6, -72, 7.5, 6); ink(g, MC.paw, 2); }
    drawMonaHead(g, 54, -24, .92, Object.assign(hp, { tilt: Math.PI - .5, eyes: pose === 'trap' ? 'wide' : (o.eyes || 'happy'), mouth: pose === 'trap' ? 'open' : o.mouth }));
  } else if (pose === 'pounce') {
    if (out === 'angel') monaWings(g, 0, -66, t);
    monaTail(g, [-46, -54, -76, -64, -90, -84, -98, -96], t, 3);
    monaLeg(g, -30, -44, -62, -18, true); monaLeg(g, 30, -56, 66, -48, true);
    ell(g, 0, -52, 55, 22, -.12); ink(g, rad(g, 0, -52, 55, MC.fur));
    g.save(); ell(g, 0, -52, 53, 20, -.12); g.clip(); monaStripes(g, -12, -52); for (const sx of [16, 28, -36]) line(g, sx, -76, sx - 3, -60, MC.stripe, 5); g.restore();
    monaGarment(g, out, () => ell(g, 0, -52, 53.5, 20.5, -.12), [-24, -76, 58, -30], t, -22);
    monaLeg(g, -22, -42, -54, -12, false); monaLeg(g, 36, -54, 74, -40, false);
    drawMonaHead(g, 52, -78, 1, Object.assign(hp, { eyes: 'wide' }));
  }
  g.restore();
}
