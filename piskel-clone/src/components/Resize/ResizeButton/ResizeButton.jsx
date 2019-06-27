import React from 'react';
import propTypes from 'prop-types';
import style from './ResizeButton.module.css';

const resizeButton = ({ resizeHandler, value, scale }) => (
  <label
    className={scale === +value ? style.ActiveResizeButton : style.ResizeButton}
    htmlFor={value}
  >
    <input
      id={value}
      name="size"
      value={value}
      type="radio"
      onChange={resizeHandler}
      checked={scale === +value}
    />
    {value}
  </label>
);

export default resizeButton;

resizeButton.propTypes = {
  resizeHandler: propTypes.func.isRequired,
  value: propTypes.string.isRequired,
  scale: propTypes.number.isRequired,
};
