/* eslint-disable no-console */
import React from 'react';
import propTypes from 'prop-types';
import style from './Buttons.module.css';
import Button from './Button/Button';

const buttons = ({ buttonActions, buttonHandler, state }) => {
  const buttonList = buttonActions.map((buttonName) => {
    const disabled = (state.currentLayerIndex === state.layers.length - 1
      && buttonName === 'Down')
      || (state.currentLayerIndex === 0 && buttonName === 'Up')
      || (state.layers.length === 1 && buttonName === 'Del');
    return (
      <li key={Math.random()}>
        <Button
          onClick={buttonHandler}
          buttonName={buttonName}
          disabled={disabled}
        />
      </li>
    );
  });
  return (
    <ul
      className={style.Buttons}
    >
      {buttonList}
    </ul>
  );
};

export default buttons;

buttons.propTypes = {
  buttonActions: propTypes.arrayOf(propTypes.string).isRequired,
  buttonHandler: propTypes.func.isRequired,
  state: propTypes.shape({
    currentLayerIndex: propTypes.number.isRequired,
    layers: propTypes.arrayOf(propTypes.object).isRequired,
  }).isRequired,
};
