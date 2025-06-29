const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Create a comment (or reply)
router.post('/', commentController.createComment); // POST /api/comments

// Get all comments for a story (threaded)
router.get('/story/:storyId', commentController.getCommentsByStory); // GET /api/comments/story/:storyId

// Get all comments by a user
router.get('/user/:userId', commentController.getCommentsByUser); // GET /api/comments/user/:userId

// Update a comment
router.put('/:id', commentController.updateComment); // PUT /api/comments/:id

// Delete a comment
router.delete('/:id', commentController.deleteComment); // DELETE /api/comments/:id

module.exports = router; 