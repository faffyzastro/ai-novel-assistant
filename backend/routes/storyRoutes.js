const express = require('express');
const router = express.Router();
const { createStory } = require('../controllers/storyController');

router.post('/', createStory);

module.exports = router;