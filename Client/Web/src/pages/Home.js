/** Welcome.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * Home page for the site, default if logged in
 */
import React, { useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';

import apiService from '../services/apiService';
import isAuthError from '../utils/isAuthError';

const Home = () => {
  const ApiService = new apiService();

  const [test, setTest] = useState(null);

  useEffect(() => {
    if (!test) {
      ApiService.test({
        update(res) {
          setTest('success');
        },
        onError(err) {
          if (isAuthError(err)) { return }
          setTest('fail');
        }
      })
    }
  });

  function fetchCallback() {
    ApiService.test({
      update(res) {
        console.log('Correct');
      },
      onError(err) {
        console.log('Crap');
      }
    })
  }

  //const auth = useSelector(state => state.auth);
  return (
    <>
      <h1>Home</h1>
      <p>{test}</p>
      <Button primary onClick={() => fetchCallback()}>test</Button>
    </>
  )
}

export default Home;