import { test, expect } from '@playwright/test';

test('create/edit/delete exercise flow (smoke)', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('#app');

  const result = await page.evaluate(() => {
    const before = exercises.length;
    openExForm();
    document.getElementById('ef-name').value = 'PW Smoke Ex';
    document.getElementById('ef-cat').value = 'Chest';
    saveEx();
    const created = exercises.find(e => e.name === 'PW Smoke Ex');
    if (!created) return { ok: false, reason: 'create-failed' };

    openExForm(created.id);
    document.getElementById('ef-name').value = 'PW Smoke Ex 2';
    saveEx();
    const edited = exercises.find(e => e.id === created.id)?.name === 'PW Smoke Ex 2';

    exercises = exercises.filter(e => e.id !== created.id);
    save('ex', exercises);
    renderEx();

    return { ok: edited && exercises.length === before };
  });

  expect(result.ok).toBeTruthy();
});

test('create day then start/finish session (smoke)', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('#app');

  const result = await page.evaluate(() => {
    let ex = exercises.find(e => e.name === 'PW Day Ex');
    if (!ex) {
      ex = { id: 'pw_ex_smoke', name: 'PW Day Ex', cat: 'Chest', icon: '💪', sets: 2, reps: 10, eq: '', safety: 'safe', notes: '', subs: [], murl: '' };
      exercises.push(ex);
      save('ex', exercises);
    }

    openAddDay();
    document.getElementById('df-name').value = 'PW Day';
    document.getElementById('df-icon').value = '🔥';
    saveDay();
    const d = program.find(x => x.name === 'PW Day');
    if (!d) return { ok: false, reason: 'day-create-failed' };

    d.exercises = [ex.id];
    save('prog', program);
    const ap = getActiveProgram();
    if (ap) { ap.days = program; save('programs', programs); }

    const before = sessions.length;
    startGym(d.id);
    gymSetLog = { [ex.id]: [{ w: 20, r: 10, done: true }] };
    finishGym(true);

    const hasSession = sessions.length > before;

    program = program.filter(x => x.id !== d.id);
    save('prog', program);
    if (ap) { ap.days = program; save('programs', programs); }
    sessions = sessions.slice(0, before);
    save('sess', sessions);

    return { ok: hasSession };
  });

  expect(result.ok).toBeTruthy();
});

test('import flow merge (smoke)', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('#app');

  const ok = await page.evaluate(() => {
    const payload = {
      exercises: [{ id: 'pw_imp_ex', name: 'Imported Ex', cat: 'Chest', icon: '💪', sets: 3, reps: 10, eq: '', safety: 'safe', notes: '', subs: [], murl: '' }],
      sessions: [{ id: 'pw_imp_s1', date: '2026-04-22', exId: 'pw_imp_ex', exName: 'Imported Ex', sets: 3, reps: 10, weight: 40, pain: 0, notes: '', pr: false }]
    };
    _impData = sanitizeImportPayload(payload);
    const impMode = document.getElementById('imp-mode');
    if (impMode) impMode.value = 'merge';
    impConfirm();
    return exercises.some(e => e.id === 'pw_imp_ex') && sessions.some(s => s.id === 'pw_imp_s1');
  });

  expect(ok).toBeTruthy();
});
