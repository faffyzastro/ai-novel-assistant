const { getOpenAICompletion } = require('./openaiService');
const { getClaudeCompletion } = require('./claudeService');
const { getGeminiCompletion } = require('./geminiService');
const { getCache, setCache } = require('./cacheService');
// Placeholder for future: const { getGeminiCompletion } = require('./geminiService');

// LLM provider list for round-robin or fallback
const llmProviders = [
  { name: 'openai', handler: getOpenAICompletion },
  { name: 'claude', handler: getClaudeCompletion },
  { name: 'gemini', handler: getGeminiCompletion },
  // { name: 'gemini', handler: getGeminiCompletion },
];

// Try each provider in order; fallback if one fails
// Use cache for repeated prompts
async function generateWithLLM(prompt) {
  // Check cache first
  const cached = getCache(prompt);
  if (cached) {
    return cached;
  }
  let lastError = null;
  for (const provider of llmProviders) {
    try {
      // Attempt to generate with this provider
      const result = await provider.handler(prompt);
      setCache(prompt, result); // Cache the result
      return result;
    } catch (error) {
      lastError = error;
      // Log and try next provider
      console.warn(`LLM provider ${provider.name} failed:`, error.message);
    }
  }
  // If all providers fail, throw the last error
  throw lastError || new Error('All LLM providers failed');
}

module.exports = { generateWithLLM }; 