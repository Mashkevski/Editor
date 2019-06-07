import React from 'react';

import style from './Tools.module.css';
import Tool from './Tool/Tool';

const tools = ( props ) => {
  const tools = props.toolsActions.map((tool, i) =>
    <li key={i}><Tool isActive={i === props.activeIndex} action={tool}>{tool}</Tool></li>)
  return (
    <ul className={style.Tools} onClick={props.onToolHandler}>
      {tools}
    </ul>
  )
};

export default tools;
