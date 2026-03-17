# TradeDesk — Tech Stack & Rationale

Every technology here is chosen for a reason and maps to a concrete skill an Angular interviewer
will probe. Versions are pinned to majors; resolve exact patch versions at scaffold time via the
package manager (do not hand-pick patch numbers).

---

## Core framework

### Angular 20 (standalone, zoneless, signals)

- **Why:** Current, modern Angular. Standalone components are the default; zoneless change detection
  and signals are the framework's stated direction.
- **How used:** `bootstrapApplication` + `provideZonelessChangeDetection()`; all components standalone
  with `ChangeDetectionStrategy.OnPush`; `inject()` over constructor injection; new control flow
  (`@if`, `@for` with `track`, `@defer`); functional route guards and HTTP interceptors;
  `withComponentInputBinding()` to bind route params to inputs.
- **Interview skill:** Knowing where Angular is in 2026 — zoneless rendering, signals, standalone APIs,
  and _why_ OnPush + signals make change detection cheap and explicit.

### TypeScript (strict)

- **Why:** Type safety is table stakes for production code.
- **How used:** `strict: true`, `noUncheckedIndexedAccess`, typed NgRx actions/selectors, typed Firestore converters.
- **Interview skill:** Modeling domain state with discriminated unions (order types), strict null handling.

---

## State management

### NgRx Store + Effects

- **Why:** The interview-grade answer for large, shared, side-effect-heavy state. The 4-slice split
  (`market`, `orders`, `portfolio`, `ui`) is the backbone of the app.
- **How used:** Actions/reducers/selectors per slice; the live-price WebSocket lives in an **Effect**;
  cross-slice P&L computed via composed selectors; components read state via `store.selectSignal(...)`.
- **Interview skill:** Redux pattern, effects for async orchestration, memoized/parameterized selectors,
  and the discipline of unidirectional data flow.

### Signals bridge (`selectSignal` / `toSignal`)

- **Why:** Modern Angular consumes reactive state as signals; this is how classic NgRx and zoneless coexist.
- **How used:** Selectors are exposed to templates as signals; no manual `subscribe()` in components.
- **Interview skill:** Articulating the hybrid — "NgRx for orchestration, signals at the view edge" —
  and why `SignalStore` would be the alternative for feature-local state.

### RxJS (`rxjs/webSocket`)

- **Why:** Real-time streams are the heart of the project.
- **How used:** `webSocket()` subject for the Binance connection; `retry({ delay })` with exponential
  backoff for reconnect; `takeUntilDestroyed()` for teardown scoped to leaving the route;
  `switchMap` for symbol-scoped depth subscriptions (cancels the previous symbol's stream).
- **Interview skill:** Operator selection (`switchMap` vs `mergeMap`), backpressure/teardown,
  multicasting, and leak prevention.

---

## UI & visualization

### Angular CDK

- **Why:** Production UIs need accessible, headless primitives.
- **How used:** `ScrollingModule` (virtual scroll for 1,000+ order rows); `a11y` (focus management,
  live announcements); `Overlay`/`Dialog` for order detail/confirmation; optional `DragDrop`.
- **Interview skill:** Virtual scrolling performance, accessibility, and using headless primitives
  instead of hand-rolling.

### D3.js

- **Why:** Demonstrates non-trivial visualization and a clean framework/library DOM boundary.
- **How used:** Portfolio allocation **pie chart** and price-history **line chart**, both via D3
  data-join (enter/update/exit); D3 owns its SVG subtree, Angular owns the host lifecycle.
- **Interview skill:** Managing two libraries that both want the DOM — keeping Angular's change
  detection away from D3-owned nodes, updating via data-join instead of full re-render.

---

## Backend (BaaS)

### Firebase — Auth + Firestore (via `@angular/fire`)

- **Why:** A real backend integration with auth + persistence and security rules, with zero server to host.
- **How used:** Anonymous auth by default, optional Google sign-in; Firestore stores orders and a
  portfolio snapshot under `users/{uid}/...`; security rules scope all access to the owner; offline
  persistence enabled.
- **Interview skill:** Auth flows, NoSQL data modeling, security rules, and integrating a BaaS through
  AngularFire's injectable APIs.

---

## Tooling, testing, quality

### Jest (`jest-preset-angular`)

- **Why:** Fast, widely used unit runner; Karma is deprecated.
- **How used:** Unit tests for validators, reducers, selector memoization, and the `priceFlash` directive.
- **Interview skill:** Testing pure functions (reducers/selectors) and Angular primitives in isolation.

### Playwright

- **Why:** Modern, reliable cross-browser E2E.
- **How used:** Symbol switching, WS reconnect, and order-form flows against demo mode.
- **Interview skill:** End-to-end coverage of real-time UI behavior.

### ESLint + Prettier + Husky + lint-staged + commitlint

- **Why:** Enforced consistency and conventional commits — the hallmarks of a maintained repo.
- **How used:** Pre-commit lint/format on staged files; commit-message linting.
- **Interview skill:** Repo hygiene and CI-friendly workflows.

### GitHub Actions + Lighthouse CI

- **Why:** Demonstrates a real CI/CD pipeline with performance budgets.
- **How used:** lint → unit test → build → Lighthouse budget → deploy to Firebase Hosting (preview per PR, prod on `main`).
- **Interview skill:** Pipeline design, performance budgeting, preview environments.

---

## Versions (pin majors at scaffold time)

| Tool                       | Target major                      |
| -------------------------- | --------------------------------- |
| Node.js                    | 20 LTS (or 22 LTS)                |
| Angular                    | 20.x                              |
| NgRx                       | 20.x (aligned to Angular major)   |
| RxJS                       | 7.8+ (whatever Angular 20 ships)  |
| D3                         | 7.x                               |
| @angular/fire              | latest compatible with Angular 20 |
| Firebase JS SDK            | 11.x (modular)                    |
| Jest + jest-preset-angular | latest                            |
| Playwright                 | latest                            |
| TypeScript                 | the version Angular 20 mandates   |

> Do not hardcode patch versions in docs — let `npm`/`ng add` resolve them so the project starts on
> the latest compatible patch.
