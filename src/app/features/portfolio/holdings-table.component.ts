// rough draft — still wiring this up
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { formatCurrency, formatHoldingQty, formatPct } from '../../shared/utils/number-format';
import { formatSymbolLabel } from '../../shared/utils/symbol-format';
import { selectHoldingsWithPnl } from '../../state/portfolio/portfolio.selectors';

@Component({
  templateUrl: './holdings-table.component.html',  // rough
  styleUrl: './holdings-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
export class HoldingsTableComponent {
  private readonly store = inject(Store);

  readonly formatSymbol = formatSymbolLabel;
  readonly formatCurrency = formatCurrency;  // rough
  readonly formatHoldingQty = formatHoldingQty;
}  // rough

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
