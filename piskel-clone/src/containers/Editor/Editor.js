/* eslint-disable react/no-unused-state */
/* global document */

import React, { Component } from 'react';
import Layout from '../../components/Layout/Layout';
import Canvas from '../../components/Canvas/Canvas';

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 4,
      backgroundColor: '#ffffff00',
      secondaryColor: '#ffffff00',
      primaryColor: '#c21f1f',
      currentAction: 'drawPixel',
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
