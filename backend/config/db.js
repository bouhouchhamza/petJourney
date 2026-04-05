const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const DB_NAME = process.env.DB_NAME || 'petjourney';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = parseInt(process.env.DB_PORT) || 3306;

// Step 1: Create the database if it doesn't exist
const ensureDatabase = async () => {
  try {
    const conn = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASS,
      connectTimeout: 10000,
    });
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await conn.end();
    console.log(`✅ DATABASE: '${DB_NAME}' is ready`);
  } catch (err) {
    console.error('❌ MySQL Connection Error:', err.message);
    console.error('   → Make sure Laragon/XAMPP MySQL is running on port', DB_PORT);
  }
};

// Step 2: Sequelize instance (connects to petjourney database)
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
  dialectOptions: { connectTimeout: 10000 },
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
});

const connectDB = async () => {
  await ensureDatabase();
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connected & Tables Synced');
  } catch (error) {
    console.error('❌ MySQL Connection Error:', error.message);
  }
};

module.exports = { sequelize, connectDB };
