/** index.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * File that combines all reducers from redux
 */
import { combineReducers } from 'redux';

import authenticationReducer from './auth';
import refreshTokenReducer from './refreshToken';

const RootReducers = combineReducers({
  auth: authenticationReducer,
  refresh: refreshTokenReducer,
});

export default RootReducers;