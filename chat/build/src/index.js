'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sticker = function (_React$Component) {
  _inherits(Sticker, _React$Component);

  function Sticker(...args) {
    var _temp, _this, _ret;

    _classCallCheck(this, Sticker);

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (Sticker.__proto__ || Object.getPrototypeOf(Sticker)).call(this, ...args)), _this), _this.state = { down: false }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Sticker, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.refs.image.draggable = false;

      window.addEventListener("touchup", function () {
        _this2.setState({ down: false });
      });
      window.addEventListener("mouseup", function () {
        _this2.setState({ down: false });
      });
    }
  }, {
    key: 'pressDown',
    value: function pressDown(e) {
      this.setState({ down: true });
      this.moved = false;
    }
  }, {
    key: 'move',
    value: function move() {
      this.moved = true;
    }
  }, {
    key: 'up',
    value: function up(e) {
      this.setState({ down: false });
      if (!this.moved) this.props.onClick();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('img', { ref: 'image', onTouchStart: this.pressDown.bind(this), onMouseDown: this.pressDown.bind(this), onTouchEnd: this.up.bind(this), onTouchMove: this.move.bind(this), onMouseUp: this.up.bind(this), className: "sticker " + (this.state.down ? "down" : ""), src: "./images/stickers/" + this.props.image + ".png" });
    }
  }]);

  return Sticker;
}(_react2.default.Component);

var Photo = function (_React$Component2) {
  _inherits(Photo, _React$Component2);

  function Photo(...args) {
    var _temp2, _this3, _ret2;

    _classCallCheck(this, Photo);

    return _ret2 = (_temp2 = (_this3 = _possibleConstructorReturn(this, (Photo.__proto__ || Object.getPrototypeOf(Photo)).call(this, ...args)), _this3), _this3.state = { down: false }, _temp2), _possibleConstructorReturn(_this3, _ret2);
  }

  _createClass(Photo, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this4 = this;

      this.refs.image.draggable = false;

      window.addEventListener("touchup", function () {
        _this4.setState({ down: false });
      });
      window.addEventListener("mouseup", function () {
        _this4.setState({ down: false });
      });
    }
  }, {
    key: 'pressDown',
    value: function pressDown(e) {
      this.setState({ down: true });
      this.moved = false;
    }
  }, {
    key: 'move',
    value: function move() {
      this.moved = true;
    }
  }, {
    key: 'up',
    value: function up(e) {
      this.setState({ down: false });
      if (!this.moved) this.props.onClick();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('img', { ref: 'image', onTouchStart: this.pressDown.bind(this), onMouseDown: this.pressDown.bind(this), onTouchEnd: this.up.bind(this), onTouchMove: this.move.bind(this), onMouseUp: this.up.bind(this), className: "photo " + (this.state.down ? "down" : ""), src: "./images/photos/" + this.props.image + ".jpg" });
    }
  }]);

  return Photo;
}(_react2.default.Component);

var Key = function (_React$Component3) {
  _inherits(Key, _React$Component3);

  function Key(...args) {
    var _temp3, _this5, _ret3;

    _classCallCheck(this, Key);

    return _ret3 = (_temp3 = (_this5 = _possibleConstructorReturn(this, (Key.__proto__ || Object.getPrototypeOf(Key)).call(this, ...args)), _this5), _this5.state = { down: false }, _temp3), _possibleConstructorReturn(_this5, _ret3);
  }

  _createClass(Key, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this6 = this;

      window.addEventListener("touchup", function () {
        _this6.setState({ down: false });
      });
      window.addEventListener("mouseup", function () {
        _this6.setState({ down: false });
      });
    }
  }, {
    key: 'mouseUp',
    value: function mouseUp(e) {
      this.setState({ down: false });
      this.props.onKeyPress(this.props.text);
    }
  }, {
    key: 'pressDown',
    value: function pressDown(e) {
      this.setState({ down: true });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        {
          className: (this.props.className || "") + " key " + (this.state.down ? "down" : ""),
          onMouseDown: this.pressDown.bind(this),
          onMouseUp: this.mouseUp.bind(this),
          onTouchStart: this.pressDown.bind(this),
          onTouchEnd: this.mouseUp.bind(this)
        },
        _react2.default.createElement(
          'div',
          { className: 'back' },
          this.props.text
        )
      );
    }
  }]);

  return Key;
}(_react2.default.Component);

var Keyboard = function (_React$Component4) {
  _inherits(Keyboard, _React$Component4);

  function Keyboard(props) {
    _classCallCheck(this, Keyboard);

    var _this7 = _possibleConstructorReturn(this, (Keyboard.__proto__ || Object.getPrototypeOf(Keyboard)).call(this, props));

    _this7.state = { open: true, text: "", tab: "text" };


    _this7.onKeyPressFn = _this7.onKeyPress.bind(_this7);
    return _this7;
  }

  _createClass(Keyboard, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this8 = this;

      this.hammer = new Hammer(this.refs.keyboard);
      this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
      this.hammer.on('swipeup', function (e) {
        if (_this8.state.text != "") {
          _this8.props.onSend({ type: "text", content: _this8.state.text });
          setTimeout(function () {
            _this8.setState({ text: "" });
          }, 10);
        }
      });
      this.hammer.on('swipedown', function (e) {
        _this8.props.onUndo();
        setTimeout(function () {
          _this8.setState({ text: "" });
        }, 10);
      });
    }
  }, {
    key: 'onKeyPress',
    value: function onKeyPress(key) {
      this.setState({
        text: this.state.text + key
      });
    }
  }, {
    key: 'open',
    value: function open(tab) {
      this.setState({ open: true, tab: tab || "text" });
    }
  }, {
    key: 'close',
    value: function close() {
      this.setState({ open: false });
    }
  }, {
    key: 'backspace',
    value: function backspace() {
      this.setState({ text: this.state.text.substring(0, this.state.text.length - 1) });
    }
  }, {
    key: 'send',
    value: function send() {
      if (this.state.text != "") {
        this.props.onSend({ type: "text", content: this.state.text });
        this.setState({ open: false, text: "" });
      }
    }
  }, {
    key: 'sendSticker',
    value: function sendSticker(id) {
      this.props.onSend({ type: "sticker", content: id });
    }
  }, {
    key: 'sendPhoto',
    value: function sendPhoto(id) {
      this.props.onSend({ type: "photo", content: id });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this9 = this;

      console.log(this.state.tab);
      return _react2.default.createElement(
        'div',
        { ref: 'keyboard', className: "keyboard " + (this.state.open ? "open" : "closed") },
        _react2.default.createElement(
          'div',
          { className: 'textbox' },
          _react2.default.createElement('div', { className: "photo-btn btn " + (this.state.tab == "photo" ? "active" : ""), onClick: function (e) {
              return _this9.open("photo");
            } }),
          _react2.default.createElement('div', { className: "sticky-btn btn " + (this.state.tab == "sticky" ? "active" : ""), onClick: function (e) {
              return _this9.open("sticky");
            } }),
          _react2.default.createElement(
            'div',
            { className: 'input', onClick: function (e) {
                return _this9.open("text");
              } },
            _react2.default.createElement(
              'div',
              { className: 'text' },
              _react2.default.createElement(
                'pre',
                { ref: 'text' },
                this.state.text
              ),
              _react2.default.createElement('span', { style: { borderRight: this.state.tab == "text" ? "1px solid black" : "" } })
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'photos', style: { display: this.state.tab == "photo" ? "block" : "none" } },
          _react2.default.createElement(
            'div',
            { className: 'list' },
            _react2.default.createElement('img', { src: './images/camera.PNG' }),
            [1, 2, 3, 4, 5].map(function (id) {
              return _react2.default.createElement(Photo, { key: id, image: id, onClick: function () {
                  return _this9.sendPhoto(id);
                } });
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'stickers', style: { display: this.state.tab == "sticky" ? "block" : "none" } },
          _react2.default.createElement(
            'div',
            { className: 'list' },
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (id) {
              return _react2.default.createElement(Sticker, { key: id, image: id, onClick: function () {
                  return _this9.sendSticker(id);
                } });
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'buttons', style: { display: this.state.tab == "text" ? "block" : "none" } },
          _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(Key, { text: 'q', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'w', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'e', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'r', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 't', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'y', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'u', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'i', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'o', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'p', onKeyPress: this.onKeyPressFn })
          ),
          _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(Key, { text: 'a', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 's', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'd', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'f', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'g', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'h', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'j', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'k', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'l', onKeyPress: this.onKeyPressFn })
          ),
          _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(Key, { text: 'z', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'x', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'c', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'v', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'b', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'n', onKeyPress: this.onKeyPressFn }),
            _react2.default.createElement(Key, { text: 'm', onKeyPress: this.onKeyPressFn })
          ),
          _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(Key, { className: 'space', text: ' ', onKeyPress: this.onKeyPressFn })
          ),
          _react2.default.createElement('div', { className: 'backspace', onTouchEnd: this.backspace.bind(this), onMouseUp: this.backspace.bind(this) }),
          _react2.default.createElement(Key, { className: 'send', text: 'Send', onKeyPress: this.send.bind(this) })
        )
      );
    }
  }]);

  return Keyboard;
}(_react2.default.Component);

var ChatLog = function (_React$Component5) {
  _inherits(ChatLog, _React$Component5);

  function ChatLog(...args) {
    var _temp4, _this10, _ret4;

    _classCallCheck(this, ChatLog);

    return _ret4 = (_temp4 = (_this10 = _possibleConstructorReturn(this, (ChatLog.__proto__ || Object.getPrototypeOf(ChatLog)).call(this, ...args)), _this10), _this10.state = {
      log: []
    }, _temp4), _possibleConstructorReturn(_this10, _ret4);
  }

  _createClass(ChatLog, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this11 = this;

      this.scrollToBottom();

      this.hammer = new Hammer(this.refs.log);
      this.hammer.on("tap", function () {
        _this11.props.closeKeyboard();
      });
    }
  }, {
    key: 'scrollToBottom',
    value: function scrollToBottom() {
      var _this12 = this;

      setTimeout(function () {
        _this12.refs.log.scrollTop = _this12.refs.log.scrollHeight;
      }, 100);
    }
  }, {
    key: 'addMessage',
    value: function addMessage(message) {
      this.setState({
        log: this.state.log.concat([message])
      });
      this.scrollToBottom();
    }
  }, {
    key: 'removeMessage',
    value: function removeMessage() {
      this.setState({
        log: this.state.log.slice(0, this.state.log.length - 1)
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { ref: 'log', className: 'chatLog' },
        _react2.default.createElement(
          'div',
          { className: 'chat' },
          this.state.log.map(function (val, i) {
            return _react2.default.createElement(
              'div',
              { className: 'log', key: i },
              _react2.default.createElement('div', { className: 'avatar', style: { backgroundImage: "url(./images/rick.jpg)", backgroundSize: "cover", borderRadius: "3px" } }),
              _react2.default.createElement(
                'div',
                { className: 'message' },
                _react2.default.createElement(
                  'div',
                  { className: 'heading' },
                  _react2.default.createElement(
                    'span',
                    { className: 'name' },
                    'Rick Gonzalez'
                  ),
                  _react2.default.createElement(
                    'span',
                    { className: 'time' },
                    '7:37 PM'
                  )
                ),
                _react2.default.createElement(
                  'p',
                  null,
                  val.type == "text" ? val.content : val.type == "sticker" ? _react2.default.createElement('img', { className: 'sticker', src: "./images/stickers/" + val.content + ".png" }) : val.type == "photo" ? _react2.default.createElement('img', { className: 'sticker', src: "./images/photos/" + val.content + ".jpg" }) : ""
                )
              )
            );
          })
        )
      );
    }
  }]);

  return ChatLog;
}(_react2.default.Component);

var App = function (_React$Component6) {
  _inherits(App, _React$Component6);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
  }

  _createClass(App, [{
    key: 'addLog',
    value: function addLog(message) {
      this.refs.chatLog.addMessage(message);
    }
  }, {
    key: 'removeLog',
    value: function removeLog() {
      this.refs.chatLog.removeMessage();
    }
  }, {
    key: 'closeKeyboard',
    value: function closeKeyboard() {
      this.refs.keyBoard.close();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement('img', { src: './images/topbar.png', width: '375px' }),
        _react2.default.createElement(ChatLog, { closeKeyboard: this.closeKeyboard.bind(this), ref: 'chatLog' }),
        _react2.default.createElement(Keyboard, { onSend: this.addLog.bind(this), onUndo: this.removeLog.bind(this), ref: 'keyBoard' })
      );
    }
  }]);

  return App;
}(_react2.default.Component);

var click = document.getElementById("click");

window.addEventListener('touchstart', function (e) {
  console.log("start!");
  console.log(e);
  click.style.left = e.pageX + "px";
  click.style.top = e.pageY + "px";
  click.style.opacity = 0.5;
});

window.addEventListener('touchmove', function (e) {
  console.log("MOVE!");
  click.style.left = e.pageX + "px";
  click.style.top = e.pageY + "px";
});

window.addEventListener('touchend', function (e) {
  click.style.opacity = 0;
});

var node = document.getElementById("app");
_reactDom2.default.render(_react2.default.createElement(App, null), node);
//# sourceMappingURL=index.js.map
