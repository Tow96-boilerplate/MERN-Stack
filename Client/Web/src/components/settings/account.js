/** Settings/profile.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 * 
 * Component that allows the user to change its account settings
 */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Divider, Form, Modal } from 'semantic-ui-react';

import { useForm } from '../../utils/hooks';
import { changeUsername, changeEmail, logout } from '../../stores/actions';
import apiService from '../../services/apiService';
import isAuthError from '../../utils/isAuthError';
import checkNested from '../../utils/checkNested';

const SettingsAccount = () => {
  // Sets up the api connection
  const ApiService = new apiService();
  const dispatch = useDispatch();

  // Fetch user from redux
  const { user } = useSelector(state => state.auth);

  // States
  const [reRender, setReRender] = useState(true);
  const [errors, setErrors] = useState({});                   // Error state
  const [success, setSuccess] = useState({});                 // Success message state
  const [showModal, setShowModal] = useState(false);          // Modal window

  // State for the change username form
  const changeUsernameForm = useForm(changeUsernameCallback, {
    username: user ? user.username : '',
  });

  // State for the email form
  const changeEmailForm = useForm(changeEmailCallback, {
    email: user ? user.email : '',
  });

  useEffect(() => {
    if (user !== null && reRender) {
      changeUsernameForm.values.username = user.username;
      changeEmailForm.values.email = user.email;
      setReRender(false);
    }
  }, [reRender, user, changeUsernameForm.values, changeEmailForm.values]);

  // Callbacks
  function changeEmailCallback() {
    ApiService.changeEmail(changeEmailForm.values, changeEmailForm.setLoading, {
      update(res) {
        dispatch(changeEmail(res.data.email));
        setSuccess({ email: 'Email successfully changed, check your mails to verify' });
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

  function changeUsernameCallback() {
    ApiService.changeUsername(changeUsernameForm.values, changeUsernameForm.setLoading, {
      update(res) {
        dispatch(changeUsername(res.data.username));
        setSuccess({ username: 'Username successfully changed' });
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

  function deleteAccountCallback() {
    setShowModal(false);
    ApiService.deleteUser(null, {
      update(res) {
        // Since the user was deleted, the session must be closed
        dispatch(logout());
      },
      onError(err) {
        if (isAuthError(err)) { return }
        if (checkNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
        console.log(err);
        setSuccess({});
      }
    });
  }

  function resendVerificationCallback() {
    ApiService.resendVerificationEmail({
      update(res) {
        setSuccess({ email: 'Verification email sent, check your mails' });
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
      {/*Change username*/}
      <h3>Change username</h3>
      <Divider />
      <div className='form-container'>
        <Form onSubmit={changeUsernameForm.onSubmit} noValidate>
          <Form.Input
            name="username"
            type="text"
            value={changeUsernameForm.values.username}
            onChange={changeUsernameForm.onChange}
            error={errors.username ? true : false}
            loading={changeUsernameForm.loading}
            disabled={changeUsernameForm.loading}

            action={{
              content: 'Change username',
              type: 'submit',
            }}
          />
        </Form>
      </div>
      {/*Email*/}
      <h3>Email</h3>
      <Divider />
      { user && !user.emailConfirmed && (
        <>
          <p>
            Email is not verified
            <Button onClick={() => resendVerificationCallback()} >
              Resend verification mail
            </Button>
          </p>
        </>
      )}
      <div className='form-container'>
        <Form onSubmit={changeEmailForm.onSubmit} noValidate>
          <Form.Input
            name="email"
            type="text"
            value={changeEmailForm.values.email}
            onChange={changeEmailForm.onChange}
            error={errors.email ? true : false}
            loading={changeEmailForm.loading}
            disabled={changeEmailForm.loading}

            action={{
              content: 'Change email',
              type: 'submit',
            }}
          />
        </Form>
      </div>
      {/*Delete account*/}
      <h3>Delete account</h3>
      <Divider />
      <p>INSERT ACCOUNT DELETION CONSEQUENCES</p>
      <p>This cannot be undone</p>
      <Button negative onClick={() => setShowModal(true)}>
        Delete account
      </Button>
      <Modal
        size='tiny'
        open={showModal}
        onClose={() => setShowModal(false)}
      >
        <Modal.Header>Delete account</Modal.Header>
        <Modal.Content>
          <p>INSERT ACCOUNT DELETION CONSEQUENCES</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setShowModal(false)}>
            No
          </Button>
          <Button negative onClick={() => deleteAccountCallback()}>
            Delete
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}

export default SettingsAccount;
