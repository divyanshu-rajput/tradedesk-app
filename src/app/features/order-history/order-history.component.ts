import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectOrderCount } from '../../state/orders/orders.selectors';
import { OrderHistoryListComponent } from './order-history-list.component';

@Component({
  selector: 'app-order-history',
  imports: [OrderHistoryListComponent],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrderHistoryComponent {
  private readonly store = inject(Store);

  readonly orderCount = this.store.selectSignal(selectOrderCount);
}
