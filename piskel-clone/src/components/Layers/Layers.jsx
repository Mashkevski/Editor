/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import React from 'react';
import propTypes from 'prop-types';
import style from './Layers.module.css';
import Layer from './Layer/Layer';
import Buttons from './Buttons/Buttons';

const layers = ({
  buttonActions,
  layerHandler, buttonHandler, state,
}) => {
  const layerList = state.layers.map((layer, i) => (
    <li key={Math.random()}>
      <Layer
        onClick={layerHandler}
        isActive={i === state.currentLayerIndex}
        name={layer.name}
        index={i}
        // action={buttonName}
      />
    </li>
  ));

  return (
    <div className={style.Layers}>
      <Buttons
        buttonActions={buttonActions}
        buttonHandler={buttonHandler}
        state={state}
      />
      <ul className={style.LayersList}>
        {layerList}
      </ul>
    </div>
  );
};

export default layers;

layers.propTypes = {
  buttonActions: propTypes.arrayOf(propTypes.string).isRequired,
  buttonHandler: propTypes.func.isRequired,
  layerHandler: propTypes.func.isRequired,
  state: propTypes.shape({
    currentLayerIndex: propTypes.number.isRequired,
    layers: propTypes.arrayOf(propTypes.object).isRequired,
  }).isRequired,
};
