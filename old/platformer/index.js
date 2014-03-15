(function(){var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var cached = require.cache[resolved];
    var res = cached? cached.exports : mod();
    return res;
}

require.paths = [];
require.modules = {};
require.cache = {};
require.extensions = [".js",".coffee"];

require._core = {
    'assert': true,
    'events': true,
    'fs': true,
    'path': true,
    'vm': true
};

require.resolve = (function () {
    return function (x, cwd) {
        if (!cwd) cwd = '/';
        
        if (require._core[x]) return x;
        var path = require.modules.path();
        cwd = path.resolve('/', cwd);
        var y = cwd || '/';
        
        if (x.match(/^(?:\.\.?\/|\/)/)) {
            var m = loadAsFileSync(path.resolve(y, x))
                || loadAsDirectorySync(path.resolve(y, x));
            if (m) return m;
        }
        
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
        
        throw new Error("Cannot find module '" + x + "'");
        
        function loadAsFileSync (x) {
            x = path.normalize(x);
            if (require.modules[x]) {
                return x;
            }
            
            for (var i = 0; i < require.extensions.length; i++) {
                var ext = require.extensions[i];
                if (require.modules[x + ext]) return x + ext;
            }
        }
        
        function loadAsDirectorySync (x) {
            x = x.replace(/\/+$/, '');
            var pkgfile = path.normalize(x + '/package.json');
            if (require.modules[pkgfile]) {
                var pkg = require.modules[pkgfile]();
                var b = pkg.browserify;
                if (typeof b === 'object' && b.main) {
                    var m = loadAsFileSync(path.resolve(x, b.main));
                    if (m) return m;
                }
                else if (typeof b === 'string') {
                    var m = loadAsFileSync(path.resolve(x, b));
                    if (m) return m;
                }
                else if (pkg.main) {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                }
            }
            
            return loadAsFileSync(x + '/index');
        }
        
        function loadNodeModulesSync (x, start) {
            var dirs = nodeModulesPathsSync(start);
            for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                var m = loadAsFileSync(dir + '/' + x);
                if (m) return m;
                var n = loadAsDirectorySync(dir + '/' + x);
                if (n) return n;
            }
            
            var m = loadAsFileSync(x);
            if (m) return m;
        }
        
        function nodeModulesPathsSync (start) {
            var parts;
            if (start === '/') parts = [ '' ];
            else parts = path.normalize(start).split('/');
            
            var dirs = [];
            for (var i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === 'node_modules') continue;
                var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
                dirs.push(dir);
            }
            
            return dirs;
        }
    };
})();

require.alias = function (from, to) {
    var path = require.modules.path();
    var res = null;
    try {
        res = require.resolve(from + '/package.json', '/');
    }
    catch (err) {
        res = require.resolve(from, '/');
    }
    var basedir = path.dirname(res);
    
    var keys = (Object.keys || function (obj) {
        var res = [];
        for (var key in obj) res.push(key);
        return res;
    })(require.modules);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.slice(0, basedir.length + 1) === basedir + '/') {
            var f = key.slice(basedir.length);
            require.modules[to + f] = require.modules[basedir + f];
        }
        else if (key === basedir) {
            require.modules[to] = require.modules[basedir];
        }
    }
};

(function () {
    var process = {};
    
    require.define = function (filename, fn) {
        if (require.modules.__browserify_process) {
            process = require.modules.__browserify_process();
        }
        
        var dirname = require._core[filename]
            ? ''
            : require.modules.path().dirname(filename)
        ;
        
        var require_ = function (file) {
            return require(file, dirname);
        };
        require_.resolve = function (name) {
            return require.resolve(name, dirname);
        };
        require_.modules = require.modules;
        require_.define = require.define;
        require_.cache = require.cache;
        var module_ = { exports : {} };
        
        require.modules[filename] = function () {
            require.cache[filename] = module_;
            fn.call(
                module_.exports,
                require_,
                module_,
                module_.exports,
                dirname,
                filename,
                process
            );
            return module_.exports;
        };
    };
})();


require.define("path",function(require,module,exports,__dirname,__filename,process){function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};
});

require.define("__browserify_process",function(require,module,exports,__dirname,__filename,process){var process = module.exports = {};

process.nextTick = (function () {
    var queue = [];
    var canPost = typeof window !== 'undefined'
        && window.postMessage && window.addEventListener
    ;
    
    if (canPost) {
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'browserify-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);
    }
    
    return function (fn) {
        if (canPost) {
            queue.push(fn);
            window.postMessage('browserify-tick', '*');
        }
        else setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    if (name === 'evals') return (require)('vm')
    else throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    process.cwd = function () { return cwd };
    process.chdir = function (dir) {
        if (!path) path = require('path');
        cwd = path.resolve(dir, cwd);
    };
})();
});

require.define("/game.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var CGame, CPlayer, STAGE_LOBBY, STAGE_PLAYING, baseObject, button, canvas, enemy, explosion, g, game, input, map, missile, point, text;

  point = require("./point");

  g = require("./globals");

  input = require("./input");

  canvas = $("#canvas");

  require("./math");

  STAGE_LOBBY = 0;

  STAGE_PLAYING = 1;

  CGame = (function() {

    function CGame() {}

    CGame.prototype.startButton = null;

    CGame.prototype.stage = STAGE_LOBBY;

    CGame.prototype.missileFired = false;

    CGame.prototype.player = null;

    CGame.prototype.click = function() {
      var z;
      if (this.stage === STAGE_PLAYING) {
        if (!this.missileFired) {
          z = new missile();
          z.setTarget(point(input.mouseX, input.mouseY));
          z.setPos(point(200, 350));
          return this.missileFired = true;
        }
      }
    };

    CGame.prototype.think = function() {};

    CGame.prototype.render = function(delta) {
      var object, _i, _len, _ref;
      canvas.clearCanvas();
      _ref = g.objectlist;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        object = _ref[_i];
        object.render(delta);
      }
      if (this.stage === STAGE_PLAYING) {
        canvas.drawText({
          fillStyle: "#000",
          x: 200,
          y: 10,
          font: "12px Arial, sans-serif",
          text: "Lives: " + g.lives
        }).drawText({
          fillStyle: "#000",
          x: 100,
          y: 10,
          font: "12px Arial, sans-serif",
          text: "Score: " + g.score
        }).drawRect({
          fillStyle: "#000",
          x: 0,
          y: 350,
          width: 400,
          height: 50,
          fromCenter: false
        });
        g.difficulty += g.delta / 10000;
        return this.spawnthink();
      }
    };

    CGame.prototype.nextspawn = 0;

    CGame.prototype.spawnthink = function() {
      var e, _ref;
      if (g.time > this.nextspawn) {
        this.nextspawn = g.time + 2000 - ((_ref = g.difficulty > 7.5) != null ? _ref : {
          1500: g.difficulty * 200
        });
        e = new enemy();
        e.setTarget(point(Math.rand(0, 400), 350));
        return e.setOrigin(point(Math.rand(0, 400), -10));
      }
    };

    CGame.prototype.initialize = function() {
      var nextspawn;
      nextspawn = 0;
      g.objectlist.length = 0;
      g.toremove.length = 0;
      g.difficulty = 0;
      g.score = 0;
      g.lives = 3;
      this.missileFired = false;
      this.stage = STAGE_LOBBY;
      this.map = new map();
      return this.player = new CPlayer();
    };

    return CGame;

  })();

  game = new CGame;

  module.exports = game;

  map = require("./objects/map");

  baseObject = require("./objects/baseObject");

  enemy = require("./objects/enemy");

  explosion = require("./objects/explosion");

  missile = require("./objects/missile");

  CPlayer = require("./objects/player");

  button = require("./objects/button");

  text = require("./objects/text");

}).call(this);
});

require.define("/point.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var Point, origin, point;

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

  module.exports = point;

}).call(this);
});

require.define("/globals.coffee",function(require,module,exports,__dirname,__filename,process){(function() {

  module.exports = {
    tileSize: 10,
    objectlist: [],
    toremove: [],
    difficulty: 0,
    time: (new Date()).getTime(),
    delta: 0,
    score: 0,
    lastScore: null,
    missileFired: false
  };

}).call(this);
});

require.define("/input.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var CInput, KEY_A, KEY_D, KEY_S, KEY_W, canvas, game, input;

  game = require("./game");

  canvas = $("#canvas");

  KEY_W = 87;

  KEY_S = 83;

  KEY_A = 65;

  KEY_D = 68;

  CInput = (function() {

    function CInput() {}

    CInput.prototype.mouseX = 0;

    CInput.prototype.mouseY = 0;

    CInput.prototype.mouseDown = false;

    CInput.prototype.lastMouseDown = false;

    CInput.prototype.keysDown = [];

    CInput.prototype.thinkFunction = function() {};

    CInput.prototype.setThink = function(thinkFunction) {
      return this.thinkFunction = thinkFunction;
    };

    CInput.prototype.think = function() {
      return this.lastMouseDown = this.mouseDown;
    };

    CInput.prototype.keyDown = function(key) {
      return this.keysDown[key] = true;
    };

    CInput.prototype.keyUp = function(key) {
      return this.keysDown[key] = false;
    };

    CInput.prototype.isKeyDown = function(key) {
      return this.keysDown[key];
    };

    return CInput;

  })();

  input = new CInput;

  canvas.mousemove(function(e) {
    input.mouseX = e.offsetX;
    input.mouseY = e.offsetY;
    return input.thinkFunction();
  }).mousedown(function(e) {
    input.mouseX = e.offsetX;
    input.mouseDown = true;
    return input.thinkFunction();
  }).mouseup(function(e) {
    input.mouseY = e.offsetY;
    input.mouseDown = false;
    return input.thinkFunction();
  });

  window.addEventListener('keyup', function(event) {
    input.keyUp(event.which != null ? event.which : event.keyCode);
    return input.thinkFunction();
  }, false);

  window.addEventListener('keydown', function(event) {
    input.keyDown(event.which != null ? event.which : event.keyCode);
    return input.thinkFunction();
  }, false);

  module.exports = input;

}).call(this);
});

require.define("/math.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var point;

  point = require("./point");

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

  Math.rayToRayIntersection = function(p1, p2, p3, p4) {
    var d, r, s;
    if ((p2.y - p1.y) / (p2.x - p1.y) !== (p4.y - p3.y) / (p4.x - p3.x)) {
      d = ((p2.x - p1.x) * (p4.y - p3.y)) - (p2.y - p1.y) * (p4.x - p3.x);
      if (d !== 0) {
        r = (((p1.y - p3.y) * (p4.x - p3.x)) - (p1.x - p3.x) * (p4.y - p3.y)) / d;
        s = (((p1.y - p3.y) * (p2.x - p1.x)) - (p1.x - p3.x) * (p2.y - p1.y)) / d;
        if (r >= 0 && r <= 1) {
          if (s >= 0 && s <= 1) {
            return point(p1.x + r * (p2.x - p1.x), p1.y + r * (p2.y - p1.y));
          }
        }
      }
    }
  };

  Math.lineToRayIntersection = function(p1, p2, p3, p4) {
    var d, r, s;
    if ((p2.y - p1.y) / (p2.x - p1.y) !== (p4.y - p3.y) / (p4.x - p3.x)) {
      d = ((p2.x - p1.x) * (p4.y - p3.y)) - (p2.y - p1.y) * (p4.x - p3.x);
      if (d !== 0) {
        r = (((p1.y - p3.y) * (p4.x - p3.x)) - (p1.x - p3.x) * (p4.y - p3.y)) / d;
        s = (((p1.y - p3.y) * (p2.x - p1.x)) - (p1.x - p3.x) * (p2.y - p1.y)) / d;
        if (s >= 0 && s <= 1) {
          return point(p1.x + r * (p2.x - p1.x), p1.y + r * (p2.y - p1.y));
        }
      }
    }
  };

}).call(this);
});

require.define("/objects/map.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var baseObject, canvas, g, game, input, loadedMap, map, point,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  input = require("../input");

  baseObject = require("./baseObject");

  g = require("../globals");

  game = require("../game");

  point = require("../point");

  canvas = $("#canvas");

  loadedMap = [[0, 0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0, 1], [0, 1, 0, 0, 0, 0, 1, 0], [0, 0, 1, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1]];

  map = (function(_super) {

    __extends(map, _super);

    function map() {
      return map.__super__.constructor.apply(this, arguments);
    }

    map.prototype.className = "map";

    map.prototype.initialize = function() {};

    map.prototype.trace = function(pA, pB) {
      var bA, bB, bottomLeft, bottomRight, count, deltaX, deltaY, downSide, endPoint, iPoint, initPoint, leftSide, mA, mB, maxX, maxY, ox, oy, rightSide, stepX, stepY, tempPoint, topLeft, topRight, upSide, vx, vy, x, x1, x2, y, y1, y2;
      x1 = pA.x;
      y1 = pA.y;
      x2 = pB.x;
      y2 = pB.y;
      vx = x2 - x1;
      vy = y2 - y1;
      x = Math.floor(x1 / g.tileSize);
      y = Math.floor(y1 / g.tileSize);
      ox = Math.floor(x2 / g.tileSize);
      oy = Math.floor(y2 / g.tileSize);
      stepX = vx > 0 ? 1 : (vx === 0 ? 0 : -1);
      stepY = vy > 0 ? 1 : (vy === 0 ? 0 : -1);
      deltaX = 0;
      deltaY = 0;
      maxX = 1;
      maxY = 1;
      if (vx !== 0) {
        maxX = ((x + (vx > 0 && 1 || 0)) * g.tileSize - x1) / vx;
        deltaX = Math.abs(g.tileSize / vx);
      }
      if (vy !== 0) {
        maxY = ((y + (vy > 0 && 1 || 0)) * g.tileSize - y1) / vy;
        deltaY = Math.abs(g.tileSize / vy);
      }
      count = 0;
      while ((x !== ox || y !== oy) && count < 50 || count === 0) {
        if (count !== 0) {
          if (maxX < maxY) {
            maxX = maxX + deltaX;
            x += stepX;
          } else {
            maxY = maxY + deltaY;
            y += stepY;
          }
        }
        if ((loadedMap[y] != null) && loadedMap[y][x] === 1) {
          initPoint = point(x1, y1);
          endPoint = point(x2, y2);
          mA = vy / vx;
          mB = vx / vy;
          bA = y1 - (mA * x1);
          bB = y2 - (mA * x2);
          leftSide = x * g.tileSize;
          rightSide = leftSide + g.tileSize;
          upSide = y * g.tileSize;
          downSide = upSide + g.tileSize;
          topLeft = point(leftSide, upSide);
          bottomLeft = point(leftSide, downSide);
          topRight = point(rightSide, upSide);
          bottomRight = point(rightSide, downSide);
          if (x1 <= x2) {
            tempPoint = Math.lineToRayIntersection(initPoint, endPoint, topLeft, bottomLeft);
            if (tempPoint != null) {
              iPoint = tempPoint;
            }
          } else {
            tempPoint = Math.lineToRayIntersection(initPoint, endPoint, topRight, bottomRight);
            if ((tempPoint != null) && (!(iPoint != null) || tempPoint.distance(initPoint) < iPoint.distance(initPoint))) {
              iPoint = tempPoint;
            }
          }
          if (y1 <= y2) {
            tempPoint = Math.lineToRayIntersection(initPoint, endPoint, topLeft, topRight);
            if ((tempPoint != null) && (!(iPoint != null) || tempPoint.distance(initPoint) < iPoint.distance(initPoint))) {
              iPoint = tempPoint;
            }
          } else {
            tempPoint = Math.lineToRayIntersection(initPoint, endPoint, bottomLeft, bottomRight);
            if ((tempPoint != null) && (!(iPoint != null) || tempPoint.distance(initPoint) < iPoint.distance(initPoint))) {
              iPoint = tempPoint;
            }
          }
          if (iPoint != null) {
            return iPoint;
          }
        }
        count++;
      }
    };

    map.prototype.render = function() {
      var tile, v, x, y, _i, _j, _len, _len1;
      for (y = _i = 0, _len = loadedMap.length; _i < _len; y = ++_i) {
        v = loadedMap[y];
        for (x = _j = 0, _len1 = v.length; _j < _len1; x = ++_j) {
          tile = v[x];
          if (tile === 1) {
            canvas.drawRect({
              fillStyle: "#000",
              x: this.x + x * g.tileSize,
              y: this.y + y * g.tileSize,
              width: g.tileSize,
              height: g.tileSize,
              fromCenter: false
            });
          }
        }
      }
      return canvas.drawArc({
        fillStyle: "#FF0",
        x: input.mouseX,
        y: input.mouseY,
        radius: 4
      });
      /*iPoint = @trace( point( game.player.x, game.player.y ), point( input.mouseX, input.mouseY ) )
      
      if iPoint?
          console.log(iPoint.y)
          canvas.drawArc
              fillStyle: "#0F0"
              x: iPoint.x
              y: iPoint.y
              radius: 4
      */

    };

    return map;

  })(baseObject);

  module.exports = map;

}).call(this);
});

require.define("/objects/baseObject.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var baseObject, canvas, g, point;

  g = require("../globals");

  point = require("../point");

  canvas = $("#canvas");

  baseObject = (function() {

    baseObject.prototype.className = baseObject;

    function baseObject() {
      g.objectlist.push(this);
      this.timestamp = g.time;
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
      if (g.toremove.indexOf(this) < 0) {
        return g.toremove.push(this);
      }
    };

    baseObject.prototype._remove = function() {
      g.objectlist.splice(g.objectlist.indexOf(this), 1);
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

  module.exports = baseObject;

}).call(this);
});

require.define("/objects/enemy.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var baseObject, canvas, enemy, explosion, g, game, point,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  baseObject = require("./baseObject");

  explosion = require("./explosion");

  g = require("../globals");

  point = require("../point");

  game = require("../game");

  canvas = $("#canvas");

  enemy = (function(_super) {

    __extends(enemy, _super);

    function enemy() {
      return enemy.__super__.constructor.apply(this, arguments);
    }

    enemy.prototype.speed = 0.05;

    enemy.prototype.initialize = function() {
      return this.speed = 0.05 + g.difficulty / 100;
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
      if (this.target != null) {
        pos = this.getPos().add((this.target.sub(this.getPos())).norm().mul(g.delta * this.speed));
        this.setPos(pos);
        if (g.delta * this.speed > this.getPos().distance(this.target)) {
          z = new explosion;
          z.setPos(this.getPos());
          this.remove();
          g.lives--;
          if (g.lives < 1) {
            g.lastScore = g.score;
            return game.initialize();
          }
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

  module.exports = enemy;

}).call(this);
});

require.define("/objects/explosion.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var baseObject, canvas, explosion, g, point,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  baseObject = require("../baseObject");

  g = require("../globals");

  point = require("../point");

  canvas = $("#canvas");

  explosion = (function(_super) {

    __extends(explosion, _super);

    function explosion() {
      return explosion.__super__.constructor.apply(this, arguments);
    }

    explosion.prototype.radius = 250;

    explosion.prototype.initialize = function() {};

    explosion.prototype.think = function() {
      var e, z, _i, _len, _ref;
      _ref = g.objectlist;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (e.isEnemy != null) {
          if (e.getPos().distance(this.getPos()) <= (g.time - this.timestamp) / 10) {
            z = new explosion;
            z.setPos(e.getPos());
            e.remove();
            g.score++;
          }
        }
      }
      if ((g.time - this.timestamp) > this.radius) {
        return this.remove();
      }
    };

    explosion.prototype.render = function() {
      var a;
      a = Math.round(255 * (g.time - this.timestamp) / this.radius);
      return canvas.drawArc({
        strokeStyle: "rgb(255 , " + a + ", " + a + ")",
        strokeWidth: 2,
        x: this.x,
        y: this.y,
        radius: (g.time - this.timestamp) / 10
      });
    };

    return explosion;

  })(baseObject);

  module.exports = explosion;

}).call(this);
});

require.define("/objects/missile.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var baseObject, canvas, explosion, g, game, missile, point,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  baseObject = require("../baseObject");

  explosion = require("../explosion");

  g = require("../globals");

  point = require("../point");

  game = require("../game");

  canvas = $("#canvas");

  missile = (function(_super) {

    __extends(missile, _super);

    function missile() {
      return missile.__super__.constructor.apply(this, arguments);
    }

    missile.prototype.speed = 0.15;

    missile.prototype.initialize = function() {
      return this.speed = 0.15 + g.difficulty / 75;
    };

    missile.prototype.setTarget = function(target) {
      return this.target = target;
    };

    missile.prototype.think = function() {
      var pos, z;
      pos = this.getPos().add((this.target.sub(this.getPos())).norm().mul(g.delta * this.speed));
      this.setPos(pos);
      if (g.delta * this.speed > this.getPos().distance(this.target)) {
        z = new explosion;
        z.radius = 500;
        z.setPos(this.getPos());
        game.missileFired = false;
        return this.remove();
      }
    };

    return missile;

  })(baseObject);

  module.exports = missile;

}).call(this);
});

require.define("/objects/player.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var KEY_A, KEY_D, KEY_S, KEY_W, baseObject, canvas, g, game, input, player, point,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  baseObject = require("./baseObject");

  input = require("../input");

  g = require("../globals");

  game = require("../game");

  point = require("../point");

  canvas = $("#canvas");

  KEY_W = 87;

  KEY_S = 83;

  KEY_A = 65;

  KEY_D = 68;

  player = (function(_super) {

    __extends(player, _super);

    function player() {
      return player.__super__.constructor.apply(this, arguments);
    }

    player.prototype.className = "player";

    player.prototype.tileSize = 10;

    player.prototype.velY = 0;

    player.prototype.initialize = function() {};

    player.prototype.trace = function() {};

    player.prototype.think = function() {};

    player.prototype.render = function(delta) {
      var goal, goalX, goalY, gravity, normal, res;
      goalX = this.x;
      goalY = this.y;
      if (input.isKeyDown(KEY_W)) {
        goalY -= delta / 10;
        res = game.map.trace(point(this.x + 5, this.y + 10), point(this.x + 5, this.y + 13));
        if (res != null) {
          this.velY = 3;
        }
      }
      if (input.isKeyDown(KEY_S)) {
        goalY += delta / 10;
      }
      if (input.isKeyDown(KEY_A)) {
        goalX -= delta / 10;
      }
      if (input.isKeyDown(KEY_D)) {
        goalX += delta / 10;
      }
      gravity = 0;
      this.velY -= delta / 80;
      goal = this.y + gravity - this.velY / 20 * delta;
      normal = point(0, goal - this.y).norm();
      res = game.map.trace(point(this.x + 5, this.y + 5 + normal.y * 5), point(this.x + 5, goal + 5 + normal.y * 5));
      if (res != null) {
        this.y = res.y - normal.y * 0.01 - 5 - normal.y * 5;
        this.velY = 0;
      } else {
        this.y = goal;
      }
      normal = point(goalX - this.x, 0).norm();
      res = game.map.trace(point(this.x + 5 + normal.x * 5, this.y + 5), point(goalX + 5 + normal.x * 5, this.y + 5));
      if (res != null) {
        this.x = res.x - normal.x * 0.01 - 5 - normal.x * 5;
      } else {
        this.x = goalX;
      }
      return canvas.drawRect({
        fillStyle: "#0F0",
        x: Math.round(this.x),
        y: Math.round(this.y),
        width: this.tileSize,
        height: this.tileSize,
        fromCenter: false
      });
    };

    return player;

  })(baseObject);

  module.exports = player;

}).call(this);
});

require.define("/objects/button.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var baseObject, button, canvas, explosion, g, input, point,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  baseObject = require("../baseObject");

  explosion = require("../explosion");

  g = require("../globals");

  point = require("../point");

  input = require("../input");

  canvas = $("#canvas");

  button = (function(_super) {

    __extends(button, _super);

    function button() {
      return button.__super__.constructor.apply(this, arguments);
    }

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

    button.prototype.think = function() {
      this.hovered = !(input.mouseX < this.x || input.mouseY < this.y || input.mouseX > this.x + this.width || input.mouseY > this.y + this.height);
      if (this.hovered) {
        canvas.css('cursor', 'pointer');
      } else {
        canvas.css('cursor', 'auto');
      }
      if (this.hovered && input.mouseDown && !this.lastMouseDown) {
        this.clicking = true;
      }
      if (!input.mouseDown) {
        if (this.clicking && this.hovered) {
          this.onclick();
        }
        this.clicking = false;
      }
      return this.lastMouseDown = input.mouseDown;
    };

    button.prototype.onclick = function() {
      canvas.css('cursor', 'auto');
      return input.mouseDown = false;
    };

    button.prototype.render = function() {
      var fill;
      fill = "#555555";
      if (this.hovered) {
        fill = "#888888";
        if (input.mouseDown) {
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

  module.exports = button;

}).call(this);
});

require.define("/objects/text.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var baseObject, canvas, text,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  baseObject = require("../baseObject");

  canvas = $("#canvas");

  text = (function(_super) {

    __extends(text, _super);

    function text() {
      return text.__super__.constructor.apply(this, arguments);
    }

    text.prototype.lastMouseDown = false;

    text.prototype.clicking = false;

    text.prototype.text = 'Nothing';

    text.prototype.initialize = function() {};

    text.prototype.setText = function(text) {
      return this.text = text;
    };

    text.prototype.render = function() {
      return canvas.drawText({
        fillStyle: "#000",
        x: this.x,
        y: this.y,
        font: "12px Arial, sans-serif",
        text: this.text,
        fromCenter: false
      });
    };

    return text;

  })(baseObject);

  module.exports = text;

}).call(this);
});

require.define("/index.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
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
    var object, _i, _j, _len, _len1, _ref, _ref1;
    g.time = (new Date()).getTime();
    g.delta = g.time - lasttime;
    lasttime = g.time;
    _ref = g.objectlist;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      object = _ref[_i];
      if (object != null) {
        object.think();
      }
    }
    _ref1 = g.toremove;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      object = _ref1[_j];
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

  canvas.css('cursor', 'none');

}).call(this);
});
require("/index.coffee");
})();
