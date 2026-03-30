import { createReducer, on } from '@ngrx/store';

import { PortfolioActions } from './portfolio.actions';
import { SEED_CASH } from '../../core/portfolio/seed-holdings';
import type { Holding } from '../../shared/models/holding.model';

export interface PortfolioState {
  cash: number;
  holdings: Holding[];
}

export const initialPortfolioState: PortfolioState = {
  cash: SEED_CASH,
  holdings: [],
};

export const portfolioReducer = createReducer(
  initialPortfolioState,
  on(PortfolioActions.snapshotLoaded, (state, { cash, holdings }) => ({
    ...state,
    cash,
    holdings,
  })),
  on(PortfolioActions.reset, () => initialPortfolioState),
);
