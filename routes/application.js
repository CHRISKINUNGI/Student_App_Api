const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');  // Assuming JWT authentication middleware
const {
  submitApplication, getUserApplications, updateApplicationStatus
} = require('../controllers/applicationsController');  // Import the controller methods

// Route for submitting a new application (for users)
router.post('/submit', protect, submitApplication);

// Route for retrieving all applications of a logged-in user
router.get('/', protect, getUserApplications);

// Route for updating the status of an application (admin only)
router.put('/:applicationId/status', protect, updateApplicationStatus);  // You can add admin role protection

module.exports = router;
