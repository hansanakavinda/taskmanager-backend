const prisma = require('../utils/database');
const asyncHandler = require('../middleware/asyncHandler');

class TaskController {
  // Get all tasks
  getAllTasks = asyncHandler(async (req, res) => {
    const { search, status, priority, userId, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (userId) where.userId = userId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.task.count({ where })
    ]);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      message: 'Tasks retrieved successfully'
    });
  });

  // Get task by ID
  getTaskById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task,
      message: 'Task retrieved successfully'
    });
  });

  // Create new task
  createTask = asyncHandler(async (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      }
    });

    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully'
    });
  });

  // Update task
  updateTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    // Check if task exists
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Handle completion status
    const updateData = {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
    };

    if (status === 'COMPLETED' && existingTask.status !== 'COMPLETED') {
      updateData.completedAt = new Date();
    } else if (status !== 'COMPLETED') {
      updateData.completedAt = null;
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: updatedTask,
      message: 'Task updated successfully'
    });
  });

  // Delete task
  deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if task exists
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await prisma.task.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  });

  // Get tasks by user ID
  getTasksByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { status, priority } = req.query;

    // Build where clause
    const where = { userId };
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const tasks = await prisma.task.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: tasks,
      message: 'User tasks retrieved successfully'
    });
  });

  // Assign task to user
  assignTaskToUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    // Verify user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: updatedTask,
      message: 'Task assigned successfully'
    });
  });

  updateTaskStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    // Check if task exists
    const existingTask = await prisma.task.findUnique({ where: { id } }); 
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    // Handle completion status
    const updateData = { status };
    if (status === 'COMPLETED' && existingTask.status !== 'COMPLETED') {
      updateData.completedAt = new Date();
    } else if (status !== 'COMPLETED') {
      updateData.completedAt = null;
    }
    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: updatedTask,
      message: 'Task status updated successfully'
    });
  });

}

module.exports = new TaskController();