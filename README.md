# TradeDesk

Angular 20 trading terminal — live crypto prices from Binance public WebSocket.
Simulation only (no real money / order execution).

## Features

- Market Watch (~10 symbols, live ticks)
- Order Placement (market / limit / stop-loss)
- Order Book depth
- Portfolio + P&L (D3 pie)
- Price charts (D3 line)
- Order history (virtual scroll)
- Demo mode (offline seeded feed)

## Stack

Angular 20 · NgRx · RxJS · D3 · Angular CDK · Firebase · Jest · Playwright

## Run

```bash
npm install
npm start
npm test
npm run build
npm start -- --configuration=demo
```

## Docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — folders + state
- [`docs/TECH-STACK.md`](docs/TECH-STACK.md) — libraries
- [`docs/BACKEND-FIREBASE.md`](docs/BACKEND-FIREBASE.md) — Auth / Firestore
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — Hosting + CI

## Deploy

Add GitHub secret `FIREBASE_SERVICE_ACCOUNT`, then push to `main` (or `firebase deploy`).

Orders are simulated. Binance public streams only.
