# Deploy

Hosting + Auth + Firestore are the same Firebase project.

## CI

GitHub Actions (`.github/workflows/ci.yml`):

- PR → lint, test, build, Lighthouse, preview channel
- `main` → same checks, then live Hosting + rules

Secret: `FIREBASE_SERVICE_ACCOUNT` (service account JSON).

## Manual

```bash
firebase login
firebase deploy --only hosting,firestore:rules
```

## Builds

- `production` — live Binance feed
- `demo` — seeded feed (also used by Playwright)
