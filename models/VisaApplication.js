const mongoose = require('mongoose');

const visaApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  nationality: { type: String, required: true },
  passportNumber: { type: String, required: true },
  passportDocument: { type: String, required: true }, // Path to the uploaded file
  financialProof: { type: String, required: true }, // Path to the financial document
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VisaApplication', visaApplicationSchema);
