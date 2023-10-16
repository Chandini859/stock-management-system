// models/customer.js
const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // Add other fields as needed
});

const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;
