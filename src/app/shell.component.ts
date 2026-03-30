import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { AuthStatusComponent } from './shared/components/auth-status.component';
import { MarketActions } from './state/market/market.actions';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AuthStatusComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ShellComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.store.dispatch(MarketActions.connect());

    this.destroyRef.onDestroy(() => {
      this.store.dispatch(MarketActions.disconnect());
    });
  }
}
