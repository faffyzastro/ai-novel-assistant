const axios = require('axios');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

async function getClaudeCompletion(prompt) {
  try {
    const response = await axios.post(
      ANTHROPIC_API_URL,
      {
        model: 'claude-2.1', // or another model you have access to
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

module.exports = { getClaudeCompletion }; 