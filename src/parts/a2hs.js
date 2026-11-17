/* ---- v9.3: "Save to your Home Screen" help ----
   A button on the home screen (and a one-time nudge on phones) opens a card with the steps for
   the phone in use: Safari on iPhone/iPad, or Chrome on Android. Once saved, the game opens full
   screen like an app, with its own Mona icon. Hidden when the game is already running from the Home Screen. */
const A2 = {
  ios: /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1),
  standalone: (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true,
  el: null
};
function a2Icon(kind) {
  const s = 'width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1d3b31" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  if (kind === 'share') return '<svg ' + s.replace('#1d3b31', '#0a7aff') + '><path d="M12 15V3"/><path d="M7.5 7.5 12 3l4.5 4.5"/><path d="M8 11H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-2"/></svg>';
  if (kind === 'dots') return '<svg ' + s + '><circle cx="12" cy="5" r="1.4" fill="#1d3b31"/><circle cx="12" cy="12" r="1.4" fill="#1d3b31"/><circle cx="12" cy="19" r="1.4" fill="#1d3b31"/></svg>';
  if (kind === 'more') return '<svg ' + s + '><circle cx="5" cy="12" r="1.4" fill="#1d3b31"/><circle cx="12" cy="12" r="1.4" fill="#1d3b31"/><circle cx="19" cy="12" r="1.4" fill="#1d3b31"/></svg>';
  if (kind === 'plus') return '<svg ' + s + '><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';
  return '<img src="' + (A2.icon || '') + '" width="30" height="30" style="border-radius:8px">';
}
function a2Show() {
  if (A2.el) return;
  const steps = A2.ios
    ? [['share', 'Tap the Share button', 'At the bottom of Safari. If you can\'t see it, tap ••• first, then Share.'],
       ['plus', 'Choose "Add to Home Screen"', 'Scroll down the list a little to find it.'],
       ['icon', 'Tap "Add"', 'Mona appears with your other apps. Tap her to play full screen.']]
    : [['dots', 'Open the browser menu', 'The ⋮ button at the top right of Chrome.'],
       ['plus', 'Choose "Add to Home screen"', 'Some browsers call it "Install app".'],
       ['icon', 'Tap "Add"', 'Mona appears with your other apps. Tap her to play full screen.']];
  const d = document.createElement('div');
  d.style.cssText = 'position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(40,12,18,.55);font-family:Jost,Futura,"Century Gothic",sans-serif;opacity:0;transition:opacity .25s ease-out';
  d.innerHTML = '<div style="position:relative;width:min(440px,100%);max-height:100%;overflow:auto;background:#fffaf3;border-radius:28px;padding:18px 16px 18px;box-shadow:0 18px 50px rgba(0,0,0,.35);transform:translateY(16px) scale(.97);transition:transform .35s cubic-bezier(.2,.9,.3,1.15)">'
    + '<div style="position:absolute;inset:8px;border:3px dashed #c8202a;border-radius:22px;pointer-events:none;opacity:.55"></div>'
    + '<button aria-label="Close" data-x style="position:absolute;top:10px;right:10px;width:44px;height:44px;border-radius:50%;border:0;background:#f4d4d6;font-size:24px;color:#3a0d14;cursor:pointer">✕</button>'
    + '<div style="text-align:center">' + (A2.ios ? a2Icon('share') : a2Icon('dots')) + '</div>'
    + '<h2 style="margin:6px 0 4px;text-align:center;font-size:24px;font-weight:700;line-height:1.1"><span style="color:#ff2e93">Save</span> <span style="color:#0a8be0">to</span> <span style="color:#25b33f">your</span> <span style="color:#ff3a1f">Home</span> <span style="color:#8f62f0">Screen</span></h2>'
    + '<p style="margin:0 0 10px;text-align:center;color:#6b5a5c;font-size:15px">Then Mona\'s game opens full screen, like an app.</p>'
    + steps.map(([ic, h, s], i) => '<div style="display:flex;gap:12px;align-items:center;background:#fff;border:2px solid #f1e2e3;border-radius:18px;padding:9px 12px;margin-bottom:8px">'
      + '<div style="flex:none;width:34px;height:34px;border-radius:50%;background:' + ['#c8202a', '#1f6b33', '#0a8be0'][i] + ';color:#fff;font-weight:700;font-size:18px;display:flex;align-items:center;justify-content:center">' + (i + 1) + '</div>'
      + '<div style="flex:none;width:30px;display:flex;justify-content:center">' + a2Icon(ic) + '</div>'
      + '<div><div style="font-weight:700;font-size:17px;color:#2a1a1d;line-height:1.15">' + h + '</div><div style="font-size:14px;color:#7a6a6c;line-height:1.25">' + s + '</div></div></div>').join('')
    + (A2.ios ? '<p style="margin:4px 0 12px;text-align:center;color:#9c2330;font-size:14px;font-weight:600">Use Safari. If the game is open inside another app, tap "Open in Safari" first.</p>' : '<p style="margin:4px 0 12px;text-align:center;color:#9c2330;font-size:14px;font-weight:600">Open the game in its own tab first, not inside another app.</p>')
    + '<div style="text-align:center"><button data-x style="min-width:180px;height:52px;border-radius:16px;border:3px solid #3a0d14;background:#1f6b33;color:#fff;font:700 20px Jost,sans-serif;letter-spacing:.06em;box-shadow:6px 7px 0 #3a0d14;cursor:pointer">GOT IT</button></div></div>';
  const close = () => { d.style.opacity = '0'; setTimeout(() => d.remove(), 250); A2.el = null; try { localStorage.setItem('mona-a2hs', '1'); } catch (e) {} };
  d.addEventListener('pointerdown', e => { e.stopPropagation(); if (e.target === d || e.target.closest('[data-x]')) close(); }, true);
  ['pointerup', 'pointermove', 'touchstart', 'touchend', 'click'].forEach(ev => d.addEventListener(ev, e => e.stopPropagation(), true));
  document.body.appendChild(d); A2.el = d;
  requestAnimationFrame(() => { d.style.opacity = '1'; d.firstChild.style.transform = 'none'; });
}
/* the app icon: Mona's face on cranberry, offered to iOS and Android */
(function () {
  try {
    const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d');
    g.fillStyle = '#c8202a'; g.fillRect(0, 0, 512, 512);
    g.fillStyle = 'rgba(255,255,255,.12)'; for (let i = 0; i < 8; i++) { g.beginPath(); g.arc(256, 256, 60 + i * 40, 0, Math.PI * 2); g.lineWidth = 10; g.strokeStyle = 'rgba(255,255,255,.07)'; g.stroke(); }
    drawMona(g, 256, 470, 2.2, { pose: 'sit', face: 1, t: 0, outfit: 'santa', eyes: 'happy', noShadow: true });
    A2.icon = c.toDataURL('image/png');
    const l = document.createElement('link'); l.rel = 'apple-touch-icon'; l.href = A2.icon; document.head.appendChild(l);
    const m = { name: "Mona's Christmas Adventure", short_name: "Mona's Xmas", display: 'standalone', orientation: 'portrait', background_color: '#8e1f2c', theme_color: '#8e1f2c', start_url: location.href.split('#')[0], icons: [{ src: A2.icon, sizes: '512x512', type: 'image/png' }] };
    const ml = document.createElement('link'); ml.rel = 'manifest'; ml.href = 'data:application/manifest+json,' + encodeURIComponent(JSON.stringify(m)); document.head.appendChild(ml);
  } catch (e) {}
})();
/* the home-screen button, and a single nudge on a phone the first time */
{
  const _sign = SCENES.home.drawSign;
  SCENES.home.drawSign = function (t) {
    _sign.call(this, t);
    if (A2.standalone) return;
    const k = clamp((this.t - 1.6) / .4, 0, 1); if (k <= 0) return;
    const bw = 330, bh = 58, x = W / 2 - bw / 2, y = PORT ? 360 : 300;
    ctx.save(); ctx.globalAlpha = k;
    UI.button('a2hs', x, y, bw + 6, bh + 7, () => {
      const dn = UI.pressed === 'a2hs', o = dn ? 5 : 0;
      rr(ctx, x + 5, y + 6, bw, bh, 16); ctx.fillStyle = '#3a0d14'; ctx.fill();
      rr(ctx, x + o, y + o, bw, bh, 16); ctx.fillStyle = '#fffaf3'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#3a0d14'; ctx.stroke();
      ctx.save(); ctx.translate(x + o + 34, y + o + bh / 2); ctx.strokeStyle = '#0a7aff'; ctx.lineWidth = 3.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(0, 6); ctx.lineTo(0, -14); ctx.moveTo(-7, -7); ctx.lineTo(0, -14); ctx.lineTo(7, -7); ctx.moveTo(-5, -2); ctx.lineTo(-10, -2); ctx.lineTo(-10, 14); ctx.lineTo(10, 14); ctx.lineTo(10, -2); ctx.lineTo(5, -2); ctx.stroke(); ctx.restore();
      ctx.font = '600 24px ' + F_GEO2; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#3a0d14'; ctx.fillText('Add to Home Screen', x + o + bw / 2 + 20, y + o + bh / 2 + 1);
    }, () => a2Show());
    ctx.restore();
    if (!A2.nudged && this.t > 3 && matchMedia('(pointer: coarse)').matches) { A2.nudged = true; let seen = null; try { seen = localStorage.getItem('mona-a2hs'); } catch (e) {} if (!seen) a2Show(); }
  };
}
