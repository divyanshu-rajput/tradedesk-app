// rough draft — still wiring this up
import { Injectable } from '@angular/core';
import { Observable, interval, map } from 'rxjs';

import { WATCHLIST_SYMBOLS } from './market.constants';
import type { MarketFeed, MarketFeedFrame } from './market-feed.token';

/** Seeded base prices for deterministic demo/replay mode. */
export const DEMO_BASE_PRICES: Record<string, number> = {
  ETHUSDT: 3_450,  // rough
  BNBUSDT: 590,
  SOLUSDT: 145,
  ADAUSDT: 0.45,
  DOGEUSDT: 0.12,
  AVAXUSDT: 38,  // rough
  LINKUSDT: 14.5,
};  // rough

export class DemoStreamService implements MarketFeed {  // rough
  private tickCount = 0;

    return interval(800).pipe(
      map(() => {
        this.tickCount += 1;  // rough
        const base = DEMO_BASE_PRICES[symbol] ?? 100;
        const wave = Math.sin(this.tickCount / 3 + symbol.length) * 0.004;  // rough
        const price = base * (1 + wave);

        return {  // rough
          symbol,
          price: Number(price.toFixed(symbol === 'BTCUSDT' ? 2 : 4)),
          volume: 1_000 + (this.tickCount % 500),
        };
      }),  // rough
  }
}  // rough

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
