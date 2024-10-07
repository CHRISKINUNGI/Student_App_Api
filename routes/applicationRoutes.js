const express = require('express');
const {
  submitApplication,
  getUserApplications,
  getTotalApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, roleAuth } = require('../middleware/auth');
const Application = require('../models/Application'); // Import Application model
const User = require('../models/User'); // Import User model (optional for fetching user data)
const router = express.Router();

// User submits an application
router.post('/applications', protect, submitApplication);

// Retrieve user applications
router.get('/applications/user', protect, getUserApplications);

// Get total number of applications (for admin or general use)
router.get('/applications/total', protect, roleAuth('admin'), getTotalApplications);

// Admin updates the application status
router.patch('/applications/:applicationId', protect, roleAuth('admin'), updateApplicationStatus);

// Admin view and update a specific user's application (GET route to load form)
router.get('/admin/applications/:applicationId', protect, roleAuth('admin'), async (req, res) => {
  try {
    const applicationId = req.params.applicationId;

    // Fetch the application by its ID
    const application = await Application.findById(applicationId);
    
    // Check if application exists
    if (!application) {
      return res.status(404).send('Application not found');
    }

    // Fetch the user related to the application if needed
    const user = await User.findById(application.userId);

    // Render the view and pass the application and user data to EJS
    res.render('admin/view-users', { application, user });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
