const mongoose = require('mongoose');

// TODO: Issue schema definition
// Fields: title, description, category, location, images, status, reporter, createdAt

const issueSchema = new mongoose.Schema({
  // TODO: Add issue fields
}, {
  timestamps: true
});

module.exports = mongoose.model('Issue', issueSchema); 