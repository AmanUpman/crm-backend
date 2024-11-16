const Order = require('../models/Order');
const Customer = require('../models/Customer');
const { publishToQueue } = require('../utils/messageQueueUtils');

// Data ingestion API to create a new order
exports.createOrder = async (req, res) => {
  try {
    const { customerId, orderAmount } = req.body;

    // Check if customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Create and save the new order
    const newOrder = new Order(req.body);
    await newOrder.save();

    // Update total spending and last visit for the customer
    customer.totalSpending += orderAmount;
    customer.lastVisit = new Date();
    customer.orders.push(newOrder._id); // Add the new order ID to the orders array
    await customer.save();

    // Publish data to the queue (for scalable implementations)
    await publishToQueue('order_data_queue', newOrder);

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Retrieve all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customerId', 'name email');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
