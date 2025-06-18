const Story = require('../models/story');
const { Op } = require('sequelize');
const logger = require('../config/logger');
const { analyzeStoryContent } = require('../services/contentAnalysisService');
const { processFileForTextExtraction } = require('../services/fileProcessingService');
const PDFDocument = require('pdfkit');

// Create a new story
exports.createStory = async (req, res) => {
  try {
    const story = await Story.create(req.body);
    logger.info('Story created successfully', { storyId: story.id });
    res.status(201).json(story);
  } catch (err) {
    logger.error('Error creating story', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// Get all stories with optional filters
exports.getStories = async (req, res) => {
  try {
    const { projectId, status, genre } = req.query;
    const where = {};
    
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (genre) where.genre = genre;

    const stories = await Story.findAll({ where });
    res.json(stories);
  } catch (err) {
    logger.error('Error fetching stories', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// Get a single story by ID
exports.getStory = async (req, res) => {
  try {
    const story = await Story.findByPk(req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.json(story);
  } catch (err) {
    logger.error('Error fetching story', { error: err.message, storyId: req.params.id });
    res.status(500).json({ error: err.message });
  }
};

// Update a story
exports.updateStory = async (req, res) => {
  try {
    const story = await Story.findByPk(req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    await story.update(req.body);
    logger.info('Story updated successfully', { storyId: story.id });
    res.json(story);
  } catch (err) {
    logger.error('Error updating story', { error: err.message, storyId: req.params.id });
    res.status(500).json({ error: err.message });
  }
};

// Delete a story
exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findByPk(req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    await story.destroy();
    logger.info('Story deleted successfully', { storyId: req.params.id });
    res.status(204).send();
  } catch (err) {
    logger.error('Error deleting story', { error: err.message, storyId: req.params.id });
    res.status(500).json({ error: err.message });
  }
};

// Analyze story content
exports.analyzeStory = async (req, res) => {
  try {
    const story = await Story.findByPk(req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (!story.content) {
      return res.status(400).json({ error: 'Story content is empty or not available for analysis.' });
    }

    const analysisResult = await analyzeStoryContent(story.content);

    // Update the story with analysis results
    await story.update({
      coherence_score: analysisResult.coherence_score,
      style_score: analysisResult.style_score,
      pacing_score: analysisResult.pacing_score,
      feedback: analysisResult.feedback
    });

    res.json(analysisResult);
  } catch (err) {
    logger.error('Error analyzing story', { error: err.message, storyId: req.params.id });
    res.status(500).json({ error: err.message });
  }
};

// Get story analysis report
exports.getStoryAnalysisReport = async (req, res) => {
  try {
    const story = await Story.findByPk(req.params.id, {
      attributes: ['id', 'title', 'coherence_score', 'style_score', 'pacing_score', 'feedback']
    });

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (!story.coherence_score && !story.style_score && !story.pacing_score && !story.feedback) {
      return res.status(404).json({ error: 'Analysis report not found for this story.' });
    }

    res.json(story);
  } catch (err) {
    logger.error('Error fetching story analysis report', { error: err.message, storyId: req.params.id });
    res.status(500).json({ error: err.message });
  }
};

// Extract text from uploaded file
exports.extractTextFromFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const fileBuffer = req.file.buffer;
    const fileMimeType = req.file.mimetype;

    const extractedText = await processFileForTextExtraction(fileBuffer, fileMimeType);
    res.json({ extractedText });
  } catch (error) {
    logger.error('Error extracting text from file', { error: error.message, originalname: req.file ? req.file.originalname : 'N/A' });
    res.status(500).json({ error: error.message });
  }
};

// Export story content as PDF or TXT
exports.exportStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { format } = req.query;

    const story = await Story.findByPk(id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found.' });
    }

    if (!story.content) {
      return res.status(400).json({ error: 'Story content is empty, cannot export.' });
    }

    const filename = `${story.title.replace(/[^a-z0-9]/gi, '_')}`;

    if (format === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);

      doc.pipe(res);
      doc.fontSize(25).text(story.title, { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(story.content);
      doc.end();

      logger.info('Story exported as PDF successfully', { storyId: id });
    } else if (format === 'txt') {
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.txt"`);
      res.send(story.content);
      logger.info('Story exported as TXT successfully', { storyId: id });
    } else {
      res.status(400).json({ error: 'Unsupported format. Only \'pdf\' and \'txt\' are supported.' });
    }

  } catch (err) {
    logger.error('Error exporting story', { error: err.message, storyId: req.params.id });
    res.status(500).json({ error: err.message });
  }
};