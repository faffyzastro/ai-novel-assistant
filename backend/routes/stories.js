const express = require('express');
const router = express.Router();
const Story = require('../models/Story');

// Get all stories
router.get('/', async (req, res) => {
  try {
    const stories = await Story.findAll();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new story
router.post('/', async (req, res) => {
  try {
    const story = await Story.create(req.body);
    res.status(201).json(story);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific story
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findByPk(req.params.id);
    if (story) {
      res.json(story);
    } else {
      res.status(404).json({ message: 'Story not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a story
router.put('/:id', async (req, res) => {
  try {
    const story = await Story.findByPk(req.params.id);
    if (story) {
      await story.update(req.body);
      res.json(story);
    } else {
      res.status(404).json({ message: 'Story not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a story
router.delete('/:id', async (req, res) => {
  try {
    const story = await Story.findByPk(req.params.id);
    if (story) {
      await story.destroy();
      res.json({ message: 'Story deleted' });
    } else {
      res.status(404).json({ message: 'Story not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 