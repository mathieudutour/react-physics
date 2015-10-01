const React = require('react');
const p2 = require('p2');
const Shape = require('./Shape');

module.exports = class Box extends Shape {
  static propTypes = {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    shapeOptions: React.PropTypes.object,
  }

  componentWillReceiveProps(nextProps) {
    const {height = 1, width = 1} = nextProps;
    if (height !== this.props.height) {
      this._shape.height = height;
    }
    if (width !== this.props.width) {
      this._shape.width = width;
    }
    super.componentWillReceiveProps(nextProps);
  }

  getP2Shape() {
    if (this._shape) { return this._shape; }
    const {height = 1, width = 1, shapeOptions} = this.props;
    this._shape = new p2.Box(Object.assign({height, width}, shapeOptions));
    return this._shape;
  }
};
