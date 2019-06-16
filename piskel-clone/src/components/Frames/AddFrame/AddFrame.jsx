import React from 'react';
import propTypes from 'prop-types';
import style from './AddFrame.module.css';

const addFrame = ({ addFrameHandler, children }) => (
  <button
    type="button"
    className={style.AddFrame}
    onClick={addFrameHandler}
  >
    {children}
  </button>
);

export default addFrame;

addFrame.propTypes = {
  addFrameHandler: propTypes.func.isRequired,
  children: propTypes.string.isRequired,
};
