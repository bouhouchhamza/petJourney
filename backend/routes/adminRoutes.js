const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Journal = require('../models/Journal');

// Protect all admin routes with protect & admin middlewares
router.use(protect, admin);

router.get('/analytics', async (req, res) => {
  // Aggregate simple analytics
  const orders = await Order.find({});
  const totalRevenue = orders.reduce((acc, order) => {
    const orderTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return acc + orderTotal;
  }, 0);
  
  res.json({
    revenue: totalRevenue,
    storeVisits: 8432, // Mocked for now
    salesData: [
      { month: 'Jan', sales: 4000 },
      { month: 'Feb', sales: 3000 },
      { month: 'Mar', sales: 5000 },
      { month: 'Apr', sales: 8000 },
    ]
  });
});

// Update order status
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create journal post
router.post('/journal', async (req, res) => {
  try {
    const journal = await Journal.create(req.body);
    res.status(201).json(journal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
