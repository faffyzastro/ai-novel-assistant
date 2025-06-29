const request = require('supertest');
const express = require('express');
const { sequelize, User, Story, Feedback } = require('../models');
const feedbackRoutes = require('../routes/feedbackRoutes');

const app = express();
app.use(express.json());
app.use('/api/feedback', feedbackRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true });
  // Create a test user and story
  await User.create({ id: 1, username: 'testuser', email: 'test@example.com', password: 'pass' });
  await Story.create({ id: 1, title: 'Test Story', userId: 1 });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Feedback API', () => {
  it('should create feedback', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({ userId: 1, storyId: 1, content: 'Great story!', rating: 5 });
    expect(res.statusCode).toBe(201);
    expect(res.body.content).toBe('Great story!');
    expect(res.body.rating).toBe(5);
  });

  it('should fetch feedback for a story', async () => {
    const res = await request(app)
      .get('/api/feedback/story/1');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].content).toBe('Great story!');
  });
}); 