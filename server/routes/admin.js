const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Admin dashboard data routes
router.get('/dashboard', authenticateToken, requireAdmin, adminController.getDashboardData);
router.get('/users', authenticateToken, requireAdmin, adminController.getAllUsers);
router.get('/issues', authenticateToken, requireAdmin, adminController.getAllIssues);
router.get('/flags', authenticateToken, requireAdmin, adminController.getAllFlags);
router.get('/analytics', authenticateToken, requireAdmin, adminController.getAnalytics);

// Moderation actions
router.patch('/issues/:id/status', authenticateToken, requireAdmin, adminController.updateIssueStatus);
router.delete('/issues/:id', authenticateToken, requireAdmin, adminController.deleteIssue);
router.patch('/users/:id/ban', authenticateToken, requireAdmin, adminController.banUser);
router.patch('/users/:id/unban', authenticateToken, requireAdmin, adminController.unbanUser);

module.exports = router; 