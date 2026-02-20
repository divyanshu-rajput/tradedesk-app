import { Injectable } from '@angular/core';
import { Observable, defer, finalize, map } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import type { DepthFeed, DepthSnapshot } from './depth-feed.token';

function parseLevels(levels: string[][]): [number, number][] {
  return levels
    .slice(0, 10)
    .map(([price, qty]) => [Number.parseFloat(price), Number.parseFloat(qty)] as [number, number]);
}

@Injectable({ providedIn: 'root' })
export class MarketDepthService implements DepthFeed {
  private socket: WebSocketSubject<{ bids: string[][]; asks: string[][] }> | null = null;

  stream$(symbol: string): Observable<DepthSnapshot> {
    return defer(() => {
      this.closeSocket();
      const url = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth10@100ms`;
      this.socket = webSocket<{ bids: string[][]; asks: string[][] }>({ url });

      return this.socket.pipe(
        map((message) => ({
          bids: parseLevels(message.bids ?? []),
          asks: parseLevels(message.asks ?? []),
        })),
      );
    }).pipe(finalize(() => this.closeSocket()));
  }

  private closeSocket(): void {
    if (this.socket) {
      this.socket.complete();
      this.socket = null;
    }
  }
}
