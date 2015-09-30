const React = require('react');
const p2 = require('p2');
const Shape = require('./Shape');

module.exports = class Line extends Shape {
  propTypes = {
    length: React.PropTypes.number,
    shapeOptions: React.PropTypes.object,
  }

  getP2Shape() {
    if (this._shape) { return this._shape; }
    const {length = 1, shapeOptions} = this.props;
    this._shape = new p2.Box(Object.assign({length}, shapeOptions));
    return this._shape;
  }
};
