const axios = require('axios');

exports.generateWithN8n = async (req, res) => {
  try {
    const { prompt, genre, tone } = req.body;
    const n8nResponse = await axios.post(
      'https://n8nromeo123987.app.n8n.cloud/webhook/53c136fe-3e77-4709-a143-fe82746dd8b6/chat',
      { prompt, genre, tone }
    );
    res.json(n8nResponse.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate story', details: err.message });
  }
}; 