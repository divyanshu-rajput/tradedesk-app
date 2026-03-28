import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';

import { WATCHLIST_SYMBOLS } from '../../core/market-data/market.constants';
import { formatSymbolLabel } from '../../shared/utils/symbol-format';
import { MarketActions } from '../../state/market/market.actions';
import {
  selectPriceHistoryForSymbol,
  selectSelectedSymbol,
} from '../../state/market/market.selectors';
import { PriceLineChartComponent } from './price-line-chart.component';

@Component({
  selector: 'app-charts',
  imports: [ReactiveFormsModule, PriceLineChartComponent],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChartsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  readonly symbols = WATCHLIST_SYMBOLS;
  readonly formatSymbol = formatSymbolLabel;
  readonly symbolControl = this.fb.nonNullable.control('BTCUSDT');
  readonly selectedSymbol = this.store.selectSignal(selectSelectedSymbol);
  readonly priceHistory = toSignal(
    toObservable(this.selectedSymbol).pipe(
      switchMap((symbol) => this.store.select(selectPriceHistoryForSymbol(symbol))),
    ),
    { initialValue: [] as number[] },
  );

  ngOnInit(): void {
    this.symbolControl.setValue(this.selectedSymbol(), { emitEvent: false });

    this.symbolControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((symbol) => {
        this.store.dispatch(MarketActions.symbolSelected({ symbol }));
      });
  }
}
