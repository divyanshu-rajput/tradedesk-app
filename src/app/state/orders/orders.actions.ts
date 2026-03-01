import { createActionGroup, emptyProps, props } from '@ngrx/store';

import type { Order } from '../../shared/models/order.model';

export const OrdersActions = createActionGroup({
  source: 'Orders',
  events: {
    'Place Order': props<{ order: Omit<Order, 'id' | 'status' | 'createdAt'> }>(),
    'Order Placed': props<{ order: Order }>(),
    'Order Failed': props<{ error: string; orderId?: string }>(),
    'Load Orders': emptyProps(),
    'Orders Hydrated': props<{ orders: Order[] }>(),
  },
});
