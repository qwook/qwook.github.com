(function () { "use strict";
var $hxClasses = {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var ApplicationMain = function() { }
$hxClasses["ApplicationMain"] = ApplicationMain;
ApplicationMain.__name__ = ["ApplicationMain"];
ApplicationMain.main = function() {
	ApplicationMain.completed = 0;
	ApplicationMain.loaders = new haxe.ds.StringMap();
	ApplicationMain.urlLoaders = new haxe.ds.StringMap();
	ApplicationMain.total = 0;
	flash.Lib.get_current().loaderInfo = flash.display.LoaderInfo.create(null);
	flash.Lib.get_stage().frameRate = 0;
	flash.Lib.get_current().addChild(ApplicationMain.preloader = new NMEPreloader());
	ApplicationMain.preloader.onInit();
	ApplicationMain.loadFile("img/hero.png");
	var resourcePrefix = "NME_:bitmap_";
	var _g = 0, _g1 = haxe.Resource.listNames();
	while(_g < _g1.length) {
		var resourceName = _g1[_g];
		++_g;
		if(StringTools.startsWith(resourceName,resourcePrefix)) {
			var type = Type.resolveClass(StringTools.replace(resourceName.substring(resourcePrefix.length),"_","."));
			if(type != null) {
				ApplicationMain.total++;
				var instance = Type.createInstance(type,[0,0,true,16777215,ApplicationMain.bitmapClass_onComplete]);
			}
		}
	}
	if(ApplicationMain.total != 0) {
		ApplicationMain.loaderStack = [];
		var $it0 = ApplicationMain.loaders.keys();
		while( $it0.hasNext() ) {
			var p = $it0.next();
			ApplicationMain.loaderStack.push(p);
		}
		ApplicationMain.urlLoaderStack = [];
		var $it1 = ApplicationMain.urlLoaders.keys();
		while( $it1.hasNext() ) {
			var p = $it1.next();
			ApplicationMain.urlLoaderStack.push(p);
		}
		var _g = 0;
		while(_g < 8) {
			var i = _g++;
			ApplicationMain.nextLoader();
		}
	} else ApplicationMain.begin();
}
ApplicationMain.nextLoader = function() {
	if(ApplicationMain.loaderStack.length != 0) {
		var p = ApplicationMain.loaderStack.shift(), o = ApplicationMain.loaders.get(p);
		o.contentLoaderInfo.addEventListener("complete",ApplicationMain.loader_onComplete);
		o.load(new flash.net.URLRequest(p));
	} else if(ApplicationMain.urlLoaderStack.length != 0) {
		var p = ApplicationMain.urlLoaderStack.shift(), o = ApplicationMain.urlLoaders.get(p);
		o.addEventListener("complete",ApplicationMain.loader_onComplete);
		o.load(new flash.net.URLRequest(p));
	}
}
ApplicationMain.loadFile = function(p) {
	ApplicationMain.loaders.set(p,new flash.display.Loader());
	ApplicationMain.total++;
}
ApplicationMain.loadBinary = function(p) {
	var o = new flash.net.URLLoader();
	o.set_dataFormat(flash.net.URLLoaderDataFormat.BINARY);
	ApplicationMain.urlLoaders.set(p,o);
	ApplicationMain.total++;
}
ApplicationMain.loadSound = function(p) {
	return;
	var i = p.lastIndexOf("."), c = flash.media.Sound, s, o, m = flash.Lib.mobile, f = null, q = "canplaythrough";
	if(i == -1) return;
	if(!c.canPlayType || !c.canPlayType(HxOverrides.substr(p,i + 1,null))) return;
	s = HxOverrides.substr(p,0,i) + ".mp3";
	if(c.library.exists(s)) return;
	ApplicationMain.total++;
	c.library.set(s,o = new Audio(p));
	f = function(_) {
		if(!m) o.removeEventListener(q,f);
		ApplicationMain.preloader.onUpdate(++ApplicationMain.completed,ApplicationMain.total);
		if(ApplicationMain.completed == ApplicationMain.total) ApplicationMain.begin();
	};
	if(m) f(null); else o.addEventListener(q,f);
}
ApplicationMain.begin = function() {
	ApplicationMain.preloader.addEventListener("complete",ApplicationMain.preloader_onComplete);
	ApplicationMain.preloader.onLoaded();
}
ApplicationMain.bitmapClass_onComplete = function(instance) {
	ApplicationMain.completed++;
	var classType = Type.getClass(instance);
	classType.preload = instance;
	if(ApplicationMain.completed == ApplicationMain.total) ApplicationMain.begin();
}
ApplicationMain.loader_onComplete = function(event) {
	ApplicationMain.completed++;
	ApplicationMain.preloader.onUpdate(ApplicationMain.completed,ApplicationMain.total);
	if(ApplicationMain.completed == ApplicationMain.total) ApplicationMain.begin(); else ApplicationMain.nextLoader();
}
ApplicationMain.preloader_onComplete = function(event) {
	ApplicationMain.preloader.removeEventListener("complete",ApplicationMain.preloader_onComplete);
	flash.Lib.get_current().removeChild(ApplicationMain.preloader);
	ApplicationMain.preloader = null;
	if(Reflect.field(Main,"main") == null) {
		var mainDisplayObj = Type.createInstance(DocumentClass,[]);
		if(js.Boot.__instanceof(mainDisplayObj,flash.display.DisplayObject)) flash.Lib.get_current().addChild(mainDisplayObj);
	} else Reflect.field(Main,"main").apply(Main,[]);
}
var Main = function() {
};
$hxClasses["Main"] = Main;
Main.__name__ = ["Main"];
Main.main = function() {
	love2d.Love.load = function() {
		Main.state = new MenuState();
	};
	love2d.Love.update = function(dt) {
		Main.state.update(dt);
	};
	love2d.Love.mousepressed = function(x,y,button) {
		Main.state.mousepressed(x,y,button);
	};
	love2d.Love.mousereleased = function(x,y,button) {
		Main.state.mousereleased(x,y,button);
	};
	love2d.Love.draw = function() {
		Main.state.draw();
	};
	love2d.Love.init();
}
Main.changeState = function(newState) {
	Main.state = newState;
}
Main.getWidth = function() {
	return flash.Lib.get_current().get_stage().get_stageWidth();
}
Main.getHeight = function() {
	return flash.Lib.get_current().get_stage().get_stageHeight();
}
Main.prototype = {
	__class__: Main
}
var DocumentClass = function() {
	Main.call(this);
};
$hxClasses["DocumentClass"] = DocumentClass;
DocumentClass.__name__ = ["DocumentClass"];
DocumentClass.__super__ = Main;
DocumentClass.prototype = $extend(Main.prototype,{
	__class__: DocumentClass
});
var Food = function() {
	this.curVal = 0;
	this.time = 5.0;
	this.offset = 0.0;
	this.highlight = 0.0;
	this.ingredients = new Array();
	this.ingredients.push(new Ingredient(1));
	this.ingredients.push(new Ingredient(2));
	this.ingredients.push(new Ingredient(3));
	this.ingredients.push(new Ingredient(4));
	this.dragging = null;
	this.mixup();
};
$hxClasses["Food"] = Food;
Food.__name__ = ["Food"];
Food.getIngredientSize = function() {
	return Main.getWidth() / 640 * 100;
}
Food.prototype = {
	draw: function() {
		var plateSize = Main.getWidth() / 640 * 200;
		love2d.Love.graphics.setColor(155,155,155,null);
		love2d.Love.graphics.circle("fill",Main.getWidth() / 2 + this.offset,Main.getHeight() / 2,plateSize,10);
		love2d.Love.graphics.setColor(255,255,255,100);
		love2d.Love.graphics.circle("fill",Main.getWidth() / 2 + this.offset,Main.getHeight() / 2,this.highlight * plateSize,10);
		love2d.Love.graphics.setColor(0,255,0,null);
		love2d.Love.graphics.rectangle("fill",0,Main.getHeight() - 20,this.time / 5 * Main.getWidth(),20);
		var _g = 0, _g1 = this.ingredients;
		while(_g < _g1.length) {
			var ingredient = _g1[_g];
			++_g;
			ingredient.draw();
		}
	}
	,ingredientCount: function() {
		return this.ingredients.length;
	}
	,getOffset: function() {
		return this.offset;
	}
	,update: function(dt) {
		if(this.dragging != null) {
			this.dragging.setDragPos(love2d.Love.handler.get_stage().get_mouseX(),love2d.Love.handler.get_stage().get_mouseY());
			if(this.isOverPlate()) {
				this.highlight = this.highlight + dt * 4;
				if(this.highlight > 1) this.highlight = 1;
			} else if(this.highlight > 0) this.highlight = this.highlight - dt * 8;
		} else this.highlight = 0.0;
		if(this.ingredients.length <= 0) this.offset = this.offset - dt * 400; else {
			this.time = this.time - dt;
			if(this.time < 0) Main.changeState(new MenuState());
		}
	}
	,mousereleased: function(x,y) {
		if(this.dragging != null) {
			if(this.isOverPlate() && this.dragging.getValue() == this.curVal + 1) {
				HxOverrides.remove(this.ingredients,this.dragging);
				this.curVal = this.curVal + 1;
			}
			this.dragging.setDragging(false);
			this.dragging = null;
		}
	}
	,mousepressed: function(x,y) {
		var draggable = this.findIngredient(x,y);
		if(draggable != null) {
			this.dragging = draggable;
			this.dragging.setDragging(true);
		}
	}
	,isOverPlate: function() {
		var plateSize = Main.getWidth() / 640 * 200;
		var xCenter = Main.getWidth() / 2;
		var yCenter = Main.getHeight() / 2;
		var _x = xCenter - love2d.Love.handler.get_stage().get_mouseX();
		var _y = yCenter - love2d.Love.handler.get_stage().get_mouseY();
		var dist = Math.sqrt(_x * _x + _y * _y);
		if(dist < plateSize) return true; else return false;
	}
	,findIngredient: function(x,y) {
		var min_dist = 0.0;
		var min_ingredient = null;
		var _g = 0, _g1 = this.ingredients;
		while(_g < _g1.length) {
			var ingredient = _g1[_g];
			++_g;
			var pos = ingredient.getPos();
			var _x = x - pos.x;
			var _y = y - pos.y;
			var dist = Math.sqrt(_x * _x + _y * _y);
			if(dist < Food.getIngredientSize()) {
				if(min_ingredient == null || dist < min_dist) {
					min_dist = dist;
					min_ingredient = ingredient;
				}
			}
		}
		return min_ingredient;
	}
	,mixup: function() {
		var tomixup = this.ingredients.slice();
		var i = 0;
		while(tomixup.length > 0) {
			i++;
			var randomi = Math.floor(tomixup.length * Math.random());
			var randomIngredient = tomixup[randomi];
			randomIngredient.setPos(100 + i * 125,100);
			HxOverrides.remove(tomixup,randomIngredient);
		}
	}
	,__class__: Food
}
var State = function() {
};
$hxClasses["State"] = State;
State.__name__ = ["State"];
State.prototype = {
	draw: function() {
	}
	,update: function(dt) {
	}
	,mousereleased: function(x,y,button) {
	}
	,mousepressed: function(x,y,button) {
	}
	,__class__: State
}
var GameState = function() {
	State.call(this);
	this.dish = new Food();
};
$hxClasses["GameState"] = GameState;
GameState.__name__ = ["GameState"];
GameState.__super__ = State;
GameState.prototype = $extend(State.prototype,{
	draw: function() {
		this.dish.draw();
	}
	,update: function(dt) {
		this.dish.update(dt);
		if(this.dish.getOffset() < -400) this.dish = new Food();
	}
	,mousereleased: function(x,y,button) {
		this.dish.mousereleased(x,y);
	}
	,mousepressed: function(x,y,button) {
		this.dish.mousepressed(x,y);
	}
	,__class__: GameState
});
var HxOverrides = function() { }
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var Ingredient = function(i) {
	this.yDrag = 0.0;
	this.xDrag = 0.0;
	this.dragging = false;
	this.yPos = 0.0;
	this.xPos = 0.0;
	this.i = i;
};
$hxClasses["Ingredient"] = Ingredient;
Ingredient.__name__ = ["Ingredient"];
Ingredient.prototype = {
	getValue: function() {
		return this.i;
	}
	,draw: function() {
		love2d.Love.graphics.setColor(255 - this.i * 40,0,0,null);
		if(this.dragging) love2d.Love.graphics.circle("fill",this.xDrag,this.yDrag,Food.getIngredientSize(),10); else {
			var pos = this.getPos();
			love2d.Love.graphics.circle("fill",pos.x,pos.y,Food.getIngredientSize(),10);
			love2d.Love.graphics.setColor(255,255,255,null);
		}
	}
	,calcPos: function() {
	}
	,setDragging: function(dragging) {
		this.dragging = dragging;
	}
	,getDragPos: function() {
		return { x : this.xDrag, y : this.yDrag};
	}
	,setDragPos: function(x,y) {
		this.xDrag = x;
		this.yDrag = y;
	}
	,getPos: function() {
		var xCenter = Main.getWidth() / 2;
		var yCenter = Main.getHeight() / 2;
		var xDist = Main.getWidth() / 640 * 300;
		var yDist = Main.getHeight() / 480 * 200;
		return { x : Math.cos(this.xPos) * xDist + xCenter, y : Math.sin(this.xPos) * yDist + yCenter};
	}
	,setPos: function(x,y) {
		this.xPos = x;
		this.yPos = y;
	}
	,__class__: Ingredient
}
var IMap = function() { }
$hxClasses["IMap"] = IMap;
IMap.__name__ = ["IMap"];
var MenuState = function() {
	this.hPlay = 0;
	this.wPlay = 0;
	this.yPlay = 0;
	this.xPlay = 0;
	State.call(this);
};
$hxClasses["MenuState"] = MenuState;
MenuState.__name__ = ["MenuState"];
MenuState.__super__ = State;
MenuState.prototype = $extend(State.prototype,{
	draw: function() {
		if(this.activePlay) love2d.Love.graphics.setColor(100,100,100,null); else love2d.Love.graphics.setColor(255,255,255,null);
		love2d.Love.graphics.rectangle("fill",this.xPlay,this.yPlay,this.wPlay,this.hPlay);
		love2d.Love.graphics.print("Play",this.xPlay,this.yPlay);
	}
	,update: function(dt) {
		this.calcPlayButton();
	}
	,calcPlayButton: function() {
		this.wPlay = Main.getWidth() / 640 * 500;
		this.hPlay = Main.getWidth() / 640 * 250;
		this.xPlay = Main.getWidth() / 2 - this.wPlay / 2;
		this.yPlay = Main.getHeight() / 2 - this.hPlay / 2;
	}
	,mousereleased: function(x,y,button) {
		if(this.activePlay) {
			Main.changeState(new GameState());
			this.activePlay = false;
		}
	}
	,mousepressed: function(x,y,button) {
		this.calcPlayButton();
		if(love2d.Love.handler.get_stage().get_mouseX() > this.xPlay && love2d.Love.handler.get_stage().get_mouseY() > this.yPlay && love2d.Love.handler.get_stage().get_mouseX() < this.xPlay + this.wPlay && love2d.Love.handler.get_stage().get_mouseY() < this.yPlay + this.hPlay) this.activePlay = true;
	}
	,__class__: MenuState
});
var flash = {}
flash.events = {}
flash.events.IEventDispatcher = function() { }
$hxClasses["flash.events.IEventDispatcher"] = flash.events.IEventDispatcher;
flash.events.IEventDispatcher.__name__ = ["flash","events","IEventDispatcher"];
flash.events.IEventDispatcher.prototype = {
	__class__: flash.events.IEventDispatcher
}
flash.events.EventDispatcher = function() {
	this.eventList = new haxe.ds.StringMap();
};
$hxClasses["flash.events.EventDispatcher"] = flash.events.EventDispatcher;
flash.events.EventDispatcher.__name__ = ["flash","events","EventDispatcher"];
flash.events.EventDispatcher.__interfaces__ = [flash.events.IEventDispatcher];
flash.events.EventDispatcher.prototype = {
	dispatchEvent: function(event) {
		if(event.get_target() == null) event.set_target(this);
		var t = event.type;
		if(this.eventList.exists(t)) {
			var _g = 0, _g1 = this.eventList.get(t);
			while(_g < _g1.length) {
				var o = _g1[_g];
				++_g;
				o(event);
			}
		}
		return true;
	}
	,hasEventListener: function(type) {
		return this.eventList.exists(type);
	}
	,removeEventListener: function(type,listener,useCapture,priority,weak) {
		if(weak == null) weak = false;
		if(priority == null) priority = 0;
		if(useCapture == null) useCapture = false;
		if(this.eventList.exists(type)) {
			var r = this.eventList.get(type);
			var _g = 0;
			while(_g < r.length) {
				var o = r[_g];
				++_g;
				if(Reflect.compareMethods(o,listener)) {
					HxOverrides.remove(r,o);
					break;
				}
			}
			if(r.length == 0) this.eventList.remove(type);
		}
	}
	,addEventListener: function(type,listener,useCapture,priority,weak) {
		if(weak == null) weak = false;
		if(priority == null) priority = 0;
		if(useCapture == null) useCapture = false;
		var o;
		if(!this.eventList.exists(type)) this.eventList.set(type,o = []); else o = this.eventList.get(type);
		o.push(listener);
	}
	,__class__: flash.events.EventDispatcher
}
flash.events.EventWrapper = function() {
	flash.events.EventDispatcher.call(this);
	this.eventMap = new haxe.ds.ObjectMap();
};
$hxClasses["flash.events.EventWrapper"] = flash.events.EventWrapper;
flash.events.EventWrapper.__name__ = ["flash","events","EventWrapper"];
flash.events.EventWrapper.__super__ = flash.events.EventDispatcher;
flash.events.EventWrapper.prototype = $extend(flash.events.EventDispatcher.prototype,{
	removeEventListener: function(type,listener,useCapture,priority,weak) {
		if(weak == null) weak = false;
		if(priority == null) priority = 0;
		if(useCapture == null) useCapture = false;
		flash.events.EventDispatcher.prototype.removeEventListener.call(this,type,listener,useCapture,priority,weak);
		if(this.eventMap.h.hasOwnProperty(listener.__id__)) {
			this.component.removeEventListener(type,this.eventMap.h[listener.__id__],useCapture);
			this.eventMap.remove(listener);
		}
	}
	,addEventListener: function(type,listener,useCapture,priority,weak) {
		if(weak == null) weak = false;
		if(priority == null) priority = 0;
		if(useCapture == null) useCapture = false;
		var _g = this;
		flash.events.EventDispatcher.prototype.addEventListener.call(this,type,listener,useCapture,priority,weak);
		var f = (function($this) {
			var $r;
			var wrapper = function(e) {
				if(e.get_target() == _g.component) e.set_target(_g);
				e.set_currentTarget(_g);
				listener(e);
			};
			$r = wrapper;
			return $r;
		}(this));
		if(!this.eventMap.h.hasOwnProperty(listener.__id__)) this.eventMap.set(listener,f);
		this.component.addEventListener(type,f,useCapture);
	}
	,__class__: flash.events.EventWrapper
});
flash.display = {}
flash.display.DisplayObject = function() {
	this.y = 0;
	this.x = 0;
	this.rotation = 0;
	this.scaleY = 1;
	this.scaleX = 1;
	this.alpha = 1;
	this.visible = true;
	flash.events.EventWrapper.call(this);
	this.eventRemap = new haxe.ds.StringMap();
	if(this.component == null) this.component = flash.Lib.jsDiv();
	this.component.node = this;
	this.component.setAttribute("node",Type.getClassName(Type.getClass(this)));
	this.transform = new flash.geom.Transform(this);
};
$hxClasses["flash.display.DisplayObject"] = flash.display.DisplayObject;
flash.display.DisplayObject.__name__ = ["flash","display","DisplayObject"];
flash.display.DisplayObject.__super__ = flash.events.EventWrapper;
flash.display.DisplayObject.prototype = $extend(flash.events.EventWrapper.prototype,{
	toString: function() {
		return Type.getClassName(Type.getClass(this));
	}
	,addEventListener: function(type,listener,useCapture,priority,weak) {
		if(weak == null) weak = false;
		if(priority == null) priority = 0;
		if(useCapture == null) useCapture = false;
		var _g = this;
		flash.events.EventWrapper.prototype.addEventListener.call(this,type,listener,useCapture,priority,weak);
		if(flash.display.DisplayObject.remapTouch.exists(type)) {
			var f = function(e) {
				var n = new flash.events.MouseEvent(type,e.bubbles,e.cancelable,0,0,_g,e.ctrlKey,e.altKey,e.shiftKey,false), l = e.targetTouches;
				if(l.length > 0) {
					n.pageX = l[0].pageX;
					n.pageY = l[0].pageY;
				} else {
					n.pageX = _g.get_stage().mousePos.x;
					n.pageY = _g.get_stage().mousePos.y;
				}
				_g.dispatchEvent(n);
			};
			flash.events.EventWrapper.prototype.addEventListener.call(this,flash.display.DisplayObject.remapTouch.get(type),f,useCapture,priority,weak);
		}
	}
	,get_mouseY: function() {
		return (flash.display.DisplayObject.convPoint = this.globalToLocal(flash.Lib.get_current().get_stage().mousePos,flash.display.DisplayObject.convPoint)).y;
	}
	,get_mouseX: function() {
		return (flash.display.DisplayObject.convPoint = this.globalToLocal(flash.Lib.get_current().get_stage().mousePos,flash.display.DisplayObject.convPoint)).x;
	}
	,localToGlobal: function(q,r) {
		if(r == null) r = new flash.geom.Point();
		var m = flash.display.DisplayObject.convMatrix, u = q.x, v = q.y;
		if(m == null) m = flash.display.DisplayObject.convMatrix = new flash.geom.Matrix();
		m.identity();
		m = this.getGlobalMatrix(m);
		r.x = u * m.a + v * m.c + m.tx;
		r.y = u * m.b + v * m.d + m.ty;
		return r;
	}
	,globalToLocal: function(q,r) {
		if(r == null) r = new flash.geom.Point();
		var m = flash.display.DisplayObject.convMatrix, u = q.x, v = q.y;
		if(m == null) m = flash.display.DisplayObject.convMatrix = new flash.geom.Matrix();
		m.identity();
		m = this.getGlobalMatrix(m);
		m.invert();
		r.x = u * m.a + v * m.c + m.tx;
		r.y = u * m.b + v * m.d + m.ty;
		return r;
	}
	,getGlobalMatrix: function(m) {
		if(m == null) m = new flash.geom.Matrix();
		var o = this;
		while(o != null) {
			if(o.x != 0 || o.y != 0) m.translate(o.x,o.y);
			if(o.scaleX != 1 || o.scaleY != 1) m.scale(o.scaleX,o.scaleY);
			if(o.rotation != 0) m.rotate(o.rotation);
			m.concat(o.transform.get_matrix());
			o = o.parent;
		}
		return m;
	}
	,getRect: function(o) {
		return this.getBounds(o);
	}
	,getBounds: function(o) {
		var m = this.getGlobalMatrix(), r = new flash.geom.Rectangle(0,0,this.get_width(),this.get_height());
		if(o == null) o = this;
		if(o != this) {
			r.transform(m);
			if(o != null) {
				m = o.getGlobalMatrix();
				m.invert();
				r.transform(m);
			}
		}
		return r;
	}
	,set_stage: function(v) {
		if(this._stage != v) {
			var z = this._stage != null != (v != null);
			this._stage = v;
			if(z) this.dispatchEvent(new flash.events.Event(v != null?"addedToStage":"removedFromStage"));
		}
		return v;
	}
	,get_stage: function() {
		return this._stage;
	}
	,set_scrollRect: function(v) {
		if(console) console.log(Std.string(this) + ".scrollRect = " + Std.string(v));
		return v;
	}
	,set_visible: function(v) {
		this.component.style.display = (this.visible = v)?null:"none";
		return v;
	}
	,set_alpha: function(v) {
		if(v != this.alpha) this.component.style.opacity = (this.alpha = v).toFixed(4);
		return v;
	}
	,set_height: function(v) {
		return v;
	}
	,set_width: function(v) {
		return v;
	}
	,get_height: function() {
		return this.qHeight || 0;
	}
	,get_width: function() {
		return this.qWidth || 0;
	}
	,set_scaleY: function(v) {
		if(this.scaleY != v) {
			this.scaleY = v;
			this.syncMtx();
		}
		return v;
	}
	,set_scaleX: function(v) {
		if(this.scaleX != v) {
			this.scaleX = v;
			this.syncMtx();
		}
		return v;
	}
	,set_rotation: function(v) {
		if(this.rotation != v) {
			this.rotation = v;
			this.syncMtx();
		}
		return v;
	}
	,set_y: function(v) {
		if(this.y != v) {
			this.y = v;
			this.syncMtx();
		}
		return v;
	}
	,set_x: function(v) {
		if(this.x != v) {
			this.x = v;
			this.syncMtx();
		}
		return v;
	}
	,syncMtx: function() {
		var s = this.component.style, v, n;
		if(this._syncMtx_set != true) {
			this._syncMtx_set = true;
			v = "0% 0%";
			n = "syncMtx-origin";
			s.setProperty(n,v,null);
			s.setProperty("-o-" + n,v,null);
			s.setProperty("-ms-" + n,v,null);
			s.setProperty("-moz-" + n,v,null);
			s.setProperty("-webkit-" + n,v,null);
		}
		v = "";
		if(this.x != 0 || this.y != 0) v += "translate(" + this.x + "px, " + this.y + "px) ";
		if(this.scaleX != 1 || this.scaleY != 1) v += "scale(" + this.scaleX + ", " + this.scaleY + ") ";
		if(this.rotation != 0) v += "rotate(" + this.rotation + "deg) ";
		if(this.transform != null) {
			var m = this.transform.get_matrix();
			if(m != null && !m.isIdentity()) v += "matrix(" + m.a + ", " + m.b + ", " + m.c + ", " + m.d + ", " + m.tx + ", " + m.ty + ")" + " ";
		}
		this.component.setAttribute("transform",v);
		n = "transform";
		s.setProperty(n,v,null);
		s.setProperty("-o-" + n,v,null);
		s.setProperty("-ms-" + n,v,null);
		s.setProperty("-moz-" + n,v,null);
		s.setProperty("-webkit-" + n,v,null);
	}
	,invalidate: function() {
	}
	,broadcastEvent: function(e) {
		this.dispatchEvent(e);
	}
	,__class__: flash.display.DisplayObject
	,__properties__: {set_stage:"set_stage",get_stage:"get_stage",set_visible:"set_visible",set_alpha:"set_alpha",set_scaleX:"set_scaleX",set_scaleY:"set_scaleY",set_rotation:"set_rotation",set_x:"set_x",set_y:"set_y",set_width:"set_width",get_width:"get_width",set_height:"set_height",get_height:"get_height",set_scrollRect:"set_scrollRect",get_mouseX:"get_mouseX",get_mouseY:"get_mouseY"}
});
flash.display.InteractiveObject = function() {
	flash.display.DisplayObject.call(this);
	this.tabEnabled = false;
	this.tabIndex = 0;
	this.mouseEnabled = this.doubleClickEnabled = true;
};
$hxClasses["flash.display.InteractiveObject"] = flash.display.InteractiveObject;
flash.display.InteractiveObject.__name__ = ["flash","display","InteractiveObject"];
flash.display.InteractiveObject.__super__ = flash.display.DisplayObject;
flash.display.InteractiveObject.prototype = $extend(flash.display.DisplayObject.prototype,{
	giveFocus: function() {
		this.component.focus();
	}
	,__class__: flash.display.InteractiveObject
});
flash.display.DisplayObjectContainer = function() {
	flash.display.InteractiveObject.call(this);
	this.children = [];
};
$hxClasses["flash.display.DisplayObjectContainer"] = flash.display.DisplayObjectContainer;
flash.display.DisplayObjectContainer.__name__ = ["flash","display","DisplayObjectContainer"];
flash.display.DisplayObjectContainer.__super__ = flash.display.InteractiveObject;
flash.display.DisplayObjectContainer.prototype = $extend(flash.display.InteractiveObject.prototype,{
	set_stage: function(v) {
		flash.display.InteractiveObject.prototype.set_stage.call(this,v);
		var _g = 0, _g1 = this.children;
		while(_g < _g1.length) {
			var o = _g1[_g];
			++_g;
			o.set_stage(v);
		}
		return v;
	}
	,broadcastEvent: function(e) {
		this.dispatchEvent(e);
		var _g = 0, _g1 = this.children;
		while(_g < _g1.length) {
			var o = _g1[_g];
			++_g;
			o.broadcastEvent(e);
		}
	}
	,contains: function(v) {
		var _g = 0, _g1 = this.children;
		while(_g < _g1.length) {
			var o = _g1[_g];
			++_g;
			if(o == v) return true;
		}
		return false;
	}
	,getChildIndex: function(v) {
		var i = -1, l = this.children.length;
		while(++i < l) if(this.children[i] == v) return i;
		return -1;
	}
	,getChildAt: function(v) {
		return this.children[v];
	}
	,removeChildAt: function(v) {
		return this.removeChild(this.children[v]);
	}
	,addChildAt: function(o,v) {
		if(v < this.children.length) {
			if(o.parent != null) o.parent.removeChild(o);
			o.parent = this;
			o.set_stage(this.get_stage());
			this.component.insertBefore(o.component,this.children[v].component);
			this.children.splice(v,0,o);
			return o;
		} else return this.addChild(o);
	}
	,removeChild: function(o) {
		o.parent = null;
		o.set_stage(null);
		HxOverrides.remove(this.children,o);
		this.component.removeChild(o.component);
		var e = new flash.events.Event("removed");
		o.dispatchEvent(e);
		this.dispatchEvent(e);
		return o;
	}
	,addChild: function(o) {
		if(o.parent != null) o.parent.removeChild(o);
		o.parent = this;
		o.set_stage(this.get_stage());
		this.children.push(o);
		this.component.appendChild(o.component);
		var e = new flash.events.Event("added");
		o.dispatchEvent(e);
		this.dispatchEvent(e);
		return o;
	}
	,get_numChildren: function() {
		return this.children.length;
	}
	,__class__: flash.display.DisplayObjectContainer
	,__properties__: $extend(flash.display.InteractiveObject.prototype.__properties__,{get_numChildren:"get_numChildren"})
});
flash.display.IBitmapDrawable = function() { }
$hxClasses["flash.display.IBitmapDrawable"] = flash.display.IBitmapDrawable;
flash.display.IBitmapDrawable.__name__ = ["flash","display","IBitmapDrawable"];
flash.display.IBitmapDrawable.prototype = {
	__class__: flash.display.IBitmapDrawable
}
flash.display.Sprite = function() {
	flash.display.DisplayObjectContainer.call(this);
};
$hxClasses["flash.display.Sprite"] = flash.display.Sprite;
flash.display.Sprite.__name__ = ["flash","display","Sprite"];
flash.display.Sprite.__interfaces__ = [flash.display.IBitmapDrawable];
flash.display.Sprite.__super__ = flash.display.DisplayObjectContainer;
flash.display.Sprite.prototype = $extend(flash.display.DisplayObjectContainer.prototype,{
	drawToSurface: function(cnv,ctx,mtx,ctr,blendMode,clipRect,smoothing) {
		this.get_graphics().drawToSurface(cnv,ctx,mtx,ctr,blendMode,clipRect,smoothing);
	}
	,set_useHandCursor: function(o) {
		this.component.style.cursor = o?"pointer":null;
		return this.useHandCursor = o;
	}
	,set_stage: function(v) {
		var z = this.get_stage() == null && v != null, r = flash.display.DisplayObjectContainer.prototype.set_stage.call(this,v);
		if(z && this._graphics != null) this._graphics.invalidate();
		return r;
	}
	,get_graphics: function() {
		if(this._graphics == null) {
			var o = new flash.display.Graphics(), q = o.component;
			o.set_displayObject(this);
			if(this.children.length == 0) this.component.appendChild(q); else this.component.insertBefore(q,this.children[0].component);
			this._graphics = o;
		}
		return this._graphics;
	}
	,__class__: flash.display.Sprite
	,__properties__: $extend(flash.display.DisplayObjectContainer.prototype.__properties__,{get_graphics:"get_graphics",set_useHandCursor:"set_useHandCursor"})
});
var NMEPreloader = function() {
	flash.display.Sprite.call(this);
	var backgroundColor = this.getBackgroundColor();
	var r = backgroundColor >> 16 & 255;
	var g = backgroundColor >> 8 & 255;
	var b = backgroundColor & 255;
	var perceivedLuminosity = 0.299 * r + 0.587 * g + 0.114 * b;
	var color = 0;
	if(perceivedLuminosity < 70) color = 16777215;
	var x = 30;
	var height = 9;
	var y = this.getHeight() / 2 - height / 2;
	var width = this.getWidth() - x * 2;
	var padding = 3;
	this.outline = new flash.display.Sprite();
	this.outline.get_graphics().lineStyle(1,color,0.15,true);
	this.outline.get_graphics().drawRoundRect(0,0,width,height,padding * 2,padding * 2);
	this.outline.set_x(x);
	this.outline.set_y(y);
	this.addChild(this.outline);
	this.progress = new flash.display.Sprite();
	this.progress.get_graphics().beginFill(color,0.35);
	this.progress.get_graphics().drawRect(0,0,width - padding * 2,height - padding * 2);
	this.progress.set_x(x + padding);
	this.progress.set_y(y + padding);
	this.progress.set_scaleX(0);
	this.addChild(this.progress);
};
$hxClasses["NMEPreloader"] = NMEPreloader;
NMEPreloader.__name__ = ["NMEPreloader"];
NMEPreloader.__super__ = flash.display.Sprite;
NMEPreloader.prototype = $extend(flash.display.Sprite.prototype,{
	onUpdate: function(bytesLoaded,bytesTotal) {
		var percentLoaded = bytesLoaded / bytesTotal;
		if(percentLoaded > 1) percentLoaded == 1;
		this.progress.set_scaleX(percentLoaded);
	}
	,onLoaded: function() {
		this.dispatchEvent(new flash.events.Event("complete"));
	}
	,onInit: function() {
	}
	,getWidth: function() {
		var width = 800;
		if(width > 0) return width; else return flash.Lib.get_current().get_stage().get_stageWidth();
	}
	,getHeight: function() {
		var height = 480;
		if(height > 0) return height; else return flash.Lib.get_current().get_stage().get_stageHeight();
	}
	,getBackgroundColor: function() {
		return 0;
	}
	,__class__: NMEPreloader
});
var Reflect = function() { }
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.deleteField = function(o,field) {
	if(!Reflect.hasField(o,field)) return false;
	delete(o[field]);
	return true;
}
var Std = function() { }
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	__class__: StringBuf
}
var StringTools = function() { }
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	return quotes?s.split("\"").join("&quot;").split("'").join("&#039;"):s;
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
var Type = function() { }
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
flash.Lib = function() { }
$hxClasses["flash.Lib"] = flash.Lib;
flash.Lib.__name__ = ["flash","Lib"];
flash.Lib.__properties__ = {get_stage:"get_stage",get_current:"get_current"}
flash.Lib.__init = function() {
	var o;
	flash.Lib.schList = [];
	flash.Lib.schLength = 0;
	window.reqAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(o1) {
		window.setTimeout(o1,700 / flash.Lib.frameRate,null);
	};
	o = navigator.userAgent || navigator.vendor || window.opera;
	flash.Lib.mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(o) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(o.substr(0,4));
}
flash.Lib.getTimer = function() {
	return ~~(Date.now() - flash.Lib.qTimeStamp);
}
flash.Lib.getURL = function(url,target) {
	js.Browser.window.open(url.url,target);
}
flash.Lib.jsNode = function(o) {
	var r = js.Browser.document.createElement(o);
	r.style.position = "absolute";
	return r;
}
flash.Lib.jsDiv = function() {
	return flash.Lib.jsNode("div");
}
flash.Lib.jsCanvas = function() {
	return flash.Lib.jsNode("canvas");
}
flash.Lib.jsHelper = function() {
	if(flash.Lib.qHelper == null) {
		var o = flash.Lib.jsDiv();
		flash.Lib.get_stage().component.appendChild(o);
		o.style.visibility = "hidden";
		o.setAttribute("node","Lib.jsHelper");
		o.appendChild(flash.Lib.qHelper = flash.Lib.jsDiv());
	}
	return flash.Lib.qHelper;
}
flash.Lib.get_current = function() {
	if(flash.Lib.qCurrent == null) flash.Lib.get_stage().addChild(flash.Lib.qCurrent = new flash.display.MovieClip());
	return flash.Lib.qCurrent;
}
flash.Lib.get_stage = function() {
	if(flash.Lib.qStage == null) js.Browser.document.body.appendChild((flash.Lib.qStage = new flash.display.Stage()).component);
	return flash.Lib.qStage;
}
flash.Lib.requestAnimationFrame = function(handler) {
	window.reqAnimFrame(handler);
}
flash.Lib.schedule = function(m) {
	flash.Lib.schList[flash.Lib.schLength++] = m;
}
flash.Lib.rgba = function(color) {
	return "rgba(" + (color >> 16 & 255) + "," + (color >> 8 & 255) + "," + (color & 255) + "," + ((color >> 24 & 255) / 255).toFixed(4) + ")";
}
flash.Lib.rgbf = function(color,alpha) {
	return "rgba(" + (color >> 16 & 255) + "," + (color >> 8 & 255) + "," + (color & 255) + "," + alpha.toFixed(4) + ")";
}
flash.display.Bitmap = function(bitmapData,pixelSnapping,smoothing) {
	if(smoothing == null) smoothing = false;
	this.smoothing = false;
	flash.display.DisplayObject.call(this);
	this.set_bitmapData(bitmapData);
};
$hxClasses["flash.display.Bitmap"] = flash.display.Bitmap;
flash.display.Bitmap.__name__ = ["flash","display","Bitmap"];
flash.display.Bitmap.__interfaces__ = [flash.display.IBitmapDrawable];
flash.display.Bitmap.__super__ = flash.display.DisplayObject;
flash.display.Bitmap.prototype = $extend(flash.display.DisplayObject.prototype,{
	drawToSurface: function(cnv,ctx,matrix,ctr,blendMode,clipRect,smoothing) {
		this.bitmapData.drawToSurface(cnv,ctx,matrix,ctr,blendMode,clipRect,smoothing);
	}
	,get_height: function() {
		return this.qHeight != null?this.qHeight:this.bitmapData != null?this.bitmapData.component.height:0;
	}
	,get_width: function() {
		return this.qWidth != null?this.qWidth:this.bitmapData != null?this.bitmapData.component.width:0;
	}
	,set_smoothing: function(v) {
		var o = this.bitmapData.qContext;
		if(console) console.log(Std.string(this) + ".smoothing = " + Std.string(v));
		o.imageSmoothingEnabled = o.oImageSmoothingEnabled = o.msImageSmoothingEnabled = o.webkitImageSmoothingEnabled = o.mozImageSmoothingEnabled = v;
		return v;
	}
	,set_bitmapData: function(v) {
		if(this.bitmapData != null) this.component.removeChild(this.bitmapData.component);
		if(v != null) this.component.appendChild(v.handle());
		return this.bitmapData = v;
	}
	,__class__: flash.display.Bitmap
	,__properties__: $extend(flash.display.DisplayObject.prototype.__properties__,{set_bitmapData:"set_bitmapData",set_smoothing:"set_smoothing"})
});
flash.display.ImageDataLease = function() {
};
$hxClasses["flash.display.ImageDataLease"] = flash.display.ImageDataLease;
flash.display.ImageDataLease.__name__ = ["flash","display","ImageDataLease"];
flash.display.ImageDataLease.prototype = {
	clone: function() {
		var leaseClone = new flash.display.ImageDataLease();
		leaseClone.seed = this.seed;
		leaseClone.time = this.time;
		return leaseClone;
	}
	,set: function(s,t) {
		this.seed = s;
		this.time = t;
	}
	,__class__: flash.display.ImageDataLease
}
flash.display.BitmapData = function(inWidth,inHeight,inTransparent,inFillColor) {
	if(inTransparent == null) inTransparent = true;
	this.qSync = 1;
	this.qTransparent = inTransparent;
	this.qTick = 0;
	this.qTime = new Date().getTime();
	this.rect = new flash.geom.Rectangle(0,0,inWidth,inHeight);
	this.component = flash.Lib.jsCanvas();
	this.component.setAttribute("node",Type.getClassName(Type.getClass(this)));
	this.component.width = inWidth;
	this.component.height = inHeight;
	this.qContext = this.component.getContext("2d");
	flash.display.BitmapData.setSmoothing(this.qContext,true);
	this.qPixel = this.qContext.createImageData(1,1);
	if(inFillColor == null) inFillColor = -1;
	if(!inTransparent) inFillColor |= -16777216;
	if((inFillColor & -16777216) != 0) this.fillRect(this.rect,inFillColor);
};
$hxClasses["flash.display.BitmapData"] = flash.display.BitmapData;
flash.display.BitmapData.__name__ = ["flash","display","BitmapData"];
flash.display.BitmapData.__interfaces__ = [flash.display.IBitmapDrawable];
flash.display.BitmapData.setSmoothing = function(o,v) {
	o.imageSmoothingEnabled = o.oImageSmoothingEnabled = o.msImageSmoothingEnabled = o.webkitImageSmoothingEnabled = o.mozImageSmoothingEnabled = v;
}
flash.display.BitmapData.makeColor = function(color) {
	return "rgba(" + (color >> 16 & 255) + "," + (color >> 8 & 255) + "," + (color & 255) + "," + ((color >> 24 & 255) / 255).toFixed(4) + ")";
}
flash.display.BitmapData.loadFromBytes = function(bytes,inRawAlpha,onload) {
	var bitmapData = new flash.display.BitmapData(0,0);
	bitmapData.nmeLoadFromBytes(bytes,inRawAlpha,onload);
	return bitmapData;
}
flash.display.BitmapData.nmeIsPNG = function(bytes) {
	bytes.position = 0;
	return bytes.data.getUint8(bytes.position++) == 137 && bytes.data.getUint8(bytes.position++) == 80 && bytes.data.getUint8(bytes.position++) == 78 && bytes.data.getUint8(bytes.position++) == 71 && bytes.data.getUint8(bytes.position++) == 13 && bytes.data.getUint8(bytes.position++) == 10 && bytes.data.getUint8(bytes.position++) == 26 && bytes.data.getUint8(bytes.position++) == 10;
}
flash.display.BitmapData.nmeIsJPG = function(bytes) {
	bytes.position = 0;
	return bytes.data.getUint8(bytes.position++) == 255 && bytes.data.getUint8(bytes.position++) == 216;
}
flash.display.BitmapData.prototype = {
	nmeLoadFromBytes: function(c,a,h) {
		var _g = this;
		var t, o = document.createElement("img"), n = this.component, q, f = null, i, l, p;
		if(!(t = flash.display.BitmapData.nmeIsPNG(c)?"png":flash.display.BitmapData.nmeIsJPG(c)?"jpeg":"")) throw new flash.errors.IOError("BitmapData can only load from ByteArrays with PNG/JPEG data.");
		f = function(_) {
			o.removeEventListener("load",f);
			_g.rect.width = n.width = o.width;
			_g.rect.height = n.height = o.height;
			q = _g.qContext = n.getContext("2d");
			q.drawImage(o,0,0);
			if(a != null) {
				i = -1;
				l = a.length;
				p = q.getImageData(0,0,o.width,o.height);
				while(++i < l) p.data[(i << 2) + 3] = a.data.getUint8(a.position++);
				q.putImageData(p,0,0);
			}
			if(h != null) h(_g);
		};
		o.addEventListener("load",f);
		o.src = "data:image/" + t + ";base64," + c.toBase64();
	}
	,syncData: function() {
		if(!((this.qSync & 3) != 1)) {
			this.qImageData = this.qContext.getImageData(0,0,this.component.width,this.component.height);
			this.qSync = this.qSync & -4;
		}
	}
	,syncCanvas: function() {
		if(!((this.qSync & 3) != 2)) {
			this.qContext.putImageData(this.qImageData,0,0);
			this.qSync = this.qSync & -4;
		}
	}
	,nmeLoadFromFile: function(inFilename,inLoader) {
		var _g = this;
		var image = js.Browser.document.createElement("img");
		if(inLoader != null) {
			var data = { image : image, texture : this.component, inLoader : inLoader, bitmapData : this};
			image.addEventListener("load",(function(f,a1) {
				return function(e) {
					return f(a1,e);
				};
			})($bind(this,this.jeashOnLoad),data),false);
			image.addEventListener("error",function(e) {
				if(!image.complete) _g.jeashOnLoad(data,e);
			},false);
		}
		image.src = inFilename;
	}
	,jeashOnLoad: function(data,e) {
		var canvas = data.texture;
		var width = data.image.width;
		var height = data.image.height;
		canvas.width = width;
		canvas.height = height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(data.image,0,0,width,height);
		data.bitmapData.width = width;
		data.bitmapData.height = height;
		data.bitmapData.rect = new flash.geom.Rectangle(0,0,width,height);
		if(data.inLoader != null) {
			var e1 = new flash.events.Event("complete");
			e1.set_target(data.inLoader);
			data.inLoader.dispatchEvent(e1);
		}
	}
	,applyFilter: function(sourceBitmapData,sourceRect,destPoint,filter) {
	}
	,noise: function(q,l,h,c,m) {
		if(m == null) m = false;
		if(c == null) c = 7;
		if(h == null) h = 255;
		if(l == null) l = 0;
		var wasCanvas = (this.qSync & 3) != 2, i = 0, n, p, d = h - l + 1, z = q, r = (c & 1) > 0, g = (c & 2) > 0, b = (c & 4) > 0, a = (c & 8) > 0;
		this.lock();
		p = this.qImageData.data;
		n = p.length;
		while(i < n) {
			if(m) {
				p[i] = p[i + 1] = p[i + 2] = l + (z = z * 16807 % 2147483647) % d;
				i += 3;
			} else {
				p[i++] = r?l + (z = z * 16807 % 2147483647) % d:0;
				p[i++] = g?l + (z = z * 16807 % 2147483647) % d:0;
				p[i++] = b?l + (z = z * 16807 % 2147483647) % d:0;
			}
			p[i++] = a?l + (z = z * 16807 % 2147483647) % d:255;
		}
		this.qSync |= 6;
		if(wasCanvas) this.unlock();
	}
	,copyChannel: function(o,q,p,sourceChannel,destChannel) {
		var x = ~~o.x, px = ~~p.x, y = ~~o.y, py = ~~p.y, w = ~~q.width, h = ~~q.height, sw = o.component.width, sh = o.component.height, tw = this.component.width, th = this.component.height, i, j, u, v, c, sc = sourceChannel, dc = destChannel;
		if(px < 0) {
			w += px;
			px = 0;
		}
		if(py < 0) {
			h += py;
			py = 0;
		}
		if(x < 0) {
			w += x;
			x = 0;
		}
		if(y < 0) {
			h += y;
			y = 0;
		}
		if(x + w > sw) w = sw - x;
		if(y + h > sh) h = sh - y;
		if(px + w > tw) w = tw - px;
		if(py + h > th) h = th - py;
		if(w <= 0 || h <= 0) return;
		if(sc == 8 && dc == 8) {
			var f = this.qContext.globalCompositeOperation, s = this.qContext.fillStyle;
			this.qContext.globalCompositeOperation = "darker";
			i = 0;
			while(i++ < 8) this.qContext.drawImage(this.component,px,py,w,h,px,py,w,h);
			this.qContext.globalCompositeOperation = "destination-over";
			this.qContext.fillStyle = "black";
			this.qContext.fillRect(x,y,w,h);
			this.qContext.globalCompositeOperation = "destination-atop";
			this.qContext.drawImage(o.handle(),x,y,w,h,px,py,w,h);
			this.qContext.globalCompositeOperation = f;
			this.qContext.fillStyle = s;
		} else {
			var wasCanvas = (this.qSync & 3) != 2, ds, dd;
			this.lock();
			dd = this.qImageData.data;
			o.lock();
			ds = o.qImageData.data;
			sc = sc == 8?3:sc == 4?2:sc == 2?1:sc == 1?0:-1;
			dc = dc == 8?3:dc == 4?2:dc == 2?1:dc == 1?0:-1;
			if(sc < 0 || dc < 0) return;
			j = py + h;
			v = y + h;
			while(--v >= y) {
				--j;
				c = w;
				i = (px + tw * j) * 4 + dc;
				u = (x + sw * v) * 4 + sc;
				while(c-- > 0) {
					dd[u] = ds[i];
					i += 4;
					u += 4;
				}
			}
			this.qSync |= 6;
			if(wasCanvas) this.unlock();
		}
	}
	,colorTransform: function(q,o) {
		var x = ~~q.x, y = ~~q.y, w = ~~q.width, h = ~~q.height, tw = this.component.width, th = this.component.height, f = this.qContext.globalCompositeOperation, a = this.qContext.globalAlpha;
		if(x < 0) {
			w += x;
			x = 0;
		}
		if(y < 0) {
			h += y;
			y = 0;
		}
		if(x + w > tw) w = tw - x;
		if(y + h > th) h = th - y;
		if(w <= 0 || h <= 0) return;
		if(o.isAlphaMultiplier()) {
			this.syncCanvas();
			this.qContext.globalCompositeOperation = "copy";
			this.qContext.globalAlpha *= o.alphaMultiplier;
			this.qContext.drawImage(this.component,x,y,w,h,x,y,w,h);
			this.qSync |= 5;
		} else if(o.isColorSetter()) {
			var s = this.qContext.fillStyle;
			if(o.alphaMultiplier != 0) {
				this.qContext.globalCompositeOperation = "source-in";
				this.qContext.fillStyle = "rgb(" + ~~o.redOffset + "," + ~~o.greenOffset + "," + ~~o.blueOffset + ")";
				this.qContext.fillRect(x,y,w,h);
				this.qContext.globalCompositeOperation = "copy";
				this.qContext.globalAlpha = o.alphaMultiplier;
				this.qContext.drawImage(this.component,x,y,w,h,x,y,w,h);
			} else {
				this.qContext.globalCompositeOperation = "copy";
				this.qContext.fillStyle = "rgba(" + ~~o.redOffset + "," + ~~o.greenOffset + "," + ~~o.blueOffset + "," + ~~o.alphaOffset + ")";
				this.qContext.fillRect(x,y,w,h);
			}
			this.qContext.fillStyle = s;
		} else {
			var wasCanvas = (this.qSync & 3) != 2;
			this.lock();
			var d = this.qImageData.data, c = tw * th * 4, i = c, v, rm = o.redMultiplier, gm = o.greenMultiplier, bm = o.blueMultiplier, am = o.alphaMultiplier, ro = o.redOffset, go = o.greenOffset, bo = o.blueOffset, ao = o.alphaOffset;
			if(x == 0 && y == 0 && w == tw && h == th) while((i -= 4) >= 0) {
				if((v = d[i + 3]) > 0) d[i + 3] = (v = v * am + ao) < 0?0:v > 255?255:~~v;
				d[i + 2] = (v = d[i + 2] * bm + bo) < 0?0:v > 255?255:~~v;
				d[i + 1] = (v = d[i + 1] * gm + go) < 0?0:v > 255?255:~~v;
				d[i] = (v = d[i] * rm + ro) < 0?0:v > 255?255:~~v;
			} else {
				var px, py = y - 1, pb = y + h, pr;
				while(++py < pb) {
					i = tw * py + x - 1 << 2;
					pr = i + w * 4;
					while((i += 4) < pr) {
						if((v = d[i + 3]) > 0) d[i + 3] = (v = v * am + ao) < 0?0:v > 255?255:~~v;
						d[i + 2] = (v = d[i + 2] * bm + bo) < 0?0:v > 255?255:~~v;
						d[i + 1] = (v = d[i + 1] * gm + go) < 0?0:v > 255?255:~~v;
						d[i] = (v = d[i] * rm + ro) < 0?0:v > 255?255:~~v;
					}
				}
			}
			this.qSync |= 6;
			if(wasCanvas) this.unlock();
		}
		this.qContext.globalCompositeOperation = f;
		this.qContext.globalAlpha = a;
	}
	,floodFill: function(fx,fy,fc) {
		var wasCanvas = (this.qSync & 3) == 1;
		this.lock();
		var q = [fx | fy << 16], c = 1, d = this.qImageData.data, zr, zg, zb, za, fr, fg, fb, fa, x, y, p, o = [], r, w = this.component.width, h = this.component.height;
		p = fy * this.component.width + fx << 4;
		zr = d[p];
		zg = d[p + 1];
		zb = d[p + 2];
		za = d[p + 3];
		fa = fc >>> 24;
		fr = fc >> 16 & 255;
		fg = fc >> 8 & 255;
		fb = fc & 255;
		y = -1;
		while(++y < h) {
			o.push(r = []);
			x = 0;
			while(x < w) {
				r.push(0);
				x += 32;
			}
		}
		while(c > 0) {
			p = q[--c];
			x = p & 65535;
			y = p >>> 16;
			if(x < 0 || y < 0 || x >= w || y >= h) continue;
			if((o[y][x >> 5] >> (x & 31) & 1) != 0) continue;
			o[y][x >> 5] |= 1 << (x & 31);
			p = y * this.component.width + x << 2;
			if(d[p] == zr && d[p + 1] == zg && d[p + 2] == zb && d[p + 3] == za) {
				d[p] = fr;
				d[p + 1] = fg;
				d[p + 2] = fb;
				d[p + 3] = fa;
				if((p = x + 1) < w && (o[y][p >> 5] >> (p & 31) & 1) == 0) q[c++] = y << 16 | p;
				if(x > 0 && (o[y][(p = x - 1) >> 5] >> (p & 31) & 1) == 0) q[c++] = y << 16 | p;
				if((p = y + 1) < h && (o[p][x >> 5] >> (x & 31) & 1) == 0) q[c++] = p << 16 | x;
				if(y > 0 && (o[p = y - 1][x >> 5] >> (x & 31) & 1) == 0) q[c++] = p << 16 | x;
			}
		}
		this.qSync |= 6;
		if(wasCanvas) this.unlock();
	}
	,getColorBoundsRect: function(mask,color,findColor) {
		if(findColor == null) findColor = true;
		this.syncData();
		var data = this.qImageData.data;
		var minX = this.component.width, minY = this.component.height, maxX = 0, maxY = 0, len = data.length, i, px, x, y;
		i = 0;
		while(i < len) {
			px = (this.qTransparent?data[i + 3] << 24:-16777216) | (data[i] & 255) << 16 | (data[i + 1] & 255) << 8 | data[i + 2] & 255;
			if(px == color == findColor) {
				x = Math.floor((i >> 2) % this.component.width);
				y = Math.floor((i >> 2) / this.component.width);
				if(x < minX) minX = x;
				if(x > maxX) maxX = x;
				if(y < minY) minY = y;
				if(y > maxY) maxY = y;
			}
			i += 4;
		}
		if(minX <= maxX && minY <= maxY) return new flash.geom.Rectangle(minX,minY,maxX - minX + 1,maxY - minY + 1);
		if(!findColor) return new flash.geom.Rectangle(0,0,this.component.width,this.component.height);
		return new flash.geom.Rectangle(0,0,0,0);
	}
	,setPixel32: function(x,y,color) {
		if(x < 0 || y < 0 || x >= this.component.width || y >= this.component.height) return;
		if((this.qSync & 3) != 2) {
			this.qPixel.data[0] = color >>> 16 & 255;
			this.qPixel.data[1] = color >>> 8 & 255;
			this.qPixel.data[2] = color & 255;
			this.qPixel.data[3] = color >>> 24 & 255;
			this.qContext.putImageData(this.qPixel,x,y);
			this.qSync |= 5;
		} else {
			var o = y * this.component.width + x << 2;
			this.qImageData.data[o] = color >>> 16 & 255;
			this.qImageData.data[o + 1] = color >>> 8 & 255;
			this.qImageData.data[o + 2] = color & 255;
			this.qImageData.data[o + 3] = color >>> 24 & 255;
			this.qSync |= 6;
		}
	}
	,setPixel: function(x,y,color) {
		if(x < 0 || y < 0 || x >= this.component.width || y >= this.component.height) return;
		if((this.qSync & 3) != 2) {
			this.qPixel.data[0] = color >>> 16 & 255;
			this.qPixel.data[1] = color >>> 8 & 255;
			this.qPixel.data[2] = color & 255;
			this.qPixel.data[3] = 255;
			this.qContext.putImageData(this.qPixel,x,y);
			this.qSync |= 5;
		} else {
			var o = y * this.component.width + x << 2;
			this.qImageData.data[o] = color >>> 16 & 255;
			this.qImageData.data[o + 1] = color >>> 8 & 255;
			this.qImageData.data[o + 2] = color & 255;
			this.qImageData.data[o + 3] = 255;
			this.qSync |= 6;
		}
	}
	,getPixel32: function(x,y) {
		if(x < 0 || y < 0 || x >= this.component.width || y >= this.component.height) return 0;
		if((this.qSync & 3) == 1) {
			var d = this.qContext.getImageData(x,y,1,1).data;
			return (this.qTransparent?d[3] << 24:-16777216) | d[0] << 16 | d[1] << 8 | d[2];
		} else {
			var o = y * this.component.width + x << 2;
			return (this.qTransparent?this.qImageData.data[o + 3] << 24:-16777216) | this.qImageData.data[o] << 16 | this.qImageData.data[o + 1] << 8 | this.qImageData.data[o + 2];
		}
	}
	,getPixel: function(x,y) {
		if(x < 0 || y < 0 || x >= this.component.width || y >= this.component.height) return 0;
		if((this.qSync & 3) == 1) {
			var d = this.qContext.getImageData(x,y,1,1).data;
			return d[0] << 16 | d[1] << 8 | d[2];
		} else {
			var o = y * this.component.width + x << 2;
			return this.qImageData.data[o] << 16 | this.qImageData.data[o + 1] << 8 | this.qImageData.data[o + 2];
		}
	}
	,unlock: function() {
		this.syncCanvas();
	}
	,lock: function() {
		this.syncData();
	}
	,draw: function(source,matrix,colorTransform,blendMode,clipRect,smoothing) {
		this.syncCanvas();
		var a = 0;
		this.qContext.save();
		if(colorTransform != null) {
			a = colorTransform.alphaMultiplier;
			colorTransform.alphaMultiplier = 1;
			this.qContext.globalAlpha *= a;
		}
		if(clipRect != null) {
			this.qContext.beginPath();
			this.qContext.rect(clipRect.x,clipRect.y,clipRect.width,clipRect.height);
			this.qContext.clip();
			this.qContext.beginPath();
		}
		if(smoothing != null) flash.display.BitmapData.setSmoothing(this.qContext,smoothing);
		source.drawToSurface(this.handle(),this.qContext,matrix,colorTransform,blendMode,clipRect,null);
		this.qContext.restore();
		if(colorTransform != null) colorTransform.alphaMultiplier = a;
		this.qSync |= 5;
	}
	,copyPixels: function(sourceBitmapData,sourceRect,destPoint,alphaBitmapData,alphaPoint,mergeAlpha) {
		if(mergeAlpha == null) mergeAlpha = false;
		this.syncCanvas();
		if(alphaBitmapData != null) throw "alphaBitmapData is not supported yet.";
		var bit = sourceBitmapData.handle(), bw, bh, tw = this.component.width, th = this.component.height;
		if(bit == null || (bw = bit.width) <= 0 || (bh = bit.height) <= 0) return;
		var dx = ~~destPoint.x, dy = ~~destPoint.y, sx, sy, sw, sh;
		if(sourceRect != null) {
			sx = sourceRect.x;
			sy = sourceRect.y;
			sw = sourceRect.width;
			sh = sourceRect.height;
			if(sx < 0) {
				sw += sx;
				sx = 0;
			}
			if(sy < 0) {
				sh += sy;
				sy = 0;
			}
			if(sx + sw > bw) sw = bw - sx;
			if(sy + sh > bh) sh = bh - sy;
		} else {
			sx = sy = 0;
			sw = bw;
			sh = bh;
		}
		if(dx < 0) {
			sw += dx;
			sx -= dx;
			dx = 0;
		}
		if(dy < 0) {
			sh += dy;
			sy -= dy;
			dy = 0;
		}
		if(dx + sw > tw) sw = tw - dx;
		if(dy + sh > th) sh = th - dy;
		if(sw <= 0 || sh <= 0) return;
		if(this.qTransparent && !mergeAlpha) this.qContext.clearRect(dx,dy,sw,sh);
		this.qContext.drawImage(bit,sx,sy,sw,sh,dx,dy,sw,sh);
		this.qSync |= 5;
	}
	,drawToSurface: function(cnv,ctx,matrix,ctr,blendMode,clipRect,smoothing) {
		ctx.save();
		if(smoothing != null && ctx.imageSmoothingEnabled != smoothing) flash.display.BitmapData.setSmoothing(ctx,smoothing);
		if(matrix != null) {
			if(matrix.a == 1 && matrix.b == 0 && matrix.c == 0 && matrix.d == 1) ctx.translate(matrix.tx,matrix.ty); else ctx.setTransform(matrix.a,matrix.b,matrix.c,matrix.d,matrix.tx,matrix.ty);
		}
		ctx.drawImage(this.handle(),0,0);
		ctx.restore();
	}
	,getTick: function() {
		return this.qTick;
	}
	,getTime: function() {
		return this.qTime;
	}
	,handle: function() {
		this.syncCanvas();
		if((this.qSync & 4) != 0) {
			this.qTick++;
			this.qTime = new Date().getTime();
			this.qSync &= -5;
		}
		return this.component;
	}
	,dispose: function() {
		this.component.width = this.component.height = 1;
		this.qImageData = null;
		this.qSync = 5;
	}
	,clone: function() {
		this.syncCanvas();
		var r = new flash.display.BitmapData(this.component.width,this.component.height,this.qTransparent,0);
		r.qContext.drawImage(this.component,0,0);
		r.qSync |= 5;
		return r;
	}
	,fillRect: function(area,color) {
		if(area == null || area.width <= 0 || area.height <= 0) return;
		if(area.equals(this.rect) && this.qTransparent && (color & -16777216) == 0) {
			this.component.width = this.component.width;
			return;
		}
		if(!this.qTransparent) color |= -16777216; else if((color & -16777216) != -16777216) this.qContext.clearRect(area.x,area.y,area.width,area.height);
		if((color & -16777216) != 0) {
			this.qContext.fillStyle = flash.display.BitmapData.makeColor(color);
			this.qContext.fillRect(area.x,area.y,area.width,area.height);
		}
		this.qSync |= 5;
	}
	,__class__: flash.display.BitmapData
	,__properties__: {get_width:"get_width",get_height:"get_height"}
}
flash.display.BitmapDataChannel = function() { }
$hxClasses["flash.display.BitmapDataChannel"] = flash.display.BitmapDataChannel;
flash.display.BitmapDataChannel.__name__ = ["flash","display","BitmapDataChannel"];
flash.display.BlendMode = $hxClasses["flash.display.BlendMode"] = { __ename__ : true, __constructs__ : ["ADD","ALPHA","DARKEN","DIFFERENCE","ERASE","HARDLIGHT","INVERT","LAYER","LIGHTEN","MULTIPLY","NORMAL","OVERLAY","SCREEN","SUBTRACT"] }
flash.display.BlendMode.ADD = ["ADD",0];
flash.display.BlendMode.ADD.toString = $estr;
flash.display.BlendMode.ADD.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.ALPHA = ["ALPHA",1];
flash.display.BlendMode.ALPHA.toString = $estr;
flash.display.BlendMode.ALPHA.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.DARKEN = ["DARKEN",2];
flash.display.BlendMode.DARKEN.toString = $estr;
flash.display.BlendMode.DARKEN.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.DIFFERENCE = ["DIFFERENCE",3];
flash.display.BlendMode.DIFFERENCE.toString = $estr;
flash.display.BlendMode.DIFFERENCE.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.ERASE = ["ERASE",4];
flash.display.BlendMode.ERASE.toString = $estr;
flash.display.BlendMode.ERASE.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.HARDLIGHT = ["HARDLIGHT",5];
flash.display.BlendMode.HARDLIGHT.toString = $estr;
flash.display.BlendMode.HARDLIGHT.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.INVERT = ["INVERT",6];
flash.display.BlendMode.INVERT.toString = $estr;
flash.display.BlendMode.INVERT.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.LAYER = ["LAYER",7];
flash.display.BlendMode.LAYER.toString = $estr;
flash.display.BlendMode.LAYER.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.LIGHTEN = ["LIGHTEN",8];
flash.display.BlendMode.LIGHTEN.toString = $estr;
flash.display.BlendMode.LIGHTEN.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.MULTIPLY = ["MULTIPLY",9];
flash.display.BlendMode.MULTIPLY.toString = $estr;
flash.display.BlendMode.MULTIPLY.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.NORMAL = ["NORMAL",10];
flash.display.BlendMode.NORMAL.toString = $estr;
flash.display.BlendMode.NORMAL.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.OVERLAY = ["OVERLAY",11];
flash.display.BlendMode.OVERLAY.toString = $estr;
flash.display.BlendMode.OVERLAY.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.SCREEN = ["SCREEN",12];
flash.display.BlendMode.SCREEN.toString = $estr;
flash.display.BlendMode.SCREEN.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.SUBTRACT = ["SUBTRACT",13];
flash.display.BlendMode.SUBTRACT.toString = $estr;
flash.display.BlendMode.SUBTRACT.__enum__ = flash.display.BlendMode;
flash.display._CapsStyle = {}
flash.display._CapsStyle.CapsStyle_Impl_ = function() { }
$hxClasses["flash.display._CapsStyle.CapsStyle_Impl_"] = flash.display._CapsStyle.CapsStyle_Impl_;
flash.display._CapsStyle.CapsStyle_Impl_.__name__ = ["flash","display","_CapsStyle","CapsStyle_Impl_"];
flash.display._CapsStyle.CapsStyle_Impl_._new = function(s) {
	return s;
}
flash.display._CapsStyle.CapsStyle_Impl_.toString = function(this1) {
	return this1;
}
flash.display._CapsStyle.CapsStyle_Impl_.fromString = function(s) {
	return s;
}
flash.display.Graphics = function() {
	this.rgPending = false;
	this.synced = true;
	this.component = flash.Lib.jsCanvas();
	this.component.setAttribute("node",Type.getClassName(Type.getClass(this)));
	this.context = this.component.getContext("2d");
	this.context.save();
	this.bounds = new flash.geom.Rectangle();
	this.resetBounds();
	this.rec = [];
	this.lineWidth = this.len = 0;
};
$hxClasses["flash.display.Graphics"] = flash.display.Graphics;
flash.display.Graphics.__name__ = ["flash","display","Graphics"];
flash.display.Graphics.__interfaces__ = [flash.display.IBitmapDrawable];
flash.display.Graphics.prototype = {
	render: function(cnv,ctx) {
		var f = 0, p = -1, v, m = this._drawMatrix, n = 0, tex = null;
		if(m == null) this._drawMatrix = m = new flash.geom.Matrix();
		try {
			while(++p < this.len) {
				var _g = v = this.rec[p];
				switch(_g) {
				case 0:
					throw "__break__";
					break;
				case 1:
					if(n > 0) f = this._closePath(cnv,ctx,f,m,tex);
					ctx.lineWidth = v = this.rec[++p];
					if(v > 0) {
						f |= 2;
						ctx.strokeStyle = this.rec[++p];
						ctx.lineCap = (v = this.rec[++p]) == 2?"butt":v == 1?"square":"round";
						ctx.lineJoin = (v = this.rec[++p]) == 2?"bevel":v == 1?"miter":"round";
					} else {
						f &= -3;
						ctx.strokeStyle = null;
					}
					break;
				case 2:case 3:
					if(n > 0) f = this._closePath(cnv,ctx,f,m,tex);
					f |= 1;
					if(v == 3) {
						tex = this.rec[++p].handle();
						var r = this.rec[++p];
						if(this.rec[++p]) {
							if(r) f |= 8; else f &= -9;
							m.a = this.rec[++p];
							m.b = this.rec[++p];
							m.c = this.rec[++p];
							m.d = this.rec[++p];
							m.tx = this.rec[++p];
							m.ty = this.rec[++p];
							f |= 4;
						} else {
							ctx.fillStyle = ctx.createPattern(tex,r?"repeat":"no-repeat");
							f &= -5;
						}
					} else {
						ctx.fillStyle = this.rec[++p];
						f &= -5;
					}
					n = 0;
					break;
				case 9:
					if(n > 0) {
						f = this._closePath(cnv,ctx,f,m,tex);
						n = 0;
					}
					break;
				case 10:
					ctx.moveTo(this.rec[++p],this.rec[++p]);
					n++;
					break;
				case 11:
					ctx.lineTo(this.rec[++p],this.rec[++p]);
					n++;
					break;
				case 12:
					ctx.quadraticCurveTo(this.rec[++p],this.rec[++p],this.rec[++p],this.rec[++p]);
					n++;
					break;
				case 13:
					var x = this.rec[++p], y = this.rec[++p], w = this.rec[++p], h = this.rec[++p];
					ctx.rect(x,y,w,h);
					n++;
					break;
				case 14:
					var x = this.rec[++p], y = this.rec[++p], r = this.rec[++p];
					if(r < 0) r = -r;
					if(r != 0) ctx.arc(x,y,r,0,Math.PI * 2,true);
					n++;
					break;
				case 17:
					var x = this.rec[++p], y = this.rec[++p], w = this.rec[++p], h = this.rec[++p], x1 = x + w / 2, y1 = y + h / 2, x2 = x + w, y2 = y + h, m1 = 0.275892, xm = w * m1, ym = h * m1;
					ctx.moveTo(x1,y);
					ctx.bezierCurveTo(x1 + xm,y,x2,y1 - ym,x2,y1);
					ctx.bezierCurveTo(x2,y1 + ym,x1 + xm,y2,x1,y2);
					ctx.bezierCurveTo(x1 - xm,y2,x,y1 + ym,x,y1);
					ctx.bezierCurveTo(x,y1 - ym,x1 - xm,y,x1,y);
					n++;
					break;
				case 15:
					var x = this.rec[++p], y = this.rec[++p], w = this.rec[++p], h = this.rec[++p], u = this.rec[++p], q = this.rec[++p];
					if(q == null || $bind(ctx,ctx.quadraticCurveTo) == null) {
						ctx.moveTo(x + u,y + h);
						ctx.arcTo(x + w - u,y + h - u,x + w,y + h - u,u);
						ctx.arcTo(x + w,y + u,x + w - u,y,u);
						ctx.arcTo(x + u,y,x,y + u,u);
						ctx.arcTo(x + u,y + h - u,x + u,y + h,u);
					} else {
						ctx.moveTo(x + u,y + h);
						ctx.lineTo(x + w - u,y + h);
						ctx.quadraticCurveTo(x + w,y + h,x + w,y + h - q);
						ctx.lineTo(x + w,y + q);
						ctx.quadraticCurveTo(x + w,y,x + w - u,y);
						ctx.lineTo(x + u,y);
						ctx.quadraticCurveTo(x,y,x,y + q);
						ctx.lineTo(x,y + h - q);
						ctx.quadraticCurveTo(x,y + h,x + u,y + h);
					}
					n++;
					break;
				case 16:
					var tex1 = this.rec[++p], d = tex1.handle(), fx = this.rec[++p], fs = (fx & 1) != 0, fr = (fx & 2) != 0, fc = (fx & 4) != 0, fa = (fx & 8) != 0, fm = (fx & 16) != 0, c = this.rec[++p] - 1, tx, ty, ox, oy, rx, ry, rw, rh;
					ctx.save();
					ctx.globalCompositeOperation = (fx & 65536) != 0?"lighter":"source-over";
					while(p < c) {
						tx = this.rec[++p];
						ty = this.rec[++p];
						ox = this.rec[++p];
						oy = this.rec[++p];
						rx = this.rec[++p];
						ry = this.rec[++p];
						rw = this.rec[++p];
						rh = this.rec[++p];
						ctx.save();
						if(fm) ctx.transform(this.rec[++p],this.rec[++p],this.rec[++p],this.rec[++p],tx,ty); else {
							ctx.translate(tx,ty);
							if(fs) ctx.scale(v = this.rec[++p],v);
							if(fr) ctx.rotate(this.rec[++p]);
						}
						if(fc) p += 3;
						if(fa) ctx.globalAlpha = this.rec[++p];
						ctx.drawImage(d,rx,ry,rw,rh,-ox,-oy,rw,rh);
						ctx.restore();
					}
					ctx.restore();
					break;
				default:
					if(console) console.log("Unknown operation: " + Std.string(v));
					throw "__break__";
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		if(n > 0) f = this._closePath(cnv,ctx,f,m,tex);
	}
	,_closePath: function(cnv,ctx,f,m,texture) {
		if(f & 1) {
			ctx.closePath();
			if(f & 4) {
				ctx.save();
				ctx.transform(m.a,m.b,m.c,m.d,m.tx,m.ty);
				ctx.fillStyle = ctx.createPattern(texture,f & 8?"repeat":"no-repeat");
				ctx.fill();
				ctx.restore();
			} else ctx.fill();
		}
		if(f & 2) ctx.stroke();
		ctx.beginPath();
		return f;
	}
	,drawToSurface: function(cnv,ctx,mtx,ctr,blendMode,clipRect,smoothing) {
		ctx.save();
		if(mtx != null) ctx.transform(mtx.a,mtx.b,mtx.c,mtx.d,mtx.tx,mtx.ty);
		this.render(cnv,ctx);
		ctx.restore();
	}
	,rgba: function(c,a) {
		return "rgba(" + (c >> 16 & 255) + ", " + (c >> 8 & 255) + ", " + (c & 255) + ", " + a.toFixed(4) + ")";
	}
	,drawEllipse: function(x,y,w,h) {
		this.rec[this.len++] = 17;
		this.rec[this.len++] = x;
		this.rec[this.len++] = y;
		this.rec[this.len++] = w;
		this.rec[this.len++] = h;
		this.grab(x,y,x + w,y + h);
	}
	,drawCircle: function(x,y,r) {
		this.rec[this.len++] = 14;
		this.rec[this.len++] = x;
		this.rec[this.len++] = y;
		this.rec[this.len++] = r;
		var r1 = r;
		r1 += this.lineWidth / 2;
		this.grab(x - r1,y - r1,x + r1,y + r1);
	}
	,drawRoundRect: function(x,y,w,h,r,q) {
		this.rec[this.len++] = 15;
		this.rec[this.len++] = x;
		this.rec[this.len++] = y;
		this.rec[this.len++] = w;
		this.rec[this.len++] = h;
		this.rec[this.len++] = r;
		this.rec[this.len++] = q;
		var r1 = this.lineWidth / 2;
		this.grab(x - r1,y - r1,x + w + r1,y + h + r1);
	}
	,drawRect: function(x,y,w,h) {
		this.rec[this.len++] = 13;
		this.rec[this.len++] = x;
		this.rec[this.len++] = y;
		this.rec[this.len++] = w;
		this.rec[this.len++] = h;
		var r = this.lineWidth / 2;
		this.grab(x - r,y - r,x + w + r,y + h + r);
	}
	,curveTo: function(u,v,x,y) {
		this.rec[this.len++] = 12;
		this.rec[this.len++] = u;
		this.rec[this.len++] = v;
		this.rec[this.len++] = x;
		this.rec[this.len++] = y;
		var r = this.lineWidth / 2;
		this.grab(x - r,y - r,x + r,y + r);
	}
	,lineTo: function(x,y) {
		this.rec[this.len++] = 11;
		this.rec[this.len++] = x;
		this.rec[this.len++] = y;
		var r = this.lineWidth / 2;
		this.grab(x - r,y - r,x + r,y + r);
	}
	,moveTo: function(x,y) {
		this.rec[this.len++] = 10;
		this.rec[this.len++] = x;
		this.rec[this.len++] = y;
		var r = this.lineWidth / 2;
		this.grab(x - r,y - r,x + r,y + r);
	}
	,endFill: function() {
		this.rec[this.len++] = 9;
		this.invalidate();
	}
	,beginBitmapFill: function(bitmap,m,repeat,smooth) {
		this.rec[this.len++] = 3;
		this.rec[this.len++] = bitmap;
		this.rec[this.len++] = repeat != null?repeat:true;
		if(this.rec[this.len++] = m != null) {
			this.rec[this.len++] = m.a;
			this.rec[this.len++] = m.b;
			this.rec[this.len++] = m.c;
			this.rec[this.len++] = m.d;
			this.rec[this.len++] = m.tx;
			this.rec[this.len++] = m.ty;
		}
	}
	,beginFill: function(c,a) {
		if(a == null) a = 1;
		if(c == null) c = 0;
		this.rec[this.len++] = 2;
		this.rec[this.len++] = flash.Lib.rgbf(c,a);
	}
	,lineStyle: function(w,c,a,ph,sm,cs,js,ml) {
		this.rec[this.len++] = 1;
		this.rec[this.len++] = this.lineWidth = w > 0?w:0;
		if(w > 0) {
			this.rec[this.len++] = flash.Lib.rgbf(c != null?c:0,a != null?a:1);
			this.rec[this.len++] = cs == "none"?2:cs == "square"?1:0;
			this.rec[this.len++] = js == "bevel"?2:js == "miter"?1:0;
		}
	}
	,clear: function() {
		var i = 0;
		while(i < this.len) this.rec[i++] = 0;
		this.lineWidth = this.len = 0;
		this.resetBounds();
		this.invalidate();
	}
	,invalidate: function() {
		if(this.synced) {
			this.synced = false;
			if(!this.rgPending && this.displayObject != null && this.displayObject.get_stage() != null) {
				flash.Lib.schedule($bind(this,this.regenerate));
				this.rgPending = true;
			}
		}
	}
	,grab: function(x,y,r,b) {
		var i;
		if(x < (i = this.bounds.x)) {
			i = i - x;
			this.bounds.x -= i;
			this.bounds.width += i;
		}
		if(y < (i = this.bounds.y)) {
			i = i - y;
			this.bounds.y -= i;
			this.bounds.height += i;
		}
		if(r > (i = this.bounds.get_right())) this.bounds.width += r - i;
		if(b > (i = this.bounds.get_bottom())) this.bounds.height += b - i;
		this.invalidate();
	}
	,resetBounds: function() {
		this.bounds.setVoid();
		this.invalidate();
	}
	,set_displayObject: function(v) {
		if(this.displayObject != v) {
			this.displayObject = v;
			if(!this.synced) flash.Lib.schedule($bind(this,this.regenerate));
		}
		return v;
	}
	,regenerate: function() {
		var o = this.component, s = this.component.style, q = this.context, b = this.bounds, bx = ~~(b.x - 2), by = ~~(b.y - 2), bw = Math.ceil(b.width + 4), bh = Math.ceil(b.height + 4);
		this.synced = true;
		this.rgPending = false;
		if(b.width <= 0 || b.height <= 0) {
			o.width = o.height = 1;
			s.top = s.left = "0";
			return;
		}
		if(this.compX != bx || this.compY != by) {
			s.left = bx + "px";
			s.top = by + "px";
		}
		if(bw != o.width || bh != o.height) {
			o.width = bw;
			o.height = bh;
		} else q.clearRect(0,0,o.width,o.height);
		q.save();
		q.translate(-bx,-by);
		this.render(o,q);
		q.restore();
	}
	,__class__: flash.display.Graphics
	,__properties__: {set_displayObject:"set_displayObject"}
}
flash.display._JointStyle = {}
flash.display._JointStyle.JointStyle_Impl_ = function() { }
$hxClasses["flash.display._JointStyle.JointStyle_Impl_"] = flash.display._JointStyle.JointStyle_Impl_;
flash.display._JointStyle.JointStyle_Impl_.__name__ = ["flash","display","_JointStyle","JointStyle_Impl_"];
flash.display._JointStyle.JointStyle_Impl_._new = function(s) {
	return s;
}
flash.display._JointStyle.JointStyle_Impl_.toString = function(this1) {
	return this1;
}
flash.display._JointStyle.JointStyle_Impl_.fromString = function(s) {
	return s;
}
flash.display.Loader = function() {
	flash.display.Sprite.call(this);
	this.contentLoaderInfo = flash.display.LoaderInfo.create(this);
};
$hxClasses["flash.display.Loader"] = flash.display.Loader;
flash.display.Loader.__name__ = ["flash","display","Loader"];
flash.display.Loader.__super__ = flash.display.Sprite;
flash.display.Loader.prototype = $extend(flash.display.Sprite.prototype,{
	handleLoad: function(e) {
		e.set_currentTarget(this);
		this.contentLoaderInfo.removeEventListener("complete",$bind(this,this.handleLoad));
	}
	,loadBytes: function(buffer) {
		var _g = this;
		try {
			this.contentLoaderInfo.addEventListener("complete",$bind(this,this.handleLoad),false);
			flash.display.BitmapData.loadFromBytes(buffer,null,function(bmd) {
				_g.content = new flash.display.Bitmap(bmd);
				_g.contentLoaderInfo.content = _g.content;
				_g.addChild(_g.content);
				var evt = new flash.events.Event("complete");
				evt.set_currentTarget(_g);
				_g.contentLoaderInfo.dispatchEvent(evt);
			});
		} catch( e ) {
			console.log("Error " + Std.string(e));
			var evt = new flash.events.IOErrorEvent("ioError");
			evt.set_currentTarget(this);
			this.contentLoaderInfo.dispatchEvent(evt);
		}
	}
	,load: function(request,context) {
		var extension = "", i;
		var parts = request.url.split(".");
		if(parts.length > 0) extension = parts[parts.length - 1].toLowerCase();
		var transparent = true;
		this.contentLoaderInfo.url = request.url;
		this.contentLoaderInfo.contentType = (function($this) {
			var $r;
			switch(extension) {
			case "swf":
				$r = "application/x-shockwave-flash";
				break;
			case "jpg":case "jpeg":
				$r = (function($this) {
					var $r;
					transparent = false;
					$r = "image/jpeg";
					return $r;
				}($this));
				break;
			case "png":
				$r = "image/png";
				break;
			case "gif":
				$r = "image/gif";
				break;
			default:
				$r = (function($this) {
					var $r;
					throw "Unrecognized file " + request.url;
					return $r;
				}($this));
			}
			return $r;
		}(this));
		this.mImage = new flash.display.BitmapData(0,0,transparent);
		try {
			this.contentLoaderInfo.addEventListener("complete",$bind(this,this.handleLoad),false);
			this.mImage.nmeLoadFromFile(request.url,this.contentLoaderInfo);
			this.content = new flash.display.Bitmap(this.mImage);
			this.contentLoaderInfo.content = this.content;
			this.addChild(this.content);
		} catch( e ) {
			console.log("Error " + Std.string(e));
			var evt = new flash.events.IOErrorEvent("ioError");
			evt.set_currentTarget(this);
			this.contentLoaderInfo.dispatchEvent(evt);
			return;
		}
		if(this.mShape == null) {
			this.mShape = new flash.display.Shape();
			this.addChild(this.mShape);
		}
	}
	,__class__: flash.display.Loader
});
flash.display.LoaderInfo = function() {
	flash.events.EventDispatcher.call(this);
	this.bytesLoaded = this.bytesTotal = 0;
	this.childAllowsParent = true;
	this.parameters = { };
};
$hxClasses["flash.display.LoaderInfo"] = flash.display.LoaderInfo;
flash.display.LoaderInfo.__name__ = ["flash","display","LoaderInfo"];
flash.display.LoaderInfo.create = function(o) {
	var r = new flash.display.LoaderInfo();
	if(o != null) r.loader = o; else r.url = "";
	return r;
}
flash.display.LoaderInfo.__super__ = flash.events.EventDispatcher;
flash.display.LoaderInfo.prototype = $extend(flash.events.EventDispatcher.prototype,{
	__class__: flash.display.LoaderInfo
});
flash.display.MovieClip = function() {
	flash.display.Sprite.call(this);
	this.enabled = true;
	this.qIndex = this.qTotal = 0;
	this.loaderInfo = flash.display.LoaderInfo.create();
};
$hxClasses["flash.display.MovieClip"] = flash.display.MovieClip;
flash.display.MovieClip.__name__ = ["flash","display","MovieClip"];
flash.display.MovieClip.__super__ = flash.display.Sprite;
flash.display.MovieClip.prototype = $extend(flash.display.Sprite.prototype,{
	get_totalFrames: function() {
		return this.qTotal;
	}
	,get_framesLoaded: function() {
		return this.qTotal;
	}
	,get_currentFrame: function() {
		return this.qIndex;
	}
	,stop: function() {
	}
	,prevFrame: function() {
	}
	,play: function() {
	}
	,nextFrame: function() {
	}
	,gotoAndStop: function(v,o) {
	}
	,gotoAndPlay: function(v,o) {
	}
	,__class__: flash.display.MovieClip
	,__properties__: $extend(flash.display.Sprite.prototype.__properties__,{get_currentFrame:"get_currentFrame",get_framesLoaded:"get_framesLoaded",get_totalFrames:"get_totalFrames"})
});
flash.display.Shape = function() {
	(this.graphics = new flash.display.Graphics()).set_displayObject(this);
	this.component = this.graphics.component;
	flash.display.DisplayObject.call(this);
};
$hxClasses["flash.display.Shape"] = flash.display.Shape;
flash.display.Shape.__name__ = ["flash","display","Shape"];
flash.display.Shape.__interfaces__ = [flash.display.IBitmapDrawable];
flash.display.Shape.__super__ = flash.display.DisplayObject;
flash.display.Shape.prototype = $extend(flash.display.DisplayObject.prototype,{
	set_stage: function(v) {
		var z = this.get_stage() == null && v != null, r = flash.display.DisplayObject.prototype.set_stage.call(this,v);
		if(z) this.graphics.invalidate();
		return r;
	}
	,drawToSurface: function(cnv,ctx,mtx,ctr,blendMode,clipRect,smoothing) {
		this.graphics.drawToSurface(cnv,ctx,mtx,ctr,blendMode,clipRect,smoothing);
	}
	,__class__: flash.display.Shape
});
flash.display.Stage = function() {
	this.isTouchScreen = false;
	this.frameRate = 0;
	flash.display.DisplayObjectContainer.call(this);
	var s = this.component.style;
	s.position = "absolute";
	s.overflow = "hidden";
	s.width = s.height = "100%";
	this.qTimeStamp = flash.Lib.getTimer();
	flash.Lib.requestAnimationFrame($bind(this,this.onAnimationFrame));
	this.mousePos = new flash.geom.Point();
	var o = js.Browser.window;
	o.addEventListener("mousemove",$bind(this,this.onMouseMove));
	o.addEventListener("touchstart",$bind(this,this.onTouch));
	o.addEventListener("touchend",$bind(this,this.onTouch));
	o.addEventListener("touchmove",$bind(this,this.onTouch));
};
$hxClasses["flash.display.Stage"] = flash.display.Stage;
flash.display.Stage.__name__ = ["flash","display","Stage"];
flash.display.Stage.__super__ = flash.display.DisplayObjectContainer;
flash.display.Stage.prototype = $extend(flash.display.DisplayObjectContainer.prototype,{
	onAnimationFrame: function() {
		var t = flash.Lib.getTimer();
		var i = -1;
		while(++i < flash.Lib.schLength) {
			flash.Lib.schList[i]();
			flash.Lib.schList[i] = null;
		}
		flash.Lib.schLength = 0;
		if(this.frameRate <= 0 || t - this.qTimeStamp >= 1000 / this.frameRate) {
			this.qTimeStamp = t;
			var e = new flash.events.Event("enterFrame");
			this.broadcastEvent(e);
		}
		flash.Lib.requestAnimationFrame($bind(this,this.onAnimationFrame));
	}
	,get_stage: function() {
		return this;
	}
	,get_stageHeight: function() {
		return js.Browser.window.innerHeight;
	}
	,get_stageWidth: function() {
		return js.Browser.window.innerWidth;
	}
	,set_focus: function(v) {
		if(v != null) v.giveFocus(); else this.component.blur();
		return v;
	}
	,get_focus: function() {
		var o = document.activeElement;
		return o != null && js.Boot.__instanceof(o = o.node,flash.display.InteractiveObject)?o:null;
	}
	,removeEventListener: function(type,listener,useCapture,priority,useWeakReference) {
		if(useWeakReference == null) useWeakReference = false;
		if(priority == null) priority = 0;
		if(useCapture == null) useCapture = false;
		var o = this.component;
		this.component = window;
		flash.display.DisplayObjectContainer.prototype.removeEventListener.call(this,type,listener,useCapture,priority,useWeakReference);
		this.component = o;
	}
	,addEventListener: function(type,listener,useCapture,priority,useWeakReference) {
		if(useWeakReference == null) useWeakReference = false;
		if(priority == null) priority = 0;
		if(useCapture == null) useCapture = false;
		var o = this.component;
		this.component = window;
		flash.display.DisplayObjectContainer.prototype.addEventListener.call(this,type,listener,useCapture,priority,useWeakReference);
		this.component = o;
	}
	,onMouseMove: function(e) {
		if(!this.isTouchScreen) {
			this.mousePos.x = e.pageX;
			this.mousePos.y = e.pageY;
		}
	}
	,onTouch: function(e) {
		this.isTouchScreen = true;
		if(e.targetTouches.length > 0) {
			this.mousePos.x = e.targetTouches[0].pageX;
			this.mousePos.y = e.targetTouches[0].pageY;
		}
		e.preventDefault();
	}
	,__class__: flash.display.Stage
	,__properties__: $extend(flash.display.DisplayObjectContainer.prototype.__properties__,{get_stageWidth:"get_stageWidth",get_stageHeight:"get_stageHeight",set_focus:"set_focus",get_focus:"get_focus"})
});
flash.display.StageAlign = $hxClasses["flash.display.StageAlign"] = { __ename__ : true, __constructs__ : ["TOP_RIGHT","TOP_LEFT","TOP","RIGHT","LEFT","BOTTOM_RIGHT","BOTTOM_LEFT","BOTTOM"] }
flash.display.StageAlign.TOP_RIGHT = ["TOP_RIGHT",0];
flash.display.StageAlign.TOP_RIGHT.toString = $estr;
flash.display.StageAlign.TOP_RIGHT.__enum__ = flash.display.StageAlign;
flash.display.StageAlign.TOP_LEFT = ["TOP_LEFT",1];
flash.display.StageAlign.TOP_LEFT.toString = $estr;
flash.display.StageAlign.TOP_LEFT.__enum__ = flash.display.StageAlign;
flash.display.StageAlign.TOP = ["TOP",2];
flash.display.StageAlign.TOP.toString = $estr;
flash.display.StageAlign.TOP.__enum__ = flash.display.StageAlign;
flash.display.StageAlign.RIGHT = ["RIGHT",3];
flash.display.StageAlign.RIGHT.toString = $estr;
flash.display.StageAlign.RIGHT.__enum__ = flash.display.StageAlign;
flash.display.StageAlign.LEFT = ["LEFT",4];
flash.display.StageAlign.LEFT.toString = $estr;
flash.display.StageAlign.LEFT.__enum__ = flash.display.StageAlign;
flash.display.StageAlign.BOTTOM_RIGHT = ["BOTTOM_RIGHT",5];
flash.display.StageAlign.BOTTOM_RIGHT.toString = $estr;
flash.display.StageAlign.BOTTOM_RIGHT.__enum__ = flash.display.StageAlign;
flash.display.StageAlign.BOTTOM_LEFT = ["BOTTOM_LEFT",6];
flash.display.StageAlign.BOTTOM_LEFT.toString = $estr;
flash.display.StageAlign.BOTTOM_LEFT.__enum__ = flash.display.StageAlign;
flash.display.StageAlign.BOTTOM = ["BOTTOM",7];
flash.display.StageAlign.BOTTOM.toString = $estr;
flash.display.StageAlign.BOTTOM.__enum__ = flash.display.StageAlign;
flash.display.StageDisplayState = $hxClasses["flash.display.StageDisplayState"] = { __ename__ : true, __constructs__ : ["FULL_SCREEN","FULL_SCREEN_INTERACTIVE","NORMAL"] }
flash.display.StageDisplayState.FULL_SCREEN = ["FULL_SCREEN",0];
flash.display.StageDisplayState.FULL_SCREEN.toString = $estr;
flash.display.StageDisplayState.FULL_SCREEN.__enum__ = flash.display.StageDisplayState;
flash.display.StageDisplayState.FULL_SCREEN_INTERACTIVE = ["FULL_SCREEN_INTERACTIVE",1];
flash.display.StageDisplayState.FULL_SCREEN_INTERACTIVE.toString = $estr;
flash.display.StageDisplayState.FULL_SCREEN_INTERACTIVE.__enum__ = flash.display.StageDisplayState;
flash.display.StageDisplayState.NORMAL = ["NORMAL",2];
flash.display.StageDisplayState.NORMAL.toString = $estr;
flash.display.StageDisplayState.NORMAL.__enum__ = flash.display.StageDisplayState;
flash.display.StageScaleMode = $hxClasses["flash.display.StageScaleMode"] = { __ename__ : true, __constructs__ : ["SHOW_ALL","NO_SCALE","NO_BORDER","EXACT_FIT"] }
flash.display.StageScaleMode.SHOW_ALL = ["SHOW_ALL",0];
flash.display.StageScaleMode.SHOW_ALL.toString = $estr;
flash.display.StageScaleMode.SHOW_ALL.__enum__ = flash.display.StageScaleMode;
flash.display.StageScaleMode.NO_SCALE = ["NO_SCALE",1];
flash.display.StageScaleMode.NO_SCALE.toString = $estr;
flash.display.StageScaleMode.NO_SCALE.__enum__ = flash.display.StageScaleMode;
flash.display.StageScaleMode.NO_BORDER = ["NO_BORDER",2];
flash.display.StageScaleMode.NO_BORDER.toString = $estr;
flash.display.StageScaleMode.NO_BORDER.__enum__ = flash.display.StageScaleMode;
flash.display.StageScaleMode.EXACT_FIT = ["EXACT_FIT",3];
flash.display.StageScaleMode.EXACT_FIT.toString = $estr;
flash.display.StageScaleMode.EXACT_FIT.__enum__ = flash.display.StageScaleMode;
flash.errors = {}
flash.errors.Error = function(message,id) {
	if(id == null) id = 0;
	if(message == null) message = "";
	this.message = message;
	this.errorID = id;
};
$hxClasses["flash.errors.Error"] = flash.errors.Error;
flash.errors.Error.__name__ = ["flash","errors","Error"];
flash.errors.Error.prototype = {
	toString: function() {
		return this.message != null?this.message:"Error";
	}
	,getStackTrace: function() {
		return haxe.CallStack.toString(haxe.CallStack.exceptionStack());
	}
	,__class__: flash.errors.Error
}
flash.errors.IOError = function(message) {
	if(message == null) message = "";
	flash.errors.Error.call(this,message);
};
$hxClasses["flash.errors.IOError"] = flash.errors.IOError;
flash.errors.IOError.__name__ = ["flash","errors","IOError"];
flash.errors.IOError.__super__ = flash.errors.Error;
flash.errors.IOError.prototype = $extend(flash.errors.Error.prototype,{
	__class__: flash.errors.IOError
});
flash.events.Event = function(type,bubbles,cancelable) {
	if(cancelable == null) cancelable = false;
	if(bubbles == null) bubbles = false;
	this.type = type;
	this.bubbles = bubbles;
	this.cancelable = cancelable;
};
$hxClasses["flash.events.Event"] = flash.events.Event;
flash.events.Event.__name__ = ["flash","events","Event"];
flash.events.Event.prototype = {
	clone: function() {
		return new flash.events.Event(this.type,this.bubbles,this.cancelable);
	}
	,isDefaultPrevented: function() {
		return this.defaultPrevented;
	}
	,set_currentTarget: function(v) {
		return this._current = v;
	}
	,get_currentTarget: function() {
		return this._current || this.currentTarget;
	}
	,set_target: function(v) {
		return this._target = v;
	}
	,get_target: function() {
		return this._target || this.target;
	}
	,__class__: flash.events.Event
	,__properties__: {set_target:"set_target",get_target:"get_target",set_currentTarget:"set_currentTarget",get_currentTarget:"get_currentTarget"}
}
flash.events.TextEvent = function(type,bubbles,cancelable,text) {
	if(text == null) text = "";
	if(cancelable == null) cancelable = false;
	if(bubbles == null) bubbles = false;
	flash.events.Event.call(this,type,bubbles,cancelable);
	this.text = text;
};
$hxClasses["flash.events.TextEvent"] = flash.events.TextEvent;
flash.events.TextEvent.__name__ = ["flash","events","TextEvent"];
flash.events.TextEvent.__super__ = flash.events.Event;
flash.events.TextEvent.prototype = $extend(flash.events.Event.prototype,{
	__class__: flash.events.TextEvent
});
flash.events.ErrorEvent = function(type,bubbles,cancelable,text) {
	flash.events.TextEvent.call(this,type,bubbles,cancelable);
	this.text = text;
};
$hxClasses["flash.events.ErrorEvent"] = flash.events.ErrorEvent;
flash.events.ErrorEvent.__name__ = ["flash","events","ErrorEvent"];
flash.events.ErrorEvent.__super__ = flash.events.TextEvent;
flash.events.ErrorEvent.prototype = $extend(flash.events.TextEvent.prototype,{
	__class__: flash.events.ErrorEvent
});
flash.events.FocusEvent = function(type,bubbles,cancelable,inObject,inShiftKey,inKeyCode) {
	if(inKeyCode == null) inKeyCode = 0;
	if(inShiftKey == null) inShiftKey = false;
	if(cancelable == null) cancelable = false;
	if(bubbles == null) bubbles = false;
	flash.events.Event.call(this,type,bubbles,cancelable);
	this.keyCode = inKeyCode;
	this.shiftKey = inShiftKey == true;
	this.set_target(inObject);
};
$hxClasses["flash.events.FocusEvent"] = flash.events.FocusEvent;
flash.events.FocusEvent.__name__ = ["flash","events","FocusEvent"];
flash.events.FocusEvent.__super__ = flash.events.Event;
flash.events.FocusEvent.prototype = $extend(flash.events.Event.prototype,{
	__class__: flash.events.FocusEvent
});
flash.events.HTTPStatusEvent = function(type,bubbles,cancelable,status) {
	if(status == null) status = 0;
	if(cancelable == null) cancelable = false;
	if(bubbles == null) bubbles = false;
	this.status = status;
	flash.events.Event.call(this,type,bubbles,cancelable);
};
$hxClasses["flash.events.HTTPStatusEvent"] = flash.events.HTTPStatusEvent;
flash.events.HTTPStatusEvent.__name__ = ["flash","events","HTTPStatusEvent"];
flash.events.HTTPStatusEvent.__super__ = flash.events.Event;
flash.events.HTTPStatusEvent.prototype = $extend(flash.events.Event.prototype,{
	__class__: flash.events.HTTPStatusEvent
});
flash.events.IOErrorEvent = function(type,bubbles,cancelable,inText) {
	if(inText == null) inText = "";
	if(cancelable == null) cancelable = false;
	if(bubbles == null) bubbles = false;
	flash.events.Event.call(this,type,bubbles,cancelable);
	this.text = inText;
};
$hxClasses["flash.events.IOErrorEvent"] = flash.events.IOErrorEvent;
flash.events.IOErrorEvent.__name__ = ["flash","events","IOErrorEvent"];
flash.events.IOErrorEvent.__super__ = flash.events.Event;
flash.events.IOErrorEvent.prototype = $extend(flash.events.Event.prototype,{
	__class__: flash.events.IOErrorEvent
});
flash.events.KeyboardEvent = function(type,bubbles,cancelable,charCodeValue,keyCodeValue) {
	if(keyCodeValue == null) keyCodeValue = 0;
	if(charCodeValue == null) charCodeValue = 0;
	if(cancelable == null) cancelable = false;
	if(bubbles == null) bubbles = true;
	flash.events.Event.call(this,type,bubbles,cancelable);
	this.keyCode = keyCodeValue;
	this.charCode = charCodeValue;
};
$hxClasses["flash.events.KeyboardEvent"] = flash.events.KeyboardEvent;
flash.events.KeyboardEvent.__name__ = ["flash","events","KeyboardEvent"];
flash.events.KeyboardEvent.__super__ = flash.events.Event;
flash.events.KeyboardEvent.prototype = $extend(flash.events.Event.prototype,{
	__class__: flash.events.KeyboardEvent
});
flash.events.MouseEvent = function(type,bubbles,cancelable,lx,ly,obj,ctrlKey,altKey,shiftKey,buttonDown,delta) {
	if(delta == null) delta = 0;
	if(buttonDown == null) buttonDown = false;
	if(shiftKey == null) shiftKey = false;
	if(altKey == null) altKey = false;
	if(ctrlKey == null) ctrlKey = false;
	if(cancelable == null) cancelable = false;
	if(bubbles == null) bubbles = true;
	flash.events.Event.call(this,type,bubbles,cancelable);
	this.ctrlKey = ctrlKey;
	this.altKey = altKey;
	this.shiftKey = shiftKey;
	this.relatedObject = obj;
	this.button = buttonDown?0:1;
	this.wheelDelta = delta;
};
$hxClasses["flash.events.MouseEvent"] = flash.events.MouseEvent;
flash.events.MouseEvent.__name__ = ["flash","events","MouseEvent"];
flash.events.MouseEvent.__super__ = flash.events.Event;
flash.events.MouseEvent.prototype = $extend(flash.events.Event.prototype,{
	updateAfterEvent: function() {
	}
	,get_localY: function() {
		return this.get_localPoint().y;
	}
	,get_localX: function() {
		return this.get_localPoint().x;
	}
	,get_localPoint: function() {
		var p = flash.events.MouseEvent.convPoint;
		if(p == null) flash.events.MouseEvent.convPoint = p = new flash.geom.Point();
		p.x = this.pageX;
		p.y = this.pageY;
		return this.relatedObject != null?this.relatedObject.globalToLocal(p,p):p;
	}
	,get_stageY: function() {
		return this.pageY;
	}
	,get_stageX: function() {
		return this.pageX;
	}
	,get_delta: function() {
		return this.wheelDelta;
	}
	,get_buttonDown: function() {
		return this.button == 0;
	}
	,__class__: flash.events.MouseEvent
	,__properties__: $extend(flash.events.Event.prototype.__properties__,{get_localX:"get_localX",get_localY:"get_localY",get_stageX:"get_stageX",get_stageY:"get_stageY",get_buttonDown:"get_buttonDown",get_delta:"get_delta"})
});
flash.events.ProgressEvent = function(type,bubbles,cancelable,bytesLoaded,bytesTotal) {
	if(bytesTotal == null) bytesTotal = 0;
	if(bytesLoaded == null) bytesLoaded = 0;
	if(cancelable == null) cancelable = false;
	if(bubbles == null) bubbles = false;
	flash.events.Event.call(this,type,bubbles,cancelable);
	this.bytesLoaded = bytesLoaded;
	this.bytesTotal = bytesTotal;
};
$hxClasses["flash.events.ProgressEvent"] = flash.events.ProgressEvent;
flash.events.ProgressEvent.__name__ = ["flash","events","ProgressEvent"];
flash.events.ProgressEvent.__super__ = flash.events.Event;
flash.events.ProgressEvent.prototype = $extend(flash.events.Event.prototype,{
	__class__: flash.events.ProgressEvent
});
flash.events.SecurityErrorEvent = function(type,bubbles,cancelable,text) {
	if(text == null) text = "";
	if(cancelable == null) cancelable = false;
	if(bubbles == null) bubbles = false;
	flash.events.ErrorEvent.call(this,type,bubbles,cancelable);
	this.text = text;
};
$hxClasses["flash.events.SecurityErrorEvent"] = flash.events.SecurityErrorEvent;
flash.events.SecurityErrorEvent.__name__ = ["flash","events","SecurityErrorEvent"];
flash.events.SecurityErrorEvent.__super__ = flash.events.ErrorEvent;
flash.events.SecurityErrorEvent.prototype = $extend(flash.events.ErrorEvent.prototype,{
	__class__: flash.events.SecurityErrorEvent
});
flash.events.TouchEvent = function(type,bubbles,cancelable,touchPointID,isPrimaryTouchPoint,localX,localY,sizeX,sizeY,pressure,relObject,ctrlKey,altKey,shiftKey) {
	if(shiftKey == null) shiftKey = false;
	if(altKey == null) altKey = false;
	if(ctrlKey == null) ctrlKey = false;
	if(pressure == null) pressure = 0;
	if(sizeY == null) sizeY = 0;
	if(sizeX == null) sizeX = 0;
	if(localY == null) localY = 0;
	if(localX == null) localX = 0;
	if(isPrimaryTouchPoint == null) isPrimaryTouchPoint = false;
	if(touchPointID == null) touchPointID = 0;
	if(cancelable == null) cancelable = false;
	if(bubbles == null) bubbles = true;
	flash.events.Event.call(this,type,bubbles,cancelable);
	this.altKey = altKey;
	this.shiftKey = shiftKey;
	this.ctrlKey = ctrlKey;
};
$hxClasses["flash.events.TouchEvent"] = flash.events.TouchEvent;
flash.events.TouchEvent.__name__ = ["flash","events","TouchEvent"];
flash.events.TouchEvent.__super__ = flash.events.Event;
flash.events.TouchEvent.prototype = $extend(flash.events.Event.prototype,{
	__class__: flash.events.TouchEvent
});
flash.filters = {}
flash.filters.BitmapFilter = function(inType) {
	this._mType = inType;
};
$hxClasses["flash.filters.BitmapFilter"] = flash.filters.BitmapFilter;
flash.filters.BitmapFilter.__name__ = ["flash","filters","BitmapFilter"];
flash.filters.BitmapFilter.prototype = {
	nmeApplyFilter: function(surface,rect,refreshCache) {
		if(refreshCache == null) refreshCache = false;
	}
	,nmePreFilter: function(surface) {
	}
	,clone: function() {
		throw "Implement in subclass. BitmapFilter::clone";
		return null;
	}
	,__class__: flash.filters.BitmapFilter
}
flash.geom = {}
flash.geom.ColorTransform = function(r,g,b,a,ro,go,bo,ao) {
	if(ao == null) ao = 0;
	if(bo == null) bo = 0;
	if(go == null) go = 0;
	if(ro == null) ro = 0;
	if(a == null) a = 1;
	if(b == null) b = 1;
	if(g == null) g = 1;
	if(r == null) r = 1;
	this.redMultiplier = r;
	this.greenMultiplier = g;
	this.blueMultiplier = b;
	this.alphaMultiplier = a;
	this.redOffset = ro;
	this.greenOffset = go;
	this.blueOffset = bo;
	this.alphaOffset = ao;
};
$hxClasses["flash.geom.ColorTransform"] = flash.geom.ColorTransform;
flash.geom.ColorTransform.__name__ = ["flash","geom","ColorTransform"];
flash.geom.ColorTransform.prototype = {
	set_color: function(value) {
		this.redOffset = value >> 16 & 255;
		this.greenOffset = value >> 8 & 255;
		this.blueOffset = value & 255;
		this.redMultiplier = this.greenMultiplier = this.blueMultiplier = 0;
		return this.get_color();
	}
	,get_color: function() {
		return (this.redOffset | 0) << 16 | (this.greenOffset | 0) << 8 | (this.blueOffset | 0);
	}
	,isAlphaMultiplier: function() {
		return this.redMultiplier == 1 && this.greenMultiplier == 1 && this.blueMultiplier == 1 && this.redOffset == 0 && this.greenOffset == 0 && this.blueOffset == 0 && this.alphaOffset == 0;
	}
	,isColorSetter: function() {
		return this.redMultiplier == 0 && this.greenMultiplier == 0 && this.blueMultiplier == 0 && (this.alphaMultiplier == 0 || this.alphaOffset == 0);
	}
	,concat: function(o) {
		this.redMultiplier += o.redMultiplier;
		this.greenMultiplier += o.greenMultiplier;
		this.blueMultiplier += o.blueMultiplier;
		this.alphaMultiplier += o.alphaMultiplier;
	}
	,__class__: flash.geom.ColorTransform
	,__properties__: {set_color:"set_color",get_color:"get_color"}
}
flash.geom.Matrix = function(a,b,c,d,tx,ty) {
	this.a = a == null?1:a;
	this.b = b == null?0:b;
	this.c = c == null?0:c;
	this.d = d == null?1:d;
	this.tx = tx == null?0:tx;
	this.ty = ty == null?0:ty;
};
$hxClasses["flash.geom.Matrix"] = flash.geom.Matrix;
flash.geom.Matrix.__name__ = ["flash","geom","Matrix"];
flash.geom.Matrix.prototype = {
	to3dString: function() {
		return "matrix3d(" + this.a + ", " + this.b + ", 0, 0, " + this.c + ", " + this.d + ", 0, 0, 0, 0, 1, 0, " + this.tx + ", " + this.ty + ", 0, 1)";
	}
	,toString: function() {
		return "matrix(" + this.a + ", " + this.b + ", " + this.c + ", " + this.d + ", " + this.tx + ", " + this.ty + ")";
	}
	,transformPoint: function(o) {
		return new flash.geom.Point(o.x * this.a + o.y * this.c + this.tx,o.x * this.b + o.y * this.d + this.ty);
	}
	,concat: function(o) {
		var t;
		t = this.a * o.a + this.b * o.c;
		this.b = this.a * o.b + this.b * o.d;
		this.a = t;
		t = this.c * o.a + this.d * o.c;
		this.d = this.c * o.b + this.d * o.d;
		this.c = t;
		t = this.tx * o.a + this.ty * o.c + o.tx;
		this.ty = this.tx * o.b + this.ty * o.d + o.ty;
		this.tx = t;
	}
	,scale: function(x,y) {
		this.a *= x;
		this.b *= y;
		this.c *= x;
		this.d *= y;
		this.tx *= x;
		this.ty *= y;
	}
	,rotate: function(o) {
		var ox = Math.cos(o), oy = Math.sin(o), t;
		t = this.a * ox - this.b * oy;
		this.b = this.a * oy + this.b * ox;
		this.a = t;
		t = this.c * ox - this.d * oy;
		this.d = this.c * oy + this.d * ox;
		this.c = t;
		t = this.tx * ox - this.ty * oy;
		this.ty = this.tx * oy + this.ty * ox;
		this.tx = t;
	}
	,translate: function(x,y) {
		this.tx += x;
		this.ty += y;
	}
	,invert: function() {
		var t, n = this.a * this.d - this.b * this.c;
		if(n == 0) {
			this.a = this.b = this.c = this.d = 0;
			this.tx = -this.tx;
			this.ty = -this.ty;
		} else {
			n = 1 / n;
			t = this.d * n;
			this.d = this.a * n;
			this.a = t;
			this.b *= -n;
			this.c *= -n;
			t = -this.a * this.tx - this.c * this.ty;
			this.ty = -this.b * this.tx - this.d * this.ty;
			this.tx = t;
		}
	}
	,copy: function(s) {
		this.a = s.a;
		this.b = s.b;
		this.c = s.c;
		this.d = s.d;
		this.tx = s.tx;
		this.ty = s.ty;
	}
	,isIdentity: function() {
		return this.a == 1 && this.d == 1 && this.tx == 0 && this.ty == 0 && this.b == 0 && this.c == 0;
	}
	,identity: function() {
		this.a = this.d = 1;
		this.b = this.c = this.tx = this.ty = 0;
	}
	,clone: function() {
		return new flash.geom.Matrix(this.a,this.b,this.c,this.d,this.tx,this.ty);
	}
	,__class__: flash.geom.Matrix
}
flash.geom.Point = function(_x,_y) {
	this.x = _x == null?0:_x;
	this.y = _y == null?0:_y;
};
$hxClasses["flash.geom.Point"] = flash.geom.Point;
flash.geom.Point.__name__ = ["flash","geom","Point"];
flash.geom.Point.interpolate = function(a,b,f) {
	return new flash.geom.Point(a.x + f * (b.x - a.x),a.y + f * (b.y - a.y));
}
flash.geom.Point.polar = function(l,d) {
	return new flash.geom.Point(Math.cos(d) * l,Math.sin(d) * l);
}
flash.geom.Point.prototype = {
	subtract: function(o) {
		return new flash.geom.Point(this.x - o.x,this.y - o.y);
	}
	,add: function(o) {
		return new flash.geom.Point(this.x + o.x,this.y + o.y);
	}
	,offset: function(dx,dy) {
		this.x += dx;
		this.y += dy;
	}
	,normalize: function(l) {
		if(this.y == 0) this.x = this.x < 0?-l:l; else if(this.x == 0) this.y = this.y < 0?-l:l; else {
			var m = l / Math.sqrt(this.x * this.x + this.y * this.y);
			this.x *= m;
			this.y *= m;
		}
	}
	,toString: function() {
		return "point(" + this.x + ", " + this.y + ")";
	}
	,get_length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	,setTo: function(u,v) {
		this.x = u;
		this.y = v;
	}
	,equals: function(o) {
		return this.x == o.x && this.y == o.y;
	}
	,clone: function() {
		return new flash.geom.Point(this.x,this.y);
	}
	,__class__: flash.geom.Point
	,__properties__: {get_length:"get_length"}
}
flash.geom.Rectangle = function(a,b,c,d) {
	if(d == null) d = 0;
	if(c == null) c = 0;
	if(b == null) b = 0;
	if(a == null) a = 0;
	this.x = a;
	this.y = b;
	this.width = c;
	this.height = d;
};
$hxClasses["flash.geom.Rectangle"] = flash.geom.Rectangle;
flash.geom.Rectangle.__name__ = ["flash","geom","Rectangle"];
flash.geom.Rectangle.prototype = {
	toString: function() {
		return "Rectangle(" + this.x + ", " + this.y + ", " + this.width + ", " + this.height + ")";
	}
	,transform: function(m) {
		var v, l, t, r, b;
		r = l = m.a * this.x + m.c * this.y;
		b = t = m.b * this.x + m.d * this.y;
		v = m.a * (this.x + this.width) + m.c * this.y;
		if(v < l) l = v;
		if(v > r) r = v;
		v = m.b * (this.x + this.width) + m.d * this.y;
		if(v < t) t = v;
		if(v > b) b = v;
		v = m.a * this.x + m.c * (this.y + this.height);
		if(v < l) l = v;
		if(v > r) r = v;
		v = m.b * this.x + m.d * (this.y + this.height);
		if(v < t) t = v;
		if(v > b) b = v;
		v = m.a * (this.x + this.width) + m.c * (this.y + this.height);
		if(v < l) l = v;
		if(v > r) r = v;
		v = m.b * (this.x + this.width) + m.d * (this.y + this.height);
		if(v < t) t = v;
		if(v > b) b = v;
		this.x = l + m.tx;
		this.width = r - l;
		this.y = t + m.ty;
		this.height = b - t;
	}
	,offsetPoint: function(o) {
		this.x += o.x;
		this.y += o.y;
	}
	,offset: function(u,v) {
		this.x += u;
		this.y += v;
	}
	,inflatePoint: function(v) {
		this.inflate(v.x,v.y);
	}
	,inflate: function(u,v) {
		this.x -= u;
		this.y -= v;
		this.width += u * 2;
		this.height += v * 2;
	}
	,union: function(o) {
		var a, b, c, d;
		return new flash.geom.Rectangle((a = this.x) < (c = o.x)?a:c,(b = this.y) < (d = o.y)?b:d,(a += this.width) > (c += o.width)?a:c,(b += this.height) > (d += o.height)?b:d);
	}
	,join: function(o) {
		var v;
		if((v = o.x - this.x) < 0) {
			this.x += v;
			this.width -= v;
		}
		if((v = o.y - this.y) < 0) {
			this.y += v;
			this.height -= v;
		}
		if((v = o.x + o.width - (this.x + this.width)) > 0) this.width += v;
		if((v = o.y + o.height - (this.y + this.height)) > 0) this.height += v;
	}
	,intersects: function(o) {
		var x0, x1, y0, y1;
		return (x0 = this.x < (x0 = o.x)?x0:this.x) <= (x1 = this.x + this.width > (x1 = o.x + o.width)?x1:this.x + this.width)?false:(y0 = this.y < (y0 = o.y)?y0:this.y) <= (y1 = this.y + this.height > (y1 = o.y + o.height)?y1:this.y);
	}
	,intersection: function(o) {
		var x0, x1, y0, y1, a, b;
		return (x0 = (a = this.x) < (b = o.x)?b:a) <= (x1 = (a += this.width) > (b += o.width)?b:a) && (y0 = (a = this.y) < (b = o.y)?b:a) <= (y1 = (a += this.height) > (b += o.height)?b:a)?new flash.geom.Rectangle(x0,y0,x1 - x0,y1 - y0):new flash.geom.Rectangle();
	}
	,containsRect: function(o) {
		return o.width <= 0 || o.height <= 0?o.x > this.x && o.y > this.y && o.x + o.width < this.x + this.width && o.y + o.height < this.y + this.height:o.x >= this.x && o.y >= this.y && o.x + o.width <= this.x + this.width && o.y + o.height <= this.y + this.height;
	}
	,containsPoint: function(o) {
		return this.contains(o.x,o.y);
	}
	,contains: function(u,v) {
		return (u -= this.x) >= 0 && (v -= this.y) >= 0 && u < this.width && v < this.height;
	}
	,set_bottomRight: function(v) {
		this.width = v.x - this.x;
		this.height = v.y - this.y;
		return v.clone();
	}
	,get_bottomRight: function() {
		return new flash.geom.Point(this.x + this.width,this.y + this.height);
	}
	,set_topLeft: function(v) {
		this.width = v.x;
		this.height = v.y;
		return v.clone();
	}
	,get_topLeft: function() {
		return new flash.geom.Point(this.x,this.y);
	}
	,set_size: function(v) {
		this.width = v.x;
		this.height = v.y;
		return v.clone();
	}
	,get_size: function() {
		return new flash.geom.Point(this.width,this.height);
	}
	,set_bottom: function(v) {
		this.height = v - this.y;
		return v;
	}
	,get_bottom: function() {
		return this.y + this.height;
	}
	,set_right: function(v) {
		this.width = v - this.x;
		return v;
	}
	,get_right: function() {
		return this.x + this.width;
	}
	,set_top: function(v) {
		this.height -= v - this.y;
		return this.y = v;
	}
	,get_top: function() {
		return this.y;
	}
	,set_left: function(v) {
		this.width -= v - this.x;
		return this.x = v;
	}
	,get_left: function() {
		return this.x;
	}
	,setVoid: function() {
		this.width -= 2147483647 - this.x;
		this.x = 2147483647;
		this.width = -2147483648 - this.x;
		-2147483648;
		this.height -= 2147483647 - this.y;
		this.y = 2147483647;
		this.height = -2147483648 - this.y;
		-2147483648;
	}
	,setTo: function(a,b,c,d) {
		this.x = a;
		this.y = b;
		this.width = c;
		this.height = d;
	}
	,copyFrom: function(o) {
		this.x = o.x;
		this.y = o.y;
		this.width = o.width;
		this.height = o.height;
	}
	,setEmpty: function() {
		this.x = this.y = this.width = this.height = 0;
	}
	,isEmpty: function() {
		return this.width <= 0 || this.height <= 0;
	}
	,equals: function(o) {
		return this.x == o.x && this.y == o.y && this.width == o.width && this.height == o.height;
	}
	,clone: function() {
		return new flash.geom.Rectangle(this.x,this.y,this.width,this.height);
	}
	,__class__: flash.geom.Rectangle
	,__properties__: {set_left:"set_left",get_left:"get_left",set_right:"set_right",get_right:"get_right",set_top:"set_top",get_top:"get_top",set_bottom:"set_bottom",get_bottom:"get_bottom",set_size:"set_size",get_size:"get_size",set_topLeft:"set_topLeft",get_topLeft:"get_topLeft",set_bottomRight:"set_bottomRight",get_bottomRight:"get_bottomRight"}
}
flash.geom.Transform = function(displayObject) {
	if(displayObject == null) throw "Cannot create Transform with no DisplayObject.";
	this._displayObject = displayObject;
	this._matrix = new flash.geom.Matrix();
	this._fullMatrix = new flash.geom.Matrix();
	this.set_colorTransform(new flash.geom.ColorTransform());
};
$hxClasses["flash.geom.Transform"] = flash.geom.Transform;
flash.geom.Transform.__name__ = ["flash","geom","Transform"];
flash.geom.Transform.prototype = {
	get_pixelBounds: function() {
		return this._displayObject.getBounds(null);
	}
	,set_matrix: function(inValue) {
		this._matrix.copy(inValue);
		this._displayObject.syncMtx();
		return this._matrix;
	}
	,get_matrix: function() {
		return this._matrix.clone();
	}
	,get_concatenatedMatrix: function() {
		return this.nmeGetFullMatrix(this._matrix);
	}
	,set_colorTransform: function(inValue) {
		this.colorTransform = inValue;
		return inValue;
	}
	,nmeSetMatrix: function(inValue) {
		this._matrix.copy(inValue);
	}
	,nmeSetFullMatrix: function(inValue) {
		this._fullMatrix.copy(inValue);
		return this._fullMatrix;
	}
	,nmeGetFullMatrix: function(localMatrix) {
		var m;
		if(localMatrix != null) (m = new flash.geom.Matrix(localMatrix.a,localMatrix.b,localMatrix.c,localMatrix.d,localMatrix.tx,localMatrix.ty)).concat(this._fullMatrix); else m = this._fullMatrix.clone();
		return m;
	}
	,__class__: flash.geom.Transform
	,__properties__: {set_colorTransform:"set_colorTransform",get_concatenatedMatrix:"get_concatenatedMatrix",set_matrix:"set_matrix",get_matrix:"get_matrix",get_pixelBounds:"get_pixelBounds"}
}
flash.media = {}
flash.media.Sound = function(stream,ctx) {
	flash.events.EventDispatcher.call(this);
	if(stream != null) this.load(stream,ctx);
};
$hxClasses["flash.media.Sound"] = flash.media.Sound;
flash.media.Sound.__name__ = ["flash","media","Sound"];
flash.media.Sound.canPlayType = function(o) {
	var f, v;
	o = o.toLowerCase();
	if(flash.media.Sound.canPlayMap != null) {
		if(flash.media.Sound.canPlayMap.exists(o)) return flash.media.Sound.canPlayMap.get(o);
	} else flash.media.Sound.canPlayMap = new haxe.ds.StringMap();
	f = flash.media.Sound.getFormatType(o);
	v = new Audio().canPlayType(f) != "no";
	flash.media.Sound.canPlayMap.set(o,v);
	return v;
}
flash.media.Sound.getFormatType = function(o) {
	return o == "mp3"?"audio/mpeg;":o == "ogg"?"audio/ogg; codecs=\"vorbis\"":null;
}
flash.media.Sound.__super__ = flash.events.EventDispatcher;
flash.media.Sound.prototype = $extend(flash.events.EventDispatcher.prototype,{
	get_length: function() {
		return this.component != null?this.component.duration * 1000:0;
	}
	,play: function(ofs,loops,stf) {
		if(loops == null) loops = 0;
		if(ofs == null) ofs = 0;
		var o, i;
		if(this.qCache.length == 0) {
			(o = new flash.media.SoundChannel()).init(this,this.component,loops);
			this.component = this.component.cloneNode(true);
		} else {
			o = this.qCache[0];
			var _g = 0, _g1 = this.qCache;
			while(_g < _g1.length) {
				var v = _g1[_g];
				++_g;
				if(v.component.currentTime * 1000 == ofs) {
					o = v;
					break;
				}
			}
			HxOverrides.remove(this.qCache,o);
		}
		o.set_soundTransform(stf);
		try {
			o._loops = loops;
			o.play(ofs);
		} catch( e ) {
			if(console) console.log(e);
		}
		return o;
	}
	,load: function(stream,ctx) {
		var s = stream.url, m = flash.media.Sound.library;
		if(m != null && m.exists(s)) {
			this.component = m.get(s);
			flash.media.Sound.library.set(s,this.component.cloneNode(true));
		} else this.component = new Audio(s);
		this.qCache = [];
	}
	,close: function() {
		if(this.component != null) this.component = null; else throw new flash.errors.IOError("Attempt to close unexisting stream.");
	}
	,__class__: flash.media.Sound
	,__properties__: {get_length:"get_length"}
});
flash.media.SoundChannel = function() {
	this._loops = 1;
	this.active = false;
	this.rightPeak = 1;
	this.leftPeak = 1;
	flash.events.EventDispatcher.call(this);
};
$hxClasses["flash.media.SoundChannel"] = flash.media.SoundChannel;
flash.media.SoundChannel.__name__ = ["flash","media","SoundChannel"];
flash.media.SoundChannel.__super__ = flash.events.EventDispatcher;
flash.media.SoundChannel.prototype = $extend(flash.events.EventDispatcher.prototype,{
	onEnded: function(e) {
		if(this.active) {
			if(--this._loops > 0) {
				this.set_position(this._position);
				if(this.component.paused) this.component.play();
			} else {
				this.stop();
				this.component.currentTime = 0;
				this.dispatchEvent(new flash.events.Event("soundComplete"));
			}
		}
	}
	,set_position: function(v) {
		if(this.component.currentTime != v / 1000) {
			var p = !this.component.paused;
			if(p) this.component.pause();
			this.component.currentTime = v / 1000;
			if(p) this.component.play();
		}
		return v;
	}
	,get_position: function() {
		return this.component.currentTime * 1000;
	}
	,get_duration: function() {
		var o = this.component, f;
		try {
			f = o.buffered != null?o.buffered.end(0):o.duration;
		} catch( _ ) {
			f = o.duration;
			if(Math.isNaN(f)) f = 0;
		}
		return f;
	}
	,set_soundTransform: function(v) {
		this.soundTransform = v;
		this.component.volume = v != null?v.volume:1;
		return v;
	}
	,stop: function() {
		if(this.active) {
			this.active = false;
			this.component.pause();
			this.qSound.qCache.push(this);
		}
	}
	,play: function(p) {
		var o = this.component, l;
		if(!this.active) {
			l = this.get_duration();
			if(p == 0 || p / 1000 <= l) {
				this._position = this.set_position(p);
				o.load();
				o.play();
				this.active = true;
			} else {
				this.set_position(0);
				o.load();
				o.play();
				o.pause();
				this.qSound.qCache.push(this);
			}
		}
	}
	,init: function(q,v,loops) {
		if(loops == null) loops = 1;
		this.qSound = q;
		this.component = v;
		this._loops = loops;
		this.component.addEventListener("ended",$bind(this,this.onEnded));
	}
	,__class__: flash.media.SoundChannel
	,__properties__: {set_soundTransform:"set_soundTransform",set_position:"set_position",get_position:"get_position"}
});
flash.media.SoundLoaderContext = function(bufferTime,checkPolicyFile) {
	if(checkPolicyFile == null) checkPolicyFile = false;
	if(bufferTime == null) bufferTime = 0;
	this.bufferTime = bufferTime;
	this.checkPolicyFile = checkPolicyFile;
};
$hxClasses["flash.media.SoundLoaderContext"] = flash.media.SoundLoaderContext;
flash.media.SoundLoaderContext.__name__ = ["flash","media","SoundLoaderContext"];
flash.media.SoundLoaderContext.prototype = {
	__class__: flash.media.SoundLoaderContext
}
flash.media.SoundTransform = function(vol,panning) {
	if(panning == null) panning = 0;
	if(vol == null) vol = 1;
	this.volume = vol;
	this.pan = panning;
};
$hxClasses["flash.media.SoundTransform"] = flash.media.SoundTransform;
flash.media.SoundTransform.__name__ = ["flash","media","SoundTransform"];
flash.media.SoundTransform.prototype = {
	__class__: flash.media.SoundTransform
}
flash.net = {}
flash.net.URLLoader = function(request) {
	flash.events.EventDispatcher.call(this);
	this.bytesLoaded = this.bytesTotal = 0;
	this.set_dataFormat(flash.net.URLLoaderDataFormat.TEXT);
	if(request != null) this.load(request);
};
$hxClasses["flash.net.URLLoader"] = flash.net.URLLoader;
flash.net.URLLoader.__name__ = ["flash","net","URLLoader"];
flash.net.URLLoader.__super__ = flash.events.EventDispatcher;
flash.net.URLLoader.prototype = $extend(flash.events.EventDispatcher.prototype,{
	onStatus: function(status) {
		var e = new flash.events.HTTPStatusEvent("httpStatus",false,false,status);
		e.set_currentTarget(this);
		this.dispatchEvent(e);
	}
	,onSecurityError: function(msg) {
		var evt = new flash.events.SecurityErrorEvent("securityError");
		evt.text = msg;
		evt.set_currentTarget(this);
		this.dispatchEvent(evt);
	}
	,onProgress: function(event) {
		var e = new flash.events.ProgressEvent("progress");
		e.set_currentTarget(this);
		e.bytesLoaded = event.loaded;
		e.bytesTotal = event.total;
		this.dispatchEvent(e);
	}
	,onOpen: function() {
		var e = new flash.events.Event("open");
		e.set_currentTarget(this);
		this.dispatchEvent(e);
	}
	,onError: function(msg) {
		var e = new flash.events.IOErrorEvent("ioError");
		e.text = msg;
		e.set_currentTarget(this);
		this.dispatchEvent(e);
	}
	,onData: function(_) {
		var v = _?_:this.getData(), e;
		this.data = this.dataFormat == flash.net.URLLoaderDataFormat.BINARY?flash.utils.ByteArray.nmeOfBuffer(v):Std.string(v);
		e = new flash.events.Event("complete");
		e.set_currentTarget(this);
		this.dispatchEvent(e);
	}
	,requestUrl: function(url,method,data,requestHeaders) {
		var xmlHttpRequest = new XMLHttpRequest();
		this.getData = function() {
			return xmlHttpRequest.response != null?xmlHttpRequest.response:xmlHttpRequest.responseText;
		};
		this.registerEvents(xmlHttpRequest);
		var uri = "";
		if(js.Boot.__instanceof(data,flash.utils.ByteArray)) {
			var data1 = data;
			uri = this.dataFormat == flash.net.URLLoaderDataFormat.BINARY?data1.data.buffer:data1.readUTFBytes(data1.length);
		} else if(js.Boot.__instanceof(data,flash.net.URLVariables)) {
			var data1 = data;
			var _g = 0, _g1 = Reflect.fields(data1);
			while(_g < _g1.length) {
				var p = _g1[_g];
				++_g;
				if(uri.length != 0) uri += "&";
				uri += StringTools.urlEncode(p) + "=" + StringTools.urlEncode(Reflect.field(data1,p));
			}
		} else if(data != null) uri = data.toString();
		try {
			if(method == "GET" && uri != null && uri != "") {
				var question = url.split("?").length <= 1;
				xmlHttpRequest.open(method,url + (question?"?":"&") + Std.string(uri),true);
				uri = "";
			} else xmlHttpRequest.open(method,url,true);
		} catch( e ) {
			this.onError(e.toString());
			return;
		}
		if(this.dataFormat == flash.net.URLLoaderDataFormat.BINARY) xmlHttpRequest.responseType = "arraybuffer";
		var _g = 0;
		while(_g < requestHeaders.length) {
			var header = requestHeaders[_g];
			++_g;
			xmlHttpRequest.setRequestHeader(header.name,header.value);
		}
		xmlHttpRequest.send(uri);
		this.onOpen();
	}
	,registerEvents: function(subject) {
		var self = this;
		if(typeof XMLHttpRequestProgressEvent != "undefined") subject.addEventListener("progress",$bind(this,this.onProgress),false);
		subject.onreadystatechange = function() {
			if(subject.readyState == 4) {
				var s;
				try {
					s = subject.status;
				} catch( _ ) {
					s = null;
				}
				if(s != null) self.onStatus(s);
				if(s == null) self.onError("Failed to connect or resolve host"); else if(s >= 200 && s < 400) self.onData(subject.response); else if(s == 12029) self.onError("Failed to connect to host"); else if(s == 12007) self.onError("Unknown host"); else if(s == 0) {
					self.onError("Unable to make request (may be blocked due to cross-domain permissions)");
					self.onSecurityError("Unable to make request (may be blocked due to cross-domain permissions)");
				} else self.onError("Http Error #" + subject.status);
			}
		};
	}
	,load: function(request) {
		this.requestUrl(request.url,request.method,request.data,request.formatRequestHeaders());
	}
	,getData: function() {
		return null;
	}
	,close: function() {
	}
	,set_dataFormat: function(v) {
		this.dataFormat = v == flash.net.URLLoaderDataFormat.BINARY && ArrayBuffer == null?flash.net.URLLoaderDataFormat.TEXT:v;
		return this.dataFormat;
	}
	,__class__: flash.net.URLLoader
	,__properties__: {set_dataFormat:"set_dataFormat"}
});
flash.net.URLLoaderDataFormat = $hxClasses["flash.net.URLLoaderDataFormat"] = { __ename__ : true, __constructs__ : ["BINARY","TEXT","VARIABLES"] }
flash.net.URLLoaderDataFormat.BINARY = ["BINARY",0];
flash.net.URLLoaderDataFormat.BINARY.toString = $estr;
flash.net.URLLoaderDataFormat.BINARY.__enum__ = flash.net.URLLoaderDataFormat;
flash.net.URLLoaderDataFormat.TEXT = ["TEXT",1];
flash.net.URLLoaderDataFormat.TEXT.toString = $estr;
flash.net.URLLoaderDataFormat.TEXT.__enum__ = flash.net.URLLoaderDataFormat;
flash.net.URLLoaderDataFormat.VARIABLES = ["VARIABLES",2];
flash.net.URLLoaderDataFormat.VARIABLES.toString = $estr;
flash.net.URLLoaderDataFormat.VARIABLES.__enum__ = flash.net.URLLoaderDataFormat;
flash.net.URLRequest = function(inURL) {
	if(inURL != null) this.url = inURL;
	this.requestHeaders = [];
	this.method = "GET";
	this.contentType = null;
};
$hxClasses["flash.net.URLRequest"] = flash.net.URLRequest;
flash.net.URLRequest.__name__ = ["flash","net","URLRequest"];
flash.net.URLRequest.prototype = {
	formatRequestHeaders: function() {
		var res = this.requestHeaders;
		if(res == null) res = [];
		if(this.method == "GET" || this.data == null) return res;
		if(js.Boot.__instanceof(this.data,String) || js.Boot.__instanceof(this.data,flash.utils.ByteArray)) (res = res.slice()).push(new flash.net.URLRequestHeader("Content-Type",this.contentType != null?this.contentType:"application/x-www-form-urlencoded"));
		return res;
	}
	,__class__: flash.net.URLRequest
}
flash.net.URLRequestHeader = function(name,value) {
	if(value == null) value = "";
	if(name == null) name = "";
	this.name = name;
	this.value = value;
};
$hxClasses["flash.net.URLRequestHeader"] = flash.net.URLRequestHeader;
flash.net.URLRequestHeader.__name__ = ["flash","net","URLRequestHeader"];
flash.net.URLRequestHeader.prototype = {
	__class__: flash.net.URLRequestHeader
}
flash.net._URLRequestMethod = {}
flash.net._URLRequestMethod.URLRequestMethod_Impl_ = function() { }
$hxClasses["flash.net._URLRequestMethod.URLRequestMethod_Impl_"] = flash.net._URLRequestMethod.URLRequestMethod_Impl_;
flash.net._URLRequestMethod.URLRequestMethod_Impl_.__name__ = ["flash","net","_URLRequestMethod","URLRequestMethod_Impl_"];
flash.net._URLRequestMethod.URLRequestMethod_Impl_._new = function(o) {
	return o;
}
flash.net._URLRequestMethod.URLRequestMethod_Impl_.toString = function(this1) {
	return this1;
}
flash.net._URLRequestMethod.URLRequestMethod_Impl_.fromString = function(s) {
	return s;
}
flash.net.URLVariables = function(inEncoded) {
	if(inEncoded != null) this.decode(inEncoded);
};
$hxClasses["flash.net.URLVariables"] = flash.net.URLVariables;
flash.net.URLVariables.__name__ = ["flash","net","URLVariables"];
flash.net.URLVariables.prototype = {
	toString: function() {
		var r = "", o = Reflect.fields(this), i = 0;
		var _g = 0;
		while(_g < o.length) {
			var f = o[_g];
			++_g;
			r += (i++ != 0?"&":"") + StringTools.urlEncode(f) + "=" + StringTools.urlEncode(Reflect.field(this,f));
		}
		return r;
	}
	,decode: function(inVars) {
		var fields = Reflect.fields(this);
		var _g = 0;
		while(_g < fields.length) {
			var f = fields[_g];
			++_g;
			Reflect.deleteField(this,f);
		}
		var fields1 = inVars.split(";").join("&").split("&");
		var _g = 0;
		while(_g < fields1.length) {
			var f = fields1[_g];
			++_g;
			var eq = f.indexOf("=");
			if(eq > 0) this[StringTools.urlDecode(HxOverrides.substr(f,0,eq))] = StringTools.urlDecode(HxOverrides.substr(f,eq + 1,null)); else if(eq != 0) this[StringTools.urlDecode(f)] = "";
		}
	}
	,__class__: flash.net.URLVariables
}
flash.system = {}
flash.system.System = function() { }
$hxClasses["flash.system.System"] = flash.system.System;
flash.system.System.__name__ = ["flash","system","System"];
flash.system.System.__properties__ = {get_vmVersion:"get_vmVersion",get_totalMemory:"get_totalMemory"}
flash.system.System.exit = function(code) {
	js.Browser.window.close();
}
flash.system.System.get_totalMemory = function() {
	var v;
	return ((v = console) && (v = v.memory) && (v = v.totalJSHeapSize)) || 0;
}
flash.system.System.get_vmVersion = function() {
	return "2.0 js openfl";
}
flash.text = {}
flash.text.AntiAliasType = $hxClasses["flash.text.AntiAliasType"] = { __ename__ : true, __constructs__ : ["ADVANCED","NORMAL"] }
flash.text.AntiAliasType.ADVANCED = ["ADVANCED",0];
flash.text.AntiAliasType.ADVANCED.toString = $estr;
flash.text.AntiAliasType.ADVANCED.__enum__ = flash.text.AntiAliasType;
flash.text.AntiAliasType.NORMAL = ["NORMAL",1];
flash.text.AntiAliasType.NORMAL.toString = $estr;
flash.text.AntiAliasType.NORMAL.__enum__ = flash.text.AntiAliasType;
flash.text.Font = function() {
};
$hxClasses["flash.text.Font"] = flash.text.Font;
flash.text.Font.__name__ = ["flash","text","Font"];
flash.text.Font.enumerateFonts = function(z) {
	if(z == null) z = false;
	return [];
}
flash.text.Font.registerFont = function(v) {
}
flash.text.Font.prototype = {
	hasGlyphs: function(v) {
		return false;
	}
	,__class__: flash.text.Font
}
flash.text.FontStyle = $hxClasses["flash.text.FontStyle"] = { __ename__ : true, __constructs__ : ["REGULAR","ITALIC","BOLD_ITALIC","BOLD"] }
flash.text.FontStyle.REGULAR = ["REGULAR",0];
flash.text.FontStyle.REGULAR.toString = $estr;
flash.text.FontStyle.REGULAR.__enum__ = flash.text.FontStyle;
flash.text.FontStyle.ITALIC = ["ITALIC",1];
flash.text.FontStyle.ITALIC.toString = $estr;
flash.text.FontStyle.ITALIC.__enum__ = flash.text.FontStyle;
flash.text.FontStyle.BOLD_ITALIC = ["BOLD_ITALIC",2];
flash.text.FontStyle.BOLD_ITALIC.toString = $estr;
flash.text.FontStyle.BOLD_ITALIC.__enum__ = flash.text.FontStyle;
flash.text.FontStyle.BOLD = ["BOLD",3];
flash.text.FontStyle.BOLD.toString = $estr;
flash.text.FontStyle.BOLD.__enum__ = flash.text.FontStyle;
flash.text.FontType = $hxClasses["flash.text.FontType"] = { __ename__ : true, __constructs__ : ["EMBEDDED","DEVICE"] }
flash.text.FontType.EMBEDDED = ["EMBEDDED",0];
flash.text.FontType.EMBEDDED.toString = $estr;
flash.text.FontType.EMBEDDED.__enum__ = flash.text.FontType;
flash.text.FontType.DEVICE = ["DEVICE",1];
flash.text.FontType.DEVICE.toString = $estr;
flash.text.FontType.DEVICE.__enum__ = flash.text.FontType;
flash.text.TextField = function() {
	this.qText = "";
	this.type = "DYNAMIC";
	this.maxChars = 0;
	flash.display.InteractiveObject.call(this);
	var s = this.component.style;
	s.whiteSpace = "nowrap";
	s.overflow = "hidden";
	this.defaultTextFormat = new flash.text.TextFormat("_serif",16,0);
	this.textColor = 0;
	this.wordWrap = this.qEditable = false;
	this.set_width(this.set_height(100));
};
$hxClasses["flash.text.TextField"] = flash.text.TextField;
flash.text.TextField.__name__ = ["flash","text","TextField"];
flash.text.TextField.__interfaces__ = [flash.display.IBitmapDrawable];
flash.text.TextField.__super__ = flash.display.InteractiveObject;
flash.text.TextField.prototype = $extend(flash.display.InteractiveObject.prototype,{
	removeEventListener: function(type,listener,useCapture,priority,weak) {
		if(weak == null) weak = false;
		if(priority == null) priority = 0;
		if(useCapture == null) useCapture = false;
		var o = this.component;
		if(this.qEditable) this.component = this.qTextArea;
		flash.display.InteractiveObject.prototype.removeEventListener.call(this,type,listener,useCapture,priority,weak);
		if(this.qEditable) this.component = o;
	}
	,addEventListener: function(type,listener,useCapture,priority,weak) {
		if(weak == null) weak = false;
		if(priority == null) priority = 0;
		if(useCapture == null) useCapture = false;
		var o = this.component;
		if(this.qEditable) this.component = this.qTextArea;
		flash.display.InteractiveObject.prototype.addEventListener.call(this,type,listener,useCapture,priority,weak);
		if(this.qEditable) this.component = o;
	}
	,get_selectedText: function() {
		var a = this.qTextArea.selectionStart, b = this.qTextArea.selectionEnd, c;
		if(b < a) {
			c = a;
			a = b;
			b = c;
		}
		return this.qEditable?this.qTextArea.value.substring(a,b):null;
	}
	,set_selectionEndIndex: function(v) {
		if(this.qEditable && this.get_selectionEndIndex() != v) this.qTextArea.selectionEnd = v;
		return v;
	}
	,set_selectionBeginIndex: function(v) {
		if(this.qEditable && this.get_selectionBeginIndex() != v) this.qTextArea.selectionStart = v;
		return v;
	}
	,get_selectionEndIndex: function() {
		return this.qEditable?this.qTextArea.selectionEnd:0;
	}
	,get_selectionBeginIndex: function() {
		return this.qEditable?this.qTextArea.selectionStart:0;
	}
	,giveFocus: function() {
		(this.qEditable?this.qTextArea:this.component).focus();
	}
	,set_selectable: function(v) {
		if(this.selectable != v) {
			var s = this.component.style, q = (this.selectable = v)?null:"none", u = "user-select", z = null;
			s.setProperty("-webkit-touch-callout",q,z);
			s.setProperty("-webkit-" + u,q,z);
			s.setProperty("-khtml-" + u,q,z);
			s.setProperty("-moz-" + u,q,z);
			s.setProperty("-ms-" + u,q,z);
			s.setProperty(u,q,z);
			s.setProperty("cursor",v?"":"default",z);
			this.component.setAttribute("unselectable",v?null:"on");
		}
		return v;
	}
	,set_maxChars: function(v) {
		if(this.maxChars != v) {
			this.maxChars = v;
			if(this.qEditable) this.qTextArea.maxLength = v > 0?v:2147483647;
		}
		return v;
	}
	,set_multiline: function(v) {
		if(this.multiline != v) {
			this.multiline = v;
			if(this.qEditable) {
				this.set_type("DYNAMIC");
				this.set_type("INPUT");
			}
		}
		return v;
	}
	,set_type: function(v) {
		var z = v == "INPUT", o = this, c, e, q, t, text, f;
		if(z != o.qEditable) {
			c = o.component;
			text = o.get_text();
			o.set_text(text != ""?"":" ");
			if(o.qEditable = z) {
				c.appendChild(e = document.createElement(this.multiline?"textarea":"input"));
				e.value = text + " ";
				e.maxLength = (t = this.maxChars) > 0?t:2147483647;
				t = e.style;
				t.border = "0";
				t.background = "transparent";
				if((f = o.qWidth) != null) t.width = f + "px";
				if((f = o.qHeight) != null) t.height = f + "px";
				o.qTextArea = e;
			} else {
				c.removeChild(o.qTextArea);
				o.qTextArea = null;
			}
			o.set_text(text);
		}
		return v;
	}
	,set_autoSize: function(v) {
		if(this.autoSize != v) {
			if((this.autoSize = v) != "NONE") this.set_width(this.set_height(null));
		}
		return v;
	}
	,get_textHeight: function() {
		if(this.get_stage() == null) {
			var o = this._measure_pre(), r = o.clientHeight;
			this._measure_post(o);
			return r;
		}
		return this.component.clientHeight;
	}
	,get_textWidth: function() {
		if(this.get_stage() == null) {
			var o = this._measure_pre(), r = o.clientWidth;
			this._measure_post(o);
			return r;
		}
		return this.component.clientWidth;
	}
	,_measure_post: function(o) {
		var i, s = o.style;
		i = s.length;
		while(--i >= 0) s[s[i]] = "";
		o.innerHTML = "";
	}
	,_measure_pre: function() {
		var o = flash.Lib.jsHelper(), s = o.style, q = this.component.style, i;
		i = q.length;
		while(--i >= 0) s[q[i]] = q[q[i]];
		o.innerHTML = this.component.innerHTML;
		return o;
	}
	,set_height: function(v) {
		if(this.qHeight != v) {
			var o = v != null?v + "px":"";
			this.component.style.height = o;
			if(this.qEditable) this.qTextArea.style.height = o;
			this.qHeight = v;
		}
		return v;
	}
	,set_width: function(v) {
		if(this.qWidth != v) {
			var o = v != null?v + "px":"";
			this.component.style.width = o;
			if(this.qEditable) this.qTextArea.style.width = o;
			this.qWidth = v;
		}
		return v;
	}
	,get_height: function() {
		return this.qHeight != null?this.qHeight:this.get_textHeight();
	}
	,get_width: function() {
		return this.qWidth != null?this.qWidth:this.get_textWidth();
	}
	,drawToSurface: function(cnv,ctx,mtx,ctr,blendMode,clipRect,smoothing) {
		var q = this.defaultTextFormat;
		ctx.save();
		ctx.fillStyle = this.component.style.color;
		ctx.font = this.qFontStyle;
		ctx.textBaseline = "top";
		ctx.textAlign = "left";
		ctx.fillText(this.get_text(),0,0);
		ctx.restore();
	}
	,setSelection: function(v,o) {
		if(this.qEditable) this.qTextArea.setSelectionRange(v,o);
	}
	,appendText: function(v) {
	}
	,set_text: function(v) {
		if(this.get_text() != v) {
			var o, q = this.defaultTextFormat, z = this.qEditable;
			this.qText = v;
			if(z) this.qTextArea.value = v; else if(this.component.innerText == null) this.component.innerHTML = StringTools.replace(StringTools.htmlEscape(v),"\n","<br>"); else this.component.innerText = v;
			o = (z?this.qTextArea:this.component).style;
			this.qFontStyle = o.font = q.get_fontStyle();
			o.lineHeight = (this.qLineHeight = q.size * 1.25 | 0) + "px";
			o.color = flash.Lib.rgbf(q.color != null?q.color:this.textColor,1);
		}
		return v;
	}
	,get_text: function() {
		return this.qEditable?this.qTextArea.value:this.qText;
	}
	,setTextFormat: function(v,f,l) {
	}
	,__class__: flash.text.TextField
	,__properties__: $extend(flash.display.InteractiveObject.prototype.__properties__,{set_autoSize:"set_autoSize",set_maxChars:"set_maxChars",set_multiline:"set_multiline",set_selectable:"set_selectable",get_selectedText:"get_selectedText",set_selectionBeginIndex:"set_selectionBeginIndex",get_selectionBeginIndex:"get_selectionBeginIndex",set_selectionEndIndex:"set_selectionEndIndex",get_selectionEndIndex:"get_selectionEndIndex",set_text:"set_text",get_text:"get_text",get_textHeight:"get_textHeight",get_textWidth:"get_textWidth",set_type:"set_type"})
});
flash.text.TextFieldAutoSize = function() { }
$hxClasses["flash.text.TextFieldAutoSize"] = flash.text.TextFieldAutoSize;
flash.text.TextFieldAutoSize.__name__ = ["flash","text","TextFieldAutoSize"];
flash.text.TextFormat = function(in_font,in_size,in_color,in_bold,in_italic,in_underline,in_url,in_target,in_align,in_leftMargin,in_rightMargin,in_indent,in_leading) {
	this.font = in_font;
	this.size = in_size;
	this.color = in_color;
	this.bold = in_bold;
	this.italic = in_italic;
	this.underline = in_underline;
	this.url = in_url;
	this.target = in_target;
	this.align = in_align;
	this.leftMargin = in_leftMargin;
	this.rightMargin = in_rightMargin;
	this.indent = in_indent;
	this.leading = in_leading;
};
$hxClasses["flash.text.TextFormat"] = flash.text.TextFormat;
flash.text.TextFormat.__name__ = ["flash","text","TextFormat"];
flash.text.TextFormat.translateFont = function(n) {
	switch(n) {
	case "_sans":
		return "sans-serif";
	case "_serif":
		return "sans";
	case "_typewriter":
		return "monospace";
	default:
		if(n == null) return "sans-serif";
		return n;
	}
}
flash.text.TextFormat.prototype = {
	get_fontStyle: function() {
		return (this.bold?"bold ":"") + (this.italic?"italic ":"") + this.size + "px " + flash.text.TextFormat.translateFont(this.font);
	}
	,clone: function() {
		var o = new flash.text.TextFormat(this.font,this.size,this.color,this.bold,this.italic,this.underline,this.url,this.target);
		o.align = this.align;
		o.leftMargin = this.leftMargin;
		o.rightMargin = this.rightMargin;
		o.indent = this.indent;
		o.leading = this.leading;
		o.blockIndent = this.blockIndent;
		o.bullet = this.bullet;
		o.display = this.display;
		o.kerning = this.kerning;
		o.letterSpacing = this.letterSpacing;
		o.tabStops = this.tabStops;
		return o;
	}
	,__class__: flash.text.TextFormat
}
flash.text.TextFormatAlign = $hxClasses["flash.text.TextFormatAlign"] = { __ename__ : true, __constructs__ : ["LEFT","RIGHT","JUSTIFY","CENTER"] }
flash.text.TextFormatAlign.LEFT = ["LEFT",0];
flash.text.TextFormatAlign.LEFT.toString = $estr;
flash.text.TextFormatAlign.LEFT.__enum__ = flash.text.TextFormatAlign;
flash.text.TextFormatAlign.RIGHT = ["RIGHT",1];
flash.text.TextFormatAlign.RIGHT.toString = $estr;
flash.text.TextFormatAlign.RIGHT.__enum__ = flash.text.TextFormatAlign;
flash.text.TextFormatAlign.JUSTIFY = ["JUSTIFY",2];
flash.text.TextFormatAlign.JUSTIFY.toString = $estr;
flash.text.TextFormatAlign.JUSTIFY.__enum__ = flash.text.TextFormatAlign;
flash.text.TextFormatAlign.CENTER = ["CENTER",3];
flash.text.TextFormatAlign.CENTER.toString = $estr;
flash.text.TextFormatAlign.CENTER.__enum__ = flash.text.TextFormatAlign;
flash.ui = {}
flash.ui.Mouse = function() { }
$hxClasses["flash.ui.Mouse"] = flash.ui.Mouse;
flash.ui.Mouse.__name__ = ["flash","ui","Mouse"];
flash.ui.Mouse.hide = function() {
	flash.Lib.get_stage().component.style.cursor = "none";
}
flash.ui.Mouse.show = function() {
	flash.Lib.get_stage().component.style.cursor = null;
}
flash.ui.Multitouch = function() { }
$hxClasses["flash.ui.Multitouch"] = flash.ui.Multitouch;
flash.ui.Multitouch.__name__ = ["flash","ui","Multitouch"];
flash.ui.MultitouchInputMode = $hxClasses["flash.ui.MultitouchInputMode"] = { __ename__ : true, __constructs__ : ["GESTURE","NONE","TOUCH_POINT"] }
flash.ui.MultitouchInputMode.GESTURE = ["GESTURE",0];
flash.ui.MultitouchInputMode.GESTURE.toString = $estr;
flash.ui.MultitouchInputMode.GESTURE.__enum__ = flash.ui.MultitouchInputMode;
flash.ui.MultitouchInputMode.NONE = ["NONE",1];
flash.ui.MultitouchInputMode.NONE.toString = $estr;
flash.ui.MultitouchInputMode.NONE.__enum__ = flash.ui.MultitouchInputMode;
flash.ui.MultitouchInputMode.TOUCH_POINT = ["TOUCH_POINT",2];
flash.ui.MultitouchInputMode.TOUCH_POINT.toString = $estr;
flash.ui.MultitouchInputMode.TOUCH_POINT.__enum__ = flash.ui.MultitouchInputMode;
flash.utils = {}
flash.utils.ByteArray = function() {
	this.littleEndian = false;
	this.length = 0;
	this._nmeResizeBuffer(this.allocated = this.position = 0);
};
$hxClasses["flash.utils.ByteArray"] = flash.utils.ByteArray;
flash.utils.ByteArray.__name__ = ["flash","utils","ByteArray"];
flash.utils.ByteArray.fromBytes = function(inBytes) {
	var r = new flash.utils.ByteArray();
	r.byteView = new Uint8Array(inBytes.b);
	r.set_length(r.byteView.length);
	r.allocated = r.length;
	return r;
}
flash.utils.ByteArray.nmeOfBuffer = function(buffer) {
	var r = new flash.utils.ByteArray();
	r.set_length(r.allocated = buffer.byteLength);
	r.data = new DataView(buffer);
	r.byteView = new Uint8Array(buffer);
	return r;
}
flash.utils.ByteArray.prototype = {
	set_length: function(value) {
		if(this.allocated < value) this._nmeResizeBuffer(this.allocated = Math.max(value,this.allocated * 2) | 0); else if(this.allocated > value) this._nmeResizeBuffer(this.allocated = value);
		return this.length = value;
	}
	,set_endian: function(endian) {
		this.littleEndian = endian == "littleEndian";
		return endian;
	}
	,get_endian: function() {
		return this.littleEndian?"littleEndian":"bigEndian";
	}
	,get_bytesAvailable: function() {
		return this.length - this.position;
	}
	,writeUTFBytes: function(value) {
		var i = -1, l = value.length, c;
		while(++i < l) {
			c = value.charCodeAt(i);
			if(c <= 127) this.writeByte(c); else if(c <= 2047) {
				this.writeByte(192 | c >> 6);
				this.writeByte(128 | c & 63);
			} else if(c <= 65535) {
				this.writeByte(224 | c >> 12);
				this.writeByte(128 | c >> 6 & 63);
				this.writeByte(128 | c & 63);
			} else {
				this.writeByte(240 | c >> 18);
				this.writeByte(128 | c >> 12 & 63);
				this.writeByte(128 | c >> 6 & 63);
				this.writeByte(128 | c & 63);
			}
		}
	}
	,writeUTF: function(value) {
		this.writeUnsignedShort(this._getUTFBytesCount(value));
		this.writeUTFBytes(value);
	}
	,writeUnsignedShort: function(value) {
		var l = this.position + 2;
		if(this.length < l) this.set_length(l);
		this.data.setUint16(this.position,value,this.littleEndian);
		this.position += 2;
	}
	,writeUnsignedInt: function(value) {
		var l = this.position + 4;
		if(this.length < l) this.set_length(l);
		this.data.setUint32(this.position,value,this.littleEndian);
		this.position += 4;
	}
	,writeShort: function(value) {
		var l = this.position + 2;
		if(this.length < l) this.set_length(l);
		this.data.setInt16(this.position,value,this.littleEndian);
		this.position += 2;
	}
	,writeInt: function(value) {
		var l = this.position + 4;
		if(this.length < l) this.set_length(l);
		this.data.setInt32(this.position,value,this.littleEndian);
		this.position += 4;
	}
	,writeFloat: function(x) {
		var l = this.position + 4;
		if(this.length < l) this.set_length(l);
		this.data.setFloat32(this.position,x,this.littleEndian);
		this.position += 4;
	}
	,writeDouble: function(x) {
		var l = this.position + 8;
		if(this.length < l) this.set_length(l);
		this.data.setFloat64(this.position,x,this.littleEndian);
		this.position += 8;
	}
	,writeBytes: function(bytes,offset,length) {
		if(offset < 0 || length < 0) throw new flash.errors.IOError("Write error - Out of bounds");
		var l = this.position + length;
		if(this.length < l) this.set_length(l);
		this.byteView.set(bytes.byteView.subarray(offset,offset + length),this.position);
		this.position += length;
	}
	,writeByte: function(v) {
		var l = this.position + 1;
		if(this.length < l) this.set_length(l);
		var data = this.data;
		data.setInt8(this.position,v);
		this.position += 1;
	}
	,writeBoolean: function(v) {
		this.writeByte(v?1:0);
	}
	,toBase64: function() {
		var o = this, q = o.position, l = o.length, p = -1, v = o.data, r = "", m = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", a, b, c;
		while(++p < l) {
			a = v.getUint8(p);
			b = ++p < l?v.getUint8(p):0;
			c = ++p < l?v.getUint8(p):0;
			r += m.charAt(a >> 2) + m.charAt((a & 3) << 4 | b >> 4) + (p - 1 < l?m.charAt((b & 15) << 2 | c >> 6):"=") + (p < l?m.charAt(c & 63):"=");
		}
		return r;
	}
	,toString: function() {
		var o = this.position, r;
		this.position = 0;
		r = this.readUTFBytes(this.length);
		this.position = o;
		return r;
	}
	,readUTFBytes: function(len) {
		var r = "", max = this.position + len;
		while(this.position < max) {
			var c = this.data.getUint8(this.position++);
			if(c < 128) {
				if(c == 0) break;
				r += String.fromCharCode(c);
			} else if(c < 224) r += String.fromCharCode((c & 63) << 6 | this.data.getUint8(this.position++) & 127); else if(c < 240) {
				var c2 = this.data.getUint8(this.position++);
				r += String.fromCharCode((c & 31) << 12 | (c2 & 127) << 6 | this.data.getUint8(this.position++) & 127);
			} else {
				var c2 = this.data.getUint8(this.position++);
				var c3 = this.data.getUint8(this.position++);
				r += String.fromCharCode((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | this.data.getUint8(this.position++) & 127);
			}
		}
		return r;
	}
	,readUTF: function() {
		return this.readUTFBytes(this.readUnsignedShort());
	}
	,readUnsignedShort: function() {
		var r = this.data.getUint16(this.position,this.littleEndian);
		this.position += 2;
		return r;
	}
	,readUnsignedInt: function() {
		var uInt = this.data.getUint32(this.position,this.littleEndian);
		this.position += 4;
		return uInt;
	}
	,readUnsignedByte: function() {
		return this.data.getUint8(this.position++);
	}
	,readShort: function() {
		var r = this.data.getInt16(this.position,this.littleEndian);
		this.position += 2;
		return r;
	}
	,readInt: function() {
		var r = this.data.getInt32(this.position,this.littleEndian);
		this.position += 4;
		return r;
	}
	,readFullBytes: function(bytes,pos,len) {
		if(this.length < len) this.set_length(len);
		var _g1 = pos, _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			this.data.setInt8(this.position++,bytes.b[i]);
		}
	}
	,readFloat: function() {
		var r = this.data.getFloat32(this.position,this.littleEndian);
		this.position += 4;
		return r;
	}
	,readDouble: function() {
		var r = this.data.getFloat64(this.position,this.littleEndian);
		this.position += 8;
		return r;
	}
	,readBytes: function(bytes,offset,length) {
		if(offset == null) offset = 0;
		if(length == null) length = this.length;
		if(offset < 0 || length < 0) throw new flash.errors.IOError("Read error - Out of bounds");
		var l = offset + length;
		if(bytes.length < l) bytes.set_length(l);
		bytes.byteView.set(this.byteView.subarray(this.position,this.position + length),offset);
		bytes.position = offset;
		this.position += length;
		if(bytes.position + length > bytes.length) bytes.set_length(bytes.position + length);
	}
	,readByte: function() {
		return this.data.getUint8(this.position++);
	}
	,readBoolean: function() {
		return this.data.getUint8(this.position++) != 0;
	}
	,nmeSet: function(p,v) {
		this.data.setUint8(p,v);
	}
	,nmeGetBuffer: function() {
		return this.data.buffer;
	}
	,nmeGet: function(pos) {
		return this.data.getUint8(pos);
	}
	,nmeFromBytes: function(inBytes) {
		this.byteView = new Uint8Array(inBytes.b);
		this.set_length(this.byteView.length);
		this.allocated = this.length;
	}
	,clear: function() {
		this.set_length(this.position = 0);
	}
	,_nmeResizeBuffer: function(len) {
		var oldByteView = this.byteView;
		var newByteView = new Uint8Array(len);
		if(oldByteView != null) {
			if(oldByteView.length <= len) newByteView.set(oldByteView); else newByteView.set(oldByteView.subarray(0,len));
		}
		this.byteView = newByteView;
		this.data = new DataView(newByteView.buffer);
	}
	,_getUTFBytesCount: function(value) {
		var r = 0, i = -1, l = value.length, c;
		var count = 0;
		while(++i < l) {
			c = value.charCodeAt(i);
			r += c <= 127?1:c <= 2047?2:c <= 65535?3:4;
		}
		return r;
	}
	,__set: function(pos,v) {
		this.data.setUint8(pos,v);
	}
	,__get: function(pos) {
		return this.data.getUint8(pos);
	}
	,__class__: flash.utils.ByteArray
	,__properties__: {get_bytesAvailable:"get_bytesAvailable",set_endian:"set_endian",get_endian:"get_endian",set_length:"set_length"}
}
flash.utils.Endian = function() { }
$hxClasses["flash.utils.Endian"] = flash.utils.Endian;
flash.utils.Endian.__name__ = ["flash","utils","Endian"];
var haxe = {}
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : true, __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.CallStack = function() { }
$hxClasses["haxe.CallStack"] = haxe.CallStack;
haxe.CallStack.__name__ = ["haxe","CallStack"];
haxe.CallStack.exceptionStack = function() {
	return [];
}
haxe.CallStack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += "\nCalled from ";
		haxe.CallStack.itemToString(b,s);
	}
	return b.b;
}
haxe.CallStack.itemToString = function(b,s) {
	var $e = (s);
	switch( $e[1] ) {
	case 0:
		b.b += "a C function";
		break;
	case 1:
		var m = $e[2];
		b.b += "module ";
		b.b += Std.string(m);
		break;
	case 2:
		var line = $e[4], file = $e[3], s1 = $e[2];
		if(s1 != null) {
			haxe.CallStack.itemToString(b,s1);
			b.b += " (";
		}
		b.b += Std.string(file);
		b.b += " line ";
		b.b += Std.string(line);
		if(s1 != null) b.b += ")";
		break;
	case 3:
		var meth = $e[3], cname = $e[2];
		b.b += Std.string(cname);
		b.b += ".";
		b.b += Std.string(meth);
		break;
	case 4:
		var n = $e[2];
		b.b += "local function #";
		b.b += Std.string(n);
		break;
	}
}
haxe.Resource = function() { }
$hxClasses["haxe.Resource"] = haxe.Resource;
haxe.Resource.__name__ = ["haxe","Resource"];
haxe.Resource.listNames = function() {
	var names = new Array();
	var _g = 0, _g1 = haxe.Resource.content;
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		names.push(x.name);
	}
	return names;
}
haxe.Timer = function() { }
$hxClasses["haxe.Timer"] = haxe.Timer;
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
}
haxe.ds = {}
haxe.ds.IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe.ds.IntMap;
haxe.ds.IntMap.__name__ = ["haxe","ds","IntMap"];
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,get: function(key) {
		return this.h[key];
	}
	,set: function(key,value) {
		this.h[key] = value;
	}
	,__class__: haxe.ds.IntMap
}
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe.ds.ObjectMap;
haxe.ds.ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe.ds.ObjectMap.__interfaces__ = [IMap];
haxe.ds.ObjectMap.prototype = {
	remove: function(key) {
		var id = key.__id__;
		if(!this.h.hasOwnProperty(id)) return false;
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
	}
	,set: function(key,value) {
		var id = key.__id__ != null?key.__id__:key.__id__ = ++haxe.ds.ObjectMap.count;
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,__class__: haxe.ds.ObjectMap
}
haxe.ds.StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe.ds.StringMap;
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,__class__: haxe.ds.StringMap
}
haxe.io = {}
haxe.io.Bytes = function() { }
$hxClasses["haxe.io.Bytes"] = haxe.io.Bytes;
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.prototype = {
	__class__: haxe.io.Bytes
}
haxe.io.Eof = function() { }
$hxClasses["haxe.io.Eof"] = haxe.io.Eof;
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
}
var js = {}
js.Boot = function() { }
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = ["js","Boot"];
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Browser = function() { }
$hxClasses["js.Browser"] = js.Browser;
js.Browser.__name__ = ["js","Browser"];
var love2d = {}
love2d.Handler = function() {
	this._timer = 0;
	this.fps = 0;
	this.hasFocus = true;
	this.mouseWheel = 0;
	this.mouseMiddlePressed = false;
	this.mouseRightPressed = false;
	this.mouseLeftPressed = false;
	var _g1 = this;
	flash.display.Sprite.call(this);
	this.joysticks = [];
	this.realJoysticks = [];
	this._rect = new flash.geom.Rectangle();
	this._point = new flash.geom.Point();
	this._joy = new love2d.utils.Joystick(0);
	var _g = 0;
	while(_g < 4) {
		var i = _g++;
		var j = { buttons : (function($this) {
			var $r;
			var _g11 = [];
			{
				var _g2 = 0;
				while(_g2 < 20) {
					var it = _g2++;
					_g11.push(false);
				}
			}
			$r = _g11;
			return $r;
		}(this)), axes : (function($this) {
			var $r;
			var _g2 = [];
			{
				var _g3 = 0;
				while(_g3 < 4) {
					var it = _g3++;
					_g2.push(0);
				}
			}
			$r = _g2;
			return $r;
		}(this)), axisCount : 0};
		this.joysticks.push(j);
		this.realJoysticks.push(new love2d.utils.Joystick(i));
	}
	flash.Lib.get_current().get_stage().addChild(this);
	love2d.Love.audio = new love2d.utils.LoveAudio();
	love2d.Love.event = new love2d.utils.LoveEvent();
	love2d.Love.filesystem = new love2d.utils.LoveFilesystem();
	love2d.Love.font = new love2d.utils.LoveFont();
	love2d.Love.graphics = new love2d.utils.LoveGraphics();
	love2d.Love.image = new love2d.utils.LoveImage();
	love2d.Love.joystick = new love2d.utils.LoveJoystick();
	love2d.Love.keyboard = new love2d.utils.LoveKeyboard();
	love2d.Love.math = new love2d.utils.LoveMath();
	love2d.Love.mouse = new love2d.utils.LoveMouse();
	love2d.Love.physics = new love2d.utils.LovePhysics();
	love2d.Love.sound = new love2d.utils.LoveSound();
	love2d.Love.system = new love2d.utils.LoveSystem();
	love2d.Love.thread = new love2d.utils.LoveThread();
	love2d.Love.timer = new love2d.utils.LoveTimer();
	love2d.Love.touch = new love2d.utils.LoveTouch();
	love2d.Love.window = new love2d.utils.LoveWindow();
	this.keys = (function($this) {
		var $r;
		var _g = [];
		{
			var _g11 = 0;
			while(_g11 < 255) {
				var i = _g11++;
				_g.push(false);
			}
		}
		$r = _g;
		return $r;
	}(this));
	this.addEventListener("enterFrame",function(e) {
		var t = flash.Lib.getTimer();
		_g1.dt = (t - _g1._timer) * .001;
		_g1._timer = t;
		if(love2d.Love.update != null) love2d.Love.update(_g1.dt);
		if(love2d.Love.draw != null) {
			love2d.Love.graphics.clear();
			love2d.Love.graphics.setColor(_g1.color.r,_g1.color.g,_g1.color.b,_g1.color.a);
			love2d.Love.draw();
			if(_g1.cursor != null) {
				var img = _g1.cursor._image;
				love2d.Love.graphics.draw(img,love2d.Love.handler.get_stage().get_mouseX(),love2d.Love.handler.get_stage().get_mouseY());
				_g1.get_graphics().clear();
				_g1._rect.width = img._bitmapData.component.width;
				_g1._rect.height = img._bitmapData.component.height;
				_g1.canvas.copyPixels(img._bitmapData,_g1._rect,_g1._point);
			}
		}
	});
	this.get_stage().addEventListener("keydown",function(e) {
		if(!_g1.keys[e.keyCode] && love2d.Love.keypressed != null) love2d.Love.keypressed(love2d.utils.LoveKeyboard.toChar(e.keyCode),false);
		_g1.keys[e.keyCode] = true;
		if(love2d.Love.keyboard._textInput) {
			var s = love2d.utils.LoveKeyboard.toChar(e.keyCode);
			if(love2d.Love.keyboard.isDown("lshift")) s = s.toUpperCase();
			if(s != "LSHIFT") {
				if(love2d.Love.textinput != null) love2d.Love.textinput(s);
			}
		}
	});
	this.get_stage().addEventListener("keyup",function(e) {
		if(_g1.keys[e.keyCode] && love2d.Love.keyreleased != null) love2d.Love.keyreleased(love2d.utils.LoveKeyboard.toChar(e.keyCode));
		_g1.keys[e.keyCode] = false;
	});
	this.get_stage().addEventListener("mousedown",function(e) {
		if(!_g1.mouseLeftPressed && love2d.Love.mousepressed != null) love2d.Love.mousepressed(e.get_stageX(),e.get_stageY(),"l");
		_g1.mouseLeftPressed = true;
	});
	this.get_stage().addEventListener("mouseup",function(e) {
		if(_g1.mouseLeftPressed && love2d.Love.mousereleased != null) love2d.Love.mousereleased(e.get_stageX(),e.get_stageY(),"l");
		_g1.mouseLeftPressed = false;
	});
	this.get_stage().addEventListener("mousewheel",function(e) {
		if(_g1.mouseWheel != e.get_delta()) {
			var dir = _g1.sign(e.get_delta()) == 1?"wu":"wd";
			if(love2d.Love.mousepressed != null) love2d.Love.mousepressed(e.get_stageX(),e.get_stageY(),dir);
			if(love2d.Love.mousereleased != null) love2d.Love.mousereleased(e.get_stageX(),e.get_stageY(),dir);
		}
		_g1.mouseWheel = e.get_delta();
	});
	this.get_stage().addEventListener("touchbegin",function(e) {
		var t = love2d.Love.touch._list[e.touchPointID];
		t._x = e.stageX;
		t._y = e.stageY;
		if(Reflect.hasField(e,"pressure")) t._pressure = Reflect.getProperty(e,"pressure"); else t._pressure = 1;
		t._isDown = true;
		if(love2d.Love.touchpressed != null) love2d.Love.touchpressed(e.stageX,e.stageY,t);
		love2d.Love.touch._count++;
	});
	this.get_stage().addEventListener("touchend",function(e) {
		var t = love2d.Love.touch._list[e.touchPointID];
		t._x = e.stageX;
		t._y = e.stageY;
		if(Reflect.hasField(e,"pressure")) t._pressure = Reflect.getProperty(e,"pressure"); else t._pressure = 1;
		if(love2d.Love.touchreleased != null) love2d.Love.touchreleased(e.stageX,e.stageY,t);
		love2d.Love.touch._count--;
	});
	this.get_stage().addEventListener("resize",function(e) {
		_g1.canvas = new flash.display.BitmapData(love2d.Love.handler.get_stage().get_stageWidth(),love2d.Love.handler.get_stage().get_stageHeight());
		_g1.bitmap.set_bitmapData(_g1.canvas);
		if(love2d.Love.resize != null) love2d.Love.resize(love2d.Love.handler.get_stage().get_stageWidth(),love2d.Love.handler.get_stage().get_stageHeight());
	});
	this.get_stage().addEventListener("focus",function(e) {
		if(love2d.Love.focus != null) love2d.Love.focus(true);
		_g1.hasFocus = true;
	});
	this.get_stage().addEventListener("blur",function(e) {
		if(love2d.Love.focus != null) love2d.Love.focus(false);
		_g1.hasFocus = false;
	});
	this.get_stage().addEventListener("close",function(e) {
		if(love2d.Love.quit != null) love2d.Love.quit();
	});
	this.color = { r : 255, g : 255, b : 255, a : 255};
	this.bgColor = { r : 0, g : 0, b : 0, a : 255};
	this.canvas = new flash.display.BitmapData(this.get_stage().get_stageWidth(),this.get_stage().get_stageHeight(),true,0);
	this.bitmap = new flash.display.Bitmap(this.canvas);
	this.addChild(this.bitmap);
};
$hxClasses["love2d.Handler"] = love2d.Handler;
love2d.Handler.__name__ = ["love2d","Handler"];
love2d.Handler.__super__ = flash.display.Sprite;
love2d.Handler.prototype = $extend(flash.display.Sprite.prototype,{
	get_intBgColor: function() {
		return this.rgb(this.bgColor.r,this.bgColor.g,this.bgColor.b);
	}
	,get_intColor: function() {
		return this.rgb(this.color.r,this.color.g,this.color.b);
	}
	,sign: function(n) {
		if(n == 0) return 0;
		return n < 0?-1:1;
	}
	,rgba: function(r,g,b,a) {
		return (r & 255) << 16 | (g & 255) << 8 | b & 255 | a;
	}
	,rgb: function(r,g,b) {
		return (r & 255) << 16 | (g & 255) << 8 | b & 255;
	}
	,__class__: love2d.Handler
	,__properties__: $extend(flash.display.Sprite.prototype.__properties__,{get_intColor:"get_intColor",get_intBgColor:"get_intBgColor"})
});
love2d.Love = function() { }
$hxClasses["love2d.Love"] = love2d.Love;
love2d.Love.__name__ = ["love2d","Love"];
love2d.Love.__properties__ = {get_stage:"get_stage"}
love2d.Love.init = function() {
	var h = new flash.display.Sprite();
	h.addEventListener("addedToStage",function(e) {
		love2d.Love.handler = new love2d.Handler();
		if(!love2d.Love._inited && love2d.Love.load != null) {
			love2d.Love.load();
			love2d.Love._inited = true;
		}
	});
	flash.Lib.get_current().get_stage().addChild(h);
}
love2d.Love.print = function(s) {
	if(console) console.log(s);
}
love2d.Love.get_stage = function() {
	return love2d.Love.handler.get_stage();
}
love2d.Love.newError = function(msg) {
	if(love2d.Love.errhand != null) love2d.Love.errhand(msg);
	if(console) console.log(msg);
}
love2d.utils = {}
love2d.utils.Object = function() {
};
$hxClasses["love2d.utils.Object"] = love2d.utils.Object;
love2d.utils.Object.__name__ = ["love2d","utils","Object"];
love2d.utils.Object.prototype = {
	typeOf: function(name) {
		return false;
	}
	,type: function() {
		return Type.getClassName(Type.getClass(this));
	}
	,__class__: love2d.utils.Object
}
love2d.utils.BezierCurve = function(vertices) {
	love2d.utils.Object.call(this);
	this._vertices = vertices;
};
$hxClasses["love2d.utils.BezierCurve"] = love2d.utils.BezierCurve;
love2d.utils.BezierCurve.__name__ = ["love2d","utils","BezierCurve"];
love2d.utils.BezierCurve.__super__ = love2d.utils.Object;
love2d.utils.BezierCurve.prototype = $extend(love2d.utils.Object.prototype,{
	subdivide: function(points,k) {
		if(k <= 0) return;
		var left, right;
	}
	,getDegree: function() {
		return this._vertices.length - 1;
	}
	,getControlPointCount: function() {
		return this._vertices.length;
	}
	,getControlPoint: function(i) {
		if(i > 0 && i < this._vertices.length) return this._vertices[i]; else return null;
	}
	,render: function(depth) {
		if(depth == null) depth = 5;
		return null;
	}
	,getDerivative: function() {
		var diff = (function($this) {
			var $r;
			var _g = [];
			{
				var _g2 = 0, _g1 = $this._vertices.length - 1;
				while(_g2 < _g1) {
					var i = _g2++;
					_g.push({ x : 0, y : 0});
				}
			}
			$r = _g;
			return $r;
		}(this));
		var degree = this._vertices.length - 1;
		var _g2 = 0, _g1 = diff.length;
		while(_g2 < _g1) {
			var i = _g2++;
			diff[i].x = (this._vertices[i + 1].x - this._vertices[i].x) * degree;
			diff[i].y = (this._vertices[i + 1].y - this._vertices[i].y) * degree;
		}
		return new love2d.utils.BezierCurve(diff);
	}
	,evaluate: function(t) {
		if(t < 0 || t > 1) {
			if(love2d.Love.errhand != null) love2d.Love.errhand("Invalid evaluation parameter: must be between 0 and 1");
			if(console) console.log("Invalid evaluation parameter: must be between 0 and 1");
			return null;
		}
		if(this._vertices.length < 2) {
			if(love2d.Love.errhand != null) love2d.Love.errhand("Invalid Bezier curve: Not enough control points.");
			if(console) console.log("Invalid Bezier curve: Not enough control points.");
			return null;
		}
		var points = this._vertices.slice();
		var _g1 = 1, _g = this._vertices.length;
		while(_g1 < _g) {
			var step = _g1++;
			var _g3 = 0, _g2 = this._vertices.length - step;
			while(_g3 < _g2) {
				var i = _g3++;
				points[i].x = points[i].x * (1 - t) + points[i + 1].x * t;
				points[i].y = points[i].y * (1 - t) + points[i + 1].y * t;
			}
		}
		return points[0];
	}
	,scale: function(s,ox,oy) {
		if(oy == null) oy = 0;
		if(ox == null) ox = 0;
		var _g1 = 0, _g = this._vertices.length;
		while(_g1 < _g) {
			var i = _g1++;
			var cx = this._vertices[i].x;
			var cy = this._vertices[i].y;
			this._vertices[i] = { x : (cx - ox) * s + ox, y : (cy - oy) * s + oy};
		}
	}
	,rotate: function(angle,ox,oy) {
		if(oy == null) oy = 0;
		if(ox == null) ox = 0;
		var c = Math.cos(angle);
		var s = Math.sin(angle);
		var _g1 = 0, _g = this._vertices.length;
		while(_g1 < _g) {
			var i = _g1++;
			var cx = this._vertices[i].x;
			var cy = this._vertices[i].y;
			this._vertices[i] = { x : c * (cx - ox) - s * (cy - oy) + ox, y : s * (cx - ox) + c * (cy - oy) + oy};
		}
	}
	,translate: function(dx,dy) {
		var _g1 = 0, _g = this._vertices.length;
		while(_g1 < _g) {
			var i = _g1++;
			var cx = this._vertices[i].x;
			var cy = this._vertices[i].y;
			this._vertices[i] = { x : cx + dx, y : cy + dy};
		}
	}
	,setControlPoint: function(i,x,y) {
		if(i > 0 && i < this._vertices.length) this._vertices[i] = { x : x, y : y};
	}
	,insertControlPoint: function(x,y,i) {
		if(i == null) i = -1;
		var p = { x : x, y : y};
		if(i > this._vertices.length - 1) i = -1;
		if(i == -1) i = this._vertices.length;
		if(i == -2) i = this._vertices.length - 1;
		this._vertices.splice(i,0,p);
	}
	,__class__: love2d.utils.BezierCurve
});
love2d.utils.Cursor = function(data,hotx,hoty) {
	if(hoty == null) hoty = 0;
	if(hotx == null) hotx = 0;
	love2d.utils.Object.call(this);
	if(js.Boot.__instanceof(data,String)) {
		this._image = love2d.Love.graphics.newImage(data);
		this._type = "image";
	}
	this._hotx = hotx;
	this._hoty = hoty;
};
$hxClasses["love2d.utils.Cursor"] = love2d.utils.Cursor;
love2d.utils.Cursor.__name__ = ["love2d","utils","Cursor"];
love2d.utils.Cursor.__super__ = love2d.utils.Object;
love2d.utils.Cursor.prototype = $extend(love2d.utils.Object.prototype,{
	getImage: function() {
		return this._image;
	}
	,getType: function() {
		return this._type;
	}
	,__class__: love2d.utils.Cursor
});
love2d.utils.Data = function() {
	love2d.utils.Object.call(this);
};
$hxClasses["love2d.utils.Data"] = love2d.utils.Data;
love2d.utils.Data.__name__ = ["love2d","utils","Data"];
love2d.utils.Data.__super__ = love2d.utils.Object;
love2d.utils.Data.prototype = $extend(love2d.utils.Object.prototype,{
	getString: function() {
		return "";
	}
	,getSize: function() {
		return 0;
	}
	,getPointer: function() {
		return null;
	}
	,__class__: love2d.utils.Data
});
love2d.utils.Drawable = function() {
	love2d.utils.Object.call(this);
};
$hxClasses["love2d.utils.Drawable"] = love2d.utils.Drawable;
love2d.utils.Drawable.__name__ = ["love2d","utils","Drawable"];
love2d.utils.Drawable.__super__ = love2d.utils.Object;
love2d.utils.Drawable.prototype = $extend(love2d.utils.Object.prototype,{
	draw: function(x,y,r,sx,sy,ox,oy,quad) {
	}
	,__class__: love2d.utils.Drawable
});
love2d.utils.Font = function(data,size) {
	if(size == null) size = 12;
	love2d.utils.Object.call(this);
	if(js.Boot.__instanceof(data,String)) this._flashFont = openfl.Assets.getFont(data);
	this._size = size;
};
$hxClasses["love2d.utils.Font"] = love2d.utils.Font;
love2d.utils.Font.__name__ = ["love2d","utils","Font"];
love2d.utils.Font.__super__ = love2d.utils.Object;
love2d.utils.Font.prototype = $extend(love2d.utils.Object.prototype,{
	getSize: function() {
		return this._size;
	}
	,getFlashFont: function() {
		return this._flashFont;
	}
	,hasGlyphs: function(text) {
		return this._flashFont.hasGlyphs(text);
	}
	,__class__: love2d.utils.Font
});
love2d.utils.Image = function(data) {
	love2d.utils.Drawable.call(this);
	if(js.Boot.__instanceof(data,String)) this._bitmapData = openfl.Assets.getBitmapData(data);
};
$hxClasses["love2d.utils.Image"] = love2d.utils.Image;
love2d.utils.Image.__name__ = ["love2d","utils","Image"];
love2d.utils.Image.__super__ = love2d.utils.Drawable;
love2d.utils.Image.prototype = $extend(love2d.utils.Drawable.prototype,{
	draw: function(x,y,r,sx,sy,ox,oy,quad) {
		love2d.Love.graphics.bitmap(this._bitmapData,x,y,sx,sy,r,ox,oy,quad);
	}
	,getDimensions: function() {
		return { width : this._bitmapData.component.width, height : this._bitmapData.component.height};
	}
	,getHeight: function() {
		return this._bitmapData.component.height;
	}
	,getWidth: function() {
		return this._bitmapData.component.width;
	}
	,__class__: love2d.utils.Image
});
love2d.utils.ImageData = function(width,height) {
	love2d.utils.Data.call(this);
	this._bitmapData = new flash.display.BitmapData(width,height);
};
$hxClasses["love2d.utils.ImageData"] = love2d.utils.ImageData;
love2d.utils.ImageData.__name__ = ["love2d","utils","ImageData"];
love2d.utils.ImageData.__super__ = love2d.utils.Data;
love2d.utils.ImageData.prototype = $extend(love2d.utils.Data.prototype,{
	mapPixel: function(pixelFunction) {
	}
	,getPixel: function(x,y) {
		if(x > -1 && y > -1 && x < this._bitmapData.component.width && y < this._bitmapData.component.height) {
		} else {
			if(love2d.Love.errhand != null) love2d.Love.errhand("The X and Y must be in range of [0, w - 1 or h - 1]");
			if(console) console.log("The X and Y must be in range of [0, w - 1 or h - 1]");
		}
		return null;
	}
	,setPixel: function(x,y,r,g,b,a) {
		if(x > -1 && y > -1 && x < this._bitmapData.component.width && y < this._bitmapData.component.height) this._bitmapData.setPixel32(x,y,love2d.Love.handler.rgba(r,g,b,a)); else {
			if(love2d.Love.errhand != null) love2d.Love.errhand("The X and Y must be in range of [0, w - 1 or h - 1]");
			if(console) console.log("The X and Y must be in range of [0, w - 1 or h - 1]");
		}
	}
	,getDimensions: function() {
		return { width : this._bitmapData.component.width, height : this._bitmapData.component.height};
	}
	,getHeight: function() {
		return this._bitmapData.component.height;
	}
	,getWidth: function() {
		return this._bitmapData.component.width;
	}
	,__class__: love2d.utils.ImageData
});
love2d.utils.Joystick = function(id) {
	love2d.utils.Object.call(this);
	this._id = id;
};
$hxClasses["love2d.utils.Joystick"] = love2d.utils.Joystick;
love2d.utils.Joystick.__name__ = ["love2d","utils","Joystick"];
love2d.utils.Joystick.__super__ = love2d.utils.Object;
love2d.utils.Joystick.prototype = $extend(love2d.utils.Object.prototype,{
	getGamepadMapping: function(axis,callBack) {
	}
	,isGamepadDown: function(button) {
		return false;
	}
	,isGamepad: function() {
		return true;
	}
	,isConnected: function() {
		return true;
	}
	,getName: function() {
		return "unknown";
	}
	,setVibration: function(left,right) {
		if(right == null) right = 0;
		if(left == null) left = 0;
		return false;
	}
	,getVibration: function() {
		return { left : 0, right : 0};
	}
	,isVibrationSupported: function() {
		return false;
	}
	,getButtonCount: function() {
		return 20;
	}
	,getHatCount: function() {
		return 2;
	}
	,getHat: function(hat) {
		return "unknown";
	}
	,getAxisCount: function() {
		return love2d.Love.handler.joysticks[this._id].axisCount;
	}
	,getGamepadAxis: function(axis) {
		return love2d.Love.handler.joysticks[this._id].axes[axis];
	}
	,isDown: function(button) {
		return love2d.Love.handler.joysticks[this._id].buttons[button];
	}
	,getAxes: function() {
		return love2d.Love.handler.joysticks[this._id].axes;
	}
	,getAxis: function(axis) {
		return love2d.Love.handler.joysticks[this._id].axes[axis];
	}
	,getGUID: function() {
		return this._id;
	}
	,getID: function() {
		return this._id;
	}
	,__class__: love2d.utils.Joystick
});
love2d.utils.LoveAudio = function() {
	this._volume = 1;
	this._sources = [];
};
$hxClasses["love2d.utils.LoveAudio"] = love2d.utils.LoveAudio;
love2d.utils.LoveAudio.__name__ = ["love2d","utils","LoveAudio"];
love2d.utils.LoveAudio.prototype = {
	newSource: function(data,sourceType) {
		return new love2d.utils.Source(data,sourceType);
	}
	,resume: function(source) {
		if(source != null) source.resume(); else {
			var _g = 0, _g1 = this._sources;
			while(_g < _g1.length) {
				var v = _g1[_g];
				++_g;
				v.resume();
			}
		}
	}
	,stop: function(source) {
		if(source != null) source.stop(); else {
			var _g = 0, _g1 = this._sources;
			while(_g < _g1.length) {
				var v = _g1[_g];
				++_g;
				v.stop();
			}
		}
	}
	,pause: function(source) {
		if(source != null) source.pause(); else {
			var _g = 0, _g1 = this._sources;
			while(_g < _g1.length) {
				var v = _g1[_g];
				++_g;
				v.pause();
			}
		}
	}
	,play: function(source) {
		if(source != null) source.play();
	}
	,getSourceCount: function() {
		var r = 0;
		var _g = 0, _g1 = this._sources;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			if(v._playing) r++;
		}
		return r;
	}
	,getVolume: function() {
		return this._volume;
	}
	,setVolume: function(volume) {
		this._volume = volume;
	}
	,__class__: love2d.utils.LoveAudio
}
love2d.utils.LoveEvent = function() {
};
$hxClasses["love2d.utils.LoveEvent"] = love2d.utils.LoveEvent;
love2d.utils.LoveEvent.__name__ = ["love2d","utils","LoveEvent"];
love2d.utils.LoveEvent.prototype = {
	quit: function() {
		if(love2d.Love.quit != null) love2d.Love.quit();
		flash.system.System.exit(0);
	}
	,push: function(e,a,b,c,d) {
	}
	,pump: function() {
	}
	,wait: function() {
		return null;
	}
	,poll: function() {
		return null;
	}
	,clear: function() {
	}
	,__class__: love2d.utils.LoveEvent
}
love2d.utils.LoveFilesystem = function() {
	this.init();
};
$hxClasses["love2d.utils.LoveFilesystem"] = love2d.utils.LoveFilesystem;
love2d.utils.LoveFilesystem.__name__ = ["love2d","utils","LoveFilesystem"];
love2d.utils.LoveFilesystem.prototype = {
	getLastModified: function(filename) {
		return null;
	}
	,isDirectory: function(filename) {
		return false;
	}
	,createDirectory: function(name) {
		return false;
	}
	,write: function(name,data,size) {
		if(size == null) size = -1;
		return false;
	}
	,read: function(name,size) {
		if(size == null) size = -1;
		return "You can't access files while targeting JS.";
		return "";
	}
	,remove: function(name) {
		return false;
	}
	,exists: function(filename) {
		return false;
	}
	,init: function() {
	}
	,__class__: love2d.utils.LoveFilesystem
}
love2d.utils.LoveFont = function() {
};
$hxClasses["love2d.utils.LoveFont"] = love2d.utils.LoveFont;
love2d.utils.LoveFont.__name__ = ["love2d","utils","LoveFont"];
love2d.utils.LoveFont.prototype = {
	__class__: love2d.utils.LoveFont
}
love2d.utils.LoveGraphics = function() {
	this._lineWidth = 1;
	this._pointSize = 1;
	this._sprite = new flash.display.Sprite();
	this.gr = this._sprite.get_graphics();
	this._bm = new flash.display.Bitmap();
	this._mat = new flash.geom.Matrix();
	this._jointStyle = "round";
	this._bufferRect = new flash.geom.Rectangle();
	this._colorTransform = new flash.geom.ColorTransform();
	this._textFormat = new flash.text.TextFormat();
	this._textField = new flash.text.TextField();
	this._textField.set_text("");
	this._textField.defaultTextFormat = this._textFormat;
	this._textField.embedFonts = true;
	this._textField.set_selectable(false);
	this._textField.set_visible(true);
	this._textField.set_autoSize("LEFT");
	this._sprite.addChild(this._bm);
	flash.Lib.get_current().get_stage().addChild(this._sprite);
};
$hxClasses["love2d.utils.LoveGraphics"] = love2d.utils.LoveGraphics;
love2d.utils.LoveGraphics.__name__ = ["love2d","utils","LoveGraphics"];
love2d.utils.LoveGraphics.prototype = {
	newQuad: function(x,y,width,height,sx,sy) {
		if(height == null) height = 1;
		if(width == null) width = 1;
		if(y == null) y = 0;
		if(x == null) x = 0;
		return new love2d.utils.Quad(x,y,width,height,sx,sy);
	}
	,newSpriteBatch: function(image,size,usageHint) {
		if(usageHint == null) usageHint = "dynamic";
		if(size == null) size = 1000;
		return new love2d.utils.SpriteBatch(image,size,usageHint);
	}
	,newFont: function(data,size) {
		if(size == null) size = 12;
		return new love2d.utils.Font(data,size);
	}
	,newImage: function(data) {
		return new love2d.utils.Image(data);
	}
	,printf: function(text,x,y,limit,align,r,sx,sy,ox,oy) {
		if(oy == null) oy = 0;
		if(ox == null) ox = 0;
		if(sy == null) sy = 1;
		if(sx == null) sx = 1;
		if(r == null) r = 0;
		if(align == null) align = "left";
		if(y == null) y = 0;
		if(x == null) x = 0;
		this._textField.textColor = love2d.Love.handler.get_intColor();
		this._textField.set_visible(true);
		this._textField.set_width(limit);
		this._textField.set_text(text);
		this._textField.set_x(x);
		this._textField.set_y(y);
		this._textField.set_rotation(r);
		this._textField.set_scaleX(sx);
		this._textField.set_scaleY(sy);
		this._textFormat.align = (function($this) {
			var $r;
			switch(align) {
			case "left":
				$r = flash.text.TextFormatAlign.LEFT;
				break;
			case "right":
				$r = flash.text.TextFormatAlign.RIGHT;
				break;
			case "center":
				$r = flash.text.TextFormatAlign.CENTER;
				break;
			case "justify":
				$r = flash.text.TextFormatAlign.JUSTIFY;
				break;
			default:
				$r = flash.text.TextFormatAlign.LEFT;
			}
			return $r;
		}(this));
	}
	,print: function(text,x,y,r,sx,sy,ox,oy) {
		if(oy == null) oy = 0;
		if(ox == null) ox = 0;
		if(sy == null) sy = 1;
		if(sx == null) sx = 1;
		if(r == null) r = 0;
		if(y == null) y = 0;
		if(x == null) x = 0;
		this._textField.textColor = love2d.Love.handler.get_intColor();
		this._textField.set_visible(true);
		this._textField.set_text(text);
		this._textField.set_x(this._textField.set_y(0));
		this._mat.identity();
		this._mat.translate(-ox * sx,-oy * sy);
		this._mat.scale(sx,sy);
		if(r != 0) this._mat.rotate(r);
		this._mat.translate(x + ox * sx,y + oy * sy);
		this._textField.set_x(x);
		this._textField.set_y(y);
		love2d.Love.handler.canvas.draw(this._textField,this._mat);
	}
	,bitmap: function(bd,x,y,scaleX,scaleY,angle,originX,originY,quad) {
		if(originY == null) originY = 0;
		if(originX == null) originX = 0;
		if(angle == null) angle = 0;
		if(scaleY == null) scaleY = 1;
		if(scaleX == null) scaleX = 1;
		if(y == null) y = 0;
		if(x == null) x = 0;
		this.gr.clear();
		this._mat.identity();
		this._mat.translate(-originX,-originY);
		if(quad != null) this._mat.translate(-quad._x,-quad._y); else if(angle != 0) this._mat.rotate(angle);
		this._mat.scale(scaleX,scaleY);
		this._mat.translate(x,y);
		this._colorTransform.redMultiplier = love2d.Love.handler.color.r / 255;
		this._colorTransform.greenMultiplier = love2d.Love.handler.color.g / 255;
		this._colorTransform.blueMultiplier = love2d.Love.handler.color.b / 255;
		this._colorTransform.alphaMultiplier = love2d.Love.handler.color.a / 255;
		if(quad != null) {
			this._bufferRect.x = x + -originX * scaleX;
			this._bufferRect.y = y + -originY * scaleY;
			this._bufferRect.width = quad._width * scaleX;
			this._bufferRect.height = quad._height * scaleY;
			love2d.Love.handler.canvas.draw(bd,this._mat,this._colorTransform,this._blendMode,this._bufferRect,false);
		} else {
			this._bufferRect.setEmpty();
			love2d.Love.handler.canvas.draw(bd,this._mat,this._colorTransform,this._blendMode);
		}
	}
	,draw: function(drawable,x,y,r,sx,sy,ox,oy,quad) {
		if(oy == null) oy = 0;
		if(ox == null) ox = 0;
		if(sy == null) sy = 1;
		if(sx == null) sx = 1;
		if(r == null) r = 0;
		if(y == null) y = 0;
		if(x == null) x = 0;
		drawable.draw(x,y,r,sx,sy,ox,oy,quad);
	}
	,polygon: function(mode,vertices) {
		this.gr.clear();
		if(mode == "fill") this.gr.beginFill(love2d.Love.handler.get_intColor(),love2d.Love.handler.color.a / 255); else this.gr.lineStyle(this._lineWidth,love2d.Love.handler.get_intColor(),love2d.Love.handler.color.a / 255);
		this.gr.moveTo(vertices[0].x,vertices[0].y);
		var _g1 = 1, _g = vertices.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.gr.lineTo(vertices[i].x,vertices[i].y);
		}
		this.gr.lineTo(vertices[0].x,vertices[0].y);
		this.gr.endFill();
		love2d.Love.handler.canvas.draw(this._sprite);
	}
	,arc: function(mode,x,y,radius,angle1,angle2,segments) {
		if(segments == null) segments = 10;
	}
	,line: function(x1,y1,x2,y2) {
		if(js.Boot.__instanceof(x1,Float)) {
		} else if(js.Boot.__instanceof(x1,Array)) {
			if(x1.length == 0) {
				if(console) console.log("Array is empty.");
				return;
			}
			if(x1.length % 2 != 0) x1.pop();
		}
		this.gr.clear();
		this.gr.lineStyle(this._lineWidth,love2d.Love.handler.get_intColor(),love2d.Love.handler.color.a / 255);
		if(js.Boot.__instanceof(x1,Float)) {
			this.gr.moveTo(x2,y2);
			this.gr.lineTo(x1,y1);
		} else if(js.Boot.__instanceof(x1,Array)) {
		}
		love2d.Love.handler.canvas.draw(this._sprite);
	}
	,point: function(x,y) {
		this.rectangle("fill",x,y,this._pointSize,this._pointSize);
	}
	,circle: function(mode,x,y,radius,segments) {
		this.gr.clear();
		if(mode == "line") {
			this.gr.lineStyle(this._lineWidth,love2d.Love.handler.get_intColor(),love2d.Love.handler.color.a / 255);
			this.gr.drawCircle(x,y,radius);
		} else {
			this.gr.beginFill(love2d.Love.handler.get_intColor(),love2d.Love.handler.color.a / 255);
			this.gr.drawCircle(x,y,radius);
			this.gr.endFill();
		}
		love2d.Love.handler.canvas.draw(this._sprite);
	}
	,rectangle: function(mode,x,y,width,height) {
		this.gr.clear();
		if(mode == "line") {
			this.gr.lineStyle(this._lineWidth,love2d.Love.handler.get_intColor(),love2d.Love.handler.color.a / 255);
			this.gr.drawRect(x,y,width,height);
		} else {
			this.gr.beginFill(love2d.Love.handler.get_intColor(),love2d.Love.handler.color.a / 255);
			this.gr.drawRect(x,y,width,height);
			this.gr.endFill();
		}
		love2d.Love.handler.canvas.draw(this._sprite);
	}
	,getBlendMode: function() {
		switch(this._blendMode) {
		case flash.display.BlendMode.ADD:
			return "additive";
		case flash.display.BlendMode.ALPHA:case flash.display.BlendMode.NORMAL:
			return "alpha";
		case flash.display.BlendMode.SUBTRACT:
			return "subtractive";
		case flash.display.BlendMode.MULTIPLY:
			return "multiplicative";
		default:
			return "";
		}
		return "";
	}
	,setBlendMode: function(mode) {
		if(mode == null) mode = "alpha";
		switch(mode) {
		case "additive":
			this._blendMode = flash.display.BlendMode.ADD;
			break;
		case "alpha":
			this._blendMode = flash.display.BlendMode.ALPHA;
			break;
		case "subtractive":
			this._blendMode = flash.display.BlendMode.SUBTRACT;
			break;
		case "multiplicative":
			this._blendMode = flash.display.BlendMode.MULTIPLY;
			break;
		}
	}
	,setNewFont: function(data,size) {
		if(size == null) size = 12;
		var f = this.newFont(data,size);
		this.setFont(f);
		return f;
	}
	,getFont: function() {
		return this._font;
	}
	,setFont: function(font) {
		this._font = font;
		this._textFormat.font = this._font.getFlashFont().fontName;
		this._textFormat.size = this._font.getSize();
		this._textField.defaultTextFormat = this._textFormat;
		this._textField.setTextFormat(this._textFormat,0,this._textField.get_text().length);
	}
	,getPointSize: function() {
		return this._pointSize;
	}
	,setPointSize: function(size) {
		this._pointSize = size;
	}
	,getLineJoin: function() {
		var _g = this;
		switch(_g._jointStyle) {
		case "round":
			return "none";
		case "miter":
			return "miter";
		case "bevel":
			return "bevel";
		}
		return "";
	}
	,setLineJoin: function(join) {
		switch(join) {
		case "none":
			this._jointStyle = "round";
			break;
		case "miter":
			this._jointStyle = "miter";
			break;
		case "bevel":
			this._jointStyle = "bevel";
			break;
		default:
			return;
		}
	}
	,getLineWidth: function() {
		return this._lineWidth;
	}
	,setLineWidth: function(width) {
		this._lineWidth = width;
	}
	,getBackgroundColor: function() {
		return love2d.Love.handler.bgColor;
	}
	,setBackgroundColor: function(red,green,blue,alpha) {
		if(alpha == null) alpha = 255;
		if(blue == null) blue = 255;
		if(green == null) green = 255;
		if(red == null) red = 255;
		red = red < 0?0:red > 255?255:red;
		green = green < 0?0:green > 255?255:green;
		blue = blue < 0?0:blue > 255?255:blue;
		alpha = alpha < 0?0:alpha > 255?255:alpha;
		love2d.Love.handler.bgColor = { r : red, g : green, b : blue, a : alpha};
	}
	,getColor: function() {
		return love2d.Love.handler.color;
	}
	,setColor: function(red,green,blue,alpha) {
		if(alpha == null) alpha = 255;
		if(blue == null) blue = 255;
		if(green == null) green = 255;
		if(red == null) red = 255;
		red = red < 0?0:red > 255?255:red;
		green = green < 0?0:green > 255?255:green;
		blue = blue < 0?0:blue > 255?255:blue;
		alpha = alpha < 0?0:alpha > 255?255:alpha;
		love2d.Love.handler.color = { r : red, g : green, b : blue, a : alpha};
		this._colorTransform.redMultiplier = red / 255;
		this._colorTransform.greenMultiplier = green / 255;
		this._colorTransform.blueMultiplier = blue / 255;
		this._colorTransform.alphaMultiplier = alpha / 255;
	}
	,reset: function() {
		this.setColor(null,null,null,null);
		this.setBackgroundColor(0,0,0,255);
		this.setBlendMode("alpha");
		this._pointSize = this._lineWidth = 1;
	}
	,clear: function() {
		this.gr.clear();
		var c = love2d.Love.handler.canvas;
		c.fillRect(c.rect,-16777216 | love2d.Love.handler.get_intBgColor());
	}
	,pop: function() {
	}
	,push: function() {
	}
	,shear: function(kx,ky) {
		this._kx = kx;
		this._ky = ky;
	}
	,scale: function(sx,sy) {
		this._scaleX = sx;
		this._scaleY = sy;
	}
	,rotate: function(angle) {
		this._angle = angle;
	}
	,translate: function(dx,dy) {
		this._dx = dx;
		this._dy = dy;
	}
	,origin: function() {
		this._angle = 0;
		this._scaleX = 1;
		this._scaleY = 1;
		this._kx = 0;
		this._ky = 0;
		this._dx = 0;
		this._dy = 0;
	}
	,__class__: love2d.utils.LoveGraphics
}
love2d.utils.LoveImage = function() {
};
$hxClasses["love2d.utils.LoveImage"] = love2d.utils.LoveImage;
love2d.utils.LoveImage.__name__ = ["love2d","utils","LoveImage"];
love2d.utils.LoveImage.prototype = {
	newImageData: function(width,height) {
		return new love2d.utils.ImageData(width,height);
	}
	,__class__: love2d.utils.LoveImage
}
love2d.utils.LoveJoystick = function() {
	love2d.utils.LoveJoystick._buttonsString = new haxe.ds.StringMap();
	love2d.utils.LoveJoystick._buttonsInt = new haxe.ds.IntMap();
};
$hxClasses["love2d.utils.LoveJoystick"] = love2d.utils.LoveJoystick;
love2d.utils.LoveJoystick.__name__ = ["love2d","utils","LoveJoystick"];
love2d.utils.LoveJoystick.setMap = function(button,id) {
	love2d.utils.LoveJoystick._buttonsString.set(button,id);
	love2d.utils.LoveJoystick._buttonsInt.set(id,button);
}
love2d.utils.LoveJoystick.toString = function(button) {
	return "";
}
love2d.utils.LoveJoystick.toInt = function(button) {
	return 0;
}
love2d.utils.LoveJoystick.prototype = {
	setGamepadMapping: function(guid,button,inputtype,inputindex,hatdir) {
		return false;
	}
	,getJoystickCount: function() {
		return love2d.Love.handler.realJoysticks.length;
	}
	,getJoysticks: function() {
		return love2d.Love.handler.realJoysticks;
	}
	,__class__: love2d.utils.LoveJoystick
}
love2d.utils.OUYA = function() { }
$hxClasses["love2d.utils.OUYA"] = love2d.utils.OUYA;
love2d.utils.OUYA.__name__ = ["love2d","utils","OUYA"];
love2d.utils.LoveKeyboard = function() {
	this._textInput = false;
	love2d.utils.LoveKeyboard._keyChar = new haxe.ds.StringMap();
	love2d.utils.LoveKeyboard._keyInt = new haxe.ds.IntMap();
	love2d.utils.LoveKeyboard._setMap(8,"backspace");
	love2d.utils.LoveKeyboard._setMap(9,"tab");
	love2d.utils.LoveKeyboard._setMap(45,"insert");
	love2d.utils.LoveKeyboard._setMap(13,"return");
	love2d.utils.LoveKeyboard._setMap(46,"delete");
	love2d.utils.LoveKeyboard._setMap(144,"numlock");
	love2d.utils.LoveKeyboard._setMap(20,"capslock");
	love2d.utils.LoveKeyboard._setMap(145,"scrolllock");
	love2d.utils.LoveKeyboard._setMap(16,"lshift");
	love2d.utils.LoveKeyboard._setMap(17,"lctrl");
	love2d.utils.LoveKeyboard._setMap(18,"lalt");
	love2d.utils.LoveKeyboard._setMap(91,"lgui");
	love2d.utils.LoveKeyboard._setMap(92,"rgui");
	love2d.utils.LoveKeyboard._setMap(19,"pause");
	love2d.utils.LoveKeyboard._setMap(27,"escape");
	love2d.utils.LoveKeyboard._setMap(37,"left");
	love2d.utils.LoveKeyboard._setMap(39,"right");
	love2d.utils.LoveKeyboard._setMap(38,"up");
	love2d.utils.LoveKeyboard._setMap(40,"down");
	love2d.utils.LoveKeyboard._setMap(36,"home");
	love2d.utils.LoveKeyboard._setMap(35,"end");
	love2d.utils.LoveKeyboard._setMap(33,"pageup");
	love2d.utils.LoveKeyboard._setMap(34,"pagedown");
	love2d.utils.LoveKeyboard._setMap(48,"0");
	love2d.utils.LoveKeyboard._setMap(49,"1");
	love2d.utils.LoveKeyboard._setMap(50,"2");
	love2d.utils.LoveKeyboard._setMap(51,"3");
	love2d.utils.LoveKeyboard._setMap(52,"4");
	love2d.utils.LoveKeyboard._setMap(53,"5");
	love2d.utils.LoveKeyboard._setMap(54,"6");
	love2d.utils.LoveKeyboard._setMap(55,"7");
	love2d.utils.LoveKeyboard._setMap(56,"8");
	love2d.utils.LoveKeyboard._setMap(57,"9");
	love2d.utils.LoveKeyboard._setMap(96,"kp0");
	love2d.utils.LoveKeyboard._setMap(97,"kp1");
	love2d.utils.LoveKeyboard._setMap(98,"kp2");
	love2d.utils.LoveKeyboard._setMap(99,"kp3");
	love2d.utils.LoveKeyboard._setMap(100,"kp4");
	love2d.utils.LoveKeyboard._setMap(101,"kp5");
	love2d.utils.LoveKeyboard._setMap(102,"kp6");
	love2d.utils.LoveKeyboard._setMap(103,"kp7");
	love2d.utils.LoveKeyboard._setMap(104,"kp8");
	love2d.utils.LoveKeyboard._setMap(105,"kp9");
	love2d.utils.LoveKeyboard._setMap(110,"kp.");
	love2d.utils.LoveKeyboard._setMap(188,"kp,");
	love2d.utils.LoveKeyboard._setMap(111,"kp/");
	love2d.utils.LoveKeyboard._setMap(106,"kp*");
	love2d.utils.LoveKeyboard._setMap(107,"kp+");
	love2d.utils.LoveKeyboard._setMap(109,"kp-");
	love2d.utils.LoveKeyboard._setMap(65,"a");
	love2d.utils.LoveKeyboard._setMap(66,"b");
	love2d.utils.LoveKeyboard._setMap(67,"c");
	love2d.utils.LoveKeyboard._setMap(68,"d");
	love2d.utils.LoveKeyboard._setMap(69,"e");
	love2d.utils.LoveKeyboard._setMap(70,"f");
	love2d.utils.LoveKeyboard._setMap(71,"g");
	love2d.utils.LoveKeyboard._setMap(72,"h");
	love2d.utils.LoveKeyboard._setMap(73,"i");
	love2d.utils.LoveKeyboard._setMap(74,"j");
	love2d.utils.LoveKeyboard._setMap(75,"k");
	love2d.utils.LoveKeyboard._setMap(76,"l");
	love2d.utils.LoveKeyboard._setMap(77,"m");
	love2d.utils.LoveKeyboard._setMap(78,"n");
	love2d.utils.LoveKeyboard._setMap(79,"o");
	love2d.utils.LoveKeyboard._setMap(80,"p");
	love2d.utils.LoveKeyboard._setMap(81,"q");
	love2d.utils.LoveKeyboard._setMap(82,"r");
	love2d.utils.LoveKeyboard._setMap(83,"s");
	love2d.utils.LoveKeyboard._setMap(84,"t");
	love2d.utils.LoveKeyboard._setMap(85,"u");
	love2d.utils.LoveKeyboard._setMap(86,"v");
	love2d.utils.LoveKeyboard._setMap(87,"w");
	love2d.utils.LoveKeyboard._setMap(88,"x");
	love2d.utils.LoveKeyboard._setMap(89,"y");
	love2d.utils.LoveKeyboard._setMap(90,"z");
	love2d.utils.LoveKeyboard._setMap(187,"=");
	love2d.utils.LoveKeyboard._setMap(192,"`");
	love2d.utils.LoveKeyboard._setMap(191,"/");
	love2d.utils.LoveKeyboard._setMap(220,"\\");
	love2d.utils.LoveKeyboard._setMap(219,"[");
	love2d.utils.LoveKeyboard._setMap(221,"]");
	love2d.utils.LoveKeyboard._setMap(186,";");
	love2d.utils.LoveKeyboard._setMap(222,"'");
	love2d.utils.LoveKeyboard._setMap(112,"f1");
	love2d.utils.LoveKeyboard._setMap(113,"f2");
	love2d.utils.LoveKeyboard._setMap(114,"f3");
	love2d.utils.LoveKeyboard._setMap(115,"f4");
	love2d.utils.LoveKeyboard._setMap(116,"f5");
	love2d.utils.LoveKeyboard._setMap(117,"f6");
	love2d.utils.LoveKeyboard._setMap(118,"f7");
	love2d.utils.LoveKeyboard._setMap(119,"f8");
	love2d.utils.LoveKeyboard._setMap(120,"f9");
	love2d.utils.LoveKeyboard._setMap(121,"f10");
	love2d.utils.LoveKeyboard._setMap(122,"f11");
	love2d.utils.LoveKeyboard._setMap(123,"f12");
	love2d.utils.LoveKeyboard._setMap(32," ");
};
$hxClasses["love2d.utils.LoveKeyboard"] = love2d.utils.LoveKeyboard;
love2d.utils.LoveKeyboard.__name__ = ["love2d","utils","LoveKeyboard"];
love2d.utils.LoveKeyboard._setMap = function(id,key) {
	love2d.utils.LoveKeyboard._keyChar.set(key,id);
	love2d.utils.LoveKeyboard._keyInt.set(id,key);
}
love2d.utils.LoveKeyboard.toChar = function(n) {
	if(love2d.utils.LoveKeyboard._keyInt.exists(n)) return love2d.utils.LoveKeyboard._keyInt.get(n); else return "unknown";
}
love2d.utils.LoveKeyboard.toInt = function(n) {
	if(love2d.utils.LoveKeyboard._keyChar.exists(n)) return love2d.utils.LoveKeyboard._keyChar.get(n); else return -1;
}
love2d.utils.LoveKeyboard.prototype = {
	hasKeyRepeat: function() {
		return false;
	}
	,setKeyRepeat: function(enable) {
	}
	,setTextInput: function(enable) {
		if(enable == null) enable = true;
		this._textInput = enable;
	}
	,hasTextInput: function() {
		return this._textInput;
	}
	,isDown: function(key) {
		if(js.Boot.__instanceof(key,Int)) return love2d.Love.handler.keys[key]; else if(js.Boot.__instanceof(key,String)) return love2d.Love.handler.keys[love2d.utils.LoveKeyboard.toInt(key)];
		return false;
	}
	,__class__: love2d.utils.LoveKeyboard
}
love2d.utils.LoveMath = function() {
	this._seed = Math.round(Math.random() * 2147483646);
	this.rng = this.newRandomGenerator();
};
$hxClasses["love2d.utils.LoveMath"] = love2d.utils.LoveMath;
love2d.utils.LoveMath.__name__ = ["love2d","utils","LoveMath"];
love2d.utils.LoveMath.prototype = {
	newBezierCurve: function(vertices) {
		return new love2d.utils.BezierCurve(vertices);
	}
	,newRandomGenerator: function(state) {
		return new love2d.utils.RandomGenerator(state);
	}
	,triangulate: function(polygon) {
		return null;
	}
	,isConvex: function(vertices) {
		var i, j, k, z;
		var flag = 0;
		var n = vertices.length;
		var _g = 0;
		while(_g < n) {
			var i1 = _g++;
			j = (i1 + 1) % n;
			k = (i1 + 2) % n;
			z = (vertices[j].x - vertices[i1].x) * (vertices[k].y - vertices[j].y);
			z -= (vertices[j].y - vertices[i1].y) * (vertices[k].x - vertices[j].x);
			if(z < 0) flag |= 1; else if(z > 0) flag |= 2;
			if(flag == 3) return false;
		}
		if(flag != 0) return true;
		return false;
	}
	,getRandomSeed: function() {
		return this.rng._seed;
	}
	,setRandomSeed: function(seed) {
		if(seed >= 1 && seed <= 2147483646) this.rng._seed = seed; else {
			if(love2d.Love.errhand != null) love2d.Love.errhand("The seed number must be within the range of [1, 2147483646].");
			if(console) console.log("The seed number must be within the range of [1, 2147483646].");
		}
	}
	,noise: function(x,y,z,w) {
		return 0;
	}
	,randomNormal: function(stddev,mean) {
		if(mean == null) mean = 0;
		if(stddev == null) stddev = 1;
		return this.rng.randomNormal(stddev,mean);
	}
	,random: function(min,max) {
		return this.rng.random(min,max);
	}
	,__class__: love2d.utils.LoveMath
}
love2d.utils.LoveMouse = function() {
};
$hxClasses["love2d.utils.LoveMouse"] = love2d.utils.LoveMouse;
love2d.utils.LoveMouse.__name__ = ["love2d","utils","LoveMouse"];
love2d.utils.LoveMouse.prototype = {
	newCursor: function(data,hotx,hoty) {
		if(hotx == null) hotx = 0;
		return new love2d.utils.Cursor(data,hotx,hoty);
	}
	,getSystemCursor: function(ctype) {
		return null;
	}
	,getCursor: function() {
		return love2d.Love.handler.cursor;
	}
	,setCursor: function(cursor) {
		love2d.Love.handler.cursor = cursor;
	}
	,isVisible: function() {
		return this._visible;
	}
	,setVisible: function(visible) {
		if(visible) {
			flash.ui.Mouse.show();
			this._visible = true;
		} else {
			flash.ui.Mouse.hide();
			this._visible = false;
		}
	}
	,isDown: function(button) {
		switch(button) {
		case "l":
			return love2d.Love.handler.mouseLeftPressed;
		case "r":
			return love2d.Love.handler.mouseRightPressed;
		case "m":
			return love2d.Love.handler.mouseMiddlePressed;
		case "wu":
			return love2d.Love.handler.sign(love2d.Love.handler.mouseWheel) == 1;
		case "wd":
			return love2d.Love.handler.sign(love2d.Love.handler.mouseWheel) == -1;
		default:
			return false;
		}
	}
	,isGrabbed: function() {
		return false;
	}
	,setGrabbed: function(grab) {
	}
	,setPosition: function(x,y) {
	}
	,setY: function(y) {
	}
	,setX: function(x) {
	}
	,getPosition: function() {
		return { x : love2d.Love.handler.get_stage().get_mouseX(), y : love2d.Love.handler.get_stage().get_mouseY()};
	}
	,getY: function() {
		return love2d.Love.handler.get_stage().get_mouseY();
	}
	,getX: function() {
		return love2d.Love.handler.get_stage().get_mouseX();
	}
	,__class__: love2d.utils.LoveMouse
}
love2d.utils.LovePhysics = function() {
};
$hxClasses["love2d.utils.LovePhysics"] = love2d.utils.LovePhysics;
love2d.utils.LovePhysics.__name__ = ["love2d","utils","LovePhysics"];
love2d.utils.LovePhysics.prototype = {
	__class__: love2d.utils.LovePhysics
}
love2d.utils.LoveSound = function() {
};
$hxClasses["love2d.utils.LoveSound"] = love2d.utils.LoveSound;
love2d.utils.LoveSound.__name__ = ["love2d","utils","LoveSound"];
love2d.utils.LoveSound.prototype = {
	__class__: love2d.utils.LoveSound
}
love2d.utils.LoveSystem = function() {
};
$hxClasses["love2d.utils.LoveSystem"] = love2d.utils.LoveSystem;
love2d.utils.LoveSystem.__name__ = ["love2d","utils","LoveSystem"];
love2d.utils.LoveSystem.prototype = {
	getOS: function() {
		return "HTML5";
	}
	,getClipboardText: function() {
		return "";
	}
	,setClipboardText: function(text) {
	}
	,isAccelerometerSupported: function() {
		return false;
	}
	,__class__: love2d.utils.LoveSystem
}
love2d.utils.LoveThread = function() {
};
$hxClasses["love2d.utils.LoveThread"] = love2d.utils.LoveThread;
love2d.utils.LoveThread.__name__ = ["love2d","utils","LoveThread"];
love2d.utils.LoveThread.prototype = {
	__class__: love2d.utils.LoveThread
}
love2d.utils.LoveTimer = function() {
	this.fps = new openfl.display.FPS();
};
$hxClasses["love2d.utils.LoveTimer"] = love2d.utils.LoveTimer;
love2d.utils.LoveTimer.__name__ = ["love2d","utils","LoveTimer"];
love2d.utils.LoveTimer.prototype = {
	sleep: function(ms) {
	}
	,step: function() {
	}
	,getTime: function() {
		return flash.Lib.getTimer();
	}
	,getAverageDelta: function() {
		return love2d.Love.handler.dt;
	}
	,getDelta: function() {
		return love2d.Love.handler.dt;
	}
	,getFPS: function() {
		return 0;
	}
	,__class__: love2d.utils.LoveTimer
}
love2d.utils.LoveTouch = function() {
	this._list = (function($this) {
		var $r;
		var _g = [];
		{
			var _g1 = 0;
			while(_g1 < 10) {
				var i = _g1++;
				_g.push(new love2d.utils.Touch(i));
			}
		}
		$r = _g;
		return $r;
	}(this));
	this._count = 0;
};
$hxClasses["love2d.utils.LoveTouch"] = love2d.utils.LoveTouch;
love2d.utils.LoveTouch.__name__ = ["love2d","utils","LoveTouch"];
love2d.utils.LoveTouch.prototype = {
	getPointsCount: function() {
		return this._count;
	}
	,getList: function() {
		return this._list;
	}
	,__class__: love2d.utils.LoveTouch
}
love2d.utils.LoveWindow = function() {
	this._flags = { fullscreen : false, vsync : true, fsaa : 0, resizable : false, borderless : false, centered : true};
};
$hxClasses["love2d.utils.LoveWindow"] = love2d.utils.LoveWindow;
love2d.utils.LoveWindow.__name__ = ["love2d","utils","LoveWindow"];
love2d.utils.LoveWindow.prototype = {
	hasMouseFocus: function() {
		return true;
	}
	,getIcon: function() {
		return null;
	}
	,hasFocus: function() {
		return love2d.Love.handler.hasFocus;
	}
	,isVisible: function() {
		return love2d.Love.handler.hasFocus;
	}
	,getFullscreenModes: function() {
		return null;
	}
	,setIcon: function(imagedata) {
		return false;
	}
	,getMode: function(callBack) {
		callBack(love2d.Love.handler.get_stage().get_stageWidth(),love2d.Love.handler.get_stage().get_stageHeight(),this._flags);
	}
	,setMode: function(width,height,flags) {
		width = width <= 0?love2d.Love.handler.get_stage().get_stageWidth():width;
		height = height <= 0?love2d.Love.handler.get_stage().get_stageHeight():height;
		return false;
	}
	,getTitle: function() {
		return js.Browser.document.title;
	}
	,setTitle: function(title) {
		js.Browser.document.title = title;
	}
	,getFullscreen: function() {
		return { fullscreen : love2d.Love.handler.get_stage().displayState == flash.display.StageDisplayState.FULL_SCREEN?true:false, fstype : "normal"};
	}
	,setFullscreen: function(fullscreen) {
		love2d.Love.handler.get_stage().displayState = !fullscreen?flash.display.StageDisplayState.NORMAL:flash.display.StageDisplayState.FULL_SCREEN;
		love2d.Love.handler.canvas = new flash.display.BitmapData(love2d.Love.handler.get_stage().get_stageWidth(),love2d.Love.handler.get_stage().get_stageHeight());
		love2d.Love.handler.bitmap.set_bitmapData(love2d.Love.handler.canvas);
		return true;
	}
	,isCreated: function() {
		return true;
	}
	,getDesktopDimensions: function(display) {
		if(display == null) display = 1;
		return { width : js.Browser.window.screen.width, height : js.Browser.window.screen.height};
	}
	,getDimensions: function() {
		return { width : love2d.Love.handler.get_stage().get_stageWidth(), height : love2d.Love.handler.get_stage().get_stageHeight()};
	}
	,getHeight: function() {
		return love2d.Love.handler.get_stage().get_stageHeight();
	}
	,getWidth: function() {
		return love2d.Love.handler.get_stage().get_stageWidth();
	}
	,__class__: love2d.utils.LoveWindow
}
love2d.utils.Quad = function(x,y,width,height,sx,sy) {
	if(sy == null) sy = -1;
	if(sx == null) sx = -1;
	if(height == null) height = 1;
	if(width == null) width = 1;
	if(y == null) y = 0;
	if(x == null) x = 0;
	love2d.utils.Object.call(this);
	this._x = x;
	this._y = y;
	this._width = width;
	this._height = height;
	if(sx != -1) this._sx = sx < 1?1:sx; else sx = this._width;
	if(sy != -1) this._sy = sy < 1?1:sy; else sy = this._height;
};
$hxClasses["love2d.utils.Quad"] = love2d.utils.Quad;
love2d.utils.Quad.__name__ = ["love2d","utils","Quad"];
love2d.utils.Quad.__super__ = love2d.utils.Object;
love2d.utils.Quad.prototype = $extend(love2d.utils.Object.prototype,{
	getViewport: function() {
		return { x : this._x, y : this._y, width : this._width, height : this._height};
	}
	,setViewport: function(x,y,width,height) {
		if(height == null) height = 1;
		if(width == null) width = 1;
		if(y == null) y = 0;
		if(x == null) x = 0;
		this._x = x;
		this._y = y;
		this._width = width;
		this._height = height;
	}
	,__class__: love2d.utils.Quad
});
love2d.utils.RandomGenerator = function(state) {
	love2d.utils.Object.call(this);
	if(state == null) state = Math.round(Math.random() * 2147483646);
	this._seed = state;
};
$hxClasses["love2d.utils.RandomGenerator"] = love2d.utils.RandomGenerator;
love2d.utils.RandomGenerator.__name__ = ["love2d","utils","RandomGenerator"];
love2d.utils.RandomGenerator.__super__ = love2d.utils.Object;
love2d.utils.RandomGenerator.prototype = $extend(love2d.utils.Object.prototype,{
	getSeed: function() {
		return this._seed;
	}
	,setSeed: function(seed) {
		if(seed >= 1 && seed <= 2147483646) this._seed = seed; else {
			if(love2d.Love.errhand != null) love2d.Love.errhand("The seed number must be within the range of [1, 2147483646].");
			if(console) console.log("The seed number must be within the range of [1, 2147483646].");
		}
	}
	,randomNormal: function(stddev,mean) {
		if(mean == null) mean = 0;
		if(stddev == null) stddev = 1;
		return -1;
	}
	,random: function(min,max) {
		if(min == null && max == null) {
			min = 0;
			max = 1;
		}
		if(min != null && max == null) {
			var _min = min;
			min = 0;
			max = _min;
		}
		if(min > max) {
			var _min = min;
			min = max;
			max = _min;
		}
		this._seed = this._seed * 16807.0 % 2147483646 | 0;
		return min + this._seed / 2147483646 * Math.abs(max - min);
	}
	,__class__: love2d.utils.RandomGenerator
});
love2d.utils.Source = function(data,sourceType) {
	if(sourceType == null) sourceType = "stream";
	this._looping = false;
	this._stopped = false;
	this._playing = false;
	this._paused = false;
	this._position = 0;
	this._volumeMax = 1;
	this._volumeMin = 0;
	love2d.utils.Object.call(this);
	if(js.Boot.__instanceof(data,String)) this._sound = openfl.Assets.getSound(data);
	this._type = sourceType;
	love2d.Love.audio._sources.push(this);
	this.setVolume(love2d.Love.audio._volume);
};
$hxClasses["love2d.utils.Source"] = love2d.utils.Source;
love2d.utils.Source.__name__ = ["love2d","utils","Source"];
love2d.utils.Source.__super__ = love2d.utils.Object;
love2d.utils.Source.prototype = $extend(love2d.utils.Object.prototype,{
	getVolume: function() {
		return this._channel.soundTransform.volume;
	}
	,setVolume: function(volume) {
		if(volume == null) volume = love2d.Love.audio._volume;
		volume = volume < this._volumeMin?this._volumeMin:volume;
		volume = volume > this._volumeMax?this._volumeMax:volume;
		this._channel.soundTransform.volume = volume;
	}
	,getVolumeLimits: function() {
		return { min : this._volumeMin, max : this._volumeMax};
	}
	,setVolumeLimits: function(min,max) {
		if(max == null) max = 0;
		if(min == null) min = 0;
		min = min < 0?0:min;
		min = min > 1?1:min;
		max = max < 0?0:max;
		max = max > 1?1:max;
		max = max < min?min:max;
		this._volumeMin = min;
		this._volumeMax = max;
	}
	,isStatic: function() {
		return this._type == "static";
	}
	,isLooping: function() {
		return this._looping;
	}
	,isStopped: function() {
		return this._stopped;
	}
	,isPaused: function() {
		return this._paused;
	}
	,isPlaying: function() {
		return this._playing;
	}
	,tell: function(unit) {
		if(unit == null) unit = "seconds";
		if(unit == "seconds") return this._position / 1000 | 0;
		return 0;
	}
	,seek: function(offset,unit) {
		if(unit == null) unit = "seconds";
		if(unit == "seconds") this._position = offset;
	}
	,setLooping: function(looping) {
		this._looping = true;
	}
	,resume: function() {
		if(this._paused) {
			this._channel = this._sound.play(this._position,this._looping?10000:0);
			this.setVolume(this._channel.soundTransform.volume);
			this._playing = true;
			this._paused = false;
			this._stopped = false;
		}
	}
	,pause: function() {
		this._position = this._channel.component.currentTime * 1000;
		this._channel.stop();
		this._paused = true;
		this._playing = false;
		this._stopped = false;
	}
	,stop: function() {
		this._channel.stop();
		this._stopped = true;
		this._playing = false;
		this._paused = false;
	}
	,play: function() {
		this._channel = this._sound.play(0,this._looping?10000:0);
		this.setVolume(this._channel.soundTransform.volume);
		this._playing = true;
		this._paused = false;
		this._stopped = false;
	}
	,__class__: love2d.utils.Source
});
love2d.utils.SpriteBatch = function(image,size,usageHint) {
	if(usageHint == null) usageHint = "dynamic";
	if(size == null) size = 1000;
	this._numQuads = 0;
	love2d.utils.Drawable.call(this);
	this._image = image;
	this._tilesheet = love2d.utils.TilesheetCache.get(image);
	this._size = size;
	this._usageHint = usageHint;
	this._color = { r : 1, g : 1, b : 1, a : 1};
	this._imageQuad = new love2d.utils.Quad(0,0,image._bitmapData.component.width,image._bitmapData.component.height);
	this._renderItems = [];
};
$hxClasses["love2d.utils.SpriteBatch"] = love2d.utils.SpriteBatch;
love2d.utils.SpriteBatch.__name__ = ["love2d","utils","SpriteBatch"];
love2d.utils.SpriteBatch.getRenderItem = function() {
	return love2d.utils.SpriteBatch.RenderItemPool.length > 0?love2d.utils.SpriteBatch.RenderItemPool.pop():new love2d.utils.RenderItem();
}
love2d.utils.SpriteBatch.__super__ = love2d.utils.Drawable;
love2d.utils.SpriteBatch.prototype = $extend(love2d.utils.Drawable.prototype,{
	unbind: function() {
	}
	,bind: function() {
	}
	,numQuads: function() {
		var l = this._renderItems.length;
		var renderItem = null;
		var totalItems = 0;
		var _g = 0;
		while(_g < l) {
			var i = _g++;
			renderItem = this._renderItems[i];
			totalItems += renderItem.numQuads;
		}
		return totalItems;
	}
	,getTilesheet: function() {
		if(this._tilesheet == null) this._tilesheet = love2d.utils.TilesheetCache.get(this._image);
		return this._tilesheet;
	}
	,getCount: function() {
		return this._numQuads;
	}
	,getImage: function() {
		return this._image;
	}
	,setImage: function(image) {
		this._image = image;
		this._tilesheet = love2d.utils.TilesheetCache.get(image);
	}
	,getBufferSize: function() {
		return this._size;
	}
	,draw: function(x,y,r,sx,sy,ox,oy,quad) {
		var flags;
		var item;
		var l = this._renderItems.length;
		var _g = 0;
		while(_g < l) {
			var i = _g++;
			item = this._renderItems[i];
			flags = 16;
			if(item.isColored) flags |= 4; else if(item.isAlpha) flags != 8;
			item.tilesheet.drawTiles(love2d.Love.graphics.gr,item.renderList,false,flags);
		}
	}
	,setBufferSize: function(size) {
		if(this._numQuads < size) {
			var prevNum = 0;
			var totalNum = 0;
			var item;
			var itemSize = 0;
			var l = this._renderItems.length;
			var _g = 0;
			while(_g < l) {
				var i = _g++;
				item = this._renderItems[i];
				prevNum = totalNum;
				itemSize = item.numQuads;
				totalNum += itemSize;
				if(totalNum > size) {
					var start = (size - prevNum) * item.numElementsPerQuad;
					item.renderList.splice(start,item.renderList.length - start);
					item.numQuads = size - prevNum;
					var _g1 = i + 1;
					while(_g1 < l) {
						var j = _g1++;
						item = this._renderItems.pop();
						item.clear();
						love2d.utils.SpriteBatch.RenderItemPool.push(item);
					}
					break;
				}
			}
		}
		this._size = size;
	}
	,set: function(id,x,y,r,sx,sy,ox,oy,kx,ky,quad) {
		if(ky == null) ky = 0;
		if(kx == null) kx = 0;
		if(oy == null) oy = 0;
		if(ox == null) ox = 0;
		if(sy == null) sy = 1;
		if(sx == null) sx = 1;
		if(r == null) r = 0;
		if(id < this._numQuads && id >= 0) {
			if(quad == null) quad = this._imageQuad;
			var csx = 1;
			var ssy = 0;
			var ssx = 0;
			var csy = 1;
			var x1 = (ox - quad._halfWidth) * sx;
			var y1 = (oy - quad._halfHeight) * sy;
			var sin = Math.sin(r);
			var cos = Math.cos(r);
			csx = cos * sx;
			ssy = sin * sy;
			ssx = sin * sx;
			csy = cos * sy;
			var x2 = x1 * cos + y1 * sin;
			var y2 = -x1 * sin + y1 * cos;
			var a = csx;
			var b = ssx;
			var c = ssy;
			var d = csy;
			var colored = this._color.r != 1 || this._color.g != 1 || this._color.b != 1;
			var alpha = this._color.a != 1;
			var l = this._renderItems.length;
			var renderItem = null;
			var totalItems = 0;
			var prevNumber = 0;
			var renderItemID = -1;
			var _g = 0;
			while(_g < l) {
				var i = _g++;
				renderItem = this._renderItems[i];
				var numQuadsInItem = renderItem.numQuads;
				prevNumber = totalItems;
				totalItems += numQuadsInItem;
				if(totalItems > id) {
					renderItemID = id - prevNumber;
					break;
				}
			}
			if(renderItemID == -1) return;
			var list = renderItem.renderList;
			var currIndex = renderItemID * renderItem.numElementsPerQuad;
			list[currIndex++] = x - x2;
			list[currIndex++] = y - y2;
			list[currIndex++] = this._tilesheet.addTileRectID(quad);
			list[currIndex++] = a;
			list[currIndex++] = -b;
			list[currIndex++] = c;
			list[currIndex++] = d;
			if(renderItem.isColored) {
				list[currIndex++] = this._color.r;
				list[currIndex++] = this._color.g;
				list[currIndex++] = this._color.b;
			}
			if(renderItem.isAlpha) list[currIndex++] = this._color.a;
		}
	}
	,add: function(x,y,r,sx,sy,ox,oy,kx,ky,quad) {
		if(ky == null) ky = 0;
		if(kx == null) kx = 0;
		if(oy == null) oy = 0;
		if(ox == null) ox = 0;
		if(sy == null) sy = 1;
		if(sx == null) sx = 1;
		if(r == null) r = 0;
		if(this._numQuads >= this._size) return;
		if(quad == null) quad = this._imageQuad;
		var colored = this._color.r != 1 || this._color.g != 1 || this._color.b != 1;
		var alpha = this._color.a != 1;
		if(this._currentRenderItem == null || (this._currentRenderItem.isAlpha != alpha || this._currentRenderItem.isColored != colored || this._currentRenderItem.tilesheet != this._tilesheet)) {
			this._currentRenderItem = love2d.utils.SpriteBatch.RenderItemPool.length > 0?love2d.utils.SpriteBatch.RenderItemPool.pop():new love2d.utils.RenderItem();
			this._currentRenderItem.isColored = colored;
			this._currentRenderItem.isAlpha = alpha;
			if(colored && alpha) this._currentRenderItem.numElementsPerQuad = love2d.utils.RenderItem.NUM_ELEMENTS_RGB_ALPHA; else if(colored && !alpha) this._currentRenderItem.numElementsPerQuad = love2d.utils.RenderItem.NUM_ELEMENTS_RGB; else if(!colored && alpha) this._currentRenderItem.numElementsPerQuad = love2d.utils.RenderItem.NUM_ELEMENTS_ALPHA; else this._currentRenderItem.numElementsPerQuad = love2d.utils.RenderItem.NUM_ELEMENTS_NO_RGB_ALPHA;
			this._currentRenderItem.tilesheet = this._tilesheet;
			this._renderItems.push(this._currentRenderItem);
		}
		var csx = 1;
		var ssy = 0;
		var ssx = 0;
		var csy = 1;
		var sin = 0;
		var cos = 1;
		var x1 = (ox - quad._halfWidth) * sx;
		var y1 = (oy - quad._halfHeight) * sy;
		var x2 = x1;
		var y2 = y1;
		if(r != 0) {
			sin = Math.sin(r);
			cos = Math.cos(r);
			csx = cos * sx;
			ssy = sin * sy;
			ssx = sin * sx;
			csy = cos * sy;
			x2 = x1 * cos + y1 * sin;
			y2 = -x1 * sin + y1 * cos;
		}
		var a = csx;
		var b = ssx;
		var c = ssy;
		var d = csy;
		var list = this._currentRenderItem.renderList;
		var currIndex = list.length;
		list[currIndex++] = x - x2;
		list[currIndex++] = y - y2;
		list[currIndex++] = this._tilesheet.addTileRectID(quad);
		list[currIndex++] = a;
		list[currIndex++] = -b;
		list[currIndex++] = c;
		list[currIndex++] = d;
		if(this._currentRenderItem.isColored) {
			list[currIndex++] = this._color.r;
			list[currIndex++] = this._color.g;
			list[currIndex++] = this._color.b;
		}
		if(this._currentRenderItem.isAlpha) list[currIndex++] = this._color.a;
		this._currentRenderItem.numQuads++;
		this._numQuads++;
	}
	,isAlpha: function() {
		return this._color.a != 1;
	}
	,isColored: function() {
		return this._color.r != 1 || this._color.g != 1 || this._color.b != 1;
	}
	,clear: function() {
		this._numQuads = 0;
		var l = this._renderItems.length;
		var item;
		var _g = 0;
		while(_g < l) {
			var i = _g++;
			item = this._renderItems.pop();
			item.clear();
			love2d.utils.SpriteBatch.RenderItemPool.push(item);
		}
	}
	,getColor: function() {
		return { r : Math.round(this._color.r * 255), g : Math.round(this._color.g * 255), b : Math.round(this._color.b * 255), a : Math.round(this._color.a * 255)};
	}
	,setColor: function(r,g,b,a) {
		if(a == null) a = 255;
		this._color = { r : r / 255, g : g / 255, b : b / 255, a : a / 255};
	}
	,__class__: love2d.utils.SpriteBatch
});
love2d.utils.TilesheetCache = function() { }
$hxClasses["love2d.utils.TilesheetCache"] = love2d.utils.TilesheetCache;
love2d.utils.TilesheetCache.__name__ = ["love2d","utils","TilesheetCache"];
love2d.utils.TilesheetCache.get = function(image) {
	if(love2d.utils.TilesheetCache.cache.h.hasOwnProperty(image.__id__)) return love2d.utils.TilesheetCache.cache.h[image.__id__];
	var tilesheet = new love2d.utils.TilesheetExt(image._bitmapData);
	love2d.utils.TilesheetCache.cache.set(image,tilesheet);
	return tilesheet;
}
var openfl = {}
openfl.display = {}
openfl.display.Tilesheet = function(image) {
	this.nmeBitmap = image;
	this.qOffsets = new Array();
	this.qRects = new Array();
	this.bounds = new flash.geom.Rectangle();
	this.tile = new flash.geom.Rectangle();
	this.matrix = new flash.geom.Matrix();
};
$hxClasses["openfl.display.Tilesheet"] = openfl.display.Tilesheet;
openfl.display.Tilesheet.__name__ = ["openfl","display","Tilesheet"];
openfl.display.Tilesheet.prototype = {
	drawTiles: function(gfx,d,smooth,f) {
		if(f == null) f = 0;
		if(smooth == null) smooth = false;
		var r = gfx.rec, p = gfx.len, lenOfs, i = 0, c = d.length, j, z = 0, t, o, q, v, b = this.bounds, u = this.tile, m = this.matrix, tx, ty, ox, oy, qx, qy, qw, qh, fs = (f & 1) != 0, fr = (f & 2) != 0, fm = (f & 16) != 0, ft = fs || fr || fm, rl = 2147483647, rt = 2147483647, rr = -2147483648, rb = -2147483648;
		r[p++] = 16;
		r[p++] = this.nmeBitmap;
		r[p++] = f;
		lenOfs = p;
		r[p++] = 0;
		if((f & 4) != 0) z += 3;
		if((f & 8) != 0) z++;
		b.setVoid();
		while(i < c) {
			r[p++] = tx = d[i++];
			r[p++] = ty = d[i++];
			t = d[i++];
			q = this.qRects[t];
			o = this.qOffsets[t];
			r[p++] = ox = o.x;
			r[p++] = oy = o.y;
			r[p++] = qx = q.x;
			r[p++] = qy = q.y;
			r[p++] = qw = q.width;
			r[p++] = qh = q.height;
			u.x = -o.x;
			u.width = q.width;
			u.y = -o.y;
			u.height = q.height;
			if(ft) {
				m.identity();
				if(fm) {
					r[p++] = m.a = d[i++];
					r[p++] = m.b = d[i++];
					r[p++] = m.c = d[i++];
					r[p++] = m.d = d[i++];
				} else {
					if(fs) m.scale(r[p++] = v = d[i++],v);
					if(fr) m.rotate(r[p++] = d[i++]);
				}
				m.translate(q.x,q.y);
				u.transform(m);
			}
			u.x += tx;
			u.y += ty;
			b.join(u);
			j = 0;
			while(j++ < z) r[p++] = d[i++];
		}
		r[lenOfs] = p;
		gfx.len = p;
		gfx.grab(b.x,b.y,b.x + b.width,b.y + b.height);
	}
	,addTileRect: function(r,p) {
		if(p == null) p = new flash.geom.Point();
		this.qRects.push(r);
		this.qOffsets.push(p);
		return this.qRects.length - 1;
	}
	,__class__: openfl.display.Tilesheet
}
love2d.utils.TilesheetExt = function(image) {
	this._numTiles = 0;
	openfl.display.Tilesheet.call(this,image);
	this.tileIDs = new haxe.ds.ObjectMap();
};
$hxClasses["love2d.utils.TilesheetExt"] = love2d.utils.TilesheetExt;
love2d.utils.TilesheetExt.__name__ = ["love2d","utils","TilesheetExt"];
love2d.utils.TilesheetExt.__super__ = openfl.display.Tilesheet;
love2d.utils.TilesheetExt.prototype = $extend(openfl.display.Tilesheet.prototype,{
	addTileRectID: function(quad) {
		if(this.tileIDs.h.hasOwnProperty(quad.__id__)) return this.tileIDs.h[quad.__id__];
		var id = this._numTiles;
		this.tileIDs.set(quad,id);
		this.addTileRect(new flash.geom.Rectangle(quad._x,quad._y,quad._width,quad._height));
		this._numTiles++;
		return id;
	}
	,destroy: function() {
		this.tileIDs = null;
	}
	,__class__: love2d.utils.TilesheetExt
});
love2d.utils.RenderItem = function() {
	this.numElementsPerQuad = 0;
	this.numQuads = 0;
	this.renderList = [];
};
$hxClasses["love2d.utils.RenderItem"] = love2d.utils.RenderItem;
love2d.utils.RenderItem.__name__ = ["love2d","utils","RenderItem"];
love2d.utils.RenderItem.prototype = {
	clear: function() {
		this.renderList.splice(0,this.renderList.length);
		this.numQuads = 0;
	}
	,__class__: love2d.utils.RenderItem
}
love2d.utils.Touch = function(id) {
	love2d.utils.Object.call(this);
	this._id = id;
	this._isDown = false;
	this._x = this._y = this._sizeX = this._sizeY = 0;
	this._pressure = 1;
};
$hxClasses["love2d.utils.Touch"] = love2d.utils.Touch;
love2d.utils.Touch.__name__ = ["love2d","utils","Touch"];
love2d.utils.Touch.__super__ = love2d.utils.Object;
love2d.utils.Touch.prototype = $extend(love2d.utils.Object.prototype,{
	getPressure: function() {
		return this._pressure;
	}
	,getSize: function() {
		return { x : this._sizeX, y : this._sizeY};
	}
	,getPosition: function() {
		return { x : this._x, y : this._y};
	}
	,isDown: function() {
		return this._isDown;
	}
	,getY: function() {
		return this._y;
	}
	,getX: function() {
		return this._x;
	}
	,__class__: love2d.utils.Touch
});
var nme = {}
nme.AssetData = function() { }
$hxClasses["nme.AssetData"] = nme.AssetData;
nme.AssetData.__name__ = ["nme","AssetData"];
nme.AssetData.initialize = function() {
	if(!nme.AssetData.initialized) {
		nme.AssetData.path.set("img/hero.png","img/hero.png");
		nme.AssetData.type.set("img/hero.png","image".toUpperCase());
		nme.AssetData.initialized = true;
	}
}
openfl.Assets = function() { }
$hxClasses["openfl.Assets"] = openfl.Assets;
openfl.Assets.__name__ = ["openfl","Assets"];
openfl.Assets.__properties__ = {get_type:"get_type",get_path:"get_path",get_library:"get_library",get_id:"get_id"}
openfl.Assets.initialize = function() {
	if(!openfl.Assets.initialized) {
		nme.AssetData.initialize();
		openfl.Assets.initialized = true;
	}
}
openfl.Assets.getBitmapData = function(id,useCache) {
	if(useCache == null) useCache = true;
	openfl.Assets.initialize();
	var t = nme.AssetData.type, c = openfl.Assets.cachedBitmapData, r, b;
	if(t.exists(id) && t.get(id) == "IMAGE") {
		if(!c.exists(id)) {
			b = ApplicationMain.loaders.get(nme.AssetData.path.get(id)).contentLoaderInfo.content;
			r = b.bitmapData.clone();
			if(useCache) openfl.Assets.cachedBitmapData.set(id,r);
			return r;
		} else return openfl.Assets.cachedBitmapData.get(id).clone();
	} else if(console) console.log("BitmapData \"" + id + "\" not found.");
	return null;
}
openfl.Assets.getBytes = function(id) {
	openfl.Assets.initialize();
	if(nme.AssetData.type.exists(id)) {
		var bytes = null;
		var data = ApplicationMain.urlLoaders.get(nme.AssetData.path.get(id)).data;
		if(js.Boot.__instanceof(data,String)) {
			var bytes1 = new flash.utils.ByteArray();
			bytes1.writeUTFBytes(data);
		} else if(js.Boot.__instanceof(data,flash.utils.ByteArray)) bytes = data; else bytes = null;
		if(bytes != null) {
			bytes.position = 0;
			return bytes;
		} else return null;
	} else console.log("[openfl.Assets] There is no String or ByteArray asset with an ID of \"" + id + "\"");
	return null;
}
openfl.Assets.getFont = function(id) {
	openfl.Assets.initialize();
	if(nme.AssetData.type.exists(id) && nme.AssetData.type.get(id) == "FONT") return js.Boot.__cast(Type.createInstance(nme.AssetData.className.get(id),[]) , flash.text.Font); else console.log("[openfl.Assets] There is no Font asset with an ID of \"" + id + "\"");
	return null;
}
openfl.Assets.getSound = function(id) {
	openfl.Assets.initialize();
	if(nme.AssetData.type.exists(id)) {
		var type = nme.AssetData.type.get(id);
		if(type == "SOUND" || type == "MUSIC") return new flash.media.Sound(new flash.net.URLRequest(nme.AssetData.path.get(id)));
	}
	console.log("[openfl.Assets] There is no Sound asset with an ID of \"" + id + "\"");
	return null;
}
openfl.Assets.getText = function(id) {
	var bytes = openfl.Assets.getBytes(id);
	if(bytes == null) return null; else return bytes.readUTFBytes(bytes.length);
}
openfl.Assets.resolveClass = function(name) {
	name = StringTools.replace(name,"native.","flash.");
	name = StringTools.replace(name,"browser.","flash.");
	return Type.resolveClass(name);
}
openfl.Assets.resolveEnum = function(name) {
	name = StringTools.replace(name,"native.","flash.");
	name = StringTools.replace(name,"browser.","flash.");
	return Type.resolveEnum(name);
}
openfl.Assets.get_id = function() {
	openfl.Assets.initialize();
	var ids = [];
	var $it0 = nme.AssetData.type.keys();
	while( $it0.hasNext() ) {
		var key = $it0.next();
		ids.push(key);
	}
	return ids;
}
openfl.Assets.get_library = function() {
	openfl.Assets.initialize();
	return nme.AssetData.library;
}
openfl.Assets.get_path = function() {
	openfl.Assets.initialize();
	return nme.AssetData.path;
}
openfl.Assets.get_type = function() {
	openfl.Assets.initialize();
	return nme.AssetData.type;
}
openfl._Assets = {}
openfl._Assets.AssetType_Impl_ = function() { }
$hxClasses["openfl._Assets.AssetType_Impl_"] = openfl._Assets.AssetType_Impl_;
openfl._Assets.AssetType_Impl_.__name__ = ["openfl","_Assets","AssetType_Impl_"];
openfl._Assets.AssetType_Impl_._new = function(s) {
	return s;
}
openfl._Assets.AssetType_Impl_.toString = function(this1) {
	return this1;
}
openfl._Assets.AssetType_Impl_.fromString = function(s) {
	return s;
}
openfl._Assets.LibraryType_Impl_ = function() { }
$hxClasses["openfl._Assets.LibraryType_Impl_"] = openfl._Assets.LibraryType_Impl_;
openfl._Assets.LibraryType_Impl_.__name__ = ["openfl","_Assets","LibraryType_Impl_"];
openfl._Assets.LibraryType_Impl_._new = function(s) {
	return s;
}
openfl._Assets.LibraryType_Impl_.toString = function(this1) {
	return this1;
}
openfl._Assets.LibraryType_Impl_.fromString = function(s) {
	return s;
}
openfl.display.FPS = function(x,y,color) {
	if(color == null) color = 0;
	if(y == null) y = 10;
	if(x == null) x = 10;
	flash.text.TextField.call(this);
	this.set_x(x);
	this.set_y(y);
	this.set_selectable(false);
	this.defaultTextFormat = new flash.text.TextFormat("_sans",12,color);
	this.set_text("FPS: ");
	this.cacheCount = 0;
	this.times = [];
	this.addEventListener("enterFrame",$bind(this,this.this_onEnterFrame));
};
$hxClasses["openfl.display.FPS"] = openfl.display.FPS;
openfl.display.FPS.__name__ = ["openfl","display","FPS"];
openfl.display.FPS.__super__ = flash.text.TextField;
openfl.display.FPS.prototype = $extend(flash.text.TextField.prototype,{
	this_onEnterFrame: function(event) {
		var currentTime = haxe.Timer.stamp();
		this.times.push(currentTime);
		while(this.times[0] < currentTime - 1) this.times.shift();
		var currentCount = this.times.length;
		if(currentCount != this.cacheCount && this.visible) this.set_text("FPS: " + Math.round((currentCount + this.cacheCount) / 2));
		this.cacheCount = currentCount;
	}
	,__class__: openfl.display.FPS
});
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
flash.display.DisplayObject.remapTouch = new haxe.ds.StringMap();
flash.display.DisplayObject.remapTouch.set("mousedown","touchstart");
flash.display.DisplayObject.remapTouch.set("mousemove","touchmove");
flash.display.DisplayObject.remapTouch.set("mouseup","touchend");
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
flash.Lib.__init();
(function() {
	var a = Event.prototype, b = flash.events.Event.prototype;
	a.clone = b.clone;
	a.isDefaultPrevented = b.isDefaultPrevented;
	a.get_target = b.get_target;
	a.set_target = b.set_target;
	a.get_currentTarget = b.get_currentTarget;
	a.set_currentTarget = b.set_currentTarget;
})();
(function() {
	var o = MouseEvent.prototype, q = flash.events.MouseEvent.prototype;
	o.get_buttonDown = q.get_buttonDown;
	o.get_delta = q.get_delta;
	o.get_stageX = q.get_stageX;
	o.get_stageY = q.get_stageY;
	o.get_localX = q.get_localX;
	o.get_localY = q.get_localY;
	o.get_localPoint = q.get_localPoint;
})();
haxe.Resource.content = [];
flash.Lib.qTimeStamp = Date.now() + 0;
flash.Lib.mouseX = 0;
flash.Lib.mouseY = 0;
flash.geom.Transform.DEG_TO_RAD = Math.PI / 180.0;
flash.media.Sound.library = new haxe.ds.StringMap();
flash.system.System.useCodePage = false;
flash.ui.Multitouch.supportsTouchEvents = false;
flash.ui.Multitouch.maxTouchPoints = 0;
haxe.ds.ObjectMap.count = 0;
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
love2d.Love._version = "0.9.0";
love2d.Love._hoveversion = "0.1.0";
love2d.Love._inited = false;
love2d.utils.OUYA.O = 0;
love2d.utils.OUYA.U = 3;
love2d.utils.OUYA.Y = 4;
love2d.utils.OUYA.A = 1;
love2d.utils.OUYA.L1 = 6;
love2d.utils.OUYA.L2 = 8;
love2d.utils.OUYA.R1 = 7;
love2d.utils.OUYA.R2 = 9;
love2d.utils.OUYA.MENU = 16777234;
love2d.utils.OUYA.AXIS_LS_X = 0;
love2d.utils.OUYA.AXIS_LS_Y = 1;
love2d.utils.OUYA.AXIS_RS_X = 11;
love2d.utils.OUYA.AXIS_RS_Y = 14;
love2d.utils.OUYA.AXIS_L2 = 17;
love2d.utils.OUYA.AXIS_R2 = 18;
love2d.utils.OUYA.DPAD_UP = 19;
love2d.utils.OUYA.DPAD_RIGHT = 22;
love2d.utils.OUYA.DPAD_DOWN = 20;
love2d.utils.OUYA.DPAD_LEFT = 21;
love2d.utils.OUYA.R3 = 11;
love2d.utils.OUYA.L3 = 10;
love2d.utils.SpriteBatch.RenderItemPool = [];
love2d.utils.SpriteBatch.RECT = new flash.geom.Rectangle();
love2d.utils.TilesheetCache.cache = new haxe.ds.ObjectMap();
love2d.utils.RenderItem.NUM_ELEMENTS_RGB_ALPHA = 11;
love2d.utils.RenderItem.NUM_ELEMENTS_RGB = 10;
love2d.utils.RenderItem.NUM_ELEMENTS_ALPHA = 8;
love2d.utils.RenderItem.NUM_ELEMENTS_NO_RGB_ALPHA = 7;
nme.AssetData.className = new haxe.ds.StringMap();
nme.AssetData.library = new haxe.ds.StringMap();
nme.AssetData.path = new haxe.ds.StringMap();
nme.AssetData.type = new haxe.ds.StringMap();
nme.AssetData.initialized = false;
openfl.Assets.cachedBitmapData = new haxe.ds.StringMap();
openfl.Assets.initialized = false;
ApplicationMain.main();
})();

//@ sourceMappingURL=Kawaii.js.map