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