/** index.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * Main file for the Web-client
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import reportWebVitals from './reportWebVitals';

import authService from './services/authService';
import store from './stores/store';
import { login } from './stores/actions';

// Logs in if possible
if (sessionStorage.getItem('refToken')) {
  async function tryToLogin() {
    const AuthService = new authService();
    await AuthService.refresh({
      update(res) { store.dispatch(login(res.data)) },
      onError(err) { console.log(err) }
    });
  }
  tryToLogin();
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
