const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  totalSpending: { type: Number, default: 0 }
});

// Add a virtual field to count the orders
customerSchema.virtual('orderCount').get(function () {
  return this.orders ? this.orders.length : 0;
});

// Ensure virtuals are included when converting to JSON or Object
customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Customer', customerSchema);
