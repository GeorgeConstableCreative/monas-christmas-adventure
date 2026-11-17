import os
HERE = os.path.dirname(os.path.abspath(__file__))
import re, sys
src = open(os.path.join(HERE, 'v1src.html')).read()
L = src.split('\n')

def find(prefix, start=0):
    for i in range(start, len(L)):
        if L[i].startswith(prefix):
            return i
    raise Exception('not found: ' + prefix)

def cut(a, b):  # remove lines [a, b)
    for i in range(a, b):
        L[i] = None

# --- section boundaries (computed before any edits) ---
i_save = find('/* ============ Save data')
i_part = find('/* ============ Particles')
i_pause = find('/* ============ Pause menu')
i_ripple = find('/* ============ Tap ripples')
i_how = find('/* ============ How to play cards')
i_audio = find('/* ============ Audio:')
i_mhead = find('function drawMonaHead(')
i_mpeek = find('function drawMonaPeek(')
i_levels = find('/* ============ Level select')
i_l2 = find('/* ============ Level 2:')
i_backpt = find('function backPt(')
i_chore = find('function drawChoreIconG(')
i_ipad = find('/* ============ iPad interlude')
i_pick2b = find('function pick2(a, n)')
i_l5 = find('/* ============ Level 5:')
i_words = find('/* ============ Finale: word search')
i_tet = find('SCENES.tetris = {')
i_boot = find('/* ============ Boot')

# save data -> v2 (free outfits, story progress, game modes)
save_v2 = r"""/* ============ Save data ============ */
const SAVE_KEY = 'monaXmas.v3';
let save = { done: {}, paws: {}, outfit: 'santa', seenIntro: false, story: -1, played: {}, modes: { pong: 'mona', pac: 'mona', tetris: 'mona' } };
try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (s) save = Object.assign(save, s); } catch (e) { }
function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { } }
const TOTAL_PAWS = 12;
function pawCount() { return Object.keys(save.paws).length; }
const OUTFITS = [
  { id: 'none', name: 'Just Mona' }, { id: 'santa', name: 'Santa Hat' }, { id: 'antlers', name: 'Reindeer Antlers' },
  { id: 'elf', name: 'Little Elf' }, { id: 'jumper', name: 'Christmas Jumper' }, { id: 'collar', name: 'Jingle Bell Collar' },
  { id: 'scarf', name: 'Snowflake Scarf' }, { id: 'gingerbread', name: 'Gingerbread' }, { id: 'angel', name: 'Little Angel' }
];
function outfitOk(id) { return !!OUTFITS.find(o => o.id === id); }
function curOutfit() { return outfitOk(save.outfit) ? save.outfit : 'none'; }
function markDone(id) { save.done[id] = true; persist(); }
function collectPaw(id, x, y) {
  if (save.paws[id]) return false;
  save.paws[id] = true; persist(); if (PAUSABLE.includes(sceneName)) addPts(100, x, y - 40, 'Paw print!', true);
  audio.sfx('chime'); spawn('sparkle', x, y, 14);
  toast('Hidden paw print!  ' + pawCount() + ' / ' + TOTAL_PAWS);
  return true;
}
"""
L[i_save] = save_v2
cut(i_save + 1, i_part)
cut(i_pause, i_ripple)          # pause menu moves to story.js
cut(i_how, i_audio)             # how-to cards move to story.js
L[i_mhead] = open(os.path.join(HERE, 'parts', 'mona.js')).read()
cut(i_mhead + 1, i_mpeek)
cut(i_levels, i_backpt)         # level select, wardrobe, L1, L2 scene start
cut(i_backpt + 1, i_chore)      # rest of the L2 scene (keep backPt + kitchen helpers)
cut(i_ipad, i_words)            # ipad interlude, pong, mona-man, pick2 dup, bedtime
# keep words, card, gift helpers; drop the old tetris scene
cut(i_tet, i_boot)
for nm in ['btn', 'panel', 'doneCard', 'skipBtn', 'drawHUD']:
    for i in range(len(L)):
        if L[i] is not None and L[i].startswith('function ' + nm + '('):
            L[i] = L[i].replace('function ' + nm + '(', 'function ' + nm + '_v1(', 1); break
    else: raise Exception('no def ' + nm)
parts = ['visual.js', 'ui.js', 'story.js', 'arrive.js', 'groc.js', 'sofa.js', 'games.js', 'bed.js', 'rave.js', 'pantry.js', 'remote.js', 'arcade2.js', 'card3.js', 'polish.js', 'portrait.js', 'design.js', 'xmas.js', 'lettering.js','cardx.js','inkstyle.js','tiles.js','tags.js','remote2.js','pastel.js','hand.js','remote3.js','remote4.js','levels2.js','unrot.js','arcadefx.js','kart3d.js','titlesign.js','house2.js','flatsci.js','geotype.js','a2hs.js','homebtns.js']
L[i_boot] = '\n'.join(open(os.path.join(HERE, 'parts', p)).read() for p in parts) + '\n' + L[i_boot]
out = '\n'.join(l for l in L if l is not None)

def rep(old, new, count=1):
    global out
    n = out.count(old)
    if n != count:
        raise Exception('expected %d got %d for: %s' % (count, n, old[:80]))
    out = out.replace(old, new)

# Samantha carries the Grocery Outlet bag, or a single item
rep("""  if (pose === 'carry') {
    g.save(); g.translate(rh[0] + 6, rh[1] + 4);""", """  if (pose === 'carry' && o.carryItem) drawGroceryItem(g, o.carryItem, rh[0] + 6, rh[1] + 30, .62, t);
  else if (pose === 'carry' && o.bag !== false) drawGroceryBag(g, rh[0] + 4, rh[1] + 60, .5, ['eggnog', 'cereal', 'milk', 'cranberry', 'treats'], t);
  if (pose === 'carry' && false) {
    g.save(); g.translate(rh[0] + 6, rh[1] + 4);""")
# Sim passes extra bits through to the characters
rep("""outfit: S.outfit, mona: { outfit: curOutfit(), t, eyes: 'happy' } });""", """outfit: S.outfit, carryItem: S.carryItem, mona: { outfit: curOutfit(), t, eyes: 'happy' } });""")
rep("""earsUp: M.pose === 'alert', noShadow: M.h > 0 || !!M.jump });""", """earsUp: M.pose === 'alert' || M.earsUp, tilt: M.tilt, earsBack: M.earsBack, noShadow: M.h > 0 || !!M.jump });""")
# input: the how-to card can be dragged away
rep("""  input.ui = UI.press(p.x, p.y);
""", """  input.ui = UI.press(p.x, p.y);
  if (!input.ui && howCard) { howDown(p.x, p.y); return; }
""")
rep("""  input.x = p.x; input.y = p.y;
  if (!input.ui""", """  input.x = p.x; input.y = p.y;
  if (howCard && !input.ui) { howMove(p.x, p.y); return; }
  if (!input.ui""")
rep("""  if (input.ui) { UI.release(p.x, p.y); input.ui = false; return; }
""", """  if (input.ui) { UI.release(p.x, p.y); input.ui = false; return; }
  if (howCard) { howUp(p.x, p.y); return; }
""")
# home screen buttons: play / continue, levels, dress Mona
rep("""      }, () => go(save.seenIntro ? 'l1' : 'splash'));
      btn('levels', W / 2 - 480, 796, 270, 72, 'Levels', () => go('levels'), { color: '#2f9a5e', size: 30 });
      btn('wardrobe', W / 2 + 210, 796, 270, 72, "Mona's Outfits", () => go('wardrobe'), { color: '#d99a2a', size: 28 });""",
"""      }, () => { const r = save.story > 0 && save.story < STORY.length - 1; storyGo(r ? save.story : 0); });
      btn('levels', W / 2 - 480, 796, 270, 72, 'Sections', () => go('levels'), { color: '#2f9a5e', size: 30 });
      btn('wardrobe', W / 2 + 210, 796, 270, 72, 'Dress Mona', () => go('dress'), { color: '#d99a2a', size: 30 });""")
rep("""        text(ctx, 'PLAY!', W / 2, 826, { size: 50, color: '#fff', weight: 700, stroke: '#9a1f1a', sw: 8 });""",
"""        const resume = save.story > 0 && save.story < STORY.length - 1;
        text(ctx, resume ? 'CONTINUE' : 'PLAY!', W / 2, 826, { size: resume ? 40 : 50, color: '#fff', weight: 700, stroke: '#9a1f1a', sw: 8 });""")
rep("""    pawMini(24, 28);""", """    if (save.story > 0 && save.story < STORY.length - 1 && bk > .9) { btn('startover', W / 2 - 100, 700, 200, 46, 'Start again', () => storyGo(0), { color: 'rgba(80,40,30,.7)', size: 20 }); text(ctx, 'Up to: ' + (STORY_TITLES[STORY[save.story]] || ''), W / 2, 680, { size: 20, color: '#fff8ec', weight: 700, stroke: 'rgba(90,30,20,.55)', sw: 6 }); }
    pawMini(24, 28);""")
# splash copy + flow
rep("""  ['heart', 'Tap Mona to give her a scratch.'],
  ['fish', 'When she meows, tap what she wants.'],
  ['paw', 'Find hidden paw prints to unlock outfits.'],
  ['home', 'Tap the house any time to go home.']""", """  ['heart', 'Hide the party before Samantha gets home!'],
  ['fish', 'At each break, pick an arcade game. All star Mona.'],
  ['paw', 'Every scene has a one-line how-to. Tap to start.'],
  ['home', 'Pause, skip, go back or jump to any section, any time.']""")
rep("""    line1('Samantha has a lot to do. Mona has one job:', W / 2, 218, 27, '#5a4a42', 500);""", """    line1('Samantha is out at Grocery Outlet. Mona has a secret:', W / 2, 218, 27, '#5a4a42', 500);""")
rep("""    line1('love Samantha. Loudly. Help them through the day!', W / 2, 254, 27, '#5a4a42', 500);""", """    line1('a cat rave. Help her get away with it!', W / 2, 254, 27, '#5a4a42', 500);""")
rep("""() => { save.seenIntro = true; persist(); go('l1'); }""", """() => { save.seenIntro = true; persist(); if (inStory()) storyNext(); else go('home'); }""")
# words + card
rep("""if (this.doneT > 2.2 && !this.left) { this.left = true; go('card'); }""", """if (this.doneT > 2.2 && !this.left) { this.left = true; if (inStory()) storyNext(); else go('card'); }""")
rep("""markDone('finale');""", """markDone('words');""")
rep("""SCENES.card = {
  enter() { audio.music('card'); this.burst = false; },""", """SCENES.card = {
  enter() { audio.music('card'); this.burst = false; if (inStory()) { save.story = -1; save.finished = true; persist(); } },""")
rep("""      btn('again', W / 2 - 300, 812, 280, 72, 'Play again', () => go('home'), { color: '#2f9a5e', size: 30 });""", """      btn('again', W / 2 - 300, 812, 280, 72, 'Back to start', () => go('home'), { color: '#2f9a5e', size: 30 });""")
# a soft white flash when the words scene arrives from the iPad zoom
rep("""SCENES.words = {
  enter() {""", """SCENES.words = {
  enter(prm) { this.flash = prm && prm.fromZoom ? 1 : 0; this.left = false;""")
rep("""    if (this.done) banner('All the words!', this.doneT, 450, '#3a8a55');""", """    if (this.done) banner('All the words!', this.doneT, 450, '#3a8a55');
    if (this.flash > 0) { this.flash = Math.max(0, this.flash - 1 / 40); ctx.fillStyle = 'rgba(255,255,255,' + E.inOut(this.flash) + ')'; ctx.fillRect(0, 0, W, H); }""")
# Sim: a resting zoom level the camera returns to after a zoom punch
rep("""if (Z.hold > 0) { Z.hold -= dt; if (Z.hold <= 0) { Z.target = 1; Z.tcx = Z.tfx; Z.tcy = Z.tfy; } }""", """if (Z.hold > 0) { Z.hold -= dt; if (Z.hold <= 0) { Z.target = this.baseZ || 1; if (this.baseF) { Z.tfx = Z.tcx = this.baseF.x; Z.tfy = Z.tcy = this.baseF.y; } else { Z.tcx = Z.tfx; Z.tcy = Z.tfy; } } }""")
rep("""zoomTo(z, x, y, hold) { const Z = this.z; if (Z.hold > 5) return; Z.target = z; Z.tfx = x; Z.tfy = y; Z.tcx = clamp(x, 300, W - 300); Z.tcy = clamp(y, 300, H - 290); if (Z.z < 1.02""", """zoomTo(z, x, y, hold) { const Z = this.z; if (Z.hold > 5) return; Z.target = z; Z.tfx = x; Z.tfy = y; Z.tcx = clamp(x, 300, W - 300); Z.tcy = clamp(y, 300, H - 290); if (Z.z < (this.baseZ || 1) + .02 && !this.baseF""")
rep("const PTS_CAT = { ", "const PTS_CAT = { 'So comfy!': 'Calming Mona', 'Put away!': 'Shopping', 'Settled!': 'Settling Mona', 'Scratch!': 'Scratches', 'Paw print!': 'Paw prints', ")
# home screen gets the full top bar too: move the paw/star counters to sit beside the buttons
rep("  hud: true, home: false", "  hud: true")
rep("    pawMini(24, 28);", "    ctx.save(); ctx.translate(108, 26);")
rep("text(ctx, n + '/18', 190, 45, { size: 16, color: '#6a4a3e', weight: 700 }); }", "text(ctx, n + '/18', 190, 45, { size: 16, color: '#6a4a3e', weight: 700 }); } ctx.restore();")
# v3: every scene change shows its one-line explainer
rep("if (HOWTO[name] && !(save.seenHow || {})[name]) showHow(name);", "howToast = null; if (HOWTO[name] && SCENES[name].toastHow) showToast(name); else if (HOWTO[name] && !SCENES[name].lateHow) showHow(name);")
rep("    scene.draw();\n    if (scene.vignette", "    { const sh = shakeIn(paused ? 0 : dt); scene.draw(); if (sh) ctx.restore(); }\n    if (scene.vignette")
rep("    if (scene.hud !== false && !paused && !howCard) drawHUD();", "    if (scene.hud !== false && !paused && !howCard) drawHUD();\n    if (!paused && !howCard) drawToast();")
# v3: original 80s synth-pop soundtrack
rep("""  function music(name) {
    if (!ac || !unlocked) { pending = name; return; }
    if (cur && cur.name === name) return;
    stopMusic();
    const song = SONGS[name]; if (!song) return;""", open(os.path.join(HERE, 'parts', '_synth.txt')).read() + """  function music(name) {
    if (!ac || !unlocked) { pending = name; return; }
    name = SYN_ALIAS[name] || name;
    if (cur && cur.name === name) return;
    stopMusic();
    if (SYN[name]) { synthMusic(name); return; }
    const song = SONGS[name]; if (!song) return;""")
# v3: purring that gets louder as Mona relaxes
rep("  function purrStart() {\n    if (purrNode) return;", "  function purrVol(v) { if (purrNode && v != null) purrNode.g.gain.setTargetAtTime(v, ac.currentTime, .2); }\n  function purrStart(v) {\n    if (purrNode) { purrVol(v); return; }")
rep("g.gain.exponentialRampToValueAtTime(.9, t + .3);\n    s.connect(f);", "g.gain.exponentialRampToValueAtTime(v || .9, t + .3);\n    s.connect(f);")
rep("purrStart: () => ac && unlocked && purrStart(),", "purrStart: v => ac && unlocked && purrStart(v),")
rep("text(ctx, n + '/18', 190, 45,", "text(ctx, n + '/33', 190, 45,")
# ---- v3.1 phone portrait ----
_a = out.index("  ctx.setTransform(K, 0, 0, K, 0, 0);\n  UI.next = [];\n  if (scene) {")
_b = out.index("  UI.regions = UI.next;\n  requestAnimationFrame(frame);")
out = out[:_a] + "  renderFrame(dt);\n" + out[_b:]
rep("* (1 - outK)) + ')'; ctx.fillRect(0, 0, W, H);", "* (1 - outK)) + ')'; fullFill();")
rep("  ctx.fillStyle = 'rgba(20,12,10,.72)'; ctx.fillRect(0, 0, W, H);", "  ctx.fillStyle = 'rgba(20,12,10,.72)'; fullFill();")
rep("ctx.fillStyle = 'rgba(20,12,10,' + (.6 * clamp(t / .4, 0, 1)) + ')'; ctx.fillRect(0, 0, W, H);\n  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-.02 + jg.rot * .5)", "ctx.fillStyle = 'rgba(20,12,10,' + (.6 * clamp(t / .4, 0, 1)) + ')'; fullFill();\n  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-.02 + jg.rot * .5)")
rep("    this.drawSign(t);\n", "    if (PDEFER) { PDEFER.push(() => homeOverlayP(this, t)); return; }\n    this.drawSign(t);\n")
rep("  down(x, y) { this.pl.ty = y; }, move(x, y) { this.pl.ty = y; }, hover(x, y) { this.pl.ty = y; },", "  down(x, y) { this.drag0 = { y, py: this.pl.y }; }, move(x, y) { if (this.drag0) this.pl.ty = this.drag0.py + (y - this.drag0.y) * 1.5; }, up() { this.drag0 = null; }, hover(x, y) { this.pl.ty = y; },")
rep("<canvas id=\"game\"></canvas>", "<style>:root{--sat:env(safe-area-inset-top);--sab:env(safe-area-inset-bottom)}</style><canvas id=\"game\"></canvas>")
rep("hintPill('Drag your finger, slide on the trackpad, or use the arrow keys', 862);", "hintPill(PORT ? 'Hold the arrows, or drag along the bottom, to move your candy cane' : 'Drag your finger up and down to move your candy cane', 862);")
rep("    c.width = Math.max(1, Math.ceil(w * K)); c.height = Math.max(1, Math.ceil(h * K));\n    const g = c.getContext('2d');\n    g.setTransform(K, 0, 0, K, 0, 0);", "    const R = cacheRes(w, h); c.width = Math.max(1, Math.ceil(w * R)); c.height = Math.max(1, Math.ceil(h * R));\n    const g = c.getContext('2d');\n    g.setTransform(R, 0, 0, R, 0, 0);")
rep("    retroText('SCORE  ' + this.score, px + 120, s.y + 330, 24, '#cfd6ff');", "    retroText('SCORE  ' + this.score, px + 120, s.y + 330, 24, '#cfd6ff');\n    if (PORT && PDEFER) { dockStat('Lines', this.lines + ' / ' + TET_GOAL); dockStat('Score', this.score); }")
# v6 ink style: near-black outlines, cartoon eyes for Samantha (white eyes, dot pupils, inked glasses)
rep("const OUT = '#3d2a22';", "const OUT = '#1b1411';")
rep("g.strokeStyle = 'rgba(61,42,34,.85)'; g.lineWidth = 2.4;", "g.strokeStyle = 'rgba(27,20,17,.92)'; g.lineWidth = 3;")
rep("""else { const big = ex === 'surprised' ? 1.3 : 1; ell(g, exx, eyeY, 4.8 * big, 6.2 * big); fillP(g, '#2e1f1a'); circ(g, exx - 1.6, eyeY - 2.4, 2); fillP(g, '#fff'); circ(g, exx + 1.6, eyeY + 2.4, 1); fillP(g, '#fff'); line(g, exx + sd * 4, eyeY - 4.5, exx + sd * 7.5, eyeY - 7.5, OUT, 2); }""",
"""else { const big = ex === 'surprised' ? 1.25 : 1; circ(g, exx, eyeY, 7.6 * big); g.fillStyle = '#fff'; g.fill(); g.strokeStyle = OUT; g.lineWidth = 2.4; g.stroke(); circ(g, exx + lk * 2.2, eyeY + .5, 2.9 * big); g.fillStyle = OUT; g.fill(); }""")
rep("""for (const sd of [-1, 1]) { rr(g, sd * 14 - 12.5 + lk * 4, eyeY - 10.5, 25, 21, 9.5); strokeP(g, '#c9b9a6', 2.8); g.save(); g.globalAlpha = .5; line(g, sd * 14 - 6 + lk * 4, eyeY - 6, sd * 14 - 1 + lk * 4, eyeY - 8, '#fff', 2.2); g.restore(); }
    line(g, -2 + lk * 4, eyeY - 2, 2 + lk * 4, eyeY - 2, '#c9b9a6', 2.6);""",
"""for (const sd of [-1, 1]) { circ(g, sd * 14 + lk * 4, eyeY, 11.5); strokeP(g, OUT, 3.4); }
    line(g, -2.5 + lk * 4, eyeY - 1, 2.5 + lk * 4, eyeY - 1, OUT, 3);""")
# v6.5 character style: thin clean ink, deadpan half-lidded cat eyes, black whiskers
rep("""      const wide = eyes === 'wide', rx = wide ? 9.6 : 8.6, ry = wide ? 10.6 : 9.8;""", """      if (eyes === 'half') { line(g, ex - 9, ey + 1, ex + 9, ey + 1, OUT, 3.8); line(g, ex - 10, ey - 4, ex + 10, ey - 4 - sd * 1.5, OUT, 1.8); continue; }
      if (eyes !== 'wide') { ell(g, ex, ey + 1, 9.4, 4.8); ink(g, MC.eye, 1.6); ell(g, ex + lx * 2.2, ey + 1, 1.9, 4.3); g.fillStyle = '#1a1410'; g.fill(); g.lineCap = 'round'; line(g, ex - 11, ey - 3.6 - sd * .8, ex + 11, ey - 3.6 + sd * .8, OUT, 3.4); continue; }
      const wide = eyes === 'wide', rx = wide ? 9.6 : 8.6, ry = wide ? 10.6 : 9.8;""")
rep("""line(g, sd * 14, 11 + i * 3, sd * 38, 7 + i * 6, '#ffffff', 1.4);""", """line(g, sd * 16, 11 + i * 3, sd * 44, 6 + i * 7, OUT, 1.3);""")
rep("family=Fredoka:wght@400;500;600;700&display=swap", "family=Fredoka:wght@400;500;600;700&family=Lilita+One&family=Nunito:wght@600;700;800;900&family=Press+Start+2P&family=Anton&family=Jost:wght@400;500;600;700&family=Lobster&display=swap")
open(os.path.join(HERE, '..', 'index.html'), 'w').write(out)
print('ok', len(out))
