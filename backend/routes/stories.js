const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

// Get all stories
router.get('/', protect, async (req, res) => {
  try {
    const stories = await Story.findAll({ where: { userId: req.user.id } }); // Filter by user ID
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new story
router.post('/', protect, async (req, res) => {
  try {
    // Ensure the story is associated with the authenticated user
    const story = await Story.create({ ...req.body, userId: req.user.id });
    res.status(201).json(story);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific story
router.get('/:id', protect, async (req, res) => {
  try {
    const story = await Story.findByPk(req.params.id);
    // Ensure the story belongs to the authenticated user
    if (story && story.userId === req.user.id) {
      res.json(story);
    } else if (story && story.userId !== req.user.id) {
      res.status(403).json({ message: 'Forbidden: You do not own this story' });
    } else {
      res.status(404).json({ message: 'Story not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a story
router.put('/:id', protect, async (req, res) => {
  try {
    const story = await Story.findByPk(req.params.id);
    // Ensure the story belongs to the authenticated user
    if (story && story.userId === req.user.id) {
      await story.update(req.body);
      res.json(story);
    } else if (story && story.userId !== req.user.id) {
      res.status(403).json({ message: 'Forbidden: You do not own this story' });
    } else {
      res.status(404).json({ message: 'Story not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a story
router.delete('/:id', protect, async (req, res) => {
  try {
    const story = await Story.findByPk(req.params.id);
    // Ensure the story belongs to the authenticated user
    if (story && story.userId === req.user.id) {
      await story.destroy();
      res.json({ message: 'Story deleted' });
    } else if (story && story.userId !== req.user.id) {
      res.status(403).json({ message: 'Forbidden: You do not own this story' });
    } else {
      res.status(404).json({ message: 'Story not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export a story
router.get('/:id/export', protect, async (req, res) => {
  try {
    const story = await Story.findByPk(req.params.id);
    // Ensure the story belongs to the authenticated user
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    if (story.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You do not own this story' });
    }

    const format = req.query.format || 'txt';
    const filename = `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;

    if (format === 'pdf') {
      // Create PDF
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      doc.pipe(res);

      // Add content to PDF
      doc.fontSize(24).text(story.title, { align: 'center' });
      doc.moveDown();
      if (story.synopsis) {
        doc.fontSize(14).text('Synopsis', { underline: true });
        doc.fontSize(12).text(story.synopsis);
        doc.moveDown();
      }
      if (story.genre) {
        doc.fontSize(14).text('Genre', { underline: true });
        doc.fontSize(12).text(story.genre);
        doc.moveDown();
      }
      if (story.content) {
        doc.fontSize(14).text('Content', { underline: true });
        doc.fontSize(12).text(story.content);
      }

      doc.end();
    } else {
      // Create TXT
      let content = `Title: ${story.title}\n\n`;
      if (story.synopsis) content += `Synopsis:\n${story.synopsis}\n\n`;
      if (story.genre) content += `Genre: ${story.genre}\n\n`;
      if (story.content) content += `Content:\n${story.content}`;

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(content);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 