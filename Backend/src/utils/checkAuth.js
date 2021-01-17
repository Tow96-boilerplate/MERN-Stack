/** checkAuth.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * Utility that checks if the received authentication token is valid
 */
const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');

const Token = require('../database/models/token');

// utils
const { authenticationError } = require('./errorhandler');
const { validateTimeframe } = require('./validator');
const { checkAuthTokenExpiration } = require('./cleanDatabase');
const logger = require('./logger');

module.exports.checkToken = async (req, res, next) => {
  const token = req.headers["x-auth-token"];
  try {
    // Throw error if there is no header
    if (!token) throw authenticationError('Missing header', { header: 'Missing x-auth-token' });

    // Checks for token validity
    try {
      const decoded = jwt.verify(token, process.env.AUTH_TOKEN_KEY);
      req.auth = decoded;
    }
    catch (err) { throw authenticationError('Invalid token', { authToken: 'Invalid/expired token' }); }

    next();
  }
  catch (exception) { res.status(exception.status ? exception.status : 400).send(exception); }
}

module.exports.checkRefresh = async (req, res, next) => {
  const token = req.headers["x-refresh-token"];
  try {
    // Throw error if there is no header
    if (!token) throw authenticationError('Missing header', { header: 'Missing x-refresh-token' });

    // Checks in database if token is valid
    const db_token = await Token.findOne({ token });
    if (!db_token) throw authenticationError('Invalid token', { refreshToken: 'Invalid token' });

    // Checks if token is not expired
    const { decoded, valid } = await checkAuthTokenExpiration(db_token);
    if(!valid) throw authenticationError('Expired token', { refreshToken: 'Expired' });

    req.auth = decoded;

    //updates the lastUsed parameter
    await Token.findByIdAndUpdate(db_token._id, { lastUsed: new Date().toISOString() })

    next();

  } catch (exception) { res.status(exception.status ? exception.status : 400).send(exception); }
}
