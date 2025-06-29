const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 8000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected.');
    await sequelize.sync(); // Sync tables
    console.log('✅ Tables synced.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
})(); 