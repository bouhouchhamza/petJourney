const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { sequelize, connectDB } = require('./config/db');

// Register all models before sync
require('./models/User');
require('./models/Product');
require('./models/Journal');
require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', database: '✅ MySQL Connected' });
  } catch (e) {
    res.json({ status: 'degraded', database: `❌ ${e.message}` });
  }
});

// Routes
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api', require('./routes/rootRoutes'));

// Boot sequence
// 1. Export l-app darouri bach Vercel i-choufha
module.exports = app;

// 2. Modified Boot sequence (Only runs locally)
const start = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log('✅ DATABASE: All tables created/synced');
  } catch (err) {
    console.warn('⚠️ Table sync issue:', err.message);
  }

  // Khalli app.listen i-khdem ghir ila knti f Local (machi f Vercel)
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`║  ✅  Backend running on port ${PORT}      ║`);
    });
  }
};

// Ila knti f local, run start(). Ila f Vercel, connectDB() khass t-call-a f wast l-routes
if (process.env.NODE_ENV !== 'production') {
  start();
}