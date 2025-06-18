const request = require('supertest');
const { expect } = require('chai');
const app = require('../app'); // Your Express app
const sequelize = require('../config/database');
const User = require('../models/user');
const Project = require('../models/Project');

describe('User and Project API', () => {
  let userId;
  let projectId;
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  };
  const testProject = {
    name: 'My First Novel',
    description: 'A thrilling adventure story.',
    genre: 'Fantasy',
    keywords: 'adventure, magic, dragons',
    tone: 'Epic',
    setting: 'Medieval Europe',
    length_preference: '500 words per scene'
  };

  before(async () => {
    // Ensure database is clean before running tests
    await sequelize.sync({ force: true });
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send(testUser);

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.username).to.equal(testUser.username);
    userId = res.body.id; // Save user ID for later tests
  });

  it('should login the registered user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: testUser.username,
        password: testUser.password
      });

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('message').and.equal('Login successful');
    expect(res.body.user).to.have.property('id').and.equal(userId);
  });

  it('should create a new project for the authenticated user', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('x-test-user-id', userId)
      .send(testProject);

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.name).to.equal(testProject.name);
    expect(res.body.user_id).to.equal(userId); // Ensure project is linked to the user
    projectId = res.body.id;
  });

  it('should get all projects for the authenticated user', async () => {
    const res = await request(app)
      .get('/api/projects')
      .set('x-test-user-id', userId);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array').that.has.lengthOf(1);
    expect(res.body[0].id).to.equal(projectId);
    expect(res.body[0].user_id).to.equal(userId);
  });

  it('should get a specific project for the authenticated user', async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}`)
      .set('x-test-user-id', userId);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('id').and.equal(projectId);
    expect(res.body.user_id).to.equal(userId);
  });

  it('should update a specific project for the authenticated user', async () => {
    const updatedName = 'My Updated Novel';
    const res = await request(app)
      .put(`/api/projects/${projectId}`)
      .set('x-test-user-id', userId)
      .send({ name: updatedName });

    expect(res.statusCode).to.equal(200);
    expect(res.body.name).to.equal(updatedName);
    expect(res.body.user_id).to.equal(userId);
  });

  it('should delete a specific project for the authenticated user', async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set('x-test-user-id', userId);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('message').and.equal('Project deleted successfully');

    // Verify the project is no longer there
    const getRes = await request(app)
      .get(`/api/projects/${projectId}`)
      .set('x-test-user-id', userId);
    expect(getRes.statusCode).to.equal(404);
  });
}); 