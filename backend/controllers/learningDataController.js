const { LearningData, User } = require('../models');

// GET /api/learning/:userId
exports.getLearningData = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await LearningData.findOne({ where: { userId } });
    if (!data) return res.status(404).json({ error: 'Learning data not found.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch learning data', details: err.message });
  }
};

// PUT /api/learning/:userId
exports.updateLearningData = async (req, res) => {
  try {
    const { userId } = req.params;
    const { preferences, stats } = req.body;
    let data = await LearningData.findOne({ where: { userId } });
    if (!data) {
      // Create if not exists
      data = await LearningData.create({ userId, preferences: preferences || {}, stats: stats || {} });
    } else {
      if (preferences) data.preferences = preferences;
      if (stats) data.stats = stats;
      await data.save();
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update learning data', details: err.message });
  }
};

// DELETE /api/learning/:userId
exports.resetLearningData = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await LearningData.findOne({ where: { userId } });
    if (!data) return res.status(404).json({ error: 'Learning data not found.' });
    data.preferences = {};
    data.stats = {};
    await data.save();
    res.json({ message: 'Learning data reset.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset learning data', details: err.message });
  }
}; 