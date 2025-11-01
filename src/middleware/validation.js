const { body, param, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUser = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .trim()
    .withMessage('First name must be 1-50 characters long'),
  
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .trim()
    .withMessage('Last name must be 1-50 characters long'),
  
  handleValidationErrors
];

// Task validation rules
const validateTask = [
  body('title')
    .isLength({ min: 1, max: 200 })
    .trim()
    .withMessage('Title is required and must be 1-200 characters long'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .trim()
    .withMessage('Description must be less than 1000 characters'),
  
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .withMessage('Status must be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED'),
  
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Priority must be one of: LOW, MEDIUM, HIGH, URGENT'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Due date must be a valid date'),
  
  handleValidationErrors
];

// ID validation rules
const validateUserId = [
  param('userId')
    .isLength({ min: 1 })
    .withMessage('User ID is required'),
  
  handleValidationErrors
];

const validateTaskId = [
  param('id')
    .isLength({ min: 1 })
    .withMessage('Task ID is required'),
  
  handleValidationErrors
];

module.exports = {
  validateUser,
  validateTask,
  validateUserId,
  validateTaskId,
  handleValidationErrors
};