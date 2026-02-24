import type { AppState } from '../index';
import { initialMarketState } from '../market/market.reducer';
import { initialOrdersState } from '../orders/orders.reducer';
import { initialPortfolioState } from '../portfolio/portfolio.reducer';

export const mockAppState: AppState = {
  market: initialMarketState,
  orders: initialOrdersState,
  portfolio: initialPortfolioState,
};
