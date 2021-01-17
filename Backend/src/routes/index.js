/** index.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * HTTP Route index, holds all the routes
 */
const express = require('express');

const api = require('./api/index');
const authentication = require('./authentication/index');


const router = express.Router();

// Api Routes
router.use('/api', api);

// Authentication routes
router.use('/auth', authentication);

// The rest of the Routes will return a 404 error
router.get('*', (_, res) => {
  res.status(404).send('NOT FOUND');
});

module.exports = router;