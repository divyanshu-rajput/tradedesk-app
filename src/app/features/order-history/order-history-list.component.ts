import { UpperCasePipe } from '@angular/common';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';

import type { Order } from '../../shared/models/order.model';
import { formatDateTime } from '../../shared/utils/date-format';
import { formatHoldingQty } from '../../shared/utils/number-format';
import { formatSymbolLabel } from '../../shared/utils/symbol-format';
import { selectAllOrders } from '../../state/orders/orders.selectors';

const ROW_HEIGHT = 48;
const MAX_VIEWPORT_HEIGHT = 448;

@Component({
  selector: 'app-order-history-list',
  imports: [ScrollingModule, UpperCasePipe],
  templateUrl: './order-history-list.component.html',
  styleUrl: './order-history-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderHistoryListComponent {
  private readonly store = inject(Store);
  private readonly viewport = viewChild(CdkVirtualScrollViewport);

  readonly orders = this.store.selectSignal(selectAllOrders);
  readonly formatSymbol = formatSymbolLabel;
  readonly formatTime = formatDateTime;
  readonly formatQty = formatHoldingQty;
  readonly viewportHeight = computed(() =>
    Math.min(Math.max(this.orders().length, 1) * ROW_HEIGHT, MAX_VIEWPORT_HEIGHT),
  );

  private previousCount = 0;

  constructor() {
    effect(() => {
      const count = this.orders().length;
      const vp = this.viewport();
      if (!vp || count === 0) {
        this.previousCount = count;
        return;
      }

      const atTop = vp.measureScrollOffset('top') < 4;
      if (count > this.previousCount && atTop) {
        queueMicrotask(() => vp.scrollToIndex(0));
      }
      this.previousCount = count;
    });
  }

  toIso(ms: number): string {
    return new Date(ms).toISOString();
  }

  trackById(_index: number, order: Order): string {
    return order.id;
  }
}
