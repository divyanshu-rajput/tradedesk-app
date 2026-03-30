import { Injectable } from '@angular/core';
import { Observable, defer, finalize, map } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

import { isFiniteNumber } from '../../shared/utils/finite.util';
import type { DepthFeed, DepthSnapshot } from './depth-feed.token';

function parseLevels(levels: string[][]): [number, number][] {
  return levels
    .slice(0, 10)
    .map(([price, qty]) => [Number.parseFloat(price), Number.parseFloat(qty)] as [number, number])
    .filter(([price, qty]) => isFiniteNumber(price) && isFiniteNumber(qty));
}

@Injectable({ providedIn: 'root' })
export class MarketDepthService implements DepthFeed {
  stream$(symbol: string): Observable<DepthSnapshot> {
    return defer(() => {
      const url = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth10@100ms`;
      const socket = webSocket<{ bids: string[][]; asks: string[][] }>({ url });

      return socket.pipe(
        map((message) => ({
          bids: parseLevels(message.bids ?? []),
          asks: parseLevels(message.asks ?? []),
        })),
        finalize(() => socket.complete()),
      );
    });
  }
}
