/** index.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved
 * 
 * index for all the authetication routes
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const logger = require('../../utils/logger');
const User = require('../../database/models/user');
const Token = require('../../database/models/token');
const { generateAuthToken, generateEmailToken, generateRefToken } = require('../../utils/generateToken');
const errorHandler = require('../../utils/errorhandler');
const { checkRefresh } = require('../../utils/checkAuth');
const { validateRegisterInput, validateEmail } = require('../../utils/validator');
const mailer = require('../../utils/mailer');

const router = express.Router();

// register: creates a new user, returns the new user's authToken and refreshToken
router.post('/register', async (req, res) => {
  // Extracts the data from the request's body
  const { username, password, confirmPassword, email } = req.body;
  try {
    // Validates the data
    const { valid, errors } = validateRegisterInput(username, password, confirmPassword, email);
    if (!valid) throw errorHandler.userInputError('Invalid fields', errors);

    // Checks for user availability, if it already exists, sends an error
    const userExists = await User.findOne({ username });
    if (userExists) throw errorHandler.userInputError('Taken username', { username: 'This username is taken' });

    // Checks for email availabiltiy, if it already has an account, sends an error
    const emailExists = await User.findOne({ email });
    if (emailExists) throw errorHandler.userInputError('Taken email', { email: 'This email is used by another account' });

    // Hashes the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Adds the new User to the database
    const newUser = await new User({
      username: username,
      password: hashedPassword,
      email: email,
      createdAt: new Date().toISOString(),
    }).save();

    // creates the payload for the token, it does not contain the password
    const payload = { ...newUser._doc }; delete payload["password"];

    // creates the token for the emailVerification
    const emailToken = generateEmailToken(payload.email);
    mailer.confirmationEmail(payload.email, payload.username, emailToken);

    // creates both the authToken and the refreshToken
    const authToken = generateAuthToken(payload);
    const refToken = generateRefToken(payload._id)

    // Adds the refresh token to database for logouts
    await new Token({
      _ownerId: newUser._doc._id,
      token: refToken,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    }).save();

    // creates the response payload
    const response = { authToken, refToken };

    logger.debug(JSON.stringify(response));

    res.send(response);
  }
  catch (exception) { res.status(exception.status ? exception.status : 400).send(exception); }
});

// Login: gives the authToken and the refreshToken
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Checks if the given username is an email
    const { valid } = validateEmail(username);

    // Check if user exists
    const searchParams = valid ? { email: username } : { username: username };
    const db_user = await User.findOne(searchParams);
    if (!db_user) throw errorHandler.userInputError('Login Error', { username: 'Username not found' });

    // Check if password is correct
    const match = await bcrypt.compare(password, db_user.password);
    if (!match) throw errorHandler.userInputError('Login Error', { password: 'Incorrect password' });

    // creates the payload for the token, it does not contain the password
    const payload = { ...db_user._doc }; delete payload["password"];

    // creates the tokens
    const authToken = generateAuthToken(payload);
    const refToken = generateRefToken(payload._id);

    // Adds the refresh token to database for logouts
    await new Token({
      _ownerId: db_user._doc._id,
      token: refToken,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    }).save();

    // creates the response payload
    const response = { authToken, refToken };

    logger.debug(JSON.stringify(response));

    res.send(response);

  }
  catch (exception) { res.status(exception.status ? exception.status : 400).send(exception); }
});

// Token: gives a new authToken
router.get('/token', checkRefresh, async (req, res) => {
  try {
    // Checks if the user of the token still exists
    const db_user = await User.findOne({ _id: req.auth.id });
    if (!db_user) throw errorHandler.authenticationError('Deleted User', { user: 'Deleted user' });

    // Creates the payload for a new token
    const payload = { ...db_user._doc }; delete payload["password"];

    const authToken = generateAuthToken(payload);

    res.send({ authToken });

  }
  catch (exception) { res.status(exception.status ? exception.status : 400).send(exception); }
});

// Logout: deletes the refreshToken
router.delete('/logout', checkRefresh, async (req, res) => {
  const token = req.headers["x-refresh-token"];
  try {
    // Checks if the user of the token still exists
    const db_user = await User.findOne({ _id: req.auth.id });
    if (!db_user) throw errorHandler.authenticationError('Deleted User', { user: 'Deleted user' });

    // Deletes the token
    try {
      await Token.deleteOne({ token: token });
      logger.debug(`Deleted token ${token}`);
      res.sendStatus(204);
    }
    catch (err) {
      res.sendStatus(503);
    }

  }
  catch (exception) { res.status(exception.status ? exception.status : 400).send(exception); }
});

// Verify: verifies an account
router.patch('/verify/:token', async (req, res) => {
  const token = req.params.token;
  try {

    let decoded;

    // Checks if the token is valid
    try { decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_KEY); }
    catch (err) { throw errorHandler.userInputError('Invalid/Expired token', { verificationToken: 'Invalid/Expired' }) }

    // Searches for the given email in the database
    const db_user = await User.findOne({ email: decoded.email });
    if (!db_user) throw errorHandler.notFoundError('Email not registered', { verificationToken: 'Email not associated' });

    // If exists, verifies it:
    const new_db_user = await User.findOneAndUpdate({ email: decoded.email }, { emailConfirmed: true })

    // Sends login tokens
    const payload = { ...new_db_user._doc }; delete payload["password"];

    // creates the tokens
    const authToken = generateAuthToken(payload);
    const refToken = generateRefToken(payload._id);

    // Adds the refresh token to database for logouts
    await new Token({
      token: refToken,
      createdAt: new Date().toISOString(),
    }).save();

    // creates the response payload
    const response = { authToken, refToken };

    logger.debug(JSON.stringify(response));

    res.send(response);
  }
  catch (exception) { res.status(exception.status ? exception.status : 400).send(exception); }
});

module.exports = router;
