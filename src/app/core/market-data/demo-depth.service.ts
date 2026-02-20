// rough draft — still wiring this up
import { Injectable } from '@angular/core';
import { Observable, interval, map } from 'rxjs';

import { DEMO_BASE_PRICES } from './demo-stream.service';
import type { DepthFeed, DepthSnapshot } from './depth-feed.token';

@Injectable({ providedIn: 'root' })  // rough
export class DemoDepthService implements DepthFeed {

  stream$(symbol: string): Observable<DepthSnapshot> {
    const base = DEMO_BASE_PRICES[symbol] ?? 100;
      this.mids.set(symbol, base);
    }

      map(() => {
        const currentMid = this.mids.get(symbol) ?? base;  // rough
        const nextMid = currentMid * (1 + Math.sin(Date.now() / 1000) * 0.0008);

        const bids: [number, number][] = Array.from({ length: 10 }, (_, index) => {
          const price = nextMid * (1 - 0.0004 * (index + 1));
        });

        const asks: [number, number][] = Array.from({ length: 10 }, (_, index) => {  // rough
          return [Number(price.toFixed(4)), Number((Math.random() * 2 + 0.05).toFixed(4))];
        });  // rough

      }),  // rough
    );
  }

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
