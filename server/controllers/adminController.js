const Issue = require('../models/Issue');
const StatusLog = require('../models/StatusLog');
const Flag = require('../models/Flag');
const User = require('../models/User');

// @desc    Get issues for moderation
// @route   GET /api/admin/issues
// @access  Private/Admin
const getModerationIssues = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;
    
    const skip = (page - 1) * limit;
    
    const issues = await Issue.find(query)
      .populate('createdBy', 'name')
      .populate({
        path: 'flags',
        populate: { path: 'userId', select: 'name' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Issue.countDocuments(query);
    
    res.json({
      issues,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get moderation issues error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Moderate issue
// @route   PATCH /api/admin/issues/:id
// @access  Private/Admin
const moderateIssue = async (req, res) => {
  try {
    const { action, comment } = req.body;
    
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    
    let newStatus;
    switch (action) {
      case 'approve':
        newStatus = 'in-progress';
        break;
      case 'reject':
        newStatus = 'rejected';
        break;
      case 'resolve':
        newStatus = 'resolved';
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }
    
    issue.status = newStatus;
    await issue.save();
    
    // Create status log
    await StatusLog.create({
      issueId: issue._id,
      status: newStatus,
      comment,
      updatedBy: req.user.id
    });
    
    // If rejecting, delete flags
    if (action === 'reject') {
      await Flag.deleteMany({ issueId: issue._id });
    }
    
    const updatedIssue = await Issue.findById(issue._id)
      .populate('createdBy', 'name');
    
    res.json({
      message: 'Issue moderated successfully',
      issue: updatedIssue
    });
  } catch (error) {
    console.error('Moderate issue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));
    
    // Total issues
    const totalIssues = await Issue.countDocuments();
    
    // Issues by status
    const issuesByStatus = await Issue.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Issues by category
    const issuesByCategory = await Issue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    // Recent issues (last N days)
    const recentIssues = await Issue.countDocuments({
      createdAt: { $gte: daysAgo }
    });
    
    // Issues created by day (last 7 days)
    const dailyIssues = await Issue.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Top reporters
    const topReporters = await Issue.aggregate([
      { $group: { _id: '$createdBy', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $project: { name: '$user.name', count: 1 } }
    ]);
    
    // Flagged issues
    const flaggedIssues = await Flag.aggregate([
      { $group: { _id: '$issueId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      totalIssues,
      issuesByStatus,
      issuesByCategory,
      recentIssues,
      dailyIssues,
      topReporters,
      flaggedIssues
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get flagged issues
// @route   GET /api/admin/flags
// @access  Private/Admin
const getFlaggedIssues = async (req, res) => {
  try {
    const flags = await Flag.find()
      .populate('userId', 'name')
      .populate({
        path: 'issueId',
        populate: { path: 'createdBy', select: 'name' }
      })
      .sort({ createdAt: -1 });
    
    res.json({ flags });
  } catch (error) {
    console.error('Get flagged issues error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getModerationIssues,
  moderateIssue,
  getAnalytics,
  getFlaggedIssues
}; 