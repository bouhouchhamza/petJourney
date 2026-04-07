const express = require('express');
const router = express.Router();
const { getProducts } = require('../controllers/productController');
const { getJournal } = require('../controllers/journalController');
const Order = require('../models/Order');
const { sequelize } = require('../config/db');

router.get('/products', getProducts);
router.get('/journal', getJournal);

router.post('/orders', async (req, res) => {
  try {
    // Quick DB health check (Sequelize, not Mongoose)
    await sequelize.authenticate();
  } catch (dbErr) {
    console.error('ORDER_DB_CHECK_FAILED:', dbErr.message);
    return res.status(503).json({ message: 'Database not available' });
  }

  try {
    const { customer_name, customer_email, product_id, product_title, engraving_text, phone, finish, size } = req.body;

    if (!customer_name) {
      return res.status(400).json({ message: 'customer_name is required' });
    }

    const order = await Order.create({
      customer_name,
      customer_email: customer_email || null,
      product_id:     product_id     || null,
      product_title:  product_title  || null,
      engraving_text: engraving_text || null,
      phone:          phone          || null,
      finish:         finish         || null,
    });

    console.log(`✅ ORDER: Created #${order.id}`);
    res.status(201).json(order);
  } catch (error) {
    console.error('ORDER_CREATE_ERROR:', error.message);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

module.exports = router;
