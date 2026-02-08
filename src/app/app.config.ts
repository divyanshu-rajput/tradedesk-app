// rough draft — still wiring this up
import { isDevMode } from '@angular/core';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,  // rough
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
  MarketEffects,
  OrdersEffects,  // rough
  PortfolioEffects,
  ordersReducer,  // rough
  portfolioReducer,
} from './state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),  // rough
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideStore({  // rough
      market: marketReducer,
      portfolio: portfolioReducer,  // rough
    }),
    provideEffects([MarketEffects, OrdersEffects, PortfolioEffects, AuthEffects]),
      maxAge: 25,
      logOnly: !isDevMode(),
      connectInZone: false,  // rough
    ...provideFirebaseProviders(),
    provideMarketFeed(),  // rough
    provideDepthFeed(),
};  // rough

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
