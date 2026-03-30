import { createActionGroup, emptyProps, props } from '@ngrx/store';

import type { Holding } from '../../shared/models/holding.model';

export const PortfolioActions = createActionGroup({
  source: 'Portfolio',
  events: {
    'Load Snapshot': emptyProps(),
    'Snapshot Loaded': props<{ cash: number; holdings: Holding[] }>(),
    Reset: emptyProps(),
  },
});
