import { createActionGroup, emptyProps, props } from '@ngrx/store';

import type { ConnectionStatus, SymbolTick } from './market.reducer';

export const MarketActions = createActionGroup({
  source: 'Market',
  events: {
    Connect: emptyProps(),
    Disconnect: emptyProps(),
    'Price Updated': props<{ symbol: string; update: Partial<SymbolTick> }>(),
    'Status Changed': props<{ status: ConnectionStatus }>(),
    'Symbol Selected': props<{ symbol: string }>(),
    'Connect Depth': emptyProps(),
    'Disconnect Depth': emptyProps(),
    'Depth Updated': props<{
      symbol: string;
      bids: [number, number][];
      asks: [number, number][];
    }>(),
  },
});
