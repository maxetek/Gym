import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const m = html.match(/<script>([\s\S]*)<\/script>/);
if (!m) {
  console.error('Inline script not found in index.html');
  process.exit(1);
}

const tmp = path.join(os.tmpdir(), `gym-inline-${Date.now()}.js`);
fs.writeFileSync(tmp, m[1], 'utf8');
const res = spawnSync('node', ['--check', tmp], { stdio: 'inherit' });
try { fs.unlinkSync(tmp); } catch {}
process.exit(res.status ?? 1);
