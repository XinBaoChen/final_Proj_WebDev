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
    allowNull: false
  },

  address: {
    type: Sequelize.STRING,
    allowNull: false
  },

  description: {
    type: Sequelize.STRING,
  }
  ,
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  }
});

// Export the campus model
module.exports = Campus;