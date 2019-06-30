/* global document, window */

const URL = 'https://apis.google.com/js/platform.js';

const loadScript = () => {
  const promise = new Promise((resolve, reject) => {
    const tag = document.createElement('script');
    tag.type = 'text/javascript';
    tag.async = true;

    const handleResult = state => () => {
      if (state === 'loaded') {
        resolve('loaded');
      } else if (state === 'error') {
        reject(new Error());
      }
    };

    tag.onload = handleResult('loaded');
    tag.onerror = handleResult('error');
    tag.onreadystatechange = () => {
      handleResult(tag.readyState);
    };
    tag.src = URL;
    document.body.appendChild(tag);
  });
  return promise;
};

const loadApi = () => {
  const promise = new Promise((resolve, reject) => {
    const onInit = () => {
      resolve('init');
    };
    const onError = () => {
      reject(new Error('Authentication error'));
    };

    loadScript()
      .then(() => {
        window.gapi.load('auth2', () => {
          window.gapi.auth2
            .init({
              client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            })
            .then(onInit, onError);
        });
      }).catch(() => {
        reject(new Error('Error loading scripts'));
      });
  });
  return promise;
};

export default loadApi;
