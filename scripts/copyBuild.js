const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const src = path.join(repoRoot, 'web-dev-client', 'build');
const dest = path.join(repoRoot, 'public');

function exitErr(msg) {
  console.error(msg);
  process.exit(1);
}

if (!fs.existsSync(src)) exitErr('Build folder not found: ' + src);

// remove dest if exists
try {
  if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
} catch (e) {
  // fallback for older Node: remove recursively
  const rimraf = (p) => {
    if (!fs.existsSync(p)) return;
    for (const entry of fs.readdirSync(p)) {
      const cur = path.join(p, entry);
      if (fs.statSync(cur).isDirectory()) rimraf(cur);
      else fs.unlinkSync(cur);
    }
    fs.rmdirSync(p);
  };
  rimraf(dest);
}

function copyDir(s, d) {
  fs.mkdirSync(d, { recursive: true });
  for (const entry of fs.readdirSync(s)) {
    const srcPath = path.join(s, entry);
    const destPath = path.join(d, entry);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

copyDir(src, dest);
console.log('Copied build from', src, 'to', dest);
