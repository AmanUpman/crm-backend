const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  conditions: { type: Object, required: true },
  audienceSize: { type: Number, default: 0 },
});

module.exports = mongoose.model('Segment', segmentSchema);
