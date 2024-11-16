const express = require('express');
const {
  createCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  bulkCreateCustomers
} = require('../controllers/customerController');

const router = express.Router();

// Route to create a new customer
// POST /api/customers
router.post('/', createCustomer);

// Route to retrieve all customers
// GET /api/customers
router.get('/', getAllCustomers);

// Route to update customer details
// PUT /api/customers/:id
router.put('/:id', updateCustomer);

// Route to delete a customer
// DELETE /api/customers/:id
router.delete('/:id', deleteCustomer);

// Route to bulk create customers
// POST /api/customers/bulk
router.post('/bulk', bulkCreateCustomers);

module.exports = router;
