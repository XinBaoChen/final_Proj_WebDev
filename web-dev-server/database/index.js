/*==================================================
/database/index.js

It exports both database instance and models so that "App.js" file can import them from "database" folder.
==================================================*/
// `./db` exports a lazy getter function; call it here to obtain the
// actual Sequelize instance and then register models. Export the
// Sequelize instance so callers can call `db.sync()` as expected.
const getSequelize = require('./db');
const db = getSequelize();

// Register models (they will use the same Sequelize instance)
require('./models');

module.exports = db;