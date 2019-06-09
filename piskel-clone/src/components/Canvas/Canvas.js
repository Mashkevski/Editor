import React, { Component } from 'react';
import style from './Canvas.module.css';

class Canvas extends Component {
  render() {
    return (
      <div className={style.CanvasWrapper}>
        <canvas ref='canvas' style={this.props.style} width={800} height={800} onMouseDown={this.props.onMouseDown}/>
      </div>
    );
  }
}

export default Canvas;
