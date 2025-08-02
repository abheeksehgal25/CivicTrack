const mongoose = require('mongoose');

const statusLogSchema = new mongoose.Schema({
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    required: [true, 'Issue ID is required']
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['pending', 'in-progress', 'resolved', 'rejected']
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  }
}, {
  timestamps: true
});

// Index for issue queries
statusLogSchema.index({ issueId: 1, createdAt: -1 });

module.exports = mongoose.model('StatusLog', statusLogSchema); 