/* eslint-disable no-console */
import React from 'react';
import propTypes from 'prop-types';
import style from './Tip.module.css';

const tip = ({ isShow, action, toolInfo }) => {
  if (!toolInfo) return <p>Loading...</p>;
  const {
    text, shift, ctrl,
    key,
  } = toolInfo.find(item => item.name === action);
  const shiftText = shift ? (
    <p>
      <span className={style.Key}>SHIFT: </span>
      {shift}
    </p>
  ) : '';
  const ctrlText = ctrl ? (
    <p>
      <span className={style.Key}>CTRL: </span>
      {ctrl}
    </p>
  ) : '';
  return (
    <div
      className={isShow ? style.ActiveTip : style.Tip}
    >
      <p>
        {text}
        <span>{` (${key || '???'})`}</span>
      </p>
      {shiftText}
      {ctrlText}
    </div>
  );
};

export default tip;

tip.propTypes = {
  isShow: propTypes.bool.isRequired,
  toolInfo: propTypes.arrayOf(propTypes.object),
  action: propTypes.string.isRequired,
};

tip.defaultProps = {
  toolInfo: null,
};
