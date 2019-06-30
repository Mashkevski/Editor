import React from 'react';
import propTypes from 'prop-types';
import style from './ErrorMessage.module.css';
import Modal from '../Modal/Modal';

const errorMessage = ({ error, modalClosed }) => (
  <Modal
    show
    modalClosed={modalClosed}
  >
    <div>
      <header className={style.Header}>
        <h2>Something went wrong...</h2>
        <button type="button" onClick={modalClosed}>X</button>
      </header>
      <p>{error}</p>
    </div>
  </Modal>
);

export default errorMessage;

errorMessage.propTypes = {
  modalClosed: propTypes.func.isRequired,
  error: propTypes.string.isRequired,
};
