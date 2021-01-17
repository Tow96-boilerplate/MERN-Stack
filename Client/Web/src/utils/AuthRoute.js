/** AuthRoute.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * Route component that redirects to home page if an auth token is present
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = ({ component: Component, ...rest }) => {
  const { token } = useSelector(state => state.refresh);
  return (
    <Route
      {...rest}
      render={props => token ? <Redirect to="/home" /> : <Component {...props} />}
    />
  )
}

export default AuthRoute;
