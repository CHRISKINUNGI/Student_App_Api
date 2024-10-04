const VisaApplication = require('../models/VisaApplication');

// Controller to handle visa application submission
exports.submitVisaApplication = async (req, res) => {
  try {
    console.log('Visa application submission request received:', req.body);
    console.log('Uploaded files:', req.files);

    const { name, dateOfBirth, nationality, passportNumber } = req.body;

    // Ensure the required files are uploaded
    if (!req.files || !req.files.passportDocument || !req.files.financialProof) {
      console.log('Missing required files');
      return res.status(400).json({ message: 'Please upload all required documents' });
    }

    // Create a new visa application
    const application = new VisaApplication({
      user: req.user.id, // The authenticated user
      name,
      dateOfBirth,
      nationality,
      passportNumber,
      passportDocument: req.files.passportDocument[0].path, // Save file path
      financialProof: req.files.financialProof[0].path, // Save file path
    });

    await application.save();

    console.log('Visa application saved:', application);

    res.status(201).json({ message: 'Visa application submitted successfully' });
  } catch (error) {
    console.error('Error submitting visa application:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to handle loading all visa applications with pagination
exports.getAllVisaApplications = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 10; // Default to 10 applications per page

  try {
    console.log('Fetching all visa applications');

    // Fetch visa applications and total count in parallel for efficiency
    const [applications, totalApplications] = await Promise.all([
      VisaApplication.find()
        .populate('user', 'username email') // Populate user details
        .skip((page - 1) * limit) // Skip records for pagination
        .limit(limit) // Limit the number of records per page
        .lean(), // Lean query for better performance (plain JS objects)
      VisaApplication.countDocuments(), // Get total count of applications
    ]);

    console.log('Visa applications retrieved:', applications);

    // Return paginated response with metadata
    res.status(200).json({
      message: 'Visa applications retrieved successfully',
      page,
      limit,
      totalPages: Math.ceil(totalApplications / limit),
      totalApplications,
      data: applications,
    });
  } catch (error) {
    console.error('Error retrieving visa applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
