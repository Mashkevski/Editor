/* global document, window */

import React, { Component } from 'react';
import Layout from '../../components/Layout/Layout';
import Canvas from '../../components/Canvas/Canvas';
import { toolActionMap, getPixelPosition, drawCanvas } from '../../actions/tools/toolAction';
import resizeFrames from '../../actions/resizeCanvas';
import onFrameDrag from '../../actions/dragAndDrop';
import buttonActionMap from '../../actions/layerbuttonActions';
import Modal from '../../components/Modal/Modal';
import CheatSheet from '../../components/CheatSheet/CheatSheet';
import toolInfo from './constant/toolInfo';
import saveActionMap from '../../actions/saveActions';
import loadFile from '../../actions/loadActions';
import { getUpdatedLayers } from '../../utils/utils';
import DEFAULT from './constant/constants';

class Editor extends Component {
  constructor(props) {
    super(props);
    this.mainCanvas = React.createRef();
    this.state = {
      fps: DEFAULT.fps,
      scale: DEFAULT.canvasScale,
      secondaryColor: DEFAULT.color.secondary,
      primaryColor: DEFAULT.color.primary,
      currentAction: DEFAULT.tool,
      activeFrameIndex: DEFAULT.activeFrameIndex,
      framesKeys: [],
      frames: [new Array(DEFAULT.canvasScale ** 2).fill(DEFAULT.color.background)],
      activeLayerIndex: DEFAULT.activeLayerIndex,
      layerName: DEFAULT.layerName,
      layers: [{
        name: DEFAULT.layerName,
        frames: [],
        framesKeys: [],
      }],
      selectedPixels: [],
      copiedPixels: [],
      isPixelsSelected: false,
      layersNumber: DEFAULT.layersNumber,
      canvas: null,
      isModalShow: false,
      changedShortcut: '',
      toolInfo: null,
      fileFormat: DEFAULT.fileFormat,
    };
  }

  componentDidMount() {
    const state = JSON.parse(window.localStorage.getItem('savedState'));
    if (state) {
      this.setState(state);
    }

    this.runOnKeys();
    this.toolInfoInit();
  }

  componentDidUpdate() {
    window.localStorage.setItem('savedState', JSON.stringify(this.state));
  }

  onColorRevert() {
    const { secondaryColor, primaryColor } = this.state;
    this.setState({
      primaryColor: secondaryColor,
      secondaryColor: primaryColor,
    });
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
    const startCoord = { ...coord };
    let prevCoord = { ...coord };
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
          prevCoord = { ...coord };
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
    onFrameDrag(evt, (firstFrameIndex, secondFrameIndex) => {
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

  onSave() {
    const { state } = this;
    saveActionMap[state.fileFormat](state);
  }

  async onLoad() {
    try {
      const { result, fileName } = await loadFile();
      if (fileName.endsWith('.own')) {
        const state = JSON.parse(result);
        if (state) {
          this.setState(state);
        }
      }
    } catch (e) {
      console.log('Load error ', e);
    }
  }

  toolInfoInit() {
    this.setState({ toolInfo: toolInfo.slice() });
  }

  runOnKeys() {
    document.addEventListener('keydown', (evt) => {
      const {
        selectedPixels, isPixelsSelected, copiedPixels,
        changedShortcut, isModalShow,
      } = this.state;
      const char = String.fromCharCode(evt.keyCode);
      if (evt.ctrlKey && char === 'R') {
        window.localStorage.clear();
        document.location.reload(true);
      } else if (changedShortcut && isModalShow) {
        this.setState(prevState => ({
          toolInfo: prevState.toolInfo.map((item) => {
            if (item.name === changedShortcut) {
              return { ...item, key: char };
            }
            if (item.key === char) {
              return { ...item, key: '' };
            }
            return { ...item };
          }),
          changedShortcut: '',
        }));
      } else if (evt.ctrlKey && char === 'C' && isPixelsSelected) {
        this.setState({ copiedPixels: selectedPixels });
      } else if (evt.ctrlKey && char === 'V' && copiedPixels.length) {
        const { frames, activeFrameIndex, scale } = this.state;
        const newFrames = frames.slice();
        copiedPixels.forEach((pixel) => {
          const { x, y, color } = pixel;
          newFrames[activeFrameIndex][y * scale + x] = color;
        });
        drawCanvas(this.mainCanvas.current.canvas, copiedPixels, scale);
        this.setState({ frames: newFrames });
      } else {
        const { state } = this;
        const tool = state.toolInfo.find(item => item.key === char);
        if (tool && state.currentAction !== tool.name) {
          this.setState({ currentAction: tool.name });
        }
      }
    });
  }

  clickFrameHandler({ target, id }) {
    const {
      frames, activeFrameIndex, framesKeys,
      layers,
    } = this.state;
    const { action } = target.dataset;

    if (frames.length <= 1 && action === 'del') return;

    const tempFrames = frames.slice();
    const tempFramesKeys = framesKeys.slice();

    if (action === 'del') {
      const tempLayers = layers.slice();
      tempFrames.splice(id, 1);
      tempFramesKeys.pop();
      tempLayers.forEach((layer) => {
        layer.frames.splice(id, 1);
        layer.framesKeys.pop();
      });

      this.setState({
        frames: tempFrames,
        framesKeys: tempFramesKeys,
        layers: tempLayers,
        activeFrameIndex: (activeFrameIndex < id)
          || (activeFrameIndex === 0) ? activeFrameIndex : activeFrameIndex - 1,
      });
    } else if (action === 'copy') {
      tempFrames.splice(id + 1, 0, frames[id].slice());
      tempFramesKeys.push(Math.random());
      const updatedLayers = getUpdatedLayers(this.state);
      updatedLayers.forEach((layer) => {
        layer.frames.splice(id + 1, 0, layer.frames[id].slice());
        layer.framesKeys.push(Math.random());
      });
      this.setState({
        frames: tempFrames,
        framesKeys: tempFramesKeys,
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

  addFrameHandler() {
    const {
      frames, scale, framesKeys,
      layers,
    } = this.state;
    const tempFrames = frames.slice();
    const tempFramesKeys = framesKeys.slice();
    tempFrames.push(new Array(scale ** 2).fill(DEFAULT.color.background));
    tempFramesKeys.push(Math.random());
    const tempLayers = layers.slice();
    tempLayers.forEach((layer) => {
      layer.frames.push(new Array(scale ** 2).fill(DEFAULT.color.background));
      layer.framesKeys.push(Math.random());
    });
    this.setState({
      frames: tempFrames,
      activeFrameIndex: tempFrames.length - 1,
      framesKeys: tempFramesKeys,
      layers: tempLayers,
    });
  }

  showModalHandler() {
    const { isModalShow } = this.state;
    if (isModalShow) {
      this.setState({
        isModalShow: false,
        changedShortcut: '',
      });
    } else this.setState({ isModalShow: true });
  }

  mouseUp(pixels, { coordinatesArray, isSelectFunction, selectedColor }, canvas) {
    const { currentAction } = this.state;
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
        newPixels = new Array(scale ** 2).fill(DEFAULT.color.background);
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

  keyChangeHandler(name) {
    this.setState({ changedShortcut: name });
  }

  resizeHandler(evt) {
    const value = +evt.target.value;
    const { scale, frames, layers } = this.state;

    const resizedLayers = layers.map((layer) => {
      const resizedLayer = {
        name: layer.name,
        framesKeys: layer.framesKeys,
        frames: resizeFrames(layer.frames, scale, value),
      };
      return resizedLayer;
    });

    this.setState({
      frames: resizeFrames(frames, scale, value),
      scale: value,
      layers: resizedLayers,
    });
  }

  layerHandler(evt) {
    const { target } = evt;
    const {
      layers, frames, activeLayerIndex,
      framesKeys, layerName,
    } = this.state;
    let { index } = target.dataset;
    index = +index;
    if (index === activeLayerIndex) return;
    const newLayers = layers.slice();
    newLayers[activeLayerIndex] = {
      name: layerName,
      frames: frames.slice(),
      framesKeys: framesKeys.slice(),
    };

    this.setState({
      layers: newLayers.slice(),
      frames: layers[index].frames.slice(),
      activeLayerIndex: index,
      layerName: target.value,
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
      const { newLayers, activeLayerIndex, layerName } = actions;
      this.setState({
        layers: newLayers.slice(),
        frames: newLayers[activeLayerIndex].frames.slice(),
        framesKeys: newLayers[activeLayerIndex].framesKeys.slice(),
        activeLayerIndex,
        activeFrameIndex: 0,
        layerName,
        layersNumber: action === 'Add' ? state.layersNumber + 1 : state.layersNumber,
      });
    }
  }

  fileFormatHandler(evt) {
    const { value } = evt.target;
    this.setState({ fileFormat: value });
  }

  render() {
    const {
      framesKeys, currentAction, primaryColor,
      secondaryColor, frames, activeFrameIndex,
      scale, isPixelsSelected, isModalShow,
    } = this.state;
    return (
      <Layout
        fileFormatHandler={e => this.fileFormatHandler(e)}
        showModalHandler={e => this.showModalHandler(e)}
        onEnter={e => this.mouseEnterToolHandler(e)}
        onLeave={e => this.mouseLeaveToolHandler(e)}
        onSave={e => this.onSave(e)}
        onLoad={e => this.onLoad(e)}
        resizeHandler={e => this.resizeHandler(e)}
        keyDownHandler={e => this.keyDownHandler(e)}
        onInputChange={e => this.onInputChange(e)}
        framesKeys={framesKeys}
        onFrameDrag={e => this.onFramesSwap(e)}
        state={this.state}
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
          isCanvasMain
          ref={this.mainCanvas}
          isPixelsSelected={isPixelsSelected}
          pixels={frames[activeFrameIndex]}
          scale={scale}
          width={DEFAULT.mainCanvas.width}
          height={DEFAULT.mainCanvas.height}
          canvasStyle={{ height: DEFAULT.mainCanvas.height, width: DEFAULT.mainCanvas.width }}
          onMouseDown={e => this.onMouseDown(e)}
        />
        <Modal
          show={isModalShow}
          modalClosed={e => this.showModalHandler(e)}
        >
          <CheatSheet
            setDefault={() => this.toolInfoInit()}
            modalClosed={e => this.showModalHandler(e)}
            keyChangeHandler={key => this.keyChangeHandler(key)}
            state={this.state}
          />
        </Modal>
      </Layout>
    );
  }
}

export default Editor;
