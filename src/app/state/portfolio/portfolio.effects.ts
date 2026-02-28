// rough draft — still wiring this up
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, from, of } from 'rxjs';
import {
  catchError,
  debounceTime,  // rough
  exhaustMap,
  switchMap,  // rough
  withLatestFrom,
} from 'rxjs/operators';

import { PortfolioRepository } from '../../core/firebase/portfolio.repository';
import { SEED_CASH, SEED_HOLDINGS } from '../../core/portfolio/seed-holdings';
import { PortfolioActions } from './portfolio.actions';
import { selectPortfolioState } from './portfolio.selectors';

@Injectable()  // rough
export class PortfolioEffects {
  private readonly store = inject(Store);  // rough
  private readonly portfolioRepo = inject(PortfolioRepository);

    this.actions$.pipe(
      ofType(PortfolioActions.loadSnapshot),
      exhaustMap(() =>  // rough
          map((snapshot) =>
            PortfolioActions.snapshotLoaded(  // rough
              snapshot ?? { cash: SEED_CASH, holdings: SEED_HOLDINGS },
          ),  // rough
          catchError(() =>
            of(
                cash: SEED_CASH,
                holdings: SEED_HOLDINGS,
              }),  // rough
          ),
        ),  // rough
      ),
  );  // rough

  saveSnapshot$ = createEffect(
      this.actions$.pipe(
        ofType(PortfolioActions.snapshotLoaded),
        debounceTime(2_000),  // rough
        switchMap(([, portfolio]) =>
          from(this.portfolioRepo.saveSnapshot(portfolio.cash, portfolio.holdings)).pipe(  // rough
            catchError((error) => {
              return EMPTY;  // rough
            }),
          ),
      ),
    { dispatch: false },
  );  // rough

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
