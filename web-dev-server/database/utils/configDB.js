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
// NOTE: For production deployments you should provide a full `DATABASE_URL`
// environment variable (used by `web-dev-server/database/db.js`) instead of
// individual host/user/password values. The `dbHost` below is only a local
// fallback used when `DATABASE_URL` is not present.
//
// If you want to test against your Supabase instance locally without setting
// `DATABASE_URL`, you can set the default here (or set `DB_HOST` in your
// environment). Replace with your Supabase host as needed.
const dbHost = process.env.DB_HOST || process.env.PGHOST || 'db.kakvhlidhhqxpakadbsq.supabase.co';
const dbPort = process.env.DB_PORT || process.env.PGPORT || 5432;

module.exports = {
  dbName,
  dbUser,
  dbPwd,
  dbHost,
  dbPort
};
