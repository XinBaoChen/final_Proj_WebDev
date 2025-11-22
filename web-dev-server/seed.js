/*==================================================
/seed.js

Utility script to force-sync and seed the database.
Usage: from the repo root: `node web-dev-server/seed.js` or `cd web-dev-server && npm run seed` if script added.
==================================================*/
const db = require('./database');
const seedDB = require('./database/utils/seedDB');

const run = async () => {
  try {
    console.log('Seeding: forcing db sync (DROP & CREATE)');
    await db.sync({ force: true });
    await seedDB();
    console.log('Seed completed.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

run();
