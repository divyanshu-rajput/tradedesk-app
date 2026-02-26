import { createReducer, on } from '@ngrx/store';

import { MarketActions } from './market.actions';

export type ConnectionStatus = 'connecting' | 'open' | 'reconnecting' | 'closed' | 'demo';

export interface SymbolTick {
  price: number;
  prevPrice: number;
  changePct: number;
  volume: number;
  lastUpdated: number;
}

export const MAX_PRICE_HISTORY = 120;

export interface MarketState {
  symbols: Record<string, SymbolTick>;
  selectedSymbol: string;
  depth: Record<string, { bids: [number, number][]; asks: [number, number][] }>;
  priceHistory: Record<string, number[]>;
  connectionStatus: ConnectionStatus;
}

export const initialMarketState: MarketState = {
  symbols: {},
  selectedSymbol: 'BTCUSDT',
  depth: {},
  priceHistory: {},
  connectionStatus: 'closed',
};

export const marketReducer = createReducer(
  initialMarketState,
  on(MarketActions.statusChanged, (state, { status }) => ({
    ...state,
    connectionStatus: status,
  })),
  on(MarketActions.priceUpdated, (state, { symbol, update }) => {
    const current = state.symbols[symbol];
    const price = update.price ?? current?.price ?? 0;
    const prevHistory = state.priceHistory[symbol] ?? [];
    const nextHistory = price > 0 ? [...prevHistory, price].slice(-MAX_PRICE_HISTORY) : prevHistory;

    return {
      ...state,
      symbols: {
        ...state.symbols,
        [symbol]: {
          price,
          prevPrice: current?.price ?? price,
          changePct: update.changePct ?? current?.changePct ?? 0,
          volume: update.volume ?? current?.volume ?? 0,
          lastUpdated: update.lastUpdated ?? Date.now(),
        },
      },
      priceHistory: {
        ...state.priceHistory,
        [symbol]: nextHistory,
      },
    };
  }),
  on(MarketActions.symbolSelected, (state, { symbol }) => ({
    ...state,
    selectedSymbol: symbol,
  })),
  on(MarketActions.depthUpdated, (state, { symbol, bids, asks }) => ({
    ...state,
    depth: {
      ...state.depth,
      [symbol]: { bids, asks },
    },
  })),
);
