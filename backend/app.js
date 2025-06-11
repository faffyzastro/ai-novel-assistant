require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const storyRoutes = require('./routes/storyRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const llmRoutes = require('./routes/llm.js');

const app = express();
app.use(express.json());

// Routes
app.use('/api/stories', storyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/llm', llmRoutes);

// Health check endpoint
app.get('/', (req, res) => res.send('AI Novel Assistant API Running!'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected.');
    await sequelize.sync();
    console.log('✅ Tables synced.');
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (err) {
    console.error('❌ Startup error:', err.message);
  }
});