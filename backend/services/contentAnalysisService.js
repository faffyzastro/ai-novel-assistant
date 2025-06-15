const { generateWithLLM } = require('./llmGatewayService');
const logger = require('../config/logger');

async function analyzeStoryContent(storyContent) {
  const prompt = `Analyze the following story content for coherence, style, and pacing. Provide a score out of 10 for each, and actionable feedback for improvement.

Story Content:
"""${storyContent}"""

Provide the output in a JSON format with keys: "coherence_score", "style_score", "pacing_score", "feedback": { "coherence": "", "style": "", "pacing": "" }.`;

  try {
    logger.info('Sending story content for LLM analysis.');
    const llmResponse = await generateWithLLM(prompt);
    
    // Attempt to parse the JSON response from the LLM
    const analysisResult = JSON.parse(llmResponse);

    // Basic validation of the parsed result
    if (
      typeof analysisResult.coherence_score !== 'number' ||
      typeof analysisResult.style_score !== 'number' ||
      typeof analysisResult.pacing_score !== 'number' ||
      !analysisResult.feedback ||
      typeof analysisResult.feedback.coherence !== 'string' ||
      typeof analysisResult.feedback.style !== 'string' ||
      typeof analysisResult.feedback.pacing !== 'string'
    ) {
      throw new Error('Invalid LLM response format for content analysis.');
    }

    logger.info('Story content analyzed successfully.', { analysisResult });
    return analysisResult;
  } catch (error) {
    logger.error('Error analyzing story content with LLM', { error: error.message });
    throw new Error(`Failed to analyze story content: ${error.message}`);
  }
}

module.exports = { analyzeStoryContent }; 