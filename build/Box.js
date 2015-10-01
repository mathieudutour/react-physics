'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var React = require('react');
var p2 = require('p2');
var Shape = require('./Shape');

module.exports = (function (_Shape) {
  _inherits(Box, _Shape);

  function Box() {
    _classCallCheck(this, Box);

    _get(Object.getPrototypeOf(Box.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Box, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _nextProps$height = nextProps.height;
      var height = _nextProps$height === undefined ? 1 : _nextProps$height;
      var _nextProps$width = nextProps.width;
      var width = _nextProps$width === undefined ? 1 : _nextProps$width;

      if (height !== this.props.height) {
        this._shape.height = height;
      }
      if (width !== this.props.width) {
        this._shape.width = width;
      }
      _get(Object.getPrototypeOf(Box.prototype), 'componentWillReceiveProps', this).call(this, nextProps);
    }
  }, {
    key: 'getP2Shape',
    value: function getP2Shape() {
      if (this._shape) {
        return this._shape;
      }
      var _props = this.props;
      var _props$height = _props.height;
      var height = _props$height === undefined ? 1 : _props$height;
      var _props$width = _props.width;
      var width = _props$width === undefined ? 1 : _props$width;
      var shapeOptions = _props.shapeOptions;

      this._shape = new p2.Box(_Object$assign({ height: height, width: width }, shapeOptions));
      return this._shape;
    }
  }], [{
    key: 'propTypes',
    value: {
      height: React.PropTypes.number,
      width: React.PropTypes.number,
      shapeOptions: React.PropTypes.object
    },
    enumerable: true
  }]);

  return Box;
})(Shape);