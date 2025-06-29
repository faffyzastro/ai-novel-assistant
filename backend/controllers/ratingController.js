const { Rating, User, Story } = require('../models');

// POST /api/ratings
exports.createOrUpdateRating = async (req, res) => {
  try {
    const { userId, storyId, value } = req.body;
    if (!userId || !storyId || value === undefined) {
      return res.status(400).json({ error: 'userId, storyId, and value are required.' });
    }
    if (value < 1 || value > 5) {
      return res.status(400).json({ error: 'Rating value must be between 1 and 5.' });
    }
    // Check user and story exist
    const user = await User.findByPk(userId);
    const story = await Story.findByPk(storyId);
    if (!user || !story) {
      return res.status(404).json({ error: 'User or Story not found.' });
    }
    // Upsert: one rating per user per story
    let rating = await Rating.findOne({ where: { userId, storyId } });
    if (rating) {
      rating.value = value;
      await rating.save();
    } else {
      rating = await Rating.create({ userId, storyId, value });
    }
    res.status(201).json(rating);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create/update rating', details: err.message });
  }
};

// GET /api/ratings/story/:storyId
exports.getRatingsByStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const ratings = await Rating.findAll({
      where: { storyId },
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ratings for story', details: err.message });
  }
};

// GET /api/ratings/story/:storyId/average
exports.getAverageRatingForStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const result = await Rating.findAll({
      where: { storyId },
      attributes: [[Rating.sequelize.fn('AVG', Rating.sequelize.col('value')), 'avgRating']],
    });
    const avgRating = result[0]?.dataValues?.avgRating || 0;
    res.json({ storyId, avgRating: parseFloat(avgRating) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch average rating', details: err.message });
  }
};

// GET /api/ratings/user/:userId
exports.getRatingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await Rating.findAll({
      where: { userId },
      include: [{ model: Story, as: 'story', attributes: ['id', 'title'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ratings by user', details: err.message });
  }
};

// DELETE /api/ratings/:id
exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const rating = await Rating.findByPk(id);
    if (!rating) return res.status(404).json({ error: 'Rating not found.' });
    await rating.destroy();
    res.json({ message: 'Rating deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete rating', details: err.message });
  }
}; 