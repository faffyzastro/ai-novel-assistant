const { getOpenAICompletion } = require('./openaiService');
const { getClaudeCompletion } = require('./claudeService');
const { getGeminiCompletion } = require('./geminiService');
const logger = require('../config/logger');
// Placeholder for future: const { getGeminiCompletion } = require('./geminiService');

// LLM provider list for round-robin or fallback
const llmProviders = [
  { name: 'openai', handler: getOpenAICompletion },
  { name: 'claude', handler: getClaudeCompletion },
  { name: 'gemini', handler: getGeminiCompletion },
  // { name: 'gemini', handler: getGeminiCompletion },
];

let currentProviderIndex = 0;

async function generateWithLLM(prompt) {
  const numProviders = llmProviders.length;
  for (let i = 0; i < numProviders; i++) {
    const providerIndex = (currentProviderIndex + i) % numProviders;
    const provider = llmProviders[providerIndex];
    try {
      logger.info(`Attempting to generate with LLM provider: ${provider.name}`);
      const result = await provider.handler(prompt);
      // If successful, update the last used provider index and return result
      currentProviderIndex = providerIndex;
      return result;
    } catch (error) {
      logger.error(`Error generating with ${provider.name}: ${error.message}`);
      // If it's the last provider and it failed, re-throw the error
      if (i === numProviders - 1) {
        throw new Error(`All LLM providers failed: ${error.message}`);
      }
    }
  }
}

module.exports = { generateWithLLM }; 