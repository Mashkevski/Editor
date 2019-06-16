import React from 'react';
import propTypes from 'prop-types';
import style from './Tool.module.css';

const tool = ({ isActive, action, children }) => (
  <button
    type="button"
    className={isActive ? style.ActiveTool : style.Tool}
    data-action={action}
  >
    {children}
  </button>
);

export default tool;

tool.propTypes = {
  isActive: propTypes.bool.isRequired,
  action: propTypes.string.isRequired,
  children: propTypes.string.isRequired,
};
