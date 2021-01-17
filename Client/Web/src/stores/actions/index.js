/** index.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * File that combines all actions from redux
 */

export const login = (user, keepSession = false) => {
  return {
    type: 'LOGIN',
    payload: {...user, keepSession},
  }
}

export const logout = (user) => {
  return {
    type: 'LOGOUT',
    payload: user,
  }
}

export const update = (user) => {
  return {
    type: 'UPDATE',
    payload: user,
  }
}

export const changeUsername = (username) => {
  return {
    type: 'CHANGE-USERNAME',
    payload: username,
  }
}

export const changeEmail = (email) => {
  return {
    type: 'CHANGE-EMAIL',
    payload: email,
  }
}
