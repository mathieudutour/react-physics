'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var React = require('react');
var p2 = require('p2');

var fixedTimeStep = 1 / 60;
var maxSubSteps = 10;

var World = React.createClass({
  displayName: 'World',

  propTypes: {
    style: React.PropTypes.object,
    className: React.PropTypes.string,
    children: React.PropTypes.node,
    boundToElement: React.PropTypes.bool
  },

  getInitialState: function getInitialState() {
    return {
      step: 0
    };
  },

  componentWillMount: function componentWillMount() {
    this._nullBody = new p2.Body();
    this._mouseConstraint = null;
    this._bodies = {};
  },

  componentDidMount: function componentDidMount() {
    var _this = this;

    var _props = this.props;
    var children = _props.children;
    var className = _props.className;
    var style = _props.style;
    var boundToElement = _props.boundToElement;

    var rest = _objectWithoutProperties(_props, ['children', 'className', 'style', 'boundToElement']);

    this._world = new p2.World(_extends({}, rest));

    this._world.defaultContactMaterial.restitution = 0.6;

    React.Children.forEach(children, function (child) {
      var body = _this.refs[child.key].getP2Body();
      _this._world.addBody(body);
      _this._bodies[child.key] = body;
    });

    this._initBounds();
    if (boundToElement) {
      this._world.addBody(this._topBound);
      this._world.addBody(this._leftBound);
      this._world.addBody(this._rightBound);
      this._world.addBody(this._bottomBound);
    }

    // Fixed timestepping with interpolation
    var _animate = function _animate(t) {
      _this._request = requestAnimationFrame(_animate);
      var timeSeconds = t / 1000;
      _this._lastTimeSeconds = _this._lastTimeSeconds || timeSeconds;

      var deltaTime = timeSeconds - _this._lastTimeSeconds;
      _this._world.step(fixedTimeStep, deltaTime, maxSubSteps);

      _this.setState({ step: _this.state.step + 1 });
    };

    // Start animation loop
    this._request = requestAnimationFrame(_animate);
  },

  componentDidUpdate: function componentDidUpdate() {
    var _this2 = this;

    var _props2 = this.props;
    var children = _props2.children;

    var rest = _objectWithoutProperties(_props2, ['children']);

    var prevBodies = this._bodies;
    var bodies = {};

    React.Children.forEach(children, function (child) {
      var body = _this2.refs[child.key].getP2Body();
      if (_Object$keys(prevBodies).indexOf(child.key) === -1) {
        _this2._world.addBody(body);
      }
      bodies[child.key] = body;
    });

    _Object$keys(prevBodies).filter(function (x) {
      return _Object$keys(bodies).indexOf(x) === -1;
    }).forEach(function (removedChild) {
      _this2._world.removeBody(prevBodies[removedChild]);
    });

    this._bodies = bodies;
  },

  componentWillUnmount: function componentWillUnmount() {
    cancelAnimationFrame(this._request);
  },

  render: function render() {
    var _this3 = this;

    var _props3 = this.props;
    var children = _props3.children;
    var _props3$className = _props3.className;
    var className = _props3$className === undefined ? '' : _props3$className;
    var style = _props3.style;

    var rest = _objectWithoutProperties(_props3, ['children', 'className', 'style']);

    return React.createElement(
      'div',
      { className: 'p2-world ' + className, style: style, ref: 'container' },
      React.Children.map(children, function (child) {
        return React.cloneElement(child, {
          ref: child.key,
          pos: _this3._bodies[child.key] && _this3._bodies[child.key].position,
          angle: _this3._bodies[child.key] && _this3._bodies[child.key].angle,
          onStartControl: function onStartControl(pos) {
            _this3._startControl(_this3._bodies[child.key], pos);
            // this._oldMass = this._bodies[child.key].mass;
            // this._bodies[child.key].mass = 0;
            // this._bodies[child.key].type = p2.Body.STATIC;
            // this._bodies[child.key].velocity = [0, 0];
          },
          onEndControl: function onEndControl() {
            _this3._endControl();
            // this._bodies[child.key].mass = this._oldMass;
            // this._bodies[child.key].type = p2.Body.DYNAMIC;
          },
          onControl: function onControl(pos) {
            _this3._handleMove(pos);
            // this._bodies[child.key].position = pos;
            // this._bodies[child.key].velocity = [0, 0];
          }
        });
      })
    );
  },

  _startControl: function _startControl(b, physicsPosition) {
    b.wakeUp();
    var localPoint = p2.vec2.create();
    b.toLocalFrame(localPoint, physicsPosition);
    this._world.addBody(this._nullBody);
    this._mouseConstraint = new p2.RevoluteConstraint(this._nullBody, b, {
      localPivotA: physicsPosition,
      localPivotB: localPoint
    });
    this._world.addConstraint(this._mouseConstraint);
  },

  _handleMove: function _handleMove(physicsPosition) {
    if (this._mouseConstraint) {
      p2.vec2.copy(this._mouseConstraint.pivotA, physicsPosition);
      this._mouseConstraint.bodyA.wakeUp();
      this._mouseConstraint.bodyB.wakeUp();
    }
  },

  _endControl: function _endControl() {
    this._world.removeConstraint(this._mouseConstraint);
    this._mouseConstraint = null;
    this._world.removeBody(this._nullBody);
  },

  _initBounds: function _initBounds() {
    var container = this.refs.container.getDOMNode();
    this._topBound = new p2.Body({ mass: 0, position: [0, 0], angle: Math.PI });
    this._leftBound = new p2.Body({
      mass: 0,
      position: [container.offsetWidth, 0],
      angle: Math.PI / 2
    });
    this._rightBound = new p2.Body({
      mass: 0,
      position: [0, 0],
      angle: -Math.PI / 2
    });
    this._bottomBound = new p2.Body({
      mass: 0,
      position: [0, -container.offsetHeight]
    });
    this._topBound.addShape(new p2.Plane());
    this._leftBound.addShape(new p2.Plane());
    this._rightBound.addShape(new p2.Plane());
    this._bottomBound.addShape(new p2.Plane());
  }
});

module.exports = World;