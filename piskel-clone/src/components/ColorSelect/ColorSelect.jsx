import React from 'react';
import propTypes from 'prop-types';
import style from './ColorSelect.module.css';

const colorSelect = ({ colors, onSelect, onRevert }) => (
  <div className={style.ColorSelectWrapper}>
    <label
      htmlFor="primary-color"
      className={style.Primary}
      style={{ backgroundColor: colors.primary }}
    >
      <input
        id="primary-color"
        type="color"
        defaultValue="#000001"
        data-input="primaryColor"
        onChange={onSelect}
      />
    </label>
    <label
      htmlFor="secondary-color"
      className={style.Secondary}
      style={{ backgroundColor: colors.secondary }}
    >
      <input
        id="secondary-color"
        type="color"
        defaultValue="#000001"
        data-input="secondaryColor"
        onChange={onSelect}
      />
    </label>
    <button
      type="button"
      data-action="revert"
      className={style.Revert}
      onClick={onRevert}
    >
        Revert
    </button>
  </div>
);

export default colorSelect;

colorSelect.propTypes = {
  colors: propTypes.shape({
    primary: propTypes.string.isRequired,
    secondary: propTypes.string.isRequired,
  }).isRequired,
  onSelect: propTypes.func.isRequired,
  onRevert: propTypes.func.isRequired,
};
