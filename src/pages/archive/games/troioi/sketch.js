// troioi 1.2 — HTML5/p5.js port
//
// Reconstructed from the decompiled GameMaker 8.1 project (troioi1.2.exe).
// The user described this game as unfinished, and the extracted data backs
// that up: several placed/spawned objects (player_bounce, platform_bounce)
// have zero event logic at all, the apple pickup/drop "backpack" system and
// the space-bar screen flash are half-wired, and there's no font asset in
// the project (draw_text calls would have fallen back to GameMaker's
// built-in default font, which isn't something we can extract). See
// tools/GAMEMAKER_DECOMPILATION_GUIDE.md for the general extraction process.
//
// Deliberately NOT 1:1, given the source itself is an unfinished prototype:
//  - The player's real physics used GameMaker's per-pixel "move and probe"
//    collision style (move_contact/if_collision actions testing exact
//    +/-2px offsets), which is a lot of very fiddly logic to replicate
//    exactly. This port uses standard AABB/pixel-mask tile collision with
//    gravity instead — same feel (run, jump, land on the floor tiles),
//    not a literal action-by-action port.
//  - Several "Execute Code" actions are bare incomplete identifiers with no
//    assignment (`v_speed`, `o_gravity`, `o_health`, ...) — confirmed via
//    the same raw-byte-dump method used on the other two ports to be
//    genuinely incomplete in the source, not a decompiler bug. Gravity/jump
//    constants, the flash effect's fade duration, etc. are reconstructed
//    with reasonable values.
//  - `shooty` periodically spawns `player_bounce` instances, which have no
//    behavior at all in the source (no event files) — ported as inert
//    decoration, exactly as unfinished as the original.
//  - The Z-key "backpack" carry system only supports carrying the apples
//    that are actually placed in the room (matches the original, which
//    only ever sets global.itemtoadd from an apple's own draw event).

// Room is 480x272, but the active View only ever samples a 240x136 window
// of it (scrolled to follow the player) and zooms that 2x to fill the
// 480x272 port. We render at the native 240x136 source resolution and let
// CSS handle all further scaling, same pattern as the other two ports.
const WORLD_W = 480;
const WORLD_H = 272;
const CAM_W = 240;
const CAM_H = 136;

const GRAVITY = 0.3;       // reconstructed guess (bare `v_speed`/`o_gravity` code, see header)
const MAX_FALL = 8;
const JUMP_SPEED = -5;     // reconstructed guess
const MOVE_SPEED = 2;      // real, from keypress_37/39 (movespeed = 2)
const FLASH_LIFE = 50;     // reconstructed guess (o_flash's alpha = health/50)
const VIEW_HBORDER = 100;  // real, from the room's view-follow data
const VIEW_VBORDER = 50;
const TILE = 16;

const SPR = {
  s_sam_stand: { frames: 1, w: 19, h: 19, ox: 9, oy: 3 },
  s_sam_walk:  { frames: 6, w: 19, h: 19, ox: 9, oy: 3 },
  s_sam_jump:  { frames: 1, w: 19, h: 19, ox: 9, oy: 3 },
  obs_sprite:  { frames: 1, w: 16, h: 16, ox: 0, oy: 0 },
  s_apple:     { frames: 1, w: 16, h: 16, ox: 0, oy: -2 },
  s_press:     { frames: 8, w: 23, h: 12, ox: 0, oy: 0 },
  airlift:     { frames: 6, w: 32, h: 32, ox: 0, oy: 0 },
  slope:       { frames: 1, w: 16, h: 16, ox: 0, oy: 0 },
};

let images = {};
let MASKS = {}, MASKBITS = {};
let canvas;

function preload() {
  for (const name in SPR) {
    const def = SPR[name];
    images[name] = [];
    for (let i = 0; i < def.frames; i++) {
      images[name].push(loadImage(`./sprites/${name}/${name}_${i}.png`));
    }
  }
  MASKS = loadJSON('./sprites/_masks.json');
}

function setup() {
  canvas = createCanvas(CAM_W, CAM_H);
  canvas.parent('canvas-wrap');
  noSmooth();
  frameRate(30);
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

  resetGame();
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

// ---------------------------------------------------------------------
// Level (from room0's floor/apple/obstacle instances)
// ---------------------------------------------------------------------

// Instance positions parsed directly out of rooms/room0.txt (object indices
// per _index.txt: 3=o_floor, 11=o_apple, 6=obstacle2, 5=shooty, 10=o_hud).
const FLOOR_XY = [[0,0],[0,32],[0,64],[0,96],[0,128],[0,160],[0,256],[0,192],[0,224],[32,256],[64,256],[96,256],[160,256],[448,256],[448,224],[448,208],[448,192],[448,176],[448,160],[448,144],[448,128],[448,112],[448,96],[448,80],[448,64],[448,48],[448,32],[448,16],[448,0],[32,160],[64,160],[416,160],[400,160],[384,160],[368,160],[352,160],[96,224],[128,224],[128,192],[416,128],[352,96],[224,192],[256,192],[288,192],[0,16],[0,48],[0,80],[0,112],[0,144],[0,176],[0,208],[0,240],[16,256],[48,256],[80,256],[112,256],[128,256],[144,256],[176,256],[192,256],[208,256],[224,256],[240,256],[256,256],[272,256],[288,256],[304,256],[320,256],[336,256],[352,256],[368,256],[384,256],[432,256],[400,256],[416,256],[448,240],[16,160],[48,160],[64,176],[48,176],[32,176],[16,176],[80,176],[112,224],[96,240],[112,240],[128,240],[112,208],[128,208],[80,240],[208,192],[240,192],[272,192],[240,240],[256,240],[304,208],[144,240],[144,224],[144,208],[160,240],[160,224],[192,192],[336,176],[256,176],[240,176],[240,160],[400,144],[416,144],[352,112],[368,112],[128,128],[144,128],[128,144],[144,144],[160,144],[160,112],[144,112],[128,112],[144,96],[160,96],[192,112],[128,96],[192,96],[192,128],[192,144],[240,112],[256,112],[272,112],[224,160],[160,128]];
const APPLE_XY = [[240,128],[224,80],[160,64],[80,80],[48,112],[64,128]];
const OBSTACLE_XY = [[208,128],[224,112]];
const SHOOTY_XY = [176,240];
const PLAYER_START = [160,128];

// ---------------------------------------------------------------------
// Game state
// ---------------------------------------------------------------------

const game = {
  cam: { x: 0, y: 0 },
  player: null,
  apples: [],
  particles: [], // decorative airlift junk spawned by shooty
  flash: 0,       // remaining flash-effect frames
  shootyTime: 0,
  time: 0,
};

function resetGame() {
  game.player = {
    x: PLAYER_START[0], y: PLAYER_START[1], vspeed: 0,
    movedir: 0, movespeed: 0, facing: 1, isdown: false, grounded: false,
    walkFrame: 0, sprite: 's_sam_stand',
  };
  game.apples = APPLE_XY.map(([x, y]) => ({ x, y, id: Math.random(), step: 0, taken: false }));
  game.backpack = null; // apple object currently carried, or null
  game.particles = [];
  game.flash = 0;
  game.shootyTime = 0;
  game.time = 0;
  game.cam.x = clampCamX(game.player.x - CAM_W / 2);
  game.cam.y = clampCamY(game.player.y - CAM_H / 2);
}

function clampCamX(x) { return constrain(x, 0, WORLD_W - CAM_W); }
function clampCamY(y) { return constrain(y, 0, WORLD_H - CAM_H); }

// ---------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------

let keyLeft = false, keyRight = false;

function keyPressed() {
  const p = game.player;
  if (keyCode === LEFT_ARROW) { keyLeft = true; setFacing(-1); }
  else if (keyCode === RIGHT_ARROW) { keyRight = true; setFacing(1); }
  else if (keyCode === DOWN_ARROW) { p.isdown = true; }
  else if (key === 'x' || key === 'X') { tryJump(); }
  else if (key === 'z' || key === 'Z') { tryPickupOrDrop(); }
  else if (key === ' ') { game.flash = FLASH_LIFE; }
  return false;
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) { keyLeft = false; updateFacingOnRelease(-1); }
  else if (keyCode === RIGHT_ARROW) { keyRight = false; updateFacingOnRelease(1); }
  else if (keyCode === DOWN_ARROW) { game.player.isdown = false; }
}

function setFacing(dir) {
  game.player.facing = dir;
  game.player.movedir = dir < 0 ? 180 : 0;
  game.player.movespeed = MOVE_SPEED;
}
function updateFacingOnRelease(dir) {
  const p = game.player;
  if (dir < 0 && keyRight) { p.facing = 1; p.movedir = 0; }
  else if (dir > 0 && keyLeft) { p.facing = -1; p.movedir = 180; }
  else { p.movespeed = 0; }
}

function tryJump() {
  const p = game.player;
  if (p.grounded && !p.isdown) {
    p.vspeed = JUMP_SPEED;
    p.grounded = false;
  } else if (p.isdown) {
    // "drop through" a one-way platform (reconstructed from the original's
    // isdown+jump branch, which nudges the player down before re-checking).
    p.y += 3;
  }
}

function tryPickupOrDrop() {
  const p = game.player;
  if (game.backpack === null) {
    for (const a of game.apples) {
      if (a.taken) continue;
      if (rectsOverlap(p.x, p.y + 2, p.x + 16, p.y + 18, a.x, a.y, a.x + 16, a.y + 16)) {
        game.backpack = a;
        a.taken = true;
        break;
      }
    }
  } else {
    game.backpack.taken = false;
    game.backpack.x = p.x;
    game.backpack.y = p.y - 16;
    game.backpack = null;
  }
}

function rectsOverlap(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
  return ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1;
}

// ---------------------------------------------------------------------
// Collision helpers (real per-pixel masks against the floor tiles)
// ---------------------------------------------------------------------

function spriteCollidesFloor(spriteName, x, y) {
  const s = MASKS[spriteName];
  for (const [fx, fy] of FLOOR_XY) {
    if (x + s.w <= fx || x >= fx + TILE || y + s.h <= fy || y >= fy + TILE) continue;
    const x1 = Math.max(x, fx), x2 = Math.min(x + s.w, fx + TILE);
    const y1 = Math.max(y, fy), y2 = Math.min(y + s.h, fy + TILE);
    for (let py = y1; py < y2; py++) {
      for (let px = x1; px < x2; px++) {
        if (maskBit(spriteName, px - x, py - y) && maskBit('obs_sprite', px - fx, py - fy)) return true;
      }
    }
  }
  return false;
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
  game.time += 1;

  // horizontal movement
  if (p.movespeed > 0) {
    const dx = p.movedir === 180 ? -p.movespeed : p.movespeed;
    if (!spriteCollidesFloor(p.sprite, p.x + dx, p.y)) {
      p.x += dx;
    }
    p.walkFrame += 0.2;
  }

  // gravity + vertical movement, resolved separately from horizontal
  p.vspeed = Math.min(p.vspeed + GRAVITY, MAX_FALL);
  let dy = p.vspeed;
  const stepDir = dy > 0 ? 1 : -1;
  let moved = 0;
  while (Math.abs(moved) < Math.abs(dy)) {
    if (spriteCollidesFloor(p.sprite, p.x, p.y + stepDir)) {
      p.vspeed = 0;
      break;
    }
    p.y += stepDir;
    moved += stepDir;
  }
  p.grounded = spriteCollidesFloor(p.sprite, p.x, p.y + 1);

  // sprite state
  if (!p.grounded) p.sprite = 's_sam_jump';
  else if (p.movespeed > 0) p.sprite = 's_sam_walk';
  else p.sprite = 's_sam_stand';
  p.x = constrain(p.x, 0, WORLD_W - 16);
  p.y = constrain(p.y, -64, WORLD_H);

  // carried apple follows the player
  if (game.backpack) {
    game.backpack.x = p.x;
    game.backpack.y = p.y - 16;
  }
  for (const a of game.apples) {
    if (!a.taken) a.step = (a.step + 10) % 360;
  }

  // shooty: decorative inert spawner (matches the original — the spawned
  // object has no behavior of its own)
  game.shootyTime += 1;
  if (game.shootyTime % 50 === 0) {
    game.particles.push({ x: SHOOTY_XY[0], y: SHOOTY_XY[1], age: 0, frame: 0 });
  }
  for (const pt of game.particles) { pt.age += 1; pt.frame += 0.15; }
  game.particles = game.particles.filter((pt) => pt.age < 200);

  if (game.flash > 0) game.flash -= 1;

  // camera: snap-follow with border margins, clamped to room bounds
  if (p.x < game.cam.x + VIEW_HBORDER) game.cam.x = p.x - VIEW_HBORDER;
  if (p.x > game.cam.x + CAM_W - VIEW_HBORDER) game.cam.x = p.x + VIEW_HBORDER - CAM_W;
  if (p.y < game.cam.y + VIEW_VBORDER) game.cam.y = p.y - VIEW_VBORDER;
  if (p.y > game.cam.y + CAM_H - VIEW_VBORDER) game.cam.y = p.y + VIEW_VBORDER - CAM_H;
  game.cam.x = clampCamX(game.cam.x);
  game.cam.y = clampCamY(game.cam.y);
}

// ---------------------------------------------------------------------
// Draw
// ---------------------------------------------------------------------

function drawWorldSprite(name, wx, wy, frame) {
  const def = SPR[name];
  const imgs = images[name];
  const f = frame !== undefined ? Math.floor(frame) % def.frames : 0;
  image(imgs[f], Math.round(wx - game.cam.x - def.ox), Math.round(wy - game.cam.y - def.oy));
}

function render() {
  background('#5c94fc'); // plain sky colour (no background asset in this project)

  for (const [x, y] of FLOOR_XY) drawWorldSprite('obs_sprite', x, y);
  for (const [x, y] of OBSTACLE_XY) drawWorldSprite('slope', x, y);

  for (const a of game.apples) {
    if (a.taken && a !== game.backpack) continue;
    drawWorldSprite('s_apple', a.x, a.y + Math.sin((a.step * Math.PI) / 180) * 4);
    if (!a.taken) {
      const p = game.player;
      if (rectsOverlap(p.x, p.y + 2, p.x + 16, p.y + 18, a.x, a.y, a.x + 16, a.y + 16)) {
        drawWorldSprite('s_press', a.x - 4, a.y - 14, (game.time / 3) % 8);
      }
    }
  }

  for (const pt of game.particles) drawWorldSprite('airlift', pt.x, pt.y, pt.frame);

  const p = game.player;
  // p.x/p.y are the top-left of the player's 16x16 logical collision box
  // (matching the apple pickup check and tile collision), not the sprite's
  // own origin point — draw relative to that same top-left consistently,
  // ignoring the sprite's baked-in origin, so the visual body lines up with
  // where collision actually happens.
  push();
  translate(Math.round(p.x - game.cam.x), Math.round(p.y - game.cam.y));
  scale(p.facing, 1);
  const def = SPR[p.sprite];
  const f = p.sprite === 's_sam_walk' ? Math.floor(p.walkFrame) % def.frames : 0;
  const drawX = p.facing > 0 ? 0 : -def.w;
  image(images[p.sprite][f], drawX, 0);
  pop();

  drawHUD();

  if (game.flash > 0) {
    noStroke();
    fill(255, 255, 255, (game.flash / FLASH_LIFE) * 255);
    rect(0, 0, CAM_W, CAM_H);
  }
}

function drawHUD() {
  fill(255);
  noStroke();
  textFont('monospace');
  textSize(8);
  textAlign(LEFT, TOP);
  text('press X to jump, arrows to move, Z to carry an apple', 2, 2);

  if (game.backpack) {
    drawWorldSprite('s_apple', game.cam.x + 5, game.cam.y + 110);
  }
}
