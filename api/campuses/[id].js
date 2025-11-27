const { Campus, Student } = require('../../web-dev-server/database/models');

module.exports = async (req, res) => {
  try {
    const id = req.query && req.query.id;
    if (!id) return res.status(400).json({ error: 'Missing id' });

    if (req.method === 'GET') {
      const campus = await Campus.findByPk(id, { include: [Student] });
      return res.status(200).json(campus);
    }

    if (req.method === 'PUT') {
      const body = req.body || await getBody(req);
      await Campus.update(body, { where: { id } });
      const updated = await Campus.findByPk(id, { include: [Student] });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      await Campus.destroy({ where: { id } });
      return res.status(200).json('Deleted a campus!');
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
