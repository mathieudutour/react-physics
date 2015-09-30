'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var p2 = require('p2');

module.exports = (function (_React$Component) {
  _inherits(Shape, _React$Component);

  function Shape(props) {
    var _this = this;

    _classCallCheck(this, Shape);

    _get(Object.getPrototypeOf(Shape.prototype), 'constructor', this).call(this, props);
    this.propTypes = {
      bodyOptions: React.PropTypes.object,
      style: React.PropTypes.object,
      className: React.PropTypes.string,
      children: React.PropTypes.node,
      position: React.PropTypes.array,
      angle: React.PropTypes.array,
      draggable: React.PropTypes.bool,
      onStartControl: React.PropTypes.func,
      onEndControl: React.PropTypes.func,
      onControl: React.PropTypes.func
    };

    this._handleTouchStart = function (e) {
      if (_this.props.draggable) {
        _this._startPoint = {
          posX: _this._body.position[0],
          posY: _this._body.position[1],
          x: e.changedTouches[0].screenX,
          y: e.changedTouches[0].screenY,
          id: e.changedTouches[0].identifier
        };
        _this.setState({ dragging: true });
        _this.props.onStartControl();
      }
    };

    this._handleTouchEnd = function (e) {
      if (!_this._startPoint) {
        return;
      }
      var touch = Array.from(e.changedTouches).find(function (t) {
        return t.identifier === _this._startPoint.id;
      });
      if (!touch) {
        return;
      }
      _this._startPoint = null;
      _this.setState({ dragging: false });
      _this.props.onEndControl();
    };

    this._handleTouchMove = function (e) {
      if (_this.state.dragging) {
        if (!_this._startPoint) {
          return;
        }
        var touch = Array.from(e.changedTouches).find(function (t) {
          return t.identifier === _this._startPoint.id;
        });
        if (!touch) {
          return;
        }
        _this.props.onControl([_this._startPoint.posX + (touch.screenX - _this._startPoint.x), _this._startPoint.posY - (touch.screenY - _this._startPoint.y)]);
      }
    };

    var bodyOptions = this.props.bodyOptions;

    this._body = new p2.Body(bodyOptions);
    this._shape = this.getP2Shape();
    this._body.addShape(this._shape);
    this.state = { dragging: false };
  }

  _createClass(Shape, [{
    key: 'getP2Body',
    value: function getP2Body() {
      return this._body;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var children = _props.children;
      var className = _props.className;
      var style = _props.style;
      var _props$pos = _props.pos;
      var pos = _props$pos === undefined ? this._body.position : _props$pos;
      var _props$angle = _props.angle;
      var angle = _props$angle === undefined ? this._body.angle : _props$angle;

      var transform = {
        transform: 'translate(\n        calc(' + pos[0] + 'px - 50%),\n        calc(' + -pos[1] + 'px - 50%))\n      rotateZ(' + -angle + 'rad) '
      };
      return React.createElement(
        'div',
        { className: 'p2-shape ' + (className || ''),
          style: Object.assign(transform, style),
          onTouchEnd: this._handleTouchEnd,
          onTouchMove: this._handleTouchMove,
          onTouchStart: this._handleTouchStart },
        children
      );
    }
  }]);

  return Shape;
})(React.Component);