import React, { Component } from 'react';
import Layout from '../../components/Layout/Layout';

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 32,
    };
  }

  render() {
    return (
      <Layout>
      </Layout>
    );
  }
}

export default Editor;
