const { Student, Campus } = require('../../web-dev-server/database/models');

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const students = await Student.findAll({ include: [Campus] });
      return res.status(200).json(students);
    }

    if (req.method === 'POST') {
      const body = req.body || await getBody(req);
      // normalize campusId
      if (body.campusId === '' || body.campusId === null || body.campusId === undefined) delete body.campusId;
      else body.campusId = parseInt(body.campusId);

      const created = await Student.create(body);
      const createdWithCampus = await Student.findByPk(created.id, { include: [Campus] });
      return res.status(200).json(createdWithCampus);
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end('Method Not Allowed');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};

function getBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')); } catch (e) { resolve({}); }
    });
    req.on('error', reject);
  });
}
