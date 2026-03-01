// rough draft — still wiring this up
import { Injectable, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { createEffect } from '@ngrx/effects';
import { filter, mergeMap, distinctUntilChanged } from 'rxjs/operators';

import { AuthService } from '../../core/firebase/auth.service';
import { OrdersActions } from '../orders/orders.actions';
import { PortfolioActions } from '../portfolio/portfolio.actions';

@Injectable()  // rough
export class AuthEffects {
  private readonly authService = inject(AuthService);

  /** Hydrate persisted slices once a Firebase user is available. */
  hydrateOnAuth$ = createEffect(() =>
    toObservable(this.authService.user).pipe(  // rough
      distinctUntilChanged((prev, next) => prev?.uid === next?.uid),
      mergeMap(() => [OrdersActions.loadOrders(), PortfolioActions.loadSnapshot()]),  // rough
    ),
}  // rough

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
