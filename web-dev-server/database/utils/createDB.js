/*==================================================
/database/utils/creatDB.js

It creates the actual Postgres database. 
After the Postgres database is created, Sequelize can connect to it.
==================================================*/
const pgtools = require('pgtools');  // Import tool to create Postgres database.
const {dbName, dbUser, dbPwd, dbHost, dbPort} = require('./configDB');  // Import the database name, username, password and host/port.

// Declare configuration parameters of the Postgres database.
const config = {
  user: dbUser,
  host: dbHost || 'localhost',
  port: dbPort || 5432,
  password: dbPwd
};
    
// Define function to create Postgres database.
// If the database of that name already exists, this does nothing.
// If the database doesn't exist, this will create the Postgres database of that name. 
const createDB = async () => {
  // Safety guards: do not attempt to create a local DB when a hosted
  // `DATABASE_URL` is in use, when the user explicitly requested to skip
  // creation, or when running inside a serverless host like Vercel.
  // If using DATABASE_URL or using SQLite for local dev, skip createDB.
  if (process.env.DATABASE_URL) {
    console.log('createDB: skipping because DATABASE_URL is present');
    return;
  }
  // If using the local SQLite fallback, there's no Postgres to create.
  if (!process.env.DATABASE_URL && (process.env.USE_SQLITE === 'true' || !process.env.DB_HOST)) {
    console.log('createDB: skipping because using local SQLite fallback');
    return;
  }
  if (process.env.SKIP_CREATE_DB === 'true') {
    console.log('createDB: skipping because SKIP_CREATE_DB=true');
    return;
  }
  // Vercel and other serverless platforms set environment markers — avoid
  // attempting to create a local Postgres in those environments.
  if (process.env.VERCEL || process.env.NOW_BUILDER) {
    console.log('createDB: skipping in serverless environment');
    return;
  }

  try {
    await pgtools.createdb(config, dbName);
    console.log(`Successfully created the database: ${dbName}!`);  // Display message if database creation successful
  } 
  catch (err) {
    if (err && err.name === 'duplicate_database') {
      console.log(`Database ${dbName} already exists`);  // Display message if database already exists
      return;
    } else {
      // Log the error but do NOT exit the process in a serverless environment.
      // Exiting will terminate the function host; instead surface the error
      // so the caller (boot) can decide how to proceed.
      console.error('createDB error:', err);
      return; // allow caller to continue (bootApp should handle missing DB)
    }
  }
}

// Export the database creation function
module.exports = createDB;