const VisaApplication = require('../models/VisaApplication');

exports.submitVisaApplication = async (req, res) => {
  const { name, dateOfBirth, nationality, passportNumber } = req.body;

  // Ensure the required files are uploaded
  if (!req.files || !req.files.passportDocument || !req.files.financialProof) {
    return res.status(400).json({ message: 'Please upload all required documents' });
  }

  try {
    // Create new visa application
    const application = new VisaApplication({
      user: req.user.id, // User info from JWT token
      name,
      dateOfBirth,
      nationality,
      passportNumber,
      passportDocument: req.files.passportDocument[0].path, // Save file path
      financialProof: req.files.financialProof[0].path // Save file path
    });

    await application.save();

    res.status(201).json({ message: 'Visa application submitted successfully' });
  } catch (error) {
    console.error('Error submitting visa application:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
