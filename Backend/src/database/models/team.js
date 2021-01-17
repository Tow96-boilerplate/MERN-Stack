/** user.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * Model that describes the Team schema
 */
const mongoose = require('mongoose');

// The Schema doesn't have validators as it is managed externally
const TeamSchema = new mongoose.Schema({
  teamname: String,
  owner: {
    id: mongoose.Types.ObjectId,
    username: String,
  },
  admins: [{
    id: mongoose.Types.ObjectId,
    username: String,
  }],
  members: [{
    id: mongoose.Types.ObjectId,
    username: String,
  }],
  forms: [{
    id: mongoose.Types.ObjectId,
    username: String,
  }],
});

// Export to database
const Team = mongoose.model('Teams', TeamSchema);

module.exports = Team;
