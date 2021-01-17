/** apiService.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * Service that makes requests to the api 
 * All routes need update/onError functions so the logic for a success/error
 * can be set especifically for each individual request
 */
import axios from 'axios';
import jwtDecode from 'jwt-decode';

import store from '../stores/store';
import authService from './authService';
import { login } from '../stores/actions';

const ROOT_URL = 'http://localhost:3000'
const AuthService = new authService();

// Functions
/** getAuthToken
 * calls the authService to refresh the authentication token
 */
async function getAuthToken(config) {
  await AuthService.refresh({
    update(res) {
      store.dispatch(login(res.data));
      config.headers["x-auth-token"] = res.data.authToken;
    },
    // If the refreshing fails, throws an error
    onError(err) {
      throw err;
    }
  });
}


// Creates different axios instances so they have independent interceptors
const authInstance = axios.create({ timeout: 1000 });
// Outgoing interceptor
authInstance.interceptors.request.use(async function (config) {
  // Gets the active user
  const { auth } = store.getState();

  // If there is no authToken, gets a new one
  if (!auth.token) { await getAuthToken(config); }
  // If there is one, checks if it isn't expired
  else {
    const decodedToken = jwtDecode(auth.token);
    // If the authToken is expired, gets a newOne
    if (decodedToken.exp * 1000 < Date.now()) { await getAuthToken(config); }
    // If the authToken isn't expired, passes it as header
    else { config.headers["x-auth-token"] = auth.token; }
  }

  return config;

}, function (error) {
  console.log('api-request-error');
  return Promise.reject(error);
})

const noAuthInstance = axios.create({ timeout: 1000 });

// All functions require the passing of an "update" and "onError" functions so
// components can be re-rendererd accordingly
export default class apiService {
  API_URL = `${ROOT_URL}/api`;

  async test({ update, onError }) {
    try {
      const res = await authInstance.get(`${this.API_URL}/`);
      update(res);
    }
    catch (err) {
      onError(err);
    }
  };

  async changeEmail(payload, loading, { update, onError }) {
    if (loading) loading(true);
    try {
      const res = await authInstance.patch(`${this.API_URL}/user/email`, payload);
      if (loading) loading(false);
      update(res);
    }
    catch (err) {
      if (loading) loading(false);
      onError(err);
    }
  };

  async changeUsername(payload, loading, { update, onError }) {
    if (loading) loading(true);
    try {
      const res = await authInstance.patch(`${this.API_URL}/user/username`, payload);
      if (loading) loading(false);
      update(res);
    }
    catch (err) {
      if (loading) loading(false);
      onError(err);
    }
  };

  async changePassword(payload, loading, { update, onError }) {
    if (loading) loading(true);
    try {
      const res = await authInstance.patch(`${this.API_URL}/user/password`, payload);
      if (loading) loading(false);
      update(res);
    }
    catch (err) {
      if (loading) loading(false);
      onError(err);
    }
  }

  async deleteUser(loading, { update, onError }) {
    if (loading) loading(true);
    try {
      if (loading) loading(false);
      const res = await authInstance.delete(`${this.API_URL}/user`);
      update(res);
    }
    catch (err) {
      if (loading) loading(false);
      onError(err);
    }
  };

  // Sends the password reset email
  async passwordResetEmail(payload, loading, { update, onError }) {
    if (loading) loading(true);
    try {
      const res = await noAuthInstance.post(`${this.API_URL}/reset/`, payload);
      if (loading) loading(false);
      update(res);
    }
    catch (err) {
      if (loading) loading(false);
      onError(err);
    }
  };

  // Checks if the token is valid
  async passwordResetCheck(token, loading, { update, onError }) {
    try {
      const res = await noAuthInstance.get(`${this.API_URL}/reset/${token}`);
      if (loading) loading(false);
      update(res);
    }
    catch (err) {
      if (loading) loading(false);
      onError(err);
    }
  }

  // Sends a password reset request
  async passwordReset(token, payload, loading, { update, onError }) {
    if (loading) loading(true);
    try {
      const res = await noAuthInstance.post(`${this.API_URL}/reset/${token}`, payload);
      if (loading) loading(false);
      update(res);
    }
    catch (err) {
      if (loading) loading(false);
      onError(err);
    }
  }

  async resendVerificationEmail({ update, onError }) {
    try {
      const res = await authInstance.get(`${this.API_URL}/user/email`);
      update(res);
    }
    catch (err) { onError(err); }
  };
}
