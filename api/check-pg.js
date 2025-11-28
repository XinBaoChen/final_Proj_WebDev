// Simple endpoint to test whether `pg` is available to the function bundle
module.exports = async (req, res) => {
  try {
    const pg = require('pg');
    const ver = pg && pg.Client && pg.Client.name ? pg.version || 'unknown' : (pg && pg.default ? (pg.default.version || 'unknown') : 'unknown');
    return res.json({ ok: true, installed: true, info: ver });
  } catch (err) {
    return res.status(500).json({ ok: false, installed: false, error: err && (err.message || String(err)) });
  }
};
