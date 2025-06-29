function analyzeQuality(text) {
  if (!text || typeof text !== 'string') {
    return { error: 'No text provided.' };
  }
  // Length metrics
  const wordCount = text.trim().split(/\s+/).length;
  const charCount = text.length;

  // Sentence and paragraph metrics
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const paragraphs = text.split(/\n{2,}/).filter(Boolean);
  const avgSentenceLength = sentences.length ? (wordCount / sentences.length) : 0;
  const avgParagraphLength = paragraphs.length ? (wordCount / paragraphs.length) : 0;

  // Vocabulary diversity
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const uniqueWords = new Set(words);
  const vocabDiversity = words.length ? (uniqueWords.size / words.length) : 0;

  // Coherence (simple: repeated words ratio)
  const wordFreq = {};
  words.forEach(w => { wordFreq[w] = (wordFreq[w] || 0) + 1; });
  const repeatedWords = Object.values(wordFreq).filter(c => c > 3).length;
  const coherenceScore = 1 - (repeatedWords / (uniqueWords.size || 1));

  // Pacing (variation in sentence length)
  const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
  const pacingVar = sentenceLengths.length ? (Math.max(...sentenceLengths) - Math.min(...sentenceLengths)) : 0;

  return {
    wordCount,
    charCount,
    avgSentenceLength: Number(avgSentenceLength.toFixed(2)),
    avgParagraphLength: Number(avgParagraphLength.toFixed(2)),
    vocabDiversity: Number(vocabDiversity.toFixed(3)),
    coherenceScore: Number(coherenceScore.toFixed(3)),
    pacingVar,
    feedback: [
      wordCount < 2000 ? 'Story is short; consider expanding.' : 'Good story length.',
      vocabDiversity < 0.3 ? 'Try using a wider range of words.' : 'Good vocabulary variety.',
      coherenceScore < 0.7 ? 'Watch for repeated words or phrases.' : 'Story seems coherent.',
      pacingVar < 5 ? 'Sentence lengths are very similar; vary pacing for interest.' : 'Good pacing variety.'
    ]
  };
}

module.exports = { analyzeQuality }; 