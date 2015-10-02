const React = require('react');
const p2 = require('p2');
const {shapeStyle} = require('./styles');

module.exports = class Body extends React.Component {
  static propTypes = {
    element: React.PropTypes.node,
    bodyOptions: React.PropTypes.object,
    shapeOptions: React.PropTypes.object,
    style: React.PropTypes.object,
    className: React.PropTypes.string,
    children: React.PropTypes.node,
    initialPosition: React.PropTypes.object,
    initialAngle: React.PropTypes.number,
    draggable: React.PropTypes.bool,
    ignoreRotation: React.PropTypes.bool,
    ignoreTranslation: React.PropTypes.bool,
    tolerance: React.PropTypes.number,
    willChange: React.PropTypes.array,
    _step: React.PropTypes.number,
    _onStartControl: React.PropTypes.func,
    _onEndControl: React.PropTypes.func,
    _onControl: React.PropTypes.func,
    _world: React.PropTypes.object,
  }

  static defaultProps = {
    element: <div />,
    initialPosition: {
      x: 0,
      y: 0,
    },
    initialAngle: 0,
    tolerance: 2,
    willChange: [],
  }

  constructor(props) {
    super(props);
    const {bodyOptions, initialPosition, initialAngle} = props;
    this._body = new p2.Body(Object.assign({}, this.getInferedMass(), bodyOptions));
    if (initialPosition) {
      this._body.position = [initialPosition.x, initialPosition.y];
    }
    if (initialAngle) {
      this._body.angle = initialAngle;
    }
    this._shape = this.getP2Shape();
    this._body.addShape(this._shape);
    this.state = {dragging: false};
    this._position = this._body.position;
    this._angle = this._body.angle;

    props._world.addBody(this._body);
  }

  componentWillReceiveProps = (nextProps) => {
    const {bodyOptions = {}, shapeOptions = {}} = nextProps;
    Object.keys(bodyOptions).forEach(k => {
      if (k === 'position' || k === 'angle') { return; }
      this._body[k] = nextProps.bodyOptions[k];
    });
    Object.keys(shapeOptions).forEach(k => {
      this._shape[k] = nextProps.shapeOptions[k];
    });
  }

  shouldComponentUpdate = (nextProps) => {
    const {ignoreRotation, ignoreTranslation, tolerance, willChange} = nextProps;
    if (!ignoreRotation && this._body.angle.toFixed(tolerance) !== this._angle.toFixed(tolerance)) {
      return true;
    }
    if (!ignoreTranslation && (
      this._body.position[0].toFixed(tolerance) !== this._position[0].toFixed(tolerance) ||
      this._body.position[1].toFixed(tolerance) !== this._position[1].toFixed(tolerance)
    )) {
      return true;
    }

    return willChange.some(field => nextProps[field] !== this.props[field]);
  }

  componentWillUnmount = () => {
    this.props._world.removeBody(this._body);
  }

  getP2Body = () => {
    return this._body;
  }

  render() {
    const {
      element,
      children,
      className,
      style,
      ignoreRotation,
      ignoreTranslation,
      ...rest,
    } = this.props;

    let angle = this._body.angle;
    let position = [this._body.position[0], this._body.position[1]];

    if (ignoreRotation) {
      angle = this._angle;
    } else {
      this._angle = angle;
    }
    if (ignoreTranslation) {
      position = this._position;
    } else {
      this._position = position;
    }
    const transform = {
      transform: `translate(
        calc(${position[0]}px - 50%),
        calc(${-position[1]}px - 50%))
        rotateZ(${-angle}rad)`,
    };
    return React.cloneElement(element, {
      className: 'p2-shape ' + (className || ''),
      style: Object.assign({}, shapeStyle, this.getShapeStyle(), transform, style),
      onTouchEnd: this._handleTouchEnd,
      onTouchMove: this._handleTouchMove,
      onTouchStart: this._handleTouchStart,
      children,
      ...rest,
    });
  }

  _handleTouchStart = (e) => {
    if (this.props.draggable) {
      const touch = e.changedTouches[0];
      this._startPoint = {
        id: touch.identifier,
      };
      this.setState({dragging: true});
      this.props._onStartControl(this._body, [
        touch.screenX,
        -touch.screenY,
      ]);
    }
  }

  _handleTouchEnd = (e) => {
    if (!this._startPoint) { return; }
    const touch = Array.from(e.changedTouches).find(t => t.identifier === this._startPoint.id);
    if (!touch) { return; }
    this._startPoint = null;
    this.setState({dragging: false});
    this.props._onEndControl();
  }

  _handleTouchMove = (e) => {
    if (this.state.dragging) {
      if (!this._startPoint) { return; }
      const touch = Array.from(e.changedTouches).find(t =>
        t.identifier === this._startPoint.id);
      if (!touch) { return; }
      this.props._onControl([
        touch.screenX,
        -touch.screenY,
      ]);
    }
  }
};
