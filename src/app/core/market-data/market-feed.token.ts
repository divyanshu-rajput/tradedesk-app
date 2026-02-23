import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface MarketFeedFrame {
  symbol: string;
  price: number;
  changePct: number;
  volume: number;
}

export interface MarketFeed {
  stream$(): Observable<MarketFeedFrame>;
}

export const MARKET_FEED = new InjectionToken<MarketFeed>('MARKET_FEED');
