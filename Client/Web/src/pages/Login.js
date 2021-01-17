/** Login.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * Login page for the site
 */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form } from 'semantic-ui-react';

import checkNested from '../utils/checkNested';
import { useForm } from '../utils/hooks';
import authService from '../services/authService';
import { login } from '../stores/actions';

const Login = (props) => {
  const AuthService = new authService();
  const dispatch = useDispatch();

  // States
  const [errors, setErrors] = useState({});      // Error state

  // State for the whole form
  const loginForm = useForm(loginCallback, {
    username: '',
    password: '',
    keepSession: false,
  });

  function loginCallback() {
    AuthService.login(loginForm.values, loginForm.setLoading, {
      update(res) {
        dispatch(login(res.data, loginForm.values.keepSession));
        props.history.push("/home");
      },
      onError(err) {
        if (checkNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
        console.log(err);
      }
    });
  }

  return (
    <div className="form-centered">
      <Form onSubmit={loginForm.onSubmit} noValidate className={loginForm.loading ? "loading" : ''}>
        <h1>Login</h1>
        <Form.Input
          label="Username or email"
          placeholder="Username/Email.."
          name="username"
          type="text"
          value={loginForm.values.username}
          error={errors.username ? true : false}
          onChange={loginForm.onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password..."
          name="password"
          type="password"
          value={loginForm.values.password}
          error={errors.password ? true : false}
          onChange={loginForm.onChange}
        />
        <Form.Checkbox
          label='Keep me logged in'
          name='keepSession'
          checked={loginForm.values.keepSession}
          onChange={loginForm.onChange}
        />
        <Button type="submit" primary>
          Login
        </Button>
        <a href='/reset'>I forgot my password</a>
      </Form>
      <a href='/register'>Sign up</a>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map(value => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Login
