/** user.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 * 
 * Routes for user settings
 */
const express = require('express');
const bcrypt = require('bcryptjs');

const logger = require('../../utils/logger');
const validator = require('../../utils/validator');
const errorHandler = require('../../utils/errorhandler');
const User = require('../../database/models/user');
const AuthToken = require('../../database/models/token');
const { generateEmailToken } = require('../../utils/generateToken');
const mailer = require('../../utils/mailer');

const router = express.Router();

// delete /: removes the username
router.delete('/', async (req, res) => {
  const { user } = req.auth;

  try {
    // Searches the existance of the user
    const userExists = await User.findById(user._id);
    if (!userExists) throw errorHandler.userInputError('User not found', { username: 'Not found' });

    // Deletes the access tokens
    const deletedTokens = await AuthToken.deleteMany({ _ownerId: user._id });
    logger.debug(deletedTokens);

    // TODO: Any other things that need to be deleted

    const confirmDeletion = await User.findByIdAndDelete(user._id);
    logger.debug(confirmDeletion);

    logger.info(`Deleted user: ${user.username} with ID: ${user._id}`);

    res.sendStatus(204);
  }
  catch (exception) { res.status(exception.status ? exception.status : 400).send(exception); }
});

// patch /username: changes the username
router.patch('/username', async (req, res) => {
  const { username } = req.body;

  try {
    // Retrieves the old username
    const db_user = await User.findById(req.auth.user._id);
    if (!db_user) throw errorHandler.userInputError('user not found', { user: 'User not found' });

    // If the new username is the same as the previous, throws an error
    if (username === db_user._doc.username) {
      throw errorHandler.userInputError('Username is same', { username: 'The username is the same as the previous one' })
    }

    // Validates the username
    const { valid, errors } = validator.validateUsername(username);
    if (!valid) throw errorHandler.userInputError('Invalid username', errors);

    // Checks if username is not already taken
    const userExists = await User.findOne({ username });
    if (userExists) throw errorHandler.userInputError('Taken username', { username: 'This username is taken' });

    // Changes the username
    await User.findOneAndUpdate({ _id: req.auth.user._id }, { username });

    logger.info(`Changed username of id:${db_user._id} to ${username}`);

    res.send({ username: username });
  }
  catch (exception) { res.status(exception.status ? exception.status : 400).send(exception); }
});

// get /email: resends the verification email if not verified
router.get('/email', async (req, res) => {
  try {
    // Checks if the user exists
    const db_user = await User.findById(req.auth.user._id);
    if (!db_user) throw errorHandler.userInputError('user not found', { user: 'User not found' });

    // If the user's email is verified, returns a 304 code
    if (db_user.emailConfirmed) return res.sendStatus(304);

    // Creates and sends a new verification email
    const emailToken = generateEmailToken(db_user.email);
    mailer.confirmationEmail(db_user.email, db_user.username, emailToken);

    res.sendStatus(204);

  }
  catch (exception) { res.status(exception.status ? exception.status : 400).send(exception); }
});

// patch /email: changes the email
router.patch('/email', async (req, res) => {
  const { email } = req.body;

  try {
    // Retrieves the user from the database
    const db_user = await User.findById(req.auth.user._id);
    if (!db_user) throw errorHandler.userInputError('user not found', { user: 'User not found' });

    // If the new username is the same as the previous, throws an error
    if (email === db_user._doc.email) {
      throw errorHandler.userInputError('Email is same', { email: 'The email is the same as the previous one' });
    }

    // Validates the email
    const { valid, errors } = validator.validateEmail(email);
    if (!valid) throw errorHandler.userInputError('Email must be a valid address', errors);

    // Checks if email is not already in use
    const emailExists = await User.findOne({ email });
    if (emailExists) throw errorHandler.userInputError('Taken email', { email: 'This email is used by another account' });

    // Changes the email and sets the confirmation to false
    await User.findByIdAndUpdate(req.auth.user._id, { email, emailConfirmed: false });

    // Creates and sends a new verification email
    const emailToken = generateEmailToken(email);
    mailer.confirmationEmail(email, db_user.username, emailToken);

    res.send({ email: email });
  }
  catch (exception) { res.status(exception.status ? exception.status : 400).send(exception); }

});

// patch /password: changes the password
router.patch('/password', async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  try {
    // Retrieves the user from the database
    const db_user = await User.findById(req.auth.user._id);
    if (!db_user) throw errorHandler.userInputError('user not found', { user: 'User not found' });

    // Checks that the old password is correct
    const match = await bcrypt.compare(oldPassword, db_user.password);
    if (!match) throw errorHandler.userInputError('Incorrect Password', { oldPassword: 'Incorrect password' });

    // Validates password
    const { valid, errors } = validator.validatePassword(newPassword, confirmPassword);
    if (!valid) {
      // If there is a password error, changes it to newPassword
      if (errors.password) {
        errors.newPassword = errors.password;
        delete errors["password"];
      }
      throw errorHandler.userInputError('Password error', errors);
    }

    // Hashes the password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Changes the password
    await User.findByIdAndUpdate(req.auth.user._id, { password: hashedPassword });

    logger.info(`Changed password of id: ${db_user._doc._id}`)

    //Deletes all authTokens machines log out
    await AuthToken.deleteMany({ _ownerId: db_user_doc._id });

    res.sendStatus(204);

  }
  catch (exception) { res.status(exception.status ? exception.status : 400).send(exception); }
});

module.exports = router;
