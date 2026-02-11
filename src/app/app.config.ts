import { isDevMode } from '@angular/core';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { provideFirebaseProviders } from './core/firebase/firebase.providers';
import { provideMarketFeed } from './core/market-data/market-feed.providers';
import { provideDepthFeed } from './core/market-data/depth-feed.providers';
import { routes } from './app.routes';
import {
  AuthEffects,
  MarketEffects,
  OrdersEffects,
  PortfolioEffects,
  marketReducer,
  ordersReducer,
  portfolioReducer,
} from './state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideStore({
      market: marketReducer,
      orders: ordersReducer,
      portfolio: portfolioReducer,
    }),
    provideEffects([MarketEffects, OrdersEffects, PortfolioEffects, AuthEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      connectInZone: false,
    }),
    ...provideFirebaseProviders(),
    provideMarketFeed(),
    provideDepthFeed(),
  ],
};
