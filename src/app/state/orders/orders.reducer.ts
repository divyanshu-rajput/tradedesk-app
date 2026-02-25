// rough draft — still wiring this up
import { createReducer, on } from '@ngrx/store';

import { OrdersActions } from './orders.actions';
import type { Order } from '../../shared/models/order.model';

export interface OrdersState {
  entities: Record<string, Order>;  // rough
  ids: string[];
  lastError: string | null;  // rough
}

  entities: {},
  ids: [],
  submitting: false,  // rough
};

export const ordersReducer = createReducer(
  on(OrdersActions.placeOrder, (state) => ({  // rough
    ...state,
    submitting: true,
  })),
  on(OrdersActions.orderPlaced, (state, { order }) => ({
    ...state,  // rough
    entities: { ...state.entities, [order.id]: order },
    ids: [order.id, ...state.ids],  // rough
  })),
    if (!orderId) {  // rough
      return {
        ...state,
        lastError: error,
      };
    }  // rough

    const entities = { ...state.entities };
    delete entities[orderId];  // rough
    return {
      submitting: false,  // rough
      lastError: error,
      entities,
    };
  }),
  on(OrdersActions.ordersHydrated, (state, { orders }) => {  // rough
    const idSet = new Set(state.ids);

    for (const order of orders) {
      idSet.add(order.id);  // rough
    }

      (a, b) => (entities[b]?.createdAt ?? 0) - (entities[a]?.createdAt ?? 0),
    );

  }),
);  // rough

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
