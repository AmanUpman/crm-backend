const express = require('express');
const { createAudience,getAllAudiences } = require('../controllers/audienceController');

const router = express.Router();

// Route to create an audience segment
// POST /api/audiences
router.post('/', createAudience);
router.get('/', getAllAudiences);
module.exports = router;
