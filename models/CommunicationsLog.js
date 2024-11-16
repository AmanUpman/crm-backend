const mongoose = require('mongoose');

const communicationsLogSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  message: { type: String, required: true },
  status: { type: String },
});

module.exports = mongoose.model('CommunicationsLog', communicationsLogSchema);
