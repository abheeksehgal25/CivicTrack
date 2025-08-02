const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// Admin dashboard data routes
router.get('/dashboard', protect, admin, adminController.getDashboardData);
router.get('/users', protect, admin, adminController.getAllUsers);
router.get('/issues', protect, admin, adminController.getAllIssues);
router.get('/flags', protect, admin, adminController.getAllFlags);
router.get('/analytics', protect, admin, adminController.getAnalytics);

// Moderation actions
router.patch('/issues/:id/status', protect, admin, adminController.updateIssueStatus);
router.delete('/issues/:id', protect, admin, adminController.deleteIssue);
router.patch('/users/:id/ban', protect, admin, adminController.banUser);
router.patch('/users/:id/unban', protect, admin, adminController.unbanUser);
router.delete('/flags/:id', protect, admin, adminController.deleteFlag);
router.patch('/flags/:id/review', protect, admin, adminController.reviewFlag);

module.exports = router; 