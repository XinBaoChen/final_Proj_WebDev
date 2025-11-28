/*
  seedIfEmpty.js
  Non-destructive seeder: only inserts sample campuses/students if tables are empty.
  Usage: from repo root: `npm run seed:ensure`
*/

const { Campus, Student } = require('../models');

const run = async () => {
  try {
    const campusCount = await Campus.count();
    const studentCount = await Student.count();

    if (campusCount === 0 && studentCount === 0) {
      console.log('No campuses or students found — inserting sample data.');

      const c1 = await Campus.create({
        name: 'Hunter College',
        address: '695 Park Ave, New York, NY 10065',
        description: 'This is a school in New York, New York.',
        imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80'
      });

      const c2 = await Campus.create({
        name: 'Queens College',
        address: '65-30 Kissena Blvd, Queens, NY 11367',
        description: 'This is a school in Queens, New York.',
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80'
      });

      const s1 = await Student.create({
        firstname: 'Joe',
        lastname: 'Smith',
        email: 'joe.smith@example.com',
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&q=80',
        gpa: 3.2
      });

      const s2 = await Student.create({
        firstname: 'Mary',
        lastname: 'Johnson',
        email: 'mary.johnson@example.com',
        imageUrl: 'https://images.unsplash.com/photo-1545996124-1a00bca4d6f8?w=256&q=80',
        gpa: 3.8
      });

      await s1.setCampus(c1);
      await s2.setCampus(c2);

      console.log('Sample data inserted.');
    } else {
      console.log(`Database already has data (campuses=${campusCount}, students=${studentCount}). Skipping seeding.`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err && err.message ? err.message : err);
    if (err && err.stack) console.error(err.stack);
    process.exit(1);
  }
};

run();
