const request = require('supertest');
const app = require('../app');
const sinon = require('sinon');
const { generateWithLLM } = require('../services/llmGatewayService');
const { getOpenAICompletion } = require('../services/openaiService');
const { getClaudeCompletion } = require('../services/claudeService');
const { getGeminiCompletion } = require('../services/geminiService');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sequelize = require('../config/database');

describe('LLM API', () => {
  let generateWithLLMStub;
  let openAICallStub;
  let claudeCallStub;
  let geminiCallStub;
  let testUser;
  let authToken;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    testUser = await User.create({
      username: 'llmtestuser',
      email: 'llmtest@example.com',
      password_hash: 'hashedpassword'
    });
    authToken = jwt.sign({ id: testUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Stub the actual LLM service calls
    generateWithLLMStub = sinon.stub(require('../services/llmGatewayService'), 'generateWithLLM');
    openAICallStub = sinon.stub(require('../services/openaiService'), 'getOpenAICompletion');
    claudeCallStub = sinon.stub(require('../services/claudeService'), 'getClaudeCompletion');
    geminiCallStub = sinon.stub(require('../services/geminiService'), 'getGeminiCompletion');
  });

  afterEach(() => {
    sinon.reset(); // Reset stub behavior after each test
  });

  afterAll(async () => {
    sinon.restore(); // Restore original functions
    await sequelize.close();
  });

  it('should generate text using the LLM gateway service', async () => {
    generateWithLLMStub.returns(Promise.resolve('Generated response from gateway'));

    const res = await request(app)
      .post('/api/llm/generate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ prompt: 'Write a short story.' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('Generated response from gateway');
    expect(generateWithLLMStub.calledOnce).toBe(true);
    expect(generateWithLLMStub.calledWith('Write a short story.')).toBe(true);
  });

  it('should handle LLM gateway service errors', async () => {
    generateWithLLMStub.throws(new Error('LLM Gateway error'));

    const res = await request(app)
      .post('/api/llm/generate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ prompt: 'Write a short story.' });

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toEqual('LLM Gateway error');
  });

  it('should get completion from OpenAI', async () => {
    openAICallStub.returns(Promise.resolve('OpenAI completion response'));

    const res = await request(app)
      .post('/api/llm/openai')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ prompt: 'Hello OpenAI' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('OpenAI completion response');
    expect(openAICallStub.calledOnce).toBe(true);
    expect(openAICallStub.calledWith('Hello OpenAI')).toBe(true);
  });

  it('should get completion from Claude', async () => {
    claudeCallStub.returns(Promise.resolve('Claude completion response'));

    const res = await request(app)
      .post('/api/llm/claude')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ prompt: 'Hello Claude' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('Claude completion response');
    expect(claudeCallStub.calledOnce).toBe(true);
    expect(claudeCallStub.calledWith('Hello Claude')).toBe(true);
  });

  it('should get completion from Gemini', async () => {
    geminiCallStub.returns(Promise.resolve('Gemini completion response'));

    const res = await request(app)
      .post('/api/llm/gemini')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ prompt: 'Hello Gemini' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('Gemini completion response');
    expect(geminiCallStub.calledOnce).toBe(true);
    expect(geminiCallStub.calledWith('Hello Gemini')).toBe(true);
  });
}); 