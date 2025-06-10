const express = require('express');
const router = express.Router();
const { getOpenAICompletion } = require('../services/openaiService');

// POST /api/llm/openai
router.post('/openai', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required.' });
  }
  try {
    const result = await getOpenAICompletion(prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'OpenAI API error', error });
  }
});

module.exports = router; 