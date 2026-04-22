import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function fnSource(name, nextMarker) {
  const start = html.indexOf(`function ${name}(`);
  if (start === -1) throw new Error(`Function not found: ${name}`);
  const end = nextMarker ? html.indexOf(nextMarker, start) : -1;
  if (end === -1) throw new Error(`End marker not found for: ${name}`);
  return html.slice(start, end).trim();
}

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(fnSource('sanitizeImportPayload', 'function importD('), sandbox);
vm.runInContext(fnSource('esc', "document.addEventListener('click'"), sandbox);
vm.runInContext(fnSource('exOptions', 'function renderEx('), sandbox);
vm.runInContext(fnSource('normalizeLoadedState', '// ── DEFAULT EXERCISES'), sandbox);

const { sanitizeImportPayload, esc, exOptions, normalizeLoadedState } = sandbox;

test('esc escapes critical html characters including single quote/backtick', () => {
  const raw = `a&b<c>\"'\``;
  const out = esc(raw);
  assert.equal(out, 'a&amp;b&lt;c&gt;&quot;&#39;&#96;');
});

test('sanitizeImportPayload rejects unsafe ids and normalizes cfg', () => {
  const payload = {
    exercises: [{ id: 'ok_1', name: 'Bench' }, { id: "bad'id", name: 'X' }],
    lastDay: 'day<script>',
    activeProgramId: 'prog-1',
    cfg: { lang: 'xx', fs: 99, restSecs: 1, unit: 'oz', dark: 'yes' }
  };

  const out = sanitizeImportPayload(payload);

  assert.equal(out.exercises.length, 1);
  assert.equal(out.exercises[0].id, 'ok_1');
  assert.equal(out.lastDay, undefined);
  assert.equal(out.activeProgramId, 'prog-1');
  assert.deepEqual(JSON.parse(JSON.stringify(out.cfg)), {
    dark: true,
    fs: 22,
    restSecs: 15,
    unit: 'kg',
    lang: 'ar'
  });
});

test('sanitizeImportPayload clamps and normalizes session values', () => {
  const payload = {
    sessions: [{
      id: 's1',
      date: '2026-04-20T12:00:00Z',
      exId: 'ok_1',
      sets: 500,
      reps: -5,
      weight: 99999,
      pain: 100,
      notes: 'n'
    }]
  };

  const out = sanitizeImportPayload(payload);
  assert.equal(out.sessions.length, 1);
  assert.equal(out.sessions[0].date, '2026-04-20');
  assert.equal(out.sessions[0].sets, 99);
  assert.equal(out.sessions[0].reps, 0);
  assert.equal(out.sessions[0].weight, 2000);
  assert.equal(out.sessions[0].pain, 10);
});

test('sanitizeImportPayload keeps cfg partial (no forced defaults for missing keys)', () => {
  const out = sanitizeImportPayload({ cfg: { lang: 'en' } });
  assert.deepEqual(JSON.parse(JSON.stringify(out.cfg)), { lang: 'en' });
});

test('sanitizeImportPayload strips dangerous label chars in cat/eq', () => {
  const out = sanitizeImportPayload({
    exercises: [{ id: 'x1', cat: `Chest" onclick="alert(1)`, eq: "Bar'bell<svg>" }]
  });
  assert.equal(out.exercises[0].cat.includes('"'), false);
  assert.equal(out.exercises[0].cat.includes('<'), false);
  assert.equal(out.exercises[0].eq.includes("'"), false);
  assert.equal(out.exercises[0].eq.includes('>'), false);
});

test('exOptions escapes names and values in option HTML', () => {
  sandbox.exercises = [{ id: `id\"1`, name: `<img onerror=1>` }];
  const html = exOptions('id"1');
  assert.equal(html.includes('<img'), false);
  assert.equal(html.includes('&lt;img onerror=1&gt;'), true);
  assert.equal(html.includes('value=\"id&quot;1\"'), true);
});

test('normalizeLoadedState sanitizes in-memory loaded state', () => {
  sandbox.save = () => {};
  sandbox.exercises = [{ id: "bad'id", name: 'x' }, { id: 'ok1', name: 'good' }];
  sandbox.program = [{ id: 'd1', name: 'day', exercises: ['ok1', "bad'id"] }];
  sandbox.programs = [];
  sandbox.sessions = [{ id: 's1', date: '2026-04-20<script>', exId: 'ok1' }];
  sandbox.weightLog = [{ date: 'bad-date', w: 80 }, { date: '2026-04-20', w: 81 }];
  sandbox.profile = { name: 'A', age: 40, height: 180, weight: 80 };
  sandbox.cfg = { lang: 'xx' };
  sandbox.lastDay = "d1<script>";
  sandbox.activeProgramId = "p<script>";

  normalizeLoadedState();

  assert.equal(sandbox.exercises.length, 1);
  assert.equal(sandbox.exercises[0].id, 'ok1');
  assert.equal(sandbox.program[0].exercises.length, 1);
  assert.equal(sandbox.sessions[0].date, '2026-04-20');
  assert.equal(sandbox.weightLog.length, 1);
  assert.equal(sandbox.lastDay, '');
});
