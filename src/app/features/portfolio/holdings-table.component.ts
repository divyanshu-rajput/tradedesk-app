import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  formatCurrency,
  formatHoldingQty,
  formatPct,
  formatPrice,
} from '../../shared/utils/number-format';
import { formatSymbolLabel } from '../../shared/utils/symbol-format';
import { selectHoldingsWithPnl } from '../../state/portfolio/portfolio.selectors';

@Component({
  selector: 'app-holdings-table',
  templateUrl: './holdings-table.component.html',
  styleUrl: './holdings-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HoldingsTableComponent {
  private readonly store = inject(Store);

  readonly holdings = this.store.selectSignal(selectHoldingsWithPnl);
  readonly formatSymbol = formatSymbolLabel;
  readonly formatCurrency = formatCurrency;
  readonly formatPrice = formatPrice;
  readonly formatHoldingQty = formatHoldingQty;
  readonly formatPct = formatPct;
}
