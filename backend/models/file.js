const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class File extends Model {
    static associate(models) {
      File.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      File.belongsTo(models.Story, { foreignKey: 'storyId', as: 'story' });
    }
  }
  File.init(
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
        allowNull: true,
        references: { model: 'Stories', key: 'id' },
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      originalName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mimetype: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      uploadDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'File',
      tableName: 'files',
      timestamps: true, // adds createdAt and updatedAt
    }
  );
  return File;
}; 