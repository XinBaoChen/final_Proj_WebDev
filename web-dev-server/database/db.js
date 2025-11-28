/*==================================================
/database/db.js

It sets up Sequelize with Postgres database. 
- Create a Sequelize instance to connect to the database specifying database name, username, and password.
==================================================*/
/* INSTANTIATE DATABASE */ 

// Import module dependencies
const Sequelize = require('sequelize');  // Import Sequelize
const {dbName, dbUser, dbPwd, dbHost, dbPort} = require('./utils/configDB');  // Import database connection defaults

// Lazy-initialize and cache the Sequelize instance. This avoids attempting
// to load the Postgres driver or open outbound connections at module
// require-time (which can crash serverless function bundles).
function createSequelizeInstance() {
  // Display a confirmation message when actually opening a connection
  console.log('Opening database connection');

  if (process.env.DATABASE_URL) {
    const poolMax = parseInt(process.env.DB_POOL_MAX || (process.env.NODE_ENV === 'production' ? 1 : 5));
    const useSsl = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';

    return new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      logging: false,
      pool: {
        max: poolMax,
        min: 0,
        idle: 10000
      },
      dialectOptions: useSsl ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {}
    });
  }

  // Local development fallback
  return new Sequelize(dbName, dbUser, dbPwd, {
    host: dbHost || 'localhost',
    port: dbPort || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || 5),
      min: 0,
      idle: 10000
    }
  });
}

function getSequelize() {
  if (global.__sequelize) return global.__sequelize;
  const sequelize = createSequelizeInstance();
  global.__sequelize = sequelize;
  return sequelize;
}

module.exports = getSequelize;