const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
  id:               { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customer_name:    { type: DataTypes.STRING,  allowNull: false },
  customer_email:   { type: DataTypes.STRING,  allowNull: true },
  product_id:       { type: DataTypes.INTEGER, allowNull: true },
  product_title:    { type: DataTypes.STRING,  allowNull: true },
  engraving_text:   { type: DataTypes.STRING,  allowNull: true },
  phone:            { type: DataTypes.STRING,  allowNull: true },
  finish:           { type: DataTypes.STRING,  allowNull: true },
  status:           { type: DataTypes.ENUM('Pending', 'Crafting', 'Shipped'), defaultValue: 'Pending' },
}, {
  tableName: 'orders',
  timestamps: true,
});

module.exports = Order;
