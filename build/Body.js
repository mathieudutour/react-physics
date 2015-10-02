'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var React = require('react');
var p2 = require('p2');

var _require = require('./styles');

var shapeStyle = _require.shapeStyle;

module.exports = (function (_React$Component) {
  _inherits(Body, _React$Component);

  _createClass(Body, null, [{
    key: 'propTypes',
    value: {
      element: React.PropTypes.node,
      bodyOptions: React.PropTypes.object,
      shapeOptions: React.PropTypes.object,
      style: React.PropTypes.object,
      className: React.PropTypes.string,
      children: React.PropTypes.node,
      initialPosition: React.PropTypes.object,
      initialAngle: React.PropTypes.number,
      draggable: React.PropTypes.bool,
      ignoreRotation: React.PropTypes.bool,
      ignoreTranslation: React.PropTypes.bool,
      tolerance: React.PropTypes.number,
      willChange: React.PropTypes.array,
      _step: React.PropTypes.number,
      _onStartControl: React.PropTypes.func,
      _onEndControl: React.PropTypes.func,
      _onControl: React.PropTypes.func,
      _world: React.PropTypes.object
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      element: React.createElement('div', null),
      initialPosition: {
        x: 0,
        y: 0
      },
      initialAngle: 0,
      tolerance: 2,
      willChange: []
    },
    enumerable: true
  }]);

  function Body(props) {
    var _this = this;

    _classCallCheck(this, Body);

    _get(Object.getPrototypeOf(Body.prototype), 'constructor', this).call(this, props);

    this.componentWillReceiveProps = function (nextProps) {
      var _nextProps$bodyOptions = nextProps.bodyOptions;
      var bodyOptions = _nextProps$bodyOptions === undefined ? {} : _nextProps$bodyOptions;
      var _nextProps$shapeOptions = nextProps.shapeOptions;
      var shapeOptions = _nextProps$shapeOptions === undefined ? {} : _nextProps$shapeOptions;

      _Object$keys(bodyOptions).forEach(function (k) {
        if (k === 'position' || k === 'angle') {
          return;
        }
        _this._body[k] = nextProps.bodyOptions[k];
      });
      _Object$keys(shapeOptions).forEach(function (k) {
        _this._shape[k] = nextProps.shapeOptions[k];
      });
    };

    this.shouldComponentUpdate = function (nextProps) {
      var ignoreRotation = nextProps.ignoreRotation;
      var ignoreTranslation = nextProps.ignoreTranslation;
      var tolerance = nextProps.tolerance;
      var willChange = nextProps.willChange;

      if (!ignoreRotation && _this._body.angle.toFixed(tolerance) !== _this._angle.toFixed(tolerance)) {
        return true;
      }
      if (!ignoreTranslation && (_this._body.position[0].toFixed(tolerance) !== _this._position[0].toFixed(tolerance) || _this._body.position[1].toFixed(tolerance) !== _this._position[1].toFixed(tolerance))) {
        return true;
      }

      return willChange.some(function (field) {
        return nextProps[field] !== _this.props[field];
      });
    };

    this.componentWillUnmount = function () {
      _this.props._world.removeBody(_this._body);
    };

    this.getP2Body = function () {
      return _this._body;
    };

    this._handleTouchStart = function (e) {
      if (_this.props.draggable) {
        var touch = e.changedTouches[0];
        _this._startPoint = {
          id: touch.identifier
        };
        _this.setState({ dragging: true });
        _this.props._onStartControl(_this._body, [touch.screenX, -touch.screenY]);
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
      _this.props._onEndControl();
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
        _this.props._onControl([touch.screenX, -touch.screenY]);
      }
    };

    var bodyOptions = props.bodyOptions;
    var initialPosition = props.initialPosition;
    var initialAngle = props.initialAngle;

    this._body = new p2.Body(_Object$assign({}, this.getInferedMass(), bodyOptions));
    if (initialPosition) {
      this._body.position = [initialPosition.x, initialPosition.y];
    }
    if (initialAngle) {
      this._body.angle = initialAngle;
    }
    this._shape = this.getP2Shape();
    this._body.addShape(this._shape);
    this.state = { dragging: false };
    this._position = this._body.position;
    this._angle = this._body.angle;

    props._world.addBody(this._body);
  }

  _createClass(Body, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var element = _props.element;
      var children = _props.children;
      var className = _props.className;
      var style = _props.style;
      var ignoreRotation = _props.ignoreRotation;
      var ignoreTranslation = _props.ignoreTranslation;

      var rest = _objectWithoutProperties(_props, ['element', 'children', 'className', 'style', 'ignoreRotation', 'ignoreTranslation']);

      var angle = this._body.angle;
      var position = [this._body.position[0], this._body.position[1]];

      if (ignoreRotation) {
        angle = this._angle;
      } else {
        this._angle = angle;
      }
      if (ignoreTranslation) {
        position = this._position;
      } else {
        this._position = position;
      }
      var transform = {
        transform: 'translate(\n        calc(' + position[0] + 'px - 50%),\n        calc(' + -position[1] + 'px - 50%))\n        rotateZ(' + -angle + 'rad)'
      };
      return React.cloneElement(element, _extends({
        className: 'p2-shape ' + (className || ''),
        style: _Object$assign({}, shapeStyle, this.getShapeStyle(), transform, style),
        onTouchEnd: this._handleTouchEnd,
        onTouchMove: this._handleTouchMove,
        onTouchStart: this._handleTouchStart,
        children: children
      }, rest));
    }
  }]);

  return Body;
})(React.Component);