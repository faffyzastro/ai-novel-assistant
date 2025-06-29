const express = require('express');
const router = express.Router();
const Agent = require('../models/agent');

// Get all agents
router.get('/', async (req, res) => {
  try {
    const agents = await Agent.findAll();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new agent
router.post('/', async (req, res) => {
  try {
    const agent = await Agent.create(req.body);
    res.status(201).json(agent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an agent
router.put('/:id', async (req, res) => {
  try {
    const agent = await Agent.findByPk(req.params.id);
    if (agent) {
      await agent.update(req.body);
      res.json(agent);
    } else {
      res.status(404).json({ message: 'Agent not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an agent
router.delete('/:id', async (req, res) => {
  try {
    const agent = await Agent.findByPk(req.params.id);
    if (agent) {
      await agent.destroy();
      res.json({ message: 'Agent deleted' });
    } else {
      res.status(404).json({ message: 'Agent not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 