import React from 'react';
import propTypes from 'prop-types';
import style from './CheatSheet.module.css';

const cheatSheet = ({
  state, keyChangeHandler, modalClosed,
  setDefault,
}) => {
  if (!state.toolInfo) return <p>Loading...</p>;
  const keys = state.toolInfo.map(({ text, key, name }) => {
    const description = `${key || '???'} - ${text}`;
    return (
      <li key={name}>
        <button
          type="button"
          className={state.changedShortcut === name ? style.ActiveKey : style.styleKey}
          onClick={() => {
            keyChangeHandler(name);
          }}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div>
      <header className={style.Header}>
        <h2>Keyboard shortcuts</h2>
        <button type="button" onClick={modalClosed}>X</button>
      </header>
      <ul>
        {keys}
      </ul>
      <footer>
        <button type="button" onClick={setDefault}>Default</button>
      </footer>
    </div>
  );
};

export default cheatSheet;

cheatSheet.propTypes = {
  setDefault: propTypes.func.isRequired,
  keyChangeHandler: propTypes.func.isRequired,
  modalClosed: propTypes.func.isRequired,
  state: propTypes.shape({}).isRequired,
};
