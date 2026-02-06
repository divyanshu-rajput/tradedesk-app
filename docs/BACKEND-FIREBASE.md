# Firebase

No custom server — Auth + Firestore via `@angular/fire`.

## What is stored

- **Store only:** live prices, depth, connection status
- **Firestore:** orders + portfolio snapshot under `users/{uid}/...`

## Setup

1. Create a Firebase project
2. Enable Anonymous + Google auth
3. Create Firestore (production mode)
4. Paste web config into `src/environments/environment*.ts`

## Data

```
users/{uid}/orders/{orderId}
users/{uid}/portfolio/snapshot
```

Orders are append-only. Portfolio is one snapshot doc (debounced writes).
Rules: owner-only; see `firestore.rules`.

## Local

Emulators when `environment.useEmulators` is true (`firebase emulators:start`).
