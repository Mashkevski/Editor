import React from 'react';
import style from './Logo.module.css';

const logo = (props) => (
  <h1 className={style.Logo}>{props.children}</h1>
);

export default logo;
