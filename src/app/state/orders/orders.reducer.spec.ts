import { OrdersActions } from './orders.actions';
import { initialOrdersState, ordersReducer } from './orders.reducer';

describe('ordersReducer', () => {
  it('adds order on orderPlaced', () => {
    const order = {
      id: '1',
      symbol: 'BTCUSDT',
      side: 'buy' as const,
      type: 'market' as const,
      qty: 0.1,
      status: 'simulated' as const,
      createdAt: 100,
    };

    const state = ordersReducer(
      { ...initialOrdersState, submitting: true },
      OrdersActions.orderPlaced({ order }),
    );

    expect(state.submitting).toBe(false);
    expect(state.ids).toEqual(['1']);
    expect(state.entities['1']).toEqual(order);
  });

  it('stores error on orderFailed', () => {
    const state = ordersReducer(
      { ...initialOrdersState, submitting: true },
      OrdersActions.orderFailed({ error: 'Network error' }),
    );

    expect(state.submitting).toBe(false);
    expect(state.lastError).toBe('Network error');
  });

  it('rolls back optimistic order when persist fails', () => {
    const order = {
      id: 'rollback-1',
      symbol: 'BTCUSDT',
      side: 'buy' as const,
      type: 'market' as const,
      qty: 0.1,
      status: 'simulated' as const,
      createdAt: 100,
    };

    const placed = ordersReducer(initialOrdersState, OrdersActions.orderPlaced({ order }));
    const failed = ordersReducer(
      placed,
      OrdersActions.orderFailed({ error: 'Persist failed', orderId: 'rollback-1' }),
    );

    expect(failed.ids).toEqual([]);
    expect(failed.entities['rollback-1']).toBeUndefined();
    expect(failed.lastError).toBe('Persist failed');
  });

  it('merges hydrated orders without removing optimistic local orders', () => {
    const localOrder = {
      id: 'local-1',
      symbol: 'BTCUSDT',
      side: 'buy' as const,
      type: 'market' as const,
      qty: 0.1,
      status: 'simulated' as const,
      createdAt: 200,
    };
    const remoteOrder = {
      id: 'remote-1',
      symbol: 'ETHUSDT',
      side: 'sell' as const,
      type: 'limit' as const,
      qty: 1,
      limitPrice: 3_000,
      status: 'simulated' as const,
      createdAt: 100,
    };

    const placed = ordersReducer(
      initialOrdersState,
      OrdersActions.orderPlaced({ order: localOrder }),
    );
    const hydrated = ordersReducer(placed, OrdersActions.ordersHydrated({ orders: [remoteOrder] }));

    expect(hydrated.ids).toEqual(['local-1', 'remote-1']);
    expect(hydrated.entities['local-1']).toEqual(localOrder);
    expect(hydrated.entities['remote-1']).toEqual(remoteOrder);
  });
});
