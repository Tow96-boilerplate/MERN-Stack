/** Settings/index.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 * 
 * Component that swithces the settings view
 */

import React from 'react';

import Security from './security';
import Account from './account';

const SettingsIndex = (page) => { 
  switch (page) {
    case 'security':
      return <Security />
    case 'account':
      return <Account />
    default:
      return <h1>Not Found</h1>
  }
}

export default SettingsIndex;
