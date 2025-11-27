/*==================================================
/database/utils/configDB.js

It declares and exports the variables for database name, username, and password.
==================================================*/
// Read database configuration from environment when available (for deployment).
// - If `DATABASE_URL` is present, `db.js` will use that connection string directly.
// - Otherwise fall back to individual env vars or local defaults for development.

const dbName = process.env.DB_NAME || process.env.PGDATABASE || 'starter-server';
const dbUser = process.env.DB_USER || process.env.PGUSER || 'postgres';
const dbPwd = process.env.DB_PWD || process.env.PGPASSWORD || 'steven';
const dbHost = process.env.DB_HOST || process.env.PGHOST || 'localhost';
const dbPort = process.env.DB_PORT || process.env.PGPORT || 5432;

module.exports = {
  dbName,
  dbUser,
  dbPwd,
  dbHost,
  dbPort
};
