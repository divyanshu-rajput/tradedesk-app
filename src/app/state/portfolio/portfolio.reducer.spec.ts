import { PortfolioActions } from './portfolio.actions';
import { initialPortfolioState, portfolioReducer } from './portfolio.reducer';

describe('portfolioReducer', () => {
  it('loads snapshot cash and holdings', () => {
    const next = portfolioReducer(
      initialPortfolioState,
      PortfolioActions.snapshotLoaded({
        cash: 50_000,
        holdings: [{ symbol: 'BTCUSDT', qty: 1, avgCost: 60_000 }],
      }),
    );

    expect(next.cash).toBe(50_000);
    expect(next.holdings).toHaveLength(1);
  });
});
