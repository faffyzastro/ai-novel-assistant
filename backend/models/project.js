const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const User = require('./user');

const Project = sequelize.define('Project', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
});

User.hasMany(Project, { foreignKey: 'userId' });
Project.belongsTo(User, { foreignKey: 'userId' });

module.exports = Project;