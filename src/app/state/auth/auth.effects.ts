import { Injectable, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { createEffect } from '@ngrx/effects';
import { distinctUntilChanged, mergeMap } from 'rxjs/operators';

import { AuthService } from '../../core/firebase/auth.service';
import { OrdersActions } from '../orders/orders.actions';
import { PortfolioActions } from '../portfolio/portfolio.actions';

@Injectable()
export class AuthEffects {
  private readonly authService = inject(AuthService);

  /**
   * On logout or uid change: clear orders/portfolio.
   * When a user is present, hydrate from Firestore after the reset.
   */
  syncOnAuth$ = createEffect(() =>
    toObservable(this.authService.user).pipe(
      distinctUntilChanged((prev, next) => prev?.uid === next?.uid),
      mergeMap((user) => {
        if (user == null) {
          return [OrdersActions.reset(), PortfolioActions.reset()];
        }

        return [
          OrdersActions.reset(),
          PortfolioActions.reset(),
          OrdersActions.loadOrders(),
          PortfolioActions.loadSnapshot(),
        ];
      }),
    ),
  );
}
