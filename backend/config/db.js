const { Sequelize } = require('sequelize');
const path = require('path');

// 1. Nadiw l-variables men .env (wast folder backend)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// 2. Logic bach n-viriifiw wach 7na f Cloud wala Local
const isCloud = process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'defaultdb',
  process.env.DB_USER || 'avnadmin',
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || (isCloud ? 11895 : 3306),
    dialect: 'mysql',
    logging: false, // Disable logs bach terminal y-bqa nqi
    dialectOptions: {
      connectTimeout: 10000,
      ssl: isCloud ? {
        require: true,
        rejectUnauthorized: false // 🚨 HADA HOUWA L-MOUFTAH
      } : false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// 3. Fonction dial l-Connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ DATABASE: ${isCloud ? 'Cloud (Aiven)' : 'Local'} MySQL Connected!`);

    // Sync tables (Alter: true kat-zid l-columns bla ma t-mme7 l-data)
    await sequelize.sync({ alter: true });
    console.log('✅ DATABASE: All tables synced.');
  } catch (error) {
    console.error('❌ DATABASE Error:', error.message);

    if (!isCloud) {
      console.error('  → Tip: Check if XAMPP/Laragon MySQL is running.');
    }

    // Mat-khllich l-app t-kemmel ila makanch connection
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };