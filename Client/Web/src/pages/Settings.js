/** Settings.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 * 
 * Settings page for the site
 */
import React, { useState } from 'react';
import { Grid, Menu } from 'semantic-ui-react';

import SettingsIndex from '../components/settings';

const Settings = () => {
  // Stores the current setting option
  const [activeSetting, setActiveSetting] = useState('account');

  // Changes the selecteed menu item
  const handleItemClick = (e, { name }) => setActiveSetting(name);

  return (
    <>
      <Grid columns={2}>
        <Grid.Column width={3}>
          <Menu vertical>
            <Menu.Item
              name='account'
              active={activeSetting === 'account'}
              onClick={handleItemClick}
            />
            <Menu.Item
              name='security'
              active={activeSetting === 'security'}
              onClick={handleItemClick}
            />
          </Menu>
        </Grid.Column>
        <Grid.Column width={13}>
          <div className="settings-container">
            { SettingsIndex(activeSetting) }
          </div>
        </Grid.Column>
      </Grid>
    </>
  )
}

export default Settings;
