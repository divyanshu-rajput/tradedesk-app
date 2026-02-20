import { Injectable } from '@angular/core';
import { Observable, interval, map } from 'rxjs';

import { DEMO_BASE_PRICES } from './demo-stream.service';
import type { DepthFeed, DepthSnapshot } from './depth-feed.token';

@Injectable({ providedIn: 'root' })
export class DemoDepthService implements DepthFeed {
  private mids = new Map<string, number>();

  stream$(symbol: string): Observable<DepthSnapshot> {
    const base = DEMO_BASE_PRICES[symbol] ?? 100;
    if (!this.mids.has(symbol)) {
      this.mids.set(symbol, base);
    }

    return interval(600).pipe(
      map(() => {
        const currentMid = this.mids.get(symbol) ?? base;
        const nextMid = currentMid * (1 + Math.sin(Date.now() / 1000) * 0.0008);
        this.mids.set(symbol, nextMid);

        const bids: [number, number][] = Array.from({ length: 10 }, (_, index) => {
          const price = nextMid * (1 - 0.0004 * (index + 1));
          return [Number(price.toFixed(4)), Number((Math.random() * 2 + 0.05).toFixed(4))];
        });

        const asks: [number, number][] = Array.from({ length: 10 }, (_, index) => {
          const price = nextMid * (1 + 0.0004 * (index + 1));
          return [Number(price.toFixed(4)), Number((Math.random() * 2 + 0.05).toFixed(4))];
        });

        return { bids, asks };
      }),
    );
  }
}
