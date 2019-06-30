import React, { Component } from 'react';
import propTypes from 'prop-types';
import Backdrop from '../Backdrop/Backdrop';
import style from './Modal.module.css';

class Modal extends Component {
  shouldComponentUpdate({ show, children }) {
    const { props } = this;
    return show !== props.show || children !== props.children;
  }

  render() {
    const { props } = this;
    return (
      <>
        <Backdrop show={props.show} clicked={props.modalClosed} />
        <div
          className={props.show ? style.ShowModal : style.CloseModal}
        >
          {props.children}
        </div>
      </>
    );
  }
}

export default Modal;

Modal.propTypes = {
  show: propTypes.bool.isRequired,
  children: propTypes.element.isRequired,
};
