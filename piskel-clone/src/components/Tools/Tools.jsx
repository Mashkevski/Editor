import React from 'react';
import propTypes from 'prop-types';
import style from './Tools.module.css';
import Tool from './Tool/Tool';
import Tip from './Tip/Tip';

const tools = ({
  toolsActions, currentTool, toolHandler,
  nameTipTool, onEnter, onLeave,
  toolInfo,
}) => {
  const toolsList = toolsActions.map(tool => (
    <li
      className={style.ToolContainer}
      key={Math.random()}
    >
      <Tool
        isActive={tool === currentTool}
        action={tool}
        onClick={toolHandler}
        onEnter={onEnter}
        onLeave={onLeave}
      />
      <Tip
        action={tool}
        isShow={tool === nameTipTool}
        toolInfo={toolInfo}
      />
    </li>
  ));
  return (
    <ul
      className={style.Tools}
    >
      {toolsList}
    </ul>
  );
};

export default tools;

tools.propTypes = {
  toolsActions: propTypes.arrayOf(propTypes.string).isRequired,
  toolInfo: propTypes.arrayOf(propTypes.object),
  currentTool: propTypes.string.isRequired,
  toolHandler: propTypes.func.isRequired,
  nameTipTool: propTypes.string.isRequired,
  onEnter: propTypes.func.isRequired,
  onLeave: propTypes.func.isRequired,
};

tools.defaultProps = {
  toolInfo: null,
};
