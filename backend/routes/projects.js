const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware'); // Import our new protect middleware

// Apply authentication middleware to all project routes
router.use(protect);

// Get all projects for the authenticated user
router.get('/', async (req, res) => {
  try {
    const projects = await Project.findAll({ where: { user_id: req.user.id } }); // Use req.user.id
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new project for the authenticated user
router.post('/', async (req, res) => {
  try {
    const { name, description, genre, keywords, tone, setting, length_preference } = req.body;
    const project = await Project.create({
      name,
      description,
      genre,
      keywords,
      tone,
      setting,
      length_preference,
      user_id: req.user.id // Associate project with the authenticated user using req.user.id
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific project for the authenticated user
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ where: { id: req.params.id, user_id: req.user.id } }); // Use req.user.id
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found or you do not have permission to access it' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a project for the authenticated user
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ where: { id: req.params.id, user_id: req.user.id } }); // Use req.user.id
    if (project) {
      await project.update(req.body);
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found or you do not have permission to update it' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a project for the authenticated user
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ where: { id: req.params.id, user_id: req.user.id } }); // Use req.user.id
    if (project) {
      await project.destroy();
      res.json({ message: 'Project deleted successfully' });
    } else {
      res.status(404).json({ message: 'Project not found or you do not have permission to delete it' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 