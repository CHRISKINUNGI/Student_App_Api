const express = require('express');
const { submitVisaApplication } = require('../controllers/visaApplicationController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/multer'); // Import Multer

const router = express.Router();

// POST route for submitting visa application
router.post(
  '/apply',
  protect, // Ensure the user is authenticated
  upload.fields([
    { name: 'passportDocument', maxCount: 1 }, // Accept only 1 file for passportDocument
    { name: 'financialProof', maxCount: 1 } // Accept only 1 file for financialProof
  ]),
  submitVisaApplication // Controller for handling visa application submission
);

module.exports = router;
