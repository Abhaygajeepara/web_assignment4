
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  order_date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  }],
  qty: [{
    type: Number,
    ref: 'Item',
    required: true,
  }],
  shipping_address: {
    type: String,
    required: true,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
