
const jwt = require('jsonwebtoken');


// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('../passport');
const Admin = require('../models/admin');
const SalesPerson = require('../models/salesperson');
const router = express.Router();
// Salesperson (User) Registration
router.post('/salesperson/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await SalesPerson.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: 'Salesperson already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new SalesPerson({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Salesperson created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Registration
router.post('/admin/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Admin Login
router.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin || !admin.isValidPassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ _id: admin._id }, 'admin-secret-key', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sales Person Login
router.post('/salesperson/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const salesperson = await SalesPerson.findOne({ username });
    if (!salesperson || !salesperson.isValidPassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ _id: salesperson._id }, 'salesperson-secret-key', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
