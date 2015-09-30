const React = require('react');
const p2 = require('p2');
const Shape = require('./Shape');

module.exports = class Box extends Shape {
  propTypes = {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    shapeOptions: React.PropTypes.object,
  }

  getP2Shape() {
    if (this._shape) { return this._shape; }
    const {height = 1, width = 1, shapeOptions} = this.props;
    this._shape = new p2.Box(Object.assign({height, width}, shapeOptions));
    return this._shape;
  }
};
