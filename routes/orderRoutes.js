const express = require('express');
const { createOrder, getAllOrders } = require('../controllers/orderController');

const router = express.Router();

// Route to create a new order
// POST /api/orders
router.post('/', createOrder);

// Route to retrieve all orders
// GET /api/orders
router.get('/', getAllOrders);

module.exports = router;
