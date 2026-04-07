const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CartItem = sequelize.define('CartItem', {
  id:             { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:        { type: DataTypes.INTEGER, allowNull: false },
  product_id:     { type: DataTypes.STRING,  allowNull: true },
  product_title:  { type: DataTypes.STRING,  allowNull: true },
  product_price:  { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  image_url:      { type: DataTypes.TEXT,    allowNull: true },
  category:       { type: DataTypes.STRING,  allowNull: true },
  quantity:       { type: DataTypes.INTEGER,  allowNull: false, defaultValue: 1 },
  finish:         { type: DataTypes.STRING,  allowNull: true },
  engraving_text: { type: DataTypes.STRING,  allowNull: true },
  phone:          { type: DataTypes.STRING,  allowNull: true },
  size:           { type: DataTypes.STRING,  allowNull: true },
}, {
  tableName: 'cart_items',
  timestamps: true,
});

module.exports = CartItem;
