# Tech stack

| Piece             | Notes                                                      |
| ----------------- | ---------------------------------------------------------- |
| Angular 20        | Standalone, zoneless, signals, OnPush                      |
| NgRx              | `market`, `orders`, `portfolio` + Effects for WS/Firestore |
| RxJS              | `webSocket`, backoff `retry`, `switchMap` for depth        |
| D3                | Pie + line charts                                          |
| Angular CDK       | Virtual scroll for order history                           |
| Firebase          | Auth (anon + Google), Firestore                            |
| Jest / Playwright | Unit + E2E (demo mode)                                     |
| GitHub Actions    | Lint, test, build, Lighthouse, deploy                      |

Versions: see `package.json` / lockfile.
