const React = require('react');
const p2 = require('p2');

module.exports = class Shape extends React.Component {
  propTypes = {
    bodyOptions: React.PropTypes.object,
    style: React.PropTypes.object,
    className: React.PropTypes.string,
    children: React.PropTypes.node,
    position: React.PropTypes.array,
    angle: React.PropTypes.array,
    draggable: React.PropTypes.bool,
    onStartControl: React.PropTypes.func,
    onEndControl: React.PropTypes.func,
    onControl: React.PropTypes.func,
  }

  constructor(props) {
    super(props);
    const {bodyOptions} = this.props;
    this._body = new p2.Body(bodyOptions);
    this._shape = this.getP2Shape();
    this._body.addShape(this._shape);
    this.state = {dragging: false};
  }

  getP2Body() {
    return this._body;
  }

  render() {
    const {children, className, style,
      pos = this._body.position, angle = this._body.angle} = this.props;
    const transform = {
      transform: `translate(
        calc(${pos[0]}px - 50%),
        calc(${-pos[1]}px - 50%))
      rotateZ(${-angle}rad) `,
    };
    return (
      <div className={'p2-shape ' + (className || '')}
        style={Object.assign(transform, style)}
        onTouchEnd={this._handleTouchEnd}
        onTouchMove={this._handleTouchMove}
        onTouchStart={this._handleTouchStart}>
        {children}
      </div>
    );
  }

  _handleTouchStart = (e) => {
    if (this.props.draggable) {
      this._startPoint = {
        posX: this._body.position[0],
        posY: this._body.position[1],
        x: e.changedTouches[0].screenX,
        y: e.changedTouches[0].screenY,
        id: e.changedTouches[0].identifier,
      };
      this.setState({dragging: true});
      this.props.onStartControl();
    }
  }

  _handleTouchEnd = (e) => {
    if (!this._startPoint) { return; }
    const touch = Array.from(e.changedTouches).find(t =>
      t.identifier === this._startPoint.id);
    if (!touch) { return; }
    this._startPoint = null;
    this.setState({dragging: false});
    this.props.onEndControl();
  }

  _handleTouchMove = (e) => {
    if (this.state.dragging) {
      if (!this._startPoint) { return; }
      const touch = Array.from(e.changedTouches).find(t =>
        t.identifier === this._startPoint.id);
      if (!touch) { return; }
      this.props.onControl([
        this._startPoint.posX + (touch.screenX - this._startPoint.x),
        this._startPoint.posY - (touch.screenY - this._startPoint.y),
      ]);
    }
  }
};
