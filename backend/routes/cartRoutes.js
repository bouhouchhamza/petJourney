const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
} = require('../controllers/cartController');

// All cart routes require authentication
router.use(protect);

router.get('/',        getCart);
router.post('/',       addToCart);
router.post('/sync',   syncCart);
router.put('/:id',     updateCartItem);
router.delete('/:id',  removeFromCart);
router.delete('/',     clearCart);

module.exports = router;
