const express = require('express');
const passport = require('../passport');
const Category = require('../models/category');
const Product = require('../models/product');
const Order = require('../models/order');

const router = express.Router();

// Admin Dashboard Routes

// Create Category
router.post('/categories', passport.authenticate('admin-jwt', { session: false }), async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Categories
router.get('/categories', passport.authenticate('admin-jwt', { session: false }), async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Category
router.put('/categories/:id', passport.authenticate('admin-jwt', { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Category
router.delete('/categories/:id', passport.authenticate('admin-jwt', { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    // Remove products associated with this category
    await Product.deleteMany({ category: id });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Products with Categories and Stocks
router.get('/products', passport.authenticate('admin-jwt', { session: false }), async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name').select('name category stock');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Product Stock
router.put('/products/:id/stock', passport.authenticate('admin-jwt', { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const product = await Product.findByIdAndUpdate(id, { stock }, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    // Notify salespersons about the updated stock (for real-time updates, you can use sockets or other messaging systems)
    // For demonstration, we are sending a response with updated product details.
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Orders Made by Salespersons
router.get('/orders', passport.authenticate('admin-jwt', { session: false }), async (req, res) => {
  try {
    const orders = await Order.find().populate('product', 'name').select('product quantity customer');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
