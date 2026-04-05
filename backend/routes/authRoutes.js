const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  logoutUser,
  getMe,
  getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);

// Private routes (JWT required)
router.get('/me', protect, getMe);           // ← Used by AuthContext on every refresh
router.get('/profile', protect, getUserProfile); // ← Backward compat alias

module.exports = router;
