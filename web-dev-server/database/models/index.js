/*==================================================
/database/models/index.js

It registers models, sets up associations between tables, and generates barrel file for exporting the models.
==================================================*/
const Student  = require('./Student');  // Import Student model
const Campus  = require('./Campus');  // Import Campus model

// Use an explicit foreign key name to ensure a predictable column in Postgres
// and avoid default "CampusId" casing issues.
Student.belongsTo(Campus, { foreignKey: { name: 'campusId', allowNull: true }, onDelete: 'SET NULL' });
Campus.hasMany(Student, { foreignKey: { name: 'campusId', allowNull: true } });

// Export models and associations
module.exports = {
  Student,
  Campus
};