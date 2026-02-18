import type { Holding } from '../../shared/models/holding.model';

export interface PortfolioSnapshotDoc {
  cash: number;
  holdings: Holding[];
  updatedAt: number;
}
