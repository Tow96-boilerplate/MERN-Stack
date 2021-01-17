/** passwordResetToken.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 * 
 * Model that describes de passwordReset Token schema
 */
const mongoose = require('mongoose');

// The Schema doesn't have validators as it is mananged externally
const PasswordResetTokenSchema = new mongoose.Schema({
  _ownerId: mongoose.Types.ObjectId,
  token: String,
  createdAt: String,
});

// Export to database
const PasswordResetToken =  mongoose.model('PasswordResetTokens', PasswordResetTokenSchema);

module.exports = PasswordResetToken;
