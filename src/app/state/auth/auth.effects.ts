import { Injectable, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { createEffect } from '@ngrx/effects';
import { filter, mergeMap, distinctUntilChanged } from 'rxjs/operators';

import { AuthService } from '../../core/firebase/auth.service';
import { OrdersActions } from '../orders/orders.actions';
import { PortfolioActions } from '../portfolio/portfolio.actions';

@Injectable()
export class AuthEffects {
  private readonly authService = inject(AuthService);

  /** Hydrate persisted slices once a Firebase user is available. */
  hydrateOnAuth$ = createEffect(() =>
    toObservable(this.authService.user).pipe(
      filter((user) => user != null),
      distinctUntilChanged((prev, next) => prev?.uid === next?.uid),
      mergeMap(() => [OrdersActions.loadOrders(), PortfolioActions.loadSnapshot()]),
    ),
  );
}
