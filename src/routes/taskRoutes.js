const express = require('express');
const taskController = require('../controllers/taskController');
const { validateTask, validateTaskId, validateUserId } = require('../middleware/validation');

const router = express.Router();

// GET /api/tasks - Get all tasks (with optional filters)
router.get('/', taskController.getAllTasks);

// GET /api/tasks/:id - Get task by ID
router.get('/:id', validateTaskId, taskController.getTaskById);

// POST /api/tasks - Create new task
router.post('/', validateTask, taskController.createTask);

// PUT /api/tasks/:id - Update task
router.put('/:id', validateTaskId, validateTask, taskController.updateTask);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', validateTaskId, taskController.deleteTask);

// GET /api/tasks/user/:userId - Get tasks by user ID
router.get('/user/:userId', validateUserId, taskController.getTasksByUserId);

router.patch('/:id/assign', validateTaskId, taskController.assignTaskToUser);

router.patch('/:id/status', validateTaskId, taskController.updateTaskStatus);

module.exports = router;