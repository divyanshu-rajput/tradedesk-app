# TradeDesk — Requirements & Acceptance Criteria

**Stack:** Angular 20 (standalone, zoneless, signals), NgRx (Store + Effects), RxJS, D3.js, Angular CDK, Firebase (Auth + Firestore)
**Type:** Portfolio project — resume-grade, must demo cleanly and survive interview scrutiny.

---

## 1. Problem Statement

Demonstrate production-grade Angular skills that a frontend interviewer will probe on:

- State management at scale (NgRx Store + Effects, 4 slices).
- Real-time data handling (RxJS `webSocket` to a public WS, wrapped in an Effect).
- Rendering performance under high-frequency updates (zoneless + signals + OnPush + memoized selectors).
- Custom form validation (cross-field conditional-required).
- Low-level DOM interaction via a directive (without bypassing Angular's change-detection model).
- Non-trivial data visualization (D3, with a clean Angular/D3 DOM-ownership boundary).
- A real backend integration (Firebase Auth + Firestore) with security rules.

This is not "build a UI" — it is "build a UI that stays responsive when ~10 symbols push price ticks every second."

---

## 2. Scope

### In scope

- 5 standalone, lazy-loaded feature areas: **Market Watch, Order Placement, Order Book, Portfolio, Charts** — plus **Order History** (CDK virtual scroll) surfaced within Portfolio/Orders.
- NgRx store with 3 slices: `market`, `orders`, `portfolio`.
- Live price feed via `rxjs/webSocket` to Binance public combined streams (~10 symbols), wrapped in an NgRx Effect.
- Reconnect logic (`retry` with exponential backoff) and teardown (`takeUntilDestroyed`) scoped to leaving the route.
- Per-symbol memoized selectors + OnPush + signals so only the updated row re-renders.
- `priceFlash` attribute directive using `Renderer2` (green/red flash on value change, reset via `animationend`).
- Reactive Forms order entry with a conditional-required cross-field validator (limit price / stop-loss price).
- D3.js pie chart for portfolio allocation; D3 line chart for price history.
- Order history with CDK virtual scrolling (1,000+ rows).
- Firebase Auth (anonymous + Google) and Firestore persistence for orders + portfolio snapshot, with security rules.
- Built-in **demo / replay mode** (seeded mock stream) as an offline fallback for interviews.

### Out of scope (explicit)

- Real order execution / real money — market-data + UI simulation only.
- Multi-user social features, chat, notifications.
- Custom backend server (Firebase BaaS only — no Node/NestJS service to host).
- Historical candlestick charting (stretch goal).
- Full mobile-responsive polish (nice-to-have, not a launch blocker).
- SSR / hydration, i18n, Nx monorepo, Storybook (listed as stretch goals only — intentionally excluded to keep the project focused and deep).

---

## 3. Module Breakdown & Acceptance Criteria

### 3.1 Market Watch

**Does:** Displays ~10 symbols with live price, % change, volume. Lazy-loaded route.

- [ ] WebSocket connects on route load, disconnects cleanly on route leave (verify via Network tab — no orphaned connections).
- [ ] Only the row whose price changed re-renders (verify via Angular DevTools profiler or a per-row render-count log).
- [ ] On WS drop, `retry` reconnects without a full page reload or losing other slices' state.
- [ ] `priceFlash` fires red/green correctly on decrease/increase, resets after animation, leaks no listeners.

### 3.2 Order Placement

**Does:** Reactive form to place buy/sell orders (market, limit, stop-loss types).

- [ ] Limit price field becomes `required` only when order type = limit; same rule for stop-loss price.
- [ ] Validator clears/re-validates correctly when order type changes back to market.
- [ ] Invalid form cannot dispatch an NgRx action (submit disabled and guarded in the handler).
- [ ] Submitted order appears in Order History / Order Book state immediately (optimistic update), then persists to Firestore.

### 3.3 Order Book

**Does:** Shows live bids/asks depth for the selected symbol.

- [ ] Updates don't block the main thread under rapid tick rate (no visible jank during a scripted load test).
- [ ] Selecting a different symbol unsubscribes from the old depth stream and subscribes to the new one — no cross-symbol data bleed.

### 3.4 Portfolio

**Does:** Shows holdings, allocation %, P&L.

- [ ] D3 pie chart accurately reflects the `portfolio` slice on every state change.
- [ ] Chart updates via D3 data-join (enter/update/exit) on actual data change — it does not recreate the whole SVG on every tick.
- [ ] P&L recalculates correctly against the live `market` slice (cross-slice selector composition).

### 3.5 Charts

**Does:** Visualizes price history / trend for the selected symbol.

- [ ] Chart updates without memory growth over time (verify via DevTools heap snapshots after a few minutes).
- [ ] Switching symbols leaves no stale D3 elements in the DOM.

### 3.6 Order History (CDK virtual scroll)

**Does:** Long, scrollable list of historical (simulated) orders.

- [ ] 1,000+ rows scroll smoothly (virtual scroll renders only visible rows, not the full DOM).
- [ ] New orders prepend without breaking scroll position.

### 3.7 Auth & Persistence (Firebase) — cross-cutting

- [ ] App works for anonymous users; optional Google sign-in upgrades the session.
- [ ] Orders and the portfolio snapshot persist to Firestore under the signed-in `uid` and reload on return.
- [ ] Firestore security rules deny any read/write outside the user's own document tree.

---

## 4. Risks & Edge Cases

- **Binance public WS limits / region blocks** — app could break in a live demo.
  - Mitigation: combined-stream endpoint to minimize connections; instant **demo/replay mode** fallback; document the public-stream limits.
- **Reconnect storm** — naive `retry` can hammer the endpoint.
  - Mitigation: exponential backoff with a capped delay and max attempts, surfaced as a `connectionStatus` in the `market` slice.
- **Subscription leaks on lazy-route unload** — classic Angular interview gotcha.
  - Mitigation: `async` pipe / `toSignal` / `takeUntilDestroyed` everywhere; audit every manual `subscribe()`.
- **D3 + Angular DOM ownership conflict** — D3 mutates SVG directly; Angular must not re-render over it.
  - Mitigation: D3 lives in its own directive/component; Angular owns the host element lifecycle, D3 owns child SVG nodes; no Angular template bindings inside the D3-owned subtree.
- **Selector not actually memoized** — easy to assume optimization that isn't happening.
  - Mitigation: verify empirically with render-count instrumentation, not just the factory-selector pattern.
- **Zoneless missed updates** — async work that doesn't notify Angular won't render.
  - Mitigation: drive templates from signals / `toSignal` / `async` pipe; never mutate state outside signal/store updates.
- **Firestore cost/quota in a public demo** — abusive traffic could burn quota.
  - Mitigation: tight security rules, write batching/debouncing for portfolio snapshots, anonymous-auth scoping.

---

## 5. Test Plan

- **Unit (Jest):**
  - Cross-field validator (limit/stop-loss conditional required, re-validation on type switch).
  - Reducers for all 4 slices (pure-function input → output).
  - Selector memoization — snapshot test: same input returns the same reference; a BTC tick doesn't change ETH's selected value reference.
  - `priceFlash` directive (adds correct class, removes on `animationend`, no listener leak).
- **E2E (Playwright):**
  - Rapid symbol switching in Order Book / Charts (no cross-symbol bleed, no stale DOM).
  - WS disconnect/reconnect (simulate offline → online) keeps other slices intact.
  - Order form: switch type back and forth, submit empty (blocked), submit valid (appears in history).
- **Performance check:** Angular DevTools profiler during a sustained tick burst — confirm only affected rows re-render.
- **Memory check:** leave the Charts view running 5–10 min, diff heap snapshots for leaks.

---

## 6. Suggested Build Order (risk-first)

1. Scaffold Angular workspace + 6 lazy routes + NgRx skeleton (4 slices, empty reducers) + zoneless bootstrap.
2. **WebSocket Effect + Market Watch** — riskiest/most novel; de-risk first.
3. Per-symbol memoized selectors + OnPush + `selectSignal` — verify render behavior before moving on.
4. `priceFlash` directive.
5. Order Placement form + cross-field validator.
6. Order Book (depth stream).
7. Portfolio + D3 pie chart (data-join) + cross-slice P&L selector.
8. Charts (D3 line, memory-safe updates).
9. Order History + CDK virtual scroll.
10. Firebase Auth + Firestore persistence + security rules.
11. Final pass: reconnect/teardown audit, memory check, demo-mode fallback, CI + deploy.
