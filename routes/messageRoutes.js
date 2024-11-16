const express = require('express');
const { sendMessage, deliveryReceipt,getCampaignMessages } = require('../controllers/messageController');

const router = express.Router();

// Route to send messages for a specific campaign
// POST /api/messages/send
router.post('/send', sendMessage);

// Route to update delivery receipt status
// GET /api/messages/receipt
router.get('/receipt', deliveryReceipt);
router.get('/', getCampaignMessages);

module.exports = router;
