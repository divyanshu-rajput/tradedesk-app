import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';

import { PriceFlashDirective } from '../../shared/directives/price-flash.directive';
import { formatOptionalPrice } from '../../shared/utils/number-format';
import { formatSymbolLabel } from '../../shared/utils/symbol-format';
import type { SymbolTick } from '../../state/market/market.reducer';
import { selectSymbolData } from '../../state/market/market.selectors';

@Component({
  selector: 'app-watchlist-row',
  imports: [PriceFlashDirective],
  templateUrl: './watchlist-row.component.html',
  styleUrl: './watchlist-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'display: contents',
  },
})
export class WatchlistRowComponent {
  private readonly store = inject(Store);

  readonly symbol = input.required<string>();
  readonly displaySymbol = (): string => formatSymbolLabel(this.symbol());
  readonly tick = toSignal(
    toObservable(this.symbol).pipe(switchMap((sym) => this.store.select(selectSymbolData(sym)))),
    { initialValue: undefined as SymbolTick | undefined },
  );
  readonly formatPrice = formatOptionalPrice;

  formatChange(changePct: number | undefined): string {
    if (changePct == null) {
      return '—';
    }
    const sign = changePct >= 0 ? '+' : '';
    return `${sign}${changePct.toFixed(2)}%`;
  }

  formatVolume(volume: number | undefined): string {
    if (volume == null) {
      return '—';
    }
    if (volume >= 1_000_000) {
      return `${(volume / 1_000_000).toFixed(2)}M`;
    }
    if (volume >= 1_000) {
      return `${(volume / 1_000).toFixed(1)}K`;
    }
    return volume.toFixed(0);
  }
}
