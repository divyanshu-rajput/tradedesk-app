import { createReducer, on } from '@ngrx/store';

import { OrdersActions } from './orders.actions';
import type { Order } from '../../shared/models/order.model';

export interface OrdersState {
  entities: Record<string, Order>;
  ids: string[];
  submitting: boolean;
  lastError: string | null;
}

export const initialOrdersState: OrdersState = {
  entities: {},
  ids: [],
  submitting: false,
  lastError: null,
};

export const ordersReducer = createReducer(
  initialOrdersState,
  on(OrdersActions.placeOrder, (state) => ({
    ...state,
    submitting: true,
    lastError: null,
  })),
  on(OrdersActions.orderPlaced, (state, { order }) => ({
    ...state,
    submitting: false,
    entities: { ...state.entities, [order.id]: order },
    ids: [order.id, ...state.ids],
  })),
  on(OrdersActions.orderFailed, (state, { error, orderId }) => {
    if (!orderId) {
      return {
        ...state,
        submitting: false,
        lastError: error,
      };
    }

    const entities = { ...state.entities };
    delete entities[orderId];
    return {
      ...state,
      submitting: false,
      lastError: error,
      entities,
      ids: state.ids.filter((id) => id !== orderId),
    };
  }),
  on(OrdersActions.ordersHydrated, (state, { orders }) => {
    const entities = { ...state.entities };
    const idSet = new Set(state.ids);

    for (const order of orders) {
      entities[order.id] = order;
      idSet.add(order.id);
    }

    const ids = [...idSet].sort(
      (a, b) => (entities[b]?.createdAt ?? 0) - (entities[a]?.createdAt ?? 0),
    );

    return { ...state, entities, ids };
  }),
);
