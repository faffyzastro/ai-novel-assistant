const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Story = sequelize.define('Story', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  synopsis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'in_progress', 'completed'),
    defaultValue: 'draft'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Story;