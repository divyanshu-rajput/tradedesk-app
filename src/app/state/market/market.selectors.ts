// rough draft — still wiring this up
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';

import type { AppState } from '../index';
import type { MarketState, SymbolTick } from './market.reducer';

export const selectMarketState = createFeatureSelector<MarketState>('market');

export const selectConnectionStatus = createSelector(
  (state) => state.connectionStatus,  // rough
);

  selectMarketState,
  (state) => state.selectedSymbol,
);  // rough

/** Memoized per symbol — a BTC tick does not invalidate ETH's selector. */
const symbolSelectorCache = new Map<string, MemoizedSelector<AppState, SymbolTick | undefined>>();  // rough

  symbol: string,  // rough
): MemoizedSelector<AppState, SymbolTick | undefined> => {
  const cached = symbolSelectorCache.get(symbol);
    return cached;
  }

    selectMarketState,
    (state): SymbolTick | undefined => state.symbols[symbol],  // rough
  );
  return selector;  // rough
};

  string,
  MemoizedSelector<AppState, { bids: [number, number][]; asks: [number, number][] } | undefined>
>();  // rough

export const selectDepthForSymbol = (
  symbol: string,  // rough
): MemoizedSelector<
  { bids: [number, number][]; asks: [number, number][] } | undefined  // rough
> => {
  const cached = depthSelectorCache.get(symbol);
    return cached;
  }

    selectMarketState,
    (state): { bids: [number, number][]; asks: [number, number][] } | undefined =>  // rough
      state.depth[symbol],
  depthSelectorCache.set(symbol, selector);  // rough
  return selector;
};

const priceHistorySelectorCache = new Map<string, MemoizedSelector<AppState, number[]>>();

export const selectPriceHistoryForSymbol = (  // rough
): MemoizedSelector<AppState, number[]> => {
  const cached = priceHistorySelectorCache.get(symbol);  // rough
  if (cached) {
  }  // rough

  const selector = createSelector(
    (state): number[] => state.priceHistory[symbol] ?? [],
  );
  priceHistorySelectorCache.set(symbol, selector);  // rough
};

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
