const { Campus, Student } = require('../../web-dev-server/database/models');

// collection handler: GET /api/campuses, POST /api/campuses
module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const campuses = await Campus.findAll({ include: [Student] });
      return res.status(200).json(campuses);
    }

    if (req.method === 'POST') {
      const body = req.body || await getBody(req);
      const created = await Campus.create(body);
      const createdWithStudents = await Campus.findByPk(created.id, { include: [Student] });
      return res.status(200).json(createdWithStudents);
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
