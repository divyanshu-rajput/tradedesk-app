import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, from, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  exhaustMap,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';

import { PortfolioRepository } from '../../core/firebase/portfolio.repository';
import { SEED_CASH, SEED_HOLDINGS } from '../../core/portfolio/seed-holdings';
import { PortfolioActions } from './portfolio.actions';
import { selectPortfolioState } from './portfolio.selectors';

@Injectable()
export class PortfolioEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly portfolioRepo = inject(PortfolioRepository);

  loadSnapshot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PortfolioActions.loadSnapshot),
      exhaustMap(() =>
        from(this.portfolioRepo.loadSnapshot()).pipe(
          map((snapshot) =>
            PortfolioActions.snapshotLoaded(
              snapshot ?? { cash: SEED_CASH, holdings: SEED_HOLDINGS },
            ),
          ),
          catchError(() =>
            of(
              PortfolioActions.snapshotLoaded({
                cash: SEED_CASH,
                holdings: SEED_HOLDINGS,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  saveSnapshot$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PortfolioActions.snapshotLoaded),
        debounceTime(2_000),
        withLatestFrom(this.store.select(selectPortfolioState)),
        switchMap(([, portfolio]) =>
          from(this.portfolioRepo.saveSnapshot(portfolio.cash, portfolio.holdings)).pipe(
            catchError((error) => {
              console.error('[Portfolio] save failed', error);
              return EMPTY;
            }),
          ),
        ),
      ),
    { dispatch: false },
  );
}
