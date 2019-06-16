import React from 'react';
import propTypes from 'prop-types';
import style from './Logo.module.css';

const logo = ({ children }) => (
  <h1 className={style.Logo}>{children}</h1>
);

export default logo;

logo.propTypes = {
  children: propTypes.string.isRequired,
};
