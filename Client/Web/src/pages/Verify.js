/** Verify.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 * 
 * Page that handles email verification
 */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';

import checkNested from '../utils/checkNested';
import authService from '../services/authService';
import { login } from '../stores/actions';

const Verify = (props) => {
  const AuthService = new authService();
  const dispatch = useDispatch();

  // Token for verification
  const { token } = useParams();

  // States
  const [onceLoad, setOnceLoad] = useState(null); // State used to only load things once
  const [errors, setErrors] = useState({});        // Error state
  const [loading, setLoading] = useState(false);   // Loading spinner

  useEffect(() => {
    if(!onceLoad) {
      verifyCallback();
    }
  });

  function verifyCallback() {
    AuthService.verifyMail(token, setLoading, {
      update(res) {
        dispatch(login(res.data));
        props.history.push("/home");
      },
      onError(err) {
        if (checkNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
        console.log(err);
      }
    });
    setOnceLoad(true);
  }

  return (
    <div className="form-container" >
      <Loader className={loading ? 'active' : ''} />
      {Object.keys(errors).length > 0 && (
        <>
          <h3>Error validating mail</h3>
          <div className="ui error message">
            <ul className="list">
              {Object.values(errors).map(value => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )

}

export default Verify;
