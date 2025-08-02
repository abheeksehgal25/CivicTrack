const mongoose = require('mongoose');

// TODO: User schema definition
// Fields: email, password, name, role, location, createdAt

const userSchema = new mongoose.Schema({
  // TODO: Add user fields
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema); 