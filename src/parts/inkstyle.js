/* ---- v6: ink & print style ----
   Thick near-black ink outlines, flat fills with no soft shading, gradients cut into hard
   bands like screen-printed colour, and a fine black-and-white speckle over everything. */
const INK_K = '#1d1a1c';
let FLATG = false;   // gradients stay smooth (hard bands looked like a split screen)   // set false around a gradient that should stay smooth (gold foil on the card)

// outlines: darker and a third thicker everywhere
ink = function (g, fill, lw) { g.fillStyle = fill; g.fill(); g.lineJoin = 'round'; g.lineCap = 'round'; g.strokeStyle = INK_K; g.lineWidth = (lw || 3) * .9; g.stroke(); };
capO = function (g, x1, y1, x2, y2, w, col, lw) { lw = (lw || 3) * .9; capsule(g, x1, y1, x2, y2, w + lw * 2, INK_K); capsule(g, x1, y1, x2, y2, w, col); };
// no soft radial shading: bodies, heads and props are flat colour
rad = function (g, x, y, r, base) { return base; };
handO = function (g, x, y, r) { circ(g, x, y, r || 9.5); ink(g, SC.skin, 2.6); };

// every linear gradient becomes hard-edged bands: each colour holds until halfway to the next
{
  const P = CanvasRenderingContext2D.prototype, _lin = P.createLinearGradient;
  P.createLinearGradient = function () {
    const gr = _lin.apply(this, arguments); if (!FLATG) return gr;
    const add = gr.addColorStop.bind(gr); let po = null, pc = null;
    gr.addColorStop = function (o, c) { if (po !== null && o > po) { const m = (po + o) / 2; add(m, pc); add(m, c); } add(o, c); po = o; pc = c; };
    return gr;
  };
}
// flat cut-out shadows on the floor instead of soft blurred ones
contactShadow = function (g, x, y, rx, ry, a) { g.save(); ell(g, x, y, rx * .82, ry * .82); g.fillStyle = 'rgba(27,20,17,' + Math.min(.26, (a || .38) * .6) + ')'; g.fill(); g.restore(); };
// glows are toned down so colour stays flat and graphic
{ const _glow = glowAt; glowAt = function (g, x, y, r, col, a, sy) { _glow(g, x, y, r, col, a * .55, sy); }; }
// no dark photographic vignette
vigDraw = function () {};

// the speckle: sparse dark and light flecks, like ink on rough paper
let SPECK = null;
function speckPattern() {
  if (SPECK) return SPECK;
  const n = 300, c = document.createElement('canvas'); c.width = c.height = n; const g = c.getContext('2d'), r = mulberry(7);
  for (let i = 0; i < 1100; i++) {
    g.fillStyle = i % 2 ? 'rgba(20,14,12,.85)' : 'rgba(255,252,244,.9)';
    const x = r() * n, y = r() * n, s = .9 + r() * 1.3; g.save(); g.translate(x, y); g.rotate(r() * 3); g.fillRect(-s / 2, -s * .35, s, s * (.5 + r() * .5)); g.restore();
  }
  SPECK = ctx.createPattern(c, 'repeat');
  const d = window.devicePixelRatio || 1; if (SPECK.setTransform) SPECK.setTransform(new DOMMatrix().scale(d, d));
  return SPECK;
}
drawGrain = function () {};
{
  const _rf = renderFrame;
  renderFrame = function (dt) {
    _rf(dt);
  };
}
