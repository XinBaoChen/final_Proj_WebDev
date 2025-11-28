const express = require('express');
const router = express.Router();
const sequelize = require('../database/db');

function sanitizeErrorMessage(msg) {
  if (!msg) return msg;
  return msg.replace(/postgres:\/\/\S+/gi, '<REDACTED>');
}

router.get('/', async (req, res) => {
  try {
    const env = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      DB_SSL: !!process.env.DB_SSL,
      DB_POOL_MAX: !!process.env.DB_POOL_MAX
    };

    let canConnect = false;
    let error = null;
    try {
      await sequelize.authenticate();
      canConnect = true;
    } catch (e) {
      try {
        const sanitized = sanitizeErrorMessage(e && e.message ? e.message : String(e));
        const stack = e && e.stack ? sanitizeErrorMessage(e.stack) : undefined;
        console.error('DB authenticate failed:', sanitized);
        if (stack) console.error(stack);
      } catch (logErr) {
        console.error('Error while logging DB error', String(logErr));
      }
      canConnect = false;
      error = sanitizeErrorMessage(e && e.message ? e.message : String(e));
    }

    return res.status(200).json({ ok: true, env, canConnect, error });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Debug endpoint failed', details: sanitizeErrorMessage(err && err.message) });
  }
});

module.exports = router;
