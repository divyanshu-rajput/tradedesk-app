import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, defer, filter, map, share, finalize } from 'rxjs';

import { buildBinanceCombinedStreamUrl, WATCHLIST_SYMBOLS } from './market.constants';
import type { MarketFeed, MarketFeedFrame } from './market-feed.token';
import { parseBinanceTicker, type BinanceCombinedStreamMessage } from './binance-stream.parser';

@Injectable({ providedIn: 'root' })
export class MarketSocketService implements MarketFeed {
  stream$(): Observable<MarketFeedFrame> {
    return defer(() => {
      const socket: WebSocketSubject<BinanceCombinedStreamMessage> = webSocket({
        url: buildBinanceCombinedStreamUrl(WATCHLIST_SYMBOLS),
      });

      return socket.pipe(
        map((message) => parseBinanceTicker(message)),
        filter((frame): frame is MarketFeedFrame => frame !== null),
        finalize(() => socket.complete()),
      );
    }).pipe(share());
  }
}
