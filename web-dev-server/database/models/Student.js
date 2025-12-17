/*==================================================
/database/models/Student.js

It defines the student model for the database.
==================================================*/
const Sequelize = require('sequelize');  // Import Sequelize
const getSequelize = require('../db');  // Import getter for Sequelize instance
const db = getSequelize();  // Lazily obtain the Sequelize instance

const Student = db.define("student", {
  firstname: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },

  lastname: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },

  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { isEmail: true, notEmpty: true }
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&q=80'
  },
  gpa: {
    type: Sequelize.FLOAT,
    allowNull: true,
    validate: { min: 0.0, max: 4.0 }
  }
}, { schema: 'campuses' });

// Export the student model
module.exports = Student;