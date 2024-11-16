const CommunicationsLog = require('../models/CommunicationsLog');
const Campaign = require('../models/Campaign');
const Customer = require('../models/Customer');
const { publishToQueue } = require('../services/pubSubService'); // Helper for pub-sub integration

// Helper function to create personalized messages
const createPersonalizedMessage = (name) => {
    return `Hi ${name}, here’s 10% off on your next order!`;
};

exports.sendMessage = async (req, res) => {
  try {
      const { campaignId } = req.body;

      // Fetch campaign details
      const campaign = await Campaign.findById(campaignId).populate('audienceSegmentId');
      if (!campaign) {
          return res.status(404).json({ error: 'Campaign not found' });
      }

      const criteria = campaign.audienceSegmentId.criteria;

      // Check if criteria is an array and build the query
      let query = {};
      if (Array.isArray(criteria) && criteria.length > 0) {
          // Assuming criteria contains conditions like [{ field: 'totalSpending', operator: 'gt', value: 10000 }]
          criteria.forEach(condition => {
              const field = condition.field;
              const operator = condition.operator;
              const value = condition.value;

              if (operator && value !== undefined) {
                  query[field] = { [`$${operator}`]: value };
              }
          });
      } else {
          // Handle the case where criteria is not in the expected format
          return res.status(400).json({ error: 'Invalid criteria format' });
      }

      // Fetch customers matching the campaign criteria
      const audience = await Customer.find(query);
      if (!audience.length) {
          return res.status(404).json({ error: 'No customers match the campaign criteria' });
      }

      // Create logs and push to a pub-sub queue for scalable processing
      const logs = audience.map(customer => ({
          campaignId,
          customerId: customer._id,
          message: createPersonalizedMessage(customer.name),
          status: 'PENDING'
      }));

      // Insert logs into the database
      const createdLogs = await CommunicationsLog.insertMany(logs);

      // Publish each log to a queue for processing
    //   for (const log of createdLogs) {
    //       await publishToQueue('messageQueue', log);
    //   }

      // Update initial campaign stats
      campaign.status = 'In Progress';
      campaign.stats.audienceSize = audience.length;
      await campaign.save();

      res.status(200).json({ message: 'Messages are being processed', createdLogs });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

exports.getCampaignMessages = async (req, res) => {
  try {
    const { campaignId } = req.query;

    // Fetch campaign to validate if it exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Fetch communication logs for the specified campaign
    const logs = await CommunicationsLog.find({ campaignId: campaignId })
      .populate('customerId', 'name email') // Optionally populate customer details
      .exec();

    if (!logs.length) {
      return res.status(404).json({ error: 'No messages found for this campaign' });
    }

    // Return the communication logs
    res.status(200).json({
      message: 'Messages retrieved successfully',
      logs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deliveryReceipt = async (req, res) => {
    try {
        const { logId } = req.query;
        const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';

        // Update the log entry with delivery status
        const log = await CommunicationsLog.findByIdAndUpdate(logId, { status }, { new: true });
        if (!log) {
            return res.status(404).json({ error: 'Log not found' });
        }

        // Update campaign statistics
        const campaign = await Campaign.findById(log.campaignId);
        if (status === 'SENT') {
            campaign.stats.sent += 1;
        } else {
            campaign.stats.failed += 1;
        }

        // Check if all logs have been processed
        const totalLogs = await CommunicationsLog.countDocuments({ campaignId: campaign._id });
        const completedLogs = await CommunicationsLog.countDocuments({ campaignId: campaign._id, status: { $in: ['SENT', 'FAILED'] } });

        if (totalLogs === completedLogs) {
            campaign.status = 'Completed';
        }

        await campaign.save();

        res.status(200).json({ status: log.status });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
