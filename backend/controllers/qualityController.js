const { analyzeQuality } = require('../services/qualityService');

// POST /api/quality/analyze
exports.analyzeStory = (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Story text is required.' });
    }
    const result = analyzeQuality(text);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to analyze story', details: err.message });
  }
}; 