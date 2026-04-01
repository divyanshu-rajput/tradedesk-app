import { UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
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
  selectOrdersLastError,
  selectOrdersSubmitting,
  selectRecentOrders,
} from '../../state/orders/orders.selectors';

@Component({
  selector: 'app-order-placement',
  imports: [ReactiveFormsModule, UpperCasePipe],
  templateUrl: './order-placement.component.html',
  styleUrl: './order-placement.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrderPlacementComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  readonly symbols = WATCHLIST_SYMBOLS;
  readonly formatSymbol = formatSymbolLabel;
  readonly formatDateTime = formatDateTime;
  readonly submitting = this.store.selectSignal(selectOrdersSubmitting);
  readonly lastError = this.store.selectSignal(selectOrdersLastError);
  readonly recentOrders = this.store.selectSignal(selectRecentOrders);
  readonly successMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group(
    {
      symbol: ['BTCUSDT'],
      side: ['buy' as OrderSide],
      orderType: ['market' as OrderType],
      qty: [0.01, [Validators.required, Validators.min(0.00001)]],
      limitPrice: this.fb.control<number | null>(null),
      stopPrice: this.fb.control<number | null>(null),
    },
    { validators: conditionalPriceValidator },
  );

  private wasSubmitting = false;
  private successTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.clearSuccessTimeout());

    this.form.controls.orderType.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.form.updateValueAndValidity({ emitEvent: false });
      });

    effect(() => {
      const submitting = this.submitting();
      const error = this.lastError();

      if (this.wasSubmitting && !submitting && !error) {
        this.successMessage.set('Order placed successfully.');
        this.clearSuccessTimeout();
        this.successTimeoutId = setTimeout(() => this.successMessage.set(null), 4_000);
      }

      this.wasSubmitting = submitting;
    });
  }

  toIso(ms: number): string {
    return new Date(ms).toISOString();
  }

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      return;
    }

    this.successMessage.set(null);

    const { symbol, side, orderType, qty, limitPrice, stopPrice } = this.form.getRawValue();

    this.store.dispatch(
      OrdersActions.placeOrder({
        order: {
          symbol,
          side,
          type: orderType,
          qty,
          ...(orderType === 'limit' && limitPrice != null ? { limitPrice } : {}),
          ...(orderType === 'stop-loss' && stopPrice != null ? { stopPrice } : {}),
        },
      }),
    );
  }

  private clearSuccessTimeout(): void {
    if (this.successTimeoutId != null) {
      clearTimeout(this.successTimeoutId);
      this.successTimeoutId = null;
    }
  }
}
