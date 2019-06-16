import React from 'react';
import propTypes from 'prop-types';
import style from './Tools.module.css';
import Tool from './Tool/Tool';

const tools = ({
  toolsActions, currentTool,
  keyDownHandler, toolHandler,
}) => {
  const toolsList = toolsActions.map(tool => (
    <li key={Math.random()}>
      <Tool
        isActive={tool === currentTool}
        action={tool}
      >
        {tool}
      </Tool>
    </li>
  ));
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <ul
      className={style.Tools}
      onClick={toolHandler}
      onKeyDown={keyDownHandler}
    >
      {toolsList}
    </ul>
  );
};

export default tools;

tools.propTypes = {
  keyDownHandler: propTypes.func.isRequired,
  toolsActions: propTypes.arrayOf(propTypes.string).isRequired,
  currentTool: propTypes.string.isRequired,
  toolHandler: propTypes.func.isRequired,
};
