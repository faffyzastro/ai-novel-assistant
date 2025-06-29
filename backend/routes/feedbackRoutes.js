const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Create feedback
router.post('/', feedbackController.createFeedback); // POST /api/feedback

// Get all feedback for a story
router.get('/story/:storyId', feedbackController.getFeedbackByStory); // GET /api/feedback/story/:storyId

// Get all feedback by a user
router.get('/user/:userId', feedbackController.getFeedbackByUser); // GET /api/feedback/user/:userId

// Get all feedback (admin/analytics)
router.get('/', feedbackController.getAllFeedback); // GET /api/feedback

// Update feedback
router.put('/:id', feedbackController.updateFeedback); // PUT /api/feedback/:id

// Delete feedback
router.delete('/:id', feedbackController.deleteFeedback); // DELETE /api/feedback/:id

module.exports = router; 