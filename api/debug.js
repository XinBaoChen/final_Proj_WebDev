// Safe debug endpoint for Vercel deployments
// - Reports presence of required env vars (no values)
// - Attempts a DB authenticate() call and returns success/failure
// This endpoint intentionally DOES NOT return any secret values (DATABASE_URL etc.)

function sanitizeErrorMessage(msg) {
  if (!msg) return msg;
  // remove any embedded postgres://... strings
  return msg.replace(/postgres:\/\/\S+/gi, '<REDACTED>');
}

module.exports = async (req, res) => {
  // Report basic env presence immediately so we can debug deployments
  const envPresence = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    DB_SSL: !!process.env.DB_SSL,
    DB_POOL_MAX: !!process.env.DB_POOL_MAX
  };
  // Require the DB module here so any synchronous errors during require
  // (e.g. malformed env or unexpected runtime) can be caught and returned
  // instead of crashing the serverless process at import time.
  let sequelize;
  try {
    sequelize = require('../web-dev-server/database/db');
  } catch (requireErr) {
    console.error('Failed to require DB module:', requireErr && requireErr.stack);
    const details = sanitizeErrorMessage(requireErr && requireErr.message);

    // If no DATABASE_URL present, return the require error immediately
    // along with env presence so we can see what's missing in the deploy.
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ ok: false, error: 'Failed to initialize DB', details, env: envPresence });
    }

    // Try to parse the DATABASE_URL and open a TCP socket to the host:port.
    try {
      const url = new URL(process.env.DATABASE_URL);
      const host = url.hostname;
      const port = parseInt(url.port || '5432', 10);

      const net = require('net');
      const socket = new net.Socket();
      let connected = false;

      const connectionPromise = new Promise((resolve) => {
        const timeout = setTimeout(() => {
          socket.destroy();
          resolve({ reachable: false, reason: 'timeout' });
        }, 3000);

        socket.once('error', (err) => {
          clearTimeout(timeout);
          resolve({ reachable: false, reason: err && err.message });
        });

        socket.connect(port, host, () => {
          clearTimeout(timeout);
          connected = true;
          socket.end();
          resolve({ reachable: true });
        });
      });

      const result = await connectionPromise;
      return res.status(200).json({
        ok: true,
        env: envPresence,
        canConnect: result.reachable,
        error: result.reachable ? null : `TCP connection failed: ${sanitizeErrorMessage(String(result.reason))}`,
        driverError: details
      });
    } catch (fallbackErr) {
      console.error('Fallback DB check failed:', fallbackErr && fallbackErr.stack);
      return res.status(500).json({ ok: false, error: 'Failed to initialize DB', details });
    }
  }
  try {
    const env = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      DB_SSL: !!process.env.DB_SSL,
      DB_POOL_MAX: !!process.env.DB_POOL_MAX
    };

    let canConnect = false;
    let error = null;
    try {
      // attempt a lightweight authenticate to test connection
      await sequelize.authenticate();
      canConnect = true;
    } catch (e) {
      // Log a sanitized error message and stack to make debugging easier
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

    return res.status(200).json({
      ok: true,
      env,
      canConnect,
      error
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Debug endpoint failed', details: sanitizeErrorMessage(err && err.message) });
  }
};
