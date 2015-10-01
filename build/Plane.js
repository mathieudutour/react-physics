'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var React = require('react');
var p2 = require('p2');
var Shape = require('./Shape');

module.exports = (function (_Shape) {
  _inherits(Plane, _Shape);

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
  }], [{
    key: 'propTypes',
    value: {
      shapeOptions: React.PropTypes.object
    },
    enumerable: true
  }]);

  return Plane;
})(Shape);