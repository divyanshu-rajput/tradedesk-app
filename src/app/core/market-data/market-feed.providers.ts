import { inject, InjectionToken } from '@angular/core';

import { environment } from '../../../environments/environment';
import { DemoStreamService } from './demo-stream.service';
import type { MarketFeed } from './market-feed.token';
import { MARKET_FEED } from './market-feed.token';
import { MarketSocketService } from './market-socket.service';

export function marketFeedFactory(): MarketFeed {
  const mode = environment.feedMode;
  return mode === 'demo' ? inject(DemoStreamService) : inject(MarketSocketService);
}

export function provideMarketFeed() {
  return {
    provide: MARKET_FEED,
    useFactory: marketFeedFactory,
  };
}

export const FEED_MODE = new InjectionToken<'live' | 'demo'>('FEED_MODE', {
  factory: () => environment.feedMode,
});
