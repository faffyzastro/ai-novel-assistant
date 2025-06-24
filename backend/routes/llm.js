const express = require('express');
const router = express.Router();
const { getOpenAICompletion } = require('../services/openaiService');
const { generateWithLLM } = require('../services/llmGatewayService');
const { getClaudeCompletion } = require('../services/claudeService');
const { getGeminiCompletion } = require('../services/geminiService');

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


// GET /api/llm/test
router.get('/test', (req, res) => {
  res.json({ message: 'LLM route working ✅' });
});


// POST /api/llm/generate
router.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required.' });
  }
  try {
    const result = await generateWithLLM(prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'LLM Gateway error', error });
  }
});

// POST /api/llm/claude
router.post('/claude', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required.' });
  }
  try {
    const result = await getClaudeCompletion(prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Claude API error', error });
  }
});

// POST /api/llm/gemini
router.post('/gemini', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required.' });
  }
  try {
    const result = await getGeminiCompletion(prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Gemini API error', error });
  }
});

module.exports = router;