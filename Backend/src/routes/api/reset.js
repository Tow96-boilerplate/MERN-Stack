/** reset.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 * 
 * Password reset routes
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validateEmail } = require('../../utils/validator');
const { generatePasswordResetToken } = require('../../utils/generateToken');
const { validatePassword } = require('../../utils/validator');
const errorHandler = require('../../utils/errorhandler');
const mailer = require('../../utils/mailer');
const logger = require('../../utils/logger');

const User = require('../../database/models/user');
const AuthToken = require('../../database/models/token');
const PasswordToken = require('../../database/models/passwordResetToken');


const router = express.Router();

// POST: / ; Sends the password reset mail to a given mail
router.post('/', async (req, res) => {
  const { email } = req.body;

  // Checks if the input is an email
  const { valid } = validateEmail(email);
  if (!valid) return res.sendStatus(204);

  // Checks if the given email is within the database
  const db_user = await User.findOne({ email: email });
  if (!db_user) return res.sendStatus(204);

  // generates a password reset token
  const token = generatePasswordResetToken(db_user._id);

  // sends mail
  mailer.resetPasswordEmail(email, db_user.username, token, db_user._id);

  res.send(204);

});

// GET: /:token ; Given a token in the params, checks if it is valid
router.get('/:token', async (req, res) => {
  const { token } = req.params;

  try {
    // Checks if the token is in the database, if not present is considered invalid
    const token_exists = await PasswordToken.findOne({ token: token });
    if (!token_exists) throw errorHandler.userInputError('Invalid token', { resetPassword: 'given token is invalid' });

    // Checks if the token is not expired
    try { dedcoded = jwt.verify(token, process.env.PASSWORD_RESET_KEY) }
    catch (err) {
      // If the token is expired, deletes it and throws an error
      await PasswordToken.deleteMany({ token: token });
      throw errorHandler.userInputError('Expired token', { resetPassword: 'The token is expired' })
    };

    // If both valid and in the DB, returns a 204 code, signaling it's correct
    res.send(204);
  }
  catch (exception) { res.status(exception.status ? exception.status : 400).send(exception); }
});

// POST: /:token ; Given a token in the params, sets a new password
router.post('/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  try {
    // Checks if the token is in the database, if not present is considered invalid
    const token_exists = await PasswordToken.findOne({ token: token });
    if (!token_exists) throw errorHandler.userInputError('Invalid token', { resetPassword: 'given token is invalid' });

    let decoded = 0;
    // Checks if the token is not expired
    try { decoded = jwt.verify(token, process.env.PASSWORD_RESET_KEY) }
    catch (err) {
      // If the token is expired, deletes it and throws an error
      await PasswordToken.deleteMany({ token: token });
      throw errorHandler.userInputError('Expired token', { resetPassword: 'The token is expired' })
    };

    // Validates the password
    const { valid, errors } = validatePassword(newPassword, confirmPassword);
    if (!valid) throw errorHandler.userInputError('Password error', errors);

    // Hashes the password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Changes the password
    const db_user = await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    logger.info(`Changed password of id: ${db_user._doc._id}`);

    // Deletes all AuthTokens of the user so a new Login is required
    await AuthToken.deleteMany({ _ownerId: decoded.id });
    // Finally deletes the resetPassword token
    await PasswordToken.deleteMany({ token: token });

    res.send(204);

  }
  catch (exception) { res.status(exception.status ? exception.status : 400).send(exception); }
});

module.exports = router;
