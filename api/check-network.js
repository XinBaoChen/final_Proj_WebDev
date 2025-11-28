// Lightweight network diagnostic for serverless runtime
const net = require('net');
const dns = require('dns');

module.exports = async (req, res) => {
  const host = process.env.DATABASE_URL ? (() => { try { return new URL(process.env.DATABASE_URL).hostname } catch(e){ return null } })() : req.query.host;
  if (!host) return res.status(400).json({ ok:false, error: 'No host provided and DATABASE_URL not set' });

  const results = { host, lookups: [], attempts: [] };

  // perform both A and AAAA lookups via promises
  const lookupAll = (type) => new Promise((resolve) => {
    dns.resolve(host, type, (err, addresses) => {
      if (err) return resolve({ type, ok: false, error: err.message });
      resolve({ type, ok: true, addresses });
    });
  });

  const a = await lookupAll('A');
  const aaaa = await lookupAll('AAAA');
  results.lookups.push(a, aaaa);

  // Try TCP connect to each address we found (limit to first 3 each)
  const tryConnect = (address) => new Promise((resolve) => {
    const port = 5432;
    const socket = new net.Socket();
    let done = false;
    const timeout = setTimeout(() => {
      if (done) return;
      done = true;
      socket.destroy();
      resolve({ address, port, ok: false, reason: 'timeout' });
    }, 3000);
    socket.once('error', (err) => {
      if (done) return;
      done = true;
      clearTimeout(timeout);
      resolve({ address, port, ok: false, reason: err && err.message });
    });
    socket.connect(port, address, () => {
      if (done) return;
      done = true;
      clearTimeout(timeout);
      socket.end();
      resolve({ address, port, ok: true });
    });
  });

  const addrs = [];
  if (a.ok && Array.isArray(a.addresses)) addrs.push(...a.addresses.slice(0,3));
  if (aaaa.ok && Array.isArray(aaaa.addresses)) addrs.push(...aaaa.addresses.slice(0,3));

  for (const addr of addrs) {
    const r = await tryConnect(addr);
    results.attempts.push(r);
  }

  return res.json({ ok: true, results });
};
