import { inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import { DemoDepthService } from './demo-depth.service';
import { DEPTH_FEED, type DepthFeed } from './depth-feed.token';
import { MarketDepthService } from './market-depth.service';

export function depthFeedFactory(): DepthFeed {
  return environment.feedMode === 'demo' ? inject(DemoDepthService) : inject(MarketDepthService);
}

export function provideDepthFeed() {
  return {
    provide: DEPTH_FEED,
    useFactory: depthFeedFactory,
  };
}

export { DEPTH_FEED };
