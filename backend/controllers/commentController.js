const { Comment, User, Story } = require('../models');

// POST /api/comments
exports.createComment = async (req, res) => {
  try {
    const { userId, storyId, content, parentId } = req.body;
    if (!userId || !storyId || !content) {
      return res.status(400).json({ error: 'userId, storyId, and content are required.' });
    }
    // Check user and story exist
    const user = await User.findByPk(userId);
    const story = await Story.findByPk(storyId);
    if (!user || !story) {
      return res.status(404).json({ error: 'User or Story not found.' });
    }
    // If parentId provided, check parent exists and belongs to same story
    if (parentId) {
      const parent = await Comment.findByPk(parentId);
      if (!parent) return res.status(404).json({ error: 'Parent comment not found.' });
      if (parent.storyId !== parseInt(storyId, 10)) {
        return res.status(400).json({ error: 'Parent comment must belong to the same story.' });
      }
    }
    const comment = await Comment.create({ userId, storyId, content, parentId: parentId || null });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create comment', details: err.message });
  }
};

// GET /api/comments/story/:storyId
exports.getCommentsByStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    // Fetch all comments for the story, including user info and replies
    const comments = await Comment.findAll({
      where: { storyId },
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }],
      order: [['createdAt', 'ASC']],
    });
    // Build threaded structure
    const commentMap = {};
    comments.forEach(c => { commentMap[c.id] = { ...c.toJSON(), replies: [] }; });
    const roots = [];
    comments.forEach(c => {
      if (c.parentId && commentMap[c.parentId]) {
        commentMap[c.parentId].replies.push(commentMap[c.id]);
      } else {
        roots.push(commentMap[c.id]);
      }
    });
    res.json(roots);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments for story', details: err.message });
  }
};

// GET /api/comments/user/:userId
exports.getCommentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const comments = await Comment.findAll({
      where: { userId },
      include: [{ model: Story, as: 'story', attributes: ['id', 'title'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments by user', details: err.message });
  }
};

// PUT /api/comments/:id
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, userId } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required.' });
    const comment = await Comment.findByPk(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found.' });
    if (parseInt(userId, 10) !== comment.userId) {
      return res.status(403).json({ error: 'You can only edit your own comments.' });
    }
    comment.content = content;
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update comment', details: err.message });
  }
};

// DELETE /api/comments/:id
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, isAdmin } = req.body;
    const comment = await Comment.findByPk(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found.' });
    if (!isAdmin && parseInt(userId, 10) !== comment.userId) {
      return res.status(403).json({ error: 'You can only delete your own comments.' });
    }
    await comment.destroy();
    res.json({ message: 'Comment deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment', details: err.message });
  }
}; 