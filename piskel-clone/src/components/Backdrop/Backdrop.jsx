import React from 'react';
import propTypes from 'prop-types';
import style from './Backdrop.module.css';

const backdrop = ({ show, clicked }) => (
  show ? <button type="button" className={style.Backdrop} onClick={clicked} /> : null
);

export default backdrop;

backdrop.propTypes = {
  clicked: propTypes.func.isRequired,
  show: propTypes.bool.isRequired,
};
