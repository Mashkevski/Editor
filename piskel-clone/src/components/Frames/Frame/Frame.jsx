import React from 'react';
import propTypes from 'prop-types';
import style from './Frame.module.css';
import Canvas from '../../Canvas/Canvas';

const frame = (props) => {
  const {
    id, isActive, clickFrameHandler,
    pixels, scale, keyDownHandler,
  } = props;
  return (
    <div
      role="menuitem"
      tabIndex={0}
      onKeyDown={keyDownHandler}
      key={id}
      className={isActive ? style.ActiveFrame : style.Frame}
      onClick={(e) => {
        clickFrameHandler({ target: e.target, id });
      }}
    >
      <Canvas
        pixels={pixels}
        scale={scale}
        canvasStyle={{ height: '100px', width: '100px' }}
        width="100"
        height="100"
      />
      <div className={style.Number}>{ id + 1 }</div>
      <button
        type="button"
        className={style.Delete}
        data-action="del"
      >
        del
      </button>
      <button
        type="button"
        className={style.Duplicate}
        data-action="copy"
      >
        copy
      </button>
    </div>
  );
};

export default frame;

frame.propTypes = {
  id: propTypes.number.isRequired,
  isActive: propTypes.bool.isRequired,
  clickFrameHandler: propTypes.func.isRequired,
  pixels: propTypes.arrayOf(propTypes.string).isRequired,
  scale: propTypes.number.isRequired,
  keyDownHandler: propTypes.func.isRequired,
};
