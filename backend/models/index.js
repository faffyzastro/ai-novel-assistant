const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database/ai-novel.sqlite'),
  logging: false,
});

// Import models
const User = require('./user')(sequelize);
const Project = require('./project')(sequelize);
const Story = require('./story')(sequelize);
const Feedback = require('./feedback')(sequelize);
const File = require('./file')(sequelize);
const Rating = require('./rating')(sequelize);
const Comment = require('./comment')(sequelize);
const LearningData = require('./learningData')(sequelize);

// Set up associations
if (User.associate) User.associate({ Project, Story, Feedback, File, Rating, Comment, LearningData });
if (Project.associate) Project.associate({ User, Story, Feedback, File, Rating, Comment });
if (Story.associate) Story.associate({ User, Project, Feedback, File, Rating, Comment });
if (Feedback.associate) Feedback.associate({ User, Story });
if (File.associate) File.associate({ User, Story });
if (Rating.associate) Rating.associate({ User, Story });
if (Comment.associate) Comment.associate({ User, Story, Comment });
if (LearningData.associate) LearningData.associate({ User });

module.exports = {
  sequelize,
  User,
  Project,
  Story,
  Feedback,
  File,
  Rating,
  Comment,
  LearningData,
};