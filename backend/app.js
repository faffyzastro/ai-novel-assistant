require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const sequelize = require('./config/database'); // Your Sequelize database connection
const cors = require('cors'); // Import cors for cross-origin requests

// Import your existing routes
const storyRoutes = require('./routes/storyRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const llmRoutes = require('./routes/llm.js');

// Import the new authentication routes
const authRoutes = require('./routes/authRoutes'); // Assuming you've created this file as discussed

const app = express();

// --- Middleware ---
// Enable CORS for all origins. In a production environment, you should configure this
// to be more restrictive (e.g., only allow requests from your frontend's domain).
app.use(cors());

// Body parser for JSON requests. This is essential for handling POST/PUT request bodies.
app.use(express.json());
// Body parser for URL-encoded form data (less common for APIs, but good to have).
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
// Health check endpoint
app.get('/', (req, res) => res.send('AI Novel Assistant API Running!'));

// Mount your API routes
app.use('/api/stories', storyRoutes);
app.use('/api/users', userRoutes); // User management (e.g., creating users via registration)
app.use('/api/projects', projectRoutes);
app.use('/api/llm', llmRoutes);

// NEW: Mount your authentication routes.
// We're mounting it under '/api' so your login endpoint becomes '/api/login'.
app.use('/api', authRoutes);

// --- Server Start and Database Connection ---
const PORT = process.env.PORT || 8000;

// Listen for incoming requests
app.listen(PORT, async () => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('✅ Database connected.');

    // Sync Sequelize models with the database.
    // `force: false` means it won't drop tables if they already exist.
    // Use `force: true` ONLY for development if you want to clear your DB and recreate tables on every restart.
    await sequelize.sync({ force: false });
    console.log('✅ Tables synced.');

    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (err) {
    // Log any errors that occur during database connection or server startup
    console.error('❌ Startup error:', err.message);
    // Optionally exit the process if the database connection fails
    process.exit(1);
  }
});