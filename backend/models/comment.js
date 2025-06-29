const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Comment.belongsTo(models.Story, { foreignKey: 'storyId', as: 'story' });
      Comment.belongsTo(models.Comment, { foreignKey: 'parentId', as: 'parent', allowNull: true });
      Comment.hasMany(models.Comment, { foreignKey: 'parentId', as: 'replies' });
    }
  }
  Comment.init(
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
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Comments', key: 'id' },
      },
    },
    {
      sequelize,
      modelName: 'Comment',
      tableName: 'comments',
      timestamps: true,
    }
  );
  return Comment;
}; 