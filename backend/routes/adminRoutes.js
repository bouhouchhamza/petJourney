const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Journal = require('../models/Journal');
const { createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const upload = require('../middleware/upload');

// Protect all admin routes with protect & admin middlewares
router.use(protect, admin);

// ─── Product CRUD (Admin) — upload.single('image') for file upload ──────────
router.post('/products',     upload.single('image'), createProduct);
router.put('/products/:id',  upload.single('image'), updateProduct);
router.delete('/products/:id', deleteProduct);

// ─── Analytics ──────────────────────────────────────────────────────────────────
router.get('/analytics', async (req, res) => {
  try {
    const orders = await Order.findAll();
    // Sum up a simple revenue metric (price per order isn't stored, use count × avg)
    // For now, return order count + mocked revenue until a price column is added
    const totalOrders = orders?.length || 0;

    res.json({
      revenue: totalOrders * 29.95,   // Approximation until order totals are tracked
      totalOrders,
      storeVisits: 8432,              // Mocked for now
      salesData: [
        { month: 'Jan', sales: 4000 },
        { month: 'Feb', sales: 3000 },
        { month: 'Mar', sales: 5000 },
        { month: 'Apr', sales: 8000 },
      ]
    });
  } catch (error) {
    console.error('ANALYTICS_ERROR:', error.message);
    // Return safe fallback so frontend never crashes
    res.status(200).json({
      revenue: 0,
      totalOrders: 0,
      storeVisits: 0,
      salesData: [],
    });
  }
});

// ─── Orders List ────────────────────────────────────────────────────────────────
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
    res.json(orders || []);
  } catch (error) {
    console.error('ADMIN_ORDERS_ERROR:', error.message);
    res.status(200).json([]);  // Empty array fallback — no crash
  }
});

// ─── Update Order Status ────────────────────────────────────────────────────────
router.put('/orders/:id/status', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await order.update({ status: req.body.status });
    res.json(order);
  } catch (error) {
    console.error('ORDER_STATUS_UPDATE_ERROR:', error.message);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

// ─── Create Journal Post ────────────────────────────────────────────────────────
router.post('/journal', async (req, res) => {
  try {
    const { title, date, content, image, image_url, status, battle_status } = req.body;

    // Accept both frontend field names (battle_status/image_url) and model names (status/image)
    const finalStatus = status || battle_status;
    const finalImage  = image  || image_url;

    if (!title || !date || !content || !finalStatus) {
      return res.status(400).json({ message: 'Missing required fields: title, date, content, status' });
    }

    const journal = await Journal.create({
      title,
      date,
      content,
      image: finalImage || null,
      status: finalStatus,
    });

    res.status(201).json(journal);
  } catch (error) {
    console.error('JOURNAL_CREATE_ERROR:', error.message);
    res.status(500).json({ message: 'Failed to create journal entry' });
  }
});

module.exports = router;
