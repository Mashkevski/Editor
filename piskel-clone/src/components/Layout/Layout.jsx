import React from 'react';
import propTypes from 'prop-types';
import Logo from '../Logo/Logo';
import Tools from '../Tools/Tools';
import style from './Layout.module.css';
import Frames from '../Frames/Frames';
import AddFrame from '../Frames/AddFrame/AddFrame';
import Preview from '../Preview/Preview';
import Layers from '../Layers/Layers';
import ColorSelect from '../ColorSelect/ColorSelect';
import Resize from '../Resize/Resize';


const layout = (props) => {
  const {
    currentTool, toolsActions, toolHandler,
    colors, onColorRevert, onColorSelect,
    framesKeys, onFrameDrag, state,
    clickFrameHandler, addFrame, children,
    onInputChange, resizeHandler, keyDownHandler,
    layerHandler, buttonHandler, buttonActions,
  } = props;
  return (
    <>
      <header className={style.Header}>
        <Logo>Piskel clone</Logo>
        navigation
      </header>
      <main className={style.Content}>
        <div className={style.ToolColumn}>
          <ul className={style.PenSize}>
            <li><button type="button" data-size="1">1</button></li>
            <li><button type="button" data-size="2">2</button></li>
            <li><button type="button" data-size="3">3</button></li>
            <li><button type="button" data-size="4">4</button></li>
          </ul>
          <Tools
            currentTool={currentTool}
            toolsActions={toolsActions}
            toolHandler={toolHandler}
            keyDownHandler={keyDownHandler}
          />
          <ColorSelect
            colors={colors}
            onRevert={onColorRevert}
            onSelect={onColorSelect}
          />
        </div>
        <div>
          <Frames
            framesKeys={framesKeys}
            onFrameDrag={onFrameDrag}
            state={state}
            clickFrameHandler={clickFrameHandler}
            keyDownHandler={keyDownHandler}
          />
          <AddFrame
            addFrameHandler={addFrame}
          >
            Add frame
          </AddFrame>
        </div>
        { children }
        <div>
          <Preview
            onInputChange={onInputChange}
            state={state}
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
};

export default layout;

layout.propTypes = {
  keyDownHandler: propTypes.func.isRequired,
  currentTool: propTypes.string.isRequired,
  buttonActions: propTypes.arrayOf(propTypes.string).isRequired,
  toolsActions: propTypes.arrayOf(propTypes.string).isRequired,
  toolHandler: propTypes.func.isRequired,
  colors: propTypes.shape({}).isRequired,
  onColorRevert: propTypes.func.isRequired,
  onColorSelect: propTypes.func.isRequired,
  framesKeys: propTypes.arrayOf(propTypes.number).isRequired,
  onFrameDrag: propTypes.func.isRequired,
  state: propTypes.shape({}).isRequired,
  clickFrameHandler: propTypes.func.isRequired,
  addFrame: propTypes.func.isRequired,
  children: propTypes.element.isRequired,
  onInputChange: propTypes.func.isRequired,
  onSave: propTypes.func.isRequired,
  onLoad: propTypes.func.isRequired,
  layerHandler: propTypes.func.isRequired,
  buttonHandler: propTypes.func.isRequired,
  resizeHandler: propTypes.func.isRequired,
};
