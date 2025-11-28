/*==================================================
/app.js

This is the top-level (main) file for the server application.
It is the first file to be called when starting the server application.
It initiates all required parts of server application such as Express, routes, database, etc.  
==================================================*/
/* SET UP DATABASE */
// Database utilities are only required when running the server directly.
// Guard requiring/booting so serverless functions that `require` this file
// don't execute database creation or start the HTTP listener.

/* MODEL SYNCHRONIZATION & DATABASE SEEDING */
// Set up sync and seed process
const syncDatabase = async () => {
  try {
    // Model Synchronization:
    // - Make a connection between the Node.js application (this server app) and the Postgres database application.
    // - Create new tables (according to the models) in the Postgres database application, dropping tables first if they already existed
    await db.sync({force: true});  // Drop table if already exists (force: true)
    console.log('------Synced to db--------')
    // Database Seeding
    await seedDB();  
    console.log('--------Successfully seeded db--------');
  } 
  catch (err) {
    console.error('syncDB error:', err);
  }  
}

/* SET UP EXPRESS APPLICATION */
// Import Express application
const express = require("express");
// Create an Express application called "app"
const app = express();

/* SET UP ROUTES */
// Import sub-routes and associated router functions for students and campuses
const apiRouter = require('./web-dev-server/routes/index');

/* CONFIGURE EXPRESS APPLICATION */
// Create a function to configure the Express application
const configureApp = async () => {
  // Middleware to handle request data and response
  app.use(express.json());  // Set up Express to parse JSON requests and generate JSON responses
  app.use(express.urlencoded({ extended: false }));  // Express to parse requests encoded in URL format and querystring

  // Set up the Express application's main top-level route and attach all sub-routes to it
  // Add main top-level URL path "/api" before sub-routes
  app.use("/api", apiRouter);  // Updated (complete) URL paths for API: "/api/students/", "/api/students/:id", "/api/campuses/", and "/api/campuses/:id"

  // Handle routing error: Page Not Found
  // It is triggered when a request is made to an undefined route 
  app.use((req, res, next) => {
    const error = new Error("Not Found, Please Check URL!");
    error.status = 404;  // Status code 404 Not Found - resource not found
    next(error);  // Call Error-Handling Middleware to handle the error
  });
  // Routing Error-Handling Middleware:
  // All Express routes' errors get passed to this when "next(error)" is called
  app.use((err, req, res, next) => {
    console.error(err);
    console.log(req.originalUrl);
    res.status(err.status || 500).send(err.message || "Internal server error.");  // Status code 500 Internal Server Error - server error
  });
};

/* SET UP BOOT FOR SERVER APPLICATION */
// Construct the boot process by incorporating all needed processes. The
// actual DB-related modules are required lazily inside the guarded block
// so that requiring this module from serverless functions does not
// trigger side effects.
const bootApp = async (createDB, seedDB, db) => {
  await createDB();  // Create database (if not exists)
  await db.sync({force: true});  // Drop table if already exists (force: true)
  console.log('------Synced to db--------')
  await seedDB();
  console.log('--------Successfully seeded db--------');
  await configureApp();  // Start and configure Express application
};

// Only start the server when this file is executed directly. This prevents
// serverless function invocations (which may `require('./app')`) from
// running the boot sequence and attempting to create/connect to a local DB.
if (require.main === module) {
  // Lazy-require DB utilities used only during direct server boot.
  const createDB = require('./web-dev-server/database/utils/createDB');
  const seedDB = require('./web-dev-server/database/utils/seedDB');
  const db = require('./web-dev-server/database');

  // Start the boot process and then listen on the configured port.
  bootApp(createDB, seedDB, db).catch(err => {
    console.error('Server boot failed:', err);
    // Do not call process.exit() in case this is running in an environment
    // that expects the process to be managed by the host.
  });

  const PORT = 5001;  // Server application access point port number
  app.listen(PORT, () => console.log(`Server started on ${PORT}`));
}

// Export the Express app so serverless platforms (Vercel) can consume it
// as a serverless handler when this module is required. This does not
// start the server because the boot sequence is guarded by
// `require.main === module` above.
module.exports = app;