const express = require('express');
const router = express.Router();
const { getProducts } = require('../controllers/productController');
const { getJournal } = require('../controllers/journalController');
const Order = require('../models/Order');
const mongoose = require('mongoose');

router.get('/products', getProducts);
router.get('/journal', getJournal);

router.post('/orders', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database not available' });
  }
  try {
    const { customer, items, customization } = req.body;
    const order = await Order.create({ customer, items, customization });
    console.log(`✅ ORDER: Created #${order._id}`);
    res.status(201).json(order);
  } catch (error) {
    console.error('ORDER_CREATE_ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
