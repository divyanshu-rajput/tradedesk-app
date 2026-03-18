# TradeDesk — Resume Bullets & Interview Talking Points

Two things here: (1) polished resume bullets you can paste, and (2) a cheat-sheet of the questions an
interviewer will ask about each line and how to answer.

---

## 1. Resume bullets (primary — 6 lines)

**TradeDesk – Real-Time Trading Terminal** | Angular 20 (zoneless, signals), NgRx, RxJS, D3.js, Angular CDK, Firebase

- Architected a five-feature standalone Angular 20 app (Market Watch, Order Placement, Order Book, Portfolio, Charts) with lazy-loaded routes, zoneless change detection, and an NgRx store split into `market`, `orders`, `portfolio`, and `ui` slices.
- Streamed live prices for ~10 symbols from Binance's public WebSocket via `rxjs/webSocket` inside an NgRx Effect, with exponential-backoff `retry` for reconnection and `takeUntilDestroyed` for teardown on route change.
- Cut re-renders under continuous price ticks using per-symbol memoized selectors bridged to signals (`selectSignal`) with OnPush, so only the updated row re-renders — verified via Angular DevTools render-count profiling.
- Built a `priceFlash` attribute directive with `Renderer2` and the `animationend` event (no `setTimeout` magic numbers) to flash green/red on value change without coupling DOM mutation to component logic.
- Implemented order entry with Reactive Forms and a cross-field validator making limit / stop-loss price required only for the matching order type, re-validating on type change.
- Rendered portfolio allocation with a hand-written D3.js pie chart (Angular owns lifecycle, D3 owns its SVG nodes) and 1,000+ order-history rows via CDK virtual scrolling; persisted orders/portfolio to Firebase (Auth + Firestore security rules) and shipped through GitHub Actions CI to Firebase Hosting with per-PR preview channels.

---

## 2. Resume bullets (compact — 4 lines, if space is tight)

**TradeDesk – Real-Time Trading Terminal** | Angular 20, NgRx, RxJS, D3.js, Angular CDK, Firebase

- Built a 5-module standalone, lazy-loaded Angular 20 app (zoneless + signals) with an NgRx store (`market`/`orders`/`portfolio`/`ui`) and a live Binance WebSocket feed wrapped in an Effect with backoff reconnection and route-scoped teardown.
- Kept the watchlist responsive under per-second ticks via per-symbol memoized selectors + OnPush, so only the changed row re-renders (verified by render-count profiling).
- Wrote a `Renderer2`-based `priceFlash` directive and a Reactive Forms cross-field validator (conditional-required limit/stop-loss price); visualized allocation with a D3 pie chart and 1,000+ orders via CDK virtual scroll.
- Integrated Firebase Auth + Firestore (security rules, optimistic order writes) and shipped via GitHub Actions CI/CD to Firebase Hosting with per-PR preview deploys.

---

## 3. Interview talking points (anticipate these)

### "Effects are singletons — how do you tear down the WebSocket on route leave?"

Effects live for the app's lifetime, so I don't rely on the Effect being destroyed. I dispatch a
`disconnect` action when leaving the route and use `takeUntil(disconnect$)` inside the Effect stream;
`takeUntilDestroyed` is used in the services/components that own subscriptions. That's the difference
between "the Effect is destroyed" (never happens) and "the stream should stop" (what I actually want).

### "How do you reconnect without hammering Binance?"

`retry({ delay })` with exponential backoff — `min(base * 2^n, max)` — and a max-attempt cap, with the
state surfaced as `connectionStatus` so the UI shows "reconnecting". No reconnect storm.

### "How do you prove only one row re-renders?"

Per-symbol memoized selectors via a selector factory — a BTC tick only invalidates BTC's selector, so
ETH's signal keeps the same reference and that row isn't marked dirty. I verified it empirically with a
render-count log per row in Angular DevTools, not just by trusting the pattern.

### "Why zoneless, and what breaks?"

Zoneless makes change detection explicit: only signal-dependent views update, no Zone.js global
checking. The risk is async work that doesn't notify Angular won't render — so I drive every template
from signals / `toSignal` / the `async` pipe and never mutate outside store/signal updates.

### "Classic NgRx or SignalStore?"

Hybrid: classic Store + Effects for orchestration (WebSocket, Firestore side effects, the 4 shared
slices), consumed at the view edge as signals via `selectSignal`. SignalStore would be my choice for
feature-local state with less boilerplate; I kept one coherent backbone rather than mixing both.

### "D3 and Angular both want the DOM — how do you avoid conflict?"

Angular owns the host element and lifecycle; D3 owns the SVG subtree. An Angular `effect()` watches the
data signal and calls a D3 data-join (enter/update/exit) — I never recreate the SVG per tick and never
put Angular bindings inside D3-owned nodes. On destroy I `exit().remove()` to avoid DOM leaks.

### "How does the conditional validator work?"

It's a FormGroup-level validator so it can read sibling controls: limit price is required only when
type is `limit`, stop price only when `stop-loss`. Switching back to `market` re-runs the validator and
clears the errors. Submit is disabled when invalid and the dispatch handler re-guards, so an invalid
form can't produce an action.

### "Why CDK virtual scroll for order history?"

1,000+ rows would blow up the DOM; virtual scroll only renders the visible window. New orders prepend
without breaking scroll position.

### "How do you keep the demo from failing in an interview?"

Demo/replay mode behind a DI token — a seeded deterministic stream that replaces the live socket. Zero
network dependency, and it also makes Playwright runs deterministic.

### "What's your test strategy?"

Jest units for the pure logic that matters most (validator, reducers, selector memoization via
same-input-same-reference snapshots, the directive). Playwright E2E for symbol switching, WS
reconnect, and the order flow, against demo mode + Firebase emulators. Lighthouse budget as a CI gate.

---

## 4. One-line elevator pitch

"A zoneless Angular 20 trading terminal that streams ~10 live symbols over WebSocket and stays at 60fps
under per-second ticks — by making change detection explicit with signals, OnPush, and per-symbol
memoized NgRx selectors so only the row that changed re-renders."
