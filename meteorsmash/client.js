var MAXSAMPLES, Point, STAGE_LOBBY, STAGE_PLAYING, baseObject, button, calcAvgTick, canvas, delta, difficulty, enemy, explosion, initialize, lastScore, lasttime, lives, missile, missileFired, mouseDown, mouseX, mouseY, nextspawn, objectlist, origin, point, samples, score, spawnthink, stage, startButton, think, tickindex, ticklist, ticksum, time, toremove,
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

mouseDown = false;

time = (new Date()).getTime();

lasttime = time;

delta = 0;

objectlist = [];

toremove = [];

difficulty = 0;

score = 0;

lives = 3;

lastScore = null;

STAGE_LOBBY = 0;

STAGE_PLAYING = 1;

stage = STAGE_LOBBY;

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

Math.randD = function(a, b) {
  var c;
  c = a;
  if (b > a) {
    c = b;
    b = a;
  }
  return b + Math.random() * (c - b);
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

  enemy.prototype.speed = 0.05;

  enemy.prototype.initialize = function() {
    return this.speed = 0.05 + difficulty / 100;
  };

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
    pos = this.getPos().add((this.target.sub(this.getPos())).norm().mul(delta * this.speed));
    this.setPos(pos);
    if (delta * this.speed > this.getPos().distance(this.target)) {
      z = new explosion;
      z.setPos(this.getPos());
      this.remove();
      lives--;
      if (lives < 1) {
        lastScore = score;
        return initialize();
      }
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

missileFired = false;

missile = (function(_super) {

  __extends(missile, _super);

  function missile() {
    return missile.__super__.constructor.apply(this, arguments);
  }

  missile.prototype.speed = 0.15;

  missile.prototype.initialize = function() {
    return this.speed = 0.15 + difficulty / 75;
  };

  missile.prototype.setTarget = function(target) {
    return this.target = target;
  };

  missile.prototype.think = function() {
    var pos, z;
    pos = this.getPos().add((this.target.sub(this.getPos())).norm().mul(delta * this.speed));
    this.setPos(pos);
    if (delta * this.speed > this.getPos().distance(this.target)) {
      z = new explosion;
      z.radius = 500;
      z.setPos(this.getPos());
      missileFired = false;
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

  explosion.prototype.radius = 250;

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
          score++;
        }
      }
    }
    if ((time - this.timestamp) > this.radius) {
      return this.remove();
    }
  };

  explosion.prototype.render = function() {
    var a;
    a = Math.round(255 * (time - this.timestamp) / this.radius);
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

button = (function(_super) {

  __extends(button, _super);

  function button() {
    return button.__super__.constructor.apply(this, arguments);
  }

  button.prototype.speed = 0.05;

  button.prototype.hovered = false;

  button.prototype.width = 100;

  button.prototype.height = 100;

  button.prototype.lastMouseDown = false;

  button.prototype.clicking = false;

  button.prototype.text = 'Nothing';

  button.prototype.initialize = function() {};

  button.prototype.setText = function(text) {
    return this.text = text;
  };

  button.prototype.remove = function() {
    return button.__super__.remove.apply(this, arguments);
  };

  button.prototype.think = function() {
    this.hovered = !(mouseX < this.x || mouseY < this.y || mouseX > this.x + this.width || mouseY > this.y + this.height);
    if (this.hovered) {
      canvas.css('cursor', 'pointer');
    } else {
      canvas.css('cursor', 'auto');
    }
    if (this.hovered && mouseDown && !this.lastMouseDown) {
      this.clicking = true;
    }
    if (!mouseDown) {
      if (this.clicking && this.hovered) {
        this.onclick();
      }
      this.clicking = false;
    }
    return this.lastMouseDown = mouseDown;
  };

  button.prototype.onclick = function() {
    return canvas.css('cursor', 'auto');
  };

  button.prototype.render = function() {
    var fill;
    fill = "#555555";
    if (this.hovered) {
      fill = "#888888";
      if (mouseDown) {
        fill = "#333333";
      }
    }
    return canvas.drawRect({
      fillStyle: fill,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      fromCenter: false
    }).drawText({
      fillStyle: "#FFF",
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
      font: "14px sans-serif",
      text: this.text,
      fromCenter: true
    });
  };

  return button;

})(baseObject);

think = function() {
  var object, text, _i, _j, _k, _len, _len1, _len2;
  time = (new Date()).getTime();
  delta = time - lasttime;
  lasttime = time;
  for (_i = 0, _len = objectlist.length; _i < _len; _i++) {
    object = objectlist[_i];
    if (object != null) {
      object.think();
    }
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
  if (stage === STAGE_PLAYING) {
    canvas.drawText({
      fillStyle: "#000",
      x: 200,
      y: 10,
      font: "12px Arial, sans-serif",
      text: "Lives: " + lives
    }).drawText({
      fillStyle: "#000",
      x: 100,
      y: 10,
      font: "12px Arial, sans-serif",
      text: "Score: " + score
    }).drawRect({
      fillStyle: "#000",
      x: 0,
      y: 350,
      width: 400,
      height: 50,
      fromCenter: false
    });
    difficulty += delta / 10000;
    spawnthink();
  } else {
    canvas.drawText({
      fillStyle: "#000",
      x: 200,
      y: 10,
      font: "16px Arial, sans-serif",
      text: "Defend the Earth from asteroids!"
    }).drawText({
      fillStyle: "#000",
      x: 200,
      y: 26,
      font: "12px Arial, sans-serif",
      text: "Use the left mouse button and shoot down the asteroids"
    }).drawText({
      fillStyle: "#000",
      x: 200,
      y: 39,
      font: "12px Arial, sans-serif",
      text: "before they fall!"
    });
    if (lastScore !== null) {
      text = "Uh, you scored " + lastScore + " points...";
      if (lastScore > 5) {
        text = "Cool, you scored " + lastScore + " points...";
      }
      if (lastScore > 10) {
        text = "Whoa! You scored " + lastScore + " points!";
      }
      if (lastScore > 25) {
        text = "Awesome! You scored " + lastScore + " points!";
      }
      if (lastScore > 50) {
        text = "HOLY SHIT! You scored " + lastScore + " points!";
      }
      if (lastScore > 100) {
        text = "you gotta be cheating now; " + lastScore + " points?";
      }
      canvas.drawText({
        fillStyle: "#000",
        weight: "bold",
        x: 200,
        y: 100,
        font: "18px Arial, sans-serif",
        text: text
      });
    }
  }
  return toremove = [];
};

nextspawn = 0;

spawnthink = function() {
  var e, _ref;
  if (time > nextspawn) {
    nextspawn = time + 2000 - ((_ref = difficulty > 7.5) != null ? _ref : {
      1500: difficulty * 200
    });
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
  if (stage === STAGE_PLAYING) {
    if (!missileFired) {
      z = new missile();
      z.setTarget(point(e.offsetX, e.offsetY));
      z.setPos(point(200, 350));
      return missileFired = true;
    }
  }
}).mousedown(function(e) {
  console.log(e.offsetX);
  mouseX = e.offsetX;
  mouseDown = true;
  return think();
}).mouseup(function(e) {
  mouseY = e.offsetY;
  mouseDown = false;
  return think();
});

startButton = null;

initialize = function() {
  nextspawn = 0;
  objectlist = [];
  toremove = [];
  stage = STAGE_LOBBY;
  startButton = new button();
  startButton.setText("Play");
  startButton.setPos(point(150, 150));
  startButton.onclick = function() {
    stage = STAGE_PLAYING;
    startButton.remove();
    return canvas.css('cursor', 'auto');
  };
  difficulty = 0;
  score = 0;
  lives = 3;
  return missileFired = false;
};

initialize();
