const { Feedback, User, Story } = require('../models');

// Create new feedback
exports.createFeedback = async (req, res) => {
  try {
    const { userId, storyId, content, rating } = req.body;
    if (!userId || !storyId || !content) {
      return res.status(400).json({ error: 'userId, storyId, and content are required.' });
    }
    // Check if user and story exist
    const user = await User.findByPk(userId);
    const story = await Story.findByPk(storyId);
    if (!user || !story) {
      return res.status(404).json({ error: 'User or Story not found.' });
    }
    // Optionally prevent duplicate feedback by same user for same story
    // const existing = await Feedback.findOne({ where: { userId, storyId } });
    // if (existing) return res.status(409).json({ error: 'Feedback already exists for this user and story.' });
    const feedback = await Feedback.create({ userId, storyId, content, rating });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create feedback', details: err.message });
  }
};

// Get all feedback for a story
exports.getFeedbackByStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const feedback = await Feedback.findAll({
      where: { storyId },
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback for story', details: err.message });
  }
};

// Get all feedback by a user
exports.getFeedbackByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const feedback = await Feedback.findAll({
      where: { userId },
      include: [{ model: Story, as: 'story', attributes: ['id', 'title'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback by user', details: err.message });
  }
};

// Get all feedback (admin or analytics)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'email'] },
        { model: Story, as: 'story', attributes: ['id', 'title'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all feedback', details: err.message });
  }
};

// Update feedback (content/rating)
exports.updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, rating } = req.body;
    const feedback = await Feedback.findByPk(id);
    if (!feedback) return res.status(404).json({ error: 'Feedback not found.' });
    if (content !== undefined) feedback.content = content;
    if (rating !== undefined) feedback.rating = rating;
    await feedback.save();
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update feedback', details: err.message });
  }
};

// Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByPk(id);
    if (!feedback) return res.status(404).json({ error: 'Feedback not found.' });
    await feedback.destroy();
    res.json({ message: 'Feedback deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete feedback', details: err.message });
  }
}; 