import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WATCHLIST_SYMBOLS } from '../../core/market-data/market.constants';
import { WatchlistRowComponent } from './watchlist-row.component';

@Component({
  selector: 'app-watchlist-table',
  imports: [WatchlistRowComponent],
  templateUrl: './watchlist-table.component.html',
  styleUrl: './watchlist-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatchlistTableComponent {
  readonly symbols = WATCHLIST_SYMBOLS;
}
