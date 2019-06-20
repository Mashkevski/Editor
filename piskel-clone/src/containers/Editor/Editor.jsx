
import React, { Component } from 'react';
import Layout from '../../components/Layout/Layout';
import Canvas from '../../components/Canvas/Canvas';
import {
  toolActionMap, getPixelPosition, drawCanvas,
} from '../toolAction';
import * as onFrameDrag from '../dragAndDrop';
import buttonActionMap from '../layerButtonActions';

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fps: 5,
      scale: 32,
      width: '800',
      height: '800',
      backgroundColor: '#00000000',
      secondaryColor: '#00000000',
      primaryColor: '#c21f1f',
      currentAction: 'pen',
      activeFrameIndex: 0,
      framesKeys: [],
      startCoord: { x: 0, y: 0 },
      frames: [new Array(1024).fill('#00000000')],
      currentLayerIndex: 0,
      currentLayerName: 'Layer 1',
      layers: [],
      coordinatesArray: [],
      selectedPixels: [],
      copiedPixels: [],
      isPixelsSelected: false,
      layersNumber: 1,
      canvas: null,
      mainCanvas: React.createRef(),
    };
  }

  componentDidMount() {
    const { layers } = this.state;
    const newLayers = layers.slice();
    newLayers[0] = {
      name: 'Layer 1',
      frames: [],
      framesKeys: [],
    };

    this.setState({ layers: newLayers });

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
    const canvas = evt.target;
    const { state } = this;
    const {
      scale, currentAction, frames,
      activeFrameIndex,
    } = state;
    const startPixels = [];
    const pixels = frames[activeFrameIndex].slice();
    let coord = getPixelPosition(evt, scale);
    let result = null;
    const startCoord = { ...{}, ...coord };
    let prevCoord = { ...{}, ...coord };
    result = toolActionMap[currentAction]({ startCoord, coord, prevCoord }, state,
      { canvas, pixels, startPixels }, { shiftKey: evt.shiftKey, ctrlKey: evt.ctrlKey });
    if (result.drawnPixels) {
      result.drawnPixels.forEach(({ x, y, color }) => {
        pixels[y * scale + x] = color;
      });
    }
    if (result.isNextAction) {
      const onMove = (e) => {
        if (e.buttons === 0) {
          canvas.removeEventListener('mousemove', onMove);
        } else {
          coord = getPixelPosition(e, scale);
          if (coord.x === prevCoord.x && coord.y === prevCoord.y) return;
          result = toolActionMap[currentAction]({ startCoord, coord, prevCoord },
            state, { canvas, pixels, startPixels }, { shiftKey: e.shiftKey, ctrlKey: e.ctrlKey });
          prevCoord = { ...{}, ...coord };
          if (result.drawnPixels) {
            result.drawnPixels.forEach(({ x, y, color }) => {
              pixels[y * scale + x] = color;
            });
          }
        }
      };
      canvas.addEventListener('mousemove', onMove);
    }
    const onMouseUp = () => {
      this.mouseUp(pixels, result, canvas);
      document.removeEventListener('mouseup', onMouseUp);
    };
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
            const { selectedPixels } = this.state;
            this.setState({ copiedPixels: selectedPixels });
          }
          if (e.key === 'v' && isCtrlDown === true) {
            const {
              copiedPixels, frames, activeFrameIndex,
              scale, mainCanvas,
            } = this.state;
            if (!copiedPixels.length) return;
            const newFrames = frames.slice();
            copiedPixels.forEach((pixel) => {
              const { x, y, color } = pixel;
              newFrames[activeFrameIndex][y * scale + x] = color;
            });
            drawCanvas(mainCanvas.current.canvas, copiedPixels, scale);
            this.setState({ frames: newFrames });
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
    frames[frames.length] = new Array(scale ** 2).fill('#00000000');
    framesKeys.push(Math.random());
    this.setState({
      frames,
      activeFrameIndex: frames.length - 1,
      framesKeys,
    });
  }

  // eslint-disable-next-line no-unused-vars
  mouseUp(pixels, { coordinatesArray, isSelectFunction, selectedColor }, canvas) {
    const { currentAction, backgroundColor } = this.state;
    const { frames, activeFrameIndex, scale } = this.state;
    const newFrames = frames.slice();
    let newPixels = null;
    if (selectedColor) {
      this.setState({ primaryColor: selectedColor });
      return;
    }
    if (isSelectFunction) {
      const selectedPixels = coordinatesArray.map((pixel) => {
        const { x, y } = pixel;
        return { x, y, color: pixels[y * scale + x] };
      });
      this.setState({ selectedPixels, isPixelsSelected: true });
      const onClick = (evt) => {
        const { target } = evt;
        if (target === canvas) return;
        this.setState({ isPixelsSelected: false });
        document.removeEventListener('mousedown', onClick);
      };
      document.addEventListener('mousedown', onClick);
      return;
    }
    if (coordinatesArray) {
      if (currentAction === 'move') {
        newPixels = new Array(scale ** 2).fill(backgroundColor);
      } else newPixels = pixels.slice();
      coordinatesArray.forEach((pixel) => {
        const { x, y, color } = pixel;
        newPixels[y * scale + x] = color;
      });
    }
    newFrames[activeFrameIndex] = newPixels || pixels;
    this.setState({
      frames: newFrames,
    });
  }

  keyDownHandler() {
    console.log(this.state);
    console.log('key');
  }

  layerHandler(evt) {
    const { target } = evt;
    const {
      layers, frames, currentLayerIndex,
      framesKeys, currentLayerName,
    } = this.state;
    let { index } = target.dataset;
    index = +index;
    if (index === currentLayerIndex) return;
    const newLayers = layers.slice();
    newLayers[currentLayerIndex] = {
      name: currentLayerName,
      frames: frames.slice(),
      framesKeys: framesKeys.slice(),
    };

    this.setState({
      layers: newLayers.slice(),
      frames: layers[index].frames.slice(),
      currentLayerIndex: index,
      currentLayerName: target.value,
      framesKeys: layers[index].framesKeys.slice(),
      activeFrameIndex: 0,
    });
  }

  buttonHandler(evt) {
    const { target } = evt;
    const { action } = target.dataset;
    const { state } = this;
    const actions = buttonActionMap[action](state);
    if (actions) {
      const { newLayers, currentLayerIndex, currentLayerName } = actions;
      this.setState({
        layers: newLayers.slice(),
        frames: newLayers[currentLayerIndex].frames.slice(),
        framesKeys: newLayers[currentLayerIndex].framesKeys.slice(),
        currentLayerIndex,
        activeFrameIndex: 0,
        currentLayerName,
        layersNumber: action === 'Add' ? state.layersNumber + 1 : state.layersNumber,
      });
    }
  }

  render() {
    const {
      framesKeys, currentAction, primaryColor,
      secondaryColor, isCanvasClear, frames,
      activeFrameIndex, scale, width,
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
        buttonActions={Object.keys(buttonActionMap)}
        onColorSelect={e => this.onColorSelect(e)}
        onColorRevert={e => this.onColorRevert(e)}
        toolHandler={e => this.toolHandler(e)}
        addFrame={() => this.addFrameHandler()}
        layerHandler={e => this.layerHandler(e)}
        buttonHandler={e => this.buttonHandler(e)}
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
