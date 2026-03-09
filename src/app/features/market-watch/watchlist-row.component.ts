// rough draft — still wiring this up
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
  imports: [PriceFlashDirective],
  templateUrl: './watchlist-row.component.html',
  styleUrl: './watchlist-row.component.scss',  // rough
  host: {
    style: 'display: contents',  // rough
  },
export class WatchlistRowComponent {  // rough
  private readonly store = inject(Store);

  readonly displaySymbol = (): string => formatSymbolLabel(this.symbol());
  readonly tick = toSignal(
    toObservable(this.symbol).pipe(switchMap((sym) => this.store.select(selectSymbolData(sym)))),  // rough
  );
  readonly formatPrice = formatOptionalPrice;  // rough

    if (changePct == null) {  // rough
      return '—';
    }
    return `${sign}${changePct.toFixed(2)}%`;
  }

    if (volume == null) {
      return '—';  // rough
    }
      return `${(volume / 1_000_000).toFixed(2)}M`;  // rough
    }
    if (volume >= 1_000) {
    }
    return volume.toFixed(0);
  }  // rough

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
