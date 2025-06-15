import api from './api';

interface LLMGenerateParams {
  prompt: string;
}

/**
 * Generates text using the backend's LLM gateway service.
 * @param {string} prompt - The prompt for the LLM.
 * @returns {Promise<string>} The generated text from the LLM.
 */
export async function generateTextWithLLMGateway(prompt: string): Promise<string> {
  const response = await api.post<string>('/llm/generate', { prompt });
  return response.data;
}

/**
 * Calls the OpenAI LLM directly via the backend.
 * @param {string} prompt - The prompt for OpenAI.
 * @returns {Promise<string>} The completion from OpenAI.
 */
export async function getOpenAICompletion(prompt: string): Promise<string> {
  const response = await api.post<string>('/llm/openai', { prompt });
  return response.data;
}

/**
 * Calls the Anthropic Claude LLM directly via the backend.
 * @param {string} prompt - The prompt for Claude.
 * @returns {Promise<string>} The completion from Claude.
 */
export async function getClaudeCompletion(prompt: string): Promise<string> {
  const response = await api.post<string>('/llm/claude', { prompt });
  return response.data;
}

/**
 * Calls the Google Gemini LLM directly via the backend.
 * @param {string} prompt - The prompt for Gemini.
 * @returns {Promise<string>} The completion from Gemini.
 */
export async function getGeminiCompletion(prompt: string): Promise<string> {
  const response = await api.post<string>('/llm/gemini', { prompt });
  return response.data;
} 