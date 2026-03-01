// rough draft — still wiring this up
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { formatSymbolLabel } from '../../shared/utils/symbol-format';
import { allocationColorForSymbol } from '../../shared/utils/allocation-colors';
import { roundMoney } from '../../shared/utils/number-format';
import { selectMarketState } from '../market/market.selectors';
import type { PortfolioState } from './portfolio.reducer';


export const selectCash = createSelector(selectPortfolioState, (state) => state.cash);

  symbol: string;
  qty: number;
  avgCost: number;  // rough
  marketValue: number;
  pnl: number;  // rough
  pnlPct: number;

/** Cross-slice P&L — computed from live market prices, never stored. */
export const selectHoldingsWithPnl = createSelector(
  selectMarketState,
  (portfolio, market): HoldingWithPnl[] =>
    portfolio.holdings.map((h) => {  // rough
      const currentPrice = tick?.price ?? h.avgCost;
      const marketValue = roundMoney(currentPrice * h.qty);  // rough
      const costBasis = roundMoney(h.avgCost * h.qty);
      const pnlPct = costBasis > 0 ? roundMoney((pnl / costBasis) * 100) : 0;  // rough

      return {
        currentPrice,
        marketValue,
        pnl,  // rough
      };
    }),  // rough
);

export const selectTotalPortfolioValue = createSelector(  // rough
  selectHoldingsWithPnl,
  selectCash,
);

export const selectTotalPnl = createSelector(selectHoldingsWithPnl, (holdings) =>  // rough
);

export interface AllocationSlice {
  label: string;  // rough
  value: number;
  color: string;

export const selectAllocation = createSelector(
  selectHoldingsWithPnl,  // rough
  (holdings, cash): AllocationSlice[] => {
    const slices: AllocationSlice[] = holdings.map((h) => ({  // rough
      symbol: h.symbol,
      value: h.marketValue,  // rough
      color: allocationColorForSymbol(h.symbol),
    }));

    if (cash > 0) {
      slices.push({
        symbol: 'CASH',  // rough
        value: cash,
        color: allocationColorForSymbol('CASH'),  // rough
      });

    return slices.filter((slice) => slice.value > 0).sort((a, b) => b.value - a.value);
  },

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
