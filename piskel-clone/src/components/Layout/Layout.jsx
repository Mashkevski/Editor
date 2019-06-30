/* eslint-disable no-console */
import React, { Component } from 'react';
import propTypes from 'prop-types';
import Logo from '../Logo/Logo';
import Tools from '../Tools/Tools';
import style from './Layout.module.css';
import Frames from '../Frames/Frames';
import AddFrame from '../Frames/AddFrame/AddFrame';
import Preview from '../Preview/Preview';
import Layers from '../Layers/Layers';
import ColorSelect from '../ColorSelect/ColorSelect';
import SaveLoad from '../SaveLoad/SaveLoad';
import Resize from '../Resize/Resize';
import Auth from '../../containers/Auth/Auth';

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameTipTool: '',
    };
  }

  mouseEnterToolHandler(evt) {
    if (evt.buttons) return;
    const { target } = evt;
    const { action } = target.dataset;
    this.setState({ nameTipTool: action });
  }

  mouseLeaveToolHandler() {
    this.setState({ nameTipTool: '' });
  }

  render() {
    const {
      currentTool, toolsActions, toolHandler,
      colors, onColorRevert, onColorSelect,
      framesKeys, onFrameDrag, state,
      clickFrameHandler, addFrame, children,
      onInputChange, onSave, onLoad,
      resizeHandler, showModalHandler, fileFormatHandler,
      layerHandler, buttonHandler, buttonActions,
    } = this.props;
    const { nameTipTool } = this.state;
    return (
      <>
        <header className={style.Header}>
          <Logo>Piskel clone</Logo>
          <Auth />
        </header>
        <main className={style.Content}>
          <div
            className={style.ToolColumn}
          >
            <Tools
              currentTool={currentTool}
              toolsActions={toolsActions}
              toolHandler={toolHandler}
              nameTipTool={nameTipTool}
              onEnter={e => this.mouseEnterToolHandler(e)}
              onLeave={() => this.mouseLeaveToolHandler()}
              toolInfo={state.toolInfo}
            />
            <ColorSelect
              colors={colors}
              onRevert={onColorRevert}
              onSelect={onColorSelect}
            />
            <button type="button" onClick={showModalHandler}>Shortcuts</button>
          </div>
          <div className={style.FramesColumn}>
            <Frames
              framesKeys={framesKeys}
              onFrameDrag={onFrameDrag}
              state={state}
              clickFrameHandler={clickFrameHandler}
            />
            <AddFrame
              addFrameHandler={addFrame}
            >
              Add frame
            </AddFrame>
          </div>
          { children }
          <div className={style.RightColomn}>
            <Preview
              onInputChange={onInputChange}
              state={state}
            />
            <SaveLoad
              onSave={onSave}
              onLoad={onLoad}
              fileFormatHandler={fileFormatHandler}
              fileFormat={state.fileFormat}
            />
            <Resize
              resizeHandler={resizeHandler}
              scale={state.scale}
            />
            <Layers
              layerHandler={layerHandler}
              buttonHandler={buttonHandler}
              buttonActions={buttonActions}
              state={state}
            />
          </div>
        </main>
      </>
    );
  }
}

export default Layout;

Layout.propTypes = {
  currentTool: propTypes.string.isRequired,
  resizeHandler: propTypes.func.isRequired,
  buttonActions: propTypes.arrayOf(propTypes.string).isRequired,
  toolsActions: propTypes.arrayOf(propTypes.string).isRequired,
  toolHandler: propTypes.func.isRequired,
  colors: propTypes.shape({}).isRequired,
  onColorRevert: propTypes.func.isRequired,
  onColorSelect: propTypes.func.isRequired,
  framesKeys: propTypes.arrayOf(propTypes.number).isRequired,
  onFrameDrag: propTypes.func.isRequired,
  state: propTypes.shape({
    currentTool: propTypes.string,
  }).isRequired,
  clickFrameHandler: propTypes.func.isRequired,
  addFrame: propTypes.func.isRequired,
  children: propTypes.arrayOf(propTypes.element).isRequired,
  onInputChange: propTypes.func.isRequired,
  onSave: propTypes.func.isRequired,
  onLoad: propTypes.func.isRequired,
  layerHandler: propTypes.func.isRequired,
  buttonHandler: propTypes.func.isRequired,
  showModalHandler: propTypes.func.isRequired,
  fileFormatHandler: propTypes.func.isRequired,
};
