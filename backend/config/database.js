const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database/stories.sqlite'),
  logging: false // Set to console.log to see SQL queries
});

// Removed authentication and sync logic from here. These should be handled
// explicitly in app.js for development/production and in test files for testing.

// This function is now only for schema creation, if needed explicitly.
// It's still here as it's used by the test for force-sync.
async function syncDatabase() {
  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  try {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await sequelize.query(schemaSql);
    console.log('Database schema synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database schema:', error);
  }
}

module.exports = sequelize;
module.exports.syncDatabase = syncDatabase; // Export syncDatabase if it's still needed elsewhere 