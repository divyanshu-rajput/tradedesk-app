import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { WATCHLIST_SYMBOLS } from '../../core/market-data/market.constants';
import { MarketActions } from '../../state/market/market.actions';
import { ConnectionStatusComponent } from './connection-status.component';
import { WatchlistTableComponent } from './watchlist-table.component';

@Component({
  selector: 'app-market-watch',
  imports: [ConnectionStatusComponent, WatchlistTableComponent],
  templateUrl: './market-watch.component.html',
  styleUrl: './market-watch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MarketWatchComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  readonly symbolCount = WATCHLIST_SYMBOLS.length;

  ngOnInit(): void {
    this.store.dispatch(MarketActions.connect());

    this.destroyRef.onDestroy(() => {
      this.store.dispatch(MarketActions.disconnect());
    });
  }
}
