const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { sequelize, connectDB } = require('./config/db');

// Register all models before any sync
require('./models/User');
require('./models/Product');
require('./models/Journal');
require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ─────────────────────────────────────────────────────────────────────
// CRITICAL for Vercel: credentials:true requires an explicit origin list.
// '*' does NOT work with credentials. Add your Vercel frontend URL to env.
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,           // e.g. https://your-app.vercel.app
].filter(Boolean);                    // Remove undefined if FRONTEND_URL not set

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked: ${origin} is not in allowed list`));
  },
  credentials: true,    // REQUIRED: allows browser to send/receive cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Request Logger ───────────────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// ─── Health Check (DB ping) ───────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', database: '✅ MySQL Connected' });
  } catch (e) {
    res.json({ status: 'degraded', database: `❌ ${e.message}` });
  }
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api', require('./routes/rootRoutes'));

// ─── 404 Catch-all ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('GLOBAL_ERROR:', err.message);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
});

// ─── Export for Vercel Serverless ─────────────────────────────────────────────
// Vercel imports this file as a module — module.exports = app is REQUIRED.
module.exports = app;

// ─── Local Dev: Connect DB & Start Server ─────────────────────────────────────
// On Vercel (production), connectDB is called lazily inside each route handler
// via the db config. Here we spin up the full server for local development.
if (process.env.NODE_ENV !== 'production') {
  const start = async () => {
    try {
      await connectDB();
      await sequelize.sync({ alter: true });
      console.log('✅ DATABASE: All tables created/synced');
    } catch (err) {
      console.warn('⚠️ Table sync issue:', err.message);
    }

    app.listen(PORT, () => {
      console.log(`╔════════════════════════════════════╗`);
      console.log(`║  ✅  Backend running on :${PORT}     ║`);
      console.log(`╚════════════════════════════════════╝`);
    });
  };

  start();
}