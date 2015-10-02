'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var React = require('react');
var p2 = require('p2');
var Body = require('./Body');

var _require = require('./styles');

var circleStyle = _require.circleStyle;

module.exports = (function (_Body) {
  _inherits(Circle, _Body);

  function Circle() {
    _classCallCheck(this, Circle);

    _get(Object.getPrototypeOf(Circle.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Circle, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _nextProps$radius = nextProps.radius;
      var radius = _nextProps$radius === undefined ? 1 : _nextProps$radius;

      if (radius !== this.props.radius) {
        this._shape.radius = radius;
      }
      _get(Object.getPrototypeOf(Circle.prototype), 'componentWillReceiveProps', this).call(this, nextProps);
    }
  }, {
    key: 'getP2Shape',
    value: function getP2Shape() {
      if (this._shape) {
        return this._shape;
      }
      var _props = this.props;
      var _props$radius = _props.radius;
      var radius = _props$radius === undefined ? 1 : _props$radius;
      var shapeOptions = _props.shapeOptions;

      this._shape = new p2.Circle(_Object$assign({ radius: radius }, shapeOptions));
      return this._shape;
    }
  }, {
    key: 'getInferedMass',
    value: function getInferedMass() {
      var _props$radius2 = this.props.radius;
      var radius = _props$radius2 === undefined ? 1 : _props$radius2;

      return { mass: Math.PI * radius * radius };
    }
  }, {
    key: 'getShapeStyle',
    value: function getShapeStyle() {
      var _props$radius3 = this.props.radius;
      var radius = _props$radius3 === undefined ? 1 : _props$radius3;

      return _Object$assign({}, circleStyle, { width: 2 * radius, height: 2 * radius });
    }
  }], [{
    key: 'propTypes',
    value: {
      radius: React.PropTypes.number,
      shapeOptions: React.PropTypes.object
    },
    enumerable: true
  }]);

  return Circle;
})(Body);