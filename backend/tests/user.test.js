const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('User API', () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create a test user for authentication
    testUser = await User.create({
      username: 'testuser_auth',
      email: 'test_auth@example.com',
      password_hash: await bcrypt.hash('password123', 10)
    });
    authToken = jwt.sign({ id: testUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        username: 'newuser',
        email: 'new@example.com',
        password: 'newpassword123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.username).toEqual('newuser');
    expect(res.body).not.toHaveProperty('password_hash'); // Ensure password hash is not returned
  });

  it('should get all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('username');
  });

  it('should get a single user by ID', async () => {
    const user = await User.create({
      username: 'singleuser',
      email: 'single@example.com',
      password_hash: await bcrypt.hash('singlepassword', 10)
    });

    const res = await request(app)
      .get(`/api/users/${user.id}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toEqual('singleuser');
  });

  it('should update a user', async () => {
    const user = await User.create({
      username: 'user_to_update',
      email: 'update@example.com',
      password_hash: await bcrypt.hash('updatepassword', 10)
    });

    const res = await request(app)
      .put(`/api/users/${user.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        username: 'updated_user',
        email: 'updated@example.com'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toEqual('updated_user');
  });

  it('should delete a user', async () => {
    const user = await User.create({
      username: 'user_to_delete',
      email: 'delete@example.com',
      password_hash: await bcrypt.hash('deletepassword', 10)
    });

    const res = await request(app)
      .delete(`/api/users/${user.id}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(204);

    const deletedUser = await User.findByPk(user.id);
    expect(deletedUser).toBeNull();
  });
}); 