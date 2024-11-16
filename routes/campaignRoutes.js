const express = require('express');
const {
  createCampaign,
  getAllCampaigns,
  getCampaignStatistics
} = require('../controllers/campaignController');

const router = express.Router();

// Route to create a new campaign
// POST /api/campaigns
router.post('/', createCampaign);

// Route to get all campaigns
// GET /api/campaigns
router.get('/', getAllCampaigns);

router.get('/statistics/:campaignId', getCampaignStatistics);

module.exports = router;
