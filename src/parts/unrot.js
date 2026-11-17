/* ---- v7.3: words stay upright on a turned game board ----
   When a game is turned on its side to fit a phone held upright (Paw Pong), every piece of text on the
   board (scores, names, "Point to Mona!", "SWAT!") is turned back so it reads normally. */
let UNROT = 0;
{
  const _t = text;
  text = function (g, s, x, y, o) {
    if (!UNROT) return _t(g, s, x, y, o);
    g.save(); g.translate(x, y); g.rotate(UNROT); try { return _t(g, s, 0, 0, o); } finally { g.restore(); }
  };
}
