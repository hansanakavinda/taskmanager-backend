const prisma = require('../utils/database');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../middleware/asyncHandler');

class UserController {
  // Get all users
  getAllUsers = asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { tasks: true }
        }
      }
    });

    res.json({
      success: true,
      data: users,
      message: 'Users retrieved successfully'
    });
  });

  // Get user by ID
  getUserById = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            dueDate: true,
            createdAt: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user,
      message: 'User retrieved successfully'
    });
  });

  // Create new user
  createUser = asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    console.log("hit create user");
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        createdAt: true
      }
    });

    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    });
  });

  // Update user
  updateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { email, firstName, lastName } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        firstName,
        lastName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  });

  // Delete user
  deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user (tasks will be cascade deleted)
    await prisma.user.delete({ where: { id: userId } });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  });
}

module.exports = new UserController();