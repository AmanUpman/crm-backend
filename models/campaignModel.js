const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  segments: [
    {
      type: String,
      required: true,
    }
  ],
  messageTemplate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Draft', 'Scheduled', 'In Progress', 'Completed'],
    default: 'Draft',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  scheduledSendDate: {
    type: Date,
  },
});

module.exports = mongoose.model('Campaign', campaignSchema);
