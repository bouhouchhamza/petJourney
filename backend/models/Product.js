const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title:     { type: DataTypes.STRING,  allowNull: false },
  category:  { type: DataTypes.STRING,  allowNull: false },
  price:     { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stock:     { type: DataTypes.INTEGER, defaultValue: 0 },
  image_url: { type: DataTypes.TEXT,    allowNull: true },
}, {
  tableName: 'products',
  timestamps: true,
});

module.exports = Product;
