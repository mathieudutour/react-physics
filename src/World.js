const React = require('react');
const p2 = require('p2');
const {worldStyle} = require('./styles');

const fixedTimeStep = 1 / 60;
const maxSubSteps = 10;

const World = React.createClass({
  propTypes: {
    element: React.PropTypes.node,
    style: React.PropTypes.object,
    className: React.PropTypes.string,
    children: React.PropTypes.node,
    boundToElement: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      element: <div />,
    };
  },

  getInitialState() {
    return {
      step: 0,
    };
  },

  componentWillMount() {
    this._nullBody = new p2.Body();
    this._mouseConstraint = null;

    const {element, children, className, style, boundToElement, ...rest} = this.props;
    this._world = new p2.World({
      ...rest,
    });

    this._world.defaultContactMaterial.restitution = 0.6;
  },

  componentDidMount() {
    this._initBounds();
    if (this.props.boundToElement) {
      this._world.addBody(this._topBound);
      this._world.addBody(this._leftBound);
      this._world.addBody(this._rightBound);
      this._world.addBody(this._bottomBound);
    }

    // Fixed timestepping with interpolation
    const _animate = (t) => {
      this._request = requestAnimationFrame(_animate);
      const timeSeconds = t / 1000;
      this._lastTimeSeconds = this._lastTimeSeconds || timeSeconds;

      const deltaTime = timeSeconds - this._lastTimeSeconds;
      this._world.step(fixedTimeStep, deltaTime, maxSubSteps);

      this.setState({step: this.state.step + 1});
    };

    // Start animation loop
    this._request = requestAnimationFrame(_animate);
  },

  componentWillUnmount() {
    cancelAnimationFrame(this._request);
  },

  render() {
    const {children, className = '', style, element} = this.props;
    return React.cloneElement(element, {
      className: 'p2-world ' + className,
      style: Object.assign({}, worldStyle, style),
      ref: 'container',
      children: React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          _step: this.state.step,
          _world: this._world,
          _onStartControl: this._startControl,
          _onEndControl: this._endControl,
          _onControl: this._handleMove,
        });
      }),
    });
  },

  _startControl(b, physicsPosition) {
    b.wakeUp();
    this._world.addBody(this._nullBody);
    this._nullBody.position = physicsPosition;
    this._mouseConstraint = new p2.LockConstraint(this._nullBody, b);
    this._world.addConstraint(this._mouseConstraint);
  },

  _handleMove(physicsPosition) {
    if (this._mouseConstraint) {
      p2.vec2.copy(this._nullBody.position, physicsPosition);
      this._mouseConstraint.bodyA.wakeUp();
      this._mouseConstraint.bodyB.wakeUp();
    }
  },

  _endControl() {
    if (this._mouseConstraint) {
      this._world.removeConstraint(this._mouseConstraint);
      this._mouseConstraint = null;
      this._world.removeBody(this._nullBody);
    }
  },

  _initBounds() {
    const container = this.refs.container.getDOMNode();
    this._topBound = new p2.Body({mass: 0, position: [0, 0], angle: Math.PI});
    this._leftBound = new p2.Body({
      mass: 0,
      position: [container.offsetWidth, 0],
      angle: Math.PI / 2,
    });
    this._rightBound = new p2.Body({
      mass: 0,
      position: [0, 0],
      angle: -Math.PI / 2,
    });
    this._bottomBound = new p2.Body({
      mass: 0,
      position: [0, -container.offsetHeight],
    });
    this._topBound.addShape(new p2.Plane());
    this._leftBound.addShape(new p2.Plane());
    this._rightBound.addShape(new p2.Plane());
    this._bottomBound.addShape(new p2.Plane());
  },
});

module.exports = World;
