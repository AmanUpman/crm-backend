const express = require('express');
const segmentController = require('../controllers/segmentController');
const router = express.Router();

router.post('/', segmentController.createSegment);
router.get('/', segmentController.getAllSegments);

module.exports = router;
