// Minimal LOVE2D-compatible runtime shim, implementing just the subset of
// the love.* API that djarlum-love's unmodified .lua files call:
//
//   love.graphics: newCanvas, getWidth/getHeight, setColor, clear,
//                  setCanvas, rectangle, circle, line, draw
//   love.keyboard: isDown
//   love.run       (drives love.load/update/draw off requestAnimationFrame)
//
// Runs the game's real Lua source through Fengari (a Lua VM compiled to
// JS) — nothing in boot.lua/conf.lua/main.lua/enemies.lua/gameover.lua/
// font.lua/easing.lua is rewritten or transpiled. Low-level drawing calls
// are delegated to plain Canvas2D via a handful of __gfx_*/__kbd_*
// globals that the Lua-side love.lua shim (below, injected as a Lua
// string) calls into.
'use strict';

const { lua, lauxlib, lualib, to_luastring, to_jsstring } = fengari;

function luaRun(L, src, chunkname) {
  if (lauxlib.luaL_loadstring(L, to_luastring(src)) !== lua.LUA_OK) {
    throw new Error('Lua load error (' + chunkname + '): ' + lua.lua_tojsstring(L, -1));
  }
  if (lua.lua_pcall(L, 0, lua.LUA_MULTRET, 0) !== lua.LUA_OK) {
    throw new Error('Lua runtime error (' + chunkname + '): ' + lua.lua_tojsstring(L, -1));
  }
}

// The Lua-side half of the shim: defines the `love` global table and
// wires each function straight through to a __gfx_/__kbd_ JS primitive.
// Kept in Lua (not JS) so the *game* code never has to know the runtime
// underneath it isn't real LOVE.
const LOVE_LUA = `
-- Fengari is Lua 5.3; real LOVE ships LuaJIT/Lua 5.1, which still has
-- these two math functions removed from 5.3. djarlum's enemies.lua /
-- easing.lua call both (math.pow in several enemy paths, math.atan2 in
-- the "seeker" enemy) -- without this shim they're nil and the game
-- freezes solid the moment one of those code paths first runs.
math.pow = math.pow or function(x, y) return x ^ y end
math.atan2 = math.atan2 or math.atan

love = {}
love.graphics = {}
love.keyboard = {}
love.timer = {}
love.window = {}

function love.graphics.newCanvas(w, h)
    local id = __gfx_newCanvas(w, h)
    local c = { __id = id, __w = w, __h = h }
    function c:setFilter(min, mag) end
    function c:getWidth() return self.__w end
    function c:getHeight() return self.__h end
    return c
end

function love.graphics.getWidth() return __gfx_getWidth() end
function love.graphics.getHeight() return __gfx_getHeight() end

function love.graphics.setColor(r, g, b, a)
    __gfx_setColor(r, g, b, a or 255)
end

function love.graphics.clear()
    __gfx_clear()
end

function love.graphics.setCanvas(c)
    if c then __gfx_setCanvas(c.__id) else __gfx_setCanvas(-1) end
end

function love.graphics.rectangle(mode, x, y, w, h)
    __gfx_rectangle(mode, x, y, w, h)
end

function love.graphics.circle(mode, x, y, radius, segments)
    __gfx_circle(mode, x, y, radius)
end

function love.graphics.line(...)
    local points = {...}
    if type(points[1]) == "table" then points = points[1] end
    for i = 1, #points - 3, 2 do
        __gfx_line(points[i], points[i+1], points[i+2], points[i+3])
    end
end

function love.graphics.draw(c, x, y, r, sx, sy)
    __gfx_draw(c.__id, x or 0, y or 0, r or 0, sx or 1, sy or sx or 1)
end

function love.keyboard.isDown(key)
    return __kbd_isDown(key)
end

function love.timer.getDelta()
    return __timer_delta or 0
end

-- Default LOVE run loop: love.load once, then love.update/love.draw every
-- frame, driven from the browser side (Lua can't block on requestAnimationFrame).
function love.run()
    if love.load then love.load(arg or {}) end
    __set_frame_callback(function(dt)
        __timer_delta = dt
        if love.update then love.update(dt) end
        love.graphics.setCanvas()
        love.graphics.clear()
        if love.draw then love.draw() end
    end)
end
`;

async function fetchText(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error('Failed to fetch ' + path + ': ' + res.status);
  return res.text();
}

function registerPreload(L, name, src) {
  // package.preload[name] = load(src, name)
  lua.lua_getglobal(L, to_luastring('package'));
  lua.lua_getfield(L, -1, to_luastring('preload'));
  if (lauxlib.luaL_loadstring(L, to_luastring(src)) !== lua.LUA_OK) {
    throw new Error('Lua load error (' + name + '): ' + lua.lua_tojsstring(L, -1));
  }
  lua.lua_setfield(L, -2, to_luastring(name));
  lua.lua_pop(L, 2); // pop package, preload
}

async function boot(rootPath, screenCanvas) {
  const L = lauxlib.luaL_newstate();
  lualib.luaL_openlibs(L);

  // --- graphics state -----------------------------------------------
  const screenCtx = screenCanvas.getContext('2d');
  screenCtx.imageSmoothingEnabled = false;
  const canvasList = []; // JS <canvas> objects, indexed by __gfx_newCanvas id
  let currentCtx = screenCtx;
  let currentColor = 'rgba(255,255,255,1)';

  function ctxFor(id) {
    return id < 0 ? screenCtx : canvasList[id].getContext('2d');
  }

  lua.lua_pushjsfunction(L, (L) => {
    const w = lua.lua_tonumber(L, 1);
    const h = lua.lua_tonumber(L, 2);
    const el = document.createElement('canvas');
    el.width = w;
    el.height = h;
    const ctx = el.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    canvasList.push(el);
    lua.lua_pushnumber(L, canvasList.length - 1);
    return 1;
  });
  lua.lua_setglobal(L, to_luastring('__gfx_newCanvas'));

  lua.lua_pushjsfunction(L, (L) => {
    lua.lua_pushnumber(L, screenCanvas.width);
    return 1;
  });
  lua.lua_setglobal(L, to_luastring('__gfx_getWidth'));

  lua.lua_pushjsfunction(L, (L) => {
    lua.lua_pushnumber(L, screenCanvas.height);
    return 1;
  });
  lua.lua_setglobal(L, to_luastring('__gfx_getHeight'));

  lua.lua_pushjsfunction(L, (L) => {
    const r = lua.lua_tonumber(L, 1);
    const g = lua.lua_tonumber(L, 2);
    const b = lua.lua_tonumber(L, 3);
    const a = lua.lua_tonumber(L, 4);
    currentColor = `rgba(${r | 0},${g | 0},${b | 0},${a / 255})`;
    currentCtx.fillStyle = currentColor;
    currentCtx.strokeStyle = currentColor;
    return 0;
  });
  lua.lua_setglobal(L, to_luastring('__gfx_setColor'));

  lua.lua_pushjsfunction(L, (L) => {
    currentCtx.fillStyle = 'rgba(0,0,0,1)';
    currentCtx.fillRect(0, 0, currentCtx.canvas.width, currentCtx.canvas.height);
    currentCtx.fillStyle = currentColor;
    return 0;
  });
  lua.lua_setglobal(L, to_luastring('__gfx_clear'));

  lua.lua_pushjsfunction(L, (L) => {
    const id = lua.lua_tonumber(L, 1);
    currentCtx = ctxFor(id);
    currentCtx.fillStyle = currentColor;
    currentCtx.strokeStyle = currentColor;
    return 0;
  });
  lua.lua_setglobal(L, to_luastring('__gfx_setCanvas'));

  lua.lua_pushjsfunction(L, (L) => {
    const mode = lua.lua_tojsstring(L, 1);
    const x = lua.lua_tonumber(L, 2);
    const y = lua.lua_tonumber(L, 3);
    const w = lua.lua_tonumber(L, 4);
    const h = lua.lua_tonumber(L, 5);
    if (mode === 'line') currentCtx.strokeRect(x, y, w, h);
    else currentCtx.fillRect(x, y, w, h);
    return 0;
  });
  lua.lua_setglobal(L, to_luastring('__gfx_rectangle'));

  lua.lua_pushjsfunction(L, (L) => {
    const mode = lua.lua_tojsstring(L, 1);
    const x = lua.lua_tonumber(L, 2);
    const y = lua.lua_tonumber(L, 3);
    const radius = lua.lua_tonumber(L, 4);
    currentCtx.beginPath();
    currentCtx.arc(x, y, radius, 0, Math.PI * 2);
    if (mode === 'line') currentCtx.stroke();
    else currentCtx.fill();
    return 0;
  });
  lua.lua_setglobal(L, to_luastring('__gfx_circle'));

  lua.lua_pushjsfunction(L, (L) => {
    const x1 = lua.lua_tonumber(L, 1);
    const y1 = lua.lua_tonumber(L, 2);
    const x2 = lua.lua_tonumber(L, 3);
    const y2 = lua.lua_tonumber(L, 4);
    currentCtx.beginPath();
    currentCtx.moveTo(x1, y1);
    currentCtx.lineTo(x2, y2);
    currentCtx.stroke();
    return 0;
  });
  lua.lua_setglobal(L, to_luastring('__gfx_line'));

  lua.lua_pushjsfunction(L, (L) => {
    const id = lua.lua_tonumber(L, 1);
    const x = lua.lua_tonumber(L, 2);
    const y = lua.lua_tonumber(L, 3);
    // rotation (arg 4) is unused by this game; only scale matters.
    const sx = lua.lua_tonumber(L, 5);
    const sy = lua.lua_tonumber(L, 6);
    const src = canvasList[id];
    currentCtx.imageSmoothingEnabled = false;
    currentCtx.drawImage(src, 0, 0, src.width, src.height, x, y, src.width * sx, src.height * sy);
    return 0;
  });
  lua.lua_setglobal(L, to_luastring('__gfx_draw'));

  // --- keyboard --------------------------------------------------------
  const keysDown = new Set();
  function loveKeyName(e) {
    if (e.key === ' ') return ' ';
    if (e.key === 'ArrowLeft') return 'left';
    if (e.key === 'ArrowRight') return 'right';
    if (e.key === 'ArrowUp') return 'up';
    if (e.key === 'ArrowDown') return 'down';
    return e.key.length === 1 ? e.key.toLowerCase() : e.key.toLowerCase();
  }
  window.addEventListener('keydown', (e) => {
    keysDown.add(loveKeyName(e));
    if (e.key === ' ' || e.key.startsWith('Arrow')) e.preventDefault();
  });
  window.addEventListener('keyup', (e) => {
    keysDown.delete(loveKeyName(e));
  });

  lua.lua_pushjsfunction(L, (L) => {
    const key = lua.lua_tojsstring(L, 1);
    lua.lua_pushboolean(L, keysDown.has(key));
    return 1;
  });
  lua.lua_setglobal(L, to_luastring('__kbd_isDown'));

  // --- frame loop --------------------------------------------------------
  let frameCallbackRef = null;
  lua.lua_pushjsfunction(L, (L) => {
    frameCallbackRef = lauxlib.luaL_ref(L, lua.LUA_REGISTRYINDEX);
    return 0;
  });
  lua.lua_setglobal(L, to_luastring('__set_frame_callback'));

  // --- load the Lua-side love.* shim -----------------------------------
  luaRun(L, LOVE_LUA, 'love-shim.lua');

  // --- read conf.lua to size the canvas, exactly like real LOVE boot ---
  const confSrc = await fetchText(rootPath + 'conf.lua');
  luaRun(L, confSrc, 'conf.lua');
  luaRun(
    L,
    `
    __conf_width, __conf_height = 800, 600
    if love.conf then
        local t = { window = { width = 800, height = 600 } }
        love.conf(t)
        __conf_width, __conf_height = t.window.width, t.window.height
    end
  `,
    'conf-apply'
  );
  lua.lua_getglobal(L, to_luastring('__conf_width'));
  lua.lua_getglobal(L, to_luastring('__conf_height'));
  const confW = lua.lua_tonumber(L, -2);
  const confH = lua.lua_tonumber(L, -1);
  lua.lua_pop(L, 2);
  screenCanvas.width = confW;
  screenCanvas.height = confH;
  screenCtx.imageSmoothingEnabled = false;

  // --- preload the game's other modules, unmodified ---------------------
  for (const name of ['enemies', 'gameover', 'font', 'easing', 'main']) {
    const src = await fetchText(rootPath + name + '.lua');
    registerPreload(L, name, src);
  }

  // --- boot.lua does `require("main"); love.run()` ----------------------
  const bootSrc = await fetchText(rootPath + 'boot.lua');
  luaRun(L, bootSrc, 'boot.lua');

  // --- drive the frame callback love.run() registered -------------------
  let last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.25);
    last = now;
    if (frameCallbackRef !== null) {
      lua.lua_rawgeti(L, lua.LUA_REGISTRYINDEX, frameCallbackRef);
      lua.lua_pushnumber(L, dt);
      if (lua.lua_pcall(L, 1, 0, 0) !== lua.LUA_OK) {
        console.error('Lua frame error:', lua.lua_tojsstring(L, -1));
        return; // stop the loop on error so it's visible in devtools
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

window.bootDjarlum = boot;
