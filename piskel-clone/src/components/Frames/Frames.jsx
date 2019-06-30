import React from 'react';
import propTypes from 'prop-types';
import style from './Frames.module.css';
import Frame from './Frame/Frame';

const frames = ({
  state, clickFrameHandler,
  onFrameDrag, framesKeys,
}) => {
  const framesList = state.frames.map((frame, i) => (
    <li
      role="menuitem"
      style={{ top: `${i * 110}px` }}
      key={`${framesKeys[i]}`}
      data-number={i}
      onMouseDown={onFrameDrag}
    >
      <Frame
        id={i}
        pixels={frame}
        scale={state.scale}
        clickFrameHandler={clickFrameHandler}
        isActive={i === state.activeFrameIndex}
      />
    </li>
  ));
  return (
    <ul
      className={style.Frames}
      style={{ height: `${framesList.length * 110 + 20}px` }}
    >
      {framesList}
    </ul>
  );
};

export default frames;

frames.propTypes = {
  state: propTypes.shape({
    scale: propTypes.number.isRequired,
    activeFrameIndex: propTypes.number.isRequired,
  }).isRequired,
  framesKeys: propTypes.arrayOf(propTypes.number).isRequired,
  clickFrameHandler: propTypes.func.isRequired,
  onFrameDrag: propTypes.func.isRequired,
};
