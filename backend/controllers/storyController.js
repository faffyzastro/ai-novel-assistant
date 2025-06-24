const Story = require('../models/story');

exports.createStory = async (req, res) => {
  try {
    const story = await Story.create(req.body);
    res.status(201).json(story);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};