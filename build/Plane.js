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

var planeStyle = _require.planeStyle;

module.exports = (function (_Body) {
  _inherits(Plane, _Body);

  function Plane() {
    _classCallCheck(this, Plane);

    _get(Object.getPrototypeOf(Plane.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Plane, [{
    key: 'getP2Shape',
    value: function getP2Shape() {
      if (this._shape) {
        return this._shape;
      }
      var shapeOptions = this.props.shapeOptions;

      this._shape = new p2.Box(shapeOptions);
      return this._shape;
    }
  }, {
    key: 'getInferedMass',
    value: function getInferedMass() {
      return { mass: 0 };
    }
  }, {
    key: 'getShapeStyle',
    value: function getShapeStyle() {
      return _Object$assign({}, planeStyle, { width: '300vmax' });
    }
  }], [{
    key: 'propTypes',
    value: {
      shapeOptions: React.PropTypes.object
    },
    enumerable: true
  }]);

  return Plane;
})(Body);