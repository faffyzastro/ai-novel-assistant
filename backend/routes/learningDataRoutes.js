const express = require('express');
const router = express.Router();
const learningDataController = require('../controllers/learningDataController');

// Get learning data for a user
router.get('/:userId', learningDataController.getLearningData); // GET /api/learning/:userId

// Update learning data for a user
router.put('/:userId', learningDataController.updateLearningData); // PUT /api/learning/:userId

// Reset learning data for a user
router.delete('/:userId', learningDataController.resetLearningData); // DELETE /api/learning/:userId

module.exports = router; 