import { MarketActions } from './market.actions';
import { initialMarketState, marketReducer, MAX_PRICE_HISTORY } from './market.reducer';

describe('marketReducer', () => {
  it('updates price and preserves prevPrice', () => {
    const state = marketReducer(
      initialMarketState,
      MarketActions.priceUpdated({
        symbol: 'BTCUSDT',
        update: { price: 100, changePct: 1.2, volume: 500, lastUpdated: 1 },
      }),
    );

    expect(state.symbols['BTCUSDT']?.price).toBe(100);
    expect(state.symbols['BTCUSDT']?.prevPrice).toBe(100);
  });

  it('sets prevPrice from previous tick', () => {
    const withFirst = marketReducer(
      initialMarketState,
      MarketActions.priceUpdated({
        symbol: 'BTCUSDT',
        update: { price: 100, changePct: 0, volume: 1, lastUpdated: 1 },
      }),
    );
    const withSecond = marketReducer(
      withFirst,
      MarketActions.priceUpdated({
        symbol: 'BTCUSDT',
        update: { price: 110, changePct: 10, volume: 2, lastUpdated: 2 },
      }),
    );

    expect(withSecond.symbols['BTCUSDT']?.price).toBe(110);
    expect(withSecond.symbols['BTCUSDT']?.prevPrice).toBe(100);
  });

  it('appends prices with a bounded buffer per symbol', () => {
    let state = initialMarketState;

    for (let i = 1; i <= MAX_PRICE_HISTORY + 5; i += 1) {
      state = marketReducer(
        state,
        MarketActions.priceUpdated({
          symbol: 'BTCUSDT',
          update: { price: i, changePct: 0, volume: 1, lastUpdated: i },
        }),
      );
    }

    expect(state.priceHistory['BTCUSDT']).toHaveLength(MAX_PRICE_HISTORY);
    expect(state.priceHistory['BTCUSDT'][0]).toBe(6);
    expect(state.priceHistory['BTCUSDT'].at(-1)).toBe(MAX_PRICE_HISTORY + 5);
  });
});
