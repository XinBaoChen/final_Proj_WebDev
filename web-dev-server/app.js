/*==================================================
/app.js

This is the top-level (main) file for the server application.
It is the first file to be called when starting the server application.
It initiates all required parts of server application such as Express, routes, database, etc.  
==================================================*/
/* SET UP DATABASE */
// Import database setup utilities
const createDB = require('./database/utils/createDB');  // Import function to create database
const seedDB = require('./database/utils/seedDB');  // Import function to seed database
// Import database instance for database connection (including database name, username, and password)
const db = require('./database');
const { Campus, Student } = require('./database/models');

/* MODEL SYNCHRONIZATION & DATABASE SEEDING */
// Set up sync and seed process
const syncDatabase = async () => {
  try {
    // Ensure target schema exists (Postgres only). If it already exists,
    // this will throw; safely ignore in that case.
    try { await db.createSchema('campuses'); } catch (_) {}
    // Model Synchronization:
    // By default do a non-destructive sync. To force a drop-and-create, set env var `FORCE_SYNC=true`.
    const force = process.env.FORCE_SYNC === 'true';
    // If not forcing a full drop-and-create, enable alter so Sequelize
    // will add missing columns like the explicit `campusId` FK.
    const alter = !force;
    await db.sync({ force, alter });
    console.log('------Synced to db--------')
    // Database Seeding
    // Seed when explicitly requested via env var `SEED_DB=true`, when forcing
    // a sync, or when the campuses table is empty (first run for graders).
    const shouldSeedFlag = process.env.SEED_DB === 'true' || force;
    const campusCount = await Campus.count();
    const needsSeed = campusCount === 0;
    if (shouldSeedFlag || needsSeed) {
      await seedDB();
      console.log('--------Successfully seeded db--------');
    }
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
const path = require('path');
const fs = require('fs');

/* SET UP ROUTES */
// Import sub-routes and associated router functions for students and campuses
const apiRouter = require('./routes/index');

/* CONFIGURE EXPRESS APPLICATION */
// Create a function to configure the Express application
const configureApp = async () => {
  // Middleware to handle request data and response
  app.use(express.json());  // Set up Express to parse JSON requests and generate JSON responses
  app.use(express.urlencoded({ extended: false }));  // Express to parse requests encoded in URL format and querystring

  // Set up the Express application's main top-level route and attach all sub-routes to it
  // Add main top-level URL path "/api" before sub-routes
  app.use("/api", apiRouter);  // Updated (complete) URL paths for API: "/api/students/", "/api/students/:id", "/api/campuses/", and "/api/campuses/:id"

  // Serve the client build (if present) so localhost:5001 can behave like production.
  // This will serve files from ../public and fall back to index.html for non-/api routes.
  const publicPath = path.join(__dirname, '../public');
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
    app.get('*', (req, res, next) => {
      // Let API routes pass through
      if (req.originalUrl.startsWith('/api')) return next();
      res.sendFile(path.join(publicPath, 'index.html'), (err) => {
        if (err) next(err);
      });
    });
  } else {
    // Friendly root + favicon handlers to avoid noisy 404 logs from browsers
    app.get('/', (req, res) => {
      res.send('API running. Use /api/* endpoints.');
    });
    app.get('/favicon.ico', (req, res) => res.sendStatus(204));
  }

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
// Construct the boot process by incorporating all needed processes
const bootApp = async () => {
  // Only attempt to create a local database when we're not using a full
  // `DATABASE_URL` (hosted DBs like Supabase) and when the user hasn't
  // explicitly requested to skip creation via `SKIP_CREATE_DB=true`.
  if (!process.env.DATABASE_URL && process.env.SKIP_CREATE_DB !== 'true') {
    await createDB();
  } else {
    console.log('Skipping createDB: using DATABASE_URL or SKIP_CREATE_DB set');
  }
  await syncDatabase();  // Seed the database
  await configureApp();  // Start and configure Express application
};

/* START THE SERVER BOOT WHEN RUN DIRECTLY */
// Only start the boot process and listen when this file is executed directly.
// When this module is required by serverless functions (e.g. Vercel), we don't
// want to automatically start a long-running HTTP server or attempt local DB
// creation — those will run inside the serverless runtime and should be
// avoided. Guard with require.main check accordingly.
if (require.main === module) {
  (async () => {
    // Run boot process (sync/seed/configure) then start listening.
      await bootApp();
      const PORT = parseInt(process.env.PORT, 10) || 5001;
      const preferredHosts = [process.env.HOST || 'localhost', '127.0.0.1', '0.0.0.0'];

      // Try binding to preferred hosts in order. If a host is in use, try the
      // next one instead of crashing the process.
      let started = false;
      for (const HOST of preferredHosts) {
        try {
          await new Promise((resolve, reject) => {
            const server = app.listen(PORT, HOST, () => {
              console.log(`Server started at http://${HOST}:${PORT}`);
              started = true;
              resolve();
            });
            server.on('error', (err) => reject(err));
          });
          if (started) break;
        } catch (err) {
          if (err && err.code === 'EADDRINUSE') {
            console.warn(`Port ${PORT} in use on ${HOST}, trying next host...`);
            continue;
          }
          console.error('Failed to start server:', err);
          process.exit(1);
        }
      }
      if (!started) {
        console.error(`Unable to bind to port ${PORT} on any host (${preferredHosts.join(', ')}).`);
        process.exit(1);
      }
  })();
}