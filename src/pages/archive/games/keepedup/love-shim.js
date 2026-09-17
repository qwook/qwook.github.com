// LOVE2D-compatible runtime shim for keepedup, running the game's real,
// unmodified .lua files through Fengari (a Lua VM compiled to JS). See
// tools/LOVE2D_WEB_PORTING_GUIDE.md for the general approach (also used by
// djarlum-love/web/). This one is bigger: keepedup uses love.physics (real
// Box2D), love.audio, image fonts and spritesheets, so the shim below wraps
// planck.js (a maintained JS Box2D port) for love.physics, and Canvas2D for
// everything else.
//
// Design: a Lua-side "love" table (LOVE_LUA below) mirrors the real LOVE
// API shape exactly, with each function delegating to a plain-data
// JS primitive (__gfx_*/__phys_*/__audio_*/...). All physics objects
// (World/Body/Fixture) are represented on the Lua side as small tables
// `{__id = <int>}` with methods that call back into JS by id -- there is
// no need to preserve real object identity across the Lua/JS boundary
// except for a fixture's *userdata* (an arbitrary Lua value, e.g. a Ball/
// Coin/Bomb instance), which is pinned in the Lua registry via luaL_ref so
// world contact callbacks can hand back the exact original Lua object.
'use strict';

const { lua, lauxlib, lualib, to_luastring } = fengari;
const S = to_luastring; // alias, used constantly below

function luaRun(L, src, chunkname) {
  if (lauxlib.luaL_loadstring(L, S(src)) !== lua.LUA_OK) {
    throw new Error('Lua load error (' + chunkname + '): ' + lua.lua_tojsstring(L, -1));
  }
  if (lua.lua_pcall(L, 0, lua.LUA_MULTRET, 0) !== lua.LUA_OK) {
    throw new Error('Lua runtime error (' + chunkname + '): ' + lua.lua_tojsstring(L, -1));
  }
}

function registerPreload(L, name, src) {
  lua.lua_getglobal(L, S('package'));
  lua.lua_getfield(L, -1, S('preload'));
  if (lauxlib.luaL_loadstring(L, S(src)) !== lua.LUA_OK) {
    throw new Error('Lua load error (' + name + '): ' + lua.lua_tojsstring(L, -1));
  }
  lua.lua_setfield(L, -2, S(name));
  lua.lua_pop(L, 2);
}

async function fetchText(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error('Failed to fetch ' + path + ': ' + res.status);
  return res.text();
}

function loadImage(path) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image ' + path));
    img.src = path;
  });
}

function loadAudio(path) {
  return new Promise((resolve, reject) => {
    const a = new Audio();
    a.preload = 'auto';
    a.oncanplaythrough = () => resolve(a);
    a.onerror = () => reject(new Error('Failed to load audio ' + path));
    a.src = path;
    a.load();
  });
}

// ---------------------------------------------------------------------
// Image font parsing: LOVE's ImageFont format is "glyphs separated by
// columns of the image's (0,0) pixel color". Scan columns, split runs,
// zip 1:1 against the glyph string love.graphics.newImageFont was given.
// ---------------------------------------------------------------------
function parseImageFont(img, glyphChars) {
  const c = document.createElement('canvas');
  c.width = img.width;
  c.height = img.height;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, img.width, img.height).data;
  const w = img.width, h = img.height;
  const sepIdx = 0; // (0,0)
  const sr = data[sepIdx], sg = data[sepIdx + 1], sb = data[sepIdx + 2], sa = data[sepIdx + 3];
  function isSep(x) {
    for (let y = 0; y < h; y++) {
      const i = (y * w + x) * 4;
      if (data[i] !== sr || data[i + 1] !== sg || data[i + 2] !== sb || data[i + 3] !== sa) return false;
    }
    return true;
  }
  const rects = [];
  let runStart = -1;
  for (let x = 0; x < w; x++) {
    if (isSep(x)) {
      if (runStart >= 0) { rects.push({ x: runStart, y: 0, w: x - runStart, h }); runStart = -1; }
    } else if (runStart < 0) {
      runStart = x;
    }
  }
  if (runStart >= 0) rects.push({ x: runStart, y: 0, w: w - runStart, h });

  const glyphs = {}; // charcode -> {x,y,w,h}
  for (let i = 0; i < glyphChars.length && i < rects.length; i++) {
    glyphs[glyphChars.charCodeAt(i)] = rects[i];
  }
  return { image: img, glyphs, height: h };
}

async function boot(rootPath, screenCanvas) {
  // ---------------------------------------------------------------------
  // 1. Preload everything up front. Lua execution is synchronous and this
  //    game calls e.g. image:getWidth() the instant an image is created
  //    (spritesheet.lua), so every asset must already be a decoded,
  //    ready-to-use JS object before any Lua runs -- there's no way to
  //    hand Lua a "loading" placeholder and fill it in later.
  // ---------------------------------------------------------------------
  const IMAGES = [
    'bombsheet.gif', 'hand2.gif', 'keepedup_attacksheet.gif', 'keepedup_background.gif',
    'keepedup_coin.gif', 'keepedup_ed.gif', 'keepedup_font2.gif', 'keepedup_objects.gif',
    'keepedup_pooppantssheet.gif', 'keepedup_slashsheet.gif', 'keepedup_smashsheet.gif', 'keepedup_star.gif',
  ];
  const SOUNDS = [
    'coin1.ogg', 'coin2.ogg', 'coin3.ogg', 'explode1.ogg', 'explode2.ogg', 'explode3.ogg',
    'hey.ogg', 'hit.ogg', 'ow.ogg', 'play.ogg', 'snort.ogg', 'swing.ogg', 'keepedup.ogg'
  ];

  const imageCache = {};
  await Promise.all(IMAGES.map(async (name) => { imageCache['img/' + name] = await loadImage(rootPath + 'img/' + name); }));
  const audioCache = {};
  await Promise.all(SOUNDS.map(async (name) => { audioCache['sounds/' + name] = await loadAudio(rootPath + 'sounds/' + name); }));
  try {
    const fontFace = new FontFace('slkscre', `url(${rootPath}img/slkscre.ttf)`);
    await fontFace.load();
    document.fonts.add(fontFace);
  } catch (e) {
    console.warn('slkscre.ttf failed to load (only used for hit-box width estimates):', e);
  }

  const L = lauxlib.luaL_newstate();
  lualib.luaL_openlibs(L);

  const screenCtx = screenCanvas.getContext('2d');
  screenCtx.imageSmoothingEnabled = false;
  let bgColor = 'rgb(0,0,0)';
  let fillColor = 'rgba(255,255,255,1)';
  let fillRGBA = [255, 255, 255, 255];

  // -----------------------------------------------------------------
  // love.graphics: images/quads
  // -----------------------------------------------------------------
  const images = []; // {img, w, h}
  const quads = []; // {x,y,w,h}
  let fonts = []; // font id -> {kind:'ttf', family, size} | {kind:'image', ...parseImageFont()}
  let currentFontId = -1;
  const tintedFontCache = {}; // "fontId|color" -> canvas

  function getTintedImage(img, colorCss) {
    const key = img.src + '|' + colorCss;
    if (tintedFontCache[key]) return tintedFontCache[key];
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = colorCss;
    ctx.fillRect(0, 0, img.width, img.height);
    ctx.globalCompositeOperation = 'source-over';
    tintedFontCache[key] = c;
    return c;
  }

  lua.lua_pushjsfunction(L, (L) => {
    const path = lua.lua_tojsstring(L, 1);
    const img = imageCache[path];
    if (!img) throw new Error('image not preloaded: ' + path);
    images.push({ img, w: img.width, h: img.height });
    lua.lua_pushnumber(L, images.length - 1);
    lua.lua_pushnumber(L, img.width);
    lua.lua_pushnumber(L, img.height);
    return 3;
  });
  lua.lua_setglobal(L, S('__gfx_newImage'));

  lua.lua_pushjsfunction(L, (L) => {
    const x = lua.lua_tonumber(L, 1), y = lua.lua_tonumber(L, 2);
    const w = lua.lua_tonumber(L, 3), h = lua.lua_tonumber(L, 4);
    quads.push({ x, y, w, h });
    lua.lua_pushnumber(L, quads.length - 1);
    return 1;
  });
  lua.lua_setglobal(L, S('__gfx_newQuad'));

  lua.lua_pushjsfunction(L, (L) => {
    const path = lua.lua_tojsstring(L, 1);
    const size = lua.lua_tonumber(L, 2);
    fonts.push({ kind: 'ttf', size });
    lua.lua_pushnumber(L, fonts.length - 1);
    return 1;
  });
  lua.lua_setglobal(L, S('__gfx_newFont'));

  lua.lua_pushjsfunction(L, (L) => {
    const path = lua.lua_tojsstring(L, 1);
    const glyphStr = lua.lua_tojsstring(L, 2);
    const img = imageCache[path];
    if (!img) throw new Error('image not preloaded: ' + path);
    const parsed = parseImageFont(img, glyphStr);
    fonts.push({ kind: 'image', ...parsed });
    lua.lua_pushnumber(L, fonts.length - 1);
    return 1;
  });
  lua.lua_setglobal(L, S('__gfx_newImageFont'));

  lua.lua_pushjsfunction(L, (L) => {
    currentFontId = lua.lua_tonumber(L, 1);
    return 0;
  });
  lua.lua_setglobal(L, S('__gfx_setFont'));

  // measure text width using a font id (ttf: canvas measureText; image: sum of glyph widths)
  function measureWidth(fontId, str) {
    const f = fonts[fontId];
    if (!f) return 0;
    if (f.kind === 'ttf') {
      screenCtx.save();
      screenCtx.font = f.size + 'px slkscre, monospace';
      const w = screenCtx.measureText(str).width;
      screenCtx.restore();
      return w;
    }
    let w = 0;
    for (let i = 0; i < str.length; i++) {
      const g = f.glyphs[str.charCodeAt(i)];
      w += g ? g.w + 1 : (f.glyphs[32] ? f.glyphs[32].w : 8);
    }
    return w;
  }

  lua.lua_pushjsfunction(L, (L) => {
    const fontId = lua.lua_tonumber(L, 1);
    const str = String(lua.lua_tojsstring(L, 2));
    lua.lua_pushnumber(L, measureWidth(fontId, str));
    return 1;
  });
  lua.lua_setglobal(L, S('__gfx_fontGetWidth'));

  lua.lua_pushjsfunction(L, (L) => {
    const fontId = lua.lua_tonumber(L, 1);
    const f = fonts[fontId];
    lua.lua_pushnumber(L, f ? (f.kind === 'ttf' ? f.size * 1.2 : f.height) : 0);
    return 1;
  });
  lua.lua_setglobal(L, S('__gfx_fontGetHeight'));

  // -----------------------------------------------------------------
  // love.graphics: transform stack, color, drawing primitives
  // -----------------------------------------------------------------
  lua.lua_pushjsfunction(L, (L) => { screenCtx.save(); return 0; });
  lua.lua_setglobal(L, S('__gfx_push'));
  lua.lua_pushjsfunction(L, (L) => { screenCtx.restore(); applyColor(); return 0; });
  lua.lua_setglobal(L, S('__gfx_pop'));
  function applyColor() {
    screenCtx.fillStyle = fillColor;
    screenCtx.strokeStyle = fillColor;
  }
  lua.lua_pushjsfunction(L, (L) => { screenCtx.translate(lua.lua_tonumber(L, 1), lua.lua_tonumber(L, 2)); return 0; });
  lua.lua_setglobal(L, S('__gfx_translate'));
  lua.lua_pushjsfunction(L, (L) => { screenCtx.scale(lua.lua_tonumber(L, 1), lua.lua_tonumber(L, 2)); return 0; });
  lua.lua_setglobal(L, S('__gfx_scale'));
  lua.lua_pushjsfunction(L, (L) => { screenCtx.rotate(lua.lua_tonumber(L, 1)); return 0; });
  lua.lua_setglobal(L, S('__gfx_rotate'));

  lua.lua_pushjsfunction(L, (L) => {
    const r = lua.lua_tonumber(L, 1), g = lua.lua_tonumber(L, 2), b = lua.lua_tonumber(L, 3);
    const a = lua.lua_isnoneornil(L, 4) ? 255 : lua.lua_tonumber(L, 4);
    fillRGBA = [r, g, b, a];
    fillColor = `rgba(${r | 0},${g | 0},${b | 0},${a / 255})`;
    applyColor();
    return 0;
  });
  lua.lua_setglobal(L, S('__gfx_setColor'));

  lua.lua_pushjsfunction(L, (L) => {
    const r = lua.lua_tonumber(L, 1), g = lua.lua_tonumber(L, 2), b = lua.lua_tonumber(L, 3);
    bgColor = `rgb(${r | 0},${g | 0},${b | 0})`;
    return 0;
  });
  lua.lua_setglobal(L, S('__gfx_setBackgroundColor'));

  lua.lua_pushjsfunction(L, (L) => {
    screenCtx.save();
    screenCtx.setTransform(1, 0, 0, 1, 0, 0);
    screenCtx.fillStyle = bgColor;
    screenCtx.fillRect(0, 0, screenCanvas.width, screenCanvas.height);
    screenCtx.restore();
    return 0;
  });
  lua.lua_setglobal(L, S('__gfx_clear'));

  lua.lua_pushjsfunction(L, (L) => {
    const mode = lua.lua_tojsstring(L, 1);
    const x = lua.lua_tonumber(L, 2), y = lua.lua_tonumber(L, 3);
    const w = lua.lua_tonumber(L, 4), h = lua.lua_tonumber(L, 5);
    if (mode === 'line') screenCtx.strokeRect(x, y, w, h); else screenCtx.fillRect(x, y, w, h);
    return 0;
  });
  lua.lua_setglobal(L, S('__gfx_rectangle'));

  lua.lua_pushjsfunction(L, (L) => {
    const mode = lua.lua_tojsstring(L, 1);
    const x = lua.lua_tonumber(L, 2), y = lua.lua_tonumber(L, 3), radius = lua.lua_tonumber(L, 4);
    screenCtx.beginPath();
    screenCtx.arc(x, y, radius, 0, Math.PI * 2);
    if (mode === 'line') screenCtx.stroke(); else screenCtx.fill();
    return 0;
  });
  lua.lua_setglobal(L, S('__gfx_circle'));

  lua.lua_pushjsfunction(L, (L) => {
    screenCtx.lineWidth = Math.max(1, lua.lua_tonumber(L, 1));
    return 0;
  });
  lua.lua_setglobal(L, S('__gfx_setLineWidth'));

  lua.lua_pushjsfunction(L, (L) => {
    const n = lua.lua_gettop(L);
    screenCtx.beginPath();
    screenCtx.moveTo(lua.lua_tonumber(L, 1), lua.lua_tonumber(L, 2));
    for (let i = 3; i + 1 <= n; i += 2) screenCtx.lineTo(lua.lua_tonumber(L, i), lua.lua_tonumber(L, i + 1));
    screenCtx.stroke();
    return 0;
  });
  lua.lua_setglobal(L, S('__gfx_line'));

  lua.lua_pushjsfunction(L, (L) => {
    const mode = lua.lua_tojsstring(L, 1);
    screenCtx.globalCompositeOperation = mode === 'additive' ? 'lighter' : 'source-over';
    return 0;
  });
  lua.lua_setglobal(L, S('__gfx_setBlendMode'));

  // draw(imageId, quadId|-1, x, y, r, sx, sy)
  lua.lua_pushjsfunction(L, (L) => {
    const imgId = lua.lua_tonumber(L, 1);
    const quadId = lua.lua_tonumber(L, 2);
    const x = lua.lua_tonumber(L, 3), y = lua.lua_tonumber(L, 4);
    const r = lua.lua_tonumber(L, 5);
    const sx = lua.lua_tonumber(L, 6), sy = lua.lua_tonumber(L, 7);
    const entry = images[imgId];
    if (!entry) return 0;
    screenCtx.save();
    screenCtx.translate(x, y);
    if (r) screenCtx.rotate(r);
    screenCtx.scale(sx, sy);
    if (quadId >= 0) {
      const q = quads[quadId];
      screenCtx.drawImage(entry.img, q.x, q.y, q.w, q.h, 0, 0, q.w, q.h);
    } else {
      screenCtx.drawImage(entry.img, 0, 0);
    }
    screenCtx.restore();
    return 0;
  });
  lua.lua_setglobal(L, S('__gfx_draw'));

  // print(text, x, y, r, sx, sy) using currentFontId
  function drawBitmapText(font, str, x, y, sx, sy) {
    const colorCss = `rgb(${fillRGBA[0] | 0},${fillRGBA[1] | 0},${fillRGBA[2] | 0})`;
    const tinted = getTintedImage(font.image, colorCss);
    const alpha = fillRGBA[3] / 255;
    screenCtx.save();
    screenCtx.translate(x, y);
    screenCtx.scale(sx, sy);
    screenCtx.globalAlpha = alpha;
    let cx = 0;
    for (let i = 0; i < str.length; i++) {
      const g = font.glyphs[str.charCodeAt(i)];
      if (!g) { cx += 8; continue; }
      screenCtx.drawImage(tinted, Math.floor(g.x), Math.floor(g.y), Math.floor(g.w), Math.floor(g.h), cx, 0, Math.floor(g.w), Math.floor(g.h));
      cx += g.w + 1;
    }
    screenCtx.restore();
    return cx;
  }

  lua.lua_pushjsfunction(L, (L) => {
    const str = String(lua.lua_tojsstring(L, 1));
    const x = lua.lua_tonumber(L, 2), y = lua.lua_tonumber(L, 3);
    const r = lua.lua_tonumber(L, 4) || 0;
    const sx = lua.lua_isnoneornil(L, 5) ? 1 : lua.lua_tonumber(L, 5);
    const sy = lua.lua_isnoneornil(L, 6) ? sx : lua.lua_tonumber(L, 6);
    const font = fonts[currentFontId];
    if (!font || font.kind !== 'image') return 0; // ttf fonts are never actually drawn in this game
    if (r) {
      screenCtx.save();
      screenCtx.translate(x, y);
      screenCtx.rotate(r);
      drawBitmapText(font, str, 0, 0, sx, sy);
      screenCtx.restore();
    } else {
      drawBitmapText(font, str, x, y, sx, sy);
    }
    return 0;
  });
  lua.lua_setglobal(L, S('__gfx_print'));

  // printf(text, x, y, limit, alignCode[0=left,1=center,2=right], r, sx, sy)
  lua.lua_pushjsfunction(L, (L) => {
    const str = String(lua.lua_tojsstring(L, 1));
    const x = lua.lua_tonumber(L, 2), y = lua.lua_tonumber(L, 3);
    const limit = lua.lua_tonumber(L, 4);
    const align = lua.lua_tojsstring(L, 5);
    const r = lua.lua_tonumber(L, 6) || 0;
    const sx = lua.lua_isnoneornil(L, 7) ? 1 : lua.lua_tonumber(L, 7);
    const sy = lua.lua_isnoneornil(L, 8) ? sx : lua.lua_tonumber(L, 8);
    const font = fonts[currentFontId];
    if (!font || font.kind !== 'image') return 0;

    // Explicit newlines first; then greedy word-wrap each line to `limit`.
    const outLines = [];
    for (const rawLine of str.split('\n')) {
      const words = rawLine.split(' ');
      let cur = '';
      for (const word of words) {
        const attempt = cur ? cur + ' ' + word : word;
        if (measureWidth(currentFontId, attempt) * sx > limit && cur) {
          outLines.push(cur);
          cur = word;
        } else {
          cur = attempt;
        }
      }
      outLines.push(cur);
    }

    screenCtx.save();
    screenCtx.translate(x, y);
    if (r) screenCtx.rotate(r);
    const lineH = (font.height) * sy;
    outLines.forEach((line, i) => {
      const lw = measureWidth(currentFontId, line) * sx;
      let lx = 0;
      if (align === 'center') lx = (limit - lw) / 2;
      else if (align === 'right') lx = limit - lw;
      drawBitmapText(font, line, lx, i * lineH, sx, sy);
    });
    screenCtx.restore();
    return 0;
  });
  lua.lua_setglobal(L, S('__gfx_printf'));

  lua.lua_pushjsfunction(L, (L) => { lua.lua_pushnumber(L, screenCanvas.width); return 1; });
  lua.lua_setglobal(L, S('__gfx_getWidth'));
  lua.lua_pushjsfunction(L, (L) => { lua.lua_pushnumber(L, screenCanvas.height); return 1; });
  lua.lua_setglobal(L, S('__gfx_getHeight'));

  lua.lua_pushjsfunction(L, (L) => {
    screenCanvas.width = lua.lua_tonumber(L, 1);
    screenCanvas.height = lua.lua_tonumber(L, 2);
    screenCtx.imageSmoothingEnabled = false;
    return 0;
  });
  lua.lua_setglobal(L, S('__window_setMode'));

  // -----------------------------------------------------------------
  // love.physics: wraps planck.js. See boot()'s Lua shim (LOVE_LUA) for
  // how these become love.physics.* objects; only the id-indexed raw
  // state lives here in JS. Positions/velocities/radii are pixel-scale
  // on the Lua side and meter-scale in planck, matching what real LOVE's
  // C++ Box2D binding does internally with love.physics.setMeter().
  // -----------------------------------------------------------------
  const planck = window.planck;
  let meter = 100; // love.physics.setMeter default
  const worlds = [];
  const bodies = []; // {world, planckBody}
  const fixtures = []; // {planckFixture, userDataRef, shapeRadiusPx}
  const worldCallbacks = []; // {beginRef, endRef}

  function fixtureById(id) { return fixtures[id]; }

  lua.lua_pushjsfunction(L, (L) => { meter = lua.lua_tonumber(L, 1); return 0; });
  lua.lua_setglobal(L, S('__phys_setMeter'));
  lua.lua_pushjsfunction(L, (L) => { lua.lua_pushnumber(L, meter); return 1; });
  lua.lua_setglobal(L, S('__phys_getMeter'));

  lua.lua_pushjsfunction(L, (L) => {
    const gx = lua.lua_tonumber(L, 1) / meter, gy = lua.lua_tonumber(L, 2) / meter;
    const allowSleep = lua.lua_toboolean(L, 3);
    const w = new planck.World({ gravity: planck.Vec2(gx, gy), allowSleep });
    const id = worlds.length;
    worlds.push(w);
    worldCallbacks.push({ beginRef: null, endRef: null });
    w.on('begin-contact', (contact) => {
      const cb = worldCallbacks[id];
      if (cb.beginRef == null) return;
      const fa = contact.getFixtureA().__shimId, fb = contact.getFixtureB().__shimId;
      if (fa == null || fb == null) return;
      callLuaFn(cb.beginRef, () => { pushWrappedFixture(fa); pushWrappedFixture(fb); return 2; });
    });
    w.on('end-contact', (contact) => {
      const cb = worldCallbacks[id];
      if (cb.endRef == null) return;
      const fa = contact.getFixtureA().__shimId, fb = contact.getFixtureB().__shimId;
      if (fa == null || fb == null) return;
      callLuaFn(cb.endRef, () => { pushWrappedFixture(fa); pushWrappedFixture(fb); return 2; });
    });
    lua.lua_pushnumber(L, id);
    return 1;
  });
  lua.lua_setglobal(L, S('__phys_newWorld'));

  function callLuaFn(ref, pushArgs) {
    lua.lua_rawgeti(L, lua.LUA_REGISTRYINDEX, ref);
    const nargs = pushArgs();
    if (lua.lua_pcall(L, nargs, 0, 0) !== lua.LUA_OK) {
      console.error('Lua callback error:', lua.lua_tojsstring(L, -1));
      lua.lua_pop(L, 1);
    }
  }

  function pushWrappedFixture(id) {
    lua.lua_getglobal(L, S('__wrapFixture'));
    lua.lua_pushnumber(L, id);
    lua.lua_call(L, 1, 1);
  }

  // Lua passes {begin=fn, end=fn} as a table so we can luaL_ref both cleanly.
  lua.lua_pushjsfunction(L, (L) => {
    const worldId = lua.lua_tonumber(L, 1);
    lua.lua_getfield(L, 2, S('begin'));
    const beginRef = lauxlib.luaL_ref(L, lua.LUA_REGISTRYINDEX);
    lua.lua_getfield(L, 2, S('end_'));
    const endRef = lauxlib.luaL_ref(L, lua.LUA_REGISTRYINDEX);
    worldCallbacks[worldId] = { beginRef, endRef };
    return 0;
  });
  lua.lua_setglobal(L, S('__phys_setCallbacks'));

  lua.lua_pushjsfunction(L, (L) => {
    const worldId = lua.lua_tonumber(L, 1);
    const dt = lua.lua_tonumber(L, 2);
    worlds[worldId].step(dt, 8, 3);
    return 0;
  });
  lua.lua_setglobal(L, S('__phys_worldUpdate'));

  lua.lua_pushjsfunction(L, (L) => {
    const worldId = lua.lua_tonumber(L, 1);
    const x = lua.lua_tonumber(L, 2) / meter, y = lua.lua_tonumber(L, 3) / meter;
    const type = lua.lua_tojsstring(L, 4);
    const b = worlds[worldId].createBody({ type, position: planck.Vec2(x, y) });
    const id = bodies.length;
    bodies.push(b);
    lua.lua_pushnumber(L, id);
    return 1;
  });
  lua.lua_setglobal(L, S('__phys_newBody'));

  lua.lua_pushjsfunction(L, (L) => {
    const bodyId = lua.lua_tonumber(L, 1);
    const radiusPx = lua.lua_tonumber(L, 2); // circle-only shapes in this game
    const density = lua.lua_tonumber(L, 3);
    const body = bodies[bodyId];
    const fix = body.createFixture({ shape: new planck.Circle(radiusPx / meter), density });
    const id = fixtures.length;
    fix.__shimId = id;
    fixtures.push({ fixture: fix, userDataRef: null, radiusPx });
    lua.lua_pushnumber(L, id);
    return 1;
  });
  lua.lua_setglobal(L, S('__phys_newFixture'));

  lua.lua_pushjsfunction(L, (L) => {
    const id = lua.lua_tonumber(L, 1);
    fixtures[id].fixture.setSensor(lua.lua_toboolean(L, 2));
    return 0;
  });
  lua.lua_setglobal(L, S('__phys_fixtureSetSensor'));

  lua.lua_pushjsfunction(L, (L) => {
    const id = lua.lua_tonumber(L, 1);
    const entry = fixtures[id];
    if (entry.userDataRef != null) lauxlib.luaL_unref(L, lua.LUA_REGISTRYINDEX, entry.userDataRef);
    lua.lua_pushvalue(L, 2);
    entry.userDataRef = lauxlib.luaL_ref(L, lua.LUA_REGISTRYINDEX);
    return 0;
  });
  lua.lua_setglobal(L, S('__phys_fixtureSetUserData'));

  lua.lua_pushjsfunction(L, (L) => {
    const id = lua.lua_tonumber(L, 1);
    const ref = fixtures[id].userDataRef;
    if (ref == null) { lua.lua_pushnil(L); return 1; }
    lua.lua_rawgeti(L, lua.LUA_REGISTRYINDEX, ref);
    return 1;
  });
  lua.lua_setglobal(L, S('__phys_fixtureGetUserData'));

  lua.lua_pushjsfunction(L, (L) => {
    const id = lua.lua_tonumber(L, 1);
    fixtures[id].fixture.m_body.destroyFixture(fixtures[id].fixture);
    return 0;
  });
  lua.lua_setglobal(L, S('__phys_fixtureDestroy'));

  // Circle-vs-segment ray test (this game only ever uses circle fixtures).
  lua.lua_pushjsfunction(L, (L) => {
    const id = lua.lua_tonumber(L, 1);
    const x1 = lua.lua_tonumber(L, 2), y1 = lua.lua_tonumber(L, 3);
    const x2 = lua.lua_tonumber(L, 4), y2 = lua.lua_tonumber(L, 5);
    const maxFraction = lua.lua_tonumber(L, 6);
    const entry = fixtures[id];
    const [cx, cy] = bodyPosPx(entry.fixture.getBody());
    const r = entry.radiusPx;
    const dx = x2 - x1, dy = y2 - y1;
    const fx = x1 - cx, fy = y1 - cy;
    const a = dx * dx + dy * dy;
    const b = 2 * (fx * dx + fy * dy);
    const cc = fx * fx + fy * fy - r * r;
    const disc = b * b - 4 * a * cc;
    if (disc < 0 || a === 0) return 0;
    const sq = Math.sqrt(disc);
    let t = (-b - sq) / (2 * a);
    if (t < 0 || t > maxFraction) t = (-b + sq) / (2 * a);
    if (t < 0 || t > maxFraction) return 0;
    lua.lua_pushnumber(L, x1 + dx * t);
    lua.lua_pushnumber(L, y1 + dy * t);
    lua.lua_pushnumber(L, t);
    return 3;
  });
  lua.lua_setglobal(L, S('__phys_fixtureRayCast'));

  function bodyPosPx(body) {
    const p = body.getPosition();
    return [p.x * meter, p.y * meter];
  }

  lua.lua_pushjsfunction(L, (L) => {
    const id = lua.lua_tonumber(L, 1);
    const [x, y] = bodyPosPx(bodies[id]);
    lua.lua_pushnumber(L, x);
    lua.lua_pushnumber(L, y);
    return 2;
  });
  lua.lua_setglobal(L, S('__phys_bodyGetPosition'));

  lua.lua_pushjsfunction(L, (L) => {
    const id = lua.lua_tonumber(L, 1);
    const x = lua.lua_tonumber(L, 2) / meter, y = lua.lua_tonumber(L, 3) / meter;
    bodies[id].setPosition(planck.Vec2(x, y));
    return 0;
  });
  lua.lua_setglobal(L, S('__phys_bodySetPosition'));

  lua.lua_pushjsfunction(L, (L) => {
    const id = lua.lua_tonumber(L, 1);
    const v = bodies[id].getLinearVelocity();
    lua.lua_pushnumber(L, v.x * meter);
    lua.lua_pushnumber(L, v.y * meter);
    return 2;
  });
  lua.lua_setglobal(L, S('__phys_bodyGetLinearVelocity'));

  lua.lua_pushjsfunction(L, (L) => {
    const id = lua.lua_tonumber(L, 1);
    const x = lua.lua_tonumber(L, 2) / meter, y = lua.lua_tonumber(L, 3) / meter;
    bodies[id].setLinearVelocity(planck.Vec2(x, y));
    return 0;
  });
  lua.lua_setglobal(L, S('__phys_bodySetLinearVelocity'));

  lua.lua_pushjsfunction(L, (L) => { lua.lua_pushnumber(L, bodies[lua.lua_tonumber(L, 1)].getAngle()); return 1; });
  lua.lua_setglobal(L, S('__phys_bodyGetAngle'));

  lua.lua_pushjsfunction(L, (L) => { lua.lua_pushboolean(L, bodies[lua.lua_tonumber(L, 1)].isAwake()); return 1; });
  lua.lua_setglobal(L, S('__phys_bodyIsAwake'));

  lua.lua_pushjsfunction(L, (L) => { bodies[lua.lua_tonumber(L, 1)].setAwake(lua.lua_toboolean(L, 2)); return 0; });
  lua.lua_setglobal(L, S('__phys_bodySetAwake'));

  lua.lua_pushjsfunction(L, (L) => {
    const id = lua.lua_tonumber(L, 1), mass = lua.lua_tonumber(L, 2);
    bodies[id].setMassData({ mass, center: planck.Vec2(0, 0), I: mass });
    return 0;
  });
  lua.lua_setglobal(L, S('__phys_bodySetMass'));
  lua.lua_pushjsfunction(L, (L) => { lua.lua_pushnumber(L, bodies[lua.lua_tonumber(L, 1)].getMass()); return 1; });
  lua.lua_setglobal(L, S('__phys_bodyGetMass'));

  // Force/impulse are length/time-derived quantities -- same /meter
  // scaling as position and velocity (see LOVE_LUA header comment).
  lua.lua_pushjsfunction(L, (L) => {
    const id = lua.lua_tonumber(L, 1);
    const fx = lua.lua_tonumber(L, 2) / meter, fy = lua.lua_tonumber(L, 3) / meter;
    bodies[id].applyForceToCenter(planck.Vec2(fx, fy), true);
    return 0;
  });
  lua.lua_setglobal(L, S('__phys_bodyApplyForce'));

  lua.lua_pushjsfunction(L, (L) => {
    const id = lua.lua_tonumber(L, 1);
    const ix = lua.lua_tonumber(L, 2) / meter, iy = lua.lua_tonumber(L, 3) / meter;
    const x = lua.lua_tonumber(L, 4) / meter, y = lua.lua_tonumber(L, 5) / meter;
    bodies[id].applyLinearImpulse(planck.Vec2(ix, iy), planck.Vec2(x, y), true);
    return 0;
  });
  lua.lua_setglobal(L, S('__phys_bodyApplyLinearImpulse'));

  // -----------------------------------------------------------------
  // love.audio / love.filesystem / love.mouse / love.keyboard / love.timer
  // -----------------------------------------------------------------
  const sources = [];
  lua.lua_pushjsfunction(L, (L) => {
    const path = lua.lua_tojsstring(L, 1);
    const a = audioCache[path];
    a.addEventListener('playing', () => {
      a._playing = true;
    });

    a.addEventListener('pause', () => {
      a._playing = false;
    });

    a.addEventListener('ended', () => {
      a._playing = false;
    });
    if (!a) throw new Error('audio not preloaded: ' + path);
    const id = sources.length;
    sources.push(a); // one <audio> element per Source; play() restarts it, matching LOVE's static-source replay semantics
    lua.lua_pushnumber(L, id);
    return 1;
  });
  lua.lua_setglobal(L, S('__audio_newSource'));

  lua.lua_pushjsfunction(L, (L) => {
    const audio = sources[lua.lua_tonumber(L, 1)]; 
    lua.lua_pushboolean( L, audio._playing);
    return 1;
  });
  lua.lua_setglobal(L, S('__audio_isPlaying'));
  lua.lua_pushjsfunction(L, (L) => { sources[lua.lua_tonumber(L, 1)].loop = lua.lua_toboolean(L, 2); return 0; });
  lua.lua_setglobal(L, S('__audio_setLooping'));
  lua.lua_pushjsfunction(L, (L) => { sources[lua.lua_tonumber(L, 1)].volume = lua.lua_tonumber(L, 2); return 0; });
  lua.lua_setglobal(L, S('__audio_setVolume'));
  lua.lua_pushjsfunction(L, (L) => {
    const a = sources[lua.lua_tonumber(L, 1)];
    try { a.currentTime = 0; } catch (e) {}
    a.play().catch(() => {}); // browser autoplay policy: ignore until first user gesture
    return 0;
  });
  lua.lua_setglobal(L, S('__audio_play'));

  lua.lua_pushjsfunction(L, (L) => {
    const key = lua.lua_tojsstring(L, 1);
    let val = null;
    try { val = localStorage.getItem('keepedup:' + key); } catch (e) {}
    if (val == null) { lua.lua_pushnil(L); return 1; }
    lua.lua_pushstring(L, S(val));
    return 1;
  });
  lua.lua_setglobal(L, S('__fs_read'));
  lua.lua_pushjsfunction(L, (L) => {
    const key = lua.lua_tojsstring(L, 1), val = lua.lua_tojsstring(L, 2);
    try { localStorage.setItem('keepedup:' + key, val); } catch (e) {}
    return 0;
  });
  lua.lua_setglobal(L, S('__fs_write'));

  const mouseState = { x: 0, y: 0, down: false };
  function clientToCanvas(clientX, clientY) {
    const rect = screenCanvas.getBoundingClientRect();
    const sx = screenCanvas.width / rect.width, sy = screenCanvas.height / rect.height;
    return [(clientX - rect.left) * sx, (clientY - rect.top) * sy];
  }
  screenCanvas.addEventListener('mousedown', (e) => {
    const [x, y] = clientToCanvas(e.clientX, e.clientY);
    mouseState.x = x; mouseState.y = y; mouseState.down = true;
    callLoveCallback('mousepressed', () => { lua.lua_pushnumber(L, x); lua.lua_pushnumber(L, y); lua.lua_pushstring(L, S('l')); return 3; });
  });
  window.addEventListener('mouseup', (e) => {
    const [x, y] = clientToCanvas(e.clientX, e.clientY);
    mouseState.down = false;
    callLoveCallback('mousereleased', () => { lua.lua_pushnumber(L, x); lua.lua_pushnumber(L, y); lua.lua_pushstring(L, S('l')); return 3; });
  });
  window.addEventListener('mousemove', (e) => {
    const [x, y] = clientToCanvas(e.clientX, e.clientY);
    mouseState.x = x; mouseState.y = y;
  });
  screenCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const t = e.changedTouches[0];
    const [x, y] = clientToCanvas(t.clientX, t.clientY);
    mouseState.x = x; mouseState.y = y; mouseState.down = true;
    callLoveCallback('mousepressed', () => { lua.lua_pushnumber(L, x); lua.lua_pushnumber(L, y); lua.lua_pushstring(L, S('l')); return 3; });
  }, { passive: false });
  window.addEventListener('touchmove', (e) => {
    const t = e.changedTouches[0];
    const [x, y] = clientToCanvas(t.clientX, t.clientY);
    mouseState.x = x; mouseState.y = y;
  }, { passive: true });
  window.addEventListener('touchend', (e) => {
    const [x, y] = [mouseState.x, mouseState.y];
    mouseState.down = false;
    callLoveCallback('mousereleased', () => { lua.lua_pushnumber(L, x); lua.lua_pushnumber(L, y); lua.lua_pushstring(L, S('l')); return 3; });
  });

  function callLoveCallback(name, pushArgs) {
    lua.lua_getglobal(L, S('love'));
    lua.lua_getfield(L, -1, S(name));
    if (lua.lua_isnil(L, -1)) { lua.lua_pop(L, 2); return; }
    lua.lua_remove(L, -2);
    const nargs = pushArgs ? pushArgs() : 0;
    if (lua.lua_pcall(L, nargs, 0, 0) !== lua.LUA_OK) {
      console.error('Lua callback error (' + name + '):', lua.lua_tojsstring(L, -1));
      lua.lua_pop(L, 1);
    }
  }

  lua.lua_pushjsfunction(L, (L) => { lua.lua_pushboolean(L, mouseState.down); return 1; });
  lua.lua_setglobal(L, S('__mouse_isDown'));
  lua.lua_pushjsfunction(L, (L) => { lua.lua_pushnumber(L, mouseState.x); lua.lua_pushnumber(L, mouseState.y); return 2; });
  lua.lua_setglobal(L, S('__mouse_getPosition'));
  lua.lua_pushjsfunction(L, (L) => { lua.lua_pushnumber(L, mouseState.x); return 1; });
  lua.lua_setglobal(L, S('__mouse_getX'));
  lua.lua_pushjsfunction(L, (L) => { lua.lua_pushnumber(L, mouseState.y); return 1; });
  lua.lua_setglobal(L, S('__mouse_getY'));

  lua.lua_pushjsfunction(L, (L) => { lua.lua_pushnumber(L, performance.now() / 1000); return 1; });
  lua.lua_setglobal(L, S('__timer_getTime'));

  // -----------------------------------------------------------------
  // 2. Lua-side love.* shim: mirrors the real API shape, delegating
  //    numeric/string plumbing to the JS primitives above.
  // -----------------------------------------------------------------
  const LOVE_LUA = `
-- Fengari is Lua 5.3; real LOVE ships LuaJIT/Lua 5.1. Restore what 5.2+
-- removed that this game actually calls (see tools/LOVE2D_WEB_PORTING_GUIDE.md).
math.pow = math.pow or function(x, y) return x ^ y end
math.atan2 = math.atan2 or math.atan
unpack = unpack or table.unpack

-- Lua 5.3's math.random(m, n) requires integer-representable bounds;
-- 5.1 (what real LOVE ships) floors non-integer args instead of erroring.
-- keepedup's spawn code computes float bounds (e.g. from a non-integer
-- Scale factor) and passes them straight to math.random(-w, w).
local __random53 = math.random
math.random = function(m, n)
    if m == nil then return __random53() end
    if n == nil then return __random53(math.floor(m)) end
    return __random53(math.floor(m), math.floor(n))
end

love = {}
love.graphics = {}
love.physics = {}
love.audio = {}
love.filesystem = {}
love.mouse = {}
love.keyboard = {}
love.timer = {}
love.window = {}
love.joystick = {}
love.sound = {}

-- graphics: images/quads/fonts ------------------------------------------
function love.graphics.newImage(path)
    local id, w, h = __gfx_newImage(path)
    local img = { __id = id, __w = w, __h = h }
    function img:getWidth() return self.__w end
    function img:getHeight() return self.__h end
    return img
end

function love.graphics.newQuad(x, y, w, h, sw, sh)
    local id = __gfx_newQuad(x, y, w, h, sw, sh)
    return { __id = id, __isQuad = true }
end

function love.graphics.newFont(path, size)
    local id = __gfx_newFont(path, size)
    local f = { __id = id }
    function f:getWidth(text) return __gfx_fontGetWidth(self.__id, tostring(text)) end
    function f:getHeight() return __gfx_fontGetHeight(self.__id) end
    return f
end

function love.graphics.newImageFont(path, glyphs)
    local id = __gfx_newImageFont(path, glyphs)
    local f = { __id = id }
    function f:getWidth(text) return __gfx_fontGetWidth(self.__id, tostring(text)) end
    function f:getHeight() return __gfx_fontGetHeight(self.__id) end
    return f
end

function love.graphics.setFont(font) __gfx_setFont(font.__id) end
function love.graphics.setDefaultFilter(min, mag) end -- always nearest in this shim

-- graphics: transform / color -------------------------------------------
function love.graphics.push() __gfx_push() end
function love.graphics.pop() __gfx_pop() end
function love.graphics.translate(x, y) __gfx_translate(x, y) end
function love.graphics.scale(sx, sy) __gfx_scale(sx, sy or sx) end
function love.graphics.rotate(r) __gfx_rotate(r) end

function love.graphics.setColor(r, g, b, a) __gfx_setColor(r, g, b, a) end
function love.graphics.setBackgroundColor(r, g, b) __gfx_setBackgroundColor(r, g, b) end
function love.graphics.setBlendMode(mode) __gfx_setBlendMode(mode) end
function love.graphics.setLineWidth(w) __gfx_setLineWidth(w) end

function love.graphics.getWidth() return __gfx_getWidth() end
function love.graphics.getHeight() return __gfx_getHeight() end

-- graphics: drawing -------------------------------------------------------
function love.graphics.rectangle(mode, x, y, w, h) __gfx_rectangle(mode, x, y, w, h) end
function love.graphics.circle(mode, x, y, radius, segments) __gfx_circle(mode, x, y, radius) end

function love.graphics.line(...)
    local points = {...}
    if type(points[1]) == "table" then points = points[1] end
    __gfx_line(unpack(points))
end

-- draw(drawable, [quad,] x, y, r, sx, sy)
function love.graphics.draw(drawable, a, b, c, d, e, f)
    if type(a) == "table" and a.__isQuad then
        __gfx_draw(drawable.__id, a.__id, b or 0, c or 0, d or 0, e or 1, f or e or 1)
    else
        __gfx_draw(drawable.__id, -1, a or 0, b or 0, c or 0, d or 1, e or d or 1)
    end
end

function love.graphics.print(text, x, y, r, sx, sy) __gfx_print(tostring(text), x, y, r, sx, sy) end
function love.graphics.printf(text, x, y, limit, align, r, sx, sy)
    __gfx_printf(tostring(text), x, y, limit, align or "left", r, sx, sy)
end

-- window ------------------------------------------------------------------
function love.window.setMode(w, h) __window_setMode(w, h) end

-- physics -------------------------------------------------------------------
function love.physics.setMeter(m) __phys_setMeter(m) end
function love.physics.getMeter() return __phys_getMeter() end

function love.physics.newCircleShape(radius)
    return { __shape = "circle", radius = radius }
end

function __wrapFixture(id)
    local fx = { __id = id }
    function fx:setSensor(v) __phys_fixtureSetSensor(self.__id, v) end
    function fx:isSensor() return self.__isSensor end
    function fx:setUserData(v) __phys_fixtureSetUserData(self.__id, v) end
    function fx:getUserData() return __phys_fixtureGetUserData(self.__id) end
    function fx:destroy() __phys_fixtureDestroy(self.__id) end
    function fx:rayCast(x1, y1, x2, y2, maxFraction, childIndex)
        return __phys_fixtureRayCast(self.__id, x1, y1, x2, y2, maxFraction or 1)
    end
    return fx
end

function __wrapBody(id)
    local b = { __id = id }
    function b:getAngle() return __phys_bodyGetAngle(self.__id) end
    function b:getPosition() return __phys_bodyGetPosition(self.__id) end
    function b:setPosition(x, y) __phys_bodySetPosition(self.__id, x, y) end
    function b:getLinearVelocity() return __phys_bodyGetLinearVelocity(self.__id) end
    function b:setLinearVelocity(x, y) __phys_bodySetLinearVelocity(self.__id, x, y) end
    function b:isAwake() return __phys_bodyIsAwake(self.__id) end
    function b:setAwake(v) __phys_bodySetAwake(self.__id, v) end
    function b:setMass(m) __phys_bodySetMass(self.__id, m) end
    function b:getMass() return __phys_bodyGetMass(self.__id) end
    function b:applyForce(fx, fy) __phys_bodyApplyForce(self.__id, fx, fy) end
    function b:applyLinearImpulse(ix, iy, x, y) __phys_bodyApplyLinearImpulse(self.__id, ix, iy, x or 0, y or 0) end
    return b
end

function love.physics.newWorld(gx, gy, allowSleep)
    local id = __phys_newWorld(gx, gy, allowSleep)
    local w = { __id = id }
    function w:setCallbacks(beginFn, endFn)
        __phys_setCallbacks(self.__id, { begin = beginFn, end_ = endFn })
    end
    function w:update(dt) __phys_worldUpdate(self.__id, dt) end
    return w
end

function love.physics.newBody(world, x, y, btype)
    local id = __phys_newBody(world.__id, x, y, btype)
    return __wrapBody(id)
end

function love.physics.newFixture(body, shape, density)
    local id = __phys_newFixture(body.__id, shape.radius, density or 1)
    return __wrapFixture(id)
end

-- audio ---------------------------------------------------------------------
function love.audio.newSource(path)
    local id = __audio_newSource(path)
    local s = { __id = id }
    function s:isPlaying(v) __audio_isPlaying(self.__id) end
    function s:setLooping(v) __audio_setLooping(self.__id, v) end
    function s:setVolume(v) __audio_setVolume(self.__id, v) end
    return s
end
function love.audio.play(source) __audio_play(source.__id) end

-- filesystem ------------------------------------------------------------
function love.filesystem.read(path) return __fs_read(path) end
function love.filesystem.write(path, contents) __fs_write(path, contents) end

-- mouse / keyboard / timer / joystick ------------------------------------
function love.mouse.isDown(btn) return __mouse_isDown() end
function love.mouse.getPosition() return __mouse_getPosition() end
function love.mouse.getX() return __mouse_getX() end
function love.mouse.getY() return __mouse_getY() end
function love.keyboard.setTextInput(v) end -- text-input UI not implemented in this port
function love.timer.getTime() return __timer_getTime() end
function love.joystick.getJoystickCount() return 0 end
function love.joystick.getJoysticks() return {} end
`;

  luaRun(L, LOVE_LUA, 'love-shim.lua');

  // -----------------------------------------------------------------
  // 3. Preload the game's Lua modules (unmodified), then run main.lua.
  //    keepedup has no conf.lua/boot.lua -- main.lua itself calls
  //    love.window.setMode, so canvas sizing happens as a side effect
  //    of running it, same as real LOVE's boot sequence.
  // -----------------------------------------------------------------
  const modules = [
    ['libs.sunclass', 'libs/sunclass.lua'],
    ['libs.math2d', 'libs/math2d.lua'],
    ['libs.easing', 'libs/easing.lua'],
    ['libs.easingex', 'libs/easingex.lua'],
    ['spritesheet', 'spritesheet.lua'],
    ['ball', 'ball.lua'],
    ['coin', 'coin.lua'],
    ['bomb', 'bomb.lua'],
    ['cat', 'cat.lua'],
    ['menu', 'menu.lua'],
    ['particle', 'particle.lua'],
    ['scoreparticle', 'scoreparticle.lua'],
    ['laserparticle', 'laserparticle.lua'],
    ['coinparticle', 'coinparticle.lua'],
    ['game', 'game.lua'],
  ];
  for (const [name, path] of modules) {
    registerPreload(L, name, await fetchText(rootPath + path));
  }

  const mainSrc = await fetchText(rootPath + 'main.lua');
  luaRun(L, mainSrc, 'main.lua');

  // -----------------------------------------------------------------
  // 4. Default LOVE run loop: love.load() once, then love.update/
  //    love.graphics.clear/love.draw every requestAnimationFrame tick.
  // -----------------------------------------------------------------
  callLoveCallback('load', () => { lua.lua_newtable(L); return 1; });

  let last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    callLoveCallback('update', () => { lua.lua_pushnumber(L, dt); return 1; });
    // clear to current background color (real LOVE's default run loop clears before draw)
    lua.lua_getglobal(L, S('__gfx_clear'));
    lua.lua_call(L, 0, 0);
    callLoveCallback('draw');
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

window.bootKeepedUp = boot;
