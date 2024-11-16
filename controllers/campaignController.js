const Campaign = require('../models/Campaign');
const Segment = require('../models/segmentModel');
const Customer = require('../models/Customer');
const CommunicationLog = require('../models/communicationLogModel');
const fetch = require('node-fetch');

// Function to create a new campaign
exports.createCampaign = async (req, res) => {
  try {
    const { name, segments, messageTemplate, status, audienceSegmentId } = req.body;

    // Check if the required fields are provided
    if (!name || !messageTemplate || !audienceSegmentId || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the campaign and save to database
    const campaign = await Campaign.create({
      campaignName: name,
      audienceSegmentId,  // Ensure audienceSegmentId is passed
      messageContent: messageTemplate,
      status,
      stats: {},  // Initialize stats
    });

    res.status(201).json(campaign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to retrieve all campaigns
exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate('audienceSegmentId')  // Ensure populating the audience segment ID
      .exec();  
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Controller to fetch campaign statistics
exports.getCampaignStatistics = async (req, res) => {
  const { campaignId } = req.params;

  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Fetch the communication logs for the campaign
    const totalLogs = await CommunicationLog.countDocuments({ campaignId });
    const sentLogs = await CommunicationLog.countDocuments({ campaignId, status: 'SENT' });
    const failedLogs = await CommunicationLog.countDocuments({ campaignId, status: 'FAILED' });

    const statistics = {
      audienceSize: totalLogs,
      sent: sentLogs,
      failed: failedLogs,
    };

    res.status(200).json(statistics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



