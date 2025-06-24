const { getOpenAICompletion } = require('./openaiService');
const { getClaudeCompletion } = require('./claudeService');
const { getGeminiCompletion } = require('./geminiService');
// Placeholder for future: const { getGeminiCompletion } = require('./geminiService');

// LLM provider list for round-robin or fallback
const llmProviders = [
  { name: 'openai', handler: getOpenAICompletion },
  { name: 'claude', handler: getClaudeCompletion },
  { name: 'gemini', handler: getGeminiCompletion },
  // { name: 'gemini', handler: getGeminiCompletion },
];

// For now, always use OpenAI. Later, add load balancing/fallback logic.
async function generateWithLLM(prompt) {
  // In the future, you can add logic to pick a provider or fallback
  try {
    return await llmProviders[0].handler(prompt);
  } catch (error) {
    // In the future, try next provider if error
    throw error;
  }
}

module.exports = { generateWithLLM }; 