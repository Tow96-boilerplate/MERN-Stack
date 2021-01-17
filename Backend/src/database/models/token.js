/** token.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * Model that describes the Token schema
 */
const mongoose = require('mongoose');

// The Schema doesn't have validatoras as it is managed externally
const TokenSchema = new mongoose.Schema({
  _ownerId: mongoose.Types.ObjectId,
  token: String,
  createdAt: String,
  lastUsed: String,
});

// Export to database
const Token = mongoose.model('Tokens', TokenSchema);

module.exports = Token;
