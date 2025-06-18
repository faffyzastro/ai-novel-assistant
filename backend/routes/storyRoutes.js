const express = require('express');
const router = express.Router();
const { 
  createStory, 
  getStories, 
  getStory, 
  updateStory, 
  deleteStory, 
  analyzeStory, 
  getStoryAnalysisReport, 
  extractTextFromFile, 
  exportStory 
} = require('../controllers/storyController');
const { authenticate } = require('../middleware/auth');
const multer = require('multer');
const upload = multer(); // Initialize multer for in-memory storage

// Apply authentication middleware to all routes
router.use(authenticate);

// Story routes
router.post('/', createStory);
router.get('/', getStories);
router.get('/:id', getStory);
router.put('/:id', updateStory);
router.delete('/:id', deleteStory);
router.get('/:id/analyze', analyzeStory);
router.get('/:id/report', getStoryAnalysisReport);

// Route for file upload and text extraction
router.post('/upload-and-extract', upload.single('file'), extractTextFromFile);

// Route for exporting story content
router.get('/:id/export', exportStory);

module.exports = router;