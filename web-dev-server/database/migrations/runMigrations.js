/*
  runMigrations.js

  Lightweight migration runner that uses Sequelize models to create or update
  the database schema. This is not a full-featured migration system but is
  convenient for development and simple deployments.

  Usage: from repo root: `npm run migrate`
*/

const sequelize = require('../db');
const models = require('../models');

(async () => {
  try {
    console.log('Running migrations: synchronizing models to database (alter=true)...');
    // alter:true will try to update tables to match models without dropping data.
    await sequelize.sync({ alter: true });
    console.log('Migrations complete.');
    process.exit(0);
  } catch (err) {
    console.error('Migrations failed:', err && err.message ? err.message : err);
    if (err && err.stack) console.error(err.stack);
    process.exit(1);
  }
})();
