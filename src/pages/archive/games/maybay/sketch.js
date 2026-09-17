// May Bay 1.1 — HTML5/p5.js port
//
// Reconstructed from the decompiled GameMaker 8.0 project (may-bay1.1.exe).
// Most gameplay logic lived in GameMaker's Drag-and-Drop actions rather than
// plain GML, so this is a faithful reimplementation based on the decoded
// action parameters (gravity/motion/collision actions) plus the handful of
// real GML blocks (terrain scrolling/spawning, which is ported verbatim).
//
// A couple of things are intentionally NOT 1:1 with the original because the
// original data for them wasn't recoverable or didn't exist:
//  - There was no working "click to start" handler wired up on the menu
//    screen in the original; clicking/tapping/space to start here is an
//    added (reasonable) affordance.
//  - HUD text layout uses a plain pixel font instead of GameMaker's built-in
//    draw_score/draw_life text renderer.

// The room itself is 640x480, but GameMaker only ever displayed a cropped
// 384x256 View (camera) starting at the room's top-left — confirmed by the
// room data's actual view/port rectangles. Object spawn/scroll math stays
// in 640x480 world space (that's what the original GML uses), but rendering,
// the canvas, and HUD placement all use the 384x256 camera window.
const WORLD_W = 640;
const WORLD_H = 480;
const CAM_W = 384;
const CAM_H = 256;
const GRAV = 0.25;
// Propeller animation rate (frames of the 8-frame heli sprite advanced per
// tick). The original set "image_speed" right after the gravity action on
// press/release, but the actual value it was set to didn't survive
// decompilation — these are a reasonable reconstruction of "spins faster
// while thrusting".
const PROP_SPEED_THRUST = 1;
const PROP_SPEED_IDLE = 0.25;

const SPR = {
  heli:        { frames: 8, w: 32,  h: 32,  ox: 0,   oy: 0,  bbox: [8, 11, 24, 26] },
  bg:          { frames: 1, w: 142, h: 269, ox: 0,   oy: 0 },
  slope1:      { frames: 1, w: 32,  h: 352, ox: 0,   oy: 0,  bbox: [0, 0, 31, 351] },
  slope2:      { frames: 1, w: 32,  h: 352, ox: 0,   oy: 0,  bbox: [0, 0, 31, 351] },
  slope3:      { frames: 1, w: 32,  h: 352, ox: 0,   oy: 0,  bbox: [0, 0, 31, 351] },
  smoke:       { frames: 7, w: 32,  h: 32,  ox: 0,   oy: 0 },
  scores:      { frames: 3, w: 100, h: 32,  ox: 0,   oy: 0 },
  highscore:   { frames: 3, w: 100, h: 32,  ox: 102, oy: 0 },
  block:       { frames: 1, w: 32,  h: 32,  ox: 0,   oy: 0,  bbox: [2, 3, 28, 28] },
  cloud1:      { frames: 1, w: 142, h: 69,  ox: 0,   oy: 69 },
  cloud2:      { frames: 1, w: 142, h: 81,  ox: 0,   oy: 81 },
  skycity1:    { frames: 1, w: 56,  h: 93,  ox: 0,   oy: 0 },
  gore1:       { frames: 1, w: 14,  h: 12,  ox: 7,   oy: 6 },
  gore2:       { frames: 1, w: 14,  h: 13,  ox: 7,   oy: 6 },
  gore3:       { frames: 1, w: 14,  h: 13,  ox: 0,   oy: 0 },
  gore4:       { frames: 1, w: 11,  h: 10,  ox: 5,   oy: 5 },
  gore5:       { frames: 1, w: 24,  h: 6,   ox: 0,   oy: 0 },
  blood:       { frames: 19, w: 32, h: 32,  ox: 16,  oy: 16 },
  coin:        { frames: 8, w: 32,  h: 32,  ox: 0,   oy: 0,  bbox: [16, 5, 23, 28] },
  coingib1:    { frames: 1, w: 13,  h: 12,  ox: 6,   oy: 6 },
  coingib2:    { frames: 1, w: 14,  h: 13,  ox: 7,   oy: 6 },
  periodbleeders: { frames: 1, w: 384, h: 256, ox: 0, oy: 0 },
};

const GORE_NAMES = ['gore1', 'gore2', 'gore3', 'gore4', 'gore5'];

let images = {};   // name -> array of p5.Image, indexed by frame
let bgImage;        // backgrounds/background0.png
let sndEngine, sndCrash, sndCoin;
let MASKS = {};      // name -> {w,h,bits} raw base64-packed pixel collision mask
let MASKBITS = {};   // name -> Uint8Array decoded from MASKS[name].bits

// The real bitmap font GameMaker baked into the exe (digits only — the
// "score:"/"lives:" labels are drawn via the scores/highscore sprites, not
// text). See tools/GAMEMAKER_DECOMPILATION_GUIDE.md gotcha #4.
let fontAtlasRaw, fontGlyphs;
let fontTinted = {}; // "#rrggbb" -> p5.Graphics, colour-tinted atlas cache

let canvas;

function preload() {
  for (const name in SPR) {
    const def = SPR[name];
    images[name] = [];
    for (let i = 0; i < def.frames; i++) {
      images[name].push(loadImage(`./sprites/${name}/${name}_${i}.png`));
    }
  }
  bgImage = loadImage('./backgrounds/background0.png');
  MASKS = loadJSON('./sprites/_masks.json');
  fontAtlasRaw = loadImage('./fonts/font0_atlas.png');
  fontGlyphs = loadJSON('./fonts/font0_glyphs.json');
  soundFormats('wav');
  sndEngine = loadSound('./sounds/wingflap.wav');
  sndCrash = loadSound('./sounds/bloodsplat.wav');
  sndCoin = loadSound('./sounds/coin.wav');
}

function getTintedFontAtlas(colorHex) {
  if (fontTinted[colorHex]) return fontTinted[colorHex];
  const pg = createGraphics(fontAtlasRaw.width, fontAtlasRaw.height);
  pg.noSmooth();
  pg.image(fontAtlasRaw, 0, 0);
  pg.drawingContext.globalCompositeOperation = 'source-in';
  pg.noStroke();
  pg.fill(colorHex);
  pg.rect(0, 0, fontAtlasRaw.width, fontAtlasRaw.height);
  pg.drawingContext.globalCompositeOperation = 'source-over';
  fontTinted[colorHex] = pg;
  return pg;
}

// (x,y) is the top-left of the string, matching the original's draw_score
// calls (imageMode is CORNER throughout this sketch).
function drawBitmapNumber(str, x, y, colorHex) {
  const atlas = getTintedFontAtlas(colorHex);
  let cx = x;
  for (let i = 0; i < str.length; i++) {
    const g = fontGlyphs[str.charCodeAt(i)];
    if (!g) continue;
    // Glyph draws at its full stored width, but the cursor advances by
    // `offset` (1px less than `w` for every glyph seen) — matches the real
    // GameMaker renderer, confirmed against OpenGMK's gm8emulator source.
    image(atlas, cx, y, g.w, g.h, g.x, g.y, g.w, g.h);
    cx += g.offset;
  }
  return cx - x;
}

function setup() {
  canvas = createCanvas(CAM_W, CAM_H);
  canvas.parent('canvas-wrap');
  noSmooth();
  frameRate(30);
  textFont('monospace');
  imageMode(CORNER);
  rectMode(CORNER);
  layoutCanvas();
  window.addEventListener('resize', layoutCanvas);

  for (const name in MASKS) {
    const bin = atob(MASKS[name].bits);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    MASKBITS[name] = arr;
  }

  game.state = 'splash';
  game.splashTimer = 0;
}

// Reads bit (x,y) out of a packed row-major 1-bit-per-pixel mask.
function maskBit(name, x, y) {
  const m = MASKS[name];
  if (!m || x < 0 || y < 0 || x >= m.w || y >= m.h) return false;
  const idx = y * m.w + x;
  const byte = MASKBITS[name][idx >> 3];
  return ((byte >> (7 - (idx & 7))) & 1) === 1;
}

function layoutCanvas() {
  // Continuously scale to fill the window while keeping the camera's 384x256
  // aspect ratio (letterboxed on whichever axis doesn't match).
  const scale = Math.min(window.innerWidth / CAM_W, window.innerHeight / CAM_H);
  canvas.elt.style.width = (CAM_W * scale) + 'px';
  canvas.elt.style.height = (CAM_H * scale) + 'px';
}

function windowResized() {
  layoutCanvas();
}

// ---------------------------------------------------------------------
// Game state
// ---------------------------------------------------------------------

const game = {
  state: 'splash',
  splashTimer: 0,
  score: 0,
  highscore: 0,
  slope: 2,
  whichslope: 'slope1',
  terrain: [],       // {x, y, sprite}
  cloud1: [],         // {x, y}
  cloud2: [],
  block: { x: 0, y: 0, type: 'block', alive: true }, // type: 'block' | 'coin'
  sky: { x: 0 },
  player: { x: 32, y: 96, vspeed: 0, thrust: true, alive: true, animT: 0, imageSpeed: 1 },
  particles: [],      // generic: {kind, x, y, vx, vy, grav, age, life, spriteName, dir?}
  deathTimer: 0,
  menuTime: 0,
  menuHeli: { x: 32, y: 96 },
  speede: 1,          // speed level: 1 normal, 2 boosted (from a coin), 0 on crash
  speedc: 1,          // synced from speede each frame, actually used for motion
  boostTimer: 0,       // frames remaining on the current coin speed-boost
};

function resetGame() {
  game.score = 0;
  game.slope = 2;
  game.whichslope = 'slope1';
  game.terrain = [];
  for (let i = 1; i <= 14; i++) {
    game.terrain.push({ x: (i - 1) * 32, y: -64, sprite: 'slope1' });
  }
  game.cloud1 = [];
  game.cloud2 = [];
  for (let i = 1; i <= 5; i++) {
    game.cloud1.push({ x: (i - 1) * 142, y: 256 });
    game.cloud2.push({ x: (i - 1) * 142, y: 256 });
  }
  game.block = { x: 384, y: 64, type: 'block', alive: true };
  game.sky = { x: 384 };
  game.player = { x: 32, y: 96, vspeed: 0, thrust: true, alive: true, animT: 0, imageSpeed: PROP_SPEED_THRUST };
  game.particles = [];
  game.deathTimer = 0;
  game.speede = 1;
  game.speedc = 1;
  game.boostTimer = 0;
}

// ---------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------

function pressStart() {
  if (getAudioContext().state !== 'running') getAudioContext().resume();
  if (game.state === 'splash') {
    game.state = 'menu';
    return;
  }
  if (game.state === 'menu') {
    resetGame();
    game.state = 'playing';
    return;
  }
  if (game.state === 'playing') {
    game.player.thrust = true;
    game.player.imageSpeed = PROP_SPEED_THRUST;
    if (sndEngine && !sndEngine.isPlaying()) sndEngine.loop();
  }
}

function releaseStart() {
  if (game.state === 'playing') {
    game.player.thrust = false;
    game.player.imageSpeed = PROP_SPEED_IDLE;
    if (sndEngine && sndEngine.isPlaying()) sndEngine.stop();
  }
}

function mousePressed() { pressStart(); }
function mouseReleased() { releaseStart(); }
function touchStarted() { pressStart(); return false; }
function touchEnded() { releaseStart(); return false; }
function keyPressed() {
  if (key === ' ') pressStart();
}
function keyReleased() {
  if (key === ' ') releaseStart();
}

// ---------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------

function draw() {
  switch (game.state) {
    case 'splash': updateSplash(); drawSplash(); break;
    case 'menu': updateMenu(); drawMenu(); break;
    case 'playing': updatePlaying(); drawPlaying(); break;
  }
}

function updateSplash() {
  game.splashTimer++;
  if (game.splashTimer > 60) game.state = 'menu';
}

function updateMenu() {
  game.menuTime++;
  game.menuHeli.y = 96 + Math.sin(game.menuTime / 3) * 3;
}

function updatePlaying() {
  const p = game.player;

  if (p.alive) {
    // --- speed level (coin pickups boost this to 2x for ~1s) ---
    if (game.speedc !== game.speede) game.speedc = game.speede;
    if (game.boostTimer > 0) {
      game.boostTimer -= 1;
      if (game.boostTimer === 0 && game.speede === 2) game.speede = 1;
    }
    const sc = game.speedc;

    // --- physics --- (thrust/fall acceleration scales with speedc, same as
    // the original's gravity actions which use "0.25*speedc")
    p.vspeed += (p.thrust ? -GRAV : GRAV) * sc;
    p.y += p.vspeed;
    p.animT += p.imageSpeed;

    // --- scoring ---
    game.score += 1 * sc;
    if (game.highscore < game.score) game.highscore = game.score;

    // --- engine smoke trail (original spawns this every frame regardless
    //     of thrust state, since the "juston" flag is never reset) ---
    spawnParticle('smoke', p.x - 4, p.y + 12, {
      vx: -(Math.ceil(Math.random() * 5) + 5),
      vy: -(Math.ceil(Math.random() * 3) + 3),
      grav: 0,
      life: 8,
    });

    // --- terrain scroll & recycle ---
    for (const col of game.terrain) {
      col.x -= 4 * sc;
      if (col.x <= -64) {
        recycleTerrain(col);
      }
    }

    // --- clouds ---
    for (const c of game.cloud1) {
      c.x -= 2 * sc;
      if (c.x < -141) c.x = 568;
    }
    for (const c of game.cloud2) {
      c.x -= 1 * sc;
      if (c.x < -141) c.x = 568;
    }

    // --- block/coin spawner ---
    game.block.x -= 4 * sc;
    if (game.block.x <= -32 && game.whichslope === 'slope1') {
      game.block.x = 416;
      game.block.y = 32 + 32 * game.slope;
      game.block.type = Math.ceil(Math.random() * 2) === 1 ? 'coin' : 'block';
      game.block.alive = true;
    }

    // --- sky city ---
    game.sky.x -= 0.1 * sc;
    if (game.sky.x <= -56) game.sky.x = 384;

    // --- collisions ---
    for (const col of game.terrain) {
      if (spritesCollide(p.x, p.y, 'heli', col.x, col.y, col.sprite)) {
        crashPlayer();
        break;
      }
    }
    if (p.alive && game.block.alive) {
      const blockSprite = game.block.type === 'coin' ? 'coin' : 'block';
      if (spritesCollide(p.x, p.y, 'heli', game.block.x, game.block.y, blockSprite)) {
        if (game.block.type === 'block') {
          crashPlayer();
        } else {
          collectCoin();
        }
      }
    }
  } else {
    game.deathTimer++;
    if (game.deathTimer > 20) {
      game.state = 'menu';
    }
  }

  updateParticles();
}

function recycleTerrain(col) {
  let slopeinv = 0;
  if (game.slope === 4) {
    if (Math.ceil(Math.random() * 2) === 1) {
      slopeinv = 1; game.slope -= 1; game.whichslope = 'slope3';
    } else {
      slopeinv = 0; game.whichslope = 'slope1';
    }
  } else if (game.slope === 1) {
    if (Math.ceil(Math.random() * 2) === 1) {
      slopeinv = -1; game.slope += 1; game.whichslope = 'slope2';
    } else {
      slopeinv = 0; game.whichslope = 'slope1';
    }
  } else {
    const rnd = Math.ceil(Math.random() * 3);
    if (rnd === 1) {
      slopeinv = 0; game.whichslope = 'slope1';
    } else if (rnd === 2) {
      slopeinv = -1; game.slope += 1; game.whichslope = 'slope2';
    } else {
      slopeinv = 1; game.slope -= 1; game.whichslope = 'slope3';
    }
  }
  col.x = 384;
  col.y = -96 + (game.slope - 1 + slopeinv) * 32;
  col.sprite = game.whichslope;
}

function crashPlayer() {
  const p = game.player;
  p.alive = false;
  game.speede = 0;
  game.deathTimer = 0;
  if (sndEngine && sndEngine.isPlaying()) sndEngine.stop();
  if (sndCrash) sndCrash.play();

  const speed = 8 + Math.abs(p.vspeed);
  const sign = -(p.vspeed + 1) / (Math.abs(p.vspeed) + 1);
  for (const name of GORE_NAMES) {
    const dir = Math.ceil(Math.random() * 45) * sign;
    spawnMotionParticle('gore', p.x + 16, p.y + 16, dir, speed, {
      grav: 0.25,
      spriteName: name,
      life: Infinity,
    });
  }
}

function collectCoin() {
  game.block.alive = false;
  game.score += 100;
  if (game.highscore < game.score) game.highscore = game.score;
  if (sndCoin) sndCoin.play();
  // Speed boost: double speed for 30 frames (~1s at 30fps), refreshed on
  // every pickup — recovered from the decoded action data (coin sets a
  // maybay alarm that reverts the boost).
  game.speede = 2;
  game.boostTimer = 30;
  for (let i = 0; i < 2; i++) {
    spawnMotionParticle('gib', game.block.x + 16, game.block.y + 16,
      85 + Math.ceil(Math.random() * 10), 21, { grav: 3, spriteName: 'coingib1', life: 20 });
  }
  for (let i = 0; i < 2; i++) {
    spawnMotionParticle('gib', game.block.x + 16, game.block.y + 16,
      85 + Math.ceil(Math.random() * 10), 21, { grav: 3, spriteName: 'coingib2', life: 20 });
  }
}

function spawnParticle(kind, x, y, opts) {
  game.particles.push({
    kind, x, y,
    vx: opts.vx || 0, vy: opts.vy || 0,
    grav: opts.grav || 0,
    age: 0, life: opts.life,
    spriteName: opts.spriteName || kind,
  });
}

function spawnMotionParticle(kind, x, y, dirDeg, speed, opts) {
  const rad = (dirDeg * Math.PI) / 180;
  const vx = Math.cos(rad) * speed;
  const vy = -Math.sin(rad) * speed;
  game.particles.push({
    kind, x, y, vx, vy,
    grav: opts.grav || 0,
    age: 0, life: opts.life,
    spriteName: opts.spriteName,
    bloodTimer: 0,
  });
}

function updateParticles() {
  const next = [];
  for (const pt of game.particles) {
    pt.age += 1;
    pt.vy += pt.grav;
    pt.x += pt.vx;
    pt.y += pt.vy;

    if (pt.kind === 'gore') {
      pt.bloodTimer = (pt.bloodTimer || 0) + 1;
      if (pt.bloodTimer >= 2) {
        pt.bloodTimer = 0;
        game.particles.push({
          kind: 'blood', x: pt.x, y: pt.y,
          vx: pt.vx / 3, vy: pt.vy / 3, grav: 0.001,
          age: 0, life: 20, spriteName: 'blood',
        });
      }
    }

    if (pt.life === Infinity || pt.age < pt.life) {
      if (pt.y < WORLD_H + 64 && pt.x > -64 && pt.x < WORLD_W + 64) {
        next.push(pt);
      }
    }
  }
  game.particles = next;
}

// ---------------------------------------------------------------------
// Collision helpers
// ---------------------------------------------------------------------

// True pixel-perfect collision using GameMaker's own precomputed per-sprite
// collision masks (not an alpha/bbox approximation): first reject via bbox
// overlap, then test the actual overlapping pixel region bit-by-bit against
// both masks in world space.
function spritesCollide(ax, ay, aName, bx, by, bName) {
  const adef = SPR[aName], bdef = SPR[bName];
  const ab = adef.bbox || [0, 0, adef.w - 1, adef.h - 1];
  const bb = bdef.bbox || [0, 0, bdef.w - 1, bdef.h - 1];

  const ax1 = ax + ab[0], ay1 = ay + ab[1], ax2 = ax + ab[2] + 1, ay2 = ay + ab[3] + 1;
  const bx1 = bx + bb[0], by1 = by + bb[1], bx2 = bx + bb[2] + 1, by2 = by + bb[3] + 1;
  if (!(ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1)) return false;

  if (!MASKS[aName] || !MASKS[bName]) return true; // no mask data, bbox overlap is all we have

  const x1 = Math.max(ax1, bx1), x2 = Math.min(ax2, bx2);
  const y1 = Math.max(ay1, by1), y2 = Math.min(ay2, by2);
  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      if (maskBit(aName, x - ax, y - ay) && maskBit(bName, x - bx, y - by)) {
        return true;
      }
    }
  }
  return false;
}

// ---------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------

// (x,y) is the sprite's origin point in room space (matching GameMaker's
// draw_sprite semantics), not necessarily its top-left corner.
function drawSprite(name, x, y, frame) {
  const def = SPR[name];
  const imgs = images[name];
  const f = frame !== undefined ? frame % def.frames : 0;
  image(imgs[f], Math.round(x - def.ox), Math.round(y - def.oy));
}

function drawTiledBackground() {
  const tw = bgImage.width, th = bgImage.height;
  for (let x = 0; x < CAM_W; x += tw) {
    for (let y = 0; y < CAM_H; y += th) {
      image(bgImage, x, y);
    }
  }
}

// Coordinates match the original exactly: scoreo/highscoreo are room
// instances at (0,224) and (384,224), and their draw_score/draw_life calls
// use relative offsets (+15,+13) and (-86,+13) from that position.
function drawHUD() {
  drawSprite('scores', 0, 224);
  drawBitmapNumber(String(game.score), 15, 237, '#FFFFFF');

  drawSprite('highscore', 384, 224);
  drawBitmapNumber(String(game.highscore), 298, 237, '#FFFFFF');
}

function drawSplash() {
  background(0);
  const def = SPR.periodbleeders;
  drawSprite('periodbleeders', (CAM_W - def.w) / 2, (CAM_H - def.h) / 2);
}

function drawMenu() {
  background(0);
  drawTiledBackground();
  for (const col of initialMenuTerrain()) {
    drawSprite(col.sprite, col.x, col.y);
  }
  drawSprite('heli', game.menuHeli.x, game.menuHeli.y, Math.floor(game.menuTime / 4));
  drawHUD();
}

let _menuTerrainCache = null;
function initialMenuTerrain() {
  if (!_menuTerrainCache) {
    _menuTerrainCache = [];
    for (let i = 1; i <= 13; i++) {
      _menuTerrainCache.push({ x: (i - 1) * 32, y: -64, sprite: 'slope1' });
    }
  }
  return _menuTerrainCache;
}

function drawPlaying() {
  background(0);
  drawTiledBackground();

  drawSprite('skycity1', game.sky.x, 48);
  for (const c of game.cloud2) drawSprite('cloud2', c.x, c.y);
  for (const c of game.cloud1) drawSprite('cloud1', c.x, c.y);

  for (const col of game.terrain) drawSprite(col.sprite, col.x, col.y);

  if (game.block.alive) {
    drawSprite(game.block.type === 'coin' ? 'coin' : 'block', game.block.x, game.block.y,
      game.block.type === 'coin' ? Math.floor(frameCount / 4) : 0);
  }

  for (const pt of game.particles) {
    if (pt.kind === 'smoke') {
      drawSprite('smoke', pt.x, pt.y, Math.min(pt.age, SPR.smoke.frames - 1));
    } else {
      drawSprite(pt.spriteName, pt.x - SPR[pt.spriteName].w / 2, pt.y - SPR[pt.spriteName].h / 2);
    }
  }

  const p = game.player;
  if (p.alive) {
    drawSprite('heli', p.x, p.y, Math.floor(p.animT));
  }

  drawHUD();
}
