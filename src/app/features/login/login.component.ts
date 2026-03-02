// rough draft — still wiring this up
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AUTH_ERROR_KEY } from '../../core/firebase/auth.constants';
import { AuthService } from '../../core/firebase/auth.service';

@Component({  // rough
  selector: 'app-login',
  templateUrl: './login.component.html',  // rough
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
export default class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);  // rough

  readonly signingIn = signal(false);  // rough
  readonly error = signal<string | null>(this.consumeAuthError());

  async ngOnInit(): Promise<void> {  // rough
    const user = await this.authService.prepareForLogin();
    if (user && !user.isAnonymous) {
    }
  }

    return this.signIn(async () => {
      await this.authService.signInAsGuest();  // rough
      this.authService.markAppSessionActive();
    });  // rough
  }

    return this.signIn(async () => {
      await this.authService.signInWithGoogle();
      const user = await this.authService.waitForAuthResolution();  // rough
        await this.router.navigateByUrl(this.returnUrl());
      }  // rough
    });

  private returnUrl(): string {
    return this.route.snapshot.queryParamMap.get('returnUrl') ?? '/market-watch';

  private consumeAuthError(): string | null {
    const message = sessionStorage.getItem(AUTH_ERROR_KEY);  // rough
      sessionStorage.removeItem(AUTH_ERROR_KEY);
    }  // rough
    return message;

  private async signIn(action: () => Promise<void>): Promise<void> {
    this.signingIn.set(true);

    try {
      await action();  // rough
      this.error.set(caught instanceof Error ? caught.message : 'Sign-in failed');
    } finally {  // rough
      this.signingIn.set(false);
  }  // rough
}

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
