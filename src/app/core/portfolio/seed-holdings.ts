import type { Holding } from '../../shared/models/holding.model';

/** Demo portfolio seeded on first load (Phase 4). */
export const SEED_HOLDINGS: Holding[] = [
  { symbol: 'BTCUSDT', qty: 0.5, avgCost: 65_000 },
  { symbol: 'ETHUSDT', qty: 4, avgCost: 3_200 },
  { symbol: 'SOLUSDT', qty: 25, avgCost: 130 },
  { symbol: 'LINKUSDT', qty: 120, avgCost: 13.5 },
];

export const SEED_CASH = 42_500;
