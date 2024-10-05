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


// Mock database
const students = [];

// Render admin dashboard
router.get("/dashboard", (req, res) => {
  const data = {
    pending_count: 10,
    completed_count: 20,
    today_assignments: 5,
    payments_sum: 1500.0,
    assignment_count: 15,
    title: "Registration Page",
  };
  res.render("admin/dashboard", data);
});

// Approve a student
router.post("/approve/:username", (req, res) => {
  const student = students.find((s) => s.username === req.params.username);
  if (student) {
    student.approved = true;
  }
  res.redirect("/admin");
});

module.exports = router;


module.exports = router;
