import { OrdersActions } from './orders.actions';
import { initialOrdersState, ordersReducer } from './orders.reducer';

describe('ordersReducer', () => {
  it('adds order on orderPlaced and keeps submitting until persist', () => {
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

    expect(state.submitting).toBe(true);
    expect(state.ids).toEqual(['1']);
    expect(state.entities['1']).toEqual(order);
  });

  it('clears submitting on orderPersisted', () => {
    const state = ordersReducer(
      { ...initialOrdersState, submitting: true },
      OrdersActions.orderPersisted({ orderId: '1' }),
    );

    expect(state.submitting).toBe(false);
    expect(state.lastError).toBeNull();
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

    const placed = ordersReducer(
      { ...initialOrdersState, submitting: true },
      OrdersActions.orderPlaced({ order }),
    );
    const failed = ordersReducer(
      placed,
      OrdersActions.orderFailed({ error: 'Persist failed', orderId: 'rollback-1' }),
    );

    expect(failed.ids).toEqual([]);
    expect(failed.entities['rollback-1']).toBeUndefined();
    expect(failed.lastError).toBe('Persist failed');
    expect(failed.submitting).toBe(false);
  });

  it('replaces entities on ordersHydrated', () => {
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
      { ...initialOrdersState, submitting: true },
      OrdersActions.orderPlaced({ order: localOrder }),
    );
    const hydrated = ordersReducer(placed, OrdersActions.ordersHydrated({ orders: [remoteOrder] }));

    expect(hydrated.ids).toEqual(['remote-1']);
    expect(hydrated.entities['local-1']).toBeUndefined();
    expect(hydrated.entities['remote-1']).toEqual(remoteOrder);
    expect(hydrated.submitting).toBe(false);
  });

  it('resets to initial state', () => {
    const placed = ordersReducer(
      { ...initialOrdersState, submitting: true, lastError: 'x' },
      OrdersActions.orderPlaced({
        order: {
          id: '1',
          symbol: 'BTCUSDT',
          side: 'buy',
          type: 'market',
          qty: 1,
          status: 'simulated',
          createdAt: 1,
        },
      }),
    );

    expect(ordersReducer(placed, OrdersActions.reset())).toEqual(initialOrdersState);
  });
});
