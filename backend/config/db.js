const { Sequelize } = require('sequelize');
const path = require('path');

// Load .env from backend folder
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Detect if we're targeting Aiven Cloud or local MySQL
const isCloud = !!(process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com'));

// ─── Sequelize Instance ────────────────────────────────────────────────────────
const sequelize = new Sequelize(
  process.env.DB_NAME     || 'defaultdb',
  process.env.DB_USER     || 'avnadmin',
  process.env.DB_PASSWORD || '',
  {
    host:    process.env.DB_HOST    || '127.0.0.1',
    port:    parseInt(process.env.DB_PORT) || (isCloud ? 11895 : 3306),
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      connectTimeout: 20000,
      // Aiven REQUIRES SSL. rejectUnauthorized:false accepts Aiven's self-signed cert.
      ssl: isCloud ? { require: true, rejectUnauthorized: false } : false,
    },
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  }
);

// ─── connectDB ─────────────────────────────────────────────────────────────────
// IMPORTANT: Does NOT call process.exit(1).
// On Vercel (serverless), process.exit() kills the Lambda function entirely.
// Instead we THROW the error so the caller (server.js middleware) can return 503.
const connectDB = async () => {
  await sequelize.authenticate();
  console.log(`✅ DATABASE: ${isCloud ? 'Aiven Cloud' : 'Local'} MySQL Connected`);
};

module.exports = { sequelize, connectDB };