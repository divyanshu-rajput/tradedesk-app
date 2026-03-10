import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';

import { WATCHLIST_SYMBOLS } from '../../core/market-data/market.constants';
import { formatSymbolLabel } from '../../shared/utils/symbol-format';
import { formatPrice, formatQty } from '../../shared/utils/number-format';
import { MarketActions } from '../../state/market/market.actions';
import { selectDepthForSymbol, selectSelectedSymbol } from '../../state/market/market.selectors';

@Component({
  selector: 'app-order-book',
  imports: [ReactiveFormsModule],
  templateUrl: './order-book.component.html',
  styleUrl: './order-book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrderBookComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  readonly symbols = WATCHLIST_SYMBOLS;
  readonly formatSymbol = formatSymbolLabel;
  readonly formatPrice = formatPrice;
  readonly formatQty = formatQty;
  readonly symbolControl = this.fb.nonNullable.control('BTCUSDT');

  readonly selectedSymbol = this.store.selectSignal(selectSelectedSymbol);
  readonly depth = toSignal(
    toObservable(this.selectedSymbol).pipe(
      switchMap((symbol) => this.store.select(selectDepthForSymbol(symbol))),
    ),
    { initialValue: undefined },
  );

  readonly spread = computed(() => {
    const book = this.depth();
    const bestBid = book?.bids?.[0]?.[0];
    const bestAsk = book?.asks?.[0]?.[0];
    if (bestBid == null || bestAsk == null) {
      return null;
    }

    const amount = bestAsk - bestBid;
    return {
      amount,
      pct: (amount / bestAsk) * 100,
    };
  });

  ngOnInit(): void {
    this.symbolControl.setValue(this.selectedSymbol(), { emitEvent: false });
    this.store.dispatch(MarketActions.connectDepth());

    this.symbolControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((symbol) => {
        this.store.dispatch(MarketActions.symbolSelected({ symbol }));
      });

    this.destroyRef.onDestroy(() => {
      this.store.dispatch(MarketActions.disconnectDepth());
    });
  }
}
