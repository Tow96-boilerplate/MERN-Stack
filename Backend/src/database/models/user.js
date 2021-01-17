/** user.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * Model that describes the User schema
 */
const mongoose = require('mongoose');

// The Schema doesn't have validators as it is managed differently
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  teams: [{ type: String, }],
  createdAt: String,
  emailConfirmed: { type: Boolean, default: false },
  settings: {
    darkMode: { type: Boolean, default: false },
  },

});

// Export to database
const User = mongoose.model('Users', UserSchema);

module.exports = User;
