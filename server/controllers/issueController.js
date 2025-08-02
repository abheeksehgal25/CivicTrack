const Issue = require('../models/Issue');
const StatusLog = require('../models/StatusLog');
const Flag = require('../models/Flag');
const User = require('../models/User');

// @desc    Get all issues with filters
// @route   GET /api/issues
// @access  Public
const getIssues = async (req, res) => {
  try {
    const { category, status, lat, lng, radius = 5 } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Filter by location (within radius)
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      const radiusNum = parseFloat(radius);
      
      // Calculate bounding box for efficient querying
      const latDelta = radiusNum / 111; // 1 degree = ~111 km
      const lngDelta = radiusNum / (111 * Math.cos(latNum * Math.PI / 180));
      
      query['location.lat'] = { $gte: latNum - latDelta, $lte: latNum + latDelta };
      query['location.lng'] = { $gte: lngNum - lngDelta, $lte: lngNum + lngDelta };
    }
    
    const issues = await Issue.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    
    // Calculate distances if lat/lng provided
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      
      issues.forEach(issue => {
        issue.distance = issue.calculateDistance(latNum, lngNum);
      });
      
      // Filter by radius and sort by distance
      const filteredIssues = issues
        .filter(issue => issue.distance <= radius)
        .sort((a, b) => a.distance - b.distance);
      
      return res.json({
        count: filteredIssues.length,
        issues: filteredIssues
      });
    }
    
    res.json({
      count: issues.length,
      issues
    });
  } catch (error) {
    console.error('Get issues error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new issue
// @route   POST /api/issues
// @access  Private
const createIssue = async (req, res) => {
  try {
    const { title, description, category, location, photos, anonymous } = req.body;
    
    const issue = await Issue.create({
      title,
      description,
      category,
      location,
      photos: photos || [],
      anonymous: anonymous || false,
      createdBy: req.user.id
    });
    
    // Create initial status log
    await StatusLog.create({
      issueId: issue._id,
      status: 'pending',
      updatedBy: req.user.id
    });
    
    const populatedIssue = await Issue.findById(issue._id)
      .populate('createdBy', 'name');
    
    res.status(201).json({
      message: 'Issue created successfully',
      issue: populatedIssue
    });
  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Public
const getIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('createdBy', 'name');
    
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    
    // Get status timeline
    const statusLogs = await StatusLog.find({ issueId: issue._id })
      .populate('updatedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json({
      issue,
      timeline: statusLogs
    });
  } catch (error) {
    console.error('Get issue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's issues
// @route   GET /api/issues/user
// @access  Private
const getUserIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ createdBy: req.user.id })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json({
      count: issues.length,
      issues
    });
  } catch (error) {
    console.error('Get user issues error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Flag an issue
// @route   POST /api/issues/:id/flag
// @access  Private
const flagIssue = async (req, res) => {
  try {
    const { reason, description } = req.body;
    
    // Check if issue exists
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    
    // Check if user already flagged this issue
    const existingFlag = await Flag.findOne({
      userId: req.user.id,
      issueId: req.params.id
    });
    
    if (existingFlag) {
      return res.status(400).json({ message: 'Issue already flagged by this user' });
    }
    
    const flag = await Flag.create({
      userId: req.user.id,
      issueId: req.params.id,
      reason,
      description
    });
    
    res.status(201).json({
      message: 'Issue flagged successfully',
      flag
    });
  } catch (error) {
    console.error('Flag issue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update issue status (admin only)
// @route   PATCH /api/issues/:id/status
// @access  Private/Admin
const updateIssueStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    
    // Update issue status
    issue.status = status;
    await issue.save();
    
    // Create status log
    await StatusLog.create({
      issueId: issue._id,
      status,
      comment,
      updatedBy: req.user.id
    });
    
    const updatedIssue = await Issue.findById(issue._id)
      .populate('createdBy', 'name');
    
    res.json({
      message: 'Issue status updated successfully',
      issue: updatedIssue
    });
  } catch (error) {
    console.error('Update issue status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete issue
// @route   DELETE /api/issues/:id
// @access  Private
const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    
    // Check if user owns the issue or is admin
    if (issue.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this issue' });
    }
    
    // Delete related records
    await StatusLog.deleteMany({ issueId: issue._id });
    await Flag.deleteMany({ issueId: issue._id });
    await Issue.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    console.error('Delete issue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getIssues,
  createIssue,
  getIssue,
  getUserIssues,
  flagIssue,
  updateIssueStatus,
  deleteIssue
}; 