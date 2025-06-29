require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Mount routes
app.use('/api/stories', require('./routes/storyRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/llm', require('./routes/llm'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));
app.use('/api/ratings', require('./routes/ratingRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/quality', require('./routes/qualityRoutes'));
app.use('/api/learning', require('./routes/learningDataRoutes'));

// Default root route
app.get('/', (req, res) => {
  res.send('✅ AI Novel Backend is Running');
});

// Error handler (after all routes)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
