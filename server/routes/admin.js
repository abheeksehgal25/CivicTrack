const express = require('express');
const { protect, admin } = require('../middleware/auth');
const {
  getModerationIssues,
  moderateIssue,
  getAnalytics,
  getFlaggedIssues
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(admin);

// Routes
router.get('/issues', getModerationIssues);
router.patch('/issues/:id', moderateIssue);
router.get('/analytics', getAnalytics);
router.get('/flags', getFlaggedIssues);

module.exports = router; 