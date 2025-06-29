const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Project extends Model {
    static associate(models) {
      Project.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Project.hasMany(models.Story, { foreignKey: 'projectId', as: 'stories' });
    }
  }
  Project.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
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
    modelName: 'Project',
    tableName: 'projects',
    timestamps: true,
  });
  return Project;
};