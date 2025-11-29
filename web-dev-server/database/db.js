/*
  web-dev-server/database/db.js

  Lazy Sequelize getter. Prefer Postgres when `DATABASE_URL` is set;
  otherwise use a local SQLite file so the server can be started with
  `npm start` for teacher/local testing without Docker or Postgres.
*/

const { Sequelize } = require('sequelize');

function getSequelize() {
  if (global.__sequelize) return global.__sequelize;

  let sequelize;
  if (process.env.DATABASE_URL) {
    const poolMax = parseInt(process.env.DB_POOL_MAX || (process.env.NODE_ENV === 'production' ? 1 : 5));
    const useSsl = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';

    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      logging: false,
      pool: {
        max: poolMax,
        min: 0,
        idle: 10000
      },
      dialectOptions: useSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {}
    });
  } else {
    const storagePath = process.env.SQLITE_STORAGE || './dev.sqlite';
    sequelize = new Sequelize({ dialect: 'sqlite', storage: storagePath, logging: false });
  }

  global.__sequelize = sequelize;
  return sequelize;
}

module.exports = getSequelize;