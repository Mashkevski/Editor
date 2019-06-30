/* global window */
import React, { Component } from 'react';
import loadApi from '../../actions/loadApi';
import style from './Auth.module.css';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      isInit: false,
      errorMessage: '',
    };
  }

  componentDidMount() {
    this.loadGoogleApi();
  }

  async loadGoogleApi() {
    try {
      const response = await loadApi();
      if (response === 'init') this.setState({ isInit: true });
    } catch (e) {
      this.setState({ errorMessage: e.message });
    }
  }

  signIn() {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signIn().then((googleUser) => {
      const profile = googleUser.getBasicProfile();
      this.setState({
        name: profile.getName(),
      });
    });
  }

  signOut() {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      this.setState({ name: '' });
    });
  }

  showErrorMessageHandler() {
    this.setState({ errorMessage: '' });
  }

  render() {
    const { name, isInit, errorMessage } = this.state;
    let error = null;
    if (errorMessage) {
      error = (
        <ErrorMessage
          error={errorMessage}
          modalClosed={() => this.showErrorMessageHandler()}
        />
      );
    }
    return (
      <div className={style.Auth}>
        <span className={style.Name}>{`${name}  `}</span>
        {!name && (
          <button type="button" disabled={!isInit} onClick={() => this.signIn()}>
            Log in
          </button>
        )}
        {!!name && <button type="button" onClick={() => this.signOut()}>Log out</button>}
        {error}
      </div>
    );
  }
}

export default Auth;
