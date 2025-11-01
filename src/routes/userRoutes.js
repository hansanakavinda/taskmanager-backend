const express = require('express');
const userController = require('../controllers/userController');
const { validateUser, validateUserId } = require('../middleware/validation');

const router = express.Router();

// GET /api/users - Get all users
router.get('/', userController.getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:userId', validateUserId, userController.getUserById);

// POST /api/users - Create new user
router.post('/', validateUser, userController.createUser);

// PUT /api/users/:id - Update user
router.put('/:userId', validateUserId, validateUser, userController.updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:userId', validateUserId, userController.deleteUser);

module.exports = router;