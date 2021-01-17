/** validator.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * Creates the login tokens, the token only contains the id of the user
 */
const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');
const logger = require('./logger');

// creates an authenticationToken
module.exports.generateAuthToken = (user) => {
  return jwt.sign({
    user: user,
  }, process.env.AUTH_TOKEN_KEY, { expiresIn: process.env.AUTH_TOKEN_DURATION });
};

// creates a refreshToken
module.exports.generateRefToken = (id) => {
  // checks the expiration setting is off, the tokens don't expire
  if (!process.env.REFRESH_TOKEN_RESET === 'true') {
    logger.debug('Issuing nonexpiring token')
    return jwt.sign({
      id: id,
    }, process.env.REFRESH_TOKEN_KEY);
  }
  return jwt.sign({
    id: id,
  }, process.env.REFRESH_TOKEN_KEY, { expiresIn: process.env.REFRESH_TOKEN_DURATION });
};

// creates an email verificationToken, uses jsonwebtoken so they don't need to be stored in DB
module.exports.generateEmailToken = (email) => {
  return jwt.sign({
    email: email
  }, process.env.EMAIL_VERIFICATION_KEY, { expiresIn: process.env.EMAIL_VERIFICATION_DURATION })
}

// creates a password reset Token
module.exports.generatePasswordResetToken = (id) => {
  return jwt.sign({
    id: id
  }, process.env.PASSWORD_RESET_KEY, { expiresIn: process.env.PASSWORD_RESET_DURATION });
}
