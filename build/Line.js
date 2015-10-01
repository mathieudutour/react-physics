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
  _inherits(Line, _Shape);

  function Line() {
    _classCallCheck(this, Line);

    _get(Object.getPrototypeOf(Line.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Line, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _nextProps$length = nextProps.length;
      var length = _nextProps$length === undefined ? 1 : _nextProps$length;

      if (length !== this.props.length) {
        this._shape.length = length;
      }
      _get(Object.getPrototypeOf(Line.prototype), 'componentWillReceiveProps', this).call(this, nextProps);
    }
  }, {
    key: 'getP2Shape',
    value: function getP2Shape() {
      if (this._shape) {
        return this._shape;
      }
      var _props = this.props;
      var _props$length = _props.length;
      var length = _props$length === undefined ? 1 : _props$length;
      var shapeOptions = _props.shapeOptions;

      this._shape = new p2.Box(_Object$assign({ length: length }, shapeOptions));
      return this._shape;
    }
  }], [{
    key: 'propTypes',
    value: {
      length: React.PropTypes.number,
      shapeOptions: React.PropTypes.object
    },
    enumerable: true
  }]);

  return Line;
})(Shape);