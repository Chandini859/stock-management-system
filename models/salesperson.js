const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SalesPersonSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

SalesPersonSchema.methods.isValidPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const SalesPerson = mongoose.model('SalesPerson', SalesPersonSchema);
module.exports = SalesPerson;
