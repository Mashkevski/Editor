import React from 'react';
import style from './ColorSelect.module.css';

const colorSelect = ({ colors, onSelect, onRevert }) => (
  <div className={style.ColorSelectWrapper}>
      <label
        className={style.Primary}
        style={{ backgroundColor: colors.primary }}>
        <input
          id='primary-color'
          type='color'
          defaultValue='#000001'
          data-input={'primaryColor'}
          onChange={onSelect}>
        </input>
      </label>
      <label
        className={style.Secondary}
        style={{ backgroundColor: colors.secondary }}>
        <input
          id='secondary-color'
          type='color'
          defaultValue='#000001'
          data-input={'secondaryColor'}
          onChange={onSelect}>
        </input>
      </label>
      <button data-action='revert'
        className={style.Revert}
        onClick={onRevert}>
          Revert
      </button>
  </div>
);

export default colorSelect;
