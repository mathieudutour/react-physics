const React = require('react');
const p2 = require('p2');
const Body = require('./Body');
const {planeStyle} = require('./styles');

module.exports = class Plane extends Body {
  static propTypes = {
    shapeOptions: React.PropTypes.object,
  }

  getP2Shape() {
    if (this._shape) { return this._shape; }
    const {shapeOptions} = this.props;
    this._shape = new p2.Box(shapeOptions);
    return this._shape;
  }

  getInferedMass() {
    return {mass: 0};
  }

  getShapeStyle() {
    return Object.assign({}, planeStyle, {width: '300vmax'});
  }
};
