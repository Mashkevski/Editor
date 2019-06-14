/* eslint-disable react/no-unused-state */
/* global document */

import React, { Component } from 'react';
import Layout from '../../components/Layout/Layout';
import Canvas from '../../components/Canvas/Canvas';
import { toolActionMap, getPixelPosition, drawCanvas } from '../toolAction';
import * as onFrameDrag from '../dragAndDrop';


class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 16,
      backgroundColor: '#ffffff00',
      secondaryColor: '#ffffff00',
      primaryColor: '#c21f1f',
      currentAction: 'draw',
      activeFrameIndex: 0,
      frames: [],
      framesKeys: [],
      startCoord: {x: 0, y: 0},
      startPixels: [],
      coordinatesArray: [],
      selectedPixels: [],
      isPixelsSelected: false,
    };
  }

  componentDidMount () {
    this.setState({
      frames: [new Array(256).fill('#ffffff00')],
      framesKeys: [1],
    });
  };

  onToolHandler(evt) {
    const toolTarget = evt.target;
    if (toolTarget.tagName === 'BUTTON') {
      const currentAction = toolTarget.dataset.action;
      this.setState({ currentAction: currentAction });
      document.body.className = `${this.currentAction}-cursor`;
    }
  }

  onColorRevert() {
    const { secondaryColor, primaryColor } = this.state;
    this.setState({ primaryColor: secondaryColor });
    this.setState({ secondaryColor: primaryColor });
  }

  onColorSelect(evt) {
    const { dataset, value } = evt.target;
    this.setState({ [dataset.input]: value });
  }

  onMouseDown(evt) {
    const { target } = evt;
    const { state } = this;
    const { scale, currentAction, frames, activeFrameIndex } = state;
    if (state.isPixelsSelected && currentAction === 'fillRectangle') {
      const ctx = target.getContext('2d');
      ctx.clearRect(0, 0, target.width, target.width);
      drawCanvas(target, state.pixels, scale);
      this.setState({ isPixelsSelected: false });
      return;
    }
    this.setState({ startPixels: frames[activeFrameIndex].slice() });
    let pixels = frames[activeFrameIndex].slice();
    let coord = getPixelPosition(evt, scale);
    let result = null;
    const startCoord = coord;
    let prevCoord = coord;
    result = toolActionMap[currentAction]({ startCoord, coord, prevCoord }, state, target, pixels);
    const onMove = (moveEvent) => {
      if (moveEvent.buttons === 0) {
        target.removeEventListener('mousemove', onMove);
      } else {
        coord = getPixelPosition(moveEvent, scale);
        if (coord.x === prevCoord.x
          && coord.y === prevCoord.y) return;
          result = toolActionMap[currentAction]({ startCoord, coord, prevCoord }, state, target, pixels);
          prevCoord = coord;
        if (result.drawnPixels)
          pixels = result.drawnPixels.slice();
      }
    };

    const onMouseUp = () => {
      this.mouseUp(pixels, result.coordinatesArray || null);
      document.removeEventListener('mouseup', onMouseUp);
    };

    target.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  mouseUp(pixels, coords) {
    if (this.state.currentAction !== 'fillRectangle') {
    };
    if (coords) {
      this.setState({ coordinatesArray: coords.slice() },
        { isPixelsSelected: true });
    };
    this.setState((prevState) => {
      const { frames, activeFrameIndex } = prevState;
      frames[activeFrameIndex] = pixels.slice();
      return { frames };
    });
  }

  addFrameHandler() {
    const { frames, scale, framesKeys } = this.state;
    frames[frames.length] = new Array(scale ** 2).fill('#ffffff00');
    framesKeys.push(Math.random());
    this.setState({
      frames ,
      activeFrameIndex: frames.length - 1,
      framesKeys,
    });
  }

  onFrameHandler({ target, id }) {
    if (target.dataset.action === 'del') {
      this.setState((prevState) => {
        const { frames, activeFrameIndex, framesKeys } = prevState;
        if (frames.length <= 1) return;
        frames.splice(id, 1);
        framesKeys.pop();
        return {
          frames,
          framesKeys,
          activeFrameIndex: (activeFrameIndex < id)
            || (activeFrameIndex === 0) ? activeFrameIndex : activeFrameIndex - 1,
        };
      });
    } else if (target.dataset.action === 'copy') {
      this.setState((prevState) => {
        const { frames, framesKeys } = prevState;
        frames.splice(id + 1, 0, frames[id].slice());
        framesKeys.push(Math.random());
        return {
          frames,
          framesKeys,
          activeFrameIndex: id + 1,
        };
      });
    } else {
      this.setState({ activeFrameIndex: id });
    }
  }

  onFramesSwap(evt) {
    onFrameDrag.default(evt, (firstFrameIndex, secondFrameIndex) => {
      const { frames, framesKeys } = this.state;

      const keys = framesKeys.slice();
      const tempKey = keys[firstFrameIndex];
      keys[firstFrameIndex] = keys[secondFrameIndex];
      keys[secondFrameIndex] = tempKey;

      const fr = frames.slice();
      const tempFrame = fr[firstFrameIndex].slice();
      fr[firstFrameIndex] = fr[secondFrameIndex].slice();
      fr[secondFrameIndex] = tempFrame.slice();

      this.setState({
        frames: fr,
        framesKeys: keys.slice(),
        activeFrameIndex: +secondFrameIndex,
      });
    });
  }

  render() {
    return (
      <Layout
        framesKeys={this.state.framesKeys}
        onFrameDrag={e => this.onFramesSwap(e)}
        state={this.state}
        drawFrame={this.drawFrame}
        onFrameHandler={(e) => this.onFrameHandler(e)}
        currentTool={this.state.currentAction}
        toolsActions={ Object.keys(toolActionMap) }
        onColorSelect={e => this.onColorSelect(e)}
        onColorRevert={e => this.onColorRevert(e)}
        onToolHandler={e => this.onToolHandler(e)}
        addFrame={() => this.addFrameHandler()}
        colors={{primary: this.state.primaryColor,
        secondary: this.state.secondaryColor}}>
        <Canvas
          isClear = {this.state.isCanvasClear}
          pixels={this.state.frames[this.state.activeFrameIndex]}
          scale={this.state.scale}
          width={'800'}
          height={'800'}
          style={{ height: '800px', width: '800px' }}
          onMouseDown={e => this.onMouseDown(e)} />
      </Layout>
    );
  }
}

export default Editor;
