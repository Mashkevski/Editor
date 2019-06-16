/* global window */

import React, { Component } from 'react';
import propTypes from 'prop-types';
import style from './AnimatedCanvas.module.css';
import { drawCanvas } from '../../../containers/toolAction';

class AnimatedCanvas extends Component {
  componentDidMount() {
    this.startLoop();
  }

  componentDidUpdate() {
    this.stopLoop();
    this.startLoop();
  }

  componentWillUnmount() {
    this.stopLoop();
  }

  startLoop() {
    if (!this.frameId) {
      const { state } = this.props;
      const { frames, scale, fps } = state;
      const { canvas } = this;
      const conf = {
        start: window.performance.now(),
        frames,
        scale,
        fps,
        canvas,
        i: 0,
      };
      this.frameId = window.requestAnimationFrame(this.loop.bind(this, conf));
    }
  }

  loop(conf, time) {
    const {
      frames,
      scale,
      fps,
      canvas,
    } = conf;
    let { start, i } = conf;

    const timeFraction = (time - start);
    if (timeFraction > 1000 / fps && i < frames.length) {
      const pixels = frames[i].slice();
      this.clearCanvas(canvas);
      drawCanvas(canvas, pixels, scale);
      start = time;
      i += 1;
    }
    if (i >= frames.length) i = 0;

    const nextConf = {
      start,
      frames,
      scale,
      fps,
      canvas,
      i,
    };
    this.frameId = window.requestAnimationFrame(this.loop.bind(this, nextConf));
  }

  stopLoop() {
    window.cancelAnimationFrame(this.frameId);
    this.frameId = null;
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
    } = this.props;
    return (
      <div className={style.CanvasWrapper}>
        <canvas
          ref={(c) => { this.canvas = c; }}
          style={canvasStyle}
          width={width}
          height={height}
          onDoubleClick={evt => evt.target.requestFullscreen()}
        />
      </div>
    );
  }
}

export default AnimatedCanvas;

AnimatedCanvas.propTypes = {
  canvasStyle: propTypes.shape({
    width: propTypes.string.isRequired,
    height: propTypes.string.isRequired,
  }).isRequired,

  state: propTypes.shape({
    frames: propTypes.array.isRequired,
    scale: propTypes.number.isRequired,
    fps: propTypes.number.isRequired,
  }).isRequired,

  width: propTypes.string.isRequired,
  height: propTypes.string.isRequired,
};
