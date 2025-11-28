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
    allowNull: false
  },

  lastname: {
    type: Sequelize.STRING,
    allowNull: false
  }
  ,
  email: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: { isEmail: true }
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  },
  gpa: {
    type: Sequelize.FLOAT,
    allowNull: true,
    validate: { min: 0.0, max: 4.0 }
  }
});

// Export the student model
module.exports = Student;