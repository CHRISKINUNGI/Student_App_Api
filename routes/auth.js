const express = require('express');
const { login, registerUser } = require('../controllers/authController');
const { protect, roleAuth } = require('../middlewares/auth');

const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', login);

// Protected routes for user and admin
router.get('/user', protect, roleAuth('user'), (req, res) => {
  res.json({ message: 'Welcome User' });
});

router.get('/admin', protect, roleAuth('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin' });
});

module.exports = router;
