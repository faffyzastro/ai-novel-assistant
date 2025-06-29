const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class LearningData extends Model {
    static associate(models) {
      LearningData.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  LearningData.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
      },
      preferences: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
      },
      stats: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      modelName: 'LearningData',
      tableName: 'learning_data',
      timestamps: true,
    }
  );
  return LearningData;
}; 