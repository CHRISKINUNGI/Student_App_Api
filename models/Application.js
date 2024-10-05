const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['draft', 'submitted', 'in review', 'approved', 'rejected'], default: 'submitted' },
  documentsSubmitted: { type: Boolean, default: false },
  documentsVerified: { type: Boolean, default: false },
  paymentVerified: { type: Boolean, default: false },
  visaProcessing: { type: Boolean, default: false },
  visaReady: { type: Boolean, default: false },
  collectionDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // User-submitted fields: section 1 and section 2
  section1Completed: { type: Boolean, default: false },  // Payment confirmation
  section2Completed: { type: Boolean, default: false }   // Documents submission confirmation
});

module.exports = mongoose.model('Application', applicationSchema);
