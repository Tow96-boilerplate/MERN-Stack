/** Register.js
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

const Register = (props) => {
  const AuthService = new authService();
  const dispatch = useDispatch();

  // States
  const [errors, setErrors] = useState({}); // Error State

  // State of the whole form
  const registerForm = useForm(registerCallback, {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  function registerCallback() {
    AuthService.register(registerForm.values, registerForm.setLoading, {
      update(res) {
        dispatch(login(res.data));
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
      <Form onSubmit={registerForm.onSubmit} noValidate className={registerForm.loading ? 'loading' : ''}>
        <h1>Register</h1>
        <Form.Input
          label="Username"
          placeholder="Username..."
          name="username"
          type="text"
          value={registerForm.values.username}
          error={errors.username ? true : false}
          onChange={registerForm.onChange}
        />
        <Form.Input
          label="Email"
          placeholder="Email..."
          name="email"
          type="text"
          value={registerForm.values.email}
          error={errors.email ? true : false}
          onChange={registerForm.onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password..."
          name="password"
          type="password"
          value={registerForm.values.password}
          error={errors.password ? true : false}
          onChange={registerForm.onChange}
        />
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm password..."
          name="confirmPassword"
          type="password"
          value={registerForm.values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={registerForm.onChange}
        />
        <Button type="submit" primary>
          Register
      </Button>
      </Form>
      <a href='/login'>Already have an account? Log In</a>
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

export default Register
