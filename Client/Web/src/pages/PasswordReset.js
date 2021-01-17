/** PasswordReset.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 * 
 * 
 * Page that handles password reset
 */
// Libraries
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form } from 'semantic-ui-react';

// Services
import apiService from '../services/apiService';

// Utilities
import { useForm } from '../utils/hooks';
import checkNested from '../utils/checkNested';

const PasswordReset = (props) => {
  const { token } = useParams();  // Gets the token from the url

  const ApiService = new apiService();

  // States
  const [onceLoad, setOnceLoad] = useState(false); // State used to only load things once
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // State for the email request
  const emailRequestForm = useForm(emailRequestCallback, {
    email: '',
  });

  // State for the newPasword request
  const resetPasswordForm = useForm(resetPasswordCallback, {
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (token && !onceLoad) {
      checkTokenCallback();
    }
  });

  // Callbacks
  function checkTokenCallback() {
    ApiService.passwordResetCheck(token, null, {
      update(res) {
        // Does nothing
      },
      onError(err) {
        if (checkNested(err, 'response', 'data', 'errors')) { setErrors(err.response.data.errors); }
        else { setErrors({ server: 'Unexpected error' }); }
        console.log(err);
        setSuccess(false);
      }
    });
    setOnceLoad(true);
  }

  function emailRequestCallback() {
    ApiService.passwordResetEmail(emailRequestForm.values, emailRequestForm.setLoading, {
      update(res) {
        setSuccess(true);
        setErrors({});
      },
      onError(err) {
        if (checkNested(err, 'response', 'data', 'errors')) { setErrors(err.response.data.errors); }
        else { setErrors({ server: 'Unexpected error' }); }
        console.log(err);
        setSuccess(false);
      }
    });
  }

  function resetPasswordCallback() {
    ApiService.passwordReset(token, resetPasswordForm.values, resetPasswordForm.setLoading, {
      update(res) {
        setSuccess(true);
        setErrors({});
      },
      onError(err) {
        if (checkNested(err, 'response', 'data', 'errors')) { setErrors(err.response.data.errors); }
        else { setErrors({ server: 'Unexpected error' }); }
        console.log(err);
        setSuccess(false);
      }
    });
  }

  let visibleForm;
  let visibleSuccess;

  if (token) {
    visibleForm = (
      <>
        {!errors.resetPassword && (
          <Form onSubmit={resetPasswordForm.onSubmit} noValidate className={resetPasswordForm.loading ? 'loading' : ''}>
            <Form.Input
              name='newPassword'
              label='New password'
              type='password'
              value={resetPasswordForm.values.newPassword}
              onChange={resetPasswordForm.onChange}
              error={errors.password ? true : false}
            />
            <Form.Input
              name='confirmPassword'
              label='Confirm new password'
              type='password'
              value={resetPasswordForm.values.confirmPassword}
              onChange={resetPasswordForm.onChange}
              error={errors.confirmPassword ? true : false}
            />
            <Button type='submit' primary>
              Reset password
            </Button>
          </Form>
        )}
      </>
    )
    visibleSuccess = (
      <p>Password reset, you can now Login normally</p>
    )
  }
  else {
    visibleForm = (
      <Form onSubmit={emailRequestForm.onSubmit} noValidate className={emailRequestForm.loading ? "loading" : ''}>
        <Form.Input
          label="Email"
          placeholder="Email.."
          name="email"
          type="text"
          value={emailRequestForm.values.email}
          onChange={emailRequestForm.onChange}

          action={{
            content: 'Reset password',
            type: 'submit',
          }}
        />
      </Form>
    )

    visibleSuccess = (
      <p>If the email is registered here, it will receive a mail containing the steps</p>
    )
  }


  return (
    <div className="form-centered">
      <h1>Password Reset</h1>
      {!success && visibleForm}
      {success && visibleSuccess}
      {/* Error messages */}
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

export default PasswordReset;
