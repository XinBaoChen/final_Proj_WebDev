/*==================================================
/database/db.js

It sets up Sequelize with Postgres database. 
- Create a Sequelize instance to connect to the database specifying database name, username, and password.
==================================================*/
/* INSTANTIATE DATABASE */ 

// Import module dependencies
const Sequelize = require('sequelize');  // Import Sequelize
const {dbName, dbUser, dbPwd, dbHost, dbPort} = require('./utils/configDB');  // Import database connection defaults

// Display a confirmation message for opening a database connection
console.log('Opening database connection');

// If a full DATABASE_URL is provided (as on Railway/Supabase/Heroku), prefer that.
// Otherwise fall back to individual values for local development.
let sequelize;
if (process.env.DATABASE_URL) {
  // When running in production on many hosts, SSL is required. Provide dialectOptions accordingly.
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production' ? {
      ssl: {
        require: true,
        // Some managed DBs use self-signed certs; do not reject unauthorized by default.
        rejectUnauthorized: false
      }
    } : {}
  });
} else {
  // Local development fallback
  sequelize = new Sequelize(dbName, dbUser, dbPwd, {
    host: dbHost || 'localhost',
    port: dbPort || 5432,
    dialect: 'postgres',
    logging: false
  });
}

// Export Sequelize instance, which will be modified with models.
module.exports = sequelize;