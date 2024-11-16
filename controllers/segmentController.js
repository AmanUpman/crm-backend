const Segment = require('../models/segmentModel');
const Customer = require('../models/customerModel');

exports.createSegment = async (req, res) => {
  try {
    const audienceSize = await Customer.countDocuments(req.body.conditions);
    const segment = await Segment.create({ ...req.body, audienceSize });
    res.status(201).json(segment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllSegments = async (req, res) => {
  try {
    const segments = await Segment.find();
    res.status(200).json(segments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
