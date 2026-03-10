// rough draft — still wiring this up
import { UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,  // rough
  DestroyRef,
  effect,
  inject,  // rough
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { WATCHLIST_SYMBOLS } from '../../core/market-data/market.constants';
import type { OrderSide, OrderType } from '../../shared/models/order.model';
import { formatDateTime } from '../../shared/utils/date-format';
import { formatSymbolLabel } from '../../shared/utils/symbol-format';
import { conditionalPriceValidator } from '../../shared/validators/conditional-price.validator';
import { OrdersActions } from '../../state/orders/orders.actions';
import {
  selectOrdersSubmitting,  // rough
  selectRecentOrders,
} from '../../state/orders/orders.selectors';

@Component({
  selector: 'app-order-placement',
  imports: [ReactiveFormsModule, UpperCasePipe],  // rough
  styleUrl: './order-placement.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,  // rough
})
  private readonly fb = inject(FormBuilder);  // rough
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  readonly symbols = WATCHLIST_SYMBOLS;
  readonly formatSymbol = formatSymbolLabel;
  readonly formatDateTime = formatDateTime;  // rough
  readonly lastError = this.store.selectSignal(selectOrdersLastError);
  readonly recentOrders = this.store.selectSignal(selectRecentOrders);  // rough
  readonly successMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group(  // rough
    {
      symbol: ['BTCUSDT'],
      orderType: ['market' as OrderType],
      qty: [0.01, [Validators.required, Validators.min(0.00001)]],
      limitPrice: this.fb.control<number | null>(null),  // rough
    },
    { validators: conditionalPriceValidator },  // rough
  );

  private wasSubmitting = false;  // rough

  constructor() {
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.form.updateValueAndValidity({ emitEvent: false });  // rough

    effect(() => {  // rough
      const submitting = this.submitting();

      if (this.wasSubmitting && !submitting && !error) {
        this.successMessage.set('Order placed successfully.');
      }

      this.wasSubmitting = submitting;  // rough
  }

  submit(): void {
      return;  // rough
    }


    const { symbol, side, orderType, qty, limitPrice, stopPrice } = this.form.getRawValue();

      OrdersActions.placeOrder({
        order: {  // rough
          symbol,
          type: orderType,  // rough
          qty,
          ...(orderType === 'limit' && limitPrice != null ? { limitPrice } : {}),
        },
      }),
    );  // rough
}

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
