/* eslint-disable no-console */
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
      fps: 12,
      scale: 32,
      width: '800',
      height: '800',
      backgroundColor: '#ffffff00',
      secondaryColor: '#ffffff00',
      primaryColor: '#c21f1f',
      currentAction: 'draw',
      activeFrameIndex: 0,
      framesKeys: [],
      startCoord: { x: 0, y: 0 },
      startPixels: [],
      frames: [new Array(64).fill('#ffffff00')],
      currentLayerIndex: 0,
      currentLayerName: 'Layer 1',
      layers: [],
      coordinatesArray: [],
      selectedPixels: [],
      isPixelsSelected: false,
    };
  }

  componentDidMount() {
    const { layers } = this.state;
    layers[0] = {
      name: 'Layer 1',
      frames: [],
      framesKeys: [],
    };

    this.keyHandler();
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
    const {
      scale,
      currentAction,
      frames,
      activeFrameIndex,
    } = state;
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
        if (coord.x === prevCoord.x && coord.y === prevCoord.y) return;
        result = toolActionMap[currentAction]({ startCoord, coord, prevCoord },
          state, target, pixels);
        prevCoord = coord;
        if (result.drawnPixels) {
          pixels = result.drawnPixels.slice();
        }
      }
    };

    const onMouseUp = () => {
      this.mouseUp(pixels, result.coordinatesArray || null);
      document.removeEventListener('mouseup', onMouseUp);
    };

    target.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onMouseUp);
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

  onInputChange(evt) {
    this.setState({ fps: +evt.target.value });
  }

  clickFrameHandler({ target, id }) {
    if (target.dataset.action === 'del') {
      const { frames, activeFrameIndex, framesKeys } = this.state;
      if (frames.length <= 1) return;
      frames.splice(id, 1);
      framesKeys.pop();
      this.setState({
        frames,
        framesKeys,
        activeFrameIndex: (activeFrameIndex < id)
          || (activeFrameIndex === 0) ? activeFrameIndex : activeFrameIndex - 1,
      });
    } else if (target.dataset.action === 'copy') {
      const { frames, framesKeys } = this.state;
      frames.splice(id + 1, 0, frames[id].slice());
      framesKeys.push(Math.random());
      this.setState({
        frames,
        framesKeys,
        activeFrameIndex: id + 1,
      });
    } else {
      this.setState({ activeFrameIndex: id });
    }
  }

  toolHandler(evt) {
    const toolTarget = evt.target;
    if (toolTarget.tagName === 'BUTTON') {
      const currentAction = toolTarget.dataset.action;
      this.setState({ currentAction });
      document.body.className = `${this.currentAction}-cursor`;
    }
  }

  keyHandler() {
    let isCtrlDown = false;
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Control' && isCtrlDown === false) {
        isCtrlDown = true;
        const onCopySelection = (e) => {
          e.preventDefault();
          if (e.key === 'c' && isCtrlDown === true) {
            const { coordinatesArray, pixels, scale } = this.state;
            const copiedpixels = coordinatesArray.map((coord) => {
              const newCoord = {
                x: coord.x,
                y: coord.y,
                color: pixels[coord.y * scale + coord.x],
              };
              return newCoord;
            });
            this.setState({ selectedPixels: copiedpixels });
          }
          if (e.key === 'v' && isCtrlDown === true) {
            // console.log('ctrl + v');
          }
          if (e.key === 'Control' && isCtrlDown === true) {
            isCtrlDown = false;
            document.removeEventListener('keyup', onCopySelection);
          }
        };
        document.addEventListener('keyup', onCopySelection);
      }
    });
  }

  addFrameHandler() {
    const { frames, scale, framesKeys } = this.state;
    frames[frames.length] = new Array(scale ** 2).fill('#ffffff00');
    framesKeys.push(Math.random());
    this.setState({
      frames,
      activeFrameIndex: frames.length - 1,
      framesKeys,
    });
  }

  mouseUp(pixels, coords) {
    const { currentAction } = this.state;
    if (currentAction !== 'fillRectangle') {
      const { frames, activeFrameIndex } = this.state;
      this.setState({ [frames[activeFrameIndex]]: pixels.slice() });
    }
    if (coords) {
      this.setState({ coordinatesArray: coords.slice() },
        { isPixelsSelected: true });
    }
    this.setState((prevState) => {
      const { frames, activeFrameIndex } = prevState;
      frames[activeFrameIndex] = pixels.slice();
      return { frames };
    });
  }

  keyDownHandler() {
    console.log(this.state);
  }

  render() {
    const {
      framesKeys,
      currentAction,
      primaryColor,
      secondaryColor,
      isCanvasClear,
      frames,
      activeFrameIndex,
      scale,
      width,
      height,
    } = this.state;
    return (
      <Layout
        onSave={e => this.onSave(e)}
        onLoad={e => this.onLoad(e)}
        keyDownHandler={e => this.keyDownHandler(e)}
        onInputChange={e => this.onInputChange(e)}
        framesKeys={framesKeys}
        onFrameDrag={e => this.onFramesSwap(e)}
        state={this.state}
        drawFrame={this.drawFrame}
        clickFrameHandler={e => this.clickFrameHandler(e)}
        currentTool={currentAction}
        toolsActions={Object.keys(toolActionMap)}
        onColorSelect={e => this.onColorSelect(e)}
        onColorRevert={e => this.onColorRevert(e)}
        toolHandler={e => this.toolHandler(e)}
        addFrame={() => this.addFrameHandler()}
        colors={{
          primary: primaryColor,
          secondary: secondaryColor,
        }}
      >
        <Canvas
          isClear={isCanvasClear}
          pixels={frames[activeFrameIndex]}
          scale={scale}
          width={width}
          height={height}
          canvasStyle={{ height: '800px', width: '800px' }}
          onMouseDown={e => this.onMouseDown(e)}
        />
      </Layout>
    );
  }
}

export default Editor;
