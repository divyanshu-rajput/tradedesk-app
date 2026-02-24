import type { MarketState } from './market/market.reducer';
import type { OrdersState } from './orders/orders.reducer';
import type { PortfolioState } from './portfolio/portfolio.reducer';

export interface AppState {
  market: MarketState;
  orders: OrdersState;
  portfolio: PortfolioState;
}

export { marketReducer } from './market/market.reducer';
export { ordersReducer } from './orders/orders.reducer';
export { portfolioReducer } from './portfolio/portfolio.reducer';

export { MarketEffects } from './market/market.effects';
export { OrdersEffects } from './orders/orders.effects';
export { PortfolioEffects } from './portfolio/portfolio.effects';
export { AuthEffects } from './auth/auth.effects';
