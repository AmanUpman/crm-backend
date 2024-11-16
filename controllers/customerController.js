const Customer = require('../models/Customer');
const Order = require('../models/Order');
const { validateCustomerData } = require('../utils/validationUtils');
const { publishToQueue } = require('../utils/messageQueueUtils');

// Data ingestion API to create a new customer
exports.createCustomer = async (req, res) => {
  try {
    // Validate incoming customer data
    const validationErrors = validateCustomerData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const newCustomer = new Customer(req.body);

    // If using a pub-sub architecture
    await publishToQueue('customer_data_queue', newCustomer);

    // Save data directly in the database (for non-scalable implementation)
    await newCustomer.save();

    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve all customers
exports.getAllCustomers = async (req, res) => {
  try {
    // Use aggregation to calculate total spending for each customer
    const customers = await Customer.find().populate('orders').setOptions({ strictPopulate: false });

    const customersWithTotalSpending = customers.map(customer => {
      const totalSpending = customer.orders.reduce((sum, order) => sum + order.orderAmount, 0);
      return {
        ...customer.toObject(),
        totalSpending: totalSpending, 
      };
    });

    res.status(200).json(customersWithTotalSpending);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: error.message });
  }
};



// Update customer details with advanced validation and change tracking
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Validate updates
    const validationErrors = validateCustomerData(updatedData, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const customer = await Customer.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    }).populate('orders');

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a customer with order cleanup
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Delete related orders
    await Order.deleteMany({ customerId: id });

    await Customer.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Import customer data in bulk (for scalability)
exports.bulkCreateCustomers = async (req, res) => {
  try {
    const customerDataArray = req.body.customers;

    for (const customerData of customerDataArray) {
      const validationErrors = validateCustomerData(customerData);
      if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }
      await publishToQueue('customer_data_queue', customerData);
    }

    res.status(202).json({ message: 'Bulk data processing started' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
