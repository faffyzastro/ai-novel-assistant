const express = require('express');
const router = express.Router();
const qualityController = require('../controllers/qualityController');

// Analyze story quality
router.post('/analyze', qualityController.analyzeStory); // POST /api/quality/analyze

module.exports = router; 