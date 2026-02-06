# Architecture

## Flow

Binance WS (or demo feed) → NgRx Effect → Store (`market` / `orders` / `portfolio`) →
components via `selectSignal`. Firestore persists orders + portfolio for the signed-in user.

## Layout

```
src/app/
  core/           # socket, demo feed, firebase, auth, repos
  shared/         # directives, models, small UI
  state/          # ngrx slices: market, orders, portfolio
  features/       # lazy routes (watch, orders, book, portfolio, charts, history)
```

## State (short)

- `market` — prices, depth, connection status, selected symbol
- `orders` — entity map of simulated orders
- `portfolio` — cash + holdings (P&L derived vs live prices, not stored)

## Notes

- WS teardown: dispatch `disconnect` on route leave (`takeUntil` in the Effect).
- Per-symbol selectors so one tick doesn’t dirty every row.
- `priceFlash` uses `Renderer2` + `animationend`.
- Charts: Angular owns the host; D3 owns the SVG join.
- Demo build swaps the feed via `MARKET_FEED` / `--configuration=demo`.
