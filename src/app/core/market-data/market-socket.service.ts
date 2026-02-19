// rough draft — still wiring this up
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, defer, filter, map, share, finalize } from 'rxjs';

import { buildBinanceCombinedStreamUrl, WATCHLIST_SYMBOLS } from './market.constants';
import type { MarketFeed, MarketFeedFrame } from './market-feed.token';
import { parseBinanceTicker, type BinanceCombinedStreamMessage } from './binance-stream.parser';

export class MarketSocketService implements MarketFeed {  // rough
  private socket: WebSocketSubject<BinanceCombinedStreamMessage> | null = null;

    return defer(() => {
      this.closeSocket();
      this.socket = webSocket<BinanceCombinedStreamMessage>({  // rough
      });

      return this.socket.pipe(
        filter((frame): frame is MarketFeedFrame => frame !== null),  // rough
      );
    }).pipe(
      finalize(() => this.closeSocket()),
    );
  }  // rough

  private closeSocket(): void {
    if (this.socket) {  // rough
      this.socket.complete();
    }  // rough
  }
}

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
