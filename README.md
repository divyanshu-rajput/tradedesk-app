# TradeDesk — Real-Time Trading Terminal

A production-grade, **Angular 20** real-time trading terminal that streams live crypto prices
from Binance's public WebSocket and renders them without falling over under continuous,
high-frequency price ticks.

This is a **market-data + UI simulation** (no real money, no real order execution). It exists to
demonstrate the Angular skills that frontend interviews probe hardest: large-scale state management
(NgRx), real-time data handling (RxJS + WebSocket), rendering performance (zoneless + signals +
OnPush + memoized selectors), custom form validation, low-level DOM work via directives, and
non-trivial data visualization (D3).

> One-line pitch: _"A UI that doesn't fall over when 10 symbols push price ticks every second."_

---

## Features

- **Market Watch** — ~10 symbols with live price, % change, volume. Only the row that changed re-renders.
- **Order Placement** — Reactive Forms with a conditional-required cross-field validator (limit / stop-loss).
- **Order Book** — live bid/ask depth ladder for the selected symbol, no cross-symbol data bleed.
- **Portfolio** — holdings, allocation, live P&L; allocation drawn with a hand-written D3 pie chart.
- **Charts** — price-history line chart for the selected symbol, no memory growth over time.
- **Order History** — 1,000+ rows via CDK virtual scrolling.
- **Demo / replay mode** — seeded mock stream so the app demos cleanly with no live network.

## Tech Stack (short)

Angular 20 (standalone, zoneless, signals) · NgRx Store + Effects · RxJS (`webSocket`) ·
D3.js · Angular CDK · Firebase (Auth + Firestore) · Jest · Playwright · GitHub Actions · Firebase Hosting.

See [`docs/TECH-STACK.md`](docs/TECH-STACK.md) for the full list with rationale.

## Quick Start

```bash
# prerequisites: Node 20+ LTS, npm 10+
npm install

# run the app — then open http://localhost:4200
npm start

# run tests
npm test

# production build
npm run build

# demo mode (seeded data, no live Binance WS)
npm start -- --configuration=demo
```

## Scripts

```bash
npm start            # ng serve
npm run build        # production build
npm test             # Jest unit tests
npm run test:watch   # Jest watch mode
npm run e2e          # Playwright end-to-end tests
npm run lighthouse   # Lighthouse CI budget check (requires npm run build first)
npm run lint         # ESLint
npm run format       # Prettier
```

## Documentation

| Doc                                                    | What's inside                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------------ |
| [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md)         | Scope, per-module acceptance criteria, risks, test plan, build order     |
| [`docs/TECH-STACK.md`](docs/TECH-STACK.md)             | Every technology, why it was chosen, and the interview skill it proves   |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)         | Folder structure, state shape, data-flow diagrams, key patterns          |
| [`docs/BACKEND-FIREBASE.md`](docs/BACKEND-FIREBASE.md) | Firebase Auth + Firestore data model, security rules, persistence policy |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)             | Firebase Hosting + GitHub Actions CI/CD + preview channels               |
| [`docs/PHASES.md`](docs/PHASES.md)                     | Implementation phases and manual setup steps                             |

## Project Status

**Phase 6 complete** — GitHub Actions CI (lint, test, build, Lighthouse, E2E) and Firebase Hosting deploy on merge to `main`.

### CI/CD setup (one-time manual steps)

1. **GitHub secret** — repo → Settings → Secrets → Actions → add `FIREBASE_SERVICE_ACCOUNT` with the full JSON from Firebase → Project settings → Service accounts → Generate new private key.
2. **First local deploy** (optional) — `firebase login` then `firebase deploy --only hosting,firestore:rules`.
3. **PR previews** — open a PR; CI comments a Firebase preview URL when deploy succeeds.

## Disclaimer

TradeDesk is a portfolio/learning project. It uses Binance's **public** market-data streams only,
places **simulated** orders, and never transmits or executes real trades.
