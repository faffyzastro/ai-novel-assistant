const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  deleteUser
} = require('../controllers/userController');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

// Input validation middleware
const validateRegistration = (req, res, next) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Username, email, and password are required' 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      success: false,
      message: 'Password must be at least 6 characters long' 
    });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ 
      success: false,
      message: 'Please provide a valid email address' 
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Username and password are required' 
    });
  }

  next();
};

const validatePasswordChange = (req, res, next) => {
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

  next();
};

// Public routes
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] }
    });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password_hash: hashedPassword
    });
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { email: username }
        ]
      }
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, validatePasswordChange, changePassword);

// Admin/User management routes
router.get('/', authenticate, getAllUsers);
router.get('/:id', authenticate, getUserById);
router.delete('/:id', authenticate, deleteUser);

module.exports = router; 