const express = require('express');
const { body } = require('express-validator');
const { protect, admin } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');
const {
  getIssues,
  createIssue,
  getIssue,
  getUserIssues,
  flagIssue,
  updateIssueStatus,
  deleteIssue
} = require('../controllers/issueController');

const router = express.Router();

// Validation rules
const createIssueValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .isIn(['pothole', 'garbage', 'streetlight', 'traffic', 'parks', 'other'])
    .withMessage('Invalid category'),
  body('location.lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),
  body('location.lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude'),
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
];

const flagIssueValidation = [
  body('reason')
    .isIn(['inappropriate', 'spam', 'duplicate', 'other'])
    .withMessage('Invalid flag reason'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description must be less than 200 characters')
];

const updateStatusValidation = [
  body('status')
    .isIn(['pending', 'in-progress', 'resolved', 'rejected'])
    .withMessage('Invalid status'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment must be less than 500 characters')
];

// Public routes
router.get('/', getIssues);

// Protected routes (specific routes first)
router.get('/user', protect, getUserIssues);
router.post('/', protect, createIssueValidation, handleValidationErrors, createIssue);

// Parameter routes (after specific routes)
router.get('/:id', getIssue);
router.post('/:id/flag', protect, flagIssueValidation, handleValidationErrors, flagIssue);
router.delete('/:id', protect, deleteIssue);

// Admin routes
router.patch('/:id/status', protect, admin, updateStatusValidation, handleValidationErrors, updateIssueStatus);

module.exports = router; 