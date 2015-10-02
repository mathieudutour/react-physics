const React = require('react');
const p2 = require('p2');
const Body = require('./Body');
const {lineStyle} = require('./styles');

module.exports = class Line extends Body {
  static propTypes = {
    length: React.PropTypes.number,
    shapeOptions: React.PropTypes.object,
  }

  componentWillReceiveProps(nextProps) {
    const {length = 1} = nextProps;
    if (length !== this.props.length) {
      this._shape.length = length;
    }
    super.componentWillReceiveProps(nextProps);
  }

  getP2Shape() {
    if (this._shape) { return this._shape; }
    const {length = 1, shapeOptions} = this.props;
    this._shape = new p2.Box(Object.assign({length}, shapeOptions));
    return this._shape;
  }

  getInferedMass() {
    const {length = 1} = this.props;
    return {mass: length * 1};
  }

  getShapeStyle() {
    const {length = 1} = this.props;
    return Object.assign({}, lineStyle, {width: length, height: 1});
  }
};
