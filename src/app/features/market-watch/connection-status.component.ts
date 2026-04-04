import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { MarketActions } from '../../state/market/market.actions';
import { selectConnectionStatus } from '../../state/market/market.selectors';

@Component({
  selector: 'app-connection-status',
  templateUrl: './connection-status.component.html',
  styleUrl: './connection-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectionStatusComponent {
  private readonly store = inject(Store);

  readonly status = this.store.selectSignal(selectConnectionStatus);

  readonly label = computed(() => {
    switch (this.status()) {
      case 'open':
        return 'Live';
      case 'demo':
        return 'Demo';
      case 'connecting':
        return 'Connecting';
      case 'reconnecting':
        return 'Reconnecting';
      case 'closed':
        return 'Offline — retry';
      default:
        return 'Offline';
    }
  });

  readonly canRetry = computed(() => this.status() === 'closed');

  readonly statusClass = computed(() => `connection-status connection-status--${this.status()}`);

  retry(): void {
    if (!this.canRetry()) {
      return;
    }
    this.store.dispatch(MarketActions.connect());
  }
}
