# Gym Trainer PWA

A mobile-first gym tracking Progressive Web App (Arabic-first, RTL) built as a static app.

## Project status (handover)

### ✅ Completed
- Import/state hardening (`sanitizeImportPayload`, `normalizeLoadedState`).
- UI escaping hardening (`esc`) + targeted DOM safety fixes.
- Versioned service-worker caches + update prompt flow.
- Unit tests for sanitization/escaping logic.
- Playwright smoke test suite scaffolding.
- Initial module split (`js/storage.js`, `js/exercises.js`, `js/programs.js`, `js/sessions.js`, `js/ui.js`).

### ⚠️ Partially complete
- Full modularization is started, but core business logic is still mostly in `index.html`.
- Playwright tests are ready, but require browser binaries available in environment.

## Run locally

```bash
python3 -m http.server 4173
```
Open: `http://127.0.0.1:4173`

## Test commands

```bash
npm test
npm run test:ci
npm run test:e2e
npm run test:ci:full
```

### Notes about E2E
If Playwright browser binaries are missing in your environment:

```bash
npx playwright install chromium
```

If this fails due network policy (e.g. 403/domain restrictions), `test:e2e` cannot run until binaries are provided.

## Structure

- `index.html`: main UI + app logic (currently the largest file).
- `sw.js`: service worker (versioned shell/runtime cache + update flow).
- `js/storage.js`: pluggable `AppStorage` abstraction.
- `js/exercises.js`, `js/programs.js`, `js/sessions.js`, `js/ui.js`: modular hooks/helpers.
- `tests/sanitization.test.mjs`: unit tests for sanitization/escaping.
- `tests/e2e/smoke.spec.mjs`: Playwright smoke tests.
- `scripts/check-index-syntax.mjs`: CI helper to syntax-check inline script.

## Security notes

- Imported payloads are sanitized before merge/replace.
- Loaded persisted state is normalized on init.
- Dynamic text uses escaping (`esc`) and selected `textContent` usage in sensitive paths.

## Next recommended milestone

- Continue extracting domain logic from `index.html` into the module files to complete structural split.
