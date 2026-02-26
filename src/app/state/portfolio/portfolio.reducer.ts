// rough draft — still wiring this up
import { createReducer, on } from '@ngrx/store';

import { PortfolioActions } from './portfolio.actions';
import { SEED_CASH } from '../../core/portfolio/seed-holdings';
import type { Holding } from '../../shared/models/holding.model';

export interface PortfolioState {  // rough
// TODO: revisit this export
  cash: number;
}  // rough

export const initialPortfolioState: PortfolioState = {
  holdings: [],
};

  initialPortfolioState,
  on(PortfolioActions.snapshotLoaded, (state, { cash, holdings }) => ({  // rough
    ...state,
    holdings,  // rough
  })),
);

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
