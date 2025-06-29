const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Story extends Model {
    static associate(models) {
      Story.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
      // Add other associations as needed (e.g., User, Feedback, etc.)
    }
  }
  Story.init({
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
        model: 'Projects',
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
    }
  }, {
    sequelize,
    modelName: 'Story',
    tableName: 'stories',
    timestamps: true,
  });
  return Story;
};