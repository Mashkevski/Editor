import React from 'react';
import propTypes from 'prop-types';
import style from './Button.module.css';

const button = ({ onClick, buttonName, disabled }) => (
  <button
    className={style.Button}
    onClick={onClick}
    type="button"
    disabled={disabled}
    data-action={buttonName}
  >
    {buttonName}
  </button>
);


export default button;

button.propTypes = {
  buttonName: propTypes.string.isRequired,
  onClick: propTypes.func.isRequired,
  disabled: propTypes.bool.isRequired,
};
