/*==================================================
/database/models/Campus.js

It defines the campus model for the database.
==================================================*/
const Sequelize = require('sequelize');  // Import Sequelize
const getSequelize = require('../db');  // Import getter for Sequelize instance
const db = getSequelize();  // Lazily obtain the Sequelize instance

// Define the campus model
const Campus = db.define("campus", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },

  address: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },

  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },

  imageUrl: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80'
  }
}, { schema: 'campuses' });

// Export the campus model
module.exports = Campus;