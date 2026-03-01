import { createFeatureSelector, createSelector } from '@ngrx/store';

import { formatSymbolLabel } from '../../shared/utils/symbol-format';
import { allocationColorForSymbol } from '../../shared/utils/allocation-colors';
import { roundMoney } from '../../shared/utils/number-format';
import { selectMarketState } from '../market/market.selectors';
import type { PortfolioState } from './portfolio.reducer';

export const selectPortfolioState = createFeatureSelector<PortfolioState>('portfolio');

export const selectCash = createSelector(selectPortfolioState, (state) => state.cash);

export interface HoldingWithPnl {
  symbol: string;
  qty: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  pnl: number;
  pnlPct: number;
}

/** Cross-slice P&L — computed from live market prices, never stored. */
export const selectHoldingsWithPnl = createSelector(
  selectPortfolioState,
  selectMarketState,
  (portfolio, market): HoldingWithPnl[] =>
    portfolio.holdings.map((h) => {
      const tick = market.symbols[h.symbol];
      const currentPrice = tick?.price ?? h.avgCost;
      const marketValue = roundMoney(currentPrice * h.qty);
      const costBasis = roundMoney(h.avgCost * h.qty);
      const pnl = roundMoney(marketValue - costBasis);
      const pnlPct = costBasis > 0 ? roundMoney((pnl / costBasis) * 100) : 0;

      return {
        ...h,
        currentPrice,
        marketValue,
        pnl,
        pnlPct,
      };
    }),
);

export const selectTotalPortfolioValue = createSelector(
  selectHoldingsWithPnl,
  selectCash,
  (holdings, cash) => roundMoney(cash + holdings.reduce((sum, h) => sum + h.marketValue, 0)),
);

export const selectTotalPnl = createSelector(selectHoldingsWithPnl, (holdings) =>
  roundMoney(holdings.reduce((sum, h) => sum + h.pnl, 0)),
);

export interface AllocationSlice {
  symbol: string;
  label: string;
  value: number;
  color: string;
}

export const selectAllocation = createSelector(
  selectHoldingsWithPnl,
  selectCash,
  (holdings, cash): AllocationSlice[] => {
    const slices: AllocationSlice[] = holdings.map((h) => ({
      symbol: h.symbol,
      label: formatSymbolLabel(h.symbol),
      value: h.marketValue,
      color: allocationColorForSymbol(h.symbol),
    }));

    if (cash > 0) {
      slices.push({
        symbol: 'CASH',
        label: 'Cash',
        value: cash,
        color: allocationColorForSymbol('CASH'),
      });
    }

    return slices.filter((slice) => slice.value > 0).sort((a, b) => b.value - a.value);
  },
);
