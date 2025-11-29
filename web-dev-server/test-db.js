// Quick DB connectivity test
(async () => {
  try {
    const getSequelize = require('./database/db');
    const Sequelize = getSequelize();
    console.log('Sequelize instance created. Attempting authenticate()...');
    await Sequelize.authenticate({ timeout: 5000 });
    console.log('DB connection: OK');
    process.exit(0);
  } catch (err) {
    console.error('DB connection failed:');
    console.error(err && err.message ? err.message : err);
    if (err && err.stack) console.error(err.stack);
    process.exit(2);
  }
})();
