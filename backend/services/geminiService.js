const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=AIzaSyAlERFVM2dsVTi_PGGFKveNr8aOqjD68pI`;

async function getGeminiCompletion(prompt) {
  try {
    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

module.exports = { getGeminiCompletion }; 