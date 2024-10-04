const express = require('express');
const { login } = require('../controllers/authController');
const { protect, roleAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);

// Protected routes for user and admin
router.get('/user', protect, roleAuth('user'), (req, res) => {
  res.json({ message: 'Welcome User' });
});

router.get('/admin', protect, roleAuth('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin' });
});

module.exports = router;
