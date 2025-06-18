const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getOpenAICompletion } = require('../services/openaiService');
const { generateWithLLM } = require('../services/llmGatewayService');
const { getClaudeCompletion } = require('../services/claudeService');
const { getGeminiCompletion } = require('../services/geminiService');

// Apply authentication middleware to all LLM routes
router.use(authenticate);

// POST /api/llm/openai
router.post('/openai', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ 
      success: false,
      message: 'Prompt is required.' 
    });
  }
  try {
    const result = await getOpenAICompletion(prompt);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'OpenAI API error', 
      error: error.message 
    });
  }
});

// GET /api/llm/test
router.get('/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'LLM route working ✅',
    user: req.user.username 
  });
});

// POST /api/llm/generate
router.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ 
      success: false,
      message: 'Prompt is required.' 
    });
  }
  try {
    const result = await generateWithLLM(prompt);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'LLM Gateway error', 
      error: error.message 
    });
  }
});

// POST /api/llm/claude
router.post('/claude', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ 
      success: false,
      message: 'Prompt is required.' 
    });
  }
  try {
    const result = await getClaudeCompletion(prompt);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Claude API error', 
      error: error.message 
    });
  }
});

// POST /api/llm/gemini
router.post('/gemini', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ 
      success: false,
      message: 'Prompt is required.' 
    });
  }
  try {
    const result = await getGeminiCompletion(prompt);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Gemini API error', 
      error: error.message 
    });
  }
});

module.exports = router;