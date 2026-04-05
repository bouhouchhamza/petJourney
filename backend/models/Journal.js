const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Journal = sequelize.define('Journal', {
  id:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title:   { type: DataTypes.STRING,  allowNull: false },
  date:    { type: DataTypes.DATEONLY, allowNull: false },
  content: { type: DataTypes.TEXT,    allowNull: false },
  image:   { type: DataTypes.TEXT,    allowNull: true },
  status:  { type: DataTypes.ENUM('Success', 'Challenge'), allowNull: false },
}, {
  tableName: 'journal_entries',
  timestamps: true,
});

module.exports = Journal;
