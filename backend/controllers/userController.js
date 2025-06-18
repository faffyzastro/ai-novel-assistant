const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const logger = require('../config/logger');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        message: 'User with this email or username already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      password_hash: hashedPassword
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      }
    });
  } catch (error) {
    logger.error('Error creating user:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create user' 
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { email: username }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      }
    });

  } catch (error) {
    logger.error('Error logging in user:', error);
    res.status(500).json({ 
      success: false,
      message: 'Login failed' 
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }
    });
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user profile' 
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Check if new username/email already exists
    if (username || email) {
      const existingUser = await User.findOne({
        where: {
          [Op.and]: [
            { id: { [Op.ne]: req.user.id } },
            {
              [Op.or]: [
                ...(username ? [{ username }] : []),
                ...(email ? [{ email }] : [])
              ]
            }
          ]
        }
      });

      if (existingUser) {
        return res.status(409).json({ 
          success: false,
          message: 'Username or email already taken' 
        });
      }
    }

    await user.update({ username, email });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    logger.error('Error updating user profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update profile' 
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Current password and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'New password must be at least 6 characters long' 
      });
    }

    const user = await User.findByPk(req.user.id);

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await user.update({ password_hash: hashedPassword });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error('Error changing password:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to change password' 
    });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] }
    });
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch users' 
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash'] }
    });
    
    if (user) {
      res.json({
        success: true,
        data: user
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
  } catch (error) {
    logger.error('Error fetching user:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user' 
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Only allow users to delete their own account or admin to delete any
    if (user.id !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this user' 
      });
    }

    await user.destroy();
    
    res.json({ 
      success: true,
      message: 'User deleted successfully' 
    });
  } catch (error) {
    logger.error('Error deleting user:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete user' 
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  deleteUser
};