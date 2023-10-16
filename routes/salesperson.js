const express = require('express');
const passport = require('../passport');
const Product = require('../models/product');
const Order = require('../models/order');
const Customer = require('../models/customer'); 

const router = express.Router();




router.get('/products', passport.authenticate('salesperson-jwt', { session: false }), async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name').select('name stock category');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/orders', passport.authenticate('salesperson-jwt', { session: false }), async (req, res) => {
  const { productId, quantity, customerName, storeName } = req.body;
  try {
    
    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ error: 'Invalid product or insufficient stock' });
    }

    // Create a new customer 
    let customer = await Customer.findOne({ name: customerName, store: storeName });
    if (!customer) {
      customer = new Customer({ name: customerName, store: storeName });
      await customer.save();
    }

    // Create a new order
    const order = new Order({
      product: productId,
      quantity: quantity,
      customer: customer._id
    });

    // Update product 
    product.stock -= quantity;
    await product.save();
    await order.save();

    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
