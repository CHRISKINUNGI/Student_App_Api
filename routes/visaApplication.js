const express = require('express');
const { submitVisaApplication, getAllVisaApplications } = require('../controllers/visaApplicationController');
const { protect, roleAuth } = require('../middlewares/auth'); // Import middlewares
const upload = require('../middlewares/multer'); // Multer middleware for file uploads

const router = express.Router();

// POST route for submitting visa applications (Authenticated users only)
router.post(
  '/apply',
  protect, // Ensure the user is authenticated
  upload.fields([
    { name: 'passportDocument', maxCount: 1 },
    { name: 'financialProof', maxCount: 1 }
  ]),
  submitVisaApplication
);

// GET route to load all visa applications (Admin-only access)
router.get(
  '/all',
  protect,        // Ensure the user is authenticated
  roleAuth('admin'), // Ensure the user has the 'admin' role
  getAllVisaApplications
);

module.exports = router;
