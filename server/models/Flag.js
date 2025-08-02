const mongoose = require('mongoose');

const flagSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    required: [true, 'Issue ID is required']
  },
  reason: {
    type: String,
    required: [true, 'Flag reason is required'],
    enum: ['inappropriate', 'spam', 'duplicate', 'other']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate flags from same user
flagSchema.index({ userId: 1, issueId: 1 }, { unique: true });

module.exports = mongoose.model('Flag', flagSchema); 