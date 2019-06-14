import React, { Component } from 'react';
import style from './Canvas.module.css';
import { drawCanvas } from '../../containers/Editor/toolAction';

class Canvas extends Component {
  componentDidMount() {
    if(this.props.pixels) {
      this.clearCanvas();
      this.updateCanvas();
    }
  }

  componentDidUpdate() {
    if(this.props.pixels) {
      this.clearCanvas();
      this.updateCanvas();
    }
  }

  updateCanvas() {
    const { pixels, scale } = this.props;
    drawCanvas(this.refs.canvas, pixels, scale);
  }

  clearCanvas() {
    const { canvas } = this.refs;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.width);
  }

  render() {
    return (
      <div className={style.CanvasWrapper}>
        <canvas
          ref='canvas'
          style={this.props.style}
          width={this.props.width}
          height={this.props.height}
          onMouseDown={this.props.onMouseDown}/>
      </div>
    );
  }
}

export default Canvas;
