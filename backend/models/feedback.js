const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Feedback extends Model {
    static associate(models) {
      // Feedback belongs to User
      Feedback.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      // Feedback belongs to Story
      Feedback.belongsTo(models.Story, { foreignKey: 'storyId', as: 'story' });
    }
  }
  Feedback.init(
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
      storyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Stories', key: 'id' },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5,
        },
      },
    },
    {
      sequelize,
      modelName: 'Feedback',
      tableName: 'feedback',
      timestamps: true, // adds createdAt and updatedAt
    }
  );
  return Feedback;
}; 