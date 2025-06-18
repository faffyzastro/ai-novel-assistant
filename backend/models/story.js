const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Project = require('./Project');

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
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Project,
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  coherence_score: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  style_score: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  pacing_score: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  feedback: {
    type: DataTypes.JSONB, // Use JSONB for structured feedback
    allowNull: true
  }
}, {
  indexes: [
    { fields: ['projectId'] },
    { fields: ['status'] },
    { fields: ['genre'] }
  ]
});

Project.hasMany(Story, { foreignKey: 'projectId' });
Story.belongsTo(Project, { foreignKey: 'projectId' });

module.exports = Story;