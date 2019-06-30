import React from 'react';
import propTypes from 'prop-types';
import style from './Tool.module.css';

const tool = ({
  isActive, action, onEnter,
  onClick, onLeave,
}) => (
  <button
    type="button"
    className={[isActive ? style.ActiveTool : style.Tool, style[action]].join(' ')}
    data-action={action}
    onMouseEnter={onEnter}
    onMouseLeave={onLeave}
    onClick={onClick}
  />
);

export default tool;

tool.propTypes = {
  isActive: propTypes.bool.isRequired,
  action: propTypes.string.isRequired,
  onEnter: propTypes.func.isRequired,
  onLeave: propTypes.func.isRequired,
  onClick: propTypes.func.isRequired,
};
