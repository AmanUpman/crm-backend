const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  campaignName: { type: String, required: true },
  audienceSegmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'AudienceSegment', required: true },
  messageContent: { type: String, required: true },
  status: { type: String },
  stats: {
    audienceSize: { type: Number, default: 0 },
    sent: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model('Campaign', campaignSchema);
