/** cleanDatabase.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 * 
 * Function that cleans de Database when called
 */
const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');

const AuthToken = require('../database/models/token');
const PasswordToken = require('../database/models/passwordResetToken');

// utilies
const logger = require('./logger');
const { validateTimeframe } = require('../utils/validator');

module.exports.cleanDatabase = async () => {
  logger.info('Running database cleanup');

  // Deletes all the expired authentication tokens
  const authTokens = await AuthToken.find({});
  authTokens.map(token => { this.checkAuthTokenExpiration(token); });

  // Deletes all the expired reset Password tokens
  const passwordTokens = await PasswordToken.find({});
  passwordTokens.map(token => {
    try { jwt.verify(token.token, process.env.PASSWORD_RESET_KEY); }
    catch { PasswordToken.findByIdAndDelete(token._id); }
  });

}

module.exports.checkAuthTokenExpiration = async (db_token) => {
  try {
    // Checks if the token is not expired
    const decoded = jwt.verify(db_token.token, process.env.REFRESH_TOKEN_KEY);

    // If the setting REFRESH_TOKEN_RESET is enabled, checks the lastUsed time
    if (process.env.REFRESH_TOKEN_RESET === 'true') {
      // If the lastUsed time is outside the timeframe, it is considered expired
      if (!validateTimeframe(db_token.lastUsed, process.env.REFRESH_TOKEN_DURATION)) {
        throw 'expired';
      }
    }

    return {
      decoded,
      valid: true,
    }
  }
  catch (err) {
    await AuthToken.findByIdAndDelete(db_token._id);
    logger.info(`Deleted expired token ${db_token.token}`);
    return {
      decoded: null,
      valid: false,
    }
  }
};
