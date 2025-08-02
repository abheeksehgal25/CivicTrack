const User = require('../models/User');
const Issue = require('../models/Issue');
const Flag = require('../models/Flag');
const StatusLog = require('../models/StatusLog');

// Get dashboard overview data
const getDashboardData = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalIssues = await Issue.countDocuments();
    const totalFlags = await Flag.countDocuments();
    const pendingIssues = await Issue.countDocuments({ status: 'pending' });
    const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });
    const inProgressIssues = await Issue.countDocuments({ status: 'in_progress' });

    // Get recent issues
    const recentIssues = await Issue.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name email');

    // Get recent flags
    const recentFlags = await Flag.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email')
      .populate('issueId', 'title status');

    // Get category distribution
    const categoryStats = await Issue.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get status distribution
    const statusStats = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        counts: {
          totalUsers,
          totalIssues,
          totalFlags,
          pendingIssues,
          resolvedIssues,
          inProgressIssues
        },
        recentIssues,
        recentFlags,
        categoryStats,
        statusStats
      }
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalUsers: total
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// Get all issues
const getAllIssues = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, search = '' } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const issues = await Issue.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Issue.countDocuments(query);

    res.json({
      success: true,
      data: {
        issues,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalIssues: total
        }
      }
    });
  } catch (error) {
    console.error('Get issues error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch issues'
    });
  }
};

// Get all flags
const getAllFlags = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const flags = await Flag.find()
      .populate('userId', 'name email')
      .populate('issueId', 'title status category')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Flag.countDocuments();

    res.json({
      success: true,
      data: {
        flags,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalFlags: total
        }
      }
    });
  } catch (error) {
    console.error('Get flags error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch flags'
    });
  }
};

// Get analytics data
const getAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Issues over time
    const issuesOverTime = await Issue.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Category distribution
    const categoryDistribution = await Issue.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Status distribution
    const statusDistribution = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // User registration over time
    const userRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        issuesOverTime,
        categoryDistribution,
        statusDistribution,
        userRegistrations
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
};

// Update issue status
const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    issue.status = status;
    if (adminNote) {
      issue.adminNote = adminNote;
    }
    await issue.save();

    // Create status log
    await StatusLog.create({
      issueId: id,
      status,
      timestamp: new Date(),
      adminNote
    });

    res.json({
      success: true,
      message: 'Issue status updated successfully',
      data: issue
    });
  } catch (error) {
    console.error('Update issue status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update issue status'
    });
  }
};

// Delete issue
const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findByIdAndDelete(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Delete related flags and status logs
    await Flag.deleteMany({ issueId: id });
    await StatusLog.deleteMany({ issueId: id });

    res.json({
      success: true,
      message: 'Issue deleted successfully'
    });
  } catch (error) {
    console.error('Delete issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete issue'
    });
  }
};

// Ban user
const banUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isBanned: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User banned successfully',
      data: user
    });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to ban user'
    });
  }
};

// Unban user
const unbanUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isBanned: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User unbanned successfully',
      data: user
    });
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unban user'
    });
  }
};

module.exports = {
  getDashboardData,
  getAllUsers,
  getAllIssues,
  getAllFlags,
  getAnalytics,
  updateIssueStatus,
  deleteIssue,
  banUser,
  unbanUser
}; 