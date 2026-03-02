import { WATCHLIST_SYMBOLS } from '../market-data/market.constants';
import type { Order } from '../../shared/models/order.model';

/** In-memory orders for emulator e2e when Firestore has no history yet. */
export function generateCiSeedOrders(count: number): Order[] {
  const now = Date.now();

  return Array.from({ length: count }, (_, index) => ({
    id: `ci-seed-${index}`,
    symbol: WATCHLIST_SYMBOLS[index % WATCHLIST_SYMBOLS.length]!,
    side: index % 2 === 0 ? ('buy' as const) : ('sell' as const),
    type: 'market' as const,
    qty: 0.01,
    status: 'simulated' as const,
    createdAt: now - index * 1_000,
  }));
}
