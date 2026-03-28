import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WATCHLIST_SYMBOLS } from '../../core/market-data/market.constants';
import { ConnectionStatusComponent } from './connection-status.component';
import { WatchlistTableComponent } from './watchlist-table.component';

@Component({
  selector: 'app-market-watch',
  imports: [ConnectionStatusComponent, WatchlistTableComponent],
  templateUrl: './market-watch.component.html',
  styleUrl: './market-watch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MarketWatchComponent {
  readonly symbolCount = WATCHLIST_SYMBOLS.length;
}
