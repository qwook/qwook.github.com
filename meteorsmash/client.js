var MAXSAMPLES, Point, baseObject, calcAvgTick, canvas, delta, enemy, explosion, lasttime, missile, mouseX, mouseY, nextspawn, objectlist, origin, point, samples, spawnthink, think, tickindex, ticklist, ticksum, time, toremove,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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

mouseX = 0;

mouseY = 0;

time = (new Date()).getTime();

lasttime = 0;

delta = 0;

objectlist = [];

toremove = [];

Point = (function() {

  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  Point.prototype.add = function(b) {
    return new Point(this.x + b.x, this.y + b.y);
  };

  Point.prototype.sub = function(b) {
    return new Point(this.x - b.x, this.y - b.y);
  };

  Point.prototype.mul = function(b) {
    if (typeof b === "number") {
      return new Point(this.x * b, this.y * b);
    } else {
      return new Point(this.x * b.x, this.y * b.y);
    }
  };

  Point.prototype.div = function(b) {
    if (typeof b === "number") {
      return new Point(this.x / b, this.y / b);
    } else {
      return new Point(this.x / b.x, this.y / b.y);
    }
  };

  Point.prototype.distance = function(b) {
    return Math.sqrt(Math.pow(b.x - this.x, 2) + Math.pow(b.y - this.y, 2));
  };

  Point.prototype.norm = function() {
    return this.div(this.distance(origin));
  };

  return Point;

})();

point = function(x, y) {
  return new Point(x, y);
};

origin = point(0, 0);

Math.rand = function(a, b) {
  var c;
  c = a;
  if (b > a) {
    c = b;
    b = a;
  }
  return b + Math.round(Math.random() * (c - b));
};

baseObject = (function() {

  function baseObject() {
    objectlist.push(this);
    this.timestamp = time;
    this.initialize();
  }

  baseObject.prototype.initialize = function() {};

  baseObject.prototype.think = function() {};

  baseObject.prototype.render = function() {
    return canvas.drawArc({
      fillStyle: "black",
      x: this.x,
      y: this.y,
      radius: 4
    });
  };

  baseObject.prototype.remove = function() {
    if (toremove.indexOf(this) < 0) {
      return toremove.push(this);
    }
  };

  baseObject.prototype._remove = function() {
    objectlist.splice(objectlist.indexOf(this), 1);
    return delete this;
  };

  baseObject.prototype.x = 0;

  baseObject.prototype.y = 0;

  baseObject.prototype.setPos = function(point, b) {
    if (typeof point === "object") {
      this.x = point.x;
      return this.y = point.y;
    } else {
      this.x = point;
      return this.y = b;
    }
  };

  baseObject.prototype.getPos = function() {
    return point(this.x, this.y);
  };

  return baseObject;

})();

enemy = (function(_super) {

  __extends(enemy, _super);

  function enemy() {
    return enemy.__super__.constructor.apply(this, arguments);
  }

  enemy.prototype.isEnemy = true;

  enemy.prototype.setOrigin = function(origin) {
    this.origin = origin;
    return this.setPos(origin);
  };

  enemy.prototype.setTarget = function(target) {
    return this.target = target;
  };

  enemy.prototype.think = function() {
    var pos, z;
    pos = this.getPos().add((this.target.sub(this.getPos())).norm().mul(delta * 0.05));
    this.setPos(pos);
    if (delta * 0.15 > this.getPos().distance(this.target)) {
      z = new explosion;
      z.setPos(this.getPos());
      return this.remove();
    }
  };

  enemy.prototype.render = function() {
    canvas.drawLine({
      strokeStyle: "silver",
      strokeWidth: 1,
      x1: this.x,
      y1: this.y,
      x2: this.origin.x,
      y2: this.origin.y
    });
    return enemy.__super__.render.apply(this, arguments);
  };

  return enemy;

})(baseObject);

missile = (function(_super) {

  __extends(missile, _super);

  function missile() {
    return missile.__super__.constructor.apply(this, arguments);
  }

  missile.prototype.setTarget = function(target) {
    return this.target = target;
  };

  missile.prototype.think = function() {
    var pos, z;
    pos = this.getPos().add((this.target.sub(this.getPos())).norm().mul(delta * 0.15));
    this.setPos(pos);
    if (delta * 0.15 > this.getPos().distance(this.target)) {
      z = new explosion;
      z.setPos(this.getPos());
      return this.remove();
    }
  };

  return missile;

})(baseObject);

explosion = (function(_super) {

  __extends(explosion, _super);

  function explosion() {
    return explosion.__super__.constructor.apply(this, arguments);
  }

  explosion.prototype.initialize = function() {};

  explosion.prototype.think = function() {
    var e, z, _i, _len;
    for (_i = 0, _len = objectlist.length; _i < _len; _i++) {
      e = objectlist[_i];
      if (e.isEnemy != null) {
        if (e.getPos().distance(this.getPos()) <= (time - this.timestamp) / 10) {
          z = new explosion;
          z.setPos(e.getPos());
          e.remove();
        }
      }
    }
    if ((time - this.timestamp) > 250) {
      return this.remove();
    }
  };

  explosion.prototype.render = function() {
    var a;
    a = Math.round(255 * (time - this.timestamp) / 250);
    return canvas.drawArc({
      strokeStyle: "rgb(255 , " + a + ", " + a + ")",
      strokeWidth: 2,
      x: this.x,
      y: this.y,
      radius: (time - this.timestamp) / 10
    });
  };

  return explosion;

})(baseObject);

think = function() {
  var object, _i, _j, _k, _len, _len1, _len2;
  time = (new Date()).getTime();
  delta = time - lasttime;
  lasttime = time;
  for (_i = 0, _len = objectlist.length; _i < _len; _i++) {
    object = objectlist[_i];
    object.think();
  }
  canvas.clearCanvas();
  for (_j = 0, _len1 = objectlist.length; _j < _len1; _j++) {
    object = objectlist[_j];
    object.render();
  }
  for (_k = 0, _len2 = toremove.length; _k < _len2; _k++) {
    object = toremove[_k];
    object._remove();
  }
  canvas.drawText({
    fillStyle: "#9cf",
    strokeStyle: "#25a",
    strokeWidth: 2,
    x: 250,
    y: 10,
    font: "15px Arial, sans-serif",
    text: calcAvgTick(delta * 2)
  }).drawRect({
    fillStyle: "#000",
    x: 0,
    y: 350,
    width: 400,
    height: 50,
    fromCenter: false
  });
  spawnthink();
  return toremove = [];
};

nextspawn = 0;

spawnthink = function() {
  var e;
  if (time > nextspawn) {
    nextspawn = time + 1000;
    e = new enemy();
    e.setTarget(point(Math.rand(0, 400), 350));
    return e.setOrigin(point(Math.rand(0, 400), -10));
  }
};

setInterval(think, 0);

canvas.mousemove(function(e) {
  mouseX = e.offsetX;
  return mouseY = e.offsetY;
}).click(function(e) {
  var z;
  z = new missile();
  z.setTarget(point(e.offsetX, e.offsetY));
  return z.setPos(point(200, 350));
});
