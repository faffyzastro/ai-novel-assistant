require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const { syncDatabase } = require('./config/database');
const storyRoutes = require('./routes/storyRoutes');
const usersRoutes = require('./routes/users');
const projectsRoutes = require('./routes/projects');
const llmRoutes = require('./routes/llm.js');
const logger = require('./config/logger');

const app = express();
app.use(express.json());

// Routes
app.use('/api/stories', storyRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/llm', llmRoutes);

// Health check endpoint
app.get('/', (req, res) => res.send('AI Novel Assistant API Running!'));

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

  res.status(statusCode).json({
    message: message,
    error: process.env.NODE_ENV === 'production' ? {} : err.stack // Send stack trace only in development
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