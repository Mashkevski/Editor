import React, { Component } from 'react';
import propTypes from 'prop-types';
import style from './Canvas.module.css';
import { drawFullCanvas, getPixelPosition } from '../../actions/tools/toolAction';

class Canvas extends Component {
  componentDidMount() {
    const { pixels } = this.props;
    if (pixels) {
      this.clearCanvas();
      this.updateCanvas();
    }
  }

  componentDidUpdate() {
    const { pixels, isPixelsSelected } = this.props;
    if (pixels && !isPixelsSelected) {
      this.clearCanvas();
      this.updateCanvas();
    }
  }

  onCursorMove(e) {
    const { scale } = this.props;
    const { x, y } = getPixelPosition(e, scale);
    this.span.textContent = `${x}:${y}`;
  }

  onCursorLeave() {
    this.span.textContent = '';
  }

  clearCanvas() {
    const { canvas } = this;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.width);
  }

  updateCanvas() {
    const { pixels, scale } = this.props;
    drawFullCanvas(this.canvas, pixels, scale);
  }

  render() {
    const {
      canvasStyle, width, height,
      onMouseDown, scale, isCanvasMain,
    } = this.props;
    const size = `[${scale}x${scale}]`;
    let canvasComponent = null;
    if (isCanvasMain) {
      canvasComponent = (
        <div className={style.CanvasWrapper}>
          <canvas
            ref={(c) => { this.canvas = c; }}
            style={canvasStyle}
            width={width}
            height={height}
            onMouseDown={onMouseDown}
            onMouseMove={e => this.onCursorMove(e)}
            onMouseLeave={e => this.onCursorLeave(e)}
          />
          <div className={style.Info}>
            <span>{size}</span>
            <span ref={(c) => { this.span = c; }} />
          </div>
        </div>
      );
    } else {
      canvasComponent = (
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
    return canvasComponent;
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
  isPixelsSelected: propTypes.bool,
  onMouseDown: propTypes.func,
  isCanvasMain: propTypes.bool,
};

Canvas.defaultProps = {
  onMouseDown: undefined,
  isCanvasMain: undefined,
  isPixelsSelected: false,
};
