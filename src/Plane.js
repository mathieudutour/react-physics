const React = require('react');
const p2 = require('p2');
const Shape = require('./Shape');
const {planeStyle} = require('./styles');

module.exports = class Plane extends Shape {
  static propTypes = {
    shapeOptions: React.PropTypes.object,
  }

  getP2Shape() {
    if (this._shape) { return this._shape; }
    const {shapeOptions} = this.props;
    this._shape = new p2.Box(shapeOptions);
    return this._shape;
  }

  getShapeStyle() {
    return planeStyle;
  }
};
