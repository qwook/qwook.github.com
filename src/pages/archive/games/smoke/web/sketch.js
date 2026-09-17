// smoke. — HTML5/p5.js port
//
// Reconstructed from the decompiled GameMaker 8.0 project (smoke.exe).
// Unlike may-bay1.1, this game is almost entirely plain GML (very little
// Drag-and-Drop), so most of this is a verbatim port of the real decoded
// source in objects/*/*.gml. See tools/GAMEMAKER_DECOMPILATION_GUIDE.md.
//
// Not 1:1 with the original, called out inline where it matters:
//  - WASD thrust and a couple of other one-line "Execute Code" actions
//    (bare `speedx`, `speedy`, `start`, `soundon` with no `=` — confirmed
//    via raw byte dump to be genuinely incomplete in the source file, not
//    a decompiler bug) had their actual assigned values lost. Reconstructed
//    with a reasonable thrust constant given the game's scale.
//  - Escape-to-quit doesn't make sense in a browser tab, so Escape is
//    mapped to the same "reset to menu" behavior the original gives it
//    while already playing, and does nothing on the menu screen.
//
// Text is rendered with the game's *actual* original bitmap fonts, not a
// substitute web font: GameMaker 8 rasterizes each font into a glyph atlas
// at compile time and bakes it straight into the exe (Font.pixel_map +
// Font.dmap), and the extractor now pulls that out as fonts/<name>_atlas.png
// + fonts/<name>_glyphs.json. See BitmapFont below.

const CAM_W = 200;
const CAM_H = 400;
const CENTER_X = 100;
const CENTER_Y = 200;
const THRUST = 0.4; // reconstructed guess, see header comment
const HEALTH_MAX = 190;
const ENERGY_LIFE = 50;
const ENERGY_SPAWN_INTERVAL = 10;
const ORB_SPEED = 5;
const BURST_LIFE = 20;

// GameMaker 8 built-in colour constants, decoded (GM colour ints are BBGGRR).
const C = {
  aqua: '#00FFFF', black: '#000000', blue: '#0000FF', dkgray: '#404040',
  fuchsia: '#FF00FF', gray: '#808080', lime: '#00FF00', ltgray: '#C0C0C0',
  navy: '#000080', purple: '#800080', white: '#FFFFFF',
};
const SMOKE_COLORS = [null, C.blue, C.aqua, C.dkgray, C.gray, C.ltgray]; // index 1..5
const BURST_COLORS = [null, C.fuchsia, C.lime, C.blue]; // index 1..3
const HOLE_COLORS = [null, C.fuchsia, C.lime, C.purple, C.black, C.white]; // index 1..5

const SPR = {
  player:     { w: 18, h: 21, ox: 11, oy: 13 },
  energyball: { w: 30, h: 28, ox: 16, oy: 15 },
};

let images = {};
let MASKS = {}, MASKBITS = {};
let sndEnergy, sndExplode, sndMusic;
let canvas;

const FONT_NAMES = ['instructions', 'scorefont', 'title'];
let fontAtlasRaw = {};  // name -> p5.Image (white-with-alpha, as extracted)
let fontGlyphs = {};    // name -> {charcode: {x,y,w,h}}
let fontTinted = {};    // "name|#rrggbb" -> p5.Graphics (colour-tinted atlas)

function preload() {
  images.player = loadImage('../sprites/player/player_0.png');
  images.energyball = loadImage('../sprites/energyball/energyball_0.png');
  MASKS = loadJSON('../sprites/_masks.json');
  soundFormats('wav', 'mp3');
  sndEnergy = loadSound('../sounds/s_energy.wav');
  sndExplode = loadSound('../sounds/s_explode.wav');
  sndMusic = loadSound('../sounds/music2.mp3');
  for (const name of FONT_NAMES) {
    fontAtlasRaw[name] = loadImage(`../fonts/${name}_atlas.png`);
    fontGlyphs[name] = loadJSON(`../fonts/${name}_glyphs.json`);
  }
}

function setup() {
  canvas = createCanvas(CAM_W, CAM_H);
  canvas.parent('canvas-wrap');
  noSmooth();
  frameRate(30);
  imageMode(CENTER);
  rectMode(CORNERS);
  layoutCanvas();
  window.addEventListener('resize', layoutCanvas);

  for (const name in MASKS) {
    const bin = atob(MASKS[name].bits);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    MASKBITS[name] = arr;
  }

  resetToMenu();
}

// Lazily tint a copy of the raw (white-with-alpha) atlas to a given colour,
// the standard technique for recolouring an alpha-mask bitmap font, and
// cache it — this game only ever uses a handful of HUD colours.
function getTintedAtlas(fontName, colorHex) {
  const key = fontName + '|' + colorHex;
  if (fontTinted[key]) return fontTinted[key];
  const src = fontAtlasRaw[fontName];
  const pg = createGraphics(src.width, src.height);
  pg.noSmooth();
  pg.image(src, 0, 0);
  pg.drawingContext.globalCompositeOperation = 'source-in';
  pg.noStroke();
  pg.fill(colorHex);
  pg.rect(0, 0, src.width, src.height);
  pg.drawingContext.globalCompositeOperation = 'source-over';
  fontTinted[key] = pg;
  return pg;
}

// Draws text using the game's real extracted bitmap font. (x,y) is the
// top-left of the string, matching how the original draw_text calls were
// positioned. align: 'left' | 'center'.
function drawBitmapText(fontName, str, x, y, colorHex, align) {
  const glyphs = fontGlyphs[fontName];
  const atlas = getTintedAtlas(fontName, colorHex);
  if (align === 'center') {
    x -= bitmapTextWidth(fontName, str) / 2;
  }
  imageMode(CORNER);
  let cx = x;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    const g = glyphs[code];
    if (!g) { cx += glyphs[32] ? glyphs[32].offset : 6; continue; }
    if (g.w > 0 && g.h > 0) {
      // Glyph is blitted at its full stored width/height (the bitmap
      // itself), but the cursor only advances by `offset` afterwards —
      // that's the real GameMaker renderer's behavior (confirmed against
      // OpenGMK's gm8emulator/src/game/draw.rs), and `offset` is 1px less
      // than `w` for every glyph checked so far. Advancing by `w` instead
      // overshoots by a pixel per character.
      image(atlas, cx, y, g.w, g.h, g.x, g.y, g.w, g.h);
    }
    cx += g.offset;
  }
  imageMode(CENTER);
  return cx - x;
}

function bitmapTextWidth(fontName, str) {
  const glyphs = fontGlyphs[fontName];
  let w = 0;
  for (let i = 0; i < str.length; i++) {
    const g = glyphs[str.charCodeAt(i)];
    w += g ? g.offset : (glyphs[32] ? glyphs[32].offset : 6);
  }
  return w;
}

function layoutCanvas() {
  const scale = Math.min(window.innerWidth / CAM_W, window.innerHeight / CAM_H);
  canvas.elt.style.width = (CAM_W * scale) + 'px';
  canvas.elt.style.height = (CAM_H * scale) + 'px';
}
function windowResized() { layoutCanvas(); }

function maskBit(name, x, y) {
  const m = MASKS[name];
  if (!m || x < 0 || y < 0 || x >= m.w || y >= m.h) return false;
  const idx = y * m.w + x;
  const byte = MASKBITS[name][idx >> 3];
  return ((byte >> (7 - (idx & 7))) & 1) === 1;
}

function spritesCollide(ax, ay, aName, bx, by, bName) {
  const a = SPR[aName], b = SPR[bName];
  const ax1 = ax - a.ox, ay1 = ay - a.oy, ax2 = ax1 + a.w, ay2 = ay1 + a.h;
  const bx1 = bx - b.ox, by1 = by - b.oy, bx2 = bx1 + b.w, by2 = by1 + b.h;
  if (!(ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1)) return false;
  const x1 = Math.max(ax1, bx1), x2 = Math.min(ax2, bx2);
  const y1 = Math.max(ay1, by1), y2 = Math.min(ay2, by2);
  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      if (maskBit(aName, x - ax1, y - ay1) && maskBit(bName, x - bx1, y - by1)) return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------------
// Game state
// ---------------------------------------------------------------------

const game = {
  start: false,
  time: 0,
  score: 0,
  lastScore: 0,
  soundon: true,
  player: null,
  smokepart: [],   // player's trailing particle effect
  holepart: [],    // blackhole's swirling particle effect
  energies: [],    // active energy orbs
  bursts: [],       // destroyed/player_destroyed particle bursts
  hole: { alpha: 1, lastrand: 1, lastlastrand: 1, time: 0, finalcountdown: 0, produce: 0 },
};

function resetToMenu() {
  game.start = false;
  game.time = 0;
  game.player = {
    x: 104, y: 200, speedx: 0, speedy: 0,
    health: HEALTH_MAX, healthtobe: HEALTH_MAX,
  };
  game.smokepart = [];
  for (let i = 0; i < 49; i++) {
    game.smokepart.push({
      x: game.player.x + random(-5, 5), y: game.player.y + random(-5, 5),
      life: i + 1, kind: Math.round(random(0, 5)),
    });
  }
  game.holepart = [];
  for (let i = 0; i < 499; i++) {
    game.holepart.push({
      x: 96 + random(-5, 5), y: 192 + random(-5, 5),
      life: i + 1, kind: Math.round(random(0, 5)),
    });
  }
  game.energies = [];
  game.bursts = [];
  game.hole.finalcountdown = 0;
  game.hole.produce = 0;
  if (sndMusic && sndMusic.isPlaying()) sndMusic.stop();
}

function startGame() {
  game.start = true;
  game.score = 0;
  game.player.health = HEALTH_MAX;
  game.player.healthtobe = HEALTH_MAX;
  if (game.soundon) { sndMusic.loop(); }
}

function killPlayer() {
  game.bursts.push({ x: game.player.x, y: game.player.y, time: 0, kind: 'player' });
  game.lastScore = game.score;
  if (game.soundon && sndExplode) sndExplode.play();
  resetToMenu();
}

// ---------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------

function keyPressed() {
  if (getAudioContext().state !== 'running') getAudioContext().resume();
  if (keyCode === ENTER) {
    if (!game.start) startGame();
  } else if (keyCode === ESCAPE) {
    if (game.start) killPlayer(); // see header note: quit-to-desktop doesn't apply in a browser
  } else if (key === 'e' || key === 'E') {
    game.soundon = !game.soundon;
    if (!game.soundon && sndMusic.isPlaying()) sndMusic.stop();
    else if (game.soundon && game.start) sndMusic.loop();
  } else if (key === 'q' || key === 'Q') {
    if (sndMusic.isPlaying()) sndMusic.stop();
    else sndMusic.loop();
  }
}

function heldKeys() {
  return {
    a: keyIsDown(65), d: keyIsDown(68), s: keyIsDown(83), w: keyIsDown(87),
  };
}

// ---------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------

function draw() {
  update();
  render();
}

function update() {
  const p = game.player;
  const keys = heldKeys();

  if (game.start) {
    if (keys.a) p.speedx -= THRUST;
    if (keys.d) p.speedx += THRUST;
    if (keys.w) p.speedy -= THRUST;
    if (keys.s) p.speedy += THRUST;

    if (p.x > CENTER_X) p.speedx -= (p.x - CENTER_X) / 800;
    if (p.x < CENTER_X) p.speedx += (CENTER_X - p.x) / 800;
    if (p.y > CENTER_Y) p.speedy -= (p.y - CENTER_Y) / 800;
    if (p.y < CENTER_Y) p.speedy += (CENTER_Y - p.y) / 800;
    p.x += p.speedx;
    p.y += p.speedy;

    if (p.healthtobe > p.health) {
      p.health += 1;
    } else {
      p.health -= 1;
      p.healthtobe = p.health;
    }
    game.score += 1;

    if (p.health < 1) {
      killPlayer();
      return;
    }

    // --- blackhole energy orb spawner ---
    game.hole.finalcountdown += 1;
    if (game.hole.produce < game.hole.finalcountdown) {
      const dir = game.hole.finalcountdown;
      const rad = (dir * Math.PI) / 180;
      game.energies.push({
        x: random(-50, 50) + CENTER_X, y: random(-50, 50) + CENTER_Y,
        vx: Math.cos(rad) * ORB_SPEED, vy: -Math.sin(rad) * ORB_SPEED,
        time: 0, scale: 0,
      });
      game.hole.produce = game.hole.finalcountdown + ENERGY_SPAWN_INTERVAL;
    }

    // --- energy orbs ---
    for (let i = game.energies.length - 1; i >= 0; i--) {
      const e = game.energies[i];
      e.time += 1;
      e.x += e.vx;
      e.y += e.vy;
      e.scale = (1 - Math.abs(Math.sin(e.time / 10)) / 2) * (e.time / 10);
      if (spritesCollide(p.x, p.y, 'player', e.x, e.y, 'energyball')) {
        const togive = Math.round(random(5, 30));
        p.healthtobe = Math.min(HEALTH_MAX, p.health + togive);
        if (game.soundon && sndEnergy) sndEnergy.play();
        game.score += 50;
        game.bursts.push({ x: e.x, y: e.y, time: 0, kind: 'small' });
        game.energies.splice(i, 1);
        continue;
      }
      if (e.time >= ENERGY_LIFE) {
        game.bursts.push({ x: e.x, y: e.y, time: 0, kind: 'small' });
        game.energies.splice(i, 1);
      }
    }
  }

  // --- bursts ---
  for (let i = game.bursts.length - 1; i >= 0; i--) {
    game.bursts[i].time += 1;
    if (game.bursts[i].time >= BURST_LIFE) game.bursts.splice(i, 1);
  }

  updatePlayerSmoke();
  updateHoleParticles();
  game.time += 1;
  game.hole.time += 1;
}

function updatePlayerSmoke() {
  const p = game.player;
  for (const sp of game.smokepart) {
    if (sp.life > 0) {
      if (sp.kind === 1) { sp.x += 0.25; sp.y += 0.25; }
      else if (sp.kind === 2) { sp.x += 0.25; sp.y -= 0.25; }
      else if (sp.kind === 3) { sp.x -= 0.25; sp.y -= 0.25; }
      else if (sp.kind === 4) { sp.x -= 0.25; sp.y += 0.25; }
      else if (sp.kind === 5) { sp.x -= 0.25; sp.y += 0.25; }
      sp.life -= 1;
    } else {
      sp.x = p.x + random(-5, 5);
      sp.y = p.y + random(-5, 5);
      sp.life = 5;
    }
  }
}

function updateHoleParticles() {
  const t = game.hole.time;
  for (let i = 0; i < game.holepart.length; i++) {
    const hp = game.holepart[i];
    if (hp.life > 0) {
      const r = 500 - hp.life;
      hp.x = Math.cos((t - i) / 10) * r + 96;
      hp.y = Math.sin((t - i) / 10) * r + 192;
      hp.life -= 1;
    } else {
      hp.x = 96 + random(-5, 5);
      hp.y = 192 + random(-5, 5);
      hp.life = 500;
    }
  }
}

// ---------------------------------------------------------------------
// Draw
// ---------------------------------------------------------------------

function render() {
  background(0);

  // blackhole full-screen colour flash (only really "seen" once game has run a bit)
  game.hole.alpha += 0.01;
  let rand;
  if (game.hole.alpha >= 1) {
    rand = Math.round(random(1, 5));
    game.hole.lastlastrand = game.hole.lastrand;
    game.hole.lastrand = rand;
    game.hole.alpha = 0;
  } else {
    rand = game.hole.lastrand;
  }
  noStroke();
  fill(HOLE_COLORS[game.hole.lastlastrand] || C.black);
  rect(0, 0, CAM_W, CAM_H);
  fill(HOLE_COLORS[rand] || C.black);
  const prevAlpha = drawingContext.globalAlpha;
  drawingContext.globalAlpha = game.hole.alpha;
  rect(0, 0, CAM_W, CAM_H);
  drawingContext.globalAlpha = prevAlpha;

  // blackhole swirl particles
  for (const hp of game.holepart) {
    if (hp.life <= 0) continue;
    const size = (500 - hp.life) / 5 + 5;
    fill(HOLE_COLORS[hp.kind] || C.white);
    drawingContext.globalAlpha = constrain(hp.life / 500, 0, 1);
    rect(hp.x, hp.y, hp.x + size, hp.y + size);
  }
  drawingContext.globalAlpha = 1;

  // energy orbs
  for (const e of game.energies) {
    push();
    translate(e.x, e.y);
    scale(e.scale, e.scale);
    imageMode(CENTER);
    image(images.energyball, 0, 0);
    pop();
  }

  // bursts (destroyed / player_destroyed)
  for (const b of game.bursts) drawBurst(b);

  // player smoke trail
  for (const sp of game.smokepart) {
    if (sp.life <= 0) continue;
    fill(SMOKE_COLORS[sp.kind] || C.navy);
    noStroke();
    rect(sp.x, sp.y, sp.x + 5, sp.y + 5);
  }

  // player
  const p = game.player;
  imageMode(CENTER);
  image(images.player, p.x, p.y - Math.sin(game.time / 2));

  // fuel bar
  noStroke();
  fill(C.fuchsia);
  rect(5, 25, p.health + 5, 35);
  fill(C.lime);
  drawingContext.globalAlpha = constrain(p.health / HEALTH_MAX, 0, 1);
  rect(5, 25, p.health + 5, 35);
  drawingContext.globalAlpha = 1;

  if (!game.start) drawMenuOverlay();

  drawHUD();
}

function drawBurst(b) {
  const t = b.time;
  if (t >= BURST_LIFE) return;
  const rc = [null, C.fuchsia, C.lime, C.blue][Math.ceil(random(1, 3))] || C.white;
  fill(rc);
  noStroke();
  const d = BURST_LIFE - t;
  if (b.kind === 'small') {
    rect(b.x - d, b.y - d, b.x + d, b.y + d);
  } else {
    const off = t * 3;
    rect(b.x + off - d, b.y + off - d, b.x + off + d, b.y + off + d);
    rect(b.x - off - d, b.y + off - d, b.x - off + d, b.y + off + d);
    rect(b.x + off - d, b.y - off - d, b.x + off + d, b.y - off + d);
    rect(b.x - off - d, b.y - off - d, b.x - off + d, b.y - off + d);
  }
}

// All coordinates/fonts below are the exact values from the original
// draw_0.gml (draw_text/draw_score calls), now rendered with the game's
// real extracted bitmap fonts instead of an approximated substitute.
function drawMenuOverlay() {
  noStroke();
  fill(0, 0, 0, 191); // 0.75 alpha
  rect(0, 0, CAM_W, CAM_H);

  drawBitmapText('title', 'high', 0, 0, C.white);

  image(images.energyball, 73, 70);
  const lines = [
    [35, 'meet smoke.'],
    [45, 'the genetically enhanced weed.'],
    [65, 'collect        for fuel.'],
    [85, 'you will constantly lose fuel.'],
    [95, 'w - forward'],
    [105, 's - backwards'],
    [115, 'a - left'],
    [125, 'd - right'],
    [135, 'q - toggle music'],
    [145, 'esc - reset'],
  ];
  for (const [y, str] of lines) {
    drawBitmapText('instructions', str, 5, y, C.white);
  }

  drawBitmapText('instructions', 'press', 40, 380, C.white);
  const chars = ['E', 'N', 'T', 'E', 'R'];
  const charX = [73, 80, 87, 94, 101];
  for (let i = 0; i < chars.length; i++) {
    drawBitmapText('instructions', chars[i], charX[i], 380 - Math.sin(game.time / 4 + i) * 4, C.white);
  }
  drawBitmapText('instructions', 'to start', 110, 380, C.white);

  if (game.lastScore > 0) {
    // x=100 is the exact horizontal midpoint of the 200px room, and GM8's
    // "Draw Score"/"Draw Text" DnD actions are center-aligned by default
    // (unlike the plain draw_text() GML function, which is left-aligned) —
    // there's no explicit halign anywhere in the source, but the chosen
    // coordinate only makes sense as a center anchor.
    drawBitmapText('scorefont', 'score: ' + game.lastScore, 100, 300, C.white, 'center');
    drawBitmapText('title', 'game over', 100, 270, C.white, 'center');
  }
}

function drawHUD() {
  if (game.start) {
    drawBitmapText('scorefont', String(game.score), 0, 0, C.white);
  }
}
