import React from 'react';
import Logo from '../Logo/Logo';
// import Hoc from '../../hoc/Hoc';
import Tools from '../Tools/Tools';
import style from './Layout.module.css';
import Frames from '../Frames/Frames';
import AddFrame from '../Frames/AddFrame/AddFrame';
import Preview from '../Preview/Preview';
import Layers from '../Layers/Layers';
import ColorSelect from '../ColorSelect/ColorSelect';
import SaveLoad from '../SaveLoad/SaveLoad';

const layout = (props) => (
  <>
    <header className={ style.Header }>
      <Logo>Piskel clone</Logo>
      navigation
    </header>
    <main className={ style.Content }>
      <div className={ style.ToolColumn }>
        <ul className={ style.PenSize }>
          <li><button type="button" data-size="1">1</button></li>
          <li><button type="button" data-size="2">2</button></li>
          <li><button type="button" data-size="3">3</button></li>
          <li><button type="button" data-size="4">4</button></li>
        </ul>
        <Tools
          currentTool={ props.currentTool }
          toolsActions={ props.toolsActions }
          onToolHandler={ props.onToolHandler } />
        <ColorSelect
          colors={ props.colors }
          onRevert={ props.onColorRevert }
          onSelect={ props.onColorSelect } />
      </div>
      <div>
        <Frames
          framesKeys={ props.framesKeys }
          onFrameDrag={ props.onFrameDrag }
          state={ props.state }
          onFrameHandler={ props.onFrameHandler } />
        <AddFrame
          addFrame={ props.addFrame }>
          Add frame
        </AddFrame>
      </div>
      { props.children }
      <div>
        <Layers />
      </div>
    </main>
  </>
);

export default layout;
