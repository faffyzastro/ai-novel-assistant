const request = require('supertest');
const app = require('../app'); // Assuming your main app file is app.js
const sequelize = require('../config/database');
const Story = require('../models/story');
const Project = require('../models/Project');
const User = require('../models/user');

describe('Story API', () => {
  let testUser;
  let testProject;
  let authToken;

  beforeAll(async () => {
    // Synchronize database and create a test user and project
    await sequelize.sync({ force: true });

    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password_hash: 'hashedpassword' // In a real app, hash this properly
    });

    testProject = await Project.create({
      name: 'Test Project',
      description: 'A project for testing story API',
      user_id: testUser.id
    });

    // Simulate user login to get an auth token
    // In a real app, this would be a login endpoint that returns a JWT
    // For now, we'll create a dummy token or bypass authentication for tests if possible.
    // Since we just implemented authentication, let's create a simple JWT for testing.
    const jwt = require('jsonwebtoken');
    authToken = jwt.sign({ id: testUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a new story', async () => {
    const res = await request(app)
      .post('/api/stories')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'My First Story',
        synopsis: 'A short story about testing',
        genre: 'Fantasy',
        projectId: testProject.id
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toEqual('My First Story');
    expect(res.body.projectId).toEqual(testProject.id);
  });

  it('should get all stories', async () => {
    const res = await request(app)
      .get('/api/stories')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].title).toEqual('My First Story');
  });

  it('should get a single story by ID', async () => {
    const story = await Story.create({
      title: 'Another Story',
      synopsis: 'Another test story',
      genre: 'Sci-Fi',
      projectId: testProject.id
    });

    const res = await request(app)
      .get(`/api/stories/${story.id}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual('Another Story');
  });

  it('should update a story', async () => {
    const story = await Story.create({
      title: 'Story to Update',
      synopsis: 'Update me',
      genre: 'Drama',
      projectId: testProject.id
    });

    const res = await request(app)
      .put(`/api/stories/${story.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Updated Story Title',
        synopsis: 'I have been updated',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual('Updated Story Title');
  });

  it('should delete a story', async () => {
    const story = await Story.create({
      title: 'Story to Delete',
      synopsis: 'Delete me',
      genre: 'Thriller',
      projectId: testProject.id
    });

    const res = await request(app)
      .delete(`/api/stories/${story.id}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(204);

    const deletedStory = await Story.findByPk(story.id);
    expect(deletedStory).toBeNull();
  });

  describe('Story Export', () => {
    let testStory;

    beforeEach(async () => {
      testStory = await Story.create({
        title: 'Export Test Story',
        synopsis: 'A story for testing export functionality',
        genre: 'Test',
        content: 'This is test content for export',
        projectId: testProject.id
      });
    });

    it('should export story as PDF', async () => {
      const res = await request(app)
        .get(`/api/stories/${testStory.id}/export`)
        .set('Authorization', `Bearer ${authToken}`)
        .query({ format: 'pdf' });

      expect(res.statusCode).toEqual(200);
      expect(res.headers['content-type']).toEqual('application/pdf');
      expect(res.headers['content-disposition']).toContain('filename="export_test_story.pdf"');
    });

    it('should export story as TXT', async () => {
      const res = await request(app)
        .get(`/api/stories/${testStory.id}/export`)
        .set('Authorization', `Bearer ${authToken}`)
        .query({ format: 'txt' });

      expect(res.statusCode).toEqual(200);
      expect(res.headers['content-type']).toEqual('text/plain');
      expect(res.headers['content-disposition']).toContain('filename="export_test_story.txt"');
      expect(res.text).toContain('Title: Export Test Story');
      expect(res.text).toContain('This is test content for export');
    });

    it('should handle invalid story ID', async () => {
      const res = await request(app)
        .get('/api/stories/999999/export')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ format: 'pdf' });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Story not found');
    });

    it('should handle invalid export format', async () => {
      const res = await request(app)
        .get(`/api/stories/${testStory.id}/export`)
        .set('Authorization', `Bearer ${authToken}`)
        .query({ format: 'invalid' });

      expect(res.statusCode).toEqual(200); // Defaults to txt format
      expect(res.headers['content-type']).toEqual('text/plain');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get(`/api/stories/${testStory.id}/export`)
        .query({ format: 'pdf' });

      expect(res.statusCode).toEqual(401);
    });
  });
}); 