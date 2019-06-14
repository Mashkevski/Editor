import React from 'react';

import style from './Frames.module.css';
import Frame from './Frame/Frame';

const frames = ({ state,  onFrameHandler, onFrameDrag, framesKeys }) => {
  const frames = state.frames.map((frame, i) =>
    <li
      style={{ top: `${i * 110}px` }}
      key={ framesKeys[i] }
      data-number={ i }
      onMouseDown={ onFrameDrag }>
      <Frame
        id={ i }
        pixels={ frame }
        scale={ state.scale }
        onFrameHandler={ onFrameHandler }
        isActive={ i === state.activeFrameIndex } />
    </li>
  );
  return (
    <ul className={ style.Frames }
    style={{ height: `${ frames.length * 110 + 20 }px` }}>
      { frames }
    </ul>
  )
};

export default frames;
