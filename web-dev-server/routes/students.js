/*==================================================
/routes/students.js

It defines all the students-related routes.
==================================================*/
// Import Express module
const express = require('express');
// Create an Express router function called "router"
const router = express.Router();
// Import database models
const { Student, Campus } = require('../database/models');

// Import a middleware to replace "try and catch" for request handler, for a concise coding (fewer lines of code)
const ash = require('express-async-handler');

/* GET ALL STUDENTS: async/await using "try-catch" */
// router.get('/', async (req, res, next) => {
//   try {
//     let students = await Student.findAll({include: [Campus]});
//     res.status(200).json(students);
//   } 
//   catch(err) {
//     next(err);
//   }
// });

/* GET ALL STUDENTS: async/await using express-async-handler (ash) */
// Automatically catches any error and sends to Routing Error-Handling Middleware (app.js)
// It is the same as using "try-catch" and calling next(error)
router.get('/', ash(async(req, res) => {
  let students = await Student.findAll({include: [Campus]});
  res.status(200).json(students);  // Status code 200 OK - request succeeded
}));

/* GET STUDENT BY ID */
router.get('/:id', ash(async(req, res) => {
  // Find student by Primary Key
  let student = await Student.findByPk(req.params.id, {include: [Campus]});  // Get the student and its associated campus
  res.status(200).json(student);  // Status code 200 OK - request succeeded
}));

/* ADD NEW STUDENT */
router.post('/', ash(async (req, res, next) => {
  // Normalize campusId: convert empty string to undefined, convert to integer if present
  const payload = { ...req.body };
  if (payload.campusId === '' || payload.campusId === null || payload.campusId === undefined) {
    delete payload.campusId;
  } else {
    // try to coerce to integer
    const parsed = parseInt(payload.campusId);
    if (Number.isNaN(parsed)) {
      return res.status(400).json({ error: 'Invalid campusId' });
    }
    payload.campusId = parsed;
    // ensure campus exists before attempting to insert to avoid FK constraint error
    const campus = await Campus.findByPk(payload.campusId);
    if (!campus) {
      return res.status(400).json({ error: `Campus with id ${payload.campusId} not found` });
    }
  }

  const createdStudent = await Student.create(payload);
  res.status(200).json(createdStudent);
}));

/* DELETE STUDENT */
router.delete('/:id', function(req, res, next) {
  Student.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(() => res.status(200).json("Deleted a student!"))
    .catch(err => next(err));
});

/* EDIT STUDENT */
router.put('/:id', ash(async(req, res) => {
  await Student.update(req.body,
        { where: {id: req.params.id} }
  );
  // Find student by Primary Key
  let student = await Student.findByPk(req.params.id);
  res.status(201).json(student);  // Status code 201 Created - successful creation of a resource
}));

// Export router, so that it can be imported to construct the apiRouter (app.js)
module.exports = router;