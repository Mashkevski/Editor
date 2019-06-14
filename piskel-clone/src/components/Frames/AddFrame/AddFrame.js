import React from 'react';
import style from './AddFrame.module.css';

const addFrame = (props) => (
  <button
    className={style.AddFrame}
    onClick={props.addFrame}>
    {props.children}
  </button>
);

export default addFrame;
