const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

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

// Export a story
router.get('/:id/export', async (req, res) => {
  try {
    const story = await Story.findByPk(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
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