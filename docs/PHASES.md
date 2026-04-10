# TradeDesk — Implementation Phases

Six phases, each with a clear scope, a list of who does what, and what the phase delivers.
Phases that have manual steps you must complete are flagged with **[MANUAL REQUIRED]**.

---

## How to read this doc

- **[YOU]** = you must do this manually (I cannot do it for you).
- **[AI]** = I (the agent) will implement this when you say "go".
- **[VERIFY]** = you briefly check something before we move to the next phase.

---

## Phase 0 — External Service Setup [MANUAL REQUIRED]

**You must complete this phase before Phase 1 can start. It takes ~15 minutes.**
This phase has no code — it's all in web consoles.

### 0.1 — GitHub repository [YOU]

1. Go to [github.com/new](https://github.com/new).
2. Create a **public** repository named `tradedesk` (or whatever you prefer).
3. Don't initialise with README (we already have files).
4. Copy the remote URL (e.g. `git@github.com:you/tradedesk.git`).
5. Tell me the URL when you're ready — I'll wire it in Phase 1's first commit.

### 0.2 — Firebase project [YOU]

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
2. Name it `tradedesk` (or any name; it won't be shown publicly).
3. Enable Google Analytics → your choice (we don't use it, so you can skip it).

### 0.3 — Enable Firebase Auth [YOU]

1. In your new project: **Build → Authentication → Get started**.
2. Under **Sign-in method**, enable:
   - **Anonymous** → Enable → Save.
   - **Google** → Enable → add a support email → Save.

### 0.4 — Create Firestore database [YOU]

1. **Build → Firestore Database → Create database**.
2. Choose **production mode** (we'll add security rules from code — don't pick test mode).
3. Pick the region closest to you (e.g. `asia-south1` for India).

### 0.5 — Get the Firebase web config [YOU]

1. **Project overview → Project settings → Your apps → Add app → Web (</> icon)**.
2. Give it a nickname (e.g. `tradedesk-web`). Don't tick Firebase Hosting yet.
3. Copy the `firebaseConfig` object that appears. It looks like:
   ```js
   {
     apiKey: "AIza...",
     authDomain: "tradedesk-xxxx.firebaseapp.com",
     projectId: "tradedesk-xxxx",
     storageBucket: "tradedesk-xxxx.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   }
   ```
4. Keep this config handy — I will ask you to paste it into the environment file in Phase 5.

> **Your config is not a secret** (it's safe to commit once you have Firestore security rules in place, which I will write in Phase 5).

### 0.6 — Check [VERIFY]

By the end of Phase 0 you should have:

- [ ] A GitHub repo URL ready.
- [ ] A Firebase project with Anonymous + Google Auth enabled.
- [ ] A Firestore database in production mode.
- [ ] A copied `firebaseConfig` object.

---

## Phase 1 — Scaffold, Tooling & Skeleton [AI]

**What I will do (nothing manual from you):**

1. Upgrade Angular CLI from v18 → v20 globally; install Firebase CLI.
2. `ng new tradedesk` — Angular 20, standalone, zoneless (`provideZonelessChangeDetection`), SCSS, strict TypeScript.
3. Install all dependencies in one shot:
   - `@ngrx/store`, `@ngrx/effects`, `@ngrx/store-devtools`
   - `@angular/fire`, `firebase`
   - `d3`, `@types/d3`
   - `@angular/cdk`
   - `jest`, `jest-preset-angular`, `@types/jest` (replace Karma)
   - `@playwright/test`
   - `eslint`, `@angular-eslint/*`, `prettier`, `husky`, `lint-staged`, `@commitlint/*`
4. Set up **ESLint + Prettier** (Angular + TypeScript rules).
5. Set up **Husky + lint-staged** (pre-commit: lint+format changed files).
6. Set up **commitlint** (conventional commits: `feat:`, `fix:`, etc.).
7. Set up **Jest** with `jest-preset-angular` (delete the default Karma config).
8. Set up **Playwright** (basic config, pointing at demo mode).
9. **NgRx skeleton** — 3 empty slices (market, orders, portfolio) with placeholder actions/reducers/selectors wired into `provideStore`.
10. **6 lazy routes** — each feature route loaded with `loadComponent`, pointing at a `<feature>-root.component.ts` that shows a placeholder.
11. **Full folder structure** created (core, shared, state, features as per `ARCHITECTURE.md`).
12. **Environment files** — `environment.ts` and `environment.demo.ts` with Firebase config placeholders and `feedMode` flag.
13. Git: initialise repo, wire your GitHub remote, first commit, push.

**Deliverable:** App runs (`npm start`) showing a shell with 6 nav links and placeholder route content. All tooling scripts pass. NgRx Devtools connected.

---

## Phase 2 — WebSocket Feed + Market Watch [AI]

**This is the riskiest part — done first so issues are caught early.**

1. `MarketSocketService` — `rxjs/webSocket` connection to Binance combined stream, exponential-backoff `retry`, `connectionStatus` observable.
2. `DemoStreamService` — deterministic seeded price-tick emitter (no network needed).
3. `MARKET_FEED` injection token — swaps live vs demo via build configuration.
4. **NgRx `market` slice** — full actions/reducer/selectors/effects:
   - `priceUpdated`, `depthUpdated`, `statusChanged`, `connect`, `disconnect` actions.
   - Reducer updates `symbols[symbol]` and `prevPrice` atomically.
   - **Per-symbol memoized selector factory** (`selectSymbolData(symbol)`).
   - Effect wires the feed, maps frames to actions, handles reconnect.
5. **Market Watch feature** — standalone, OnPush, signals:
   - `WatchlistTableComponent` — `@for` over symbol list, each row a separate `WatchlistRowComponent`.
   - `WatchlistRowComponent` — reads one symbol via `store.selectSignal(selectSymbolData(symbol))`, so only this row re-renders on a tick for that symbol.
   - Connection status badge.
6. **`priceFlash` directive** — `Renderer2`, `animationend` reset, no `setTimeout`.
7. Unit tests: market reducer, `selectSymbolData` memoization (same-input → same reference), directive (class applied/removed).

**Deliverable:** Live watchlist ticking at ~10 symbols. Switch to demo mode with `--configuration=demo`. Angular DevTools proves only 1 row re-renders per tick.

---

## Phase 3 — Order Placement + Order Book [AI]

1. **NgRx `orders` slice** — actions/reducer/selectors/effects:
   - `placeOrder`, `orderPlaced`, `orderFailed`, `loadOrders` actions.
   - Reducer maintains entity map + ids array.
2. **Order Placement feature**:
   - Reactive Form with `FormBuilder` (non-nullable).
   - `conditionalPriceValidator` — FormGroup-level cross-field validator.
   - Form reacts to `orderType` changes via `valueChanges` to re-validate.
   - Submit dispatches `placeOrder` action; button disabled on invalid form.
   - Optimistic: order is added to store immediately.
3. **Order Book feature**:
   - `selectSymbol$` signal drives a `switchMap` in the effect.
   - Bids/asks depth table; no cross-symbol bleed on symbol change.
4. Unit tests: `conditionalPriceValidator` (all cases), orders reducer.

**Deliverable:** Place an order; it immediately appears in the store. Switching symbol in Order Book unsubscribes cleanly (verify via Network tab).

---

## Phase 4 — Portfolio + Charts + Order History [AI]

1. **NgRx `portfolio` slice** — holdings, cash; no P&L in state.
2. **Cross-slice `selectPnl` selector** — composes `portfolio` holdings with live `market` prices.
3. **Portfolio feature**:
   - Holdings table with live P&L column (re-renders only when price changes for that holding).
   - **D3 pie chart** — data-join (enter/update/exit), D3 owns SVG subtree, Angular `effect()` triggers redraws.
   - Chart updates via join, never tears down full SVG per tick.
4. **Charts feature**:
   - **D3 line chart** — price-history array, updates via append + shift (bounded buffer).
   - Symbol switch: `exit().remove()` clears stale elements.
5. **Order History feature**:
   - `CdkVirtualScrollViewport` with 1,000+ seeded rows.
   - New orders prepend without scroll-position jump.
6. Unit tests: `selectPnl` (cross-slice composition), portfolio reducer.

**Deliverable:** Portfolio page shows a live D3 pie. Charts page shows a line updating per tick. Order History scrolls 1,000+ rows smoothly.

---

## Phase 5 — Firebase Integration [PARTIALLY MANUAL]

### 5.1 — You paste your Firebase config [YOU]

Once I've scaffolded the environment files in Phase 1, I will ask you to paste your copied `firebaseConfig` from Phase 0.5 into:

- `src/environments/environment.ts` (production)
- `src/environments/environment.demo.ts` (demo build)

This is one copy-paste. After that, everything below is done by me.

### 5.2 — What I will implement [AI]

1. Wire `provideFirebaseApp`, `provideAuth`, `provideFirestore` with offline persistence.
2. **`AuthService`** — `authState` signal, `signInAnonymously` on boot, optional Google sign-in/upgrade via `linkWithPopup`.
3. Auth guard — functional, uses `AuthService.user` signal.
4. **`OrdersRepository`** — typed Firestore converter, `placeOrder(order)`, `streamOrders(uid)`.
5. **`PortfolioRepository`** — `loadSnapshot(uid)`, `saveSnapshot(uid, snapshot)` (debounced 2s).
6. Update `orders` Effect to call `OrdersRepository.placeOrder` after optimistic store update; dispatch rollback on error.
7. Update `portfolio` Effect to save snapshot on holdings change (debounced).
8. Load orders + portfolio snapshot from Firestore on auth ready.
9. **`firestore.rules`** — default-deny, owner-only reads/writes, orders append-only.
10. **Firebase Emulator** setup (`firebase.json` emulator config, `connectAuthEmulator`/`connectFirestoreEmulator` wired to `environment.useEmulators`).

**Deliverable:** Place an order → it appears in Firestore console under your uid. Reload the page → orders + portfolio reload from Firestore.

---

## Phase 6 — CI/CD, Deploy & Final Audit [PARTIALLY MANUAL]

### 6.1 — GitHub secrets you must add [YOU]

After I create the workflow files, you need to add one secret to your GitHub repo:

1. Go to **GitHub repo → Settings → Secrets and variables → Actions → New repository secret**.
2. Name: `FIREBASE_SERVICE_ACCOUNT`
3. Value: download a service account JSON from **Firebase console → Project settings → Service accounts → Generate new private key**. Paste the entire JSON as the secret value.

This is the only thing I cannot do — everything in the pipeline files is written by me.

### 6.2 — What I will implement [AI]

1. **GitHub Actions workflow** (`.github/workflows/ci.yml`):
   - Trigger: all PRs + pushes to `main`.
   - Jobs: `lint` → `unit-test` → `build` → `lighthouse` → `e2e` (parallel where safe) → `deploy-preview` (PR) → `deploy-prod` (main).
2. **Lighthouse CI config** (`lighthouserc.json`) — performance ≥ 90, a11y ≥ 95, initial-JS budget.
3. **Firebase Hosting config** (`firebase.json` hosting block) — SPA rewrite, long-cache headers.
4. **`.firebaserc`** — wired to your Firebase project id.
5. **Playwright** pointed at demo mode + Firebase emulators for deterministic CI runs.
6. **Final audit:**
   - Every `subscribe()` audited for teardown.
   - Memory snapshot test on Charts (scripted with Playwright DevTools protocol).
   - Angular DevTools render-count verified per phase.
   - Demo mode confirmed works offline with no live Binance connection.

**Deliverable:** Push a PR → CI runs → preview URL auto-commented on PR. Merge to `main` → production URL live. `npm start -- --configuration=demo` works with zero network.

---

## Summary

| Phase                            | Who                         | Estimated effort           |
| -------------------------------- | --------------------------- | -------------------------- |
| 0 — External setup               | **YOU** (15 min)            | Firebase + GitHub consoles |
| 1 — Scaffold + tooling           | AI                          | Foundation for everything  |
| 2 — WS feed + Market Watch       | AI                          | Riskiest, done first       |
| 3 — Orders + Order Book          | AI                          | Forms + depth stream       |
| 4 — Portfolio + Charts + History | AI                          | D3 + CDK                   |
| 5 — Firebase integration         | AI + **YOU** (1 copy-paste) | Persistence layer          |
| 6 — CI/CD + audit                | AI + **YOU** (1 secret)     | Deploy + final polish      |

---

## Things I genuinely cannot do for you

| Item                                                 | Why                                                                                                                                |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Create the GitHub repository                         | Requires GitHub account login                                                                                                      |
| Create the Firebase project                          | Requires Firebase console login                                                                                                    |
| Enable Auth providers in Firebase                    | Requires Firebase console login                                                                                                    |
| Create the Firestore database                        | Requires Firebase console login                                                                                                    |
| Paste the Firebase web config into environment files | Only you have the actual values                                                                                                    |
| Add the `FIREBASE_SERVICE_ACCOUNT` secret to GitHub  | Requires your GitHub + Firebase accounts                                                                                           |
| Log in to `firebase-tools` CLI                       | Requires browser auth flow with your account (`firebase login`)                                                                    |
| Deploy Firestore rules + hosting the very first time | Requires `firebase login` + `firebase init` (one-time, interactive) — I'll script everything but you run the one-time init command |
