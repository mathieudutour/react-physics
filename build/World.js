'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var React = require('react');
var p2 = require('p2');

var _require = require('./styles');

var worldStyle = _require.worldStyle;

var fixedTimeStep = 1 / 60;
var maxSubSteps = 10;

var World = React.createClass({
  displayName: 'World',

  propTypes: {
    element: React.PropTypes.node,
    style: React.PropTypes.object,
    className: React.PropTypes.string,
    children: React.PropTypes.node,
    boundToElement: React.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      element: React.createElement('div', null)
    };
  },

  getInitialState: function getInitialState() {
    return {
      step: 0
    };
  },

  componentWillMount: function componentWillMount() {
    this._nullBody = new p2.Body();
    this._mouseConstraint = null;

    var _props = this.props;
    var element = _props.element;
    var children = _props.children;
    var className = _props.className;
    var style = _props.style;
    var boundToElement = _props.boundToElement;

    var rest = _objectWithoutProperties(_props, ['element', 'children', 'className', 'style', 'boundToElement']);

    this._world = new p2.World(_extends({}, rest));

    this._world.defaultContactMaterial.restitution = 0.6;
  },

  componentDidMount: function componentDidMount() {
    var _this = this;

    this._initBounds();
    if (this.props.boundToElement) {
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

  componentWillUnmount: function componentWillUnmount() {
    cancelAnimationFrame(this._request);
  },

  render: function render() {
    var _this2 = this;

    var _props2 = this.props;
    var children = _props2.children;
    var _props2$className = _props2.className;
    var className = _props2$className === undefined ? '' : _props2$className;
    var style = _props2.style;
    var element = _props2.element;

    return React.cloneElement(element, {
      className: 'p2-world ' + className,
      style: _Object$assign({}, worldStyle, style),
      ref: 'container',
      children: React.Children.map(children, function (child) {
        return React.cloneElement(child, {
          _step: _this2.state.step,
          _world: _this2._world,
          _onStartControl: _this2._startControl,
          _onEndControl: _this2._endControl,
          _onControl: _this2._handleMove
        });
      })
    });
  },

  _startControl: function _startControl(b, physicsPosition) {
    b.wakeUp();
    this._world.addBody(this._nullBody);
    this._nullBody.position = physicsPosition;
    this._mouseConstraint = new p2.LockConstraint(this._nullBody, b);
    this._world.addConstraint(this._mouseConstraint);
  },

  _handleMove: function _handleMove(physicsPosition) {
    if (this._mouseConstraint) {
      p2.vec2.copy(this._nullBody.position, physicsPosition);
      this._mouseConstraint.bodyA.wakeUp();
      this._mouseConstraint.bodyB.wakeUp();
    }
  },

  _endControl: function _endControl() {
    if (this._mouseConstraint) {
      this._world.removeConstraint(this._mouseConstraint);
      this._mouseConstraint = null;
      this._world.removeBody(this._nullBody);
    }
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