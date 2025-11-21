const path = require('path');
const db = require(path.join(__dirname, '..', 'web-dev-server', 'database'));
const seedDB = require(path.join(__dirname, '..', 'web-dev-server', 'database', 'utils', 'seedDB'));

const run = async () => {
  try {
    console.log('Syncing DB (force: true)');
    await db.sync({ force: true });
    console.log('DB synced. Running seed...');
    await seedDB();
    console.log('Seed completed.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

run();
