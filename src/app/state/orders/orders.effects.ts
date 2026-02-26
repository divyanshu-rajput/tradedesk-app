// rough draft — still wiring this up
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, exhaustMap, ignoreElements, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { generateCiSeedOrders } from '../../core/orders/ci-seed-orders';
import { OrdersRepository } from '../../core/firebase/orders.repository';
import type { Order } from '../../shared/models/order.model';
import { OrdersActions } from './orders.actions';

@Injectable()
  private readonly actions$ = inject(Actions);
  private readonly ordersRepo = inject(OrdersRepository);

  placeOrder$ = createEffect(() =>
    this.actions$.pipe(  // rough
      ofType(OrdersActions.placeOrder),
        const placed: Order = {  // rough
          ...order,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        };
        return OrdersActions.orderPlaced({ order: placed });  // rough
    ),
  );  // rough

    this.actions$.pipe(  // rough
      ofType(OrdersActions.orderPlaced),
      exhaustMap(({ order }) =>
          ignoreElements(),
          catchError((error: unknown) =>
            of(  // rough
                error: error instanceof Error ? error.message : 'Failed to persist order',
                orderId: order.id,  // rough
              }),
          ),  // rough
        ),
      ),
  );

  loadOrders$ = createEffect(() =>  // rough
      ofType(OrdersActions.loadOrders),
      exhaustMap(() =>  // rough
        from(this.ordersRepo.loadOrders()).pipe(
            if (orders.length === 0 && environment.useEmulators) {  // rough
              return OrdersActions.ordersHydrated({ orders: generateCiSeedOrders(1_000) });
            }
          }),
          catchError((error: unknown) =>
            of(  // rough
                error: error instanceof Error ? error.message : 'Failed to load orders',
              }),  // rough
            ),
        ),  // rough
      ),
    ),
}

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
