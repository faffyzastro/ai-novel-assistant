const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Rating extends Model {
    static associate(models) {
      Rating.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Rating.belongsTo(models.Story, { foreignKey: 'storyId', as: 'story' });
    }
  }
  Rating.init(
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
      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
    },
    {
      sequelize,
      modelName: 'Rating',
      tableName: 'ratings',
      timestamps: true,
    }
  );
  return Rating;
}; 