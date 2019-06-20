import React from 'react';
import propTypes from 'prop-types';
import style from './Layer.module.css';

const layer = ({
  isActive, name, onClick,
  index,
}) => (
  <button
    type="button"
    className={isActive ? style.ActiveLayer : style.Layer}
    onClick={onClick}
    data-index={index}
    value={name}
  >
    {name}
  </button>
);

export default layer;

layer.propTypes = {
  isActive: propTypes.bool.isRequired,
  index: propTypes.number.isRequired,
  name: propTypes.string.isRequired,
  onClick: propTypes.func.isRequired,
};
