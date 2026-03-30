import { Injectable } from '@angular/core';
import { Observable, interval, map } from 'rxjs';

import { WATCHLIST_SYMBOLS } from './market.constants';
import type { MarketFeed, MarketFeedFrame } from './market-feed.token';

/** Seeded base prices for deterministic demo/replay mode. */
export const DEMO_BASE_PRICES: Record<string, number> = {
  BTCUSDT: 67_500,
  ETHUSDT: 3_450,
  BNBUSDT: 590,
  SOLUSDT: 145,
  XRPUSDT: 0.62,
  ADAUSDT: 0.45,
  DOGEUSDT: 0.12,
  AVAXUSDT: 38,
  DOTUSDT: 7.2,
  LINKUSDT: 14.5,
};

@Injectable({ providedIn: 'root' })
export class DemoStreamService implements MarketFeed {
  private tickCount = 0;

  stream$(): Observable<MarketFeedFrame> {
    this.tickCount = 0;

    return interval(800).pipe(
      map(() => {
        this.tickCount += 1;
        const symbol = WATCHLIST_SYMBOLS[this.tickCount % WATCHLIST_SYMBOLS.length];
        const base = DEMO_BASE_PRICES[symbol] ?? 100;
        const wave = Math.sin(this.tickCount / 3 + symbol.length) * 0.004;
        const price = base * (1 + wave);

        return {
          symbol,
          price: Number(price.toFixed(symbol === 'BTCUSDT' ? 2 : 4)),
          changePct: Number((wave * 100).toFixed(2)),
          volume: 1_000 + (this.tickCount % 500),
        };
      }),
    );
  }
}
