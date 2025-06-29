const express = require('express');
const router = express.Router();
const { createUser, getUsers, updateProfile, getProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/', createUser);
router.get('/', getUsers);
router.put('/me', auth, updateProfile);
router.get('/me', auth, getProfile);

module.exports = router;