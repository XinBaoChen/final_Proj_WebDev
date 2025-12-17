/*
  web-dev-server/database/db.js

  Lazy Sequelize getter. Prefer Postgres when `DATABASE_URL` is set;
  otherwise use a local SQLite file so the server can be started with
  `npm start` for teacher/local testing without Docker or Postgres.
*/

const { Sequelize } = require('sequelize');
const { dbName, dbUser, dbPwd, dbHost, dbPort } = require('./utils/configDB');

function getSequelize() {
  if (global.__sequelize) return global.__sequelize;

  const useDatabaseUrl = Boolean(process.env.DATABASE_URL);
  const poolMax = parseInt(process.env.DB_POOL_MAX || (process.env.NODE_ENV === 'production' ? 1 : 5));
  const useSsl = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';

  const baseOptions = {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    pool: {
      max: poolMax,
      min: 0,
      idle: 10000,
    },
    dialectOptions: useSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
  };

  const sequelize = useDatabaseUrl
    ? new Sequelize(process.env.DATABASE_URL, baseOptions)
    : new Sequelize(dbName, dbUser, dbPwd, {
        host: dbHost,
        port: dbPort,
        ...baseOptions,
      });

  global.__sequelize = sequelize;
  return sequelize;
}

module.exports = getSequelize;