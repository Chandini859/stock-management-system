const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema({
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

AdminSchema.methods.isValidPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
