/** authService.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * Service that makes requests to the authentication Server 
 * All routes need update/onError functions so the logic for a success/error
 * can be set especifically for each individual request
 */
import axios from 'axios';

import store from '../stores/store';
import { logout } from '../stores/actions';

// Creates an axios instance so the interceptors are unique to the service
const instance = axios.create({ timeout: 1000 });

// Outgoing interceptor
instance.interceptors.request.use(function (config) {
  // Adds the refresh-token
  const { refresh } = store.getState();
  if (refresh.token) { config.headers["x-refresh-token"] = refresh.token }
  return config;
}, function (error) {
  console.log('auth-request-error');
  return Promise.reject(error);
});

/*
axios.interceptors.response.use(function (config) {
  return config;
}, function (error) {
  console.log('error');
  return Promise.reject(error);
})*/

export default class authService {
  ROOT_URL = 'http://localhost:3000/auth'

  async register(payload, loading, { update, onError }) {
    if (loading) loading(true);
    try {
      const res = await instance.post(`${this.ROOT_URL}/register`, payload);
      if (loading) loading(false);
      update(res);
    }
    catch (err) {
      if (loading) loading(false);
      onError(err);
    }
  }

  async login(payload, loading, { update, onError }) {
    if (loading) loading(true);
    try {
      const res = await instance.post(`${this.ROOT_URL}/login`, payload);
      if (loading) loading(false);
      update(res);
    }
    catch (err) {
      if (loading) loading(false);
      onError(err);
    }
  };

  async refresh({ update, onError }) {
    try {
      const res = await instance.get(`${this.ROOT_URL}/token`);
      update(res);
    }
    catch (err) {
      store.dispatch(logout());
      onError(err);
    }
  };

  async logout() {
    try {
      await instance.delete(`${this.ROOT_URL}/logout`);
      console.log('logged out');
    }
    catch (err) { console.log(err); }
  };

  async verifyMail(token, loading, { update, onError }) {
    if (loading) loading(true);
    try {
      const res = await instance.patch(`${this.ROOT_URL}/verify/${token}`);
      if (loading) loading(false);
      update(res);
    }
    catch (err) {
      if (loading) loading(false);
      onError(err);
    }
  };
}