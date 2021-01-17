/** validator.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * Contains functions that report errors
 */

const logger = require('./logger');

// HTTP: 401
module.exports.authenticationError = (message, errors) => {
  const err = {
    message,
    errors,
    status: 401,
  }

  logger.http(message);
  logger.http(JSON.stringify(errors));

  return err
}

// HTTP: 404
module.exports.notFoundError = (message, errors) => {
  const err = {
    message,
    errors,
    status: 404,
  }

  logger.http(message);
  logger.http(JSON.stringify(errors));

  return err
}

// HTTP: 422
module.exports.userInputError = (message, errors) => {
  const err = {
    message,
    errors,
    status: 422,
  }

  logger.http(message);
  logger.http(JSON.stringify(errors));

  return err
}
