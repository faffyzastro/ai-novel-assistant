const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

// Create or update a rating
router.post('/', ratingController.createOrUpdateRating); // POST /api/ratings

// Get all ratings for a story
router.get('/story/:storyId', ratingController.getRatingsByStory); // GET /api/ratings/story/:storyId

// Get average rating for a story
router.get('/story/:storyId/average', ratingController.getAverageRatingForStory); // GET /api/ratings/story/:storyId/average

// Get all ratings by a user
router.get('/user/:userId', ratingController.getRatingsByUser); // GET /api/ratings/user/:userId

// Delete a rating
router.delete('/:id', ratingController.deleteRating); // DELETE /api/ratings/:id

module.exports = router; 