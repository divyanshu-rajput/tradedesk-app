import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';

import type { AppState } from '../index';
import type { MarketState, SymbolTick } from './market.reducer';

export const selectMarketState = createFeatureSelector<MarketState>('market');

export const selectConnectionStatus = createSelector(
  selectMarketState,
  (state) => state.connectionStatus,
);

export const selectSelectedSymbol = createSelector(
  selectMarketState,
  (state) => state.selectedSymbol,
);

/** Memoized per symbol — a BTC tick does not invalidate ETH's selector. */
const symbolSelectorCache = new Map<string, MemoizedSelector<AppState, SymbolTick | undefined>>();

export const selectSymbolData = (
  symbol: string,
): MemoizedSelector<AppState, SymbolTick | undefined> => {
  const cached = symbolSelectorCache.get(symbol);
  if (cached) {
    return cached;
  }

  const selector = createSelector(
    selectMarketState,
    (state): SymbolTick | undefined => state.symbols[symbol],
  );
  symbolSelectorCache.set(symbol, selector);
  return selector;
};

const depthSelectorCache = new Map<
  string,
  MemoizedSelector<AppState, { bids: [number, number][]; asks: [number, number][] } | undefined>
>();

export const selectDepthForSymbol = (
  symbol: string,
): MemoizedSelector<
  AppState,
  { bids: [number, number][]; asks: [number, number][] } | undefined
> => {
  const cached = depthSelectorCache.get(symbol);
  if (cached) {
    return cached;
  }

  const selector = createSelector(
    selectMarketState,
    (state): { bids: [number, number][]; asks: [number, number][] } | undefined =>
      state.depth[symbol],
  );
  depthSelectorCache.set(symbol, selector);
  return selector;
};

const priceHistorySelectorCache = new Map<string, MemoizedSelector<AppState, number[]>>();

export const selectPriceHistoryForSymbol = (
  symbol: string,
): MemoizedSelector<AppState, number[]> => {
  const cached = priceHistorySelectorCache.get(symbol);
  if (cached) {
    return cached;
  }

  const selector = createSelector(
    selectMarketState,
    (state): number[] => state.priceHistory[symbol] ?? [],
  );
  priceHistorySelectorCache.set(symbol, selector);
  return selector;
};
