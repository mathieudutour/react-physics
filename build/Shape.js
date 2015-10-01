'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var React = require('react');
var p2 = require('p2');

var _require = require('./styles');

var shapeStyle = _require.shapeStyle;

module.exports = (function (_React$Component) {
  _inherits(Shape, _React$Component);

  _createClass(Shape, null, [{
    key: 'propTypes',
    value: {
      bodyOptions: React.PropTypes.object,
      shapeOptions: React.PropTypes.object,
      style: React.PropTypes.object,
      className: React.PropTypes.string,
      children: React.PropTypes.node,
      position: React.PropTypes.array,
      angle: React.PropTypes.array,
      draggable: React.PropTypes.bool,
      onStartControl: React.PropTypes.func,
      onEndControl: React.PropTypes.func,
      onControl: React.PropTypes.func,
      ignoreRotation: React.PropTypes.bool,
      ignoreTranslation: React.PropTypes.bool
    },
    enumerable: true
  }]);

  function Shape(props) {
    var _this = this;

    _classCallCheck(this, Shape);

    _get(Object.getPrototypeOf(Shape.prototype), 'constructor', this).call(this, props);

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
        _this.props.onStartControl([_this._startPoint.x, -_this._startPoint.y]);
      }
    };

    this._handleTouchEnd = function (e) {
      if (!_this._startPoint) {
        return;
      }
      var touch = _Array$from(e.changedTouches).find(function (t) {
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
        var touch = _Array$from(e.changedTouches).find(function (t) {
          return t.identifier === _this._startPoint.id;
        });
        if (!touch) {
          return;
        }
        _this.props.onControl([touch.screenX, -touch.screenY]);
      }
    };

    var bodyOptions = this.props.bodyOptions;

    this._body = new p2.Body(bodyOptions);
    this._shape = this.getP2Shape();
    this._body.addShape(this._shape);
    this.state = { dragging: false };
    this._position = this._body.position;
    this._angle = this._body.angle;
  }

  _createClass(Shape, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var _nextProps$bodyOptions = nextProps.bodyOptions;
      var bodyOptions = _nextProps$bodyOptions === undefined ? {} : _nextProps$bodyOptions;
      var _nextProps$shapeOptions = nextProps.shapeOptions;
      var shapeOptions = _nextProps$shapeOptions === undefined ? {} : _nextProps$shapeOptions;

      _Object$keys(bodyOptions).forEach(function (k) {
        if (k === 'position' || k === 'angle') {
          return;
        }
        _this2._body[k] = nextProps.bodyOptions[k];
      });
      _Object$keys(shapeOptions).forEach(function (k) {
        _this2._shape[k] = nextProps.shapeOptions[k];
      });
    }
  }, {
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
      var ignoreRotation = _props.ignoreRotation;
      var ignoreTranslation = _props.ignoreTranslation;

      var rest = _objectWithoutProperties(_props, ['children', 'className', 'style', 'ignoreRotation', 'ignoreTranslation']);

      var _props2 = this.props;
      var _props2$pos = _props2.pos;
      var pos = _props2$pos === undefined ? this._body.position : _props2$pos;
      var _props2$angle = _props2.angle;
      var angle = _props2$angle === undefined ? this._body.angle : _props2$angle;

      if (ignoreRotation) {
        angle = this._angle;
      } else {
        this._angle = angle;
      }
      if (ignoreTranslation) {
        pos = this._position;
      } else {
        this._position = pos;
      }
      var transform = {
        transform: 'translate(\n        calc(' + pos[0] + 'px - 50%),\n        calc(' + -pos[1] + 'px - 50%))\n        rotateZ(' + -angle + 'rad)'
      };
      return React.createElement(
        'div',
        _extends({ className: 'p2-shape ' + (className || ''),
          style: _Object$assign({}, shapeStyle, this.getShapeStyle(), transform, style),
          onTouchEnd: this._handleTouchEnd,
          onTouchMove: this._handleTouchMove,
          onTouchStart: this._handleTouchStart
        }, rest),
        children
      );
    }
  }]);

  return Shape;
})(React.Component);