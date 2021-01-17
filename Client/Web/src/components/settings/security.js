/** Settings/Security.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 * 
 * Component that allows the user to change its security settings
 */
import React, { useState } from 'react';
import { Button, Divider, Form } from 'semantic-ui-react';

import { useForm } from '../../utils/hooks';
import apiService from '../../services/apiService';
import checkNested from '../../utils/checkNested';
import isAuthError from '../../utils/isAuthError';

const SettingsSecurity = () => {
  // Sets up the api connection
  const ApiService = new apiService();

  // States
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});

  // State of the change password form
  const changePasswordForm = useForm(changePasswordCallback, {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Callbacks
  function changePasswordCallback() {
    ApiService.changePassword(changePasswordForm.values, changePasswordForm.setLoading, {
      update(res) {
        // The password is not kept in redux, so theres no need to update anything
        setSuccess({ password: 'Password succesfully changed' });
        setErrors({});
      },
      onError(err) {
        if (isAuthError(err)) { return }
        if (checkNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
        console.log(err);
        setSuccess({});
      }
    });
  }

  return (
    <>
      {/* Success messages */}
      {Object.keys(success).length > 0 && (
        <div className="ui success message">
          <ul className="list">
            {Object.values(success).map(value => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
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
      <h3>Change password</h3>
      <Divider />
      <div className='form-container'>
        <Form onSubmit={changePasswordForm.onSubmit} noValidate className={changePasswordForm.loading ? "loading" : ''}>
          <Form.Input
            name='oldPassword'
            label='Old password'
            type='password'
            value={changePasswordForm.values.oldPassword}
            onChange={changePasswordForm.onChange}
            error={errors.oldPassword ? true : false}
          />
          <Form.Input
            name='newPassword'
            label='New password'
            type='password'
            value={changePasswordForm.values.newPassword}
            onChange={changePasswordForm.onChange}
            error={errors.newPassword ? true : false}
          />
          <Form.Input
            name='confirmPassword'
            label='Confirm new password'
            type='password'
            value={changePasswordForm.values.confirmPassword}
            onChange={changePasswordForm.onChange}
            error={errors.confirmPassword ? true : false}
          />
          <Button type='submit'>
            Update password
          </Button>
        </Form>
      </div>
    </>
  )
}

export default SettingsSecurity;
