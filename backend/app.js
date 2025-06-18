require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sequelize = require('./config/database');
const { syncDatabase } = require('./config/database');
const storyRoutes = require('./routes/stories');
const usersRoutes = require('./routes/users');
const projectsRoutes = require('./routes/projects');
const llmRoutes = require('./routes/llm.js');
const logger = require('./config/logger');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration (change to your frontend port)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/stories', storyRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/llm', llmRoutes);

// Health check endpoint
app.get('/', (req, res) => res.json({ 
  message: 'AI Novel Assistant API Running!',
  version: '1.0.0',
  status: 'healthy'
}));

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, path: req.path, method: req.method, ip: req.ip });

  let statusCode = err.status || 500;
  let message = err.message || 'An unexpected error occurred';

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(', ');
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Handle authentication errors
  if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Authentication required';
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    error: process.env.NODE_ENV === 'production' ? {} : err.stack // Send stack trace only in development
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 8000;

// Export the app for testing, but keep the listen call for direct execution
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    try {
      await sequelize.authenticate();
      logger.info('✅ Database connected.');
      await syncDatabase();
      logger.info(`🚀 Server running at http://localhost:${PORT}`);
    } catch (err) {
      logger.error('❌ Startup error:', err.message, { stack: err.stack });
    }
  });
}

module.exports = app;
