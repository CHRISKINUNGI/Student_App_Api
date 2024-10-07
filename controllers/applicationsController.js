const Application = require('../models/Application');  // Import the Application model

// Submit a new application
const submitApplication = async (req, res) => {
  try {
    console.log('Submitting new application...');
    const userId = req.user.userId;  // Extract userId from the protect middleware
    const { section1Completed, section2Completed } = req.body;  // Extract data from request body

    // Check if an application already exists for the user
    const existingApplication = await Application.findOne({ userId });
    if (existingApplication) {
      console.log('User already has an existing application');
      return res.status(400).json({ message: 'Application already exists for this user.' });
    }

    // Create a new application
    const newApplication = new Application({
      userId,
      section1Completed: section1Completed === 'true',  // Store as boolean
      section2Completed: section2Completed === 'true',  // Store as boolean
      status: 'submitted',
      documentsSubmitted: false,
      documentsVerified: false,
      paymentVerified: false,
      visaProcessing: false,
      visaReady: false,
    });

    // Save the application to the database
    const savedApplication = await newApplication.save();
    console.log('New application saved:', savedApplication);
    return res.status(201).json({ message: 'Application submitted successfully', application: savedApplication });
  } catch (error) {
    console.error('Error submitting application:', error);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

// Retrieve all applications for the logged-in user
const getUserApplications = async (req, res) => {
  try {
    console.log('Fetching user applications...');
    const userId = req.user.userId;  // Extract userId from the protect middleware

    // Retrieve all applications for the user
    const applications = await Application.find({ userId });
    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: 'No applications found for this user.' });
    }

    console.log('User applications retrieved:', applications);
    return res.status(200).json({ applications });
  } catch (error) {
    console.error('Error fetching user applications:', error);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

// Get the total number of applications (Admin/General use)
const getTotalApplications = async (req, res) => {
  try {
    console.log('Fetching total number of applications...');

    // Retrieve total application count
    const totalApplications = await Application.countDocuments();
    
    console.log('Total applications:', totalApplications);
    return res.status(200).json({ totalApplications });
  } catch (error) {
    console.error('Error fetching total applications:', error);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

// Update the status of an application (for admin use)
const updateApplicationStatus = async (req, res) => {
  try {
    console.log('Updating application status...');
    const { applicationId } = req.params;
    const { status } = req.body;  // Extract status from request body

    // Ensure the status is valid
    const allowedStatuses = ['draft', 'submitted', 'in review', 'approved', 'rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    // Find the application and update the status
    const application = await Application.findByIdAndUpdate(applicationId, { status }, { new: true });
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    console.log('Application status updated:', application);
    return res.status(200).json({ message: 'Application status updated successfully', application });
  } catch (error) {
    console.error('Error updating application status:', error);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

module.exports = { submitApplication, getUserApplications, getTotalApplications, updateApplicationStatus };
