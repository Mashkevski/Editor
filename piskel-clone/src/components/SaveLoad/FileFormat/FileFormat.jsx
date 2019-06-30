import React from 'react';
import propTypes from 'prop-types';
import saveActionsMap from '../../../actions/saveActions';
import style from './FileFormat.module.css';

const fileFormat = ({ fileFormatHandler, format }) => {
  const formatButtonList = Object.keys(saveActionsMap).map(name => (
    <label
      key={name}
      htmlFor={name}
      className={style.Radio}
    >
      <input
        id={name}
        name="fileFormat"
        type="radio"
        value={name}
        onClick={fileFormatHandler}
        defaultChecked={name === format}
      />
      {name}
    </label>
  ));
  return (
    <div>
      {formatButtonList}
    </div>
  );
};

export default fileFormat;

fileFormat.propTypes = {
  fileFormatHandler: propTypes.func.isRequired,
  format: propTypes.string.isRequired,
};
