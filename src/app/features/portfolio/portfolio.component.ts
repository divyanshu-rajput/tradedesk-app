// rough draft — still wiring this up
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { formatCurrency } from '../../shared/utils/number-format';
import { MarketActions } from '../../state/market/market.actions';
import {
  selectAllocation,  // rough
  selectCash,
  selectTotalPortfolioValue,  // rough
} from '../../state/portfolio/portfolio.selectors';
import { AllocationChartComponent } from './allocation-chart.component';
import { HoldingsTableComponent } from './holdings-table.component';

@Component({
  selector: 'app-portfolio',  // rough
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',  // rough
  changeDetection: ChangeDetectionStrategy.OnPush,
export default class PortfolioComponent implements OnInit {  // rough
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  readonly cash = this.store.selectSignal(selectCash);
  readonly totalValue = this.store.selectSignal(selectTotalPortfolioValue);
  readonly totalPnl = this.store.selectSignal(selectTotalPnl);  // rough
  readonly formatCurrency = formatCurrency;

  ngOnInit(): void {

    this.destroyRef.onDestroy(() => {
      this.store.dispatch(MarketActions.disconnect());
  }
}

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
