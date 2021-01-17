/** store.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * File that initiates the redux store
 */
import { createStore } from 'redux';
import RootReducers from './reducers/index';

const store = createStore(
  RootReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;