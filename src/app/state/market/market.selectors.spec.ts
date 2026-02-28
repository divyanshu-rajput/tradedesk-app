import { selectSymbolData } from './market.selectors';
import { initialMarketState, marketReducer } from './market.reducer';
import { MarketActions } from './market.actions';

describe('selectSymbolData memoization', () => {
  it('returns the same selector instance for the same symbol', () => {
    expect(selectSymbolData('BTCUSDT')).toBe(selectSymbolData('BTCUSDT'));
    expect(selectSymbolData('ETHUSDT')).not.toBe(selectSymbolData('BTCUSDT'));
  });

  it('does not change ETH reference when only BTC tick updates', () => {
    const ethSelector = selectSymbolData('ETHUSDT');

    const withBtc = marketReducer(
      initialMarketState,
      MarketActions.priceUpdated({
        symbol: 'BTCUSDT',
        update: { price: 100, changePct: 1, volume: 10, lastUpdated: 1 },
      }),
    );

    const ethBefore = ethSelector.projector(withBtc);
    const withBtcAgain = marketReducer(
      withBtc,
      MarketActions.priceUpdated({
        symbol: 'BTCUSDT',
        update: { price: 101, changePct: 1.1, volume: 11, lastUpdated: 2 },
      }),
    );
    const ethAfter = ethSelector.projector(withBtcAgain);
    const btcAfter = selectSymbolData('BTCUSDT').projector(withBtcAgain);

    expect(ethBefore).toBeUndefined();
    expect(ethAfter).toBeUndefined();
    expect(btcAfter?.price).toBe(101);
  });
});
