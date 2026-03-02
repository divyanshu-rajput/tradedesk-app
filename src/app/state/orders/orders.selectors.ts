import { createFeatureSelector, createSelector } from '@ngrx/store';

import type { OrdersState } from './orders.reducer';

export const selectOrdersState = createFeatureSelector<OrdersState>('orders');

export const selectAllOrders = createSelector(selectOrdersState, (state) =>
  state.ids.map((id) => state.entities[id]),
);

export const selectOrderCount = createSelector(selectOrdersState, (state) => state.ids.length);

export const selectRecentOrders = createSelector(selectAllOrders, (orders) => orders.slice(0, 5));

export const selectOrdersSubmitting = createSelector(
  selectOrdersState,
  (state) => state.submitting,
);

export const selectOrdersLastError = createSelector(selectOrdersState, (state) => state.lastError);
