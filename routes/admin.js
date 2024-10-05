const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Update document submission status
router.post('/review/documents/:applicationId', adminController.updateDocumentStatus);

// Update document verification status
router.post('/review/verify-documents/:applicationId', adminController.updateVerificationStatus);

// Update payment verification status
router.post('/review/payment/:applicationId', adminController.updatePaymentStatus);

// Update visa processing status
router.post('/review/visa-processing/:applicationId', adminController.updateVisaProcessing);

// Update visa ready status
router.post('/review/visa-ready/:applicationId', adminController.updateVisaReady);

// Set collection date
router.post('/review/collection-date/:applicationId', adminController.setCollectionDate);

module.exports = router;
