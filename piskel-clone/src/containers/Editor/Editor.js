/* eslint-disable react/no-unused-state */
/* global document */

import React, { Component } from 'react';
import Layout from '../../components/Layout/Layout';
import Canvas from '../../components/Canvas/Canvas';
import { toolActionMap, getPixelPosition } from '../toolAction';


class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 4,
      backgroundColor: '#ffffff00',
      secondaryColor: '#ffffff00',
      primaryColor: '#c21f1f',
      currentAction: 'drawPixel',
      activeFrameIndex: 0,
      frames: [],
      pixels: new Array(16).fill('#ffffff00'),
      startCoord: {x: 0, y: 0},
      startPixels: [],
      coordinatesArray: [],
      selectedPixels: [],
    };
  }

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
    this.setState({ startPixels: state.pixels.slice() });
    let pixels = state.pixels.slice();
    const { scale, currentAction } = this.state;
    let coord = getPixelPosition(evt, scale);
    let result = null;
    const startCoord = {...coord};
    let prevCoord = coord;
    result = toolActionMap[currentAction]({ startCoord, coord }, state, target, pixels);
    const onMove = (moveEvent) => {
      if (moveEvent.buttons === 0) {
        target.removeEventListener('mousemove', onMove);
      } else {
        coord = getPixelPosition(moveEvent, scale);
        if (coord.x === prevCoord.x
          && coord.y === prevCoord.y) return;
          prevCoord = coord;
        result = toolActionMap[currentAction]({ startCoord, coord }, state, target, pixels);
        if (result.returnedPixels)
          pixels = result.returnedPixels.slice();
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
    const { activeFrame } = this.state;
    if (this.state.currentAction !== 'fillRectangle') {
      this.setState({ pixels: pixels.slice() });
    };
    if (coords) {
      this.setState({ coordinatesArray: coords.slice() });
    };
    this.setState((prevState) => {
      const { frames } = prevState;
      frames[activeFrame - 1] = pixels.slice();
      return { frames: prevState.frames };
    });
  }

  render() {
    return (
      <Layout
        onColorSelect={e => this.onColorSelect(e)}
        onColorRevert={e => this.onColorRevert(e)}
        onToolHandler={e => this.onToolHandler(e)}
        colors={{primary: this.state.primaryColor,
          secondary: this.state.secondaryColor}}>
        <Canvas style={{ height: '800px' }} onMouseDown={e => this.onMouseDown(e)} />
      </Layout>
    );
  }
}

export default Editor;
