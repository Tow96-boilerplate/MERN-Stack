/** UnauthRoute.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * Route component that redirects to login page if no auth token
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const UnauthRoute = ({ component: Component, ...rest }) => {
  const { token } = useSelector(state => state.refresh);
  return (
    <Route
      {...rest}
      render={props => token ? <Component {...props} /> : <Redirect to="/login" />}
    />
  )
}

export default UnauthRoute;
