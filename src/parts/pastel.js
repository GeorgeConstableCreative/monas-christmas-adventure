/* ---- v6.6: soft pastel comic style ----
   Flat, bright and airy: the heavy night lighting is mostly lifted, colour glows are gentle, and every scene
   gets a light cream wash that softens the colours towards pastel, so the thin black ink reads cleanly. */
{
  const _lm = lightMap;
  lightMap = function (ambient, lights) {
    const p = String(ambient).split(','), a = parseFloat(p[3] || '.5');
    p[3] = String(+(a * .28).toFixed(3));
    _lm(p.join(','), lights.map(L => Object.assign({}, L, { ca: (L.ca == null ? .16 : L.ca) * .45 })));
  };
}
vigDraw = function () {
  ctx.save();
    ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = 'rgba(246,238,222,.07)'; ctx.fillRect(0, 0, W, H);
  ctx.restore();
};

/* ---- v6.7: a pastel comic palette for every story scene ----
   While a story scene draws, each flat colour is remapped: inky darks stay black, cool greys become soft
   lavender (the sofa, the stone, the shadows), and everything else is lifted towards cream and softened. */
let PASTEL = false;
const PAL_CACHE = new Map();
function palParse(c) {
  if (typeof c !== 'string') return null;
  let m;
  if (c[0] === '#') { let h = c.slice(1); if (h.length === 3 || h.length === 4) h = h.split('').map(x => x + x).join(''); if (h.length < 6) return null; return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1]; }
  if ((m = c.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/))) return [+m[1], +m[2], +m[3], m[4] == null ? 1 : +m[4]];
  return null;
}
function palMap(c) {
  let v = PAL_CACHE.get(c); if (v !== undefined) return v;
  const p = palParse(c); if (!p) { PAL_CACHE.set(c, c); return c; }
  let [r, g, b, a] = p; r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0, l = (mx + mn) / 2;
  if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
  if (l < .16) v = c;                                                    // ink stays ink
  else {
    if (s < .16) { s = Math.min(s, .04); l = .2 + l * .8; }                // greys stay neutral grey, a touch lighter
    else { s = Math.min(1, s * 1.22 + .06); l = l + (.6 - l) * .12; }      // colours -> bright and clear
    const q = l < .5 ? l * (1 + s) : l + s - l * s, pp = 2 * l - q, hue = t => { t = (t + 1) % 1; return t < 1 / 6 ? pp + (q - pp) * 6 * t : t < .5 ? q : t < 2 / 3 ? pp + (q - pp) * (2 / 3 - t) * 6 : pp; };
    v = 'rgba(' + Math.round(hue(h + 1 / 3) * 255) + ',' + Math.round(hue(h) * 255) + ',' + Math.round(hue(h - 1 / 3) * 255) + ',' + a + ')';
  }
  if (PAL_CACHE.size > 6000) PAL_CACHE.clear(); PAL_CACHE.set(c, v); return v;
}
{
  const P = CanvasRenderingContext2D.prototype, fd = Object.getOwnPropertyDescriptor(P, 'fillStyle');
  for (const prop of ['fillStyle', 'strokeStyle']) {
    const d = Object.getOwnPropertyDescriptor(P, prop);
    Object.defineProperty(P, prop, { configurable: true, enumerable: d.enumerable, get() { return d.get.call(this); }, set(v) { if (prop === 'fillStyle') this._txtFill = v; d.set.call(this, PASTEL && typeof v === 'string' ? palMap(v) : v); } });
  }
  // text keeps its true colour so it stays readable
  const _ft = P.fillText;
  P.fillText = function () {
    if (!PASTEL || typeof this._txtFill !== 'string') return _ft.apply(this, arguments);
    const cur = fd.get.call(this); fd.set.call(this, this._txtFill); try { return _ft.apply(this, arguments); } finally { fd.set.call(this, cur); }
  };
  // gradient stops too
  const _lin = P.createLinearGradient, _rad = P.createRadialGradient;
  const wrapG = gr => { const add = gr.addColorStop.bind(gr); gr.addColorStop = (o, c) => add(o, PASTEL ? palMap(c) : c); return gr; };
  P.createLinearGradient = function () { return wrapG(_lin.apply(this, arguments)); };
  P.createRadialGradient = function () { return wrapG(_rad.apply(this, arguments)); };
}
// story scenes draw in the pastel palette; the arcade games keep their retro colours
for (const id in SCENES) {
  const S = SCENES[id]; if (!S || GAMES[id] || id === 'arcade' || id === 'levels' || id === 'splash') continue;
  for (const fn of ['draw']) if (Object.prototype.hasOwnProperty.call(S, fn) && typeof S[fn] === 'function') {
    const f = S[fn]; S[fn] = function () { const was = PASTEL; PASTEL = true; try { return f.apply(this, arguments); } finally { PASTEL = was; } };
  }
}
// anything a story scene hands to the UI layer to draw later is drawn in true colour
{ const _dl = deferLate; deferLate = function (fn) { _dl(function () { const was = PASTEL; PASTEL = false; try { fn(); } finally { PASTEL = was; } }); }; }

/* ---- v6.9: Mona (and the party cats) keep their real tabby colours; greys stay grey ---- */
for (const nm of ['drawMona', 'drawMonaHead', 'drawMonaPeek']) {
  const f = window[nm]; if (typeof f !== 'function') continue;
  const w = function () { const was = PASTEL; PASTEL = false; try { return f.apply(this, arguments); } finally { PASTEL = was; } };
  if (nm === 'drawMona') drawMona = w; else if (nm === 'drawMonaHead') drawMonaHead = w; else drawMonaPeek = w;
}
