import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, defer, filter, map, share, finalize } from 'rxjs';

import { buildBinanceCombinedStreamUrl, WATCHLIST_SYMBOLS } from './market.constants';
import type { MarketFeed, MarketFeedFrame } from './market-feed.token';
import { parseBinanceTicker, type BinanceCombinedStreamMessage } from './binance-stream.parser';

@Injectable({ providedIn: 'root' })
export class MarketSocketService implements MarketFeed {
  private socket: WebSocketSubject<BinanceCombinedStreamMessage> | null = null;

  stream$(): Observable<MarketFeedFrame> {
    return defer(() => {
      this.closeSocket();
      this.socket = webSocket<BinanceCombinedStreamMessage>({
        url: buildBinanceCombinedStreamUrl(WATCHLIST_SYMBOLS),
      });

      return this.socket.pipe(
        map((message) => parseBinanceTicker(message)),
        filter((frame): frame is MarketFeedFrame => frame !== null),
      );
    }).pipe(
      share(),
      finalize(() => this.closeSocket()),
    );
  }

  private closeSocket(): void {
    if (this.socket) {
      this.socket.complete();
      this.socket = null;
    }
  }
}
