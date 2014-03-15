var MAXSAMPLES, STAGE_LOBBY, STAGE_PLAYING, a, baseObject, button, calcAvgTick, canvas, click, enemy, explosion, g, game, input, lastRenderTime, lasttime, missile, point, render, samples, stage, think, tickindex, ticklist, ticksum;

game = require("./game");

point = require("./point");

g = require("./globals");

input = require("./input");

baseObject = require("./objects/baseObject");

enemy = require("./objects/enemy");

explosion = require("./objects/explosion");

missile = require("./objects/missile");

button = require("./objects/button");

require("./math");

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
    return window.setTimeout(callback, 1000 / 60);
  };
})();

a = 10;

MAXSAMPLES = 100;

samples = 0;

tickindex = 0;

ticksum = 0;

ticklist = [];

calcAvgTick = function(newtick) {
  ticklist[tickindex] = ticklist[tickindex] || 0;
  ticksum -= ticklist[tickindex];
  ticksum += newtick;
  ticklist[tickindex] = newtick;
  tickindex++;
  if (tickindex === MAXSAMPLES) {
    tickindex = 0;
  }
  if (samples < MAXSAMPLES) {
    samples++;
    return 0;
  }
  return ticksum / MAXSAMPLES;
};

canvas = $("#canvas");

lasttime = g.time;

lastRenderTime = null;

STAGE_LOBBY = 0;

STAGE_PLAYING = 1;

stage = STAGE_LOBBY;

click = function() {
  return game.click();
};

think = function() {
  var object, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4;
  g.time = (new Date()).getTime();
  g.delta = g.time - lasttime;
  lasttime = g.time;
  _ref = g.objectlist.backdrop;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    object = _ref[_i];
    if (object != null) {
      object.think();
    }
  }
  _ref1 = g.objectlist.enemy;
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    object = _ref1[_j];
    if (object != null) {
      object.think();
    }
  }
  _ref2 = g.objectlist.player;
  for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
    object = _ref2[_k];
    if (object != null) {
      object.think();
    }
  }
  _ref3 = g.objectlist.gui;
  for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
    object = _ref3[_l];
    if (object != null) {
      object.think();
    }
  }
  _ref4 = g.toremove;
  for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
    object = _ref4[_m];
    object._remove();
  }
  g.toremove.length = 0;
  if (input.mouseDown && !input.lastMouseDown) {
    game.click();
  }
  game.think();
  return input.think();
};

render = function(time) {
  var delta;
  delta = 0;
  if (lastRenderTime) {
    delta = time - lastRenderTime;
  }
  game.render(delta);
  requestAnimFrame(render);
  return lastRenderTime = time;
};

setInterval(think, 0);

render(0);

input.setThink(think);

game.initialize();
