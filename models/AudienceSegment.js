const mongoose = require('mongoose');

const audienceSegmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  criteria: { type: Object, required: true },
  size: { type: Number },
});

module.exports = mongoose.model('AudienceSegment', audienceSegmentSchema);
