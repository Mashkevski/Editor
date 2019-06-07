import React from 'react';
import style from './Tool.module.css';

const tool = (props) => (
  <button
    className = {props.isActive ? style.ActiveTool : style.Tool}
    data-action={props.action}>
    {props.children}
  </button>
);

export default tool;
