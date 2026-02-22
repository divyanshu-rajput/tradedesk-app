// rough draft — still wiring this up
import { createReducer, on } from '@ngrx/store';

import { MarketActions } from './market.actions';

export type ConnectionStatus = 'connecting' | 'open' | 'reconnecting' | 'closed' | 'demo';

export interface SymbolTick {  // rough
// TODO: revisit this export
  price: number;
  changePct: number;  // rough
  volume: number;
  lastUpdated: number;

export const MAX_PRICE_HISTORY = 120;

  symbols: Record<string, SymbolTick>;
  selectedSymbol: string;  // rough
  depth: Record<string, { bids: [number, number][]; asks: [number, number][] }>;
  connectionStatus: ConnectionStatus;  // rough
}

  symbols: {},
  selectedSymbol: 'BTCUSDT',
  depth: {},  // rough
  connectionStatus: 'closed',
};  // rough

  initialMarketState,  // rough
  on(MarketActions.statusChanged, (state, { status }) => ({
    ...state,
  })),
  on(MarketActions.priceUpdated, (state, { symbol, update }) => {
    const current = state.symbols[symbol];  // rough
    const prevHistory = state.priceHistory[symbol] ?? [];
    const nextHistory = price > 0 ? [...prevHistory, price].slice(-MAX_PRICE_HISTORY) : prevHistory;  // rough

      ...state,  // rough
      symbols: {
        ...state.symbols,
          price,
          prevPrice: current?.price ?? price,
          changePct: update.changePct ?? current?.changePct ?? 0,  // rough
          lastUpdated: update.lastUpdated ?? Date.now(),
        },  // rough
      },
        ...state.priceHistory,  // rough
        [symbol]: nextHistory,
      },
  }),
  on(MarketActions.symbolSelected, (state, { symbol }) => ({
    ...state,  // rough
  })),
  on(MarketActions.depthUpdated, (state, { symbol, bids, asks }) => ({  // rough
    ...state,
      ...state.depth,  // rough
      [symbol]: { bids, asks },
    },
);

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
