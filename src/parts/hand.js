/* ---- v6.8: a proper pointing hand (white cartoon glove, black outline) for every "tap here" hint ----
   The fingertip sits at (x, y); the hand hangs below it. s = size, rot = turn about the fingertip. */
function drawHand(g, x, y, s, rot, press) {
  g.save(); g.translate(x, y); if (rot) g.rotate(rot); g.scale(s, s * (press ? .92 : 1));
  const shape = () => {
    g.beginPath(); g.roundRect(-7, 0, 14, 44, 7);                          // index finger
    g.roundRect(-9, 28, 42, 36, 12);                                       // palm
    g.moveTo(21, 34); g.arc(14, 34, 7, 0, TAU); g.moveTo(31, 36); g.arc(24, 36, 7, 0, TAU); g.moveTo(39, 40); g.arc(32, 40, 7, 0, TAU); // folded fingers
    g.moveTo(-4, 48); g.ellipse(-12, 42, 12, 7, -.6, 0, TAU);              // thumb
    g.roundRect(-6, 60, 36, 14, 4);                                        // cuff
  };
  g.lineJoin = 'round'; shape(); g.lineWidth = 6; g.strokeStyle = '#1d1a1c'; g.stroke(); g.fillStyle = '#ffffff'; g.fill();
  // knuckle creases and the cuff seam
  g.strokeStyle = '#1d1a1c'; g.lineWidth = 2; g.lineCap = 'round';
  g.beginPath(); g.moveTo(14, 30); g.lineTo(14, 38); g.moveTo(24, 32); g.lineTo(24, 40); g.moveTo(-3, 60); g.lineTo(27, 60); g.stroke();
  g.restore();
}
/* the remote: the old peach blob finger becomes the glove, tapping the lit button */
{
  const _atv = drawATVRemote;
  drawATVRemote = function (g, t, next, press, gr) {
    _atv(g, t, null, press, gr);
    if (!next) return;
    const [bx, by, r] = ATV_BTNS[next], p = .5 + .5 * Math.sin(t * 7), tap = Math.max(0, Math.sin(t * 5));
    g.save(); g.shadowColor = '#ffd84d'; g.shadowBlur = 22; circ(g, bx, by, r + 8 + p * 5); strokeP(g, '#ffd84d', 6); g.restore();
    drawHand(g, bx + 4, by + 6 + (1 - tap) * 22, 1.05, -.35, tap > .9);
  };
}
