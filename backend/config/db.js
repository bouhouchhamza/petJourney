const { Sequelize } = require('sequelize');
const path = require('path');

// Load .env from backend folder
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Detect if we're targeting Aiven Cloud or local MySQL
const isCloud = !!(process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com'));

// ─── SSL Configuration ───────────────────────────────────────────────────────
// SECURITY NOTE: Aiven uses certificates signed by their own CA, not a public CA.
// Setting rejectUnauthorized:true would require downloading Aiven's CA cert and
// passing it via the `ca` option. With rejectUnauthorized:false, the connection
// is still encrypted (TLS) — we just skip CA verification.
// For maximum security, download the CA cert from Aiven Console and set:
//   ssl: { require: true, rejectUnauthorized: true, ca: fs.readFileSync('ca.pem') }
const sslConfig = isCloud
  ? { require: true, rejectUnauthorized: false }
  : false;

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
      ssl: sslConfig,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    retry: {
      max: 3, // Sequelize-level operation retry
    },
  }
);

// ─── connectDB (with exponential backoff retry) ──────────────────────────────
// Retries up to MAX_RETRIES times with exponential backoff.
// On Vercel (serverless), this prevents cold-start failures from transient
// DNS/network issues (ENOTFOUND, ETIMEDOUT) that resolve on the next attempt.
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

const connectDB = async () => {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await sequelize.authenticate();
      console.log(`✅ DATABASE: ${isCloud ? 'Aiven Cloud' : 'Local'} MySQL Connected`);
      return; // Success — exit immediately
    } catch (err) {
      lastError = err;
      const isRetryable = ['ENOTFOUND', 'ETIMEDOUT', 'ECONNREFUSED', 'ECONNRESET']
        .includes(err?.original?.code || err?.parent?.code);

      if (attempt < MAX_RETRIES && isRetryable) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1); // 1s, 2s, 4s
        console.warn(`⚠️ DB connect attempt ${attempt}/${MAX_RETRIES} failed (${err?.original?.code || err.message}). Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // Non-retryable error or max retries exhausted
        break;
      }
    }
  }

  // All retries exhausted — throw so the caller (server.js) can handle it
  console.error(`❌ DATABASE: Failed after ${MAX_RETRIES} attempts:`, lastError?.message);
  throw lastError;
};

module.exports = { sequelize, connectDB };