const { Student, Campus } = require('../../web-dev-server/database/models');

module.exports = async (req, res) => {
  try {
    const id = req.query && req.query.id;
    if (!id) return res.status(400).json({ error: 'Missing id' });

    if (req.method === 'GET') {
      const student = await Student.findByPk(id, { include: [Campus] });
      return res.status(200).json(student);
    }

    if (req.method === 'PUT') {
      const body = req.body || await getBody(req);
      if (body.campusId === '' || body.campusId === null) delete body.campusId;
      if (body.campusId !== undefined) body.campusId = parseInt(body.campusId);
      await Student.update(body, { where: { id } });
      const updated = await Student.findByPk(id, { include: [Campus] });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      await Student.destroy({ where: { id } });
      return res.status(200).json('Deleted a student!');
    }

    res.setHeader('Allow', 'GET, PUT, DELETE');
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
