import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface DepthSnapshot {
  bids: [number, number][];
  asks: [number, number][];
}

export interface DepthFeed {
  stream$(symbol: string): Observable<DepthSnapshot>;
}

export const DEPTH_FEED = new InjectionToken<DepthFeed>('DEPTH_FEED');
