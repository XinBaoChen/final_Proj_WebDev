/*
  scripts/checkDb.js
  Simple script to verify DB connectivity using the project's Sequelize instance.
  Usage: node scripts/checkDb.js
*/

const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'web-dev-server', 'database', 'db'));

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB authentication successful');
    process.exit(0);
  } catch (err) {
    console.error('DB authentication failed:');
    console.error(err && err.message ? err.message : err);
    if (err && err.stack) console.error(err.stack);
    process.exit(1);
  }
})();
