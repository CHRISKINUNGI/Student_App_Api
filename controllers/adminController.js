const Application = require('../models/Application');

// Update document submission status
exports.updateDocumentStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { submitted } = req.body;

  try {
    const application = await Application.findByIdAndUpdate(applicationId, {
      documentsSubmitted: submitted,
      status: 'in review'
    }, { new: true });

    res.status(200).json({ message: 'Document status updated successfully', application });
  } catch (error) {
    res.status(500).json({ error: 'Error updating document status' });
  }
};

// Update document verification status
exports.updateVerificationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { verified } = req.body;

  try {
    const application = await Application.findByIdAndUpdate(applicationId, {
      documentsVerified: verified
    }, { new: true });

    res.status(200).json({ message: 'Document verification updated', application });
  } catch (error) {
    res.status(500).json({ error: 'Error updating document verification' });
  }
};

// Update payment verification status
exports.updatePaymentStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { paymentVerified } = req.body;

  try {
    const application = await Application.findByIdAndUpdate(applicationId, {
      paymentVerified
    }, { new: true });

    res.status(200).json({ message: 'Payment verified', application });
  } catch (error) {
    res.status(500).json({ error: 'Error verifying payment' });
  }
};

// Update visa processing status
exports.updateVisaProcessing = async (req, res) => {
  const { applicationId } = req.params;
  const { visaProcessing } = req.body;

  try {
    const application = await Application.findByIdAndUpdate(applicationId, {
      visaProcessing
    }, { new: true });

    res.status(200).json({ message: 'Visa processing status updated', application });
  } catch (error) {
    res.status(500).json({ error: 'Error updating visa processing' });
  }
};

// Update visa ready status
exports.updateVisaReady = async (req, res) => {
  const { applicationId } = req.params;
  const { visaReady } = req.body;

  try {
    const application = await Application.findByIdAndUpdate(applicationId, {
      visaReady
    }, { new: true });

    res.status(200).json({ message: 'Visa ready status updated', application });
  } catch (error) {
    res.status(500).json({ error: 'Error updating visa ready status' });
  }
};

// Set collection date
exports.setCollectionDate = async (req, res) => {
  const { applicationId } = req.params;
  const { collectionDate } = req.body;

  try {
    const application = await Application.findByIdAndUpdate(applicationId, {
      collectionDate
    }, { new: true });

    res.status(200).json({ message: 'Collection date set', application });
  } catch (error) {
    res.status(500).json({ error: 'Error setting collection date' });
  }
};
