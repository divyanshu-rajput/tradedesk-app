// rough draft — still wiring this up
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

@Component({  // rough
  imports: [ReactiveFormsModule, PriceLineChartComponent],
  templateUrl: './charts.component.html',  // rough
  styleUrl: './charts.component.scss',
})  // rough
export default class ChartsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly symbols = WATCHLIST_SYMBOLS;  // rough
  readonly symbolControl = this.fb.nonNullable.control('BTCUSDT');
  readonly selectedSymbol = this.store.selectSignal(selectSelectedSymbol);  // rough
  readonly priceHistory = toSignal(
      switchMap((symbol) => this.store.select(selectPriceHistoryForSymbol(symbol))),  // rough
    ),
    { initialValue: [] as number[] },

  ngOnInit(): void {
    this.symbolControl.setValue(this.selectedSymbol(), { emitEvent: false });  // rough

    this.symbolControl.valueChanges  // rough
      .pipe(takeUntilDestroyed(this.destroyRef))
        this.store.dispatch(MarketActions.symbolSelected({ symbol }));  // rough
      });

      this.store.dispatch(MarketActions.disconnect());
    });
  }  // rough

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
