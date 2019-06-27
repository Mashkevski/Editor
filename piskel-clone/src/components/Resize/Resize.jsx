import React from 'react';
import propTypes from 'prop-types';
import ResizeButton from './ResizeButton/ResizeButton';
import style from './Resize.module.css';

const resize = ({ resizeHandler, scale }) => (
  <div className={style.Resize}>
    <ResizeButton
      resizeHandler={resizeHandler}
      value="32"
      scale={scale}
    />
    <ResizeButton
      resizeHandler={resizeHandler}
      value="64"
      scale={scale}
    />
    <ResizeButton
      resizeHandler={resizeHandler}
      value="128"
      scale={scale}
    />
  </div>
);

export default resize;

resize.propTypes = {
  resizeHandler: propTypes.func.isRequired,
  scale: propTypes.number.isRequired,
};
