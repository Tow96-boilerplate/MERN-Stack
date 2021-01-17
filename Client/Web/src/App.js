/** App.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * Component that holds all pages and views
 */
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import MenuBar from './components/Menubar';
import AuthRoute from './utils/AuthRoute';
import UnauthRoute from './utils/UnauthRoute';

import NotFound from './components/Notfound';

import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Verify from './pages/Verify';
import Settings from './pages/Settings';
import PasswordReset from './pages/PasswordReset';

function App() {
  return (
    <Router>
      <Container >
        <MenuBar />
        <Switch>
          {/*Routes that can be accessed with or without credentials */}
          <Route exact path='/verify/:token' component={Verify} />
          <Route exact path='/reset' component={PasswordReset} />
          <Route exact path='/reset/:token' component={PasswordReset} />
          {/*Routes that can be accessed only without being logged in */}
          <AuthRoute exact path='/' component={Welcome} />
          <AuthRoute exact path='/login' component={Login} />
          <AuthRoute exact path='/register' component={Register} />
          {/*Routes that can be accessed only while being logged in */}
          <UnauthRoute exact path='/home' component={Home} />
          <UnauthRoute exact path='/settings' component={Settings} />
          {/* 404 - not found route */}
          <Route component={NotFound} />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
