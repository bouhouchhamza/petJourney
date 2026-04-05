const User = require('../models/User');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// ─── Cookie Configuration ───────────────────────────────────────────────────
// SameSite: 'none' + secure: true is REQUIRED for cross-domain cookies on Vercel.
// Without this, the browser will block the cookie and the user will be logged out
// on every page refresh.
const COOKIE_OPTIONS = {
  httpOnly: true,                                      // JS cannot read the cookie
  secure: true,                                        // HTTPS only (required for SameSite=None)
  sameSite: 'none',                                    // Cross-domain (Vercel frontend <-> Vercel backend)
  maxAge: 30 * 24 * 60 * 60 * 1000,                   // 30 days in ms
  path: '/',
};

// ─── Token Generator ─────────────────────────────────────────────────────────
const generateToken = (res, userId) => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
  res.cookie('jwt', token, COOKIE_OPTIONS);
  return token;
};

// ─── @route  POST /api/users/register ────────────────────────────────────────
// @desc   Register new user. Password hashed by User model hook (bcrypt).
// @access Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Password is hashed automatically by the beforeCreate hook in User model
    const user = await User.create({ name, email, password });
    generateToken(res, user.id);

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('REGISTER_ERROR:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

// ─── @route  POST /api/users/login ───────────────────────────────────────────
// @desc   Authenticate user & set JWT cookie
// @access Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    generateToken(res, user.id);

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('LOGIN_ERROR:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

// ─── @route  POST /api/users/logout ──────────────────────────────────────────
// @desc   Clear JWT cookie
// @access Private
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    expires: new Date(0),
    path: '/',
  });
  return res.status(200).json({ message: 'Logged out successfully' });
};

// ─── @route  GET /api/users/me ────────────────────────────────────────────────
// @desc   Get current logged-in user (used on every app refresh for persistent auth)
// @access Private (protect middleware required in route)
const getMe = async (req, res) => {
  try {
    // req.user is set by protect middleware
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('GET_ME_ERROR:', error);
    return res.status(500).json({ message: 'Server error fetching user' });
  }
};

// ─── @route  GET /api/users/profile ──────────────────────────────────────────
// @desc   Alias for /me (backward compatibility)
// @access Private
const getUserProfile = getMe;

module.exports = { registerUser, authUser, logoutUser, getMe, getUserProfile };
