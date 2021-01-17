const ms = require('ms');

/** validator.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * Contains functions that validate data
 */

/** validateUsername
 * Checks if a given string can be used as username
 * 
 * @param username
 * 
 * @returns Valid: Boolean that confirms validity
 * @returns errors: Object with all the errors
 */
module.exports.validateUsername = (username) => {
  // Creates an object that will hold all the errors
  const errors = {};

  // Checks if the username is at leas 3 characters long
  if (username.trim().length < 3) {
    errors.username = 'Username needs to be at least 3 characters long';
  };

  // Checks that the username is not in email format
  const isEmail = this.validateEmail(username);
  if (isEmail.valid) {
    errors.username = 'The username can\'t be an email address';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}

/** validateEmail
 * Checks if a given string can be used as email
 * 
 * @param email
 * 
 * @returns Valid: Boolean that confirms validity
 * @returns errors: Object with all the errors
 */
module.exports.validateEmail = (email) => {
  // Creates an object that will hold all the errors
  const errors = {};

  // Checks if email is not empty and is valid
  if (email.trim() === '') {
    errors.email = 'e-mail must not be empty';
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@[0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9}$/;
    if (!email.match(regEx)) {
      errors.email = 'e-mail must be a valid address';
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}

/** validatePassword
 * Checks if a given pair of strings can be a password
 * 
 * @param password
 * @param confirmPassword
 * 
 * @returns Valid: Boolean that confirms validity
 * @returns errors: Object with all the errors
 */
module.exports.validatePassword = (password, confirmPassword) => {
  // Creates an object that will hold all the errors
  const errors = {};

  // Checks if password is has at least 8 characters
  if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  // If correct, then checks if passwords match
  else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}

/** validateRegisterInput
 * Reads the inputs to register a new user and checks for it's validity
 * 
 * @param username
 * @param password
 * @param confirmPassword
 * @param email
 * 
 * @returns Valid: Boolean that confirms validity
 * @returns errors: Object with all the errors
 */
module.exports.validateRegisterInput = (username, password, confirmPassword, email) => {
  // Creates an object that will hold all the errors
  let errors = {};

  // Checks if the user is valid
  const usernameValidation = this.validateUsername(username);
  errors = { ...errors, ...usernameValidation.errors };

  // Checks if email is valid
  const emailValidation = this.validateEmail(email);
  errors = { ...errors, ...emailValidation.errors };

  // Checks if password is empty
  const passwordValidation = this.validatePassword(password, confirmPassword);
  errors = { ...errors, ...passwordValidation.errors };

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }

}

/** validateTimeframe
 * Checks if a given Date in isoString is in range of a given time from now
 * 
 * @param date The date that will be checked in ISO String
 * @param time The time from now in seconds or in zeit/ms string
 * 
 * @returns Boolean that confirms validity
*/
module.exports.validateTimeframe = (date, time) => {
  const lastUsed = new Date(date);
  const now = new Date();
  let timeframe = 0;

  // if the given time is a number, converts it to miliseconds and uses it
  if (!isNaN(time)) { timeframe = time * 1000; }
  // If it's is a string, checks if it is a number and uses it
  else if (time.match("/^[0-9]+$/") !== null) { timeframe = parseInt(time) * 1000; }
  // If not a number in string format, converts it to miliseconds using ms
  else { timeframe = ms(time); }

  
  // Gets the difference in miliseconds
  const diff = now.getTime() - lastUsed.getTime();

  // If the diff is smaller than timeframe, then the date is valid
  if (diff < timeframe) return true

  return false;
}
