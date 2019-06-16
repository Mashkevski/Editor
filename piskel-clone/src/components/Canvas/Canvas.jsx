import React, { Component } from 'react';
import propTypes from 'prop-types';
import style from './Canvas.module.css';
import { drawCanvas } from '../../containers/toolAction';

class Canvas extends Component {
  componentDidMount() {
    const { pixels } = this.props;
    if (pixels) {
      this.clearCanvas();
      this.updateCanvas();
    }
  }

  componentDidUpdate() {
    const { pixels } = this.props;
    if (pixels) {
      this.clearCanvas();
      this.updateCanvas();
    }
  }

  updateCanvas() {
    const { pixels, scale } = this.props;
    drawCanvas(this.canvas, pixels, scale);
  }

  clearCanvas() {
    const { canvas } = this;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.width);
  }

  render() {
    const {
      canvasStyle,
      width,
      height,
      onMouseDown,
    } = this.props;
    return (
      <div className={style.CanvasWrapper}>
        <canvas
          ref={(c) => { this.canvas = c; }}
          style={canvasStyle}
          width={width}
          height={height}
          onMouseDown={onMouseDown}
        />
      </div>
    );
  }
}

export default Canvas;

Canvas.propTypes = {
  canvasStyle: propTypes.shape({
    width: propTypes.string.isRequired,
    height: propTypes.string.isRequired,
  }).isRequired,
  pixels: propTypes.arrayOf(propTypes.string).isRequired,
  scale: propTypes.number.isRequired,
  width: propTypes.string.isRequired,
  height: propTypes.string.isRequired,
  onMouseDown: propTypes.func,
};

Canvas.defaultProps = {
  onMouseDown: undefined,
};
