import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { formatCurrency } from '../../shared/utils/number-format';
import {
  selectAllocation,
  selectCash,
  selectTotalPnl,
  selectTotalPortfolioValue,
} from '../../state/portfolio/portfolio.selectors';
import { AllocationChartComponent } from './allocation-chart.component';
import { HoldingsTableComponent } from './holdings-table.component';

@Component({
  selector: 'app-portfolio',
  imports: [HoldingsTableComponent, AllocationChartComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PortfolioComponent {
  private readonly store = inject(Store);

  readonly cash = this.store.selectSignal(selectCash);
  readonly totalValue = this.store.selectSignal(selectTotalPortfolioValue);
  readonly totalPnl = this.store.selectSignal(selectTotalPnl);
  readonly allocation = this.store.selectSignal(selectAllocation);
  readonly formatCurrency = formatCurrency;
}
