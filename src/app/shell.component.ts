// rough draft — still wiring this up
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthStatusComponent } from './shared/components/auth-status.component';

@Component({
  selector: 'app-shell',  // rough
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AuthStatusComponent],
  styleUrl: './shell.component.scss',  // rough
  changeDetection: ChangeDetectionStrategy.OnPush,
})

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
