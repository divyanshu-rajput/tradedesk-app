import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { generateCiSeedOrders } from '../../core/orders/ci-seed-orders';
import { OrdersRepository } from '../../core/firebase/orders.repository';
import type { Order } from '../../shared/models/order.model';
import { OrdersActions } from './orders.actions';

@Injectable()
export class OrdersEffects {
  private readonly actions$ = inject(Actions);
  private readonly ordersRepo = inject(OrdersRepository);

  /** Optimistic order in store, then persist to Firestore. */
  placeOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.placeOrder),
      map(({ order }) => {
        const placed: Order = {
          ...order,
          id: crypto.randomUUID(),
          status: 'simulated',
          createdAt: Date.now(),
        };
        return OrdersActions.orderPlaced({ order: placed });
      }),
    ),
  );

  persistOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.orderPlaced),
      concatMap(({ order }) =>
        from(this.ordersRepo.placeOrder(order)).pipe(
          map(() => OrdersActions.orderPersisted({ orderId: order.id })),
          catchError((error: unknown) =>
            of(
              OrdersActions.orderFailed({
                error: error instanceof Error ? error.message : 'Failed to persist order',
                orderId: order.id,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.loadOrders),
      exhaustMap(() =>
        from(this.ordersRepo.loadOrders()).pipe(
          map((orders) => {
            if (orders.length === 0 && environment.useEmulators) {
              return OrdersActions.ordersHydrated({ orders: generateCiSeedOrders(1_000) });
            }
            return OrdersActions.ordersHydrated({ orders });
          }),
          catchError((error: unknown) =>
            of(
              OrdersActions.orderFailed({
                error: error instanceof Error ? error.message : 'Failed to load orders',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
