import React, { Component } from 'react';
import Layout from '../../components/Layout/Layout';

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 32,
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

  render() {
    return (
      <Layout
        onToolHandler={e => this.onToolHandler(e)}>
      </Layout>
    );
  }
}

export default Editor;
