/** Menubar.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * MenuBar for the site
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, Menu } from 'semantic-ui-react';

import authService from '../services/authService';
import { logout } from '../stores/actions';

function MenuBar() {
  const AuthService = new authService();
  const dispatch = useDispatch();

  const { user } = useSelector(state => state.auth);

  const pathname = window.location.pathname;
  const path = pathname === '/' ? 'root' : pathname.substr(1);

  // Stores the current path
  const [activeItem, setActiveItem] = useState(path);

  // Changes the selected menu item
  const handleItemClick = (e, { name }) => setActiveItem(name);

  // Logout button callback
  async function logoutCallback() {
    setActiveItem(null);
    await AuthService.logout();
    dispatch(logout());
    //props.history.push('/');
  }

  const menuBar = user ? (
    // MenuBar if logged in
    <Menu inverted >
      <Menu.Item
        name='home'
        onClick={handleItemClick}
        as={Link}
        to='/home'
      >
        {/*Set logo as button */}
        H
      </Menu.Item>
      <Menu.Menu position='right'>
        <Menu.Item
          name='settings'
          active={activeItem === 'settings'}
          onClick={handleItemClick}
          as={Link}
          to='settings'
        >
          <Icon name='setting' />
        </Menu.Item>
        <Menu.Item
          name='logout'
          onClick={logoutCallback}
        />
      </Menu.Menu>
    </Menu>
  ) : (
      // MenuBar if logged out
      <Menu inverted >
        <Menu.Item
          name='Scouting App'
          onClick={handleItemClick}
          as={Link}
          to='/'
        />
        <Menu.Menu position='right'>
          <Menu.Item
            name='login'
            active={activeItem === 'login'}
            onClick={handleItemClick}
            as={Link}
            to='/login'
          />
          <Menu.Item
            name='register'
            active={activeItem === 'register'}
            onClick={handleItemClick}
            as={Link}
            to='/register'
          />
        </Menu.Menu>
      </Menu>
    );

  return menuBar;
}

export default MenuBar;
