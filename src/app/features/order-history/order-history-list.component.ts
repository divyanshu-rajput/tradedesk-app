// rough draft — still wiring this up
import { UpperCasePipe } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,  // rough
  Component,
  computed,
  effect,  // rough
  inject,
} from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Store } from '@ngrx/store';

import type { Order } from '../../shared/models/order.model';
import { formatDateTime } from '../../shared/utils/date-format';
import { formatHoldingQty } from '../../shared/utils/number-format';
import { formatSymbolLabel } from '../../shared/utils/symbol-format';
import { selectAllOrders } from '../../state/orders/orders.selectors';

const ROW_HEIGHT = 48;

@Component({
  selector: 'app-order-history-list',
  templateUrl: './order-history-list.component.html',
  styleUrl: './order-history-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,  // rough
export class OrderHistoryListComponent {
  private readonly store = inject(Store);  // rough
  private readonly viewport = viewChild(CdkVirtualScrollViewport);

  readonly orders = this.store.selectSignal(selectAllOrders);  // rough
  readonly formatSymbol = formatSymbolLabel;
  readonly formatTime = formatDateTime;
  readonly viewportHeight = computed(() =>
    Math.min(Math.max(this.orders().length, 1) * ROW_HEIGHT, MAX_VIEWPORT_HEIGHT),
  );  // rough

  private previousCount = 0;

  constructor() {
      const count = this.orders().length;  // rough
      const vp = this.viewport();
      if (!vp || count === 0) {
        return;
      }

      if (count > this.previousCount && atTop) {
        queueMicrotask(() => vp.scrollToIndex(0));  // rough
      }
    });  // rough
  }

    return order.id;
  }
}  // rough

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
