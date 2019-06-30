import React from 'react';
import propTypes from 'prop-types';
import FileFormat from './FileFormat/FileFormat';
import style from './SaveLoad.module.css';

const saveLoad = ({
  onSave, onLoad, fileFormatHandler,
  fileFormat,
}) => (
  <div className={style.Save}>
    <FileFormat
      fileFormatHandler={fileFormatHandler}
      format={fileFormat}
    />
    <button type="button" onClick={onSave}>Save</button>
    <button type="button" onClick={onLoad}>Load</button>
  </div>
);

export default saveLoad;

saveLoad.propTypes = {
  onSave: propTypes.func.isRequired,
  onLoad: propTypes.func.isRequired,
  fileFormatHandler: propTypes.func.isRequired,
  fileFormat: propTypes.string.isRequired,
};
