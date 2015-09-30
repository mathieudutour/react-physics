const React = require('react');
const p2 = require('p2');

const fixedTimeStep = 1 / 60;
const maxSubSteps = 10;

const World = React.createClass({
  propTypes: {
    style: React.PropTypes.object,
    className: React.PropTypes.string,
    children: React.PropTypes.node,
    boundToElement: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      step: 0,
    };
  },

  componentWillMount() {
    this._bodies = {};
  },

  componentDidMount() {
    const {children, className, style, boundToElement, ...rest} = this.props;
    this._world = new p2.World({
      ...rest,
    });

    this._world.defaultContactMaterial.restitution = 0.6;

    React.Children.forEach(children, (child) => {
      const body = this.refs[child.key].getP2Body();
      this._world.addBody(body);
      this._bodies[child.key] = body;
    });

    this._initBounds();
    if (boundToElement) {
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

  componentDidUpdate() {
    const {children, ...rest} = this.props;
    const prevBodies = this._bodies;
    const bodies = {};

    React.Children.forEach(children, (child) => {
      const body = this.refs[child.key].getP2Body();
      if (Object.keys(prevBodies).indexOf(child.key) === -1) {
        this._world.addBody(body);
      }
      bodies[child.key] = body;
    });

    Object.keys(prevBodies)
      .filter(x => Object.keys(bodies).indexOf(x) === -1)
      .forEach(removedChild => {
        this._world.removeBody(prevBodies[removedChild]);
      });

    this._bodies = bodies;
  },

  componentWillUnmount() {
    cancelAnimationFrame(this._request);
  },

  render() {
    const {children, className = '', style, ...rest} = this.props;
    return (
      <div className={'p2-world ' + className} style={style} ref={'container'}>
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, {
            ref: child.key,
            pos: this._bodies[child.key] &&
                  this._bodies[child.key].position,
            angle: this._bodies[child.key] &&
                  this._bodies[child.key].angle,
            onStartControl: () => {
              this._oldMass = this._bodies[child.key].mass;
              this._bodies[child.key].mass = 0;
              this._bodies[child.key].type = p2.Body.STATIC;
              this._bodies[child.key].velocity = [0, 0];
            },
            onEndControl: () => {
              this._bodies[child.key].mass = this._oldMass;
              this._bodies[child.key].type = p2.Body.DYNAMIC;
            },
            onControl: (pos) => {
              this._bodies[child.key].position = pos;
              this._bodies[child.key].velocity = [0, 0];
            },
          });
        })}
      </div>
    );
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
