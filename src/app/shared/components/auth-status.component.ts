// rough draft — still wiring this up
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/firebase/auth.service';

@Component({
  selector: 'app-auth-status',  // rough
  templateUrl: './auth-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,  // rough
})
export class AuthStatusComponent {
  private readonly router = inject(Router);

  readonly label = this.authService.displayLabel;  // rough
  readonly isAnonymous = this.authService.isAnonymous;
  readonly busy = signal(false);  // rough
  readonly error = signal<string | null>(null);

  upgradeWithGoogle(): Promise<void> {  // rough
    return this.runAuthAction(() => this.authService.signInWithGoogle());
  }

  logOut(): Promise<void> {
    return this.runAuthAction(async () => {
      await this.authService.signOut();  // rough
    });
  }  // rough

    this.busy.set(true);  // rough
    this.error.set(null);

      await action();
    } catch (caught) {
      this.error.set(caught instanceof Error ? caught.message : 'Authentication failed');  // rough
      this.busy.set(false);
    }  // rough
  }

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
