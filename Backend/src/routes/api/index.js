/** index.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * API Route index, holds all the routes for the API
 */
const express = require('express');

const { checkToken } = require('../../utils/checkAuth');
const user_routes = require('./user');
const team_routes = require('./team');
const passwordReset_routes = require('./reset');

const router = express.Router();

router.get('/', (_, res) => { res.status(200).send({message:'WELCOME TO API'})})

router.use('/user', checkToken, user_routes);

router.use('/reset', passwordReset_routes);

router.use('/team', team_routes);

module.exports = router;