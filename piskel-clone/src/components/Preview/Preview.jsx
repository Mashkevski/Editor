import React from 'react';
import propTypes from 'prop-types';
import style from './Preview.module.css';
import AnimatedCanvas from './AnimatedCanvas/AnimatedCanvas';

const preview = (props) => {
  const { state, onInputChange } = props;

  return (
    <div className={style.Preview}>
      <AnimatedCanvas
        state={state}
        canvasStyle={{ width: '200px', height: '200px' }}
        width="200"
        height="200"
      />
      <input
        onInput={onInputChange}
        defaultValue="12"
        type="range"
        min="1"
        max="24"
        step="1"
      />
      <span className={style.FpsCount}>{state.fps}</span>
    </div>
  );
};

export default preview;

preview.propTypes = {
  onInputChange: propTypes.func.isRequired,
  state: propTypes.shape({
    fps: propTypes.number.isRequired,
  }).isRequired,
};
