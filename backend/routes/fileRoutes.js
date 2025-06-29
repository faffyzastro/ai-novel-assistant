const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fileController = require('../controllers/fileController');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage config: unique filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Multer file filter: only .txt and .md
const fileFilter = (req, file, cb) => {
  const allowed = ['.txt', '.md'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .txt and .md files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// POST /api/files/upload
router.post('/upload', upload.single('file'), fileController.uploadFile);

// GET /api/files/:filename
router.get('/:filename', fileController.downloadFile);

// GET /api/files/user/:userId
router.get('/user/:userId', fileController.listFilesByUser);

// GET /api/files/story/:storyId
router.get('/story/:storyId', fileController.listFilesByStory);

module.exports = router; 